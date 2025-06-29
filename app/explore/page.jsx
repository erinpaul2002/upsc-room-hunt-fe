"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";

function HostelSearchByNameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const filter = searchParams.get("filter") || "All";

  const [searchQuery, setSearchQuery] = useState(query);
  const [activeFilter, setActiveFilter] = useState(filter);
  const hostels = useStore((state) => state.hostels);
  const [filteredHostels, setFilteredHostels] = useState([]);
  const inputRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const filters = ["All", "Male", "Female"];

  useEffect(() => {
    let results = hostels;
    if (searchQuery && searchQuery.trim() !== "") {
      results = results.filter((hostel) =>
        hostel.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeFilter !== "All") {
      results = results.filter((hostel) => hostel.gender === activeFilter);
    }
    setFilteredHostels(results);
  }, [searchQuery, activeFilter, hostels]);

  const setSelectedHostel = useStore((state) => state.setSelectedHostel);

  const filteredHostelNames =
    searchQuery.length > 0
      ? hostels.filter((hostel) =>
          hostel.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

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

  const handleViewDetails = (hostel) => {
    setSelectedHostel(hostel, hostel.location || { latitude: null, longitude: null, link: "" });
    router.push(`/details/${hostel._id}`);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(90deg, var(--hero-gradient-from), var(--hero-gradient-to))",
        minHeight: "100vh",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Animated SVG Blobs for background */}
      <motion.div
        className="absolute -top-24 -left-24 w-72 h-72 z-0 pointer-events-none"
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 0.7, 0.5] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="exploreBlob1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a5b4fc" />
              <stop offset="100%" stopColor="#fca5a5" />
            </linearGradient>
          </defs>
          <path
            fill="url(#exploreBlob1)"
            d="M41.3,-66.6C54.6,-59.1,66.2,-54.6,73.5,-44.9C80.8,-35.2,83.8,-20.3,80.8,-7.1C77.8,6.1,68.8,17.6,61.2,29.2C53.6,40.8,47.4,52.5,37.7,60.2C28,67.9,14,71.6,0.2,71.3C-13.6,71,-27.2,66.7,-38.2,58.7C-49.2,50.7,-57.7,39,-63.1,26.2C-68.5,13.4,-70.8,-0.6,-67.2,-13.2C-63.6,-25.8,-54.1,-36.9,-43.5,-44.9C-32.9,-52.9,-21.2,-57.8,-8.1,-63.2C5,-68.6,19.9,-74.1,41.3,-66.6Z"
            transform="translate(100 100)"
          />
        </svg>
      </motion.div>
      <motion.div
        className="absolute -bottom-24 -right-24 w-80 h-80 z-0 pointer-events-none"
        initial={{ scale: 1, opacity: 0.4 }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="exploreBlob2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="100%" stopColor="#6ee7b7" />
            </linearGradient>
          </defs>
          <path
            fill="url(#exploreBlob2)"
            d="M37.6,-60.7C48.7,-54.2,57.6,-44.2,62.6,-32.7C67.6,-21.2,68.7,-8.1,67.2,5.7C65.7,19.5,61.7,34,52.1,44.2C42.5,54.4,27.3,60.3,12.1,62.7C-3.1,65.1,-18.3,64,-31.1,57.2C-43.9,50.4,-54.3,37.9,-60.1,23.7C-65.9,9.5,-67.1,-6.4,-62.2,-20.6C-57.3,-34.8,-46.3,-47.3,-33.2,-54.1C-20.1,-60.9,-10,-62,1.2,-63.5C12.4,-65,24.8,-66.7,37.6,-60.7Z"
            transform="translate(100 100)"
          />
        </svg>
      </motion.div>
      {/* Overlay for depth */}
      <div className="absolute inset-0" style={{ background: "var(--hero-overlay)", zIndex: 1 }}></div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Search Header */}
        <div className="bg-[var(--hero-gradient-from)] py-6 shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-4">
              <Link href="/" className="mr-4 hover:opacity-80 transition-opacity">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-[var(--search-text)] text-xl md:text-2xl font-semibold">Search Hostels by Name</h1>
            </div>
            <div className="bg-[var(--search-input-bg)] rounded-lg shadow-lg mb-4 flex relative">
              <div className="flex-1 flex items-center relative">
                <div className="pl-4 pr-2 py-3 text-[var(--search-input-placeholder)]">
                  <Search size={20} />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for hostels by name"
                  className="flex-1 py-3 px-2 text-[var(--search-input-text)] outline-none"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && setShowDropdown(false)}
                  onFocus={() => {
                    if (filteredHostelNames.length > 0) setShowDropdown(true);
                  }}
                  autoComplete="off"
                />
                {showDropdown && filteredHostelNames.length > 0 && (
                  <div
                    className="absolute left-0 right-0 top-full bg-[var(--search-input-bg)] z-[9999] border border-[var(--border)] rounded shadow-lg max-h-60 overflow-y-auto"
                    style={{ minWidth: "100%" }}
                  >
                    {filteredHostelNames.slice(0, 5).map((hostel, idx) => (
                      <button
                        key={hostel._id || hostel.id || idx}
                        id={`dropdown-item-${idx}`}
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-[var(--search-input-bg-hover)] cursor-pointer text-[var(--search-input-text)] transition-colors"
                        onMouseDown={() => {
                          setSearchQuery(hostel.name);
                          setShowDropdown(false);
                          inputRef.current?.focus();
                        }}
                        tabIndex={0}
                      >
                        {hostel.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button 
                className="px-6 py-3 bg-[var(--search-button-bg)] text-[var(--search-button-text)] font-semibold hover:bg-[var(--search-button-hover)] rounded"
                onClick={() => setShowDropdown(false)}
              >
                Search
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filterOption) => (
                <button
                  key={filterOption}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === filterOption
                      ? "bg-[var(--search-filter-active-bg)] text-[var(--search-filter-active-text)]"
                      : "bg-[var(--search-filter-inactive-bg)] text-[var(--search-text)] hover:bg-[var(--search-filter-inactive-hover)]"
                  }`}
                  onClick={() => {
                    setActiveFilter(filterOption);
                  }}
                >
                  {filterOption}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-[var(--search-sub-text)] text-xl font-bold mb-4">
            {filteredHostels.length} {filteredHostels.length === 1 ? 'Result' : 'Results'} Found
          </h2>
          {filteredHostels.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--muted)] text-lg">No hostels found matching your search criteria.</p>
              <p className="text-[var(--muted)]">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHostels.map((hostel, index) => (
                <motion.div
                  key={hostel._id || hostel.id || index}
                  className="bg-[var(--card-bg)] rounded-lg shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={hostel.image && hostel.image.trim() !== '' ? hostel.image : "/placeholder-image.png"}
                      alt={hostel.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="absolute top-3 right-3 bg-[var(--gender-badge-bg)] text-[var(--gender-badge-text)] px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      {hostel.gender}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-[var(--card-text)] text-lg font-bold mb-1">{hostel.name}</h3>
                    <p className="text-[var(--card-sub-text)] text-sm mb-2 flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {typeof hostel.location === "object"
                        ? hostel.location?.address || ""
                        : hostel.location || ""}
                    </p>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {/* Show all room types as badges */}
                      {Array.isArray(hostel.rooms) && hostel.rooms.length > 0
                        ? Array.from(new Set(hostel.rooms.map(r => r.type))).map((type, idx) => (
                            <span
                              key={type + idx}
                              className="bg-[var(--room-badge-bg)] text-[var(--room-badge-text)] px-2 py-1 rounded text-xs font-medium"
                            >
                              {type}
                            </span>
                          ))
                        : (
                            <span className="bg-[var(--room-badge-bg)] text-[var(--room-badge-text)] px-2 py-1 rounded text-xs font-medium">
                              {hostel.roomType || 'Room'}
                            </span>
                          )}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {hostel.amenities?.slice(0, 4).map((amenity, i) => (
                        <span key={amenity + i} className="bg-[var(--amenity-bg)] text-[var(--amenity-text)] px-2 py-1 rounded-full text-xs flex items-center">
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--price-text)] text-lg font-bold">
                        {/* Price display: show low-high if multiple room types, else single price */}
                        {Array.isArray(hostel.rooms) && hostel.rooms.length > 0
                          ? (() => {
                              const prices = hostel.rooms
                                .map(r => r.price)
                                .filter(p => typeof p === 'number' || !isNaN(Number(p)))
                                .map(Number);
                              if (prices.length === 1) {
                                return `₹${prices[0]}`;
                              } else if (prices.length > 1) {
                                const min = Math.min(...prices);
                                const max = Math.max(...prices);
                                return min === max ? `₹${min}` : `₹${min} - ₹${max}`;
                              } else {
                                return hostel.price ? `₹${hostel.price}` : 'N/A';
                              }
                            })()
                          : (hostel.price ? `₹${hostel.price}` : 'N/A')}
                        <span className="text-base text-[var(--price-text)] font-normal">/month</span>
                      </span>
                      <button
                        className="bg-[var(--button-bg)] text-[var(--button-text)] px-4 py-2 rounded hover:bg-[var(--button-bg-hover)] transition-colors text-sm font-medium"
                        onClick={() => handleViewDetails(hostel)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HostelSearchByNamePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HostelSearchByNameContent />
    </Suspense>
  );
}
