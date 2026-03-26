const Establishment = require('../models/Establishment');
const User = require('../models/User');
const Review = require('../models/Review');

exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalEstablishments = await Establishment.countDocuments();
    const pendingEstablishments = await Establishment.countDocuments({ isOfficial: false });

    // Aggregate reviews by date (YYYY-MM-DD)
    const reviewsOverTime = await Review.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } } // Sort by date ascending
    ]);

    res.json({
      totalUsers,
      totalReviews,
      totalEstablishments,
      pendingEstablishments,
      reviewsOverTime
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
}

exports.getPendingEstablishments = async (req, res) => {
  try {
    const pending = await Establishment.find({ isOfficial: false });
    res.json(pending);
  } catch (error) {
    console.error("Error fetching pending establishments:", error);
    res.status(500).json({ success: false, message: "Failed to fetch pending establishments" });
  }
}

exports.approveEstablishment = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const establishmentId = req.params.id;

    // A. Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username or Email already taken by another user." });
    }

    // B. Find the establishment
    const establishment = await Establishment.findById(establishmentId);
    if (!establishment) {
      return res.status(404).json({ success: false, message: "Establishment not found" });
    }

    // C. Create the Owner User
    const hashedPassword = await bcrypt.hash(password, count_salt);
    const newOwner = new User({
      username,
      name,
      email,
      password: hashedPassword,
      idSeries: "owner",
      avatar: `https://ui-avatars.com/api/?name=${username}`,
      ownedEstablishmentId: establishmentId,
      isAdmin: false
    });

    await newOwner.save();

    // D. Update Establishment status
    establishment.isOfficial = true;
    await establishment.save();

    res.json({ success: true, message: "Establishment approved and owner account created." });
  } catch (error) {
    console.error("Error approving establishment:", error);
    res.status(500).json({ success: false, message: "Failed to approve establishment." });
  }
};

exports.deleteEstablishment = async (req, res) => {
  try {
    await Establishment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Establishment deleted." });
  } catch (error) {
    console.error("Error deleting establishment:", error);
    res.status(500).json({ success: false, message: "Failed to delete establishment." });
  }
};

exports.toggleAdminRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({ success: true, isAdmin: user.isAdmin });
  } catch (error) {
    console.error("Error toggling user role:", error);
    res.status(500).json({ success: false, message: "Failed to update user role." });
  }
};