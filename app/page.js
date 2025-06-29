"use client";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import InstitutionCarousel from "../components/InstitutionCarousel";
import HostelSection from "../components/HostelSection";
import Footer from "../components/Footer";
import axiosClient from "../utils/axiosClient";
import useStore from "../store/store"; // Adjust the import path as needed
import { useEffect, useState } from "react";


export default function Home() {
  // Fetch data on the server
  const { institutions, hostels, setHostels, setInstitutions } = useStore.getState();
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [institutionsResponse, hostelsResponse] = await Promise.all([
          axiosClient.get("/institutions/all"),
          axiosClient.get("/hostels/all"),
        ]);
        setInstitutions(institutionsResponse.data);
        setHostels(hostelsResponse.data);
        setIsFetched(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [setInstitutions, setHostels]);

  if (!isFetched) {
    return null; // Or a loading spinner if you prefer
  }

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <InstitutionCarousel />
        <div className="mt-8">
          <HostelSection />
        </div>
      </div>
      <Footer />
    </main>
  );
}
