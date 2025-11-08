"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    quantity: "",
    buyPrice: "",
  });
  const [totalValue, setTotalValue] = useState(0);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL;

  // ✅ Fetch available coins (top 100)
  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1"
    )
      .then((res) => res.json())
      .then((data) => setCoins(data))
      .catch(() =>
        toast.error("Failed to load coins data")
      );
  }, []);

  // ✅ Fetch user's assets
  const fetchAssets = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
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
    } catch (err) {
      toast.error("Unable to load portfolio.");
    }
  };

  // ✅ Fetch live prices & calculate portfolio total
  const fetchPrices = async () => {
    if (assets.length === 0) return;
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
        const value = currentPrice * a.quantity;
        total += value;
        const profitLoss =
          (currentPrice - a.buyPrice) *
          a.quantity;
        const profitLossPercent =
          ((currentPrice - a.buyPrice) /
            a.buyPrice) *
          100;

        return {
          ...a,
          currentPrice,
          value,
          profitLoss,
          profitLossPercent,
        };
      });

      setAssets(updated);
      setTotalValue(total);
    } catch {
      toast.error("Failed to fetch live prices.");
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    if (assets.length > 0) fetchPrices();
  }, [assets.length]);

  // ✅ Handle input changes
  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSelectCoin = (coin) => {
    setForm({
      ...form,
      name: coin.id,
      symbol: coin.symbol.toUpperCase(),
    });
    setSearch("");
  };

  // ✅ Add new asset with toast feedback
  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const toastId = toast.loading(
      "Adding asset..."
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
          body: JSON.stringify(form),
        }
      );

      toast.dismiss(toastId);

      if (res.ok) {
        const newAsset = await res.json();
        setAssets([newAsset, ...assets]);
        setForm({
          name: "",
          symbol: "",
          quantity: "",
          buyPrice: "",
        });
        toast.success(
          "Asset added successfully!"
        );
      } else {
        const err = await res.json();
        toast.error(
          err.message || "Failed to add asset."
        );
      }
    } catch {
      toast.dismiss(toastId);
      toast.error(
        "Network error. Try again later."
      );
    }
  };

  // ✅ Delete asset with toast feedback
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const toastId = toast.loading(
      "Removing asset..."
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
      toast.dismiss(toastId);

      if (res.ok) {
        setAssets(
          assets.filter((a) => a._id !== id)
        );
        toast.success(
          "Asset removed successfully!"
        );
      } else {
        toast.error("Failed to remove asset.");
      }
    } catch {
      toast.dismiss(toastId);
      toast.error("Something went wrong.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
        💰 Your Crypto Portfolio
      </h1>

      {/* Add Form */}
      <form
        onSubmit={handleAdd}
        className="mb-8 flex flex-wrap gap-4 items-end justify-center md:justify-start"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search or Select Coin"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="p-2 rounded bg-gray-800 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {search && (
            <div className="absolute top-10 bg-gray-900 border border-gray-700 w-64 max-h-48 overflow-y-auto rounded-lg shadow-lg z-10">
              {coins
                .filter(
                  (c) =>
                    c.name
                      .toLowerCase()
                      .includes(
                        search.toLowerCase()
                      ) ||
                    c.symbol
                      .toLowerCase()
                      .includes(
                        search.toLowerCase()
                      )
                )
                .map((coin) => (
                  <div
                    key={coin.id}
                    onClick={() =>
                      handleSelectCoin(coin)
                    }
                    className="flex items-center gap-2 p-2 hover:bg-gray-800 cursor-pointer"
                  >
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-5 h-5"
                    />
                    <span>
                      {coin.name} (
                      {coin.symbol.toUpperCase()})
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="buyPrice"
          type="number"
          placeholder="Buy Price (USD)"
          value={form.buyPrice}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold cursor-pointer"
        >
          Add
        </button>
      </form>

      <div className="mb-4 text-lg font-semibold text-center md:text-left">
        Total Portfolio Value:{" "}
        <span className="text-green-400">
          ${totalValue.toFixed(2)}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-700 text-sm text-gray-400">
              <th className="p-2">Coin</th>
              <th className="p-2">Symbol</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Buy Price</th>
              <th className="p-2">
                Current Price
              </th>
              <th className="p-2">Total Value</th>
              <th className="p-2">P/L (%)</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr
                key={asset._id}
                className="border-b border-gray-800"
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
                <td className="p-2 text-green-400">
                  {asset.currentPrice
                    ? `$${asset.currentPrice}`
                    : "Fetching..."}
                </td>
                <td className="p-2 text-yellow-400">
                  {asset.value
                    ? `$${asset.value.toFixed(2)}`
                    : "Calculating..."}
                </td>
                <td
                  className={`p-2 ${
                    asset.profitLossPercent > 0
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
    </main>
  );
}
