import { Link } from "react-router-dom"; // 1. Import Link
import { MessageSquare, Star } from "lucide-react";

/**
 * @param {Object} props
 * @param {Object} props.comment - The comment data
 * @param {boolean} props.isOwnProfile - TRUE if viewing "My Profile", FALSE if viewing others
 */
export default function ProfileComments({ comment, isOwnProfile }) {
  // Path for the person who WROTE the comment (The Profile Owner)
  const profilePath = `/profile/${comment.user}`;

  // Path for the person who wrote the POST being commented on
  const postAuthorPath = `/profile/${comment.postAuthor}`;

  return (
    <div className="custom-card p-4 mb-3">
      {/* Context Header */}
      <div className="border-bottom pb-2 mb-3 d-flex align-items-center gap-2 small text-muted">
        <MessageSquare size={14} />
        <span>
          Commented on{" "}
          <strong className="text-dark">{comment.postTitle}</strong> by{" "}
          {/* 2. Make the Post Author Clickable */}
          <Link
            to={postAuthorPath}
            className="fw-bold text-dark text-decoration-none hover-underline"
            style={{ transition: "color 0.2s" }}
          >
            {comment.postAuthor}
          </Link>
        </span>
        <span>•</span>
        <span className="d-flex align-items-center gap-1 text-dlsu-primary">
          <Star size={18} fill="currentColor" /> {comment.postRating}
        </span>
      </div>

      {/* Comment Body */}
      <p className="mb-3 text-dark">{comment.body}</p>

      {/* Dynamic Author (The Commenter) */}
      <div className="d-flex gap-2 align-items-center">
        {isOwnProfile ? (
          <span className="fw-bold text-dlsu-primary small bg-dlsu-light px-2 py-1 rounded-2">
            You
          </span>
        ) : (
          <span className="fw-bold text-dlsu-dark small">
            <Link
              to={profilePath}
              className="text-decoration-none text-dlsu-dark"
            >
              {comment.user}
            </Link>
          </span>
        )}

        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
          • {comment.date}
        </small>
      </div>
    </div>
  );
}
