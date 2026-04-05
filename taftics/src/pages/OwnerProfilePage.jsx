import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Settings, Store, BarChart3, Edit, Trash2, ExternalLink, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import ImageUploadModal from "../components/profile/ImageUploadModal";
import EstablishmentImageUploadModal from "../components/profile/EstablishmentImageUploadModal";
import ProfileEditModal from "../components/profile/ProfileEditModal";
import { Camera } from "lucide-react";

export default function OwnerProfilePage({ user, setUser }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isEstImageModalOpen, setIsEstImageModalOpen] = useState(false);
  const [isEditingStore, setIsEditingStore] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [establishment, setEstablishment] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const [replyTexts, setReplyTexts] = useState({});

  const handleReplySubmit = async (reviewId) => {
    const text = replyTexts[reviewId];
    if (!text || !text.trim()) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id || user.id, text: text.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prevReviews) =>
          prevReviews.map((r) => {
            if (r._id === reviewId) {
              const updatedComments = [...(r.comments || []), { userId: user._id || user.id, text: text.trim(), date: new Date() }];
              return { ...r, comments: updatedComments };
            }
            return r;
          })
        );
        setReplyTexts((prev) => ({ ...prev, [reviewId]: "" }));
        triggerToast("Reply posted successfully!");
      } else {
        triggerToast("Failed to post reply.");
      }
    } catch {
      triggerToast("Network error while replying.");
    }
  };

  const [storeForm, setStoreForm] = useState({
    name: "",
    category: "Food",
    startTime: "07:00",
    endTime: "19:00",
    location: ""
  });

  useEffect(() => {
    if (!user || (!user.ownedEstablishmentId && !user.ownedEstablishmentId?.$oid)) {
      setLoading(false);
      return;
    }

    const targetId = user.ownedEstablishmentId?.$oid || user.ownedEstablishmentId;

    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/establishments/${targetId}`).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/establishments/${targetId}/reviews`).then(r => r.json())
    ]).then(([estData, revData]) => {
      setEstablishment(estData);
      setReviews(Array.isArray(revData) ? revData : []);
      
      const convertTo24Hour = (timeStr) => {
        if (!timeStr) return "00:00";
        const [time, modifier] = timeStr.split(' ');
        if (!modifier) return timeStr;
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
      };

      let sTime = "07:00";
      let eTime = "19:00";

      if (estData.businessHours) {
         if (estData.businessHours.includes("-")) {
            const parts = estData.businessHours.split("-");
            if (parts.length === 2) {
                sTime = convertTo24Hour(parts[0].trim());
                eTime = convertTo24Hour(parts[1].trim());
            }
         } else if (estData.businessHours.includes("to")) {
            const parts = estData.businessHours.split(" to ");
            if (parts.length === 2) {
                sTime = parts[0].trim();
                eTime = parts[1].trim();
            }
         }
      }

      setStoreForm({
        name: estData.name || "",
        category: estData.category || "Food",
        startTime: sTime,
        endTime: eTime,
        location: estData.location || ""
      });
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [user]);

  const handleSaveStore = async () => {
    try {
      const targetId = user.ownedEstablishmentId?.$oid || user.ownedEstablishmentId;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/establishments/${targetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeForm)
      });
      const data = await res.json();
      if (data.success) {
        setEstablishment(data.establishment);
        triggerToast("Establishment details updated!");
        setIsEditingStore(false);
      } else {
        triggerToast("Failed: " + data.message);
      }
    } catch {
      triggerToast("Failed to connect to server");
    }
  };

  const formattedReviews = reviews.map(rev => {
    const ownerReply = (rev.comments || []).find(c => 
       c.userId?._id === user._id || c.userId === user._id
    );

    return {
      id: rev._id,
      rating: rev.rating || 0,
      date: new Date(rev.date).toLocaleDateString(),
      title: rev.title,
      body: rev.body,
      user: { name: rev.userId?.name || rev.userId?.username || "Unknown User" },
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
        onEditProfileClick={() => setIsEditProfileModalOpen(true)}
      />

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={user._id || user.id}
        onUploadSuccess={(updatedUser) => {
          if (setUser) {
            setUser(updatedUser);
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
          }
          setIsModalOpen(false);
          triggerToast("Profile picture updated!");
        }}
      />

      <ProfileEditModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        user={user}
        onUpdateSuccess={(updatedUser) => {
          if (setUser) {
            setUser(updatedUser);
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
          }
          triggerToast("Profile details updated!");
        }}
      />

      <EstablishmentImageUploadModal
        isOpen={isEstImageModalOpen}
        onClose={() => setIsEstImageModalOpen(false)}
        establishmentId={establishment?._id || establishment?.id}
        onUploadSuccess={(updatedEst) => {
          setEstablishment(updatedEst);
          triggerToast("Establishment cover image updated!");
        }}
      />

      {showToast && (
        <div className="toast-success-custom fw-bold" style={{ zIndex: 9999 }}>
          <CheckCircle2 size={24} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="container mt-4">
        {loading ? (
             <div className="text-center p-5"><span className="text-muted fw-bold">Loading dashboard...</span></div>
        ) : !establishment ? (
             <div className="text-center p-5"><span className="text-danger fw-bold">Warning: User is not linked to an active Business Entity.</span></div>
        ) : (
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
                Managing: <strong className="text-dlsu-dark">{establishment.name}</strong>
              </p>

              <hr className="opacity-10 mb-4" />

              <Link to={`/establishment/${establishment._id || establishment.id}`} className="btn btn-dark w-100 d-flex justify-content-center align-items-center gap-2 text-decoration-none">
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
              <TabButton id="inbox" icon={Star} label={`Reviews Inbox (${formattedReviews.filter(r => !r.hasOwnerReply).length})`} />
            </div>

            {/* CONTENT: DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="custom-card p-4 text-center h-100 d-flex flex-column justify-content-center">
                    <h1 className="fw-bold text-dlsu-dark mb-1" style={{ fontSize: "3rem" }}>
                      {reviews.length > 0 ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1) : "0.0"}
                    </h1>
                    <p className="text-muted fw-bold mb-0">Average Rating</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="custom-card p-4 text-center h-100 d-flex flex-column justify-content-center">
                    <h1 className="fw-bold text-dlsu-dark mb-1" style={{ fontSize: "3rem" }}>
                      {reviews.length}
                    </h1>
                    <p className="text-muted fw-bold mb-0">Total Reviews</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="custom-card p-4 text-center h-100 d-flex flex-column justify-content-center bg-dlsu-light border border-success">
                    <h1 className="fw-bold text-dlsu-dark mb-1" style={{ fontSize: "3rem" }}>
                      {formattedReviews.filter(r => !r.hasOwnerReply).length}
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
                        <div className="form-control bg-light fw-bold text-muted border-0 py-2">{establishment.name}</div>
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
                        <div className="form-control bg-light text-muted border-0 py-2">{establishment.category}</div>
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
                        <div className="form-control bg-light text-muted border-0 py-2">{establishment.businessHours}</div>
                      )}
                    </div>

                    {/* Location Field */}
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Location</label>
                      {isEditingStore ? (
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="your location relative to DLSU"
                          value={storeForm.location} 
                          onChange={(e) => setStoreForm({...storeForm, location: e.target.value})} 
                        />
                      ) : (
                        <div className="form-control bg-light text-muted border-0 py-2">{establishment.location || "Not Specified"}</div>
                      )}
                    </div>

                    {/* Establishment Image Section */}
                    <div className="col-12 mt-3">
                      <label className="form-label small fw-bold text-muted">Establishment Cover Image</label>
                      <div 
                        className="rounded-4 overflow-hidden position-relative bg-light" 
                        style={{ height: '200px', cursor: 'default' }}
                      >
                        <img 
                          src={establishment.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(establishment.name)}&background=00441b&color=fff&size=512&bold=true`}
                          alt="Store cover"
                          className="w-100 h-100 object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(establishment.name)}&background=00441b&color=fff&size=512&bold=true`;
                          }}
                        />
                        <button 
                          type="button"
                          className="btn btn-dark btn-sm position-absolute bottom-0 end-0 m-3 shadow-sm rounded-pill d-flex align-items-center gap-2 px-3 py-2"
                          onClick={() => setIsEstImageModalOpen(true)}
                        >
                          <Camera size={16} /> Update Cover
                        </button>
                      </div>
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
                {formattedReviews.filter(r => !r.hasOwnerReply).length > 0 && (
                  <div className="alert alert-warning border border-warning rounded-4 small mb-1 shadow-sm d-flex align-items-center gap-2">
                    <strong className="fs-6">Action required:</strong> You have {formattedReviews.filter(r => !r.hasOwnerReply).length} unanswered reviews. Engaging with customers improves your rating!
                  </div>
                )}

                {formattedReviews.map((rev) => (
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
                           <textarea 
                             className="form-control form-control-sm" 
                             rows="2" 
                             placeholder="Write a public reply as the owner..."
                             value={replyTexts[rev.id] || ""}
                             onChange={(e) => setReplyTexts({ ...replyTexts, [rev.id]: e.target.value })}
                           ></textarea>
                           <button 
                             className="btn btn-sm btn-dlsu-dark rounded-3 px-3 py-2 fw-bold h-100"
                             onClick={() => handleReplySubmit(rev.id)}
                             disabled={!replyTexts[rev.id]?.trim()}
                           >
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
        )}
      </div>
    </div>
  );
}
