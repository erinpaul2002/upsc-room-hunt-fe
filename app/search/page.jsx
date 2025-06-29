"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import axiosClient from "@/utils/axiosClient";
import { searchHostels } from "@/utils/searchHostels";
import useStore from "@/store/store";
import { calculateDistance } from "@/utils/distance";
import { useRouter } from "next/navigation";

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const filter = searchParams.get("filter") || "All";
  const instituteId = searchParams.get("instituteId") || null;
  const distance = searchParams.get("distance") || 1000;

  const [searchQuery, setSearchQuery] = useState(query);
  const [activeFilter, setActiveFilter] = useState(filter);
  const hostels = useStore((state) => state.hostels);
  const [filteredHostels, setFilteredHostels] = useState([]);
  const [matchedInstitute, setMatchedInstitute] = useState(null);
  const institutions = useStore((state) => state.institutions);
  const inputRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const filters = ["All", "Male", "Female"];

  useEffect(() => {
    let institute = null;
    if (instituteId) {
      institute = institutions.find((inst) => inst._id === instituteId);
    } else {
      institute = institutions.find(
        (inst) => inst.name.toLowerCase() === query.toLowerCase()
      );
    }
    setMatchedInstitute(institute);

    async function fetchHostels() {
      if ((query === '' || query === null) && !instituteId) {
        // If search is empty and not searching by institute, show all hostels
        let results = hostels;
        if (activeFilter !== "All") {
          results = results.filter((hostel) => hostel.gender === activeFilter);
        }
        setFilteredHostels(results);
        setNearbyHostels(results);
        return;
      }
      if (institute && institute._id) {
        try {
          const res = await axiosClient.get(`/hostels/nearby/${institute._id}`, {
            params: { distance: Number(distance) },
          });
          let results = res.data;
          if (activeFilter !== "All") {
            results = results.filter((hostel) => hostel.gender === activeFilter);
          }
          setFilteredHostels(results);
          setNearbyHostels(results);
        } catch (err) {
          setFilteredHostels([]);
          setNearbyHostels([]);
        }
      } else {
        setFilteredHostels([]);
        setNearbyHostels([]);
      }
    }
    if (institutions.length > 0) {
      fetchHostels();
    }
  }, [query, activeFilter, institutions, instituteId, distance, hostels]);

  const setSelectedInstitute = useStore((state) => state.setSelectedInstitute);
  const setNearbyHostels = useStore((state) => state.setNearbyHostels);
  const setSelectedHostel = useStore((state) => state.setSelectedHostel);

  const handleInstitutionClick = (name) => {
    setSearchQuery(name);
    setShowDropdown(false);
    const inst = institutions.find((i) => i.name === name);
    if (inst) {
      setSelectedInstitute(inst, inst.location || { latitude: null, longitude: null, link: "" });
    }
    inputRef.current?.focus();
  };

  const handleSearch = async () => {
    let url;
    const selectedInstitute = institutions.find(
      (inst) => inst.name.toLowerCase() === searchQuery.toLowerCase()
    );
    if (selectedInstitute) {
      setSelectedInstitute(selectedInstitute, selectedInstitute.location || { latitude: null, longitude: null, link: "" });
    }
    if (selectedInstitute && selectedInstitute._id) {
      url = `/search?instituteId=${selectedInstitute._id}&filter=${encodeURIComponent(activeFilter)}&distance=${distance}`;
    } else {
      url = `/search?query=${encodeURIComponent(searchQuery)}&filter=${encodeURIComponent(activeFilter)}`;
    }
    window.history.pushState({}, "", url);

    // If search is empty, show all hostels
    if (!searchQuery || searchQuery.trim() === "") {
      let results = hostels;
      if (activeFilter !== "All") {
        results = results.filter((hostel) => hostel.gender === activeFilter);
      }
      setMatchedInstitute(null);
      setFilteredHostels(results);
      setNearbyHostels(results);
      return;
    }

    const { results, matchedInstitute } = await searchHostels({
      institutions,
      searchQuery,
      activeFilter,
      distance,
    });
    setMatchedInstitute(matchedInstitute);
    setFilteredHostels(results);
    setNearbyHostels(results);
  };

  const filteredInstitutions =
    searchQuery.length > 0
      ? institutions.filter((inst) =>
          inst.name.toLowerCase().includes(searchQuery.toLowerCase())
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
    router.push(`/hostels/${hostel._id}`);
  };

  const selectedInstitute = useStore((state) => state.selectedInstitute);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Search Header */}
      <div className="bg-[var(--hero-gradient-from)] py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-4">
            <Link href="/" className="mr-4 hover:opacity-80 transition-opacity">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-[var(--search-text)] text-xl md:text-2xl font-semibold">Search Results</h1>
          </div>
          <div className="bg-[var(--search-input-bg)] rounded-lg shadow-lg mb-4 flex relative">
            <div className="flex-1 flex items-center relative">
              <div className="pl-4 pr-2 py-3 text-[var(--search-input-placeholder)]">
                <Search size={20} />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for institutes"
                className="flex-1 py-3 px-2 text-[var(--search-input-text)] outline-none"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
                      className="w-full text-left px-4 py-2 hover:bg-[var(--search-input-bg-hover)] cursor-pointer text-[var(--search-input-text)] transition-colors"
                      onMouseDown={() => handleInstitutionClick(inst.name)}
                      tabIndex={0}
                    >
                      {inst.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button 
              className="px-6 py-3 bg-[var(--search-button-bg)] text-[var(--search-button-text)] font-semibold hover:bg-[var(--search-button-hover)] rounded"
              onClick={handleSearch}
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
        {matchedInstitute && (
          <div className="mb-8 p-4 bg-[var(--institute-card-bg)] rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-40 h-40 relative rounded-lg overflow-hidden">
                <Image 
                  src={matchedInstitute.image && matchedInstitute.image.trim() !== '' ? matchedInstitute.image : "/placeholder-image.png"}
                  alt={matchedInstitute.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="flex-1">
                <h2 className="text-[var(--institute-card-text)] text-2xl font-bold mb-2">{matchedInstitute.name}</h2>
                <p className="text-[var(--institute-card-location)] mb-2">
                  <MapPin size={16} className="inline-block mr-1" />
                  {matchedInstitute.location?.address || ""}
                </p>
                <p className="text-[var(--institute-card-sub-text)] mb-2">
                  {filteredHostels.length} accommodations found near {matchedInstitute.name}
                </p>
              </div>
            </div>
          </div>
        )}
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
            {filteredHostels.map((hostel, index) => {
              let distanceKm = null;
              if (
                selectedInstitute?.location?.latitude &&
                selectedInstitute?.location?.longitude &&
                hostel?.location?.latitude &&
                hostel?.location?.longitude
              ) {
                distanceKm = calculateDistance(
                  selectedInstitute.location.latitude,
                  selectedInstitute.location.longitude,
                  hostel.location.latitude,
                  hostel.location.longitude
                );
              }
              return (
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
                      <span className="bg-[var(--distance-badge-bg)] text-[var(--distance-badge-text)] px-2 py-1 rounded text-xs font-medium">
                        {distanceKm !== null
                          ? distanceKm < 1
                            ? `${(distanceKm * 1000).toFixed(0)} m`
                            : `${distanceKm.toFixed(2)} km`
                          : hostel.distance || "N/A"}
                      </span>
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
                      {hostel.amenities.slice(0, 4).map((amenity, i) => (
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
                        href={`/hostels/${hostel._id}`}
                        className="bg-[var(--button-bg)] text-[var(--button-text)] px-4 py-2 rounded hover:bg-[var(--button-bg-hover)] transition-colors text-sm font-medium"
                        onClick={() => handleViewDetails(hostel)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}