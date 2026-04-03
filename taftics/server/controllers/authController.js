const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.login = async (req, res) => {
  const loginIdentifier = req.body.username || req.body.email;
  const password = req.body.password;

  if (!loginIdentifier || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide credentials" });
  }

  try {
    // 1. Find the user and calculate their stats dynamically using aggregation
    const users = await User.aggregate([
      {
        // Match by EITHER username OR email
        $match: {
          $or: [{ username: loginIdentifier }, { email: loginIdentifier }],
        },
      },
      {
        // Join with the reviews collection to find all reviews by this user
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "userId",
          as: "userReviews",
        },
      },
      {
        // Calculate the dynamic stats based on the joined reviews
        $addFields: {
          contributions: { $size: "$userReviews" },
          helpfulCount: {
            $reduce: {
              input: "$userReviews",
              initialValue: 0,
              in: {
                $add: [
                  "$$value",
                  { $size: { $ifNull: ["$$this.helpfulVoters", []] } },
                ],
              },
            },
          },
        },
      },
    ]);

    // Since aggregation returns an array, grab the first (and only) matched user
    const user = users[0];

    match = await bcrypt.compare(password, user.password);
    // 2. Check if user exists AND password matches
    if (!user || !match) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid username/email or password",
        });
    }

    // 3. Success! Send the user data back to React (omitting the password!)
    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        idSeries: user.idSeries,
        bio: user.bio,
        followers: user.followers,
        helpfulCount: user.helpfulCount,
        contributions: user.contributions,
        avatar: user.avatar,
        ownedEstablishmentId: user.ownedEstablishmentId,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during login" });
  }
};

var count_salt = 10;

exports.register = async (req, res) => {
  try {
    // With FormData, text fields are in req.body
    const { username, name, email, password, dlsuId } = req.body;

    // 1. Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username or Email already taken." });
    }

    // 2. Handle the Avatar File Upload
    let avatarUrl = "https://ui-avatars.com/api/?name=" + username; // Default avatar

    if (req.file) {
      avatarUrl = req.file.path;
    }

    const salt_rounds = count_salt;
    // 3. Create and save the new user
    const newUser = new User({
      username,
      name,
      email,
      password: await bcrypt.hash(password, salt_rounds),
      idSeries: dlsuId,
      avatar: avatarUrl,
      isAdmin: false,
    });

    await newUser.save();

    // 4. Send success response and auto-login the user
    res.status(201).json({
      success: true,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        idSeries: newUser.idSeries,
        avatar: newUser.avatar,
        ownedEstablishmentId: newUser.ownedEstablishmentId,
        isAdmin: newUser.isAdmin,
        helpfulCount: 0,
        contributions: 0,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during registration." });
  }
};
