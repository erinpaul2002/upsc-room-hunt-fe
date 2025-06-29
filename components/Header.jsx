"use client";

import Link from "next/link";
import { Menu, X, Search, User } from "lucide-react";
import { useState } from "react";

export default function Header() {


  return (
    <header className="bg-[var(--header-bg)] shadow-sm sticky top-0 z-50" style={{ boxShadow: '0 1px 2px var(--header-shadow)' }}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          {/* House SVG Logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--header-nav-text)]"
            aria-hidden="true"
          >
            <path d="M3 10.5L12 4l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10.5z" />
            <rect x="9" y="14" width="6" height="8" />
          </svg>
          <span className="font-bold text-xl text-[var(--header-nav-text)]">UPSC Room Hunt</span>
        </Link>
      </div>
    </header>
  );
}