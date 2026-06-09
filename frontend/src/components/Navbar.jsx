import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const sessionsItem = { label: "Sessions", to: "/sessions" };
const bookingsItem = { label: "My bookings", to: "/dashboard" };
const analyticsItem = { label: "Analytics", to: "/analytics" };
const profileItem = { label: "My profile", to: "/profile" };
const adminItem = { label: "Admin panel", to: "/admin" };
const adminAnalyticsItem = { label: "Analytics", to: "/admin/analytics" };

const guestItems = [
  { label: "Login", to: "/login" },
  { label: "Register", to: "/register" },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasCheckedAuth = useAuthStore((state) => state.hasCheckedAuth);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);

  const navigationItems = [
    sessionsItem,
    ...(isAuthenticated && user?.role !== "admin" ? [bookingsItem] : []),
    ...(isAuthenticated && user?.role === "admin" ? [adminItem] : []),
    ...(isAuthenticated && user?.role === "admin" ? [adminAnalyticsItem] : []),
    ...(isAuthenticated && user?.role !== "admin" ? [analyticsItem] : []),
    ...(isAuthenticated ? [profileItem] : []),
  ];

  const visibleItems =
    hasCheckedAuth && !isAuthenticated
      ? [...navigationItems, ...guestItems]
      : navigationItems;

  const activeItem = visibleItems.find(({ to }) => {
    if (to === "/sessions") {
      return location.pathname === "/" || location.pathname === "/sessions";
    }

    if (to === "/profile") {
      return location.pathname === "/profile";
    }

    if (to === "/analytics") {
      return location.pathname === "/analytics";
    }

    if (to === "/admin/analytics") {
      return location.pathname === "/admin/analytics";
    }

    return location.pathname === to;
  })?.label;

  const handleLogout = async () => {
    try {
      const message = await logout();

      navigate("/login", {
        replace: true,
        state: {
          successMessage: message,
        },
      });
    } catch {
      // The auth store already records logout errors if the API call fails.
    }
  };

  return (
    <header className="border-b border-fit-border">
      <div className="fit-navbar mx-auto w-full max-w-7xl px-5 pb-4 pt-5 lg:pb-5 lg:pt-6">
        <div>
          <p className="text-xl font-black uppercase tracking-[0.14em] text-fit-primary sm:text-2xl">
            FitBook
          </p>
        </div>

        <nav className="fit-nav-tabs" aria-label="Primary navigation">
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

          {hasCheckedAuth && isAuthenticated ? (
            <button
              className="fit-nav-tab disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
              onClick={handleLogout}
              type="button"
            >
              {isLoading ? "Logging out..." : "Logout"}
            </button>
          ) : null}

          {hasCheckedAuth && !isAuthenticated
            ? guestItems.map((item) => (
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
            : null}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
