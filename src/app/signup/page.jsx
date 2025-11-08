"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  showToast,
  clearAllToasts,
} from "@/utils/toastManager";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL;

  const handleSignup = async (e) => {
    e.preventDefault();
    showToast(
      "signupLoading",
      "Creating your account...",
      "loading"
    );

    try {
      const res = await fetch(
        `${API_BASE}/api/auth/signup`,
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
        showToast(
          "signupSuccess",
          "Account created successfully!",
          "success"
        );
        router.push("/login");
      } else {
        const err = await res.json();
        showToast(
          "signupError",
          err.message || "Signup failed",
          "error"
        );
      }
    } catch {
      clearAllToasts();
      showToast(
        "signupFail",
        "Network error. Try again later.",
        "error"
      );
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-950 text-white px-4">
      <form
        onSubmit={handleSignup}
        className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-extrabold mb-2 text-center">
          Create Account
        </h1>
        <p className="text-gray-400 mb-6 text-center text-sm">
          Join CryptoVault and start tracking your
          portfolio today
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
          className="w-full p-2 rounded bg-gray-800 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
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
          className="w-full p-2 rounded bg-gray-800 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="••••••••"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold cursor-pointer transition"
        >
          Sign Up
        </button>

        {/* Redirect to Login */}
        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-green-400 hover:text-green-500 cursor-pointer font-medium"
          >
            Log in here
          </span>
        </p>
      </form>
    </main>
  );
}
