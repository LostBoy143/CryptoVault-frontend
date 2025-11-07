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
  const pathname = usePathname(); // 🧭 Detect current route
  const [isLoggedIn, setIsLoggedIn] =
    useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Check auth status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const handleDashboardClick = () => {
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
    else router.push("/login");
  };

  // Helper: add active style
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
          className={`${getLinkClass("/")}`}
        >
          Home
        </Link>

        <Link
          href="/coins"
          className={`${getLinkClass("/coins")}`}
        >
          Coins
        </Link>

        {/* Dashboard button always visible */}
        <button
          onClick={handleDashboardClick}
          className={`bg-transparent border-none cursor-pointer ${
            pathname === "/dashboard"
              ? "text-blue-400 font-semibold border-b-2 border-blue-400 pb-1"
              : "hover:text-blue-400 text-gray-300"
          }`}
        >
          Dashboard
        </button>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-500 cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className={`cursor-pointer ${
              pathname === "/login"
                ? "text-blue-400 font-semibold"
                : "text-green-400 hover:text-green-500"
            }`}
          >
            Login
          </button>
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
            className={`${getLinkClass("/")}`}
          >
            Home
          </Link>

          <Link
            href="/coins"
            onClick={() => setMenuOpen(false)}
            className={`${getLinkClass(
              "/coins"
            )}`}
          >
            Coins
          </Link>

          {/* Dashboard */}
          <button
            onClick={() => {
              const token =
                localStorage.getItem("token");
              setMenuOpen(false);
              if (token)
                router.push("/dashboard");
              else router.push("/login");
            }}
            className={`text-left cursor-pointer ${
              pathname === "/dashboard"
                ? "text-blue-400 font-semibold border-b-2 border-blue-400 pb-1"
                : "hover:text-blue-400 text-gray-300"
            }`}
          >
            Dashboard
          </button>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-red-400 text-left cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                router.push("/login");
                setMenuOpen(false);
              }}
              className={`text-left cursor-pointer ${
                pathname === "/login"
                  ? "text-blue-400 font-semibold"
                  : "text-green-400 hover:text-green-500"
              }`}
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
