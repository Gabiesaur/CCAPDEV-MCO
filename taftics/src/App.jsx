import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// --- DATA ---
import { USERS } from "./data/mockData";

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
  // GLOBAL USER STATE
  // Check localStorage so user stays logged in if page refreshes
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  // Local state for users (to allow new registrations in this session)
  const [dbUsers, setDbUsers] = useState(USERS);

  const login = (username, password) => {
    const foundUser = dbUsers.find(
      (u) =>
        (u.username === username || u.email === username) &&
        u.password === password,
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      return { success: true };
    } else {
      return {
        success: false,
        message: "Invalid credentials. Try 'leelanczers' , 'password123'",
      };
    }
  };

  const register = (newUser) => {
    // Check if user exists
    if (dbUsers.find((u) => u.username === newUser.username)) {
      return { success: false, message: "Username already taken." };
    }

    // Create new mock user
    const createdUser = {
      ...newUser,
      id: dbUsers.length + 1,
      idSeries: newUser.dlsuId || "125", // Default if missing
      avatar: `https://ui-avatars.com/api/?name=${newUser.username}&background=random&color=fff`,
    };

    // "Save" to DB (In memory only for demo)
    setDbUsers([...dbUsers, createdUser]);

    // Auto-login
    setUser(createdUser);
    localStorage.setItem("currentUser", JSON.stringify(createdUser));
    return { success: true };
  };

  const apply = (applicant) => {
    if (dbUsers.find((u) => u.email === applicant.email)) {
      return { success: false, message: "Username already taken." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Pass User & Logout to MainLayout */}
        <Route element={<MainLayout user={user} onLogout={logout} />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/create" element={<CreateReviewPage />} />

          {/* Dynamic Establishment Route */}
          <Route path="/establishment/:id" element={<EstablishmentPage />} />
          <Route path="/establishment" element={<EstablishmentPage />} />

          {/* Protected Route Check */}
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

        {/* Pass Auth Functions to Login/Reg */}
        <Route path="/login" element={<LoginPage onLogin={login} />} />
        <Route path="/register" element={<RegPage onRegister={register} />} />
        <Route path="/apply" element={<OwnerAppPage onRegister={apply} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
