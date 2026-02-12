import { MessageSquare, Star } from "lucide-react";

/**
 * @param {Object} props
 * @param {Object} props.comment - The comment data
 * @param {boolean} props.isOwnProfile - TRUE if viewing "My Profile", FALSE if viewing others
 */
export default function ProfileComments({ comment, isOwnProfile }) {
  return (
    <div className="custom-card p-4 mb-3">
      {/* Context Header */}
      <div className="border-bottom pb-2 mb-3 d-flex align-items-center gap-2 small text-muted">
        <MessageSquare size={14} />
        <span>
          Commented on{" "}
          <strong className="text-dark">{comment.postTitle}</strong> by{" "}
          {comment.postAuthor}
        </span>
        <span>•</span>
        <span className="d-flex align-items-center gap-1 text-dlsu-primary">
          <Star size={18} fill="currentColor" /> {comment.postRating}
        </span>
      </div>

      {/* Dynamic Author */}
      <div className="d-flex gap-2 align-items-center mb-2">
        {isOwnProfile ? (
          <span className="fw-bold text-dlsu-primary small">You</span>
        ) : (
          <span className="fw-bold text-dlsu-dark small">{comment.user}</span>
        )}

        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
          {comment.date}
        </small>
      </div>

      {/* Comment Body */}
      <p className="text-dark small mb-0">{comment.body}</p>
    </div>
  );
}
