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

export default function Header() {
  const pathname = usePathname();

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
        </ul>
      </nav>
    </header>
  );
}
