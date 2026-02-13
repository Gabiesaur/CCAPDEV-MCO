import { useState } from "react";
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
import MyProfileStatistics from "../components/profile/MyProfileStatistics";
import ProfileReviews from "../components/profile/ProfileReviews";
import ProfileComments from "../components/profile/ProfileComments";
import ImageUploadModal from "../components/profile/ImageUploadModal";

export default function MyProfilePage({ user, setUser }) {
  // UI State
  const [activeTab, setActiveTab] = useState("reviews");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // --- MOCK DATA ---
  const mockReview = {
    rating: 4,
    date: "3 days ago",
    title: "Great study spot!",
    body: "Quiet and cold AC. The wifi is decent but sometimes disconnects.",
    establishment: {
      name: "Coffee Bean",
      location: "Henry Sy Hall",
      image: "https://ui-avatars.com/api/?name=CB",
    },
  };

  const mockComment = {
    postTitle: "Where to print?",
    postAuthor: "Archer123",
    postRating: 5,
    date: "2 hours ago",
    body: "Try PixelPro at One Archers, they are open 24/7.",
  };

  // Tab Button Helper
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
      {/* 1. Header Section */}
      <ProfileHeader
        name={user.name}
        username={user.username}
        avatar={user.avatar}
        isOwnProfile={true}
        onCameraClick={() => setIsModalOpen(true)}
      />

      {/* 2. Modals & Notifications */}
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={() =>
          triggerToast("Profile picture updated successfully!", "success")
        }
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
            {/* Navigation Tabs */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              <TabButton id="reviews" icon={Star} label="My Reviews" />
              <TabButton
                id="comments"
                icon={MessageSquare}
                label="My Comments"
              />
              <TabButton id="saved" icon={BookMarked} label="Saved" />
              <TabButton id="helpful" icon={ThumbsUp} label="Helpful" />
              <TabButton id="unhelpful" icon={ThumbsDown} label="Unhelpful" />
            </div>

            {/* Dynamic Content Rendering */}
            <div>
              {activeTab === "reviews" && (
                <>
                  <ProfileReviews review={mockReview} />
                  <ProfileReviews
                    review={{
                      ...mockReview,
                      title: "Standard Taft Food",
                      rating: 5,
                    }}
                  />
                </>
              )}

              {activeTab === "comments" && (
                <>
                  <ProfileComments comment={mockComment} isOwnProfile={true} />
                  <ProfileComments comment={mockComment} isOwnProfile={true} />
                </>
              )}

              {["saved", "helpful", "unhelpful"].includes(activeTab) && (
                <div className="py-3">
                  <h6 className="text-muted mb-4 text-capitalize border-bottom pb-2">
                    Your {activeTab} posts
                  </h6>
                  <ProfileReviews review={mockReview} />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Stats */}
          <div className="col-lg-4">
            <MyProfileStatistics
              user={user}
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
