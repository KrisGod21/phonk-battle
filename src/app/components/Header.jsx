"use client";

/*
  📚 HOW NEXT.JS NAVIGATION WORKS:
  
  We use next/link's <Link> component instead of regular <a> tags.
  Why? Because <Link> does "client-side navigation" — it only swaps 
  the page content without reloading the entire browser page.
  
  This makes page transitions instant and smooth, like a single-page 
  app, while still getting all the SEO benefits of a multi-page site.
  
  usePathname() gives us the current URL path so we can highlight 
  the active navigation link.
*/

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <header className="header" id="main-header">
      <Link href="/" className="header__logo">
        ⚡ PHONK BATTLE
      </Link>
      <nav>
        <ul className="header__nav">
          <li>
            <Link
              href="/"
              className={`header__link ${
                pathname === "/" ? "header__link--active" : ""
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/battle"
              className={`header__link ${
                pathname === "/battle" ? "header__link--active" : ""
              }`}
            >
              Battle
            </Link>
          </li>
          <li>
            <Link
              href="/leaderboard"
              className={`header__link ${
                pathname === "/leaderboard" ? "header__link--active" : ""
              }`}
            >
              Leaderboard
            </Link>
          </li>
          {user ? (
            <li className="header__user-info">
              <span className="header__user-email">{user.email}</span>
              <button className="header__signout-btn" onClick={signOut}>
                Sign Out
              </button>
            </li>
          ) : (
            <li>
              <Link href="/login" className="header__login-btn">
                Sign In
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
