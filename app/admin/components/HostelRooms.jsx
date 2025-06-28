import React from "react";

export default function HostelRooms({
  roomDraft,
  setRoomDraft,
  editingRoomIdx,
  handleAddRoom,
  hostelForm,
  handleEditRoom,
  handleRemoveRoom,
}) {
  return (
    <div className="mb-4">
      <label className="block font-semibold text-blue-900 mb-1">Rooms</label>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <input
          className="border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900"
          placeholder="Room ID"
          value={roomDraft.roomId}
          onChange={e => setRoomDraft(r => ({ ...r, roomId: e.target.value }))}
        />
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
        <input
          className="border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900"
          placeholder="Vacancy"
          type="number"
          value={roomDraft.vacancy}
          onChange={e => setRoomDraft(r => ({ ...r, vacancy: e.target.value }))}
        />
        <input
          className="border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900"
          placeholder="Price"
          type="number"
          value={roomDraft.price}
          onChange={e => setRoomDraft(r => ({ ...r, price: e.target.value }))}
        />
        <input
          className="border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900"
          placeholder="Security Deposit"
          type="number"
          value={roomDraft.securityDeposit}
          onChange={e => setRoomDraft(r => ({ ...r, securityDeposit: e.target.value }))}
        />
        <select
          className="border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900"
          value={roomDraft.available}
          onChange={e => setRoomDraft(r => ({ ...r, available: e.target.value === "false" ? false : true }))}
        >
          <option value={true}>Available</option>
          <option value={false}>Not Available</option>
        </select>
      </div>
      <button
        type="button"
        className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 mb-2"
        onClick={handleAddRoom}
      >
        {editingRoomIdx !== null ? "Update Room" : "Add Room"}
      </button>
      <ul>
        {hostelForm.rooms && hostelForm.rooms.map((room, idx) => (
          <li key={idx} className="flex items-center gap-2 mb-1 text-sm">
            <span className="flex-1 text-blue-900">
              {room.roomId} | {room.type} | Vacancy: {room.vacancy} | ₹{room.price} | Deposit: ₹{room.securityDeposit} | {room.available ? "Available" : "Not Available"}
            </span>
            <button type="button" className="text-purple-600 hover:underline text-xs" onClick={() => handleEditRoom(idx)}>Edit</button>
            <button type="button" className="text-pink-600 hover:underline text-xs" onClick={() => handleRemoveRoom(idx)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}