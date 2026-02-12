import { UserPlus, Flame, Activity } from "lucide-react";

export default function PublicProfileStatistics({ user }) {
  return (
    <div className="custom-card p-4 sticky-top" style={{ top: "20px" }}>
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

      {/* Follow Button */}
      <div className="mb-4">
        <button className="btn btn-dlsu-light rounded-pill px-3 d-inline-flex align-items-center justify-content-center gap-2 fw-bold shadow-sm">
          <UserPlus size={18} /> Follow
        </button>
      </div>

      {/* Stats Grid */}
      <div className="row text-center g-2 mb-3">
        <div className="col-4">
          <h5 className="fw-bold mb-0">{user.followers}</h5>
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
  );
}
