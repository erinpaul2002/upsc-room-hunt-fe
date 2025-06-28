"use client";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import SectionTabs from "./components/SectionTabs";
import HostelRooms from "./components/HostelRooms";
import HostelImages from "./components/HostelImages";
import InstituteForm from "./components/InstituteForm";
import InstituteList from "./components/InstituteList";
import HostelList from "./components/HostelList";
import HostelRoomEditModal from "./components/HostelRoomEditModal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdminPage() {
  // State for hostels and institutes
  const [hostels, setHostels] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [hostelForm, setHostelForm] = useState({
    name: "",
    location: { address: "", latitude: "", longitude: "", link: "" },
    description: "",
    amenities: "",
    contact: "",
    gender: "",
    rooms: [],
    images: [],
  });
  const [roomDraft, setRoomDraft] = useState({
    roomId: "",
    type: "",
    vacancy: "",
    price: "",
    available: true,
    securityDeposit: "",
  });
  const [imageDraft, setImageDraft] = useState("");
  const [instituteForm, setInstituteForm] = useState({
    name: "",
    location: { address: "", latitude: "", longitude: "" },
  });
  const [editingHostel, setEditingHostel] = useState(null);
  const [editingInstitute, setEditingInstitute] = useState(null);
  const [activeSection, setActiveSection] = useState("hostels");
  const [hostelTab, setHostelTab] = useState("list");
  const [instituteTab, setInstituteTab] = useState("list");
  const [instituteJsonMode, setInstituteJsonMode] = useState(false);
  const [instituteJsonInput, setInstituteJsonInput] = useState("");
  const [instituteJsonError, setInstituteJsonError] = useState("");
  const [editingRoomIdx, setEditingRoomIdx] = useState(null);

  // Fetch all hostels and institutes
  useEffect(() => {
    fetch(`${API_BASE}/hostels/all`).then(r => r.json()).then(setHostels);
    fetch(`${API_BASE}/institutions/all`).then(r => r.json()).then(setInstitutes);
  }, []);

  // Hostel CRUD
  const handleHostelSubmit = async (e) => {
    e.preventDefault();
    const method = editingHostel ? "PUT" : "POST";
    const url = editingHostel
      ? `${API_BASE}/hostels/update/${editingHostel._id}`
      : `${API_BASE}/hostels/create`;
    const body = {
      ...hostelForm,
      amenities: hostelForm.amenities.split(",").map(a => a.trim()).filter(Boolean),
      coordinates: {
        type: "Point",
        coordinates: [
          parseFloat(hostelForm.location.longitude),
          parseFloat(hostelForm.location.latitude),
        ],
      },
      rooms: hostelForm.rooms.map(r => ({
        ...r,
        vacancy: Number(r.vacancy),
        price: Number(r.price),
        securityDeposit: Number(r.securityDeposit),
        available: r.available === "false" ? false : !!r.available,
      })),
      images: hostelForm.images.filter(Boolean),
    };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setHostelForm({
        name: "",
        location: { address: "", latitude: "", longitude: "", link: "" },
        description: "",
        amenities: "",
        contact: "",
        gender: "",
        rooms: [],
        images: [],
      });
      setEditingHostel(null);
      fetch(`${API_BASE}/hostels/all`).then(r => r.json()).then(setHostels);
      setHostelTab("list");
    }
  };

  const handleHostelDelete = async (id) => {
    if (!window.confirm("Delete this hostel?")) return;
    await fetch(`${API_BASE}/hostels/delete/${id}`, { method: "DELETE" });
    fetch(`${API_BASE}/hostels/all`).then(r => r.json()).then(setHostels);
  };

  const handleHostelEdit = (hostel) => {
    setEditingHostel(hostel);
    setHostelForm({
      ...hostel,
      amenities: hostel.amenities.join(", "),
      rooms: hostel.rooms || [],
      images: hostel.images || [],
    });
    setHostelTab("form");
  };

  // Room management
  const handleAddRoom = () => {
    if (
      !roomDraft.roomId ||
      !roomDraft.type ||
      roomDraft.vacancy === "" ||
      roomDraft.price === "" ||
      roomDraft.securityDeposit === ""
    )
      return;
    if (editingRoomIdx !== null) {
      // Update existing room
      setHostelForm(f => ({
        ...f,
        rooms: f.rooms.map((room, idx) =>
          idx === editingRoomIdx ? { ...roomDraft } : room
        ),
      }));
      setEditingRoomIdx(null);
    } else {
      // Add new room
      setHostelForm(f => ({
        ...f,
        rooms: [...(f.rooms || []), { ...roomDraft }],
      }));
    }
    setRoomDraft({
      roomId: "",
      type: "",
      vacancy: "",
      price: "",
      available: true,
      securityDeposit: "",
    });
  };

  const handleEditRoom = (idx) => {
    setRoomDraft({ ...hostelForm.rooms[idx] });
    setEditingRoomIdx(idx);
  };

  const handleRemoveRoom = (idx) => {
    setHostelForm(f => ({
      ...f,
      rooms: f.rooms.filter((_, i) => i !== idx),
    }));
  };

  // Image management
  const handleAddImage = () => {
    if (!imageDraft.trim()) return;
    setHostelForm(f => ({
      ...f,
      images: [...(f.images || []), imageDraft.trim()],
    }));
    setImageDraft("");
  };

  const handleRemoveImage = (idx) => {
    setHostelForm(f => ({
      ...f,
      images: f.images.filter((_, i) => i !== idx),
    }));
  };

  // Institute CRUD
  const handleInstituteSubmit = async (e) => {
    e.preventDefault();
    let data = instituteForm;
    if (instituteJsonMode) {
      try {
        data = JSON.parse(instituteJsonInput);
        setInstituteJsonError("");
      } catch (err) {
        setInstituteJsonError("Invalid JSON");
        return;
      }
    }
    const method = editingInstitute ? "PUT" : "POST";
    const url = editingInstitute
      ? `${API_BASE}/institutions/update/${editingInstitute._id}`
      : `${API_BASE}/institutions/create`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setInstituteForm({
        name: "",
        location: { address: "", latitude: "", longitude: "" },
      });
      setEditingInstitute(null);
      setInstituteJsonInput("");
      setInstituteJsonError("");
      fetch(`${API_BASE}/institutions/all`).then(r => r.json()).then(setInstitutes);
      setInstituteTab("list");
    }
  };

  const handleInstituteDelete = async (id) => {
    if (!window.confirm("Delete this institute?")) return;
    await fetch(`${API_BASE}/institutions/delete/${id}`, { method: "DELETE" });
    fetch(`${API_BASE}/institutions/all`).then(r => r.json()).then(setInstitutes);
  };

  const handleInstituteEdit = (institute) => {
    setEditingInstitute(institute);
    setInstituteForm({ ...institute });
    setInstituteTab("form");
  };

  // Reset functions for forms
  const resetHostelForm = () => {
    setEditingHostel(null);
    setHostelForm({
      name: "",
      location: { address: "", latitude: "", longitude: "", link: "" },
      description: "",
      amenities: "",
      contact: "",
      gender: "",
      rooms: [],
      images: [],
    });
  };
  const resetInstituteForm = () => {
    setEditingInstitute(null);
    setInstituteForm({
      name: "",
      location: { address: "", latitude: "", longitude: "" },
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-extrabold mb-8 text-transparent bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text tracking-tight drop-shadow">{activeSection === "hostels" ? "Hostels" : "Institutes"} Management</h1>
        {/* Tabs */}
        <SectionTabs
          activeSection={activeSection}
          hostelTab={hostelTab}
          setHostelTab={setHostelTab}
          editingHostel={editingHostel}
          resetHostelForm={resetHostelForm}
          instituteTab={instituteTab}
          setInstituteTab={setInstituteTab}
          editingInstitute={editingInstitute}
          resetInstituteForm={resetInstituteForm}
        />
        {/* Content */}
        {activeSection === "hostels" ? (
          hostelTab === "list" ? (
            <HostelList
              hostels={hostels}
              handleHostelEdit={handleHostelEdit}
              handleHostelDelete={handleHostelDelete}
            />
          ) : (
            <form onSubmit={handleHostelSubmit} className="bg-white/90 rounded-xl shadow-lg p-8 max-w-xl">
              <h2 className="text-xl font-bold mb-4 text-blue-900">{editingHostel ? "Edit" : "Add"} Hostel</h2>
              <input className="border border-blue-200 p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900" placeholder="Name" value={hostelForm.name} onChange={e => setHostelForm(f => ({ ...f, name: e.target.value }))} required />
              <input className="border border-blue-200 p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900" placeholder="Address" value={hostelForm.location.address} onChange={e => setHostelForm(f => ({ ...f, location: { ...f.location, address: e.target.value } }))} required />
              <input className="border border-blue-200 p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900" placeholder="Latitude" value={hostelForm.location.latitude} onChange={e => setHostelForm(f => ({ ...f, location: { ...f.location, latitude: e.target.value } }))} required />
              <input className="border border-blue-200 p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900" placeholder="Longitude" value={hostelForm.location.longitude} onChange={e => setHostelForm(f => ({ ...f, location: { ...f.location, longitude: e.target.value } }))} required />
              <input className="border border-blue-200 p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900" placeholder="Google Maps Link" value={hostelForm.location.link} onChange={e => setHostelForm(f => ({ ...f, location: { ...f.location, link: e.target.value } }))} required />
              <input className="border border-blue-200 p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900" placeholder="Description" value={hostelForm.description} onChange={e => setHostelForm(f => ({ ...f, description: e.target.value }))} required />
              <input className="border border-blue-200 p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900" placeholder="Amenities (comma separated)" value={hostelForm.amenities} onChange={e => setHostelForm(f => ({ ...f, amenities: e.target.value }))} required />
              <input className="border border-blue-200 p-2 w-full mb-2 rounded focus:ring-2 focus:ring-blue-300 text-blue-900" placeholder="Contact" value={hostelForm.contact} onChange={e => setHostelForm(f => ({ ...f, contact: e.target.value }))} required />
              <input className="border border-blue-200 p-2 w-full mb-4 rounded focus:ring-2 focus:ring-blue-300 text-blue-900" placeholder="Gender" value={hostelForm.gender} onChange={e => setHostelForm(f => ({ ...f, gender: e.target.value }))} required />

              {/* Images Section */}
              <HostelImages
                imageDraft={imageDraft}
                setImageDraft={setImageDraft}
                images={hostelForm.images}
                handleAddImage={handleAddImage}
                handleRemoveImage={handleRemoveImage}
              />

              {/* Rooms Section */}
              <HostelRooms
                roomDraft={roomDraft}
                setRoomDraft={setRoomDraft}
                editingRoomIdx={editingRoomIdx}
                handleAddRoom={handleAddRoom}
                hostelForm={hostelForm}
                handleEditRoom={handleEditRoom}
                handleRemoveRoom={handleRemoveRoom}
              />

              <div className="flex gap-2">
                <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded shadow font-semibold hover:from-pink-600 hover:to-purple-600 transition-all" type="submit">{editingHostel ? "Update" : "Create"} Hostel</button>
                {editingHostel && <button type="button" className="ml-2 text-sm text-gray-600 hover:underline" onClick={() => { setEditingHostel(null); setHostelForm({ name: "", location: { address: "", latitude: "", longitude: "", link: "" }, description: "", amenities: "", contact: "", gender: "", rooms: [], images: [] }); setHostelTab("list"); }}>Cancel</button>}
              </div>
            </form>
          )
        ) : (
          instituteTab === "list" ? (
            <InstituteList
              institutes={institutes}
              handleInstituteEdit={handleInstituteEdit}
              handleInstituteDelete={handleInstituteDelete}
            />
          ) : (
            <InstituteForm
              editingInstitute={editingInstitute}
              instituteForm={instituteForm}
              setInstituteForm={setInstituteForm}
              instituteJsonMode={instituteJsonMode}
              setInstituteJsonMode={setInstituteJsonMode}
              instituteJsonInput={instituteJsonInput}
              setInstituteJsonInput={setInstituteJsonInput}
              instituteJsonError={instituteJsonError}
              handleInstituteSubmit={handleInstituteSubmit}
              resetInstituteForm={() => {
                setEditingInstitute(null);
                setInstituteForm({ name: "", location: { address: "", latitude: "", longitude: "" } });
                setInstituteTab("list");
              }}
            />
          )
        )}
      </main>
      {editingRoomIdx !== null && (
        <HostelRoomEditModal
          roomDraft={roomDraft}
          setRoomDraft={setRoomDraft}
          handleAddRoom={handleAddRoom}
          setEditingRoomIdx={setEditingRoomIdx}
        />
      )}
    </div>
  );
}
