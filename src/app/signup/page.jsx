"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL;

  const validateForm = () => {
    const newErrors = {};

    // ✅ Name validation
    if (!form.name.trim())
      newErrors.name = "Name is required";

    // ✅ Email validation
    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!form.email.trim())
      newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Valid email is required";

    // ✅ Password validation
    if (!form.password)
      newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password =
        "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const toastId = toast.loading(
      "Creating your account..."
    );

    try {
      const res = await fetch(
        `${API_BASE}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      toast.dismiss(toastId);

      if (res.ok) {
        toast.success(
          "Account created successfully!"
        );
        setTimeout(
          () => router.push("/login"),
          1000
        );
      } else {
        const err = await res.json();
        toast.error(
          err.message || "Signup failed."
        );
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(
        "Something went wrong. Try again later."
      );
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" }); // remove error on typing
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-950 text-white p-6">
      <Toaster position="top-center" />
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create an Account
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full p-2 rounded bg-gray-800 border ${
                errors.name
                  ? "border-red-500"
                  : "border-transparent"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full p-2 rounded bg-gray-800 border ${
                errors.email
                  ? "border-red-500"
                  : "border-transparent"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="test@gmail.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full p-2 rounded bg-gray-800 border ${
                errors.password
                  ? "border-red-500"
                  : "border-transparent"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-4 transition cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Log in
          </span>
        </p>
      </div>
    </main>
  );
}
