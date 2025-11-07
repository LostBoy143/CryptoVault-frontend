"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signupUser } from "../../utils/api";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
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
    const res = await signupUser(form);
    if (res.token) {
      localStorage.setItem("token", res.token);
      router.push("/dashboard");
    } else {
      setError(res.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">
          Create an Account
        </h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none"
          required
        />
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
          Sign Up
        </button>
        <p className="text-center text-sm mt-2 cursor-pointer">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
