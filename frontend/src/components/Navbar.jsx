import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const navigationItems = [
  { label: "Sessions", to: "/sessions" },
  { label: "My bookings", to: "/dashboard" },
  { label: "Admin panel", to: "/admin" },
];

const guestItems = [
  { label: "Login", to: "/login" },
  { label: "Register", to: "/register" },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const activeItem = navigationItems.find(({ to }) => {
    if (to === "/sessions") {
      return location.pathname === "/" || location.pathname === "/sessions";
    }

    return location.pathname === to;
  })?.label;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      // The auth store already records logout errors if the API call fails.
    }
  };

  return (
    <header className="fit-navbar">
      <div>
        <p className="fit-brand-kicker">FitBook</p>
        <h1 className="text-3xl font-black leading-tight sm:text-4xl">
          Training bookings dashboard
        </h1>
      </div>

      <nav className="fit-nav-tabs" aria-label="Static navigation">
        {navigationItems.map((item) => (
          <button
            className={`fit-nav-tab ${
              activeItem === item.label ? "fit-nav-tab-active" : ""
            }`}
            key={item.label}
            onClick={() => navigate(item.to)}
            type="button"
          >
            {item.label}
          </button>
        ))}

        {isAuthenticated ? (
          <button className="fit-nav-tab" onClick={handleLogout} type="button">
            Logout
          </button>
        ) : (
          guestItems.map((item) => (
            <button
              className={`fit-nav-tab ${
                activeItem === item.label ? "fit-nav-tab-active" : ""
              }`}
              key={item.label}
              onClick={() => navigate(item.to)}
              type="button"
            >
              {item.label}
            </button>
          ))
        )}
      </nav>
    </header>
  );
}

export default Navbar;
