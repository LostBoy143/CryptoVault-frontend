"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  showToast,
  clearAllToasts,
} from "@/utils/toastManager";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL;

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      showToast(
        "signupEmpty",
        "Please fill all fields",
        "error"
      );
      return;
    }

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
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
          }),
        }
      );

      clearAllToasts();

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        showToast(
          "signupSuccess",
          "Account created successfully!",
          "success"
        );
        router.push("/dashboard");
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
          Join CryptoVault to start tracking your
          crypto assets today.
        </p>

        <label className="block mb-2 text-sm font-medium">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full p-2 rounded bg-gray-800 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter your full name"
          required
        />

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
          placeholder="Enter your email"
          required
        />

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
          placeholder="At least 8 characters"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold cursor-pointer transition"
        >
          Sign Up
        </button>

        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-green-400 hover:text-green-500 cursor-pointer font-medium"
          >
            Log in
          </span>
        </p>
      </form>
    </main>
  );
}
