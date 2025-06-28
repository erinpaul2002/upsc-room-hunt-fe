"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { getCardWidth, getVisibleCards } from "../data/institutions";
import useStore from "../store/store";

export default function InstitutionCarousel() {
    // All hooks at the top, unconditionally
    const institutions = useStore((state) => state.institutions);
    const CARD_GAP = 16;
    const [cardWidth, setCardWidth] = useState(300);
    const [visibleCards, setVisibleCards] = useState(1);
    const [mounted, setMounted] = useState(false);
    const [autoScrolling, setAutoScrolling] = useState(true);
    const [isHovering, setIsHovering] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
        setMounted(true);
        const handleResize = () => {
            setCardWidth(getCardWidth());
            setVisibleCards(getVisibleCards());
        };
        handleResize(); // set initial
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Calculate animation values
        const singleSetWidth = institutions.length * (cardWidth + CARD_GAP);
        const animationDuration = institutions.length * 5; // 5 seconds per card

        const startScroll = async () => {
            if (autoScrolling && !isHovering) {
                // Continuous smooth scrolling animation
                await controls.start({
                    x: -singleSetWidth, // Move one complete set
                    transition: {
                        duration: animationDuration,
                        ease: "linear",
                        repeat: 0,
                    },
                });

                // When we reach the end of the first set, quickly reset to start for infinite effect
                await controls.set({ x: 0 });
                startScroll(); // Restart the animation
            }
        };

        startScroll();

        return () => {
            controls.stop();
        };
    }, [
        mounted,
        autoScrolling,
        isHovering,
        cardWidth,
        CARD_GAP,
        institutions.length,
        controls,
    ]);

    // Conditional rendering AFTER all hooks
    if (mounted && institutions.length === 0) {
        return (
            <section className="py-12">
                <div className="text-center text-red-500">Error: No institutions found.</div>
            </section>
        );
    }

    if (!institutions.length) {
        return (
            <section className="py-12">
                <div className="text-center">No institutions found.</div>
            </section>
        );
    }

    // Create duplicated items for continuous scrolling
    const extendedInstitutions = [
        ...institutions,
        ...institutions,
        ...institutions,
    ];

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Popular Institutes
                    </h2>
                </div>
            </div>

            {/* Full width carousel container */}
            <div
                className="relative overflow-hidden w-full"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Left fade effect - theme-aware */}
                <div
                    className="pointer-events-none absolute left-0 top-0 h-full z-10 bg-gradient-to-r from-[var(--background)] to-transparent"
                    style={{ width: "15%" }}
                />
                {/* Right fade effect - theme-aware */}
                <div
                    className="pointer-events-none absolute right-0 top-0 h-full z-10 bg-gradient-to-l from-[var(--background)] to-transparent"
                    style={{ width: "15%" }}
                />

                {/* Center the carousel within the full width container */}
                <div className="container mx-auto px-4">
                    <motion.div
                        className="flex"
                        style={{ gap: CARD_GAP }}
                        animate={controls}
                    >
                        {extendedInstitutions.map((institute, index) => (
                            <motion.div
                                key={index + "-" + (institute._id || index)}
                                className="bg-[var(--carousel-card-bg)] rounded-lg shadow-md overflow-hidden flex-shrink-0"
                                style={{
                                    minWidth: cardWidth,
                                    maxWidth: cardWidth,
                                    width: cardWidth,
                                    boxShadow: "0 4px 6px var(--carousel-card-shadow)",
                                }}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
                                    transition: { duration: 0.2 },
                                }}
                            >
                                <div className="relative h-[150px]">
                                    <img
                                        src={institute.image && institute.image.trim() !== '' ? institute.image : "/placeholder-image.png"}
                                        alt={institute.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-1">
                                        {institute.name}
                                    </h3>
                                    <p className="text-[var(--carousel-card-location)] text-sm mb-2">
                                        {institute.location?.address || "No address available"}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}