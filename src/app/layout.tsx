"use client";

import "./globals.css";
import { Provider } from 'react-redux';
import store from "@/redux/store";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Provider store={store}>
          <AppRouterCacheProvider>
              {children}
          </AppRouterCacheProvider>
        </Provider>
      </body>
    </html>
  );
}