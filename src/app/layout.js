import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white">
        <Navbar />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1f2937",
              color: "#fff",
              border: "1px solid #374151",
            },
          }}
        />
      </body>
    </html>
  );
}
