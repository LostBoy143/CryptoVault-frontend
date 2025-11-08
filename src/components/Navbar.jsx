"use client";
import Link from "next/link";
import {
  useRouter,
  usePathname,
} from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] =
    useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔁 Check login status and update reactively
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () =>
      window.removeEventListener(
        "storage",
        checkAuth
      );
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  // ✅ Dashboard redirect logic
  const handleDashboardClick = () => {
    const token = localStorage.getItem("token");
    router.push(token ? "/dashboard" : "/login");
  };

  // ✅ Active link style helper
  const getLinkClass = (href) => {
    const isActive = pathname === href;
    return isActive
      ? "text-blue-400 font-semibold border-b-2 border-blue-400 pb-1 transition-all"
      : "hover:text-blue-400 text-gray-300";
  };

  return (
    <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center shadow-md sticky top-0 z-50">
      {/* Logo */}
      <h1
        onClick={() => router.push("/")}
        className="text-xl font-bold cursor-pointer select-none"
      >
        💸 CryptoVault
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 text-sm items-center">
        <Link
          href="/"
          className={getLinkClass("/")}
        >
          Home
        </Link>
        <Link
          href="/coins"
          className={getLinkClass("/coins")}
        >
          Coins
        </Link>

        {/* Dashboard (as Link) */}
        <Link
          href={
            isLoggedIn ? "/dashboard" : "/login"
          }
          className={getLinkClass("/dashboard")}
        >
          Dashboard
        </Link>

        {/* Auth Button */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-500 cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className={
              pathname === "/login"
                ? "text-blue-400 font-semibold"
                : "text-green-400 hover:text-green-500"
            }
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-gray-300 cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? (
          <X size={24} />
        ) : (
          <Menu size={24} />
        )}
      </button>

      {/* Mobile Sidebar */}
      {menuOpen && (
        <div className="absolute top-16 right-0 w-56 bg-gray-800 rounded-l-lg p-4 flex flex-col gap-4 shadow-lg md:hidden animate-slideIn">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className={getLinkClass("/")}
          >
            Home
          </Link>
          <Link
            href="/coins"
            onClick={() => setMenuOpen(false)}
            className={getLinkClass("/coins")}
          >
            Coins
          </Link>
          <Link
            href={
              isLoggedIn ? "/dashboard" : "/login"
            }
            onClick={() => setMenuOpen(false)}
            className={getLinkClass("/dashboard")}
          >
            Dashboard
          </Link>

          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="text-red-400 text-left cursor-pointer hover:text-red-500"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className={
                pathname === "/login"
                  ? "text-blue-400 font-semibold"
                  : "text-green-400 hover:text-green-500"
              }
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
