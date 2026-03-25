import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Star, Send, MapPin, ThumbsUp, ThumbsDown, CheckCircle2, Loader2 } from 'lucide-react';

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
  if (typeof value === 'object' && value._id) return value._id;
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
  const { id } = useParams(); // URL ID is the ultimate source of truth

  // Core Data States
  const [review, setReview] = useState(null);
  const [establishment, setEstablishment] = useState(null);
  const [comments, setComments] = useState([]);
  
  // Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);

  // Voting State
  const [userVote, setUserVote] = useState(null);
  const [counts, setCounts] = useState({ up: 0, down: 0 });

  // Comment State
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // MAIN FETCH HOOK: Runs whenever the URL ID changes
  useEffect(() => {
    if (!id) return;

    const fetchPageData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch the Review
        const reviewRes = await fetch(`http://localhost:3000/api/reviews/${id}`);
        if (!reviewRes.ok) throw new Error("Review not found");
        
        const reviewData = await reviewRes.json();
        setReview(reviewData);
        setCounts({
          up: reviewData.helpfulVotes || 0,
          down: reviewData.unhelpfulVotes || 0,
        });

        // 2. Safely extract Establishment ID and fetch Establishment details
        const estId = getEntityId(reviewData.establishmentId);
        if (estId) {
          const estRes = await fetch(`http://localhost:3000/api/establishments/${estId}`);
          if (estRes.ok) {
            const estData = await estRes.json();
            setEstablishment(estData);
          }
        }

        // 3. Fetch the Comments for this review
        setLoadingComments(true);
        const commentsRes = await fetch(`http://localhost:3000/api/reviews/${id}/comments`);
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          const commentsArray = Array.isArray(commentsData) ? commentsData : [];
          
          // Sort: Establishment Owner Priority first, then by Date (Newest)
          const sortedComments = [...commentsArray].sort((a, b) => {
            const aIsOwner = getEntityId(a?.userId?.ownedEstablishmentId) === estId;
            const bIsOwner = getEntityId(b?.userId?.ownedEstablishmentId) === estId;
            
            if (aIsOwner && !bIsOwner) return -1;
            if (!aIsOwner && bIsOwner) return 1;
            
            // Secondary sort: Date (Newest first)
            return new Date(b.date) - new Date(a.date);
          });
          
          setComments(sortedComments);
        } else {
          setComments([]);
        }

      } catch (error) {
        console.error("Error fetching review data:", error);
        setReview(null);
      } finally {
        setIsLoading(false);
        setLoadingComments(false);
      }
    };

    fetchPageData();
  }, [id]);

  const handleVote = (type) => {
    setCounts((prev) => {
      const newCounts = { ...prev };
      if (userVote === type) {
        newCounts[type] -= 1;
        setUserVote(null);
      } else if (userVote && userVote !== type) {
        newCounts[userVote] -= 1;
        newCounts[type] += 1;
        setUserVote(type);
      } else {
        newCounts[type] += 1;
        setUserVote(type);
      }
      return newCounts;
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // Get user
    const storedUser = sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    // Check if logged in
    if (!currentUser?._id) {
      triggerToast("You must be logged in to comment.");
      return;
    }

    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch(`http://localhost:3000/api/reviews/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id, text: commentText.trim() }),
      });

      // Check for errors
      let data;
      try {
        data = await res.json();
      } catch (_) {
        triggerToast("Server error.");
        return;
      }

      if (!res.ok) {
        triggerToast(data.message || "Failed to post comment.");
        return;
      }

      // Re-sort to maintain Owner Priority
      const estId = getEntityId(review?.establishmentId);
      setComments((prev) => {
        const updated = [data.comment, ...prev];
        return [...updated].sort((a, b) => {
          const aIsOwner = getEntityId(a?.userId?.ownedEstablishmentId) === estId;
          const bIsOwner = getEntityId(b?.userId?.ownedEstablishmentId) === estId;
          if (aIsOwner && !bIsOwner) return -1;
          if (!aIsOwner && bIsOwner) return 1;
          return new Date(b.date) - new Date(a.date);
        });
      });
      
      setCommentText("");
      triggerToast("Comment posted!");
    } catch (error) {
      // Check for errors
      triggerToast(`Network error: ${error.message}`);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Show a loading spinner while waiting for the backend
  if (isLoading) {
    return (
      <div className="bg-white min-vh-100 d-flex align-items-center justify-content-center">
        <Loader2 className="spin text-success" size={48} />
      </div>
    );
  }

  // Show the Not Found page ONLY if loading finished and no review was found
  if (!review) {
    return (
      <div className="bg-white min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h1 className="fw-bold fs-3">Review not found</h1>
          <p className="text-muted mb-4">This review may have been deleted or the URL is incorrect.</p>
          <Link to="/browse" className="btn btn-success">Back to Browse</Link>
        </div>
      </div>
    );
  }

  const author = getAuthorFromReview(review);
  const reviewTitle = review?.title || "Review";
  const reviewBody = review?.body || review?.content || "No review content available.";
  const reviewDate = getRelativeDate(review?.date || review?.createdAt);
  const reviewRating = Number(review?.rating || 0);

  const establishmentName = establishment?.name || "Establishment";
  const establishmentLocation = establishment?.location || "Unknown location";
  const establishmentImage = establishment?.image || "https://ui-avatars.com/api/?name=Establishment";
  const establishmentId = getEntityId(establishment?._id) || getEntityId(review?.establishmentId);

  return (
    <div className="bg-white min-vh-100 d-flex flex-column position-relative">
      {/* Toast Notification */}
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

            {/* Voting Buttons */}
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
              <div className="d-flex align-items-center gap-2 text-muted">
                 <Loader2 size={16} className="spin" /> Loading comments...
              </div>
            ) : comments.length === 0 ? (
              <p className="text-muted mb-0">No comments yet.</p>
            ) : (
              comments.map((comment, index) => {
                const commentId = getEntityId(comment?._id) || comment?.id || `${id}-comment-${index}`;
                const commentAuthor = getAuthorFromComment(comment);
                const commentDate = getRelativeDate(comment?.date);

                // Check if commenter owns the establishment this review belongs to
                const commentUserOwnedEst = getEntityId(comment?.userId?.ownedEstablishmentId);
                const reviewEstId = getEntityId(review?.establishmentId);
                const isOwner = !!(commentUserOwnedEst && reviewEstId && commentUserOwnedEst === reviewEstId);

                return (
                  <div key={commentId} className={`mb-4 p-4 rounded-4 shadow-sm ${isOwner ? 'border border-success bg-dlsu-light' : 'bg-light'}`}>
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
                        {isOwner && (
                          <span
                            className="badge rounded-pill fw-bold me-1 mt-1 d-inline-block bg-dlsu-light text-dlsu-dark border"
                            style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '3px 7px' }}
                          >
                            Establishment Owner
                          </span>
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
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isSubmittingComment}
              required
            />
            <button
              type="submit"
              className="btn position-absolute top-50 end-0 translate-middle-y me-2 text-success shadow-none"
              disabled={isSubmittingComment || !commentText.trim()}
            >
              {isSubmittingComment ? <Loader2 size={20} className="spin" /> : <Send size={20} />}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ReviewPage;