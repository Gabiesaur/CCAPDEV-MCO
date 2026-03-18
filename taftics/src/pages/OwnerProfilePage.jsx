import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Settings, Store, BarChart3, Edit, Trash2, ExternalLink, CheckCircle2 } from "lucide-react";
import ProfileHeader from "../components/profile/ProfileHeader";
import ImageUploadModal from "../components/profile/ImageUploadModal";
import { REVIEWS, COMMENTS, USERS, ESTABLISHMENTS } from "../data/mockData";

export default function OwnerProfilePage({ user, setUser }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingStore, setIsEditingStore] = useState(false);
  
  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Fetch real mock establishment from the mock DB
  const mockEstablishment = ESTABLISHMENTS.find(e => 
      String(e.id) === String(user.ownedEstablishmentId) || e._id?.$oid === user.ownedEstablishmentId
  ) || ESTABLISHMENTS[2]; 

  const [storeForm, setStoreForm] = useState({
    name: mockEstablishment.name,
    category: mockEstablishment.category,
    startTime: "07:00",
    endTime: "19:00"
  });

  const handleSaveStore = () => {
    // In a real app, you would make an API call here.
    triggerToast("Establishment details updated!");
    setIsEditingStore(false);
  };

  // Fetch reviews for this establishment
  const establishmentReviews = REVIEWS.filter(r => 
      String(r.establishmentId) === String(mockEstablishment.id) || 
      (r.establishmentId?.$oid && r.establishmentId.$oid === mockEstablishment._id?.$oid)
  );

  // Map them into the shape the UI expects
  const mockReviews = establishmentReviews.map(rev => {
    const reviewer = USERS.find(u => String(u.id) === String(rev.userId) || u._id?.$oid === rev.userId?.$oid);
    // Find if there's an owner reply in COMMENTS (comment by the establishment owner)
    const ownerReply = COMMENTS.find(c => String(c.reviewId) === String(rev.id) && String(c.userId) === String(user.id));

    return {
      id: rev.id,
      rating: rev.rating,
      date: typeof rev.date === "string" ? rev.date.split("T")[0] : "Recently",
      title: rev.title,
      body: rev.comment,
      user: { name: reviewer?.name || "Unknown User" },
      hasOwnerReply: !!ownerReply,
      ownerReplyText: ownerReply?.text || "",
    };
  }).sort((a, b) => (a.hasOwnerReply === b.hasOwnerReply ? 0 : a.hasOwnerReply ? 1 : -1));

  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      className={`btn btn-sm d-flex align-items-center gap-2 fw-bold px-4 py-2 ${
        activeTab === id
          ? "bg-dlsu-light text-dlsu-dark border-0"
          : "btn-light border text-muted"
      }`}
      onClick={() => setActiveTab(id)}
    >
      <Icon size={16} /> {label}
    </button>
  );

  return (
    <div className="min-vh-100 pb-5 bg-light position-relative">
      <ProfileHeader
        name={user.name}
        username={user.username}
        avatar={user.avatar}
        isOwnProfile={true}
        onCameraClick={() => setIsModalOpen(true)}
      />

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={user._id || user.id} // Ensure we have the ID for the backend string matching
        onUploadSuccess={(updatedUser) => {
          // Update global state and persist
          if (setUser) {
            setUser(updatedUser);
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
          }
          setIsModalOpen(false);
          triggerToast("Establishment profile picture updated!");
        }}
      />

      {showToast && (
        <div className="toast-success-custom fw-bold" style={{ zIndex: 9999 }}>
          <CheckCircle2 size={24} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="container mt-4">
        <div className="row g-4">
          {/* LEFT SIDEBAR: Owner Summary */}
          <div className="col-lg-3">
            <div className="custom-card p-4 sidebar-sticky text-center">
              <div 
                className="badge p-2 px-3 rounded-pill bg-dlsu-light text-dlsu-dark border fw-bold mb-3 shadow-sm" 
                style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
              >
                Establishment Owner
              </div>
              <h6 className="fw-bold mb-1">{user.name}</h6>
              <p className="small text-muted mb-4 opacity-75">
                Managing: <strong className="text-dlsu-dark">{mockEstablishment.name}</strong>
              </p>

              <hr className="opacity-10 mb-4" />

              <Link to={`/establishment/${mockEstablishment.id}`} className="btn btn-dark w-100 d-flex justify-content-center align-items-center gap-2 text-decoration-none">
                <ExternalLink size={16} /> View Establishment
              </Link>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="col-lg-9">
            {/* Tabs */}
            <div className="d-flex flex-wrap gap-2 mb-4 p-2 bg-white rounded-4 shadow-sm border">
              <TabButton id="dashboard" icon={BarChart3} label="Analytics" />
              <TabButton id="manage" icon={Store} label="Manage Store" />
              <TabButton id="inbox" icon={Star} label={`Reviews Inbox (${mockReviews.filter(r => !r.hasOwnerReply).length})`} />
            </div>

            {/* CONTENT: DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="custom-card p-4 text-center h-100 d-flex flex-column justify-content-center">
                    <h1 className="fw-bold text-dlsu-dark mb-1" style={{ fontSize: "3rem" }}>
                      {mockEstablishment.rating}
                    </h1>
                    <p className="text-muted fw-bold mb-0">Average Rating</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="custom-card p-4 text-center h-100 d-flex flex-column justify-content-center">
                    <h1 className="fw-bold text-dlsu-dark mb-1" style={{ fontSize: "3rem" }}>
                      {mockEstablishment.reviewCount}
                    </h1>
                    <p className="text-muted fw-bold mb-0">Total Reviews</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="custom-card p-4 text-center h-100 d-flex flex-column justify-content-center bg-dlsu-light border border-success">
                    <h1 className="fw-bold text-dlsu-dark mb-1" style={{ fontSize: "3rem" }}>
                      {mockReviews.filter(r => !r.hasOwnerReply).length}
                    </h1>
                    <p className="text-success fw-bold mb-0">Unanswered Reviews</p>
                  </div>
                </div>
              </div>
            )}

            {/* CONTENT: MANAGE STORE */}
            {activeTab === "manage" && (
              <div className="custom-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                  <div>
                    <h5 className="fw-bold mb-0">Manage Store</h5>
                    <small className="text-muted">Keep your business details up to date.</small>
                  </div>
                </div>

                <form>
                  <div className="row g-3 mb-4">
                    {/* Establishment Name takes up the whole row */}
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Establishment Name</label>
                      {isEditingStore ? (
                        <input 
                          type="text" 
                          className="form-control fw-bold" 
                          value={storeForm.name} 
                          onChange={(e) => setStoreForm({...storeForm, name: e.target.value})} 
                        />
                      ) : (
                        <div className="form-control bg-light fw-bold text-muted border-0 py-2">{mockEstablishment.name}</div>
                      )}
                    </div>
                    
                    {/* Category Dropdown */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Category</label>
                      {isEditingStore ? (
                        <select 
                          className="form-select" 
                          value={storeForm.category}
                          onChange={(e) => setStoreForm({...storeForm, category: e.target.value})}
                        >
                          <option value="Food">Food</option>
                          <option value="Coffee">Coffee</option>
                          <option value="Laundry">Laundry</option>
                          <option value="Fitness">Fitness</option>
                          <option value="School Supplies">School Supplies</option>
                          <option value="Dorms/Condos">Dorms/Condos</option>
                        </select>
                      ) : (
                        <div className="form-control bg-light text-muted border-0 py-2">{mockEstablishment.category}</div>
                      )}
                    </div>

                    {/* Business Hours Time Selector */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Business Hours</label>
                      {isEditingStore ? (
                        <div className="d-flex align-items-center gap-2">
                           <input 
                             type="time" 
                             className="form-control text-center px-1" 
                             value={storeForm.startTime}
                             onChange={(e) => setStoreForm({...storeForm, startTime: e.target.value})}
                           />
                           <span className="small fw-bold text-muted">to</span>
                           <input 
                             type="time" 
                             className="form-control text-center px-1" 
                             value={storeForm.endTime}
                             onChange={(e) => setStoreForm({...storeForm, endTime: e.target.value})}
                           />
                        </div>
                      ) : (
                        <div className="form-control bg-light text-muted border-0 py-2">{mockEstablishment.businessHours}</div>
                      )}
                    </div>
                  </div>

                  {isEditingStore ? (
                    <div className="d-flex gap-3 pt-3 border-top mt-4">
                      <button type="button" className="btn btn-dlsu-dark fw-bold px-4 rounded-pill" onClick={handleSaveStore}>
                        Save Changes
                      </button>
                      <button type="button" className="btn btn-light fw-bold px-4 rounded-pill border" onClick={() => setIsEditingStore(false)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex flex-wrap gap-2 pt-3 border-top mt-4">
                      <button type="button" className="btn btn-dlsu-dark fw-bold px-4 rounded-pill flex-grow-1" onClick={() => setIsEditingStore(true)}>
                        <Edit size={16} className="me-2" /> Edit Details
                      </button>
                      <button type="button" className="btn btn-outline-danger fw-bold px-4 rounded-pill flex-grow-1">
                        <Trash2 size={16} className="me-2" /> Request Deletion
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* CONTENT: REVIEWS INBOX */}
            {activeTab === "inbox" && (
              <div className="d-flex flex-column gap-3">
                {mockReviews.filter(r => !r.hasOwnerReply).length > 0 && (
                  <div className="alert alert-warning border border-warning rounded-4 small mb-1 shadow-sm d-flex align-items-center gap-2">
                    <strong className="fs-6">Action required:</strong> You have {mockReviews.filter(r => !r.hasOwnerReply).length} unanswered reviews. Engaging with customers improves your rating!
                  </div>
                )}

                {mockReviews.map((rev) => (
                  <div key={rev.id} className="custom-card p-4 border shadow-sm">
                    <div className="d-flex justify-content-between mb-3 align-items-start">
                      <div className="d-flex gap-3 align-items-center">
                        <div className="bg-secondary rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: 45, height: 45, fontSize: "1.2rem", overflow: "hidden" }}>
                          <span className="text-uppercase">{rev.user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold">{rev.user.name}</h6>
                          <small className="text-muted">{rev.date}</small>
                        </div>
                      </div>
                      <div className="d-flex text-warning">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            size={16}
                            fill={idx < rev.rating ? "currentColor" : "none"}
                            color={idx < rev.rating ? "#ffc107" : "#ccc"}
                          />
                        ))}
                      </div>
                    </div>

                    <h6 className="fw-bold">{rev.title}</h6>
                    <p className="mb-3 text-secondary">{rev.body}</p>

                    {/* OWNER REPLY BLOCK */}
                    {rev.hasOwnerReply ? (
                      <div className="bg-light p-3 rounded-4 border ms-md-5 position-relative mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span 
                            className="badge p-1 rounded-pill bg-dlsu-light text-dlsu-dark border fw-bold shadow-sm px-2"
                            style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                          >
                            establishment owner reply
                          </span>
                          <div className="dropdown">
                            <button className="btn btn-sm text-muted p-0 border-0 bg-transparent">
                               <Edit size={14} className="me-2"/> Edit
                            </button>
                          </div>
                        </div>
                        <p className="small mb-0 text-dark fst-italic">"{rev.ownerReplyText}"</p>
                      </div>
                    ) : (
                      <div className="ms-md-5 mt-3 pt-3 border-top border-dashed">
                        <div className="d-flex gap-2 align-items-start">
                           <textarea className="form-control form-control-sm" rows="2" placeholder="Write a public reply as the owner..."></textarea>
                           <button className="btn btn-sm btn-dlsu-dark rounded-3 px-3 py-2 fw-bold h-100">
                             Reply
                           </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
