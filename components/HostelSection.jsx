"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import Link from "next/link";
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
        <section className="py-12">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold">
                    Featured Hostels & PGs
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostels.map((hostel, index) => (
                    <motion.div
                        key={hostel._id}
                        className="bg-[var(--hostel-card-bg)] rounded-lg shadow-md overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <div className="relative h-[200px]">
                            <img
                                src={hostel.images && hostel.images[0] && hostel.images[0].trim() !== '' ? hostel.images[0] : "/placeholder-image.png"}
                                alt={hostel.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-[var(--hostel-gender-badge-bg)] text-[var(--hostel-gender-badge-text)] px-2 py-1 rounded text-sm font-medium">
                                {hostel.gender}
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">{hostel.name}</h3>
                                <span className="text-[var(--primary)] font-bold">
                                    {/* Show price range if multiple room types exist */}
                                    {hostel.rooms && hostel.rooms.length > 0
                                        ? (() => {
                                            const prices = hostel.rooms.map(r => r.price).sort((a, b) => a - b);
                                            if (prices.length === 1) {
                                                return `₹${prices[0]}`;
                                            } else {
                                                return `₹${prices[0]} - ₹${prices[prices.length - 1]}`;
                                            }
                                        })()
                                        : "N/A"}
                                </span>
                            </div>
                            <div className="flex items-center text-[var(--hostel-location-text)] mb-3 text-sm">
                                <MapPin size={16} className="mr-1" />
                                <span>{hostel.location?.address || "No address"}</span>
                            </div>
                            <div className="flex items-center mb-4">
                                {hostel.rooms && hostel.rooms.length > 0
                                    ? Array.from(new Set(hostel.rooms.map(r => r.type))).map((type) => (
                                        <span
                                            key={type}
                                            className="bg-[var(--hostel-room-badge-bg)] text-[var(--hostel-room-badge-text)] text-xs px-2 py-1 rounded-full mr-2 last:mr-0"
                                        >
                                            {type}
                                        </span>
                                    ))
                                    : (
                                        <span className="bg-[var(--hostel-room-badge-bg)] text-[var(--hostel-room-badge-text)] text-xs px-2 py-1 rounded-full">
                                            Room
                                        </span>
                                    )}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {hostel.amenities?.slice(0, 4).map((amenity) => (
                                    <div
                                        key={amenity}
                                        className="flex items-center bg-[var(--hostel-amenity-bg)] text-[var(--hostel-amenity-text)] px-2 py-1 rounded-full text-xs"
                                    >
                                        <span className="mr-1">{amenityIcons[amenity]}</span>
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                            <Link
                                href={`/details/${hostel._id}`}
                                className="block w-full bg-[var(--primary)] text-[var(--primary-foreground)] text-center py-2 rounded-md hover:bg-[var(--primary)]/90 transition-colors mt-2 font-semibold"
                                onClick={() => setSelectedHostel(hostel)}
                            >
                                View Details
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <Link
                    href="/search"
                    className="inline-block bg-[var(--hostel-explore-button-bg)] text-white font-medium px-6 py-3 rounded-md hover:bg-[var(--hostel-explore-button-hover)] transition-colors"
                >
                    Explore All Hostels
                </Link>
            </div>
        </section>
    );
}