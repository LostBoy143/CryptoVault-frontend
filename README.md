# CryptoVault Frontend

The CryptoVault Frontend is a modern, responsive web interface built using Next.js and Tailwind CSS. It allows users to interact with the crypto portfolio system — including authentication, viewing coins, and managing portfolios.

## Features

- Responsive landing page with hero section and navbar
- Login and Signup with JWT authentication
- Add or remove crypto assets from portfolio
- Fetch live coin data using CoinGecko API
- Display profit/loss with real-time prices
- Scroll indicators and loaders for smooth UX
- Dashboard and Coins pages optimized for both desktop and mobile
- Protected routes based on authentication

## Tech Stack

- Next.js (App Router)
- React.js
- Tailwind CSS
- CoinGecko API
- Framer Motion (animations)
- JWT for authentication

## Setup Instructions

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and add your backend API URL:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Pages Overview

| Page         | Description                  |
| ------------ | ---------------------------- |
| `/`          | Landing page                 |
| `/login`     | User login                   |
| `/signup`    | User registration            |
| `/coins`     | View all live crypto data    |
| `/dashboard` | View portfolio & total value |

## UI Highlights

- Dark theme with gradients
- Fully responsive for mobile/tablet
- Smooth transitions & loaders
- Subtle hover animations for interactivity

## Future Enhancements

- Add AI-powered market insights (Gemini/OpenAI)
- Create MarketPulse analytics dashboard
- Integrate a watchlist and notifications

**Author:** Shubham Singh  
**Part of:** CryptoVault Full-Stack Application
