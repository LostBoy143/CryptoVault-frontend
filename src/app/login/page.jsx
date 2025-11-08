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

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        clearAllToasts();
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
      showToast(
        "loginFail",
        "Network error. Try again.",
        "error"
      );
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-950 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 rounded-xl shadow-lg w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Welcome Back
        </h1>
        <label className="block mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-2 rounded bg-gray-800 mb-4"
          required
        />
        <label className="block mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-2 rounded bg-gray-800 mb-6"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold cursor-pointer"
        >
          Log In
        </button>
      </form>
    </main>
  );
}
