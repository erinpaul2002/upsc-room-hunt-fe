import React from "react";

export default function HostelImages({
  imageDraft,
  setImageDraft,
  images,
  handleAddImage,
  handleRemoveImage,
}) {
  return (
    <div className="mb-4">
      <label className="block font-semibold text-blue-900 mb-1">Images</label>
      <div className="flex gap-2 mb-2">
        <input
          className="border border-blue-200 p-2 flex-1 rounded focus:ring-2 focus:ring-blue-300 text-blue-900"
          placeholder="Image URL"
          value={imageDraft}
          onChange={e => setImageDraft(e.target.value)}
        />
        <button
          type="button"
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={handleAddImage}
        >
          Add
        </button>
      </div>
      <ul className="mb-2">
        {images && images.map((img, idx) => (
          <li key={idx} className="flex items-center gap-2 mb-1">
            <span className="truncate flex-1">{img}</span>
            <button
              type="button"
              className="text-pink-600 hover:underline text-xs"
              onClick={() => handleRemoveImage(idx)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}