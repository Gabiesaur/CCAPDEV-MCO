import { Link } from "react-router-dom";
import { Search, MapPin, Star } from "lucide-react";

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
          style={{ maxWidth: "800px" }}
        >
          <div className="d-flex align-items-center mb-3">
            <img
              src="https://ui-avatars.com/api/?name=Leelancze+Pacomio&background=0D8ABC&color=fff"
              className="bg-secondary rounded-circle me-3"
              style={{ width: "40px", height: "40px" }}
            ></img>
            <div>
              <p className="fw-bold" style={{ marginBottom: '-4px' }}>Leelancze Pacomio</p>
              <small className="text-muted">2 days ago</small>
            </div>
          </div>
          <div className="d-flex gap-1 text-dlsu-primary">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={"currentColor"}
                className="text-dlsu-primary"
              />
            ))}
          </div>
          <div className="fw-bold text-dark mt-3 mb-2 fs-5">
            <Link
              className="text-dark text-decoration-none"
              to="/review"  
            >
              The best budget friendly meals on campus!
            </Link>
          </div>
          <p className="text-muted small">
            Ate Rica's remains the gold standard for a quick and affordable meal between classes at Andrew. That signature liquid cheese sauce combined with the smoky bacon bits is an elite flavor combination that never misses. Even during the peak 12:00 PM rush, the service is incredibly efficient so you won't be late for your next lecture. It is the perfect comfort food for those long study sessions or stressful midterms week. I always get extra rice whenever I eat here. Every Archer needs to experience this Taft staple at least once before they graduate.
          </p>
          <div
            className="d-inline-flex align-items-center bg-light border rounded-pill pe-3 ps-1 py-1"
            style={{ maxWidth: "100%" }}
          >
            <img
              src="https://pbs.twimg.com/media/GAeKw8KaYAAis3s.jpg"
              alt="shop"
              className="rounded-circle me-2 object-cover"
              style={{ width: "28px", height: "28px" }}
            />
            <div className="lh-1">
              <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "0.8rem" }}>
                Ate Rica's Bacsilog
              </h6>
              <small
                className="text-muted d-flex align-items-center gap-1"
                style={{ fontSize: "0.7rem" }}
              >
                <MapPin size={10} /> Agno Food Court
              </small>
            </div>
          </div>
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
