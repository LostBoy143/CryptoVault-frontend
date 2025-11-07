"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../utils/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(form);
    if (res.token) {
      localStorage.setItem("token", res.token);
      router.push("/dashboard");
    } else {
      setError(res.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">
          Welcome Back
        </h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none"
          required
        />
        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-md py-2 font-semibold cursor-pointer"
        >
          Login
        </button>
        <p className="text-center text-sm mt-2 cursor-pointer">
          New here?{" "}
          <a
            href="/signup"
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Create account
          </a>
        </p>
      </form>
    </div>
  );
}
