import { useState } from "react";

const navigationItems = [
  "Sessions",
  "My bookings",
  "Admin panel",
  "Login",
  "Register",
];

function Navbar() {
  const [activeItem, setActiveItem] = useState(navigationItems[0]);

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
              activeItem === item ? "fit-nav-tab-active" : ""
            }`}
            key={item}
            onClick={() => setActiveItem(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
