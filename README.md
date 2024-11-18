# Summarist

Summarist is a fully responsive, feature-packed web application that offers a seamless user experience for book summaries, audio players, and subscription management. This project was built with modern frameworks and best practices, emphasizing scalable code, performance, and user-centric design.

## Project Highlights
- **Responsive Design**: The application is optimized for all screen sizes, ensuring seamless usability across devices.
- **Dynamic Routing**: Utilizes Next.js's powerful routing capabilities to implement dynamic pages for books and audio players.
- **Global State Management**: Efficient state handling using Redux Toolkit to manage authentication, modals, and other app-wide states.
- **Secure Payments**: Stripe integration to handle monthly and yearly subscriptions with a 7-day free trial for annual plans.
- **Debounced Search**: Implemented a high-performance search bar with a 300ms debounce, reducing API calls and improving efficiency.
- **Skeleton Loaders**: Improves user experience by showing loading placeholders while data is fetched.
- **Audio Player**: Built a custom audio player with intuitive controls, including play, pause, skip, and drag-to-seek functionality.
- **API-Driven Content**: Dynamically fetches book data using REST APIs for various sections like "For You" and individual book pages.

## Technologies Used
- **Next.js** (Framework)
- **TypeScript** (Static Typing)
- **Firebase** (Authentication & Firestore for backend)
- **Stripe** (Payment integration via Firebase extension)
- **Redux Toolkit** (State Management)
- **React Icons** (Iconography)
- **Vercel** (Deployment)

## Features
- **User Authentication**: Comprehensive authentication system with email/password login, Google login, guest access, and password reset.
- **Audio Player**: Interactive audio player with essential controls for book summaries.
- **Subscription and Payments**: Stripe integration for subscription management, including monthly and yearly plans.
- **Search Functionality**: Advanced search with debounce for efficient book lookups.
