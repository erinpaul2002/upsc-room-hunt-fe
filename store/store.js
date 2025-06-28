import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      hostels: [],
      institutions: [],
      selectedInstitute: null,
      selectedHostel: null,
      instituteLocation: { latitude: null, longitude: null, link: "" },
      hostelLocation: { latitude: null, longitude: null, link: "" },
      nearbyHostels: [],
      setHostels: (hostels) => set({ hostels }),
      setInstitutions: (institutions) => set({ institutions }),
      setSelectedInstitute: (selectedInstitute, instituteLocation) =>
        set({ selectedInstitute, instituteLocation }),
      setSelectedHostel: (selectedHostel, hostelLocation) =>
        set({ selectedHostel, hostelLocation }),
      setNearbyHostels: (nearbyHostels) => set({ nearbyHostels }),
    }),
    {
      name: "roomhunt-storage",
    }
  )
);

export default useStore;