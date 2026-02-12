import { Camera } from "lucide-react";

export default function ProfileHeader({
  avatar,
  name,
  username,
  isOwnProfile,
  onCameraClick, // 1. Add this prop
}) {
  return (
    <div style={{ width: "100%" }}>
      {/* Green Banner */}
      <div
        className="bg-dlsu-dark position-relative"
        style={{ height: "200px" }}
      >
        <div className="container h-100 px-4 d-flex align-items-end pb-3">
          {/* Avatar Wrapper */}
          <div
            className="position-relative"
            style={{ marginBottom: "-50px", marginRight: "20px" }}
          >
            <img
              src={avatar}
              alt={name}
              className="rounded-circle border border-4 border-white shadow bg-white object-cover"
              style={{ width: "160px", height: "160px" }}
            />
            {isOwnProfile && (
              <button
                onClick={onCameraClick}
                className="btn btn-light border position-absolute bottom-0 end-0 rounded-circle p-2 shadow-sm"
                style={{ margin: "5px" }}
              >
                <Camera size={20} className="text-secondary" />
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="mb-2 text-white" style={{ paddingTop: "10px" }}>
            <h1
              className="fw-bold mb-0"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
            >
              {name}
            </h1>
            <p className="fs-5 mb-0 opacity-75">@{username}</p>
          </div>
        </div>
      </div>

      <div style={{ height: "60px" }}></div>
    </div>
  );
}
