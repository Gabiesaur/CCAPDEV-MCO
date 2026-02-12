import { useState } from "react";
import { UserPlus, UserCheck, Flame, Activity, X } from "lucide-react";

export default function PublicProfileStatistics({ user }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleFollowClick = () => {
    if (isFollowing) {
      setShowConfirm(true); // Open confirmation if already following
    } else {
      setIsFollowing(true); // Follow immediately if not following
    }
  };

  const confirmUnfollow = () => {
    setIsFollowing(false);
    setShowConfirm(false);
  };

  return (
    <>
      <div className="custom-card p-4 sidebar-sticky">
        {/* Header */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <h5 className="fw-bold text-dlsu-dark mb-0">{user.name}</h5>
          <span
            className="badge bg-dlsu-dark rounded-pill"
            style={{ fontSize: "0.75rem" }}
          >
            ID {user.idSeries}
          </span>
        </div>

        {/* Dynamic Follow Button */}
        <div className="mb-4">
          <button
            className={`btn rounded-pill px-4 d-inline-flex align-items-center justify-content-center gap-2 fw-bold shadow-sm transition-all ${
              isFollowing ? "btn-outline-secondary" : "btn-dlsu-light"
            }`}
            onClick={handleFollowClick}
          >
            {isFollowing ? (
              <>
                <UserCheck size={18} /> Following
              </>
            ) : (
              <>
                <UserPlus size={18} /> Follow
              </>
            )}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="row text-center g-2 mb-3">
          <div className="col-4">
            <h5 className="fw-bold mb-0">
              {isFollowing ? user.followers + 1 : user.followers}
            </h5>
            <small className="text-muted" style={{ fontSize: "0.75rem" }}>
              Followers
            </small>
          </div>
          <div className="col-4">
            <h5 className="fw-bold mb-0">{user.helpfulCount}</h5>
            <small className="text-muted" style={{ fontSize: "0.75rem" }}>
              Helpful
            </small>
          </div>
          <div className="col-4">
            <h5 className="fw-bold mb-0">{user.contributions}</h5>
            <small className="text-muted" style={{ fontSize: "0.75rem" }}>
              Contributions
            </small>
          </div>
        </div>
      </div>

      {/* Unfollow Confirmation Modal (Glass Blur) */}
      {showConfirm && (
        <>
          <div
            className="glass-backdrop fade show"
            style={{ zIndex: 2000 }}
            onClick={() => setShowConfirm(false)}
          />
          <div className="modal d-block" style={{ zIndex: 2010 }}>
            <div className="modal-dialog modal-dialog-centered modal-sm">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-body p-4 text-center">
                  <div className="bg-light rounded-circle d-inline-flex p-3 mb-3">
                    <X size={32} className="text-danger" />
                  </div>
                  <h5 className="fw-bold text-dlsu-dark">
                    Unfollow @{user.username}?
                  </h5>
                  <p className="text-muted small">
                    You'll stop seeing their latest reviews and contributions in
                    your feed.
                  </p>

                  <div className="d-flex flex-column gap-2 mt-4">
                    <button
                      className="btn btn-danger rounded-pill fw-bold"
                      onClick={confirmUnfollow}
                    >
                      Unfollow
                    </button>
                    <button
                      className="btn btn-light rounded-pill fw-bold"
                      onClick={() => setShowConfirm(false)}
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
    </>
  );
}
