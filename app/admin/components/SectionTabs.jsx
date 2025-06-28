import React from "react";

export default function SectionTabs({
  activeSection,
  hostelTab,
  setHostelTab,
  editingHostel,
  resetHostelForm,
  instituteTab,
  setInstituteTab,
  editingInstitute,
  resetInstituteForm,
}) {
  return (
    <div className="mb-8 flex gap-2">
      {activeSection === "hostels" ? (
        <>
          <button
            className={`px-5 py-2 rounded-t-lg font-semibold transition-all duration-150 ${hostelTab === "list" ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow" : "bg-white text-blue-900 border-b-2 border-blue-200 hover:bg-blue-50"}`}
            onClick={() => {
              setHostelTab("list");
              resetHostelForm();
            }}
          >
            List
          </button>
          <button
            className={`px-5 py-2 rounded-t-lg font-semibold transition-all duration-150 ${hostelTab === "form" ? "bg-gradient-to-r from-purple-400 to-blue-400 text-white shadow" : "bg-white text-blue-900 border-b-2 border-blue-200 hover:bg-blue-50"}`}
            onClick={() => {
              setHostelTab("form");
              resetHostelForm();
            }}
          >
            {editingHostel ? "Edit" : "Add"} Hostel
          </button>
        </>
      ) : (
        <>
          <button
            className={`px-5 py-2 rounded-t-lg font-semibold transition-all duration-150 ${instituteTab === "list" ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow" : "bg-white text-blue-900 border-b-2 border-blue-200 hover:bg-blue-50"}`}
            onClick={() => {
              setInstituteTab("list");
              resetInstituteForm();
            }}
          >
            List
          </button>
          <button
            className={`px-5 py-2 rounded-t-lg font-semibold transition-all duration-150 ${instituteTab === "form" ? "bg-gradient-to-r from-purple-400 to-blue-400 text-white shadow" : "bg-white text-blue-900 border-b-2 border-blue-200 hover:bg-blue-50"}`}
            onClick={() => {
              setInstituteTab("form");
              resetInstituteForm();
            }}
          >
            {editingInstitute ? "Edit" : "Add"} Institute
          </button>
        </>
      )}
    </div>
  );
}