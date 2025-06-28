"use client";

import Link from "next/link";
import { Menu, X, Search, User } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[var(--header-bg)] shadow-sm sticky top-0 z-50" style={{ boxShadow: '0 1px 2px var(--header-shadow)' }}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-[var(--header-nav-text)]">UPSC Room Hunt</span>
        </Link>

        {/* Desktop Navigation */}
        {/* <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-[var(--header-nav-text)] hover:text-[var(--header-nav-hover)] font-medium">
            Home
          </Link>
          <Link href="/search" className="text-[var(--header-nav-text)] hover:text-[var(--header-nav-hover)] font-medium">
            Find Hostels
          </Link>
        </nav> */}

        {/* User Actions */}
        {/* <div className="hidden md:flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-[var(--header-button-hover-bg)]">
            <Search size={20} />
          </button>
          <button className="flex items-center space-x-2 bg-[var(--primary)] text-[var(--background)] px-4 py-2 rounded-md hover:bg-[var(--primary)]/90">
            <User size={18} />
            <span>Sign In</span>
          </button>
        </div> */}

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-full hover:bg-[var(--header-button-hover-bg)]"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[var(--header-bg)] shadow-md">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            <Link 
              href="/" 
              className="text-[var(--header-nav-text)] hover:text-[var(--header-nav-hover)] font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/search" 
              className="text-[var(--header-nav-text)] hover:text-[var(--header-nav-hover)] font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Hostels
            </Link>
            <Link 
              href="/about" 
              className="text-[var(--header-nav-text)] hover:text-[var(--header-nav-hover)] font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-[var(--header-nav-text)] hover:text-[var(--header-nav-hover)] font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <button className="flex items-center justify-center space-x-2 bg-[var(--primary)] text-[var(--background)] px-4 py-2 rounded-md hover:bg-[var(--primary)]/90 w-full">
              <User size={18} />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}