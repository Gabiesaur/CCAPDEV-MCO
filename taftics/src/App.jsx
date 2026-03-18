import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// --- LAYOUTS ---
import MainLayout from "./components/layout/MainLayout";

// --- PAGES ---
import MyProfilePage from "./pages/MyProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import LandingPage from "./pages/LandingPage";
import AboutUsPage from "./pages/AboutUsPage";
import BrowsePage from "./pages/BrowsePage";
import ReviewPage from "./pages/ReviewPage";
import CreateReviewPage from "./pages/CreateReview";
import LoginPage from "./pages/LoginPage";
import RegPage from "./pages/RegPage";
import OwnerAppPage from "./pages/OwnerAppPage";
import EstablishmentPage from "./pages/Establishment";

function App() {
  // --- GLOBAL STATE ---
  // Check localStorage so user stays logged in if they refresh the page
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  // Local state for all users (needed so PublicProfilePage can view other people)
  const [dbUsers, setDbUsers] = useState([]);

  // Fetch all users on mount so PublicProfilePage still works seamlessly
  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => setDbUsers(data))
      .catch(err => console.error("Failed to fetch users from DB:", err));
  }, []);

  // --- AUTHENTICATION FUNCTIONS ---
  
  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        // Save to state and localStorage
        setUser(data.user);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, message: data.message || "Invalid credentials." };
      }
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, message: "Server error. Is the backend running?" };
    }
  };

  const register = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        body: formData // No headers needed for FormData!
      });

      const data = await response.json();

      if (data.success) {
        // Auto-login the user after successful registration
        setUser(data.user);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Failed to register:", error);
      return { success: false, message: "Network error. Is the server running?" };
    }
  };

  const apply = async (applicant) => {
    // Placeholder: You'll eventually wire this up to a POST /api/apply route!
    if (dbUsers.find((u) => u.email === applicant.email)) {
      return { success: false, message: "Email already exists." };
    }
    return { success: true, message: "Application submitted!" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  // --- ROUTING ---
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout user={user} onLogout={logout} />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/create" element={<CreateReviewPage />} />

          <Route path="/establishment/:id" element={<EstablishmentPage />} />
          <Route path="/establishment" element={<EstablishmentPage />} />

          <Route
            path="/profile/me"
            element={
              user ? (
                <MyProfilePage user={user} setUser={setUser} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/profile/:username"
            element={<PublicProfilePage db={dbUsers} currentUser={user} />}
          />
        </Route>

        <Route path="/login" element={<LoginPage onLogin={login} />} />
        <Route path="/register" element={<RegPage onRegister={register} />} />
        <Route path="/apply" element={<OwnerAppPage onRegister={apply} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;