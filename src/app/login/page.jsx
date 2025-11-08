"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  showToast,
  clearAllToasts,
} from "@/utils/toastManager";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    showToast(
      "loginLoading",
      "Logging in...",
      "loading"
    );

    try {
      const res = await fetch(
        `${API_BASE}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      clearAllToasts();

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        showToast(
          "loginSuccess",
          "Login successful!",
          "success"
        );
        router.push("/dashboard");
      } else {
        const err = await res.json();
        showToast(
          "loginError",
          err.message || "Invalid credentials",
          "error"
        );
      }
    } catch {
      clearAllToasts();
      showToast(
        "loginFail",
        "Network error. Try again.",
        "error"
      );
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-950 text-white px-4">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-extrabold mb-2 text-center">
          Welcome Back
        </h1>
        <p className="text-gray-400 mb-6 text-center text-sm">
          Log in to continue tracking your
          portfolio
        </p>

        {/* Email Input */}
        <label className="block mb-2 text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-2 rounded bg-gray-800 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="you@example.com"
          required
        />

        {/* Password Input */}
        <label className="block mb-2 text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-2 rounded bg-gray-800 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
          required
        />

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold cursor-pointer transition"
        >
          Log In
        </button>

        {/* Signup Redirect */}
        <p className="text-gray-400 text-sm text-center mt-4">
          New to CryptoVault?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-blue-400 hover:text-blue-500 cursor-pointer font-medium"
          >
            Create an account
          </span>
        </p>
      </form>
    </main>
  );
}
