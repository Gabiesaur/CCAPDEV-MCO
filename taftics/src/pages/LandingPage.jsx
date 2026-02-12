import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import EstablishmentCardSmall from "../components/landing/EstablishmentCardSmall";

const LandingPage = () => {
  const categories = ['Any', 'School Supplies', 'Laundry', 'Groceries', 'Dorms/Condos', 'Repairs', 'Printing', 'Fitness', "Food", "Coffee"];
  
  const establishments = [
    {
      name: "National Book Store",
      category: categories[1],
      location: "Inside Yuchengco Hall",
      rating: 4.7,
      reviewCount: 14,
      image: "https://images.summitmedia-digital.com/spotph/images/2020/08/24/nbs-statement-closure-640-1598256966.jpg"
    },
    {
      name: "Anytime Fitness",
      category: categories[7],
      location: "Inside R Square",
      rating: 4.2,
      reviewCount: 9,
      image: "https://classpass-res.cloudinary.com/image/upload/f_auto/q_auto,w_1125/media_venue/a84kycuvqo9jblnfro8r.jpg"
    },
    {
      name: "Ate Rica's Bacsilog",
      category: categories[8],
      location: "Agno Food Court",
      rating: 4.8,
      reviewCount: 16,
      image: "https://pbs.twimg.com/media/GAeKw8KaYAAis3s.jpg"
    }
  ];

  return (
    <div className="min-vh-100 bg-white">
      {/* Hero Section */}
      {/* We use pt-5 and mt-5 to prevent the fixed navbar from overlapping the text */}
      <header className="container text-center" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
        <h1 className="fw-bold display-4 mt-5">
          Every <span style={{ color: "#003e1c" }}>Archer</span> needs a strategy.
        </h1>
        <p className="text-muted fs-5">
          Find the best services and essentials around Taft with peer-verified
          reviews.
        </p>
        <div className="input-group mx-auto mt-5" style={{ maxWidth: "1000px" }}>
          <span className="input-group-text bg-light border-0 rounded-start-pill ps-4 py-2">
            <Search size={20} className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control rounded-end-pill py-3 px-4 bg-light border-0"
            placeholder="Search for laundry, printing, groceries..."
          />
        </div>
      </header>

      {/* Category Section */}
      <section className="container text-center" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <h2 className="fw-bold mb-4">
          Browse reviews by <span style={{ color: "#003e1c" }}>category</span>
        </h2>
        <div className="row g-3 justify-content-center">
          {categories.map((cat) => (
            <div key={cat} className="col-6 col-md-4 col-lg-2">
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
          See the <span style={{ color: "#003e1c" }}>top rated</span>{" "}
          establishments
        </h2>
        <div className="row g-4">
          {establishments.map((store) => (
            <div key={store.id} className="col-md-4">
              <EstablishmentCardSmall 
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
          Help others in the <span style={{ color: "#003e1c" }}>DLSU</span>{" "}
          community
        </h2>
        <div
          className="mx-auto bg-light p-4 mb-4 rounded-4 shadow-sm text-start"
          style={{ maxWidth: "700px" }}
        >
          <div className="d-flex align-items-center mb-3">
            <div
              className="bg-secondary rounded-circle me-3"
              style={{ width: "40px", height: "40px" }}
            ></div>
            <div>
              <p className="mb-0 fw-bold">Leelancze Pacomio</p>
              <small className="text-muted">2 days ago</small>
            </div>
          </div>
          <h5 className="fw-bold">Great service, would recommend!</h5>
          <div className="text-warning mb-2">
            ★★★★★{" "}
            <small className="text-muted text-decoration-underline ms-2">
              National Book Store
            </small>
          </div>
          <p className="text-muted small">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <button className="btn btn-outline-dark rounded-pill px-4 mt-4 fw-bold">
          Write your own review ↗
        </button>
      </section>
    </div>
  );
};

export default LandingPage;
