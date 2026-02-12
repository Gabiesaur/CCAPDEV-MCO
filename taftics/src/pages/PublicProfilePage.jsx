import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";

// --- COMPONENT IMPORTS ---
import ProfileHeader from "../components/profile/ProfileHeader";
import PublicProfileStatistics from "../components/profile/PublicProfileStatistics";
import ProfileReviews from "../components/profile/ProfileReviews";
import ProfileComments from "../components/profile/ProfileComments";

export default function PublicProfilePage() {
  const [activeTab, setActiveTab] = useState("reviews");

  // --- MOCK DATA (Someone Else's Data) ---
  const publicUser = {
    name: "Archer Dela Cruz",
    username: "archer_dc",
    avatar:
      "https://ui-avatars.com/api/?name=Archer+Dela+Cruz&background=00441B&color=fff",
    idSeries: "121",
    followers: 142,
    helpfulCount: 532,
    contributions: 89,
  };

  const mockReview = {
    rating: 5,
    date: "1 week ago",
    title: "Best Sisig in Taft!",
    body: "Honestly, for the price, you can't beat this. The sauce is perfect.",
    establishment: {
      name: "Ate Rica's Bacsilog",
      location: "Agno Food Court",
      image: "https://ui-avatars.com/api/?name=AR",
    },
  };

  const mockComment = {
    postTitle: "Is the library open on Sundays?",
    postAuthor: "Froshie123",
    postRating: 3,
    date: "2 days ago",
    body: "Yes, until 5pm only.",
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
      {/* 1. HEADER (isOwnProfile=FALSE hides the camera icon) */}
      <ProfileHeader
        name={publicUser.name}
        username={publicUser.username}
        avatar={publicUser.avatar}
        isOwnProfile={false}
      />

      <div className="container mt-4">
        <div className="row g-4">
          {/* LEFT COLUMN (Main Content) */}
          <div className="col-lg-8">
            <div className="d-flex gap-2 mb-4">
              {/* Tabs */}
              <TabButton id="reviews" icon={Star} label="Reviews" />
              <TabButton id="comments" icon={MessageSquare} label="Comments" />
            </div>

            {/* Tab Content Logic */}
            <div>
              {activeTab === "reviews" ? (
                <>
                  <ProfileReviews review={mockReview} />
                  <ProfileReviews
                    review={{
                      ...mockReview,
                      title: "Avoid during lunch",
                      rating: 3,
                      body: "Too crowded.",
                    }}
                  />
                </>
              ) : (
                <>
                  <ProfileComments
                    comment={{
                      ...mockComment,
                      user: publicUser.name,
                    }}
                    isOwnProfile={false}
                  />
                </>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (Public Stats) */}
          <div className="col-lg-4">
            <PublicProfileStatistics user={publicUser} />
          </div>
        </div>
      </div>
    </div>
  );
}
