// utils/searchHostels.js
import axiosClient from "./axiosClient";

/**
 * Search for hostels based on institute and filter.
 * @param {Object[]} institutions - List of institutions.
 * @param {string} searchQuery - The search query string.
 * @param {string} activeFilter - The active gender filter ("All", "Male", "Female").
 * @param {number|string} distance - Distance in meters (default 1000).
 * @returns {Promise<{results: Object[], matchedInstitute: Object|null}>}
 */
export async function searchHostels({ institutions, searchQuery, activeFilter, distance = 1000 }) {
  let matchedInstitute = institutions.find(
    (inst) => inst.name.toLowerCase() === searchQuery.toLowerCase()
  );
  let results = [];
  if (matchedInstitute && matchedInstitute._id) {
    try {
      const res = await axiosClient.get(`/hostels/nearby/${matchedInstitute._id}`, {
        params: { distance: Number(distance) },
      });
      results = res.data;
      if (activeFilter !== "All") {
        results = results.filter((hostel) => hostel.gender === activeFilter);
      }
    } catch (err) {
      results = [];
    }
  }
  return { results, matchedInstitute };
}
