"use client";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function CoinsPage() {
  const [coins, setCoins] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  // ✅ Fetch live crypto data
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1"
        );

        if (!res.ok)
          throw new Error(
            "Failed to fetch coins"
          );

        const data = await res.json();

        if (
          Array.isArray(data) &&
          data.length > 0
        ) {
          setCoins(data);
        } else {
          throw new Error("Empty data received");
        }
      } catch (error) {
        console.error(
          "Error fetching coins:",
          error
        );
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  // ✅ Fetch user portfolio
  useEffect(() => {
    if (!token) return;
    const fetchPortfolio = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/assets",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setPortfolio(data);
      } catch (error) {
        console.error(
          "Error fetching portfolio:",
          error
        );
      }
    };
    fetchPortfolio();
  }, [token]);

  // ✅ Add to portfolio
  const handleAdd = async (coin) => {
    if (!token)
      return (window.location.href = "/login");
    try {
      const res = await fetch(
        "http://localhost:5000/api/assets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: coin.id,
            symbol: coin.symbol.toUpperCase(),
            quantity: 1,
            buyPrice: coin.current_price,
          }),
        }
      );

      if (res.ok) {
        const added = await res.json();
        setPortfolio([...portfolio, added]);
      }
    } catch (error) {
      console.error("Error adding asset:", error);
    }
  };

  // ✅ Remove from portfolio
  const handleRemove = async (coinId) => {
    const found = portfolio.find(
      (a) => a.name === coinId
    );
    if (!found) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/assets/${found._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        setPortfolio(
          portfolio.filter(
            (a) => a._id !== found._id
          )
        );
      }
    } catch (error) {
      console.error(
        "Error removing asset:",
        error
      );
    }
  };

  // ✅ Check if coin already in portfolio
  const inPortfolio = (coinId) =>
    portfolio.some((a) => a.name === coinId);

  const filtered = coins.filter(
    (coin) =>
      coin.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      coin.symbol
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // 🔄 Loader
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#050816] via-[#0a0f2c] to-[#0f172a] text-white flex flex-col justify-center items-center">
        <div className="loader mb-4"></div>
        <p className="text-gray-400 animate-pulse">
          Fetching live market data...
        </p>
      </main>
    );
  }

  // ❌ Error State
  if (error) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#050816] via-[#0a0f2c] to-[#0f172a] text-white">
        <p className="text-red-400 mb-4 text-center">
          ⚠️ Failed to load crypto data.
          <br />
          This could be a network or API
          rate-limit issue.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded cursor-pointer"
        >
          Retry
        </button>
      </main>
    );
  }

  // ⚙️ If API worked but empty data (rare case)
  if (!loading && coins.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#050816] via-[#0a0f2c] to-[#0f172a] text-white flex flex-col justify-center items-center">
        <p className="text-gray-400 mb-4">
          No coins available right now. Try again
          later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded cursor-pointer"
        >
          Refresh
        </button>
      </main>
    );
  }

  // ✅ Main Page
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#050816] via-[#0a0f2c] to-[#0f172a] text-white p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
        💹 Live Crypto Market
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center md:justify-start mb-6">
        <input
          type="text"
          placeholder="Search coins..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="p-2 rounded bg-gray-800 w-72 sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Responsive Table + Scroll Indicator */}
      <div className="relative">
        <div
          className="overflow-x-auto scroll-container"
          onScroll={(e) => {
            const container = e.target;
            const fade =
              container.nextElementSibling;
            if (fade) {
              fade.style.opacity =
                container.scrollLeft +
                  container.clientWidth >=
                container.scrollWidth - 5
                  ? 0
                  : 1;
            }
          }}
        >
          <table className="min-w-full border-collapse text-left text-sm md:text-base">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="p-2">Coin</th>
                <th className="p-2">Symbol</th>
                <th className="p-2">Price</th>
                <th className="p-2">
                  24h Change
                </th>
                <th className="p-2">
                  Market Cap
                </th>
                <th className="p-2 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((coin) => (
                <tr
                  key={coin.id}
                  className="border-b border-gray-800 hover:bg-gray-900/40 transition"
                >
                  <td className="p-2 flex items-center gap-2">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="truncate max-w-[100px] sm:max-w-none">
                      {coin.name}
                    </span>
                  </td>
                  <td className="p-2 uppercase">
                    {coin.symbol}
                  </td>
                  <td className="p-2">
                    $
                    {coin.current_price?.toLocaleString() ||
                      "0.00"}
                  </td>
                  <td
                    className={`p-2 ${
                      coin.price_change_percentage_24h >
                      0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {coin.price_change_percentage_24h?.toFixed(
                      2
                    ) || 0}
                    %
                  </td>
                  <td className="p-2">
                    $
                    {coin.market_cap?.toLocaleString() ||
                      "0"}
                  </td>
                  <td className="p-2 text-center">
                    {inPortfolio(coin.id) ? (
                      <button
                        onClick={() =>
                          handleRemove(coin.id)
                        }
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm cursor-pointer"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleAdd(coin)
                        }
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm cursor-pointer"
                      >
                        Add
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Scroll gradient hint */}
        <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-[#0f172a] to-transparent transition-opacity duration-300 opacity-100" />
      </div>

      {/* Mobile swipe hint */}
      {filtered.length > 5 && (
        <p className="text-center text-gray-400 mt-4 md:hidden animate-pulse text-sm">
          👉 Swipe to scroll →
        </p>
      )}

      {/* No Results (After Loaded) */}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-400 mt-8">
          No coins match your search.
        </p>
      )}
    </main>
  );
}
