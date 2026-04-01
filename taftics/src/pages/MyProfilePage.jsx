import { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  BookMarked,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Link as LinkIcon,
} from "lucide-react";

// --- COMPONENT IMPORTS ---
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStatistics from "../components/profile/ProfileStatistics";
import ProfileReviews from "../components/profile/ProfileReviews";
import ProfileComments from "../components/profile/ProfileComments";
import ImageUploadModal from "../components/profile/ImageUploadModal";
import ProfileSavedEstablishmentCard from "../components/profile/ProfileSavedEstablishmentCard";

export default function MyProfilePage({ user, setUser }) {
  // UI State
  const [activeTab, setActiveTab] = useState("reviews");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock Comment Data
  const mockComment = {
    postTitle: "Where to print?",
    postAuthor: "Archer123",
    postRating: 5,
    date: "2 hours ago",
    body: "Try PixelPro at One Archers, they are open 24/7.",
  };

  // Live Backend State
  const [myReviews, setMyReviews] = useState([]);
  const [savedEstablishments, setSavedEstablishments] = useState([]);
  const [helpfulReviews, setHelpfulReviews] = useState([]);
  const [unhelpfulReviews, setUnhelpfulReviews] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState(null);

  // Dynamic Toast Trigger
  const triggerToast = (message, iconType) => {
    setToastMessage(message);
    setToastIcon(
      iconType === "success" ? (
        <CheckCircle2 size={24} />
      ) : (
        <LinkIcon size={24} />
      ),
    );
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    if (!user || !user._id) return;
    setIsLoading(true);

    // Fetch Review Arrays
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/users/${user._id}/bookmarks`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/users/${user._id}/helpful-reviews`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/users/${user._id}/unhelpful-reviews`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/users/${user._id}/reviews`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/users/${user._id}/comments`).then(res => res.json())
    ])
      .then(([savedData, helpfulData, unhelpfulData, revData, commentData]) => {
        setSavedEstablishments(Array.isArray(savedData) ? savedData : []);
        setHelpfulReviews(Array.isArray(helpfulData) ? helpfulData : []);
        setUnhelpfulReviews(Array.isArray(unhelpfulData) ? unhelpfulData : []);
        setMyReviews(Array.isArray(revData) ? revData : []);
        setMyComments(Array.isArray(commentData) ? commentData : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed fetching profile tabs data:", err);
        setIsLoading(false);
      });
  }, [user]);

  // Tab Button Helper
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
    <div className="min-vh-100 pb-5 bg-light">
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
        userId={user._id}
        onUploadSuccess={(updatedUser) => {
          setUser(updatedUser);
          localStorage.setItem("currentUser", JSON.stringify(updatedUser));
          setIsModalOpen(false);
          triggerToast("Profile picture updated successfully!", "success");
        }}
      />

      {showToast && (
        <div className="toast-success-custom fw-bold" style={{ zIndex: 9999 }}>
          {toastIcon}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. Main Content Grid */}
      <div className="container mt-4">
        <div className="row g-4">
          {/* LEFT COLUMN: Feed */}
          <div className="col-lg-8">
            <div className="d-flex flex-wrap gap-2 mb-4">
              <TabButton id="reviews" icon={Star} label="My Reviews" />
              <TabButton id="comments" icon={MessageSquare} label="My Comments" />
              <TabButton id="saved" icon={BookMarked} label="Saved" />
              <TabButton id="helpful" icon={ThumbsUp} label="Helpful Reviews" />
              <TabButton id="unhelpful" icon={ThumbsDown} label="Unhelpful Reviews" />
            </div>

            {/* Dynamic Content Rendering */}
            <div>
              {isLoading ? (
                  <div className="text-muted py-3">Loading active data...</div>
              ) : (
                <>
                  {activeTab === "reviews" && (
                    <div className="py-3">
                      <h6 className="text-muted mb-4 border-bottom pb-2">Your Authored Reviews</h6>
                      {myReviews.length === 0 ? (
                        <p className="text-muted">You haven't written any reviews yet.</p>
                      ) : (
                        myReviews.map((rev) => (
                           <ProfileReviews key={rev._id} review={rev} />
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === "comments" && (
                    <div className="py-3">
                      <h6 className="text-muted mb-4 border-bottom pb-2">Your Comments</h6>
                      
                      {myComments.length === 0 ? (
                        <p className="text-muted">You haven't posted any comments yet.</p>
                      ) : (
                        myComments.map((comment) => (
                          <ProfileComments 
                            key={comment._id} 
                            isOwnProfile={true}
                            comment={{
                              _id: comment._id,
                              reviewId: comment.reviewId?._id,
                              // Pull the original review details populated from the backend
                              postTitle: comment.reviewId?.title || "Deleted Review",
                              postAuthor: comment.reviewId?.userId?.username || "Unknown User",
                              postRating: comment.reviewId?.rating || 0,
                              date: new Date(comment.date).toLocaleDateString(),
                              body: comment.text || comment.body // Fallback depending on your schema
                            }} 
                          />
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === "saved" && (
                    <div className="py-3">
                      <h6 className="text-muted mb-4 text-capitalize border-bottom pb-2">Your Saved Establishments</h6>
                      {savedEstablishments.length === 0 ? (
                        <p className="text-muted">You haven't saved any establishments yet.</p>
                      ) : (
                        savedEstablishments.map((est) => (
                           <ProfileSavedEstablishmentCard key={est._id} establishment={est} />
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === "helpful" && (
                    <div className="py-3">
                      <h6 className="text-muted mb-4 border-bottom pb-2">Reviews You Marked as Helpful</h6>
                      {helpfulReviews.length === 0 ? (
                        <p className="text-muted">You haven't marked any reviews as helpful.</p>
                      ) : (
                        helpfulReviews.map((rev) => (
                           <ProfileReviews key={rev._id} review={rev} />
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === "unhelpful" && (
                    <div className="py-3">
                      <h6 className="text-muted mb-4 border-bottom pb-2">Reviews You Marked as Unhelpful</h6>
                      {unhelpfulReviews.length === 0 ? (
                        <p className="text-muted">You haven't marked any reviews as unhelpful.</p>
                      ) : (
                        unhelpfulReviews.map((rev) => (
                           <ProfileReviews key={rev._id} review={rev} />
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Stats */}
          <div className="col-lg-4">
            <ProfileStatistics
              user={user}
              isOwnProfile={true}
              setUser={setUser}
              onShareSuccess={() =>
                triggerToast("Profile link copied to clipboard!", "link")
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}