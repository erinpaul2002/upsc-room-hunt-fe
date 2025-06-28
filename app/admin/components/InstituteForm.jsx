import React from "react";

export default function InstituteForm({
  editingInstitute,
  instituteForm,
  setInstituteForm,
  instituteJsonMode,
  setInstituteJsonMode,
  instituteJsonInput,
  setInstituteJsonInput,
  instituteJsonError,
  handleInstituteSubmit,
  resetInstituteForm,
}) {
  return (
    <form onSubmit={handleInstituteSubmit} className="bg-white/90 rounded-xl shadow-lg p-8 max-w-xl">
      <h2 className="text-xl font-bold mb-4 text-blue-900">{editingInstitute ? "Edit" : "Add"} Institute</h2>
      <button
        type="button"
        className="mb-4 px-3 py-1 rounded bg-blue-100 text-blue-900 font-semibold hover:bg-blue-200 transition-all"
        onClick={() => setInstituteJsonMode(m => !m)}
      >
        {instituteJsonMode ? "Switch to Form Input" : "Switch to JSON Input"}
      </button>
      {instituteJsonMode ? (
        <>
          <textarea
            className="border border-blue-200 p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900 font-mono min-h-[120px]"
            placeholder='{"name": "...", "location": {"address": "...", "latitude": "...", "longitude": "..."}}'
            value={instituteJsonInput}
            onChange={e => setInstituteJsonInput(e.target.value)}
            required
          />
          {instituteJsonError && <div className="text-red-600 mb-2">{instituteJsonError}</div>}
        </>
      ) : (
        <>
          <input
            className="border border-blue-200 p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900"
            placeholder="Name"
            value={instituteForm.name}
            onChange={e => setInstituteForm(f => ({ ...f, name: e.target.value }))}
            required
          />
          <input
            className="border border-blue-200 p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900"
            placeholder="Address"
            value={instituteForm.location.address}
            onChange={e => setInstituteForm(f => ({ ...f, location: { ...f.location, address: e.target.value } }))}
            required
          />
          <input
            className="border border-blue-200 p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900"
            placeholder="Latitude"
            value={instituteForm.location.latitude}
            onChange={e => setInstituteForm(f => ({ ...f, location: { ...f.location, latitude: e.target.value } }))}
            required
          />
          <input
            className="border border-blue-200 p-2 w-full mb-4 rounded focus:ring-2 focus:ring-blue-300 text-blue-900"
            placeholder="Longitude"
            value={instituteForm.location.longitude}
            onChange={e => setInstituteForm(f => ({ ...f, location: { ...f.location, longitude: e.target.value } }))}
            required
          />
        </>
      )}
      <div className="flex gap-2">
        <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded shadow font-semibold hover:from-purple-600 hover:to-blue-600 transition-all" type="submit">
          {editingInstitute ? "Update" : "Create"} Institute
        </button>
        {editingInstitute && (
          <button
            type="button"
            className="ml-2 text-sm text-gray-600 hover:underline"
            onClick={resetInstituteForm}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}