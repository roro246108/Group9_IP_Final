import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Menu, X, UserCircle, LayoutDashboard } from "lucide-react";
import logoBlue from "../assets/Images/blue _wave.png";
import logoWhite from "../assets/Images/white_logo.png";
import { useAuth } from "../Context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const { currentUser, isAuthenticated } = useAuth();

  const [showNavbar, setShowNavbar] = useState(true);
  const [scrolledUpStyle, setScrolledUpStyle] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 20) {
        setShowNavbar(true);
        setScrolledUpStyle(false);
      } else if (currentScrollY > lastScrollY.current) {
        setShowNavbar(false);
        setMenuOpen(false);
      } else {
        setShowNavbar(true);
        setScrolledUpStyle(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAdminRoute) return null;

  const navTextColor =
    isHomePage && !scrolledUpStyle ? "text-white" : "text-[#223a5e]";

  const currentLogo = isHomePage && !scrolledUpStyle ? logoWhite : logoBlue;

  const navBackground = scrolledUpStyle
    ? "bg-white/90 backdrop-blur-md shadow-md border-b border-[#dbe4f0]"
    : isHomePage
    ? "bg-transparent border-b border-white/20"
    : "bg-transparent border-b border-[#dbe4f0]";

  const authTextButtonClass =
    isHomePage && !scrolledUpStyle
      ? "border-white text-white hover:bg-white hover:text-[#2f6fb3]"
      : "border-[#2f6fb3] text-[#2f6fb3] hover:bg-[#2f6fb3] hover:text-white";

  const profileTextClass =
    isHomePage && !scrolledUpStyle ? "text-white" : "text-[#223a5e]";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } ${navBackground}`}
    >
      <div className="flex h-24 w-full items-center justify-between px-4 md:px-6 lg:px-10">
        <div className="flex w-[140px] items-center lg:w-[180px]">
          <Link
            to="/"
            className="inline-block transition-transform duration-300 hover:scale-105"
          >
            <img
              src={currentLogo}
              alt="Blue Waves Hotel Logo"
              className="h-14 w-auto object-contain md:h-16"
            />
          </Link>
        </div>

        <div
          className={`hidden flex-1 items-center justify-center gap-8 text-[15px] font-semibold md:flex lg:gap-10 ${navTextColor}`}
        >
          <Link
            to="/"
            className="whitespace-nowrap hover:text-[#7ea0d6] transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            to="/hotelDetails"
            className="whitespace-nowrap hover:text-[#7ea0d6] transition-colors duration-300"
          >
            Hotel Details
          </Link>
          <Link
            to="/offers"
            className="whitespace-nowrap hover:text-[#7ea0d6] transition-colors duration-300"
          >
            Offers
          </Link>
          <Link
            to="/hotels"
            className="whitespace-nowrap hover:text-[#7ea0d6] transition-colors duration-300"
          >
            Search
          </Link>
         
          <Link
            to="/help"
            className="whitespace-nowrap hover:text-[#7ea0d6] transition-colors duration-300"
          >
            Contact Us
          </Link>

        </div>

        <div className="hidden w-[180px] items-center justify-end gap-3 md:flex lg:w-[240px]">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-105 ${authTextButtonClass}`}
              >
                Log In
              </Link>

              <Link
                to="/register"
                className="px-5 py-2.5 rounded-full bg-[#7ea0d6] text-white text-sm font-medium hover:bg-[#2f6fb3] hover:-translate-y-1 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {currentUser?.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className={`px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-105 flex items-center gap-2 ${authTextButtonClass}`}
                >
                  <LayoutDashboard size={16} />
                  Admin
                </Link>
              )}

              <Link
                to="/profile"
                className={`flex items-center gap-2 px-3 py-2 rounded-full hover:text-[#7ea0d6] transition-colors duration-300 ${profileTextClass}`}
              >
                <UserCircle size={22} />
                <span className="text-sm font-medium whitespace-nowrap">
                  {currentUser?.fullName}
                </span>
              </Link>

            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden transition-colors duration-300 ${navTextColor}`}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        } ${
          isHomePage && !scrolledUpStyle
            ? "bg-[#223a5e]/95 backdrop-blur-md"
            : "bg-white/95 backdrop-blur-md"
        }`}
      >
        <div
          className={`px-6 py-5 flex flex-col gap-4 ${
            isHomePage && !scrolledUpStyle ? "text-white" : "text-[#223a5e]"
          }`}
        >
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="hover:text-[#7ea0d6]"
          >
            Home
          </Link>
          <Link
            to="/hotelDetails"
            onClick={() => setMenuOpen(false)}
            className="hover:text-[#7ea0d6]"
          >
            Hotel Details
          </Link>
          <Link
            to="/offers"
            onClick={() => setMenuOpen(false)}
            className="hover:text-[#7ea0d6]"
          >
            Offers
          </Link>
          <Link
            to="/hotels"
            onClick={() => setMenuOpen(false)}
            className="hover:text-[#7ea0d6]"
          >
            Search
          </Link>
         
          <Link to="/help" onClick={() => setMenuOpen(false)} className="hover:text-[#7ea0d6]">
            Contact Us
          </Link>

          {!isAuthenticated ? (
            <div className="flex flex-col gap-3 pt-3">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={`px-5 py-2.5 rounded-full border text-sm font-medium text-center transition-all duration-300 ${authTextButtonClass}`}
              >
                Log In
              </Link>

              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="px-5 py-2.5 rounded-full bg-[#7ea0d6] text-white text-sm font-medium text-center hover:bg-[#2f6fb3] transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-3">
              {currentUser?.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={`px-5 py-2.5 rounded-full border text-sm font-medium text-center transition-all duration-300 ${authTextButtonClass}`}
                >
                  Admin Dashboard
                </Link>
              )}

              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2 hover:text-[#7ea0d6]"
              >
                <UserCircle size={22} />
                <span className="font-medium">{currentUser?.fullName}</span>
              </Link>

            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
