import { Link } from 'react-router-dom';

const Comment = ({ name, avatar, owner, date, text }) => {
  return (
    <div className="mb-4 p-4 bg-light rounded-4 shadow-sm">
      <div className="d-flex align-items-center mb-3">
          <img
            src={avatar}
            className="bg-secondary rounded-circle me-3"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
            alt={name}
          />
          <div>
            <div className="d-flex align-items-center gap-2" style={{ marginBottom: '-4px' }}>
              <Link to="../profile/leelanczers" className="text-decoration-none text-dark fw-bold mb-0">{name}</Link>
              
              {owner && (
                <span 
                  className="badge p-1 rounded-pill bg-dlsu-light text-dlsu-dark border fw-bold" 
                  style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                >
                  establishment owner
                </span>
              )}
            </div>
            <small className="text-muted">{date}</small>
          </div>
      </div>
      <p className="text-dark fs-6 mb-0">{text}</p>
    </div>
  );
}

export default Comment;