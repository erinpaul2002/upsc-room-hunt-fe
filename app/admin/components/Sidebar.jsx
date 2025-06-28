import React from "react";

export default function Sidebar({ activeSection, setActiveSection }) {
  return (
    <aside className="w-60 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white flex flex-col py-8 px-4 shadow-xl">
      <h2 className="text-2xl font-extrabold mb-8 text-center tracking-wide bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Admin</h2>
      <button
        className={`mb-4 py-2 px-4 rounded-lg text-left font-semibold transition-all duration-150 ${activeSection === "hostels" ? "bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg text-white" : "hover:bg-blue-800/80 hover:shadow"}`}
        onClick={() => setActiveSection("hostels")}
      >
        Hostels
      </button>
      <button
        className={`py-2 px-4 rounded-lg text-left font-semibold transition-all duration-150 ${activeSection === "institutes" ? "bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg text-white" : "hover:bg-blue-800/80 hover:shadow"}`}
        onClick={() => setActiveSection("institutes")}
      >
        Institutes
      </button>
    </aside>
  );
}