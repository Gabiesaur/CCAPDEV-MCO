import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import EstablishmentCardSmall from "../components/landing/EstablishmentCardSmall";
import ProfileReviews from "../components/profile/ProfileReviews";
import { ESTABLISHMENTS } from "../data/mockData";

const LandingPage = () => {
  const categories = ['Any', 'School Supplies', 'Laundry', 'Groceries', 'Dorms/Condos', 'Repairs', 'Printing', 'Fitness', "Food", "Coffee"];

  // Get top 3 rated establishments
  const topRatedEstablishments = [...ESTABLISHMENTS]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  // Define a mock review object for the landing page showcase
  const showcaseReview = {
    rating: 5,
    date: "2 days ago",
    title: "The best budget friendly meals on campus!",
    body: "Ate Rica's remains the gold standard for a quick and affordable meal between classes at Andrew. That signature liquid cheese sauce combined with the smoky bacon bits is an elite flavor combination that never misses. Even during the peak 12:00 PM rush, the service is incredibly efficient so you won't be late for your next lecture. It is the perfect comfort food for those long study sessions or stressful midterms week. I always get extra rice whenever I eat here. Every Archer needs to experience this Taft staple at least once before they graduate.",
    establishment: {
      id: 3, // Ate Rica's ID
      name: "Ate Rica's Bacsilog",
      location: "Agno Food Court",
      image: "https://pbs.twimg.com/media/GAeKw8KaYAAis3s.jpg"
    },
    user: "Leelancze Pacomio",
    avatar: "https://ui-avatars.com/api/?name=Leelancze+Pacomio&background=0D8ABC&color=fff",
    username: "leelanczers"
  };

  return (
    <div className="min-vh-100 bg-white">
      {/* Hero Section */}
      {/* We use pt-5 and mt-5 to prevent the fixed navbar from overlapping the text */}
      <header className="container text-center" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
        <h1 className="fw-bold display-4 mt-5">
          Every <span className="text-dlsu-dark">Archer</span> needs a strategy.
        </h1>
        <p className="text-muted fs-5">
          Find the best services and essentials around Taft with peer-verified
          reviews.
        </p>
        <div className="mx-auto mt-5 px-3" style={{ maxWidth: "800px" }}>
          <div className="input-group shadow-lg rounded-pill overflow-hidden bg-white p-2 border border-light">
            <span className="input-group-text bg-white border-0 ps-4">
              <Search size={22} className="text-dlsu-primary" />
            </span>
            <input
              type="text"
              className="form-control border-0 py-3 fs-5 bg-white shadow-none"
              placeholder="Search for laundry, printing, groceries..."
              style={{ paddingLeft: '10px' }}
            />
            <Link to="/browse"
              className="btn btn-dlsu-dark rounded-pill px-5 fw-bold shadow-sm ms-2 d-flex align-items-center"
            >
              Search
            </Link>
          </div>

          {/* Quick Shortcuts / Popular Tags */}
          <div className="d-flex justify-content-center gap-3 mt-3 opacity-75">
            <span className="small text-muted fw-bold">Try:</span>
            {['Bacsilog', 'Laundry', 'Printing', 'Coffee'].map(tag => (
              <Link
                key={tag}
                to="/browse"
                className="small text-dlsu-dark text-decoration-none hover-underline fw-semibold"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Category Section */}
      <section className="container text-center" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <h2 className="fw-bold mb-4">
          Browse reviews by <span className="text-dlsu-dark">category</span>
        </h2>
        <div className="row g-3 justify-content-center row-cols-2 row-cols-md-3 row-cols-lg-5">
          {categories.map((cat) => (
            <div key={cat} className="col">
              <Link
                className="btn bg-dlsu-primary w-100 text-white py-2 rounded-pill fw-semibold"
                to="/browse"
              >
                {cat}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <h2 className="fw-bold text-center mb-5">
          See the <span className="text-dlsu-dark">top rated</span>{" "}
          establishments
        </h2>
        <div className="row g-4">
          {topRatedEstablishments.map((store) => (
            <div key={store.id} className="col-md-4">
              <EstablishmentCardSmall
                id={store.id}
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
      </section>

      {/* Community Review Section */}
      <section className="container text-center" style={{ paddingTop: '80px', paddingBottom: '160px' }}>
        <h2 className="fw-bold mb-5">
          Help others in the <span className="text-dlsu-dark">DLSU</span>{" "}
          community
        </h2>

        {/* Replaced hardcoded card with ProfileReviews component */}
        <div
          className="mx-auto text-start"
          style={{ maxWidth: "800px" }}
        >
          {/* We wrap it in a div to control width, but let ProfileReviews handle internal styling */}
          <ProfileReviews review={showcaseReview} />
        </div>

        <div>
          <Link
            className="btn btn-outline-dark rounded-pill px-4 mt-4 fw-bold text-decoration-none"
            to="/create">
            Have a spot you love? Write a review ↗
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
