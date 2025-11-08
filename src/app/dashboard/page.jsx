"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  showToast,
  clearAllToasts,
} from "@/utils/toastManager";

export default function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] =
    useState(null);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL;
  const COINGECKO_API =
    process.env.NEXT_PUBLIC_COINGECKO_API;
  const router = useRouter();

  // ✅ Load cached portfolio first for instant display
  useEffect(() => {
    const cached = localStorage.getItem(
      "portfolioCache"
    );
    if (cached) {
      const parsed = JSON.parse(cached);
      setAssets(parsed.assets || []);
      setTotalValue(parsed.totalValue || 0);
      setLastUpdated(parsed.lastUpdated || null);
      setLoading(false);
    }
  }, []);

  // ✅ Fetch user's portfolio
  const fetchAssets = async () => {
    const token = localStorage.getItem("token");
    if (!token) return [];

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
        throw new Error("Error fetching assets");
      const data = await res.json();
      setAssets(data);
      return data;
    } catch {
      showToast(
        "fetchError",
        "Unable to load your portfolio.",
        "error"
      );
      return [];
    }
  };

  // ✅ Fetch live prices from CoinGecko and cache
  const fetchPrices = async (assetsData) => {
    if (!assetsData || assetsData.length === 0)
      return;

    const ids = assetsData
      .map((a) => a.name.toLowerCase())
      .join(",");

    try {
      const res = await fetch(
        `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd`
      );
      const prices = await res.json();

      let total = 0;
      const updated = assetsData.map((a) => {
        const currentPrice =
          prices[a.name.toLowerCase()]?.usd ||
          a.buyPrice;
        const value = currentPrice * a.quantity;
        total += value;
        const profitLossPercent =
          ((currentPrice - a.buyPrice) /
            a.buyPrice) *
          100;
        return {
          ...a,
          currentPrice,
          value,
          profitLossPercent,
        };
      });

      setAssets(updated);
      setTotalValue(total);
      setLastUpdated(
        new Date().toLocaleTimeString()
      );

      // ✅ Cache the data for instant reload next time
      localStorage.setItem(
        "portfolioCache",
        JSON.stringify({
          assets: updated,
          totalValue: total,
          lastUpdated:
            new Date().toLocaleTimeString(),
        })
      );
    } catch {
      showToast(
        "priceError",
        "Failed to fetch live prices.",
        "error"
      );
    }
  };

  // ✅ Load portfolio and prices
  const loadPortfolio = async () => {
    setLoading(true);
    const fetchedAssets = await fetchAssets();
    if (fetchedAssets.length > 0)
      await fetchPrices(fetchedAssets);
    setLoading(false);
  };

  // ✅ Auto-load when component mounts
  useEffect(() => {
    loadPortfolio();
    return clearAllToasts;
  }, []);

  // ✅ Delete an asset
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    showToast(
      "deleteLoading",
      "Removing asset...",
      "loading"
    );
    try {
      const res = await fetch(
        `${API_BASE}/api/assets/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const updated = assets.filter(
          (a) => a._id !== id
        );
        setAssets(updated);
        showToast(
          "deleteSuccess",
          "Asset removed successfully!",
          "success"
        );
        // Remove cached data
        localStorage.removeItem("portfolioCache");
      } else {
        showToast(
          "deleteError",
          "Failed to remove asset.",
          "error"
        );
      }
    } catch {
      showToast(
        "deleteFail",
        "Something went wrong.",
        "error"
      );
    }
  };

  // ✅ Skeleton loader for smooth UX
  const Skeleton = ({ width }) => (
    <div
      className={`h-4 ${width} bg-gray-800 animate-pulse rounded`}
    />
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-3xl font-bold text-center md:text-left">
          💰 Your Crypto Portfolio
        </h1>

        <button
          onClick={() => router.push("/coins")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md mt-4 md:mt-0 cursor-pointer"
        >
          ➕ Add New Asset
        </button>
      </div>

      {lastUpdated && (
        <p className="text-sm text-gray-400 mb-4 text-center md:text-left">
          Last updated: {lastUpdated}{" "}
          <button
            onClick={() => fetchPrices(assets)}
            className="text-blue-400 hover:text-blue-500 underline cursor-pointer"
          >
            Refresh
          </button>
        </p>
      )}

      {loading ? (
        <div className="text-center text-gray-400 mt-20 animate-pulse">
          Loading your portfolio...
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          You haven’t added any assets yet.
          <br />
          <button
            onClick={() => router.push("/coins")}
            className="text-blue-400 hover:text-blue-500 underline mt-2 cursor-pointer"
          >
            Add your first asset
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 text-lg font-semibold text-center md:text-left">
            Total Portfolio Value:{" "}
            <span className="text-green-400">
              ${totalValue.toFixed(2)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-700 text-sm text-gray-400">
                  <th className="p-2">Coin</th>
                  <th className="p-2">Symbol</th>
                  <th className="p-2">
                    Quantity
                  </th>
                  <th className="p-2">
                    Buy Price
                  </th>
                  <th className="p-2">
                    Current Price
                  </th>
                  <th className="p-2">
                    Total Value
                  </th>
                  <th className="p-2">P/L (%)</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr
                    key={asset._id}
                    className="border-b border-gray-800 hover:bg-gray-900 transition-all"
                  >
                    <td className="p-2">
                      {asset.name}
                    </td>
                    <td className="p-2">
                      {asset.symbol}
                    </td>
                    <td className="p-2">
                      {asset.quantity}
                    </td>
                    <td className="p-2">
                      ${asset.buyPrice}
                    </td>

                    {/* ✅ Smooth skeleton loader for price/value */}
                    <td className="p-2 text-green-400">
                      {asset.currentPrice ? (
                        `$${asset.currentPrice}`
                      ) : (
                        <Skeleton width="w-16" />
                      )}
                    </td>
                    <td className="p-2 text-yellow-400">
                      {asset.value ? (
                        `$${asset.value.toFixed(
                          2
                        )}`
                      ) : (
                        <Skeleton width="w-20" />
                      )}
                    </td>
                    <td
                      className={`p-2 ${
                        asset.profitLossPercent >
                        0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {asset.profitLossPercent
                        ? `${asset.profitLossPercent.toFixed(
                            2
                          )}%`
                        : "—"}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() =>
                          handleDelete(asset._id)
                        }
                        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-sm cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
