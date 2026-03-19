import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Star, Send, MapPin, ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';

const getRelativeDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
};

const getAuthorFromReview = (review) => {
  const userObj = review?.userId || {};
  const displayName = userObj.name || userObj.username || review?.user || "Unknown User";
  const username = userObj.username || review?.username || null;
  const avatar = userObj.avatar || review?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`;

  return { displayName, username, avatar };
};

const getEntityId = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.$oid) return value.$oid;
  return null;
};

const getAuthorFromComment = (comment) => {
  const userObj = comment?.userId || {};
  const displayName = userObj.name || userObj.username || comment?.user || "Unknown User";
  const username = userObj.username || comment?.username || null;
  const avatar = userObj.avatar || comment?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`;

  return { displayName, username, avatar };
};

const ReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const stateReview = location.state?.review || null;
  const stateEstablishment = location.state?.establishment || null;

  const storageKey = `review-page:${id || "unknown"}`;
  const storedState = useMemo(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [storageKey]);

  const [review, setReview] = useState(stateReview || storedState?.review || null);
  const [establishment, setEstablishment] = useState(stateEstablishment || storedState?.establishment || null);
  const [comments, setComments] = useState(stateReview?.comments || storedState?.review?.comments || []);
  const [loadingComments, setLoadingComments] = useState(false);

  // 1. STATE FOR VOTING
  const [userVote, setUserVote] = useState(null); // 'up', 'down', or null
  const [counts, setCounts] = useState({
    up: stateReview?.helpfulVotes || storedState?.review?.helpfulVotes || 0,
    down: stateReview?.unhelpfulVotes || storedState?.review?.unhelpfulVotes || 0,
  });

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    if (stateReview) {
      setReview(stateReview);
      setCounts({
        up: stateReview.helpfulVotes || 0,
        down: stateReview.unhelpfulVotes || 0,
      });
      setUserVote(null);
    }

    if (stateEstablishment) {
      setEstablishment(stateEstablishment);
    }
  }, [stateReview, stateEstablishment]);

  useEffect(() => {
    if (!review) return;

    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({ review, establishment })
      );
    } catch {
      // Ignore session storage failures
    }
  }, [review, establishment, storageKey]);

  const handleVote = (type) => {
    setCounts((prev) => {
      const newCounts = { ...prev };

      // Case 1: Clicking the same button again (Undo)
      if (userVote === type) {
        newCounts[type] -= 1;
        setUserVote(null);
      }
      // Case 2: Switching from one vote to another (e.g., Up -> Down)
      else if (userVote && userVote !== type) {
        newCounts[userVote] -= 1;
        newCounts[type] += 1;
        setUserVote(type);
      }
      // Case 3: First time voting
      else {
        newCounts[type] += 1;
        setUserVote(type);
      }

      return newCounts;
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    triggerToast("Comment submitted! Redirecting...");
    setTimeout(() => {
      navigate(`/review/${review?._id || review?.id || id}`);
    }, 2000);
  };

  const author = getAuthorFromReview(review);
  const reviewTitle = review?.title || "Review";
  const reviewBody = review?.body || "No review content available.";
  const reviewDate = getRelativeDate(review?.date);
  const reviewRating = Number(review?.rating || 0);
  const reviewId = getEntityId(review?._id) || review?.id || id;

  const establishmentName = establishment?.name || "Establishment";
  const establishmentLocation = establishment?.location || "Unknown location";
  const establishmentImage = establishment?.image || "https://ui-avatars.com/api/?name=Establishment";
  const establishmentId = getEntityId(establishment?._id) || getEntityId(review?.establishmentId) || review?.establishmentId;

  useEffect(() => {
    const fetchComments = async () => {
      if (!reviewId) {
        setComments([]);
        return;
      }

      setLoadingComments(true);
      try {
        const commentsRes = await fetch(`http://localhost:5000/api/reviews/${reviewId}/comments`);

        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          setComments(Array.isArray(commentsData) ? commentsData : []);
          return;
        }

        // Fallback to the review payload if comments endpoint fails.
        const reviewRes = await fetch(`http://localhost:5000/api/reviews/${reviewId}`);
        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          setComments(Array.isArray(reviewData?.comments) ? reviewData.comments : []);
        } else {
          setComments([]);
        }
      } catch {
        setComments([]);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [reviewId]);

  if (!review) {
    return (
      <div className="bg-white min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h1 className="fw-bold fs-3">Review not found</h1>
          <p className="text-muted mb-4">Open a review from an establishment page to load it here.</p>
          <Link to="/browse" className="btn btn-success">Back to Browse</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-vh-100 d-flex flex-column position-relative">
      {/* Toast Notification (Matching MyProfilePage style) */}
      {showToast && (
        <div className="toast-success-custom fw-bold" style={{ zIndex: 9999 }}>
          <CheckCircle2 size={24} />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="container flex-grow-1" style={{ paddingTop: '80px', paddingBottom: '100px', maxWidth: '800px' }}>
        <h1 className="fw-bold fs-2 mb-4">Review</h1>

        {/* 1. Main Review Card */}
        <div className="bg-light p-4 rounded-5 shadow-sm text-start mb-5 border-0">
          <div className="d-flex align-items-center mb-3">
            <img
              src={author.avatar}
              className="rounded-circle me-3"
              style={{ width: "40px", height: "40px", objectFit: 'cover' }}
              alt="User"
            />
            <div className="d-flex flex-column">
              {author.username ? (
                <Link to={`/profile/${author.username}`} className="fw-bold text-decoration-none text-dark" style={{ marginBottom: '-4px' }}>
                  {author.displayName}
                </Link>
              ) : (
                <span className="fw-bold text-dark" style={{ marginBottom: '-4px' }}>
                  {author.displayName}
                </span>
              )}
              <small className="text-muted">{reviewDate}</small>
            </div>
          </div>

          <div className="d-flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                fill={i < reviewRating ? "#48a868" : "none"}
                stroke="#48a868"
              />
            ))}
          </div>

          <h1 className="fw-bold text-dark mb-2 fs-4">
            {reviewTitle}
          </h1>

          <p className="text-muted lh-base mb-4" style={{ fontSize: '0.95rem' }}>
            {reviewBody}
          </p>

          <div className="d-flex justify-content-between align-items-center">
            {/* Establishment Tag */}
            <div className="d-inline-flex align-items-center bg-white border border-light-subtle rounded-pill p-2 pe-3 shadow-sm">
              <img
                src={establishmentImage}
                className="rounded-circle object-fit-cover me-2"
                style={{ width: "32px", height: "32px" }}
                alt="shop"
              />
              <div className="lh-1">
                <Link
                  to={establishmentId ? `/establishment/${establishmentId}` : "/browse"}
                  state={establishment ? { establishment } : undefined}
                  className="fw-bold text-decoration-none text-dark"
                  style={{ fontSize: "0.85rem" }}
                >
                  {establishmentName}
                </Link>
                <div className="text-muted d-flex align-items-center gap-1 mt-1" style={{ fontSize: "0.7rem" }}>
                  <MapPin size={10} /> {establishmentLocation}
                </div>
              </div>
            </div>

            {/* Voting Buttons with Counts */}
            <div className="d-flex gap-3 align-items-center px-2">
              <button
                className="btn p-0 border-0 shadow-none d-flex align-items-center gap-2 transition-all"
                onClick={() => handleVote('up')}
                style={{ color: userVote === 'up' ? '#48a868' : '#adb5bd' }}
              >
                <ThumbsUp size={24} fill={userVote === 'up' ? '#48a868' : 'none'} />
                <span className="fw-bold small">{counts.up}</span>
              </button>

              <button
                className="btn p-0 border-0 shadow-none d-flex align-items-center gap-2 transition-all"
                onClick={() => handleVote('down')}
                style={{ color: userVote === 'down' ? '#dc3545' : '#adb5bd' }}
              >
                <ThumbsDown size={24} fill={userVote === 'down' ? '#dc3545' : 'none'} />
                <span className="fw-bold small">{counts.down}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Comments Section */}
        <div style={{ marginTop: '48px' }}>
          <h1 className="fs-3 fw-bold mb-4">Comments</h1>
          <div className="mb-5 ps-1">
            {loadingComments ? (
              <p className="text-muted mb-0">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-muted mb-0">No comments yet.</p>
            ) : (
              comments.map((comment, index) => {
                const commentId = getEntityId(comment?._id) || comment?.id || `${reviewId}-comment-${index}`;
                const commentAuthor = getAuthorFromComment(comment);
                const commentDate = getRelativeDate(comment?.date);

                return (
                  <div key={commentId} className="mb-4 p-4 bg-light rounded-4 shadow-sm">
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={commentAuthor.avatar}
                        className="rounded-circle me-3"
                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                        alt={commentAuthor.displayName}
                      />
                      <div>
                        {commentAuthor.username ? (
                          <Link to={`/profile/${commentAuthor.username}`} className="text-decoration-none text-dark fw-bold" style={{ marginBottom: '-4px' }}>
                            {commentAuthor.displayName}
                          </Link>
                        ) : (
                          <div className="text-dark fw-bold" style={{ marginBottom: '-4px' }}>
                            {commentAuthor.displayName}
                          </div>
                        )}
                        <small className="text-muted d-block">{commentDate}</small>
                      </div>
                    </div>

                    <p className="text-dark fs-6 mb-0">{comment?.text || ""}</p>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="position-relative">
            <input
              type="text"
              className="form-control border-0 bg-light rounded-4 py-3 px-4 fs-6 shadow-sm"
              placeholder="Leave a comment"
              style={{ paddingRight: '60px' }}
              required
            />
            <button type="submit" className="btn position-absolute top-50 end-0 translate-middle-y me-2 text-success shadow-none">
              <Send size={20} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ReviewPage;