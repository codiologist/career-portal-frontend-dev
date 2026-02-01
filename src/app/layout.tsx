import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";

import ScreenSizeIndicator from "@/components/screen-size-indicator";
import { AuthProvider } from "@/context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";

const exo2 = Exo_2({
  variable: "--font-exo-2",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Career Portal",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${exo2.className} antialiased`}>
        <AuthProvider>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
          >
            <ToastContainer />
            {children}
          </GoogleOAuthProvider>
        </AuthProvider>
        <ScreenSizeIndicator />
      </body>
    </html>
  );
}
