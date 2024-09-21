# Summarist

Summarist is an interactive audio book platform built during the Frontend Simplified virtual internship. The application allows users to browse, listen to, and manage their audio book library, featuring a sleek design and robust functionality.

## Live Demo

You can view the live application here: [Summarist](https://summarist-maa7zndk4-pharaohmaks-projects.vercel.app/?projectId=1)

## Technologies Used

This project was developed using the following technologies:

- **Next.js**: A React framework for server-side rendering and static site generation.
- **TypeScript**: A superset of JavaScript for type safety.
- **Firebase**: Used for authentication and Firestore database.
- **Stripe**: Integrated for payment processing using Firebase extensions.
- **Redux**: For state management with Redux Toolkit.
- **React Icons**: For scalable and customizable icons.
- **Vercel**: For deployment.

## Features

### Home Page
- User authentication modal
  - Register, Login, Logout, Guest login
  - Forgot password (optional)
  - Google login (optional)

### For You Page
- Display selected, recommended, and suggested books with book pills indicating subscription requirements.

### Book Pages
- Display content of books with options to save books to the library.
- Audio player for listening to books.

### Sales Page
- Subscription plans for users to choose from with integrated payment processing.

### Settings Page
- Display user subscription status and email.

### Additional Features
- Search bar with debounced input for searching books by title or author.
- Sidebar navigation throughout the application.
- Skeleton loading states for asynchronous content loading.
- Optional Library page to display saved and finished books.
