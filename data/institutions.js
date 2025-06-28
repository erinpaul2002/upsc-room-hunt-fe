// Responsive card width
export const getCardWidth = () => {
    if (typeof window === "undefined") return 300;
    if (window.innerWidth >= 1024) return 320; // desktop
    if (window.innerWidth >= 640) return 280; // tablet
    return 240; // mobile
};

// Responsive visible card count
export const getVisibleCards = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
};