import { Star, Send, MapPin } from 'lucide-react';

const ReviewPage = () => {
  return (
    <div className="bg-white min-vh-100 d-flex flex-column">
      {/* Main Content Area */}
      <main className="container flex-grow-1" style={{ paddingTop: '80px', paddingBottom: '100px', maxWidth: '800px' }}>
        <h1 className="fw-bold fs-2 mb-4">Review</h1>

        {/* 1. Main Review Card */}
        <div
          className="mx-auto bg-light p-4 rounded-4 shadow-sm text-start"
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
          <h1 className="text-dark text-decoration-none fw-bold text-dark mt-3 mb-2 fs-5">
            The best budget friendly meals on campus!
          </h1>
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

        {/* 2. Comments Section */}
        <div className="px-2" style={{ marginTop: '48px' }}>
          <h1 className="fs-3 fw-bold mb-4">Comments</h1>

          {/* Individual Comment */}
          <div className="mb-5">
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
            <p className="text-dark fs-6 ps-1">Forgot to mention, they serve really fast! :)</p>
          </div>

          {/* Comment Input Field */}
          <div className="position-relative">
            <input 
              type="text" 
              className="form-control border-0 bg-light rounded-pill py-3 px-4 fs-6 shadow-sm"
              placeholder="Leave a comment"
              style={{ paddingRight: '60px' }}
            />
            <button 
              className="btn position-absolute top-50 end-0 translate-middle-y me-2 text-muted"
              style={{ background: 'none', border: 'none' }}
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewPage;