import { useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom"; // Added Navigate, useNavigate
import { Star, MessageSquare } from "lucide-react";

import ProfileHeader from "../components/profile/ProfileHeader";
import PublicProfileStatistics from "../components/profile/PublicProfileStatistics";
import ProfileReviews from "../components/profile/ProfileReviews";
import ProfileComments from "../components/profile/ProfileComments";

export default function PublicProfilePage({ db, currentUser }) {
  const { username } = useParams();
  const navigate = useNavigate(); // Added navigate hook
  const [activeTab, setActiveTab] = useState("reviews");

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

  // 2. Safely access the comments array (Default to empty if missing)
  const userComments = publicUser.comments || [];

  // MOCK REVIEW (You can also move this to DB later)
  const mockReview = {
    rating: 5,
    date: "1 week ago",
    title: `Best spot for ${publicUser.name}!`,
    body: "Honestly, for the price, you can't beat this.",
    establishment: {
      name: "Ate Rica's Bacsilog",
      location: "Agno Food Court",
      image: "https://ui-avatars.com/api/?name=AR",
    },
  };

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

      <div className="container mt-4">
        <div className="row g-4">
          {/* LEFT COLUMN */}
          <div className="col-lg-8">
            <div className="d-flex gap-2 mb-4">
              <TabButton id="reviews" icon={Star} label="Reviews" />
              <TabButton id="comments" icon={MessageSquare} label="Comments" />
            </div>

            <div>
              {activeTab === "reviews" ? (
                <ProfileReviews review={mockReview} />
              ) : (
                /* 3. Dynamic Comment Rendering */
                <div className="d-flex flex-column gap-3">
                  {userComments.length > 0 ? (
                    userComments.map((commentData, index) => (
                      <ProfileComments
                        key={index}
                        comment={{
                          ...commentData,
                          user: publicUser.username,
                        }}
                        isOwnProfile={false}
                      />
                    ))
                  ) : (
                    <div className="text-center py-5 text-muted border rounded-3 bg-white">
                      <MessageSquare className="mb-2 opacity-25" size={40} />
                      <p className="mb-0">No comments yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-lg-4">
            <PublicProfileStatistics user={publicUser} />
          </div>
        </div>
      </div>
    </div>
  );
}
