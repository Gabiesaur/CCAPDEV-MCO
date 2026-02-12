import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import { LogOut, X } from "lucide-react";

export default function MainLayout() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Mock logged-in user
  const [user, setUser] = useState({
    username: "leelanczerscx",
    avatar:
      "https://ui-avatars.com/api/?name=Leelancze+Pacomio&background=0D8ABC&color=fff",
  });

  const handleLogout = () => {
    // 1. Clear user session/state
    setUser(null);
    setShowLogoutConfirm(false);
    // 2. Refresh and redirect to Landing Page
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar user={user} onLogoutClick={() => setShowLogoutConfirm(true)} />

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <Footer />

      {/* Logout Confirmation Modal (Glass Blur) */}
      {showLogoutConfirm && (
        <>
          <div
            className="glass-backdrop fade show"
            style={{ zIndex: 2000 }}
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="modal d-block" style={{ zIndex: 2010 }}>
            <div className="modal-dialog modal-dialog-centered modal-sm">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="modal-body p-4 text-center">
                  <div className="bg-light rounded-circle d-inline-flex p-3 mb-3">
                    <LogOut size={32} className="text-danger" />
                  </div>
                  <h5 className="fw-bold text-dlsu-dark">Logging Out?</h5>
                  <p className="text-muted small">
                    Are you sure you want to log out of your Taftics account?
                  </p>

                  <div className="d-flex flex-column gap-2 mt-4">
                    <button
                      className="btn btn-danger rounded-pill fw-bold py-2"
                      onClick={handleLogout}
                    >
                      Yes, Logout
                    </button>
                    <button
                      className="btn btn-light rounded-pill fw-bold py-2"
                      onClick={() => setShowLogoutConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
