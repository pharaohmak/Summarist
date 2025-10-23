# 📖 Summarist

**Summarist** is a fully responsive, feature-rich web application for accessing book summaries, audio content, and subscription-based features. Built with modern frameworks like **Next.js** and **TypeScript**, it prioritizes performance, user experience, and scalable architecture.

## 🚀 Features

- 🔐 **User Authentication** – Secure login via email/password, Google, guest access, and password reset using Firebase.
- 🎧 **Custom Audio Player** – Built-in player with intuitive controls: play, pause, skip, and seek functionality.
- 💳 **Subscriptions & Payments** – Stripe integration supporting monthly and yearly plans, including a 7-day trial.
- 🔎 **Advanced Search** – Debounced search bar with 300ms delay to reduce API load and enhance UX.
- 📘 **Dynamic Book Pages** – Content-rich pages powered by dynamic routes in Next.js.
- 🧠 **Global State Management** – Redux Toolkit for efficient handling of authentication, modals, and more.
- ⏳ **Skeleton Loaders** – Loading placeholders for a polished, fast-feeling experience.
- 🌐 **API-Driven Content** – REST API integration for curated book lists and individual summaries.
- 📱 **Responsive Design** – Optimized for seamless interaction across all devices.

## 🧰 Tech Stack

| Category         | Technologies                             |
|------------------|------------------------------------------|
| **Framework**     | Next.js (React)                          |
| **Language**      | TypeScript                               |
| **Auth & DB**     | Firebase (Auth & Firestore)              |
| **Payments**      | Stripe (via Firebase extension)          |
| **State Management** | Redux Toolkit                       |
| **Icons**         | React Icons                              |
| **Deployment**    | Vercel                                   |

## 📸 Screenshots

<!-- Optional: Add screenshots -->
![Screenshot 1](./Summarist.png)

## 📦 Installation

To run this project locally:

```bash
```bash
git clone https://github.com/pharaohmak/Summarist.git
cd Summarist
npm install
npm run dev
