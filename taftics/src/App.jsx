import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- LAYOUTS ---
import MainLayout from "./components/layout/MainLayout";

// --- PAGES ---
import MyProfilePage from "./pages/MyProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import LandingPage from "./pages/LandingPage";
import AboutUsPage from "./pages/AboutUsPage";
//import LoginPage from './pages/LoginPage';

// Placeholder Pages (So the app doesn't crash while your team builds them)
const LoginPage = () => (
  <div className="p-5 text-center">
    <h1>Login Page (Coming Soon)</h1>
  </div>
);
const NotFound = () => (
  <div className="p-5 text-center text-danger">
    <h1>404 - Page Not Found</h1>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === MAIN LAYOUT WRAPPER === 
            All pages inside here get the Navbar automatically. 
        */}
        <Route element={<MainLayout />}>
          {/* --- PUBLIC ROUTES (Accessible to everyone) --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          <Route path="/about" element={<AboutUsPage />} />

          {/* --- PROFILE ROUTES --- */}
          {/* 1. My Profile (Protected) */}
          <Route path="/profile/me" element={<MyProfilePage />} />

          {/* 2. Public Profile (Dynamic :username) */}
          <Route path="/profile/:username" element={<PublicProfilePage />} />

          {/* --- ESTABLISHMENT ROUTES (Member 3 will add these) --- */}
          {/* <Route path="/establishment/:id" element={<EstablishmentPage />} /> */}
        </Route>

        {/* === 404 CATCH-ALL === */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
