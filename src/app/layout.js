import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import ParticlesBg from "./components/ParticlesBg";
import { AuthProvider } from "./context/AuthContext";

/*
  📚 HOW NEXT.JS LAYOUTS WORK:
  
  This file is the "Root Layout" — it wraps EVERY page in your app.
  Think of it like a picture frame that stays the same while the 
  picture (page content) changes.
  
  - The <html> and <body> tags MUST be here (Next.js rule)
  - {children} is where each page's content gets inserted
  - Google Fonts are imported and self-hosted automatically
  - The metadata object sets the <title> and <meta> tags for SEO
*/

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "PHONK BATTLE — Vote for the Hardest Track",
  description:
    "Two phonk songs enter. One survives. Listen, compare, and vote for your favorite phonk track. See which songs the community crowns as the hardest.",
  keywords: ["phonk", "music", "battle", "vote", "phonk battle", "music voting"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* 
          📚 We load Orbitron from Google Fonts via a <link> tag
          because next/font only allows one font per import in some setups.
          This font is used for headings (the techy, futuristic look).
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <ParticlesBg />
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
