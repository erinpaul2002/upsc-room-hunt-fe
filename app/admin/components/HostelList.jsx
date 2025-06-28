import React from "react";

export default function HostelList({ hostels, handleHostelEdit, handleHostelDelete }) {
  return (
    <ul className="bg-white/90 rounded-xl shadow-lg divide-y">
      {hostels.map(h => (
        <li key={h._id} className="flex justify-between items-center px-4 py-3 hover:bg-blue-50/60 transition-all">
          <span>
            <span className="font-semibold text-blue-900">{h.name}</span>{" "}
            <span className="text-gray-500">({h.location?.address})</span>
          </span>
          <span>
            <button
              className="text-purple-600 font-semibold mr-2 hover:underline"
              onClick={() => handleHostelEdit(h)}
            >
              Edit
            </button>
            <button
              className="text-pink-600 font-semibold hover:underline"
              onClick={() => handleHostelDelete(h._id)}
            >
              Delete
            </button>
          </span>
        </li>
      ))}
    </ul>
  );
}