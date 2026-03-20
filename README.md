🚀 Ox Streak Stars (React + TypeScript + Vite)

A simple web application built with React + TypeScript + Vite.
This project is designed for fast development, clean structure, and easy extensibility (e.g. adding authentication, APIs, or game logic).

📦 Tech Stack

⚛️ React
🟦 TypeScript
⚡ Vite
🎨 CSS / Tailwind (if applicable)

🛠️ Prerequisites

Make sure you have the following installed:
Node.js (>= 16.x recommended)
npm or yarn

Check versions:
node -v
npm -v

📥 Installation

Clone the repository:

git clone <your-repo-url>
cd ox-streak-stars-main

Install dependencies:

npm install
or
yarn install

▶️ Running the Project

Start the development server:
npm run dev
or
yarn dev

Then open your browser at:
http://localhost:5173

🏗️ Build for Production

npm run build
Preview production build:
npm run preview

📁 Project Structure
src/
│── components/      # Reusable UI components
│── pages/           # Page-level components (if used)
│── assets/          # Static assets (images, icons)
│── lib/             # Utilities / configs (e.g. firebase)
│── App.tsx          # Main app component
│── main.tsx         # Entry point

🔐 (Optional) Authentication Setup

This project can be extended with authentication (Google / Facebook login).
Recommended approach:
Use Firebase Authentication

Steps:
Create a Firebase project
Enable Google / Facebook providers

Add config in:
src/lib/firebase.ts

Example:

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

⚙️ Environment Variables (Optional)

Create a .env file:
VITE_API_URL=http://localhost:3000

Access in code:
import.meta.env.VITE_API_URL

🧪 Scripts
Command	Description
npm run dev	Start dev server
npm run build	Build for production
npm run preview	Preview production build

📌 Notes

Vite provides fast HMR (Hot Module Replacement)
TypeScript ensures type safety
Keep components small and reusable
Avoid putting business logic directly in UI components

🚀 Future Improvements

Add authentication (OAuth / Firebase)
Connect backend API
Store user data (score, profile)
Add state management (Zustand / Redux)
Improve UI/UX

👨‍💻 Author

Kritsanut (Tod)

📄 License

MIT License
