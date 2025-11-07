"use client";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic"; // Prevent SSR hydration mismatch

export default function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingPrices, setFetchingPrices] =
    useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // ✅ Ensure logic runs only on client to avoid hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
      } else {
        fetchAssets();
      }
    }
  }, [isClient]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5000/api/assets",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setAssets(data);
      setLoading(false);
    } catch (err) {
      console.error(
        "Error fetching assets:",
        err
      );
      setLoading(false);
    }
  };

  const fetchPrices = async () => {
    if (assets.length === 0) return;
    setFetchingPrices(true);

    const ids = assets
      .map((a) => a.name.toLowerCase())
      .join(",");
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
      );
      const prices = await res.json();

      let total = 0;
      const updated = assets.map((a) => {
        const currentPrice =
          prices[a.name.toLowerCase()]?.usd || 0;
        const currentValue =
          currentPrice * a.quantity;
        const buyValue = a.buyPrice * a.quantity;
        const profitLoss =
          currentValue - buyValue;
        const profitLossPercent =
          buyValue > 0
            ? (
                (profitLoss / buyValue) *
                100
              ).toFixed(2)
            : "0.00";

        total += currentValue;

        return {
          ...a,
          currentPrice,
          currentValue,
          profitLoss,
          profitLossPercent,
        };
      });

      setAssets(updated);
      setTotalValue(total);
    } catch (err) {
      console.error(
        "Error fetching prices:",
        err
      );
    } finally {
      setFetchingPrices(false);
    }
  };

  useEffect(() => {
    if (assets.length > 0 && isClient)
      fetchPrices();
  }, [assets.length, isClient]);

  // 🔄 Loader during initial fetch
  if (loading || !isClient) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#050816] via-[#0a0f2c] to-[#0f172a] text-white flex flex-col justify-center items-center">
        <div className="loader mb-4"></div>
        <p className="text-gray-400 animate-pulse">
          Loading your portfolio...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#050816] via-[#0a0f2c] to-[#0f172a] text-white p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
        💰 Your Crypto Portfolio
      </h1>

      <div className="mb-6 text-lg font-semibold text-center md:text-left">
        Total Portfolio Value:{" "}
        <span className="text-green-400">
          ${Number(totalValue || 0).toFixed(2)}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm md:text-base">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2">Coin</th>
              <th className="p-2">Symbol</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Buy Price</th>
              <th className="p-2">
                Current Price
              </th>
              <th className="p-2">Total Value</th>
              <th className="p-2">P&amp;L</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr
                key={asset._id}
                className="border-b border-gray-800 hover:bg-gray-900/40 transition"
              >
                <td className="p-2">
                  {asset.name}
                </td>
                <td className="p-2 uppercase">
                  {asset.symbol}
                </td>
                <td className="p-2">
                  {asset.quantity}
                </td>
                <td className="p-2">
                  ${asset.buyPrice}
                </td>

                {/* Current Price */}
                <td
                  className="p-2 text-green-400"
                  suppressHydrationWarning
                >
                  {fetchingPrices ? (
                    <span className="animate-pulse text-gray-400">
                      Fetching...
                    </span>
                  ) : (
                    `$${
                      asset.currentPrice?.toFixed(
                        2
                      ) || "0.00"
                    }`
                  )}
                </td>

                {/* Total Value */}
                <td
                  className="p-2 text-yellow-400"
                  suppressHydrationWarning
                >
                  {fetchingPrices ? (
                    <span className="animate-pulse text-gray-400">
                      Updating...
                    </span>
                  ) : (
                    `$${
                      asset.currentValue?.toFixed(
                        2
                      ) || "0.00"
                    }`
                  )}
                </td>

                {/* Profit/Loss */}
                <td
                  className={`p-2 font-semibold ${
                    asset.profitLoss > 0
                      ? "text-green-400"
                      : asset.profitLoss < 0
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                  suppressHydrationWarning
                >
                  {fetchingPrices ? (
                    <span className="animate-pulse text-gray-400">
                      —
                    </span>
                  ) : (
                    <>
                      {asset.profitLoss > 0
                        ? "▲"
                        : asset.profitLoss < 0
                        ? "▼"
                        : "•"}{" "}
                      {(
                        Number(
                          asset.profitLossPercent
                        ) || 0
                      ).toFixed(2)}
                      %
                    </>
                  )}
                </td>

                {/* Delete Button */}
                <td className="p-2">
                  <button
                    onClick={async () => {
                      const token =
                        localStorage.getItem(
                          "token"
                        );
                      await fetch(
                        `http://localhost:5000/api/assets/${asset._id}`,
                        {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );
                      setAssets(
                        assets.filter(
                          (a) =>
                            a._id !== asset._id
                        )
                      );
                    }}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
