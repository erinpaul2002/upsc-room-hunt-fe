import React from "react"; // Add this import if not already present
import { Wifi, Coffee, ShowerHead, Snowflake, BookOpen, Shield, Plug, BedDouble, Tv, ParkingCircle, Droplets, Fan, Utensils, Dumbbell, Users, Leaf, Sun, MapPin } from "lucide-react";



export const amenityIcons = {
    "Wi-fi": <Wifi size={16} />,           // For "WiFi"
    Electricity: <Plug size={16} />,    // For "Electricity" (using Plug icon)
    Food: <Coffee size={16} />,
    Laundry: <ShowerHead size={16} />,
    AC: <Snowflake size={16} />,
    "Study Table": <BookOpen size={16} />,
    "Study Hall": <BookOpen size={16} />,
    Library: <BookOpen size={16} />,
    "Power Backup": <Plug size={16} />,
    Security: <Shield size={16} />,
    "Study Room": <BookOpen size={16} />,
    Bed: <BedDouble size={16} />,
    TV: <Tv size={16} />,
    Parking: <ParkingCircle size={16} />,
    Water: <Droplets size={16} />,
    Fan: <Fan size={16} />,
    Mess: <Utensils size={16} />,
    Gym: <Dumbbell size={16} />,
    Roommates: <Users size={16} />,
    Garden: <Leaf size={16} />,
    Sunlight: <Sun size={16} />,
    Location: <MapPin size={16} />,
};