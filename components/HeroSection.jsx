"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
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

  return (
    <section className="relative bg-gradient-to-r from-[var(--hero-gradient-from)] to-[var(--hero-gradient-to)] py-16 md:py-24">
      <div className="absolute inset-0 bg-[var(--hero-overlay)]"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="text-[var(--search-text)] text-3xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find Your Perfect Hostel Near UPSC Coaching Centers
          </motion.h1>
          <motion.p
            className="text-[var(--search-sub-text)] text-lg md:text-xl mb-8 opacity-90"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover comfortable and affordable accommodations close to top UPSC coaching institutes in Thiruvananthapuram
          </motion.p>

          {/* Search Box */}
          <motion.div
            className="bg-[var(--search-input-bg)] rounded-lg shadow-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative flex-1 flex items-center border-b md:border-b-0 md:border-r border-[var(--border)]">
                <div className="pl-4 pr-2 py-3 text-[var(--search-input-placeholder)]">
                  <Search size={20} />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for institutes (e.g., Vision IAS, Shankar IAS)"
                  className="flex-1 py-3 px-2 text-[var(--search-input-text)] outline-none"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    if (filteredInstitutions.length > 0) setShowDropdown(true);
                  }}
                  autoComplete="off"
                />
                {showDropdown && filteredInstitutions.length > 0 && (
                  <div
                    className="absolute left-0 right-0 top-full bg-[var(--search-input-bg)] z-[9999] border border-[var(--border)] rounded shadow-lg max-h-60 overflow-y-auto"
                    style={{ minWidth: "100%" }}
                  >
                    {filteredInstitutions.slice(0, 5).map((inst, idx) => (
                      <button
                        key={inst._id}
                        id={`dropdown-item-${idx}`}
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-[var(--primary)] hover:text-[var(--background)] cursor-pointer text-[var(--search-input-text)] transition-colors"
                        onMouseDown={() => handleInstitutionClick(inst.name)}
                        tabIndex={0}
                      >
                        {inst.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative group">
                <button
                  className="flex items-center justify-center px-6 py-3 bg-[var(--search-button-bg)] text-[var(--search-button-text)] font-semibold hover:bg-[var(--search-button-hover)] shadow-md w-full"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  <span>{loading ? "Searching..." : "Search"}</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Filter Tags */}
          <motion.div
            className="flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {filters.map((filter) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? "bg-[var(--search-filter-active-bg)] text-[var(--search-filter-active-text)]"
                    : "bg-[var(--search-filter-inactive-bg)] text-[var(--search-text)] hover:bg-[var(--search-filter-inactive-hover)]"
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}