import React from "react";

export default function HostelRoomEditModal({
  roomDraft,
  setRoomDraft,
  handleAddRoom,
  setEditingRoomIdx,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4 text-blue-900">Edit Room</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <input className="border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900" placeholder="Room ID" value={roomDraft.roomId} onChange={e => setRoomDraft(r => ({ ...r, roomId: e.target.value }))} />
          <select
            className="border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900"
            value={roomDraft.type}
            onChange={e => setRoomDraft(r => ({ ...r, type: e.target.value }))}
          >
            <option value="">Select Type</option>
            <option value="Single">Single</option>
            <option value="Double">2-Sharing</option>
            <option value="Triple">3-Sharing</option>
            <option value="Dormitory">4-Sharing</option>
            <option value="Other">Dormitory</option>
          </select>
          <input className="border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900" placeholder="Vacancy" type="number" value={roomDraft.vacancy} onChange={e => setRoomDraft(r => ({ ...r, vacancy: e.target.value }))} />
          <input className="border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900" placeholder="Price" type="number" value={roomDraft.price} onChange={e => setRoomDraft(r => ({ ...r, price: e.target.value }))} />
          <input className="border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900" placeholder="Security Deposit" type="number" value={roomDraft.securityDeposit} onChange={e => setRoomDraft(r => ({ ...r, securityDeposit: e.target.value }))} />
          <select className="border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900" value={roomDraft.available} onChange={e => setRoomDraft(r => ({ ...r, available: e.target.value === "false" ? false : true }))}>
            <option value={true}>Available</option>
            <option value={false}>Not Available</option>
          </select>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            onClick={handleAddRoom}
          >
            Update Room
          </button>
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            onClick={() => setEditingRoomIdx(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}