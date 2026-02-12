import { useState } from "react";
import { useParams, Navigate } from "react-router-dom"; // Added these
import { Star, MessageSquare } from "lucide-react";

import ProfileHeader from "../components/profile/ProfileHeader";
import PublicProfileStatistics from "../components/profile/PublicProfileStatistics";
import ProfileReviews from "../components/profile/ProfileReviews";
import ProfileComments from "../components/profile/ProfileComments";

export default function PublicProfilePage() {
  const { username } = useParams(); // Grabs "archer_dc" or "frosh123" from URL
  const [activeTab, setActiveTab] = useState("reviews");

  // --- MOCK DATABASE ---
  const usersDb = [
    {
      name: "Archer Dela Cruz",
      username: "archer_dc",
      avatar:
        "https://ui-avatars.com/api/?name=Archer+Dela+Cruz&background=00441B&color=fff",
      idSeries: "121",
      followers: 142,
      helpfulCount: 532,
      contributions: 89,
    },
    {
      name: "Froshie Fresh",
      username: "frosh125",
      avatar:
        "https://ui-avatars.com/api/?name=Froshie+Fresh&background=41AB5D&color=fff",
      idSeries: "125",
      followers: 12,
      helpfulCount: 45,
      contributions: 5,
    },
  ];

  // Find the specific user from our "DB" based on the URL
  const publicUser = usersDb.find((u) => u.username === username);

  // If the user doesn't exist in our list, redirect to 404
  if (!publicUser) {
    return (
      <div className="p-5 text-center">
        <h1>User @{username} not found.</h1>
      </div>
    );
  }

  // --- MOCK CONTENT ---
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
        name={publicUser.name}
        username={publicUser.username}
        avatar={publicUser.avatar}
        isOwnProfile={false}
      />

      <div className="container mt-4">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="d-flex gap-2 mb-4">
              <TabButton id="reviews" icon={Star} label="Reviews" />
              <TabButton id="comments" icon={MessageSquare} label="Comments" />
            </div>

            <div>
              {activeTab === "reviews" ? (
                <ProfileReviews review={mockReview} />
              ) : (
                <ProfileComments
                  comment={{
                    postTitle: "Is the library open?",
                    postAuthor: "Froshie123",
                    postRating: 3,
                    date: "2 days ago",
                    body: "Yes, until 5pm only.",
                    user: publicUser.name,
                  }}
                  isOwnProfile={false}
                />
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <PublicProfileStatistics user={publicUser} />
          </div>
        </div>
      </div>
    </div>
  );
}
