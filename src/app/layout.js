import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "CryptoVault",
  description:
    "Track and manage your crypto portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
