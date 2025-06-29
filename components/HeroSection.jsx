"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Home, BookOpen, MapPin, ArrowDown, Users, Star, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { searchHostels } from "../utils/searchHostels";
import useStore from "../store/store";

export default function HeroSection() {
  const institutions = useStore((state) => state.institutions);
  const setSelectedInstitute = useStore((state) => state.setSelectedInstitute);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const router = useRouter();

  const filters = ["All", "Male", "Female"];

  // Filter institutions based on search query
  const filteredInstitutions =
    searchQuery.length > 0
      ? institutions.filter((inst) =>
          inst.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  // Find the selected institution object by name
  const selectedInstitution = institutions.find(
    (inst) => inst.name.toLowerCase() === searchQuery.toLowerCase()
  );

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const distance = 1000;
      const { matchedInstitute } = await searchHostels({
        institutions,
        searchQuery,
        activeFilter,
        distance,
      });
      if (matchedInstitute && matchedInstitute._id) {
        router.push(
          `/search?instituteId=${matchedInstitute._id}&filter=${encodeURIComponent(
            activeFilter
          )}&distance=${distance}`
        );
      } else {
        router.push(
          `/search?query=${encodeURIComponent(
            searchQuery
          )}&filter=${encodeURIComponent(activeFilter)}`
        );
      }
    } catch (error) {
      console.error(error);
      alert("Error fetching hostels nearby.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "ArrowDown" && filteredInstitutions.length > 0) {
      const firstItem = document.getElementById("dropdown-item-0");
      if (firstItem) firstItem.focus();
    }
  };

  const handleInstitutionClick = (name) => {
    setSearchQuery(name);
    setShowDropdown(false);
    const inst = institutions.find((i) => i.name === name);
    if (inst) {
      setSelectedInstitute(inst, inst.location || { latitude: null, longitude: null, link: "" });
    }
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (!inputRef.current?.parentNode.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showDropdown]);

  // Parallax state
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setParallax({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animation variants for floating icons
  const floatVariants = {
    animate: (custom) => ({
      y: [0, custom, 0],
      transition: { repeat: Infinity, duration: 4 + Math.random() * 2, ease: "easeInOut" }
    }),
    rotate: (custom) => ({
      rotate: [0, custom, 0],
      transition: { repeat: Infinity, duration: 8 + Math.random() * 2, ease: "easeInOut" }
    })
  };

  return (
    <section className="relative bg-gradient-to-r from-[var(--hero-gradient-from)] to-[var(--hero-gradient-to)] py-10 md:py-24 overflow-hidden min-h-[90vh] flex items-center border-b" style={{ borderColor: "var(--border)" }}>
      {/* Animated SVG Blobs with Parallax */}
      <motion.div
        className="absolute -top-20 -left-20 w-72 h-72 z-0 pointer-events-none"
        style={{ x: parallax.x, y: parallax.y }}
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 0.7, 0.5] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="blob1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a5b4fc" />
              <stop offset="100%" stopColor="#fca5a5" />
            </linearGradient>
          </defs>
          <path
            fill="url(#blob1)"
            d="M41.3,-66.6C54.6,-59.1,66.2,-54.6,73.5,-44.9C80.8,-35.2,83.8,-20.3,80.8,-7.1C77.8,6.1,68.8,17.6,61.2,29.2C53.6,40.8,47.4,52.5,37.7,60.2C28,67.9,14,71.6,0.2,71.3C-13.6,71,-27.2,66.7,-38.2,58.7C-49.2,50.7,-57.7,39,-63.1,26.2C-68.5,13.4,-70.8,-0.6,-67.2,-13.2C-63.6,-25.8,-54.1,-36.9,-43.5,-44.9C-32.9,-52.9,-21.2,-57.8,-8.1,-63.2C5,-68.6,19.9,-74.1,41.3,-66.6Z"
            transform="translate(100 100)"
          />
        </svg>
      </motion.div>
      <motion.div
        className="absolute -bottom-24 -right-24 w-80 h-80 z-0 pointer-events-none"
        style={{ x: -parallax.x, y: -parallax.y }}
        initial={{ scale: 1, opacity: 0.4 }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="blob2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="100%" stopColor="#6ee7b7" />
            </linearGradient>
          </defs>
          <path
            fill="url(#blob2)"
            d="M37.6,-60.7C48.7,-54.2,57.6,-44.2,62.6,-32.7C67.6,-21.2,68.7,-8.1,67.2,5.7C65.7,19.5,61.7,34,52.1,44.2C42.5,54.4,27.3,60.3,12.1,62.7C-3.1,65.1,-18.3,64,-31.1,57.2C-43.9,50.4,-54.3,37.9,-60.1,23.7C-65.9,9.5,-67.1,-6.4,-62.2,-20.6C-57.3,-34.8,-46.3,-47.3,-33.2,-54.1C-20.1,-60.9,-10,-62,1.2,-63.5C12.4,-65,24.8,-66.7,37.6,-60.7Z"
            transform="translate(100 100)"
          />
        </svg>
      </motion.div>

      {/* Floating Animated Icons - Corners & Sides */}
      <motion.div
        className="absolute left-8 top-16 z-20 hidden md:block"
        variants={floatVariants}
        animate="animate"
        custom={-18}
      >
        <Users size={32} className="text-pink-400 drop-shadow-lg" />
      </motion.div>
      <motion.div
        className="absolute right-12 top-24 z-20 hidden md:block"
        variants={floatVariants}
        animate="animate"
        custom={22}
      >
        <Star size={28} className="text-yellow-400 drop-shadow-lg" />
      </motion.div>
      <motion.div
        className="absolute left-[18%] top-[38%] z-20 hidden md:block"
        variants={floatVariants}
        animate="animate"
        custom={15}
      >
        <Building2 size={30} className="text-blue-400 drop-shadow-lg" />
      </motion.div>
      <motion.div
        className="absolute right-[22%] bottom-28 z-20 hidden md:block"
        variants={floatVariants}
        animate="animate"
        custom={-14}
      >
        <BookOpen size={28} className="text-emerald-400 drop-shadow-lg" />
      </motion.div>
      <motion.div
        className="absolute left-16 top-1/3 z-20 hidden md:block"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        <Home size={36} className="text-indigo-400 drop-shadow-lg" />
      </motion.div>
      <motion.div
        className="absolute right-24 top-[30%] z-20 hidden md:block"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      >
        <BookOpen size={32} className="text-yellow-400 drop-shadow-lg" />
      </motion.div>
      <motion.div
        className="absolute left-[55%] bottom-16 z-20 hidden md:block"
        animate={{ x: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        <MapPin size={32} className="text-green-400 drop-shadow-lg" />
      </motion.div>

      {/* More Floating Elements - Left Bottom */}
      <motion.div
        className="absolute left-16 bottom-16 z-20 hidden md:block"
        animate={{ y: [0, -18, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      >
        <Home size={30} style={{ color: "var(--primary)" }} className="drop-shadow-lg" />
      </motion.div>
      <motion.div
        className="absolute left-32 bottom-32 z-20 hidden md:block"
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        <BookOpen size={26} style={{ color: "var(--accent)" }} className="drop-shadow-lg" />
      </motion.div>
      <motion.div
        className="absolute left-44 bottom-12 z-20 hidden md:block"
        animate={{ x: [0, 14, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      >
        <div className="w-4 h-4 rounded-full" style={{ background: "var(--muted)", opacity: 0.6 }} />
      </motion.div>
      <motion.div
        className="absolute left-28 bottom-8 z-20 hidden md:block"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        <div className="w-3 h-3 rounded-full" style={{ background: "var(--accent-dark)", opacity: 0.7 }} />
      </motion.div>

      {/* Decorative Dots using accent/muted colors */}
      <motion.div
        className="absolute left-[38%] top-12 z-10 hidden md:block"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      >
        <div className="w-4 h-4 rounded-full" style={{ background: "var(--accent)", opacity: 0.7 }} />
      </motion.div>
      <motion.div
        className="absolute right-[36%] bottom-12 z-10 hidden md:block"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        <div className="w-3 h-3 rounded-full" style={{ background: "var(--muted)", opacity: 0.7 }} />
      </motion.div>
      <motion.div
        className="absolute left-[52%] top-[54%] z-10 hidden md:block"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: "var(--primary)", opacity: 0.6 }} />
      </motion.div>

      <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }}></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="font-bold mb-4"
            style={{ color: "var(--search-text)", fontSize: "clamp(2rem, 5vw, 3rem)" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find Your Perfect Hostel Near UPSC Coaching Centers
          </motion.h1>
          <motion.p
            className="mb-8 opacity-90"
            style={{ color: "var(--search-sub-text)", fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover comfortable and affordable accommodations close to top UPSC coaching institutes in Thiruvananthapuram
          </motion.p>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <motion.div
              className="flex items-center gap-2 px-3 py-1 rounded-full shadow text-sm font-medium"
              style={{ background: "var(--search-filter-inactive-bg)", color: "var(--search-filter-inactive-text)", boxShadow: "0 2px 8px var(--card-shadow)" }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Star size={16} style={{ color: "var(--accent)" }} /> Verified Hostels
            </motion.div>
            <motion.div
              className="flex items-center gap-2 px-3 py-1 rounded-full shadow text-sm font-medium"
              style={{ background: "var(--search-filter-inactive-bg)", color: "var(--search-filter-inactive-text)", boxShadow: "0 2px 8px var(--card-shadow)" }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Users size={16} style={{ color: "var(--primary)" }} /> Student Friendly
            </motion.div>
            <motion.div
              className="flex items-center gap-2 px-3 py-1 rounded-full shadow text-sm font-medium"
              style={{ background: "var(--search-filter-inactive-bg)", color: "var(--search-filter-inactive-text)", boxShadow: "0 2px 8px var(--card-shadow)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <MapPin size={16} style={{ color: "var(--primary-dark)" }} /> Near Institutes
            </motion.div>
          </div>

          {/* Search Box */}
          <motion.div
            className="bg-[var(--search-input-bg)] rounded-lg shadow-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Make this container relative so dropdown is positioned correctly */}
            <div className="flex flex-col md:flex-row relative items-center gap-2">
              <div className="relative flex-1 flex items-center border-b md:border-b-0 md:border-r border-[var(--border)]">
                <div className="pl-4 pr-2 py-3 text-[var(--search-input-placeholder)]">
                  <Search size={20} />
                </div>
                <motion.input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for institutes (e.g., Vision IAS, Shankar IAS)"
                  className="flex-1 py-3 px-2 text-[var(--search-input-text)] outline-none focus:outline-none bg-transparent transition-transform duration-200"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    if (searchQuery.length > 0) setShowDropdown(true);
                  }}
                  aria-label="Search for institutes"
                  whileFocus={{ scale: 1.03, boxShadow: "none" }}
                />
              </div>
              <div className="flex-none">
                <motion.button
                  onClick={handleSearch}
                  className="w-full px-4 py-2 text-white bg-[var(--primary)] rounded-lg shadow-md flex items-center justify-center transition-all duration-200"
                  disabled={loading}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.05 }}
                  aria-label="Search"
                  whileTap={{ scale: 0.96, backgroundColor: "var(--primary-dark)" }} // Add tap effect
                  whileHover={{
                    scale: 1.08,
                    boxShadow: "0 4px 24px 0 rgba(80, 80, 200, 0.18)",
                    transition: { duration: 0.05 }
                  }} // Add hover effect
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  ) : (
                    "Search"
                  )}
                </motion.button>
              </div>
              {/* Place dropdown here, outside the input flex row */}
              {showDropdown && filteredInstitutions.length > 0 && (
                <motion.div
                  className="absolute left-0 right-0 top-full mt-1 rounded-lg shadow-lg z-10 w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  onMouseDown={e => e.stopPropagation()}
                  style={{
                    minWidth: 0,
                    background: "var(--search-input-bg)",
                    color: "var(--search-input-text)",
                    boxShadow: "0 2px 16px var(--card-shadow)"
                  }}
                >
                  {filteredInstitutions.map((inst, index) => (
                    <motion.div
                      key={inst._id}
                      id={`dropdown-item-${index}`}
                      className="px-4 py-2 text-left cursor-pointer"
                      style={{
                        background: "transparent",
                        color: "inherit"
                      }}
                      onMouseDown={() => handleInstitutionClick(inst.name)}
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: "var(--search-filter-inactive-bg)",
                        color: "var(--search-filter-inactive-text)"
                      }}
                      transition={{ duration: 0.2 }}
                      tabIndex={0}
                      aria-label={`Select ${inst.name}`}
                    >
                      {inst.name}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Filters */}
          <div className="flex justify-center gap-2 mb-8">
            {filters.map((filter) => (
              <motion.button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setSearchQuery("");
                  setShowDropdown(false);
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  activeFilter === filter
                    ? "bg-[var(--primary)] text-white shadow-md"
                    : "bg-[var(--filter-bg)] text-[var(--filter-text)]"
                }`}
                aria-label={`Filter by ${filter}`}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.08 }}
              >
                {filter}
              </motion.button>
            ))}
          </div>

          {/* Animated Call-to-Action Arrow */}
          <motion.div
            className="flex justify-center mt-8"
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ArrowDown size={32} className="text-[var(--primary)] opacity-80" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}