import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Star, MapPin, ThumbsUp, ThumbsDown } from "lucide-react";

import EstablishmentCardSmall from "../components/landing/EstablishmentCardSmall";

const LandingPage = () => {
  const navigate = useNavigate();

  const getRelativeDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  // 1. NEW: State to hold top rated establishments and loading status
  const [establishments, setEstablishments] = useState([]);
  const [topRatedEstablishments, setTopRatedEstablishments] = useState([]);
  const [showcaseReviews, setShowcaseReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      establishments
        .map((establishment) => String(establishment?.category || "").trim())
        .filter(Boolean),
    );

    return [
      "Any",
      ...Array.from(uniqueCategories).sort((a, b) => a.localeCompare(b)),
    ];
  }, [establishments]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate("/browse", { state: { searchQuery: searchQuery.trim() } });
  };

  // 2. NEW: Fetch, sort, and slice data from the database
  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/establishments`,
        );
        const data = await res.json();
        setEstablishments(data);

        const sortedByRating = [...data].sort(
          (a, b) => (b.rating || 0) - (a.rating || 0),
        );
        const topRated = sortedByRating.slice(0, 3);
        setTopRatedEstablishments(topRated);

        const reviewResults = await Promise.all(
          sortedByRating.map(async (est) => {
            try {
              const reviewsRes = await fetch(
                `${import.meta.env.VITE_API_URL}/api/establishments/${est._id}/reviews`,
              );
              if (!reviewsRes.ok) return [];

              const reviews = await reviewsRes.json();
              if (!Array.isArray(reviews)) return [];

              return reviews.map((review) => ({ review, establishment: est }));
            } catch {
              return [];
            }
          }),
        );

        const allReviewPairs = reviewResults.flat();
        const shuffledReviewPairs = [...allReviewPairs].sort(
          () => Math.random() - 0.5,
        );
        const selectedPairs = shuffledReviewPairs.slice(0, 3);

        const selectedShowcaseReviews = selectedPairs.map(
          ({ review, establishment }) => ({
            id: review._id,
            rating: Number(review.rating || 0),
            date: getRelativeDate(review.date),
            title: review.title || "Untitled Review",
            body: review.comment || review.body || "",
            helpfulVotes: Number(review.helpfulVotes || 0),
            unhelpfulVotes: Number(review.unhelpfulVotes || 0),
            establishment: {
              id: establishment._id,
              name: establishment.name,
              location: establishment.location,
              image: establishment.image,
            },
            user: review.userId?.name || review.userId?.username || "Anonymous",
            avatar:
              review.userId?.avatar ||
              "https://ui-avatars.com/api/?name=Anonymous&background=0D8ABC&color=fff",
            username: review.userId?.username || null,
            rawReview: review,
            rawEstablishment: establishment,
          }),
        );

        setShowcaseReviews(selectedShowcaseReviews);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch top establishments:", err);
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  return (
    <div className="min-vh-100 bg-white">
      {/* Hero Section */}
      <header
        className="container text-center"
        style={{ paddingTop: "100px", paddingBottom: "80px" }}
      >
        <h1 className="fw-bold display-3 mt-5">
          Every <span className="text-dlsu-dark">Archer</span> needs a strategy.
        </h1>
        <p className="text-muted fs-5">
          Find the best services and essentials around Taft with peer-verified
          reviews.
        </p>
        <div className="mx-auto mt-5 px-3" style={{ maxWidth: "1000px" }}>
          <form
            onSubmit={handleSearchSubmit}
            className="input-group shadow-sm rounded-pill overflow-hidden bg-white p-1 border border-light"
          >
            <span className="input-group-text bg-white border-0 ps-4">
              <Search size={24} className="text-dlsu-dark" />
            </span>
            <input
              type="text"
              className="form-control border-0 py-3 fs-5 bg-white shadow-none"
              placeholder="Search for laundry, printing, groceries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "10px" }}
            />
            <button
              type="submit"
              className="btn btn-dlsu-dark rounded-pill px-5 fw-semibold shadow-sm ms-2 d-flex align-items-center"
            >
              Search
            </button>
          </form>

          {/* Quick Shortcuts / Popular Tags */}
          <div className="d-flex justify-content-center gap-3 mt-3 opacity-75">
            <span className="small text-muted fw-bold">Try:</span>
            {["Bacsilog", "Laundry", "Printing", "Coffee"].map((tag) => (
              <Link
                key={tag}
                to="/browse"
                state={{ searchQuery: tag }}
                className="small text-dlsu-dark text-decoration-none hover-underline fw-semibold"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Category Section */}
      <section
        className="container text-center"
        style={{ paddingTop: "80px", paddingBottom: "80px" }}
      >
        <h2 className="fw-bold mb-5">
          Browse reviews by <span className="text-dlsu-dark">category</span>
        </h2>
        <div className="row g-3 justify-content-center row-cols-2 row-cols-md-3 row-cols-lg-5">
          {categories.map((cat) => (
            <div key={cat} className="col">
              <Link
                className="btn bg-dlsu-primary w-100 text-white py-2 rounded-pill fw-semibold"
                to="/browse"
                state={{ selectedCategory: cat }}
              >
                {cat}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Top Rated Section */}
      <section
        className="container"
        style={{ paddingTop: "80px", paddingBottom: "80px" }}
      >
        <h2 className="fw-bold text-center mb-5">
          See the <span className="text-dlsu-dark">top rated</span>{" "}
          establishments
        </h2>

        {/* 3. NEW: Conditional rendering while data loads */}
        {loading ? (
          <div className="text-center py-5">
            <p className="text-muted fs-5">Loading top establishments...</p>
          </div>
        ) : (
          <div className="row g-4">
            {topRatedEstablishments.map((store) => (
              <div key={store._id} className="col-md-4">
                {" "}
                <EstablishmentCardSmall
                  id={store._id}
                  name={store.name}
                  category={store.category}
                  location={store.location}
                  rating={store.rating}
                  reviewCount={store.reviewCount}
                  image={store.image}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Community Review Section */}
      <section
        className="container text-center"
        style={{ paddingTop: "80px", paddingBottom: "160px" }}
      >
        <h2 className="fw-bold mb-5">
          Help others in the <span className="text-dlsu-dark">DLSU</span>{" "}
          community
        </h2>

        <div className="mx-auto text-start" style={{ maxWidth: "1200px" }}>
          {loading ? (
            <p className="text-muted">Loading featured review...</p>
          ) : showcaseReviews.length > 0 ? (
            <div
              className="d-flex gap-4 overflow-auto pb-2"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {showcaseReviews.map((review) => (
                <article
                  key={review.id}
                  className="custom-card p-4 flex-shrink-0 d-flex flex-column"
                  style={{
                    width: "380px",
                    minHeight: "360px",
                    scrollSnapAlign: "start",
                  }}
                >
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={
                        review.avatar ||
                        "https://ui-avatars.com/api/?name=User&background=random"
                      }
                      alt="avatar"
                      className="rounded-circle me-3 object-cover"
                      style={{ width: "40px", height: "40px" }}
                    />
                    <div className="d-flex flex-column justify-content-center">
                      <Link
                        to={
                          review.username ? `/profile/${review.username}` : "#"
                        }
                        className="fw-bold text-dark text-decoration-none"
                        style={{ display: "block", lineHeight: "1.2" }}
                      >
                        {review.user}
                      </Link>
                      <small className="text-muted">{review.date}</small>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <div className="d-flex gap-1 text-dlsu-primary">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < review.rating ? "currentColor" : "none"}
                          className={
                            i < review.rating
                              ? "text-dlsu-primary"
                              : "text-muted opacity-25"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/review/${review.id}`}
                    state={{
                      review: review.rawReview,
                      establishment: review.rawEstablishment,
                    }}
                    className="text-decoration-none"
                  >
                    <h5 className="fw-bold text-dlsu-dark mb-2 hover-underline">
                      {review.title}
                    </h5>
                  </Link>

                  <p
                    className="text-secondary small mb-3"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {review.body}
                  </p>

                  <div className="mt-auto pt-2">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <span className="d-inline-flex align-items-center text-muted small">
                        <ThumbsUp size={14} className="me-1" />
                        {review.helpfulVotes}
                      </span>
                      <span className="d-inline-flex align-items-center text-muted small">
                        <ThumbsDown size={14} className="me-1" />
                        {review.unhelpfulVotes}
                      </span>
                    </div>

                    <Link
                      to={`/establishment/${review.establishment.id}`}
                      state={{ establishment: review.rawEstablishment }}
                      className="btn btn-light border rounded-pill d-inline-flex align-items-center pe-3 ps-1 py-1 text-decoration-none"
                      style={{ maxWidth: "100%" }}
                    >
                      <img
                        src={
                          review.establishment.image ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(review.establishment.name)}&background=00441b&color=fff&size=512&bold=true`
                        }
                        alt="shop"
                        className="rounded-circle me-2 object-cover"
                        style={{ width: "28px", height: "28px" }}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.establishment.name)}&background=00441b&color=fff&size=512&bold=true`;
                        }}
                      />
                      <div className="lh-1 text-start">
                        <h6
                          className="fw-bold mb-0 text-dark"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {review.establishment.name}
                        </h6>
                        <small
                          className="text-muted d-flex align-items-center gap-1"
                          style={{ fontSize: "0.7rem" }}
                        >
                          <MapPin size={10} /> {review.establishment.location}
                        </small>
                      </div>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-muted">No reviews available yet.</p>
          )}
        </div>

        <div>
          <Link
            className="btn btn-outline-dark rounded-pill px-4 mt-5 fw-bold text-decoration-none"
            to="/browse"
          >
            Need a specific service? We'll help find it! ↗
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
