# FinFlow - Personal Finance Tracker

A professional, fintech-styled personal finance dashboard built with React, Vite, Tailwind CSS, and Firebase.

## 🚀 Graphic & Theme
- **Theme**: "Bloomberg meets Revolut" (Deep Navy, Cyan, Emerald).
- **Styling**: Tailwind CSS + CSS Variables.
- **Charts**: Recharts (Pie & Bar).
- **Icons**: Lucide React.

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS
- **Backend & Auth**: Firebase (Firestore, Auth)
- **Routing**: React Router DOM v6
- **State Management**: React Context API

## ⚙️ Setup Instructions

1.  **Clone & Install**
    ```bash
    git clone <repo-url>
    cd financetracker
    npm install
    ```

2.  **Firebase Configuration**
    - Create a project at [Firebase Console](https://console.firebase.google.com/).
    - Enable **Authentication** (Email/Password).
    - Enable **Firestore Database** (Start in Test Mode).
    - Copy your web app configuration keys.
    - Open `src/firebase/config.js` and replace the placeholder values:
      ```javascript
      const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        // ... other keys
      };
      ```

3.  **Run Locally**
    ```bash
    npm run dev
    ```

## 📦 Deployment (Vercel)

1.  Install Vercel CLI or connect via GitHub.
2.  A `vercel.json` is included to handle client-side routing.
3.  Deploy:
    ```bash
    npm run build
    vercel
    ```

## 📂 Features
- **Dashboard**: Real-time summary of Balance, Income, and Expenses.
- **Transactions**: Add, Edit, Delete, Filter, and Search.
- **Charts**: Visual breakdown of spending by category and monthly trends.
- **Authentication**: Secure Login and Registration.
- **Dark/Light Mode**: Toggleable theme with persistence.
