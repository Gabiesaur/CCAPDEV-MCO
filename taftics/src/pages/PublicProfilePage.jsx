import { useEffect, useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom"; // Added Navigate, useNavigate
import { Star, MessageSquare, Link as LinkIcon, CheckCircle2 } from "lucide-react";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStatistics from "../components/profile/ProfileStatistics";
import ProfileReviews from "../components/profile/ProfileReviews";
import ProfileComments from "../components/profile/ProfileComments";

export default function PublicProfilePage({ db, currentUser }) {
  const { username } = useParams();
  const navigate = useNavigate(); // Added navigate hook
  const [activeTab, setActiveTab] = useState("reviews");

  // Toast State
  const [publicReviews, setPublicReviews] = useState([]);
  const [publicComments, setPublicComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // 0. Redirect if viewing own profile
  if (currentUser && currentUser.username === username) {
    return <Navigate to="/profile/me" replace />;
  }

  // 1. Find the User
  const publicUser = db.find((u) => u.username === username);

  if (!publicUser) {
    return (
      <div className="p-5 text-center">
        <h1>User @{username} not found.</h1>
        <Link to="/" className="btn btn-dlsu-dark mt-3">
          Go Home
        </Link>
      </div>
    );
  }

  useEffect(() => {
      if (!publicUser || !publicUser._id) return;
      setIsLoading(true);
  
      // Fetch Review Arrays
      Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/users/${publicUser._id}/reviews`).then(res => res.json()),
        fetch(`${import.meta.env.VITE_API_URL}/api/users/${publicUser._id}/comments`).then(res => res.json())
      ])
        .then(([revData, commentData]) => {
          setPublicReviews(Array.isArray(revData) ? revData : []);
          setPublicComments(Array.isArray(commentData) ? commentData : []);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed fetching profile tabs data:", err);
          setIsLoading(false);
        });
    }, [publicUser]);
  

  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      className={`btn btn-sm d-flex align-items-center gap-2 fw-bold px-4 py-2 ${activeTab === id
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
        name={publicUser.name}
        username={publicUser.username}
        avatar={publicUser.avatar}
        isOwnProfile={false}
      />

      {showToast && (
        <div className="toast-success-custom fw-bold" style={{ zIndex: 9999 }}>
          {toastIcon}
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="container mt-4">
        <div className="row g-4">
          {/* LEFT COLUMN */}
          <div className="col-lg-8">
            <div className="d-flex gap-2 mb-4">
              <TabButton id="reviews" icon={Star} label="Reviews" />
              <TabButton id="comments" icon={MessageSquare} label="Comments" />
            </div>

            <div>
              {activeTab === "reviews" && (
                <div className="py-3">
                  {publicReviews.length === 0 ? (
                    <p className="text-muted">This user hasn't written any reviews yet.</p>
                  ) : (
                    publicReviews.map((rev) => (
                        <ProfileReviews key={rev._id} review={rev} />
                    ))
                  )}
                </div>
              )}

              {activeTab === "comments" && (
                <div className="py-3">
                  {publicComments.length === 0 ? (
                    <p className="text-muted">This user hasn't posted any comments yet.</p>
                  ) : (
                    publicComments.map((comment) => (
                      <ProfileComments 
                        key={comment._id} 
                        isOwnProfile={true}
                        comment={{
                          _id: comment._id,
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
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-lg-4">
            <ProfileStatistics 
              user={publicUser} 
              isOwnProfile={false}
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
