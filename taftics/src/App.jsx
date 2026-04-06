import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// --- LAYOUTS ---
import MainLayout from "./components/layout/MainLayout";

// --- PAGES ---
console.log(import.meta.env.VITE_API_URL)
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
import OwnerProfilePage from "./pages/OwnerProfilePage";
import AdminDashboard from "./pages/AdminDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  // --- GLOBAL STATE ---
  // Check BOTH storages so user stays logged in correctly
  const [user, setUser] = useState(() => {
    const savedLocal = localStorage.getItem("currentUser");
    const savedSession = sessionStorage.getItem("currentUser");
    
    if (savedSession) return JSON.parse(savedSession);
    if (savedLocal) return JSON.parse(savedLocal);
    
    return null;
  });

  // Local state for all users
  const [dbUsers, setDbUsers] = useState([]);

  // Fetch all users on mount
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users`)
      .then(res => res.json())
      .then(data => setDbUsers(data))
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  // --- AUTHENTICATION FUNCTIONS ---
  
  const login = async (username, password, rememberMe) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);

        if (rememberMe) {
          localStorage.setItem("currentUser", JSON.stringify(userData.user));
        } else {
          sessionStorage.setItem("currentUser", JSON.stringify(userData.user));
        }

        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message || "Invalid username or password" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Server error. Please try again later." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
  };

  const register = async (formData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // <-- ADD THIS
        body: JSON.stringify(formData) // <-- CHANGE THIS
      });

      const data = await response.json();

      if (data.success) {
        // Auto-login the user after successful registration
        setUser(data.user);
        sessionStorage.setItem("currentUser", JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Failed to register:", error);
      return { success: false, message: "Network error. Is the server running?" };
    }
  };

  const apply = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (responseData.success) {
        return { success: true, message: responseData.message };
      } else {
        return { success: false, message: responseData.message || "Server error" };
      }
    } catch (error) {
      console.error("Failed to apply:", error);
      return { success: false, message: "Network error. Is the server running?" };
    }
  };

  // --- ROUTING ---
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout user={user} onLogout={logout} />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/review/:id" element={<ReviewPage />} />
          <Route path="/create" element={<CreateReviewPage />} />

          <Route path="/establishment/:id" element={<EstablishmentPage />} />
          <Route path="/establishment" element={<EstablishmentPage />} />

          <Route
            path="/profile/me"
            element={
              user ? (
                user.idSeries === "owner" ? (
                  <OwnerProfilePage user={user} setUser={setUser} />
                ) : (
                  <MyProfilePage user={user} setUser={setUser} />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/profile/:username"
            element={<PublicProfilePage db={dbUsers} currentUser={user} />}
          />
          <Route
            path="/admin-dashboard"
            element={
              user && user.isAdmin ? (
                <AdminDashboard user={user} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Route>

        <Route path="/login" element={<LoginPage onLogin={login} />} />
        <Route path="/register" element={<RegPage onRegister={register} />} />
        <Route path="/apply" element={<OwnerAppPage onApply={apply} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;