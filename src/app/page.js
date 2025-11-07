"use client";
import { useRouter } from "next/navigation";
import Reveal from "../components/Reveal";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="bg-gradient-to-b from-[#050816] via-[#0a0f2c] to-[#0f172a] text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col justify-center items-center text-center px-6 py-16 relative">
        {/* Background glow effect */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[180px] opacity-60 -z-10" />

        <Reveal>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            Track. Analyze. Grow. <br />
            <span className="text-blue-400">
              Your Crypto Portfolio.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl">
            Track, analyze, and grow your digital
            assets in real-time. A modern crypto
            tracker that looks as good as it
            performs.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="flex gap-4 flex-wrap justify-center">
            {/* Explore Coins button */}
            <button
              onClick={() =>
                router.push("/coins")
              }
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold cursor-pointer shadow-md shadow-blue-500/30 transition"
            >
              Explore Coins
            </button>

            {/* View Dashboard button with auth check */}
            <button
              onClick={() => {
                const token =
                  localStorage.getItem("token");
                if (token) {
                  router.push("/dashboard");
                } else {
                  router.push("/login");
                }
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-3 rounded-lg font-semibold cursor-pointer shadow-md shadow-green-400/30 transition"
            >
              View Dashboard
            </button>
          </div>
        </Reveal>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-[#0b1120]/80 text-center backdrop-blur-md">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            🚀 Why Choose CryptoVault?
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: "💹",
              title: "Live Crypto Data",
              desc: "Stay updated with real-time data from 100+ coins.",
            },
            {
              icon: "📊",
              title: "Smart Portfolio",
              desc: "Track holdings, profits & losses dynamically.",
            },
            {
              icon: "🧠",
              title: "AI Insights",
              desc: "Upcoming feature: smart investment tips powered by AI.",
            },
            {
              icon: "📱",
              title: "Mobile Friendly",
              desc: "Looks amazing on all screens with adaptive layouts.",
            },
            {
              icon: "🔒",
              title: "Secure",
              desc: "Your data stays private with JWT auth and HTTPS.",
            },
            {
              icon: "🌐",
              title: "Free Forever",
              desc: "Completely free and built for transparency.",
            },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <div className="bg-gradient-to-br from-[#111827] to-[#1f2937] p-6 rounded-xl hover:scale-105 transition-transform duration-300 border border-gray-800/60">
                <div className="text-4xl mb-3">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-400">
                  {f.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Redesigned How It Works Section */}
      <section className="py-24 px-6 text-center bg-gradient-to-br from-[#0f172a] via-[#101830] to-[#0b1120] relative overflow-hidden">
        {/* subtle moving glow */}
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-green-400/20 blur-[150px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-400/20 blur-[150px] rounded-full -z-10" />

        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-14">
            ⚙️ How It Works —{" "}
            <span className="text-green-400">
              In 4 Easy Steps
            </span>
          </h2>
        </Reveal>

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          {[
            {
              num: "1️⃣",
              title: "Create Account",
              desc: "Sign up quickly and get your personal crypto vault started.",
            },
            {
              num: "2️⃣",
              title: "Explore Market",
              desc: "Browse 100+ coins with live market data and stats.",
            },
            {
              num: "3️⃣",
              title: "Build Portfolio",
              desc: "Add your favorite coins to the dashboard and track profits.",
            },
            {
              num: "4️⃣",
              title: "Analyze & Win",
              desc: "See trends, calculate gains, and optimize your holdings.",
            },
          ].map((step, i) => (
            <Reveal
              key={step.title}
              delay={i * 0.15}
            >
              <div className="flex flex-col items-center bg-[#111827] rounded-xl p-6 border border-gray-800/70 hover:bg-[#1a2235] transition-all duration-300">
                <div className="text-4xl mb-3">
                  {step.num}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-blue-300">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <Reveal>
        <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)] -z-10" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="mb-8 text-lg text-white/90">
            Join thousands of users tracking their
            crypto portfolios daily.
          </p>
          <button
            onClick={() => router.push("/signup")}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 cursor-pointer shadow-md"
          >
            Get Started for Free
          </button>
        </section>
      </Reveal>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-400 bg-[#0b1120] border-t border-gray-800">
        © {new Date().getFullYear()} CryptoVault —
        Built with ❤️ by Shubham Singh
      </footer>
    </main>
  );
}
