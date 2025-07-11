import React, { useEffect, useState } from "react";
import { api } from "./api";

export default function SelectCarousel({
  classId,
  selectedCarousel,
  setSelectedCarousel,
}) {
  const [carousels, setCarousels] = useState([]);
  const [newCarouselName, setNewCarouselName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (classId) {
      fetchCarousels();
    } else {
      setCarousels([]);
      setSelectedCarousel("");
    }
  }, [classId]);

  const fetchCarousels = () => {
    api
      .get(`/class/${classId}/carousels`)
      .then((res) => setCarousels(res.data.carousels || []))
      .catch(console.error);
  };

  const createCarousel = () => {
    if (!newCarouselName.trim()) return;

    setIsCreating(true);
    api
      .post("/carousels", { name: newCarouselName, classId })
      .then((res) => {
        setCarousels([...carousels, res.data]);
        setNewCarouselName("");
        setSelectedCarousel(res.data._id);
      })
      .catch(console.error)
      .finally(() => setIsCreating(false));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Carousel
      </label>
      <select
        value={selectedCarousel}
        onChange={(e) => setSelectedCarousel(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Select Carousel --</option>
        {carousels.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <div className="mt-2 flex gap-2">
        <input
          type="text"
          placeholder="New Carousel Name"
          value={newCarouselName}
          onChange={(e) => setNewCarouselName(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={createCarousel}
          disabled={isCreating || !newCarouselName.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isCreating ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
}
