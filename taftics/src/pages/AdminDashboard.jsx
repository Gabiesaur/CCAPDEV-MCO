import React, { useState, useEffect } from "react";
// --- ICONS: lucide-react ---
import {
  Users,
  Store,
  MessageSquare,
  CheckCircle,
  XCircle,
  Shield,
  TrendingUp,
  Search,
  MoreVertical,
  Plus
} from "lucide-react";

const AdminDashboard = ({ user }) => {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReviews: 0,
    totalEstablishments: 0,
    pendingEstablishments: 0,
    reviewsOverTime: []
  });
  const [pendingList, setPendingList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEst, setSelectedEst] = useState(null);
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [deletionList, setDeletionList] = useState([]);
  const [selectedDeletionEst, setSelectedDeletionEst] = useState(null);

  // --- SEARCH STATE ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- FORM STATE: OWNER CREATION ---
  const [ownerForm, setOwnerForm] = useState({
    username: "",
    name: "",
    email: "",
    password: ""
  });
  const [formError, setFormError] = useState("");

  // --- EFFECTS: INITIAL DATA FETCH ---
  useEffect(() => {
    fetchStats();
    fetchPending();
    fetchUsers();
    fetchDeletionRequests();
  }, []);

  // --- ACTIONS: DATA FETCHING ---
  const fetchStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchPending = async () => {
    // --- ACTIONS: DATA FETCHING ---
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/pending-establishments`);
      const data = await res.json();
      setPendingList(data);
    } catch (err) {
      console.error("Error fetching pending:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletionRequests = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/deletion-requests`);
      const data = await res.json();
      setDeletionList(data);
    } catch (err) {
      console.error("Error fetching deletion requests:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
      const data = await res.json();
      setUserList(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleApproveClick = (est) => {
    setSelectedEst(est);
    setOwnerForm({
      username: est.name.toLowerCase().replace(/\s+/g, "_") + "_owner",
      name: est.contactPerson || "",
      email: est.email || "",
      password: "password123" // Default password
    });
    setShowApproveModal(true);
  };

  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/establishments/${selectedEst._id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ownerForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowApproveModal(false);
        fetchPending();
        fetchStats();
      } else {
        setFormError(data.message);
      }
    } catch (err) {
      setFormError("Failed to approve. Server error.");
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this establishment? This will permanently delete the application.")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/establishments/${id}`, {
          method: "DELETE"
        });
        const data = await res.json();
        if (data.success) {
          setShowDetailsModal(false); // Close details modal if open
          fetchPending();
          fetchStats();
        }
      } catch (err) {
        console.error("Error rejecting:", err);
      }
    }
  };

  const handleApproveDeletion = async (id) => {
    if (window.confirm("This will permanently delete the establishment. Are you sure?")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/establishments/${id}/handle-deletion`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "approve" })
        });
        const data = await res.json();
        if (data.success) {
          setShowDeletionModal(false);
          fetchDeletionRequests();
          fetchStats();
        }
      } catch (err) {
        console.error("Error approving deletion:", err);
      }
    }
  };

  const handleRejectDeletion = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/establishments/${id}/handle-deletion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" })
      });
      const data = await res.json();
      if (data.success) {
        setShowDeletionModal(false);
        fetchDeletionRequests();
      }
    } catch (err) {
      console.error("Error rejecting deletion:", err);
    }
  };

  // --- ACTIONS: MODERATION & USER ROLES ---
  const toggleAdmin = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}/role`, {
        method: "PUT"
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      }
    } catch (err) {
      console.error("Error toggling role:", err);
    }
  };

  // --- RENDER: MAIN DASHBOARD ---
  return (
    <div className="container-fluid py-4 px-lg-5" style={{ minHeight: "90vh", backgroundColor: "#f8f9fa" }}>
      {/* --- DASHBOARD HEADER & TAB NAVIGATION --- */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="fw-bold mb-0 text-dlsu-dark">Admin Dashboard</h2>
          <p className="text-muted mb-0">Platform Overview & Moderation</p>
        </div>
        <div className="bg-white rounded-pill p-1 shadow-sm border d-flex">
          {["overview", "verification", "requests", "users"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn rounded-pill px-4 py-2 fw-bold text-capitalize border-0 transition-all ${activeTab === tab ? "bg-dlsu-dark text-white shadow" : "btn-light text-muted"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* --- TAB CONTENT: OVERVIEW (STATISTICS) --- */}
      {activeTab === "overview" && (
        <div className="row g-4 mb-4 align-items-start">
          {/* LEFT: Major Review Stat & Growth Chart */}
          <div className="col-lg-8">
            <div className="bg-white p-4 rounded-4 shadow-sm border-0 d-flex flex-column h-auto" style={{ minHeight: '180px' }}>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="p-3 rounded-4 shadow-sm" style={{ backgroundColor: '#00a86b', color: 'white' }}>
                  <MessageSquare size={32} />
                </div>
                <div>
                  <h2 className="fw-bold mb-0 text-dlsu-dark" style={{ fontSize: '2.5rem', lineHeight: 1 }}>{stats.totalReviews}</h2>
                  <p className="text-secondary fw-bold mb-0 text-uppercase tracking-wide smaller" style={{ letterSpacing: '1px' }}>Total Platform Reviews</p>
                </div>
              </div>

              <div className="position-relative w-100 mt-2" style={{ height: '500px' }}>
                <ReviewChart data={stats.reviewsOverTime || []} />
              </div>
            </div>
          </div>

          {/* RIGHT: Other Platform Metrics in a vertical stack */}
          <div className="col-lg-4">
            <div className="d-flex flex-column gap-3">
              <StatCard title="Total Users" value={stats.totalUsers} icon={<Users />} color="#006a4e" />
              <StatCard title="Official Places" value={stats.totalEstablishments} icon={<Store />} color="#20c997" />
              <StatCard title="Pending Approvals" value={stats.pendingEstablishments} icon={<TrendingUp />} color="#ffc107" />
            </div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: TABLES CONTAINER (VERIFICATION & USERS) --- */}
      <div className="bg-white rounded-4 shadow-sm border-0 overflow-hidden">
        {activeTab === "verification" && (
          <div className="p-0">
            <div className="p-4 border-bottom">
              <h5 className="fw-bold mb-0">Pending Establishments</h5>
              <p className="text-muted small mb-0">Review applications for official status</p>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light text-muted small">
                  <tr>
                    <th className="px-4 py-3">Establishment</th>
                    <th className="py-3">Category</th>
                    <th className="py-3">Contact</th>
                    <th className="py-3 text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">No pending applications found.</td>
                    </tr>
                  ) : (
                    pendingList.map((est) => (
                      <tr key={est._id}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="bg-light rounded-3 p-2" style={{ width: "40px", height: "40px" }}>
                              <Store size={24} className="text-dlsu-dark" />
                            </div>
                            <div>
                              <div className="fw-bold">{est.name}</div>
                              <div className="text-muted small">{est.location}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge bg-light text-dark fw-normal rounded-pill px-3">{est.category}</span></td>
                        <td>
                          <div className="small fw-semibold">{est.contactPerson}</div>
                          <div className="text-muted smaller">{est.email}</div>
                        </td>
                        <td className="text-end px-4">
                          <button
                            className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold"
                            onClick={() => {
                              setSelectedEst(est);
                              setShowDetailsModal(true);
                            }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="p-0">
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-0">User Management</h5>
                <p className="text-muted small mb-0">Manage permissions and roles</p>
              </div>
              <div className="input-group" style={{ width: "300px" }}>
                <span className="input-group-text bg-white border-end-0 rounded-start-pill"><Search size={16} /></span>
                <input 
                  type="text" 
                  className="form-control border-start-0 rounded-end-pill" 
                  placeholder="Search users..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light text-muted small">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="py-3">Role</th>
                    <th className="py-3">Activity</th>
                    <th className="py-3 text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.filter(u => (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.username?.toLowerCase().includes(searchTerm.toLowerCase()))).map((u) => (
                    <tr key={u._id}>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <img src={u.avatar} className="rounded-circle border" style={{ width: "36px", height: "36px" }} />
                          <div>
                            <div className="fw-bold">{u.name || u.username}</div>
                            <div className="text-muted small">@{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {u.isAdmin ? (
                          <span className="badge bg-danger-subtle text-danger rounded-pill px-3 border border-danger-subtle">Admin</span>
                        ) : u.idSeries === "owner" ? (
                          <span className="badge p-1 px-3 rounded-pill bg-dlsu-light text-dlsu-dark border fw-bold shadow-sm" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Establishment Owner</span>
                        ) : (
                          <span className="badge bg-light text-dark fw-normal rounded-pill px-3 border">Student</span>
                        )}
                      </td>
                      <td className="text-muted small">
                        {u.contributions} reviews • {u.helpfulCount} helpfuls
                      </td>
                      <td className="text-end px-4">
                        <button
                          className={`btn btn-sm rounded-pill px-3 fw-bold ${u.isAdmin ? "btn-outline-danger" : "btn-outline-success"}`}
                          onClick={() => toggleAdmin(u._id)}
                        >
                          {u.isAdmin ? "Demote Admin" : "Make Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "requests" && (
          <div className="p-0">
            <div className="p-4 border-bottom">
              <h5 className="fw-bold mb-0">Deletion Requests</h5>
              <p className="text-muted small mb-0">Establishments requesting to be removed from the platform</p>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light text-muted small">
                  <tr>
                    <th className="px-4 py-3">Establishment</th>
                    <th className="py-3">Category</th>
                    <th className="py-3">Contact</th>
                    <th className="py-3 text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deletionList.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5 text-muted">No deletion requests found.</td>
                    </tr>
                  ) : (
                    deletionList.map((est) => (
                      <tr key={est._id}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="bg-light rounded-3 p-2" style={{ width: "40px", height: "40px" }}>
                              <Store size={24} className="text-danger" />
                            </div>
                            <div>
                              <div className="fw-bold">{est.name}</div>
                              <div className="text-muted small">{est.location}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge bg-light text-dark fw-normal rounded-pill px-3">{est.category}</span></td>
                        <td>
                          <div className="small fw-semibold">{est.contactPerson}</div>
                          <div className="text-muted smaller">{est.email}</div>
                        </td>
                        <td className="text-end px-4">
                          <button
                            className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold"
                            onClick={() => {
                              setSelectedDeletionEst(est);
                              setShowDeletionModal(true);
                            }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL: ESTABLISHMENT APPROVAL --- */}
      {showApproveModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1100 }}>
          <div className="position-absolute w-100 h-100 bg-dark opacity-50" onClick={() => setShowApproveModal(false)}></div>
          <div className="bg-white rounded-4 shadow-lg position-relative p-0 overflow-hidden" style={{ width: "450px", zIndex: 1101 }}>
            <div className="bg-dlsu-dark p-4 text-white">
              <h5 className="fw-bold mb-0">Approve Establishment</h5>
              <p className="small mb-0 opacity-75">Create an owner account for {selectedEst?.name}</p>
            </div>
            <form className="p-4" onSubmit={handleApproveSubmit}>
              {formError && <div className="alert alert-danger py-2 small">{formError}</div>}
              <div className="mb-3">
                <label className="form-label small fw-bold">Username</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  value={ownerForm.username}
                  onChange={(e) => setOwnerForm({ ...ownerForm, username: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Full Name</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  value={ownerForm.name}
                  onChange={(e) => setOwnerForm({ ...ownerForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Email Address</label>
                <input
                  type="email"
                  className="form-control rounded-3"
                  value={ownerForm.email}
                  onChange={(e) => setOwnerForm({ ...ownerForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold">Password</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  value={ownerForm.password}
                  onChange={(e) => setOwnerForm({ ...ownerForm, password: e.target.value })}
                  required
                />
                <div className="text-muted smaller mt-1">Provide a temporary password for the owner.</div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-dlsu-dark rounded-pill w-100 fw-bold py-2">Create & Approve</button>
                <button type="button" className="btn btn-light rounded-pill w-100 fw-bold py-2" onClick={() => setShowApproveModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: ESTABLISHMENT DETAILS --- */}
      {showDetailsModal && selectedEst && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1100 }}>
          <div className="position-absolute w-100 h-100 bg-dark opacity-50" onClick={() => setShowDetailsModal(false)}></div>
          <div className="bg-white rounded-4 shadow-lg position-relative p-0 overflow-hidden" style={{ width: "600px", zIndex: 1101 }}>
            <div className="bg-dlsu-dark p-4 text-white d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-0">Application Details</h5>
                <p className="small mb-0 opacity-75">Reviewing: {selectedEst.name}</p>
              </div>
              <button className="btn-close btn-close-white" onClick={() => setShowDetailsModal(false)}></button>
            </div>
            
            <div className="p-4">
              <div className="row g-4">
                <div className="col-12">
                  <label className="text-muted smaller fw-bold text-uppercase mb-1 d-block">Establishment Name</label>
                  <p className="fw-bold mb-0">{selectedEst.name}</p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted smaller fw-bold text-uppercase mb-1 d-block">Category</label>
                  <span className="badge bg-light text-dark rounded-pill px-3">{selectedEst.category}</span>
                </div>
                <div className="col-md-6">
                  <label className="text-muted smaller fw-bold text-uppercase mb-1 d-block">Email Address</label>
                  <p className="mb-0">{selectedEst.email}</p>
                </div>
                <div className="col-12">
                  <label className="text-muted smaller fw-bold text-uppercase mb-1 d-block">Business Address</label>
                  <p className="mb-0">{selectedEst.address || selectedEst.location}</p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted smaller fw-bold text-uppercase mb-1 d-block">Contact Person</label>
                  <p className="mb-0">{selectedEst.contactPerson}</p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted smaller fw-bold text-uppercase mb-1 d-block">Contact Number</label>
                  <p className="mb-0">{selectedEst.contactNumber}</p>
                </div>
              </div>

              <div className="d-flex gap-2 mt-5">
                <button 
                  className="btn btn-dlsu-dark rounded-pill w-100 fw-bold py-2 shadow-sm"
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleApproveClick(selectedEst);
                  }}
                >
                  Approve Application
                </button>
                <button 
                  className="btn btn-outline-danger rounded-pill w-100 fw-bold py-2"
                  onClick={() => handleReject(selectedEst._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: DELETION REQUEST DETAILS --- */}
      {showDeletionModal && selectedDeletionEst && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1100 }}>
          <div className="position-absolute w-100 h-100 bg-dark opacity-50" onClick={() => setShowDeletionModal(false)}></div>
          <div className="bg-white rounded-4 shadow-lg position-relative p-0 overflow-hidden" style={{ width: "600px", zIndex: 1101 }}>
            <div className="p-4 text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: "#b02a2a" }}>
              <div>
                <h5 className="fw-bold mb-0">Deletion Request</h5>
                <p className="small mb-0 opacity-75">Reviewing: {selectedDeletionEst.name}</p>
              </div>
              <button className="btn-close btn-close-white" onClick={() => setShowDeletionModal(false)}></button>
            </div>

            <div className="p-4">
              <div className="alert alert-danger py-2 small mb-4">
                ⚠️ Approving this request will <strong>permanently delete</strong> this establishment and cannot be undone.
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <label className="text-muted smaller fw-bold text-uppercase mb-1 d-block">Establishment Name</label>
                  <p className="fw-bold mb-0">{selectedDeletionEst.name}</p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted smaller fw-bold text-uppercase mb-1 d-block">Category</label>
                  <span className="badge bg-light text-dark rounded-pill px-3">{selectedDeletionEst.category}</span>
                </div>
                <div className="col-md-6">
                  <label className="text-muted smaller fw-bold text-uppercase mb-1 d-block">Email Address</label>
                  <p className="mb-0">{selectedDeletionEst.email}</p>
                </div>
                <div className="col-12">
                  <label className="text-muted smaller fw-bold text-uppercase mb-1 d-block">Business Address</label>
                  <p className="mb-0">{selectedDeletionEst.address || selectedDeletionEst.location}</p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted smaller fw-bold text-uppercase mb-1 d-block">Contact Person</label>
                  <p className="mb-0">{selectedDeletionEst.contactPerson}</p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted smaller fw-bold text-uppercase mb-1 d-block">Contact Number</label>
                  <p className="mb-0">{selectedDeletionEst.contactNumber}</p>
                </div>
              </div>

              <div className="d-flex gap-2 mt-5">
                <button
                  className="btn btn-danger rounded-pill w-100 fw-bold py-2 shadow-sm"
                  onClick={() => handleApproveDeletion(selectedDeletionEst._id)}
                >
                  Approve Deletion
                </button>
                <button
                  className="btn btn-outline-secondary rounded-pill w-100 fw-bold py-2"
                  onClick={() => handleRejectDeletion(selectedDeletionEst._id)}
                >
                  Reject Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- GLOBAL STYLES --- */}
      <style>{`
        .btn-dlsu-dark { background-color: #006a4e; color: white; }
        .btn-dlsu-dark:hover { background-color: #004d39; color: white; }
        .text-dlsu-dark { color: #006a4e; }
        .transition-all { transition: all 0.2s ease-in-out; }
        .smaller { font-size: 0.75rem; }
        .pointer-cursor { cursor: pointer; }
      `}</style>
    </div>
  );
};

// --- COMPONENTS: STATISTICS CARDS & CHARTS ---
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-3 rounded-4 shadow-sm border-0 d-flex align-items-center gap-3">
    <div className="p-2 rounded-3" style={{ backgroundColor: `${color}15`, color: color, minWidth: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div className="flex-grow-1">
      <p className="text-secondary fw-bold mb-0 text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>{title}</p>
      <h4 className="fw-bold mb-0" style={{ color: '#333', lineHeight: 1.1 }}>{value}</h4>
    </div>
  </div>
);

// A simple responsive SVG Chart for reviews over time directly built-in to avoid dependencies.
const ReviewChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted fw-bold p-5 bg-light rounded-4">
        Not enough review data to display chart.
      </div>
    );
  }

  // Find max value to scale the chart
  const maxCount = Math.max(...data.map(d => d.count), 5); // Minimum scale of 5

  return (
    <div className="w-100 h-100 position-relative" style={{ minHeight: '50px' }}>

      {/* Background and Lines (SVG) */}
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        {/* Area fill */}
        <polyline
          fill="#00a86b11"
          stroke="none"
          points={`0,100 ${data.map((d, i) => {
            const x = (i / Math.max(data.length - 1, 1)) * 100;
            const y = 100 - ((d.count / maxCount) * 80);
            return `${x},${y}`;
          }).join(' ')} 100,100`}
        />
        {/* Stroke line */}
        <polyline
          fill="none"
          stroke="#00a86b"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={data.map((d, i) => {
            const x = (i / Math.max(data.length - 1, 1)) * 100;
            const y = 100 - ((d.count / maxCount) * 80);
            return `${x},${y}`;
          }).join(' ')}
        />
      </svg>

      {/* Data Dots (HTML Overlay) */}
      {data.map((d, i) => {
        const x = (i / Math.max(data.length - 1, 1)) * 100;
        const y = 100 - ((d.count / maxCount) * 80);
        return (
          <div
            key={i}
            className="position-absolute rounded-circle shadow-sm bg-white"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: '10px',
              height: '10px',
              border: '2px solid #00a86b',
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: 10
            }}
            title={`${d._id}: ${d.count} reviews`}
          />
        )
      })}

      {/* Date labels at bottom */}
      <div className="d-flex justify-content-between mt-2 text-muted" style={{ fontSize: '0.75rem' }}>
        <span>{data[0]?._id}</span>
        {data.length > 2 && <span>{data[Math.floor(data.length / 2)]?._id}</span>}
        <span>{data[data.length - 1]?._id}</span>
      </div>
    </div>
  );
};

export default AdminDashboard;
