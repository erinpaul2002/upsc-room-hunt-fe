"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { useRouter } from "next/navigation";
import { amenityIcons } from "../data/hostels";
import useStore from "../store/store"; // adjust path if needed

export default function HostelSection() {
    const hostels = useStore((state) => state.hostels);
    const setSelectedHostel = useStore((state) => state.setSelectedHostel);
    const router = useRouter();

    if (!hostels.length) {
        return (
            <section className="py-12">
                <div className="text-center">No hostels found.</div>
            </section>
        );
    }

    return (
        <section
            className="py-12 relative overflow-hidden"
            style={{
                background:
                    "linear-gradient(90deg, var(--hero-gradient-from), var(--hero-gradient-to))",
                minHeight: "60vh",
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
                        <linearGradient id="hostelBlob1" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#a5b4fc" />
                            <stop offset="100%" stopColor="#fca5a5" />
                        </linearGradient>
                    </defs>
                    <path
                        fill="url(#hostelBlob1)"
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
                        <linearGradient id="hostelBlob2" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#fcd34d" />
                            <stop offset="100%" stopColor="#6ee7b7" />
                        </linearGradient>
                    </defs>
                    <path
                        fill="url(#hostelBlob2)"
                        d="M37.6,-60.7C48.7,-54.2,57.6,-44.2,62.6,-32.7C67.6,-21.2,68.7,-8.1,67.2,5.7C65.7,19.5,61.7,34,52.1,44.2C42.5,54.4,27.3,60.3,12.1,62.7C-3.1,65.1,-18.3,64,-31.1,57.2C-43.9,50.4,-54.3,37.9,-60.1,23.7C-65.9,9.5,-67.1,-6.4,-62.2,-20.6C-57.3,-34.8,-46.3,-47.3,-33.2,-54.1C-20.1,-60.9,-10,-62,1.2,-63.5C12.4,-65,24.8,-66.7,37.6,-60.7Z"
                        transform="translate(100 100)"
                    />
                </svg>
            </motion.div>
            {/* Overlay for depth */}
            <div
                className="absolute inset-0"
                style={{ background: "var(--hero-overlay)", zIndex: 1 }}
            ></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Featured Hostels & PGs
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hostels.map((hostel, index) => (
                        <motion.div
                            key={hostel._id}
                            className="bg-[var(--card-bg)] rounded-lg shadow-md overflow-hidden transition-all duration-200 group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{
                                scale: 1.04,
                                y: -6,
                                rotate: -2,
                                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            // Faster, snappier animation
                            transition={{

                                stiffness: 350, // was 500
                                damping: 22,    // was 18
                                duration: 0.008, // add this for snappier hover
                            }}
                        >
                            <div className="relative h-[200px]">
                                <img
                                    src={
                                        hostel.images &&
                                        hostel.images[0] &&
                                        hostel.images[0].trim() !== ""
                                            ? hostel.images[0]
                                            : "/placeholder-image.png"
                                    }
                                    alt={hostel.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-[var(--gender-badge-bg)] text-[var(--gender-badge-text)] px-2 py-1 rounded text-sm font-medium">
                                    {hostel.gender}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-[var(--card-text)] font-bold text-lg transition-colors duration-200">
                                        {hostel.name}
                                    </h3>
                                    <span className="text-[var(--price-text)] font-bold transition-colors duration-200">
                                        {/* Show price range if multiple room types exist */}
                                        {hostel.rooms && hostel.rooms.length > 0
                                            ? (() => {
                                                const prices = hostel.rooms
                                                    .map((r) => r.price)
                                                    .sort((a, b) => a - b);
                                                if (prices.length === 1) {
                                                    return `₹${prices[0]}`;
                                                } else {
                                                    return `₹${prices[0]} - ₹${
                                                        prices[prices.length - 1]
                                                    }`;
                                                }
                                            })()
                                            : "N/A"}
                                    </span>
                                </div>
                                <div className="flex items-center text-[var(--card-sub-text)] mb-3 text-sm transition-colors duration-200">
                                    <MapPin size={16} className="mr-1" />
                                    <span>
                                        {hostel.location?.address || "No address"}
                                    </span>
                                </div>
                                <div className="flex items-center mb-4">
                                    {hostel.rooms && hostel.rooms.length > 0
                                        ? Array.from(
                                            new Set(hostel.rooms.map((r) => r.type))
                                        ).map((type) => (
                                            <span
                                                key={type}
                                                className="bg-[var(--room-badge-bg)] text-[var(--room-badge-text)] text-xs px-2 py-1 rounded-full mr-2 last:mr-0 transition-colors duration-200"
                                            >
                                                {type}
                                            </span>
                                        ))
                                        : (
                                            <span className="bg-[var(--room-badge-bg)] text-[var(--room-badge-text)] text-xs px-2 py-1 rounded-full transition-colors duration-200">
                                                Room
                                            </span>
                                        )}
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {hostel.amenities
                                        ?.slice(0, 4)
                                        .map((amenity) => (
                                            <div
                                                key={amenity}
                                                className="flex items-center bg-[var(--amenity-bg)] text-[var(--amenity-text)] px-2 py-1 rounded-full text-xs transition-colors duration-200"
                                            >
                                                <span className="mr-1">
                                                    {amenityIcons[amenity]}
                                                </span>
                                                {amenity}
                                            </div>
                                        ))}
                                </div>
                                <button
                                    onClick={() => {
                                        router.push(`/details/${hostel._id}`);
                                        setSelectedHostel(hostel);
                                    }}
                                    className="block w-full bg-[var(--button-bg)] text-[var(--button-text)] text-center py-2 rounded-md hover:bg-[var(--button-bg-hover)] transition-colors mt-2 font-semibold"
                                >
                                    View Details
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push("/explore")}
                        className="inline-block bg-[var(--button-bg)] text-[var(--button-text)] font-medium px-6 py-3 rounded-md hover:bg-[var(--button-bg-hover)] transition-colors"
                    >
                        Explore All Hostels
                    </button>
                </div>
            </div>
        </section>
    );
}