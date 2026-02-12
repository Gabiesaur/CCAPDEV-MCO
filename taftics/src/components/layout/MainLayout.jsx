import { Outlet } from "react-router-dom";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

export default function MainLayout() {
  //MOCK LOGGED IN STATE
  const mockUser = {
    username: "Leelancze",
    avatar:
      "https://ui-avatars.com/api/?name=Leelancze+Pacomio&background=0D8ABC&color=fff",
  };

  // MOCK GUEST STATE
  //const mockUser = null;

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar user={mockUser} />

      {/* The "Outlet" is a placeholder where the Router injects the current page */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
