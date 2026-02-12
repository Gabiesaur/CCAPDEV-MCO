import { useState } from "react";
import {
  Star,
  MessageSquare,
  BookMarked,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

// --- COMPONENT IMPORTS ---
import ProfileHeader from "../components/profile/ProfileHeader";
import MyProfileStatistics from "../components/profile/MyProfileStatistics";
import ProfileReviews from "../components/profile/ProfileReviews";
import ProfileComments from "../components/profile/ProfileComments";

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState("reviews");

  // --- MOCK DATA ---
  const user = {
    name: "Leelancze Pacomio",
    username: "leelanczerscx",
    avatar:
      "https://ui-avatars.com/api/?name=Leelancze+Pacomio&background=0D8ABC&color=fff",
    idSeries: "124",
    followers: 67,
    helpfulCount: 7409,
    contributions: 287,
    accountAge: "1 y",
  };

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
      {/* 1. COMPONENT: Header */}
      <ProfileHeader
        name={user.name}
        username={user.username}
        avatar={user.avatar}
        isOwnProfile={true}
      />

      <div className="container mt-4">
        <div className="row g-4">
          {/* LEFT COLUMN (Main Content) */}
          <div className="col-lg-8">
            {/* Tabs */}
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

            {/* Tab Content Logic */}
            <div>
              {activeTab === "reviews" && (
                <>
                  <ProfileReviews review={mockReview} />
                  <ProfileReviews
                    review={{
                      ...mockReview,
                      title: "Another Review",
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
                <div className="text-center py-5 text-muted">
                  {/* You can reuse ProfileReviews here later */}
                  <ProfileReviews review={mockReview} />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (Own Stats) */}
          <div className="col-lg-4">
            <MyProfileStatistics user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
