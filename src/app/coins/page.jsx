"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CoinsPage() {
  const [coins, setCoins] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL;
  const COINGECKO_API =
    process.env.NEXT_PUBLIC_COINGECKO_API;
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  // ✅ Fetch Live Coin Data
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1`
        );
        const data = await res.json();
        setCoins(data);
      } catch (error) {
        toast.error(
          "Failed to fetch live coins data"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, [COINGECKO_API]);

  // ✅ Fetch User Portfolio
  useEffect(() => {
    if (!token) return;
    const fetchPortfolio = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/assets`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok)
          throw new Error(
            "Failed to fetch portfolio"
          );
        const data = await res.json();
        setPortfolio(data);
      } catch (error) {
        toast.error(
          "Unable to load your portfolio."
        );
      }
    };
    fetchPortfolio();
  }, [token, API_BASE]);

  // ✅ Add Coin to Portfolio
  const handleAdd = async (coin) => {
    if (!token) {
      toast.error("Please log in to add coins.");
      return;
    }

    const toastId = toast.loading(
      "Adding coin..."
    );
    try {
      const res = await fetch(
        `${API_BASE}/api/assets`,
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

      toast.dismiss(toastId);
      if (res.ok) {
        const newAsset = await res.json();
        setPortfolio([...portfolio, newAsset]);
        toast.success(
          `${coin.name} added to portfolio!`
        );
      } else {
        const err = await res.json();
        toast.error(
          err.message || "Failed to add coin."
        );
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(
        "Network error. Try again later."
      );
    }
  };

  // ✅ Remove Coin from Portfolio
  const handleRemove = async (coinId) => {
    const found = portfolio.find(
      (a) => a.name === coinId
    );
    if (!found) return;

    const toastId = toast.loading(
      "Removing coin..."
    );
    try {
      const res = await fetch(
        `${API_BASE}/api/assets/${found._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.dismiss(toastId);
      if (res.ok) {
        setPortfolio(
          portfolio.filter(
            (a) => a._id !== found._id
          )
        );
        toast.success(
          "Coin removed successfully!"
        );
      } else {
        toast.error("Failed to remove coin.");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(
        "Network error. Try again later."
      );
    }
  };

  // ✅ Check if coin already in portfolio
  const inPortfolio = (coinId) =>
    portfolio.some((a) => a.name === coinId);

  // ✅ Filter coins based on search
  const filtered = coins.filter(
    (coin) =>
      coin.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      coin.symbol
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 md:p-8">
      <div className="text-center md:text-left mb-6 space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex justify-center md:justify-start items-center gap-2">
          <span role="img" aria-label="chart">
            📈
          </span>
          <span>Live Crypto Market</span>
        </h1>

        <p className="text-gray-400 text-sm md:text-base">
          Track live prices and market updates in
          real time
        </p>
        <div className="h-px bg-linear-to-r from-transparent via-gray-700 to-transparent my-4" />

        <div className="mt-4 flex justify-center md:justify-start">
          <input
            type="text"
            placeholder="Search coins..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-72 sm:w-80 p-2 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh] text-gray-400 animate-pulse">
          Fetching live data...
        </div>
      ) : (
        <div className="overflow-x-auto relative">
          {/* Scroll Hint */}
          <p className="text-gray-500 text-xs text-center md:text-left mt-2">
            ← Scroll horizontally to see more →
          </p>
          <table className="w-full border-collapse text-left min-w-[800px]">
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
                  className="border-b border-gray-800 hover:bg-gray-900 transition"
                >
                  <td className="p-2 flex items-center gap-2">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-5 h-5"
                    />
                    {coin.name}
                  </td>
                  <td className="p-2 uppercase">
                    {coin.symbol}
                  </td>
                  <td className="p-2">
                    $
                    {coin.current_price.toLocaleString()}
                  </td>
                  <td
                    className={`p-2 ${
                      coin.price_change_percentage_24h >
                      0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {coin.price_change_percentage_24h.toFixed(
                      2
                    )}
                    %
                  </td>
                  <td className="p-2">
                    $
                    {coin.market_cap.toLocaleString()}
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
      )}
    </main>
  );
}
