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
        <section
            className="py-12 relative overflow-hidden"
            style={{
                background: "linear-gradient(90deg, var(--hero-gradient-from), var(--hero-gradient-to))",
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
                        <linearGradient id="carouselBlob1" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#a5b4fc" />
                            <stop offset="100%" stopColor="#fca5a5" />
                        </linearGradient>
                    </defs>
                    <path
                        fill="url(#carouselBlob1)"
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
                        <linearGradient id="carouselBlob2" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#fcd34d" />
                            <stop offset="100%" stopColor="#6ee7b7" />
                        </linearGradient>
                    </defs>
                    <path
                        fill="url(#carouselBlob2)"
                        d="M37.6,-60.7C48.7,-54.2,57.6,-44.2,62.6,-32.7C67.6,-21.2,68.7,-8.1,67.2,5.7C65.7,19.5,61.7,34,52.1,44.2C42.5,54.4,27.3,60.3,12.1,62.7C-3.1,65.1,-18.3,64,-31.1,57.2C-43.9,50.4,-54.3,37.9,-60.1,23.7C-65.9,9.5,-67.1,-6.4,-62.2,-20.6C-57.3,-34.8,-46.3,-47.3,-33.2,-54.1C-20.1,-60.9,-10,-62,1.2,-63.5C12.4,-65,24.8,-66.7,37.6,-60.7Z"
                        transform="translate(100 100)"
                    />
                </svg>
            </motion.div>
            {/* Overlay for depth */}
            <div className="absolute inset-0" style={{ background: "var(--hero-overlay)", zIndex: 1 }}></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Popular Institutes
                    </h2>
                </div>
            </div>

            {/* Full width carousel container */}
            <div
                className="relative overflow-hidden w-full z-10"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                style={{
                    WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
                    maskImage:
                        "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
                }}
            >
                {/* Center the carousel within the full width container */}
                <div className="container mx-auto px-4 py-8"> {/* Added py-8 for vertical space */}
                    <motion.div
                        className="flex"
                        style={{ gap: CARD_GAP }}
                        animate={controls}
                    >
                        {extendedInstitutions.map((institute, index) => (
                            <motion.div
                                key={index + "-" + (institute._id || index)}
                                className="bg-[var(--institute-card-bg)] rounded-lg shadow-md overflow-hidden flex-shrink-0 transition-all duration-200 group"
                                style={{
                                    minWidth: cardWidth,
                                    maxWidth: cardWidth,
                                    width: cardWidth,
                                    boxShadow: "0 4px 6px var(--institute-card-shadow)",
                                }}
                                whileHover={{
                                    scale: 1.08,
                                    rotate: 4, // Just a single tilt
                                    zIndex: 20,
                                    boxShadow: "0 16px 32px var(--institute-card-shadow)",
                                    transition: { duration: 0.04, stiffness: 300 },
                                }}
                            >
                                <motion.div
                                    className="relative h-[150px]"
                                    whileHover={{
                                        scale: 1.05,
                                        rotate: -4, // Opposite tilt for image
                                        transition: { duration: 0.04, stiffness: 200 },
                                    }}
                                >
                                    <img
                                        src={institute.image && institute.image.trim() !== '' ? institute.image : "/placeholder-image.png"}
                                        alt={institute.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Shine effect */}
                                    <motion.div
                                        className="absolute inset-0 pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        whileHover={{
                                            opacity: 1,
                                            background: "linear-gradient(120deg, transparent 60%, rgba(255,255,255,0.3) 80%, transparent 100%)",
                                        }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    />
                                </motion.div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-1 text-[var(--institute-card-text)] transition-colors duration-200">
                                        {institute.name}
                                    </h3>
                                    <p className="text-[var(--institute-card-location)] text-sm mb-2 transition-colors duration-200">
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