"use client";

import { useParams, useRouter } from "next/navigation";
import { amenityIcons } from "@/data/hostels";
import { ArrowLeft, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axiosClient from "@/utils/axiosClient";
import useStore from "@/store/store";


// Section: Page Header
function HostelDetailHeader({ onBack }) {
  return (
    <div className="flex items-center justify-between mb-8 gap-4">
      <button
        className="flex items-center text-[var(--primary)] hover:underline font-semibold text-lg gap-2"
        onClick={onBack}
      >
        <ArrowLeft size={22} className="mr-2" />
        Back
      </button>
      <Link
        href="/search"
        className="bg-[var(--hostel-explore-button-bg)] text-white px-7 py-2.5 rounded-lg hover:bg-[var(--hostel-explore-button-hover)] transition-colors font-semibold shadow-md border border-[var(--border)]"
      >
        Explore More Hostels
      </Link>
    </div>
  );
}

// Section: Hostel Card
function HostelCard({ hostel, images, gender, address, roomTypes, distance, mapsLink, contact }) {
  // Distance display removed for details page

  let priceDisplay = "-";
  if (roomTypes.length === 1) {
    priceDisplay = roomTypes[0].price;
  } else if (roomTypes.length > 1) {
    const prices = roomTypes.map(r => r.price).filter(p => typeof p === 'number' || !isNaN(Number(p))).map(Number);
    if (prices.length > 0) {
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      priceDisplay = min === max ? `${min}` : `${min} - ${max}`;
    }
  }

  return (
    <div className="bg-[var(--hostel-card-bg)] rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-[var(--border)] transition-transform hover:scale-[1.01]">
      {/* Image Section */}
      <div className="relative w-full md:w-1/3 h-60 md:h-auto min-h-[240px]">
        <Image
          src={images[0] && images[0].trim() !== '' ? images[0] : "/placeholder-image.png"}
          alt={hostel.name}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
          priority
        />
        <span className="absolute top-4 right-4 bg-[var(--hostel-gender-badge-bg)] text-[var(--hostel-gender-badge-text)] px-4 py-1 rounded-full text-base font-semibold shadow-lg border border-[var(--border)]">
          {gender}
        </span>
      </div>
      {/* Details Section */}
      <div className="flex-1 p-6 md:p-8 flex flex-col gap-4 justify-between">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-[var(--primary)]">{hostel.name}</h1>
          <span className="text-2xl font-bold text-[var(--primary)]">
            {priceDisplay} <span className="text-base text-[var(--muted-foreground)]">/month</span>
          </span>
        </div>
        {/* Distance removed for details page */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 bg-[var(--secondary)] rounded-lg p-4 shadow border border-[var(--border)]">
          <div className="flex-1 flex items-center text-[var(--hostel-location-text)] gap-2">
            <MapPin size={18} className="mr-1" />
            <span className="text-base font-medium truncate">{address}</span>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            {typeof mapsLink === "string" && mapsLink.trim().length > 0 ? (
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-semibold shadow hover:bg-[var(--primary)]/90 transition-colors w-fit"
                title="Directions"
              >
                {/* Alternate icon: MapPin from lucide-react, matching the rest of the UI */}
                <MapPin size={18} className="mr-1" />
                Directions
              </a>
            ) : null}
            <span className="font-semibold">Phone: <span className="font-normal">{contact}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoomTypesSection({ roomTypes }) {
  return (
    <div className="mt-12 bg-[var(--secondary)] rounded-xl p-8 shadow-lg border border-[var(--border)]">
      <h2 className="text-2xl font-bold mb-6 tracking-tight">Room Types & Pricing</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-base">
          <thead>
            <tr className="text-left border-b border-[var(--border)]">
              <th className="py-3 pr-6 font-semibold">Type</th>
              <th className="py-3 pr-6 font-semibold">Vacancy</th>
              <th className="py-3 pr-6 font-semibold">Rent (₹/month)</th>
              <th className="py-3 pr-6 font-semibold">Security Deposit</th>
              <th className="py-3 pr-6 font-semibold">Available</th>
            </tr>
          </thead>
          <tbody>
            {roomTypes.map((room, idx) => (
              <tr key={idx} className="border-b border-dashed border-[var(--border)] last:border-none hover:bg-[var(--hostel-card-bg)]/60 transition-colors">
                <td className="py-3 pr-6">{room.type}</td>
                <td className="py-3 pr-6">{room.vacancy}</td>
                <td className="py-3 pr-6">{room.price}</td>
                <td className="py-3 pr-6">{room.securityDeposit}</td>
                <td className="py-3 pr-6">{room.available ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FacilitiesSection({ facilities, amenityIcons }) {
  return (
    <div className="mt-12 bg-[var(--secondary)] rounded-xl p-8 shadow-lg border border-[var(--border)]">
      <h2 className="text-2xl font-bold mb-4 tracking-tight">Facilities</h2>
      <div className="flex flex-wrap gap-3">
        {facilities.map((amenity) => (
          <span
            key={amenity}
            className="flex items-center bg-[var(--hostel-amenity-bg)] text-[var(--hostel-amenity-text)] px-4 py-1.5 rounded-full text-sm font-medium shadow border border-[var(--border)] gap-2"
          >
            <span className="mr-1 text-lg">{amenityIcons[amenity] || ""}</span>
            {amenity}
          </span>
        ))}
      </div>
    </div>
  );
}

function GallerySection({ images }) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 tracking-tight">Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {images.map((img, idx) => (
          <div key={idx} className="relative h-36 rounded-xl overflow-hidden shadow-lg border border-[var(--border)] hover:scale-[1.03] transition-transform">
            <Image src={img} alt={`Hostel Image ${idx + 1}`} fill style={{ objectFit: "cover" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HostelDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const instituteLocation = useStore((state) => state.instituteLocation);

  useEffect(() => {
    async function fetchHostel() {
      try {
        const res = await axiosClient.get(`/hostels/${id}`);
        setHostel(res.data);
      } catch (err) {
        setHostel(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchHostel();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Hostel Not Found</h2>
          <p className="text-[var(--muted-foreground)] mb-4">
            The requested hostel does not exist.
          </p>
          <button
            className="inline-flex items-center px-4 py-2 bg-[var(--primary)] text-white rounded hover:bg-[var(--primary)]/90"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const roomTypes = hostel.rooms || [];
  const facilities = hostel.amenities || [];
  const images = hostel.images || [];
  const address = hostel.location?.address || "N/A";
  const mapsLink = hostel.location?.link || "";
  const contact = hostel.contact || "N/A";
  const gender = hostel.gender || "N/A";

  // Distance calculation removed for details page
  // const hostelLat = hostel.location?.latitude;
  // const hostelLng = hostel.location?.longitude;
  // const instLat = instituteLocation?.latitude;
  // const instLng = instituteLocation?.longitude;
  // const distance = calculateDistance(instLat, instLng, hostelLat, hostelLng);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <HostelDetailHeader onBack={() => router.back()} />
        <HostelCard hostel={hostel} images={images} gender={gender} address={address} roomTypes={roomTypes} mapsLink={mapsLink} contact={contact} />
        <GallerySection images={images} />
        <RoomTypesSection roomTypes={roomTypes} />
        <FacilitiesSection facilities={facilities} amenityIcons={amenityIcons} />
      </div>
    </div>
  );
}
