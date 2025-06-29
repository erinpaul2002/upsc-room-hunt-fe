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
          <span className="font-bold text-xl text-[var(--header-nav-text)]">UPSC Room Hunt</span>
        </Link>
      </div>
    </header>
  );
}