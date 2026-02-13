import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Send, MapPin, ThumbsUp, ThumbsDown } from 'lucide-react';

import Comment from "../components/review/Comment";

const ReviewPage = () => {
  // 1. STATE FOR VOTING
  const [userVote, setUserVote] = useState(null); // 'up', 'down', or null
  const [counts, setCounts] = useState({ up: 12, down: 2 }); // Initial dummy data

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

  const comments = [
    { id: 1, name: "Ate Rica", avatar: "https://static.wixstatic.com/media/52e0bf_f720ed1120f74f6a8dc7c4024f8eb752~mv2_d_1500_1500_s_2.png", owner: true, date: "Yesterday", text: "Glad you liked it! Please come again <3" },
    { id: 2, name: "Leelancze Pacomio", avatar: "https://ui-avatars.com/api/?name=Leelancze+Pacomio&background=0D8ABC&color=fff", owner: false, date: "2 days ago", text: "Forgot to mention, they serve really fast! :)" },
    { id: 3, name: "Martin Manalo", avatar: "https://ui-avatars.com/api/?name=Martin+Manalo&background=F94449&color=fff", owner: false, date: "Yesterday", text: "I love Ate Rica's too!" },
    { id: 4, name: "Gabe Leoncio", avatar: "https://ui-avatars.com/api/?name=Gabe+Leoncio&background=FFAF6E&color=fff", owner: false, date: "Yesterday", text: "Sisig better" },
    { id: 5, name: "Gab Espineli", avatar: "https://ui-avatars.com/api/?name=Gabe+Leoncio&background=9AB180&color=fff", owner: false, date: "2 hours ago", text: "Just had it! Thanks for the reco" }
  ];

  return (
    <div className="bg-white min-vh-100 d-flex flex-column">
      <main className="container flex-grow-1" style={{ paddingTop: '80px', paddingBottom: '100px', maxWidth: '800px' }}>
        <h1 className="fw-bold fs-2 mb-4">Review</h1>

        {/* 1. Main Review Card */}
        <div className="bg-light p-4 rounded-5 shadow-sm text-start mb-5 border-0">
          <div className="d-flex align-items-center mb-3">
            <img
              src="https://ui-avatars.com/api/?name=Leelancze+Pacomio&background=0D8ABC&color=fff"
              className="rounded-circle me-3"
              style={{ width: "40px", height: "40px", objectFit: 'cover' }}
              alt="User"
            />
            <div className="d-flex flex-column">
              <Link to="/profile/leelanczers" className="fw-bold text-decoration-none text-dark" style={{ marginBottom: '-4px' }}>
                Leelancze Pacomio
              </Link>
              <small className="text-muted">2 days ago</small>
            </div>
          </div>

          <div className="d-flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="#48a868" stroke="#48a868" />
            ))}
          </div>

          <h1 className="fw-bold text-dark mb-2 fs-4">
            The best budget friendly meals on campus!
          </h1>
          
          <p className="text-muted lh-base mb-4" style={{ fontSize: '0.95rem' }}>
            Ate Rica's remains the gold standard for a quick and affordable meal between classes at Andrew. That signature liquid cheese sauce combined with the smoky bacon bits is an elite flavor combination that never misses. Even during the peak 12:00 PM rush, the service is incredibly efficient so you won't be late for your next lecture. It is the perfect comfort food for those long study sessions or stressful midterms week. I always get extra rice whenever I eat here. Every Archer needs to experience this Taft staple at least once before they graduate.
          </p>

          <div className="d-flex justify-content-between align-items-center">
            {/* Establishment Tag */}
            <div className="d-inline-flex align-items-center bg-white border border-light-subtle rounded-pill p-2 pe-3 shadow-sm">
              <img
                src="https://pbs.twimg.com/media/GAeKw8KaYAAis3s.jpg"
                className="rounded-circle object-fit-cover me-2"
                style={{ width: "32px", height: "32px" }}
                alt="shop"
              />
              <div className="lh-1">
                <Link to="/establishment" className="fw-bold text-decoration-none text-dark" style={{ fontSize: "0.85rem" }}>Ate Rica's Bacsilog</Link>
                <div className="text-muted d-flex align-items-center gap-1 mt-1" style={{ fontSize: "0.7rem" }}>
                  <MapPin size={10} /> Agno Food Court
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
            {comments.map((comment) => (
              <Comment key={comment.id} {...comment} />
            ))}
          </div>

          <div className="position-relative">
            <input 
              type="text" 
              className="form-control border-0 bg-light rounded-4 py-3 px-4 fs-6 shadow-sm"
              placeholder="Leave a comment"
              style={{ paddingRight: '60px' }}
            />
            <button className="btn position-absolute top-50 end-0 translate-middle-y me-2 text-success shadow-none">
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewPage;