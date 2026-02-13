import React from "react";
import { Target, Users, ShieldCheck } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-vh-100 bg-white font-overpass">
      {/* Hero Section */}
      <div className="bg-dlsu-light py-5 mb-5">
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold text-dlsu-dark mb-3">
            About Taftics
          </h1>
          <p
            className="lead text-dlsu-dark opacity-75 mx-auto"
            style={{ maxWidth: "700px" }}
          >
            The definitive guide to student life in Taft. Built by Lasallians,
            for Lasallians.
          </p>
        </div>
      </div>

      <div className="container pb-5">
        {/* Mission/Vision Section */}
        <div className="row g-5 align-items-center mb-5">
          <div className="col-lg-6">
            <h2 className="fw-bold text-dlsu-dark mb-4 border-start border-4 border-dlsu-primary ps-3">
              Our Mission
            </h2>
            <p className="text-secondary fs-5">
              Taftics was born out of a simple need: helping students navigate
              the dense urban landscape surrounding De La Salle University.
              Whether you're looking for the quietest study nook, the fastest
              laundry service, or the best sisig in town, we provide the
              "tactics" you need to survive and thrive.
            </p>
          </div>
          <div className="col-lg-6">
            <div className="p-4 bg-light rounded-4 border">
              <h4 className="fw-bold text-dlsu-dark mb-3">Why Taftics?</h4>
              <ul className="list-unstyled d-flex flex-column gap-3">
                <li className="d-flex gap-3">
                  <Target className="text-dlsu-primary flex-shrink-0" />
                  <span>
                    <strong>Localized:</strong> Every review is specific to the
                    Taft area.
                  </span>
                </li>
                <li className="d-flex gap-3">
                  <Users className="text-dlsu-primary flex-shrink-0" />
                  <span>
                    <strong>Verified:</strong> Driven by actual student
                    experiences.
                  </span>
                </li>
                <li className="d-flex gap-3">
                  <ShieldCheck className="text-dlsu-primary flex-shrink-0" />
                  <span>
                    <strong>Helpful:</strong> We rank info based on how useful
                    it is to you.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* The Team (Optional placeholder for groupmates) */}
        <div className="text-center mt-5 pt-5 border-top">
          <h3 className="fw-bold text-dlsu-dark mb-4">Meet the Team</h3>
          <div className="row justify-content-center g-4">
            {/* Team Member 1 */}
            <div className="col-md-3">
              <div className="custom-card p-4 h-100">
                <img
                  src="https://ui-avatars.com/api/?name=Jose+Gabriel+Espineli&background=00441B&color=fff"
                  className="rounded-circle mb-3 shadow-sm"
                  width="80"
                  height="80"
                  alt="Jose Gabriel Espineli"
                />
                <h6 className="fw-bold mb-1">Jose Gabriel Espineli</h6>
                <small className="text-muted">Full Stack Developer</small>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="col-md-3">
              <div className="custom-card p-4 h-100">
                <img
                  src="https://ui-avatars.com/api/?name=Ronald+Gabriel+Leoncio&background=00441B&color=fff"
                  className="rounded-circle mb-3 shadow-sm"
                  width="80"
                  height="80"
                  alt="Ronald Gabriel Leoncio"
                />
                <h6 className="fw-bold mb-1">Ronald Gabriel Leoncio</h6>
                <small className="text-muted">Full Stack Developer</small>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="col-md-3">
              <div className="custom-card p-4 h-100">
                <img
                  src="https://ui-avatars.com/api/?name=Leelancze+Naethan+Pacomio&background=00441B&color=fff"
                  className="rounded-circle mb-3 shadow-sm"
                  width="80"
                  height="80"
                  alt="Leelancze Naethan Pacomio"
                />
                <h6 className="fw-bold mb-1">Leelancze Naethan Pacomio</h6>
                <small className="text-muted">Full Stack Developer</small>
              </div>
            </div>
            {/* Team Member 4 */}
            <div className="col-md-3">
              <div className="custom-card p-4 h-100">
                <img
                  src="https://ui-avatars.com/api/?name=Carl+Martin+Manalo&background=00441B&color=fff"
                  className="rounded-circle mb-3 shadow-sm"
                  width="80"
                  height="80"
                  alt="Carl Martin Manalo"
                />
                <h6 className="fw-bold mb-1">Carl Martin Manalo</h6>
                <small className="text-muted">Full Stack Developer</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
