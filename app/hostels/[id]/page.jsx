"use client";

import { useParams, useRouter } from "next/navigation";
import { amenityIcons } from "@/data/hostels";
import { ArrowLeft, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axiosClient from "@/utils/axiosClient";
import useStore from "@/store/store";
import { calculateDistance } from "@/utils/distance";
import { motion } from "framer-motion";

// Section: Page Header
function HostelDetailHeader({ onBack }) {
  return (
    <div className="flex items-center justify-between mb-8 gap-4">
      <button
        className="flex items-center text-[var(--button-bg)] hover:underline font-semibold text-lg gap-2"
        onClick={onBack}
      >
        <ArrowLeft size={22} className="mr-2" />
        Back
      </button>
      <Link
        href="/search"
        className="bg-[var(--button-bg)] text-[var(--button-text)] px-7 py-2.5 rounded-lg hover:bg-[var(--button-bg-hover)] transition-colors font-semibold shadow-md border border-[var(--border)]"
      >
        Explore More Hostels
      </Link>
    </div>
  );
}

// Section: Hostel Card
function HostelCard({ hostel, images, gender, address, roomTypes, distance, mapsLink, contact }) {
  // Format distance: if < 1km, show in metres, else in km
  let distanceDisplay = "-";
  if (distance !== null && distance !== undefined) {
    if (distance < 1) {
      distanceDisplay = `${Math.round(distance * 1000)} m`;
    } else {
      distanceDisplay = `${distance.toFixed(2)} km`;
    }
  }

  // Price display: if more than one room, show as low-high, else show single price
  let priceDisplay = "-";
  if (roomTypes.length === 1) {
    priceDisplay = `₹${roomTypes[0].price}`;
  } else if (roomTypes.length > 1) {
    const prices = roomTypes.map(r => r.price).filter(p => typeof p === 'number' || !isNaN(Number(p))).map(Number);
    if (prices.length > 0) {
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      priceDisplay = min === max ? `₹${min}` : `₹${min} - ₹${max}`;
    }
  }

  return (
    <div className="bg-[var(--card-bg)] rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-[var(--border)] transition-transform hover:scale-[1.01]">
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
        <span className="absolute top-4 right-4 bg-[var(--gender-badge-bg)] text-[var(--gender-badge-text)] px-4 py-1 rounded-full text-base font-semibold shadow-lg border border-[var(--border)]">
          {gender}
        </span>
      </div>
      {/* Details Section */}
      <div className="flex-1 p-6 md:p-8 flex flex-col gap-4 justify-between">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-[var(--card-text)]">{hostel.name}</h1>
          <span className="text-2xl font-bold text-[var(--price-text)]">
            {priceDisplay} <span className="text-base text-[var(--price-text)]">/month</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="bg-[var(--distance-badge-bg)] text-[var(--distance-badge-text)] px-4 py-1 rounded-full text-xs font-semibold border border-[var(--border)]">
            {distanceDisplay} from institute
          </span>
        </div>
        {/* Location & Contact Section inside Hostel Card */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 bg-[var(--card-bg)] rounded-lg p-4 shadow border border-[var(--border)]">
          <div className="flex-1 flex items-center text-[var(--card-location-text)] gap-2">
            <MapPin size={18} className="mr-1" />
            <span className="text-base font-medium truncate">{address}</span>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            {typeof mapsLink === "string" && mapsLink.trim().length > 0 ? (
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--button-bg)] text-[var(--button-text)] rounded-lg font-semibold shadow hover:bg-[var(--button-bg-hover)] transition-colors w-fit"
                title="Directions"
              >
                <MapPin size={18} className="mr-1" />
                Directions
              </a>
            ) : null}
            <span className="font-semibold text-[var(--card-sub-text)]">Phone: <span className="font-normal">{contact}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Section: Room Types & Pricing
function RoomTypesSection({ roomTypes }) {
  return (
    <div className="mt-12 bg-[var(--card-bg)] rounded-xl p-8 shadow-lg border border-[var(--border)]">
      <h2 className="text-2xl font-bold mb-6 tracking-tight text-[var(--card-text)]">Room Types & Pricing</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-base">
          <thead>
            <tr className="text-[var(--card-sub-text)] text-left border-b border-[var(--border)]">
              <th className="py-3 pr-6 font-semibold">Type</th>
              <th className="py-3 pr-6 font-semibold">Vacancy</th>
              <th className="py-3 pr-6 font-semibold">Rent (₹/month)</th>
              <th className="py-3 pr-6 font-semibold">Security Deposit</th>
              <th className="py-3 pr-6 font-semibold">Available</th>
            </tr>
          </thead>
          <tbody>
            {roomTypes.map((room, idx) => (
              <tr key={idx} className="border-b border-dashed border-[var(--border)] last:border-none hover:bg-[var(--card-bg)]/60 transition-colors">
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

// Section: Facilities
function FacilitiesSection({ facilities, amenityIcons }) {
  return (
    <div className="mt-12 bg-[var(--card-bg)] rounded-xl p-8 shadow-lg border border-[var(--border)]">
      <h2 className="text-2xl font-bold mb-4 tracking-tight text-[var(--card-text)]">Facilities</h2>
      <div className="flex flex-wrap gap-3">
        {facilities.map((amenity) => (
          <span
            key={amenity}
            className="flex items-center bg-[var(--amenity-bg)] text-[var(--amenity-text)] px-4 py-1.5 rounded-full text-sm font-medium shadow border border-[var(--border)] gap-2"
          >
            <span className="mr-1 text-lg">{amenityIcons[amenity] || ""}</span>
            {amenity}
          </span>
        ))}
      </div>
    </div>
  );
}

// Section: Location / Contacts
// function LocationContactsSection({ address, mapsLink, contact }) {
//   return (
//     <div className="mt-12 bg-[var(--secondary)] rounded-xl p-8 shadow-lg border border-[var(--border)]">
//       <h2 className="text-2xl font-bold mb-4 tracking-tight">Location / Contacts</h2>
//       <div className="mb-3">
//         <span className="font-semibold">Address: </span>
//         <span>{address}</span>
//       </div>
//       <div className="flex flex-col md:flex-row md:items-center gap-4">
//         {typeof mapsLink === "string" && mapsLink.trim().length > 0 ? (
//           <a
//             href={mapsLink}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-[var(--primary)] underline font-medium hover:text-[var(--primary)]/80"
//           >
//             Navigate to location
//           </a>
//         ) : null}
//         <span className="font-semibold">Phone: </span>
//         <span>{contact}</span>
//       </div>
//     </div>
//   );
// }


// Section: Gallery
function GallerySection({ images }) {
  // If images is empty, use 10 placeholders
  const displayImages =
    images.length === 0
      ? Array(10).fill("/placeholder-image.png")
      : images;

  const imagesPerPage = 4;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(displayImages.length / imagesPerPage);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  const paginatedImages = displayImages.slice(
    page * imagesPerPage,
    page * imagesPerPage + imagesPerPage
  );

  // Modal navigation
  const handleModalPrev = (e) => {
    e.stopPropagation();
    setModalIndex((idx) => (idx === 0 ? displayImages.length - 1 : idx - 1));
  };
  const handleModalNext = (e) => {
    e.stopPropagation();
    setModalIndex((idx) => (idx === displayImages.length - 1 ? 0 : idx + 1));
  };

  // Close modal on Escape
  useEffect(() => {
    if (!modalOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setModalOpen(false);
      if (e.key === "ArrowLeft") setModalIndex((idx) => (idx === 0 ? displayImages.length - 1 : idx - 1));
      if (e.key === "ArrowRight") setModalIndex((idx) => (idx === displayImages.length - 1 ? 0 : idx + 1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen, displayImages.length]);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 tracking-tight">Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {paginatedImages.map((img, idx) => (
          <div
            key={idx}
            className="relative h-36 rounded-xl overflow-hidden shadow-lg border border-[var(--border)] hover:scale-[1.03] transition-transform cursor-pointer"
            onClick={() => {
              setModalIndex(page * imagesPerPage + idx);
              setModalOpen(true);
            }}
          >
            <Image src={img} alt={`Hostel Image ${page * imagesPerPage + idx + 1}`} fill style={{ objectFit: "cover" }} />
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={handlePrev}
            disabled={page === 0}
            className="px-4 py-2 rounded bg-[var(--button-bg)] text-[var(--button-text)] font-semibold shadow disabled:opacity-50"
          >
            Prev
          </button>
          <span className="font-medium text-[var(--card-text)]">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages - 1}
            className="px-4 py-2 rounded bg-[var(--button-bg)] text-[var(--button-text)] font-semibold shadow disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-2xl font-bold text-gray-700 hover:text-black"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="w-full flex items-center justify-center py-8 px-2">
              <button
                className="text-3xl px-4 py-2 text-gray-700 hover:text-black"
                onClick={handleModalPrev}
                aria-label="Previous"
              >
                &#8592;
              </button>
              <div className="relative w-[320px] h-[320px] md:w-[480px] md:h-[400px] flex items-center justify-center">
                <Image
                  src={displayImages[modalIndex]}
                  alt={`Gallery Image ${modalIndex + 1}`}
                  fill
                  style={{ objectFit: "contain", background: "#f3f4f6" }}
                  className="rounded-lg"
                  priority
                />
              </div>
              <button
                className="text-3xl px-4 py-2 text-gray-700 hover:text-black"
                onClick={handleModalNext}
                aria-label="Next"
              >
                &#8594;
              </button>
            </div>
            <div className="pb-4 text-center text-gray-700 font-medium">
              Image {modalIndex + 1} of {displayImages.length}
            </div>
          </div>
        </div>
      )}
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
          <p className="text-[var(--muted)] mb-4">
            The requested hostel does not exist.
          </p>
          <button
            className="inline-flex items-center px-4 py-2 bg-[var(--primary)] text-[var(--background)] rounded hover:bg-[var(--primary)]/90"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Search
          </button>
        </div>
      </div>
    );
  }


  // Data extraction
  const roomTypes = hostel.rooms || [];
  const facilities = hostel.amenities || [];
  const images = hostel.images || [];
  const address = hostel.location?.address || "N/A";
  const mapsLink = hostel.location?.link || "";
  const contact = hostel.contact || "N/A";
  const gender = hostel.gender || "N/A";

  // Calculate distance using util and store
  const hostelLat = hostel.location?.latitude;
  const hostelLng = hostel.location?.longitude;
  const instLat = instituteLocation?.latitude;
  const instLng = instituteLocation?.longitude;
  const distance = calculateDistance(instLat, instLng, hostelLat, hostelLng);

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col"
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
            <linearGradient id="hostelDetailBlob1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a5b4fc" />
              <stop offset="100%" stopColor="#fca5a5" />
            </linearGradient>
          </defs>
          <path
            fill="url(#hostelDetailBlob1)"
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
            <linearGradient id="hostelDetailBlob2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="100%" stopColor="#6ee7b7" />
            </linearGradient>
          </defs>
          <path
            fill="url(#hostelDetailBlob2)"
            d="M37.6,-60.7C48.7,-54.2,57.6,-44.2,62.6,-32.7C67.6,-21.2,68.7,-8.1,67.2,5.7C65.7,19.5,61.7,34,52.1,44.2C42.5,54.4,27.3,60.3,12.1,62.7C-3.1,65.1,-18.3,64,-31.1,57.2C-43.9,50.4,-54.3,37.9,-60.1,23.7C-65.9,9.5,-67.1,-6.4,-62.2,-20.6C-57.3,-34.8,-46.3,-47.3,-33.2,-54.1C-20.1,-60.9,-10,-62,1.2,-63.5C12.4,-65,24.8,-66.7,37.6,-60.7Z"
            transform="translate(100 100)"
          />
        </svg>
      </motion.div>
      {/* Overlay for depth */}
      <div className="absolute inset-0" style={{ background: "var(--hero-overlay)", zIndex: 1 }}></div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12 flex-1 relative z-10">
        {/* Page Header */}
        <HostelDetailHeader onBack={() => router.back()} />

        {/* Section: Hostel Card */}
        <HostelCard hostel={hostel} images={images} gender={gender} address={address} roomTypes={roomTypes} distance={distance} mapsLink={mapsLink} contact={contact} />

        {/* Section: Gallery */}
        <GallerySection images={images} />

        {/* Section: Room Types & Pricing */}
        <RoomTypesSection roomTypes={roomTypes} />

        {/* Section: Facilities */}
        <FacilitiesSection facilities={facilities} amenityIcons={amenityIcons} />
      </div>
    </div>
  );
}