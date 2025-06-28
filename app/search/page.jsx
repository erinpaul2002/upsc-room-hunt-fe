"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import axiosClient from "@/utils/axiosClient";

import { searchHostels } from "@/utils/searchHostels";
import useStore from "@/store/store"; // Adjust the import path if needed
import { calculateDistance } from "@/utils/distance";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const filter = searchParams.get("filter") || "All";
  const instituteId = searchParams.get("instituteId") || null;
  const distance = searchParams.get("distance") || 1000;
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [activeFilter, setActiveFilter] = useState(filter);
  const [filteredHostels, setFilteredHostels] = useState([]);
  const [matchedInstitute, setMatchedInstitute] = useState(null);
  const institutions = useStore((state) => state.institutions);
  const inputRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const filters = ["All", "Male", "Female"];

  // This useEffect will run when the component mounts or when query/filter changes
  useEffect(() => {
    console.log("Search query:", query);
    console.log("Filter:", filter);
    
    let institute = null;
    if (instituteId) {
      institute = institutions.find((inst) => inst._id === instituteId);
    } else {
      institute = institutions.find(
        (inst) => inst.name.toLowerCase() === query.toLowerCase()
      );
    }
    setMatchedInstitute(institute);
    console.log("Matched institute:", institute);

    async function fetchHostels() {
      if (institute && institute._id) {
        try {
          const res = await axiosClient.get(`/hostels/nearby/${institute._id}`, {
            params: { distance: Number(distance) },
          });
          let results = res.data;
          if (filter !== "All") {
            results = results.filter((hostel) => hostel.gender === filter);
          }
          setFilteredHostels(results);
          setNearbyHostels(results); // <-- Add to store
        } catch (err) {
          setFilteredHostels([]);
          setNearbyHostels([]); // <-- Clear in store on error
        }
      } else {
        setFilteredHostels([]);
        setNearbyHostels([]); // <-- Clear in store if no institute
      }
    }
    if (institutions.length > 0) {
      fetchHostels();
    }
  }, [query, filter, institutions, instituteId, distance]);

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

    // Use the modularized util
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

  // Filter institutions based on search query
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
  };



  const selectedInstitute = useStore((state) => state.selectedInstitute);

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="min-h-screen bg-[var(--background)]">
      {/* Search Header */}
      <div className="bg-[var(--hero-gradient-from)] text-[var(--hero-text)] py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-4">
            <Link href="/" className="mr-4 hover:opacity-80 transition-opacity">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl md:text-2xl font-semibold">Search Results</h1>
          </div>
          
          {/* Search Input */}
          <div className="bg-[var(--hero-input-bg)] rounded-lg shadow-lg mb-4 flex relative">
            <div className="flex-1 flex items-center relative">
              <div className="pl-4 pr-2 py-3 text-[var(--hero-input-placeholder)]">
                <Search size={20} />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for institutes (e.g., Vision IAS, Shankar IAS)"
                className="flex-1 py-3 px-2 text-[var(--hero-input-text)] outline-none"
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
                  className="absolute left-0 right-0 top-full bg-white z-[9999] border border-[var(--border)] rounded shadow-lg max-h-60 overflow-y-auto"
                  style={{ minWidth: "100%" }}
                >
                  {filteredInstitutions.slice(0, 5).map((inst, idx) => (
                    <button
                      key={inst._id}
                      id={`dropdown-item-${idx}`}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
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
              className="px-6 py-3 bg-[var(--hero-button-bg)] text-[var(--hero-text)] font-semibold hover:bg-[var(--hero-button-hover)]"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          
          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filterOption) => (
              <button
                key={filterOption}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filterOption
                    ? "bg-[var(--hero-filter-active-bg)] text-[var(--hero-filter-active-text)]"
                    : "bg-[var(--hero-filter-inactive-bg)] text-[var(--hero-text)] hover:bg-[var(--hero-filter-inactive-hover)]"
                }`}
                onClick={() => {
                  setActiveFilter(filterOption);
                  setTimeout(() => {
                    handleSearch();
                  }, 100);
                }}
              >
                {filterOption}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Matched Institute Info */}
        {matchedInstitute && (
          <div className="mb-8 p-4 bg-[var(--carousel-card-bg)] rounded-lg shadow-md">
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
                <h2 className="text-2xl font-bold mb-2">{matchedInstitute.name}</h2>
                <p className="text-[var(--carousel-card-location)] mb-2">
                  <MapPin size={16} className="inline-block mr-1" />
                  {matchedInstitute.location?.address || ""}
                </p>
                <p className="text-[var(--foreground)]">
                  {filteredHostels.length} accommodations found near {matchedInstitute.name}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Search Results Count */}
        <h2 className="text-xl font-bold mb-4">
          {filteredHostels.length} {filteredHostels.length === 1 ? 'Result' : 'Results'} Found
        </h2>
        
        {filteredHostels.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--muted-foreground)] text-lg">No hostels found matching your search criteria.</p>
            <p className="text-[var(--muted-foreground)]">Try adjusting your search or filters.</p>
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
                  className="bg-[var(--hostel-card-bg)] rounded-lg shadow-md overflow-hidden"
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
                    <div className="absolute top-3 right-3 bg-[var(--hostel-gender-badge-bg)] text-[var(--hostel-gender-badge-text)] px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      {hostel.gender}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-1">{hostel.name}</h3>
                    <p className="text-[var(--hostel-location-text)] text-sm mb-2 flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {typeof hostel.location === "object"
                        ? hostel.location?.address || ""
                        : hostel.location || ""}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[var(--hostel-distance-badge-bg)] text-[var(--hostel-distance-badge-text)] px-2 py-1 rounded text-xs font-medium">
                        {distanceKm !== null
                          ? distanceKm < 1
                            ? `${(distanceKm * 1000).toFixed(0)} m`
                            : `${distanceKm.toFixed(2)} km`
                          : hostel.distance || "N/A"}
                      </span>
                      <span className="bg-[var(--hostel-room-badge-bg)] text-[var(--hostel-room-badge-text)] px-2 py-1 rounded text-xs font-medium">
                        {hostel.roomType}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {hostel.amenities.slice(0, 4).map((amenity, i) => (
                        <span key={amenity + i} className="bg-[var(--hostel-amenity-bg)] text-[var(--hostel-amenity-text)] px-2 py-1 rounded-full text-xs flex items-center">
                          {amenity}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">{hostel.price}/mo</span>
                      <Link
                        href={`/hostels/${hostel._id}`}
                        className="bg-[var(--hostel-explore-button-bg)] text-white px-4 py-2 rounded hover:bg-[var(--hostel-explore-button-hover)] transition-colors text-sm font-medium"
                        onClick={() => handleViewDetails(hostel)}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </Suspense>
  );
}