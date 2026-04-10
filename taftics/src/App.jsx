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
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true); // Added to prevent flickering on reload
  const [dbUsers, setDbUsers] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users`)
      .then(res => res.json())
      .then(data => setDbUsers(data))
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Change the URL to wherever you routed exports.checkSession
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
          method: "GET",
          credentials: "include", // CRITICAL: Sends the secure cookie to the backend
        });
        const data = await response.json();
        
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Session check failed", error);
      } finally {
        setLoadingSession(false);
      }
    };
    checkSession();
  }, []);

  // --- AUTHENTICATION FUNCTIONS ---
  
  const login = async (username, password, rememberMe) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ username, password, rememberMe }) 
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        // We no longer use localStorage/sessionStorage here! The cookie handles it.
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

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
        method: 'POST',
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const register = async (formData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include", // CRITICAL: Tells browser to accept the auto-login cookie
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        // Removed sessionStorage!
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

  if (loadingSession) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>; 
  }

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