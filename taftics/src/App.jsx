import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// --- LAYOUTS ---
import MainLayout from "./components/layout/MainLayout";

// --- PAGES ---
import MyProfilePage from "./pages/MyProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import LandingPage from "./pages/LandingPage";
import AboutUsPage from "./pages/AboutUsPage";
import BrowsePage from "./pages/BrowsePage";
import LoginPage from "./pages/LoginPage";
import RegPage from "./pages/RegPage";

// 1. MOCK DATABASE (The "Backend")
const MOCK_DB = [
  {
    username: "leelanczers",
    password: "password123", // In real life, never store plain text!
    name: "Leelancze Pacomio",
    email: "lee@dlsu.edu.ph",
    idSeries: "124",
    avatar:
      "https://ui-avatars.com/api/?name=Leelancze+Pacomio&background=0D8ABC&color=fff",
    isAdmin: true,
  },
  {
    username: "archer_dc",
    password: "password123",
    name: "Archer Dela Cruz",
    email: "archer@dlsu.edu.ph",
    idSeries: "121",
    avatar:
      "https://ui-avatars.com/api/?name=Archer+Dela+Cruz&background=00441B&color=fff",
  },
];

function App() {
  // 2. GLOBAL USER STATE
  // Check localStorage so user stays logged in if page refreshes
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  // 3. AUTH ACTIONS
  const login = (username, password) => {
    const foundUser = MOCK_DB.find(
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
    if (MOCK_DB.find((u) => u.username === newUser.username)) {
      return { success: false, message: "Username already taken." };
    }

    // Create new mock user
    const createdUser = {
      ...newUser,
      idSeries: newUser.dlsuId || "125", // Default if missing
      avatar: `https://ui-avatars.com/api/?name=${newUser.username}&background=random&color=fff`,
    };

    // "Save" to DB (In memory only for demo)
    MOCK_DB.push(createdUser);

    // Auto-login
    setUser(createdUser);
    localStorage.setItem("currentUser", JSON.stringify(createdUser));
    return { success: true };
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

          {/* Protected Route Check */}
          <Route
            path="/profile/me"
            element={
              user ? <MyProfilePage user={user} /> : <Navigate to="/login" />
            }
          />
          <Route path="/profile/:username" element={<PublicProfilePage />} />
        </Route>

        {/* Pass Auth Functions to Login/Reg */}
        <Route path="/login" element={<LoginPage onLogin={login} />} />
        <Route path="/register" element={<RegPage onRegister={register} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
