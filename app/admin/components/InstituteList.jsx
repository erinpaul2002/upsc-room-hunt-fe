import React from "react";

export default function InstituteList({ institutes, handleInstituteEdit, handleInstituteDelete }) {
  return (
    <ul className="bg-white/90 rounded-xl shadow-lg divide-y">
      {institutes.map(i => (
        <li key={i._id} className="flex justify-between items-center px-4 py-3 hover:bg-blue-50/60 transition-all">
          <span>
            <span className="font-semibold text-blue-900">{i.name}</span>{" "}
            <span className="text-gray-500">({i.location?.address})</span>
          </span>
          <span>
            <button
              className="text-purple-600 font-semibold mr-2 hover:underline"
              onClick={() => handleInstituteEdit(i)}
            >
              Edit
            </button>
            <button
              className="text-pink-600 font-semibold hover:underline"
              onClick={() => handleInstituteDelete(i._id)}
            >
              Delete
            </button>
          </span>
        </li>
      ))}
    </ul>
  );
}