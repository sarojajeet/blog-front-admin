// import React, { useEffect, useState } from "react";
// import { api } from "./api";

// export default function SelectSubCarousel({
//   parentCarouselId,
//   classId,
//   selectedSubCarousel,
//   setSelectedSubCarousel,
//   level = 1,
// }) {
//   const [subCarousels, setSubCarousels] = useState([]);
//   const [newSubName, setNewSubName] = useState("");
//   const [isCreating, setIsCreating] = useState(false);

//   useEffect(() => {
//     if (parentCarouselId) {
//       fetchSubCarousels();
//     } else {
//       setSubCarousels([]);
//       setSelectedSubCarousel("");
//     }
//   }, [parentCarouselId]);

//   const fetchSubCarousels = () => {
//     api
//       .get(`/get/carousels/${parentCarouselId}/sub`)
//       .then((res) => setSubCarousels(res.data.crousel || []))
//       .catch(console.error);
//   };

//   const createSubCarousel = () => {
//     if (!newSubName.trim()) return;
//     console.log("hitted");

//     setIsCreating(true);
//     api
//       .post(`/carousels/${parentCarouselId}/sub`, {
//         name: newSubName,
//         classId,
//       })
//       .then((res) => {
//         setSubCarousels([...subCarousels, res.data]);
//         setNewSubName("");
//         setSelectedSubCarousel(res.data._id);
//       })
//       .catch(console.error)
//       .finally(() => setIsCreating(false));
//   };

//   return (
//     <div className="mb-4">
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         {level === 1 ? "Sub Carousel" : `Sub Carousel Level ${level}`}
//       </label>
//       <select
//         value={selectedSubCarousel}
//         onChange={(e) => setSelectedSubCarousel(e.target.value)}
//         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//       >
//         <option value="">
//           -- Select {level === 1 ? "Sub Carousel" : `Level ${level}`} --
//         </option>
//         {subCarousels.map((s) => (
//           <option key={s._id} value={s._id}>
//             {s.name}
//           </option>
//         ))}
//       </select>

//       <div className="mt-2 flex gap-2">
//         <input
//           type="text"
//           placeholder={`New ${
//             level === 1 ? "Sub Carousel" : `Level ${level + 1}`
//           } Name`}
//           value={newSubName}
//           onChange={(e) => setNewSubName(e.target.value)}
//           className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={createSubCarousel}
//           disabled={isCreating || !newSubName.trim()}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//         >
//           {isCreating ? "Adding..." : "Add"}
//         </button>
//       </div>

//       {/* Render nested sub-carousel selector if a sub-carousel is selected */}
//       {selectedSubCarousel && (
//         <div className="ml-4 mt-4 pl-4 border-l-2 border-gray-200">
//           <SelectSubCarousel
//             parentCarouselId={selectedSubCarousel}
//             classId={classId}
//             selectedSubCarousel={""}
//             setSelectedSubCarousel={() => {}}
//             level={level + 1}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { api } from "./api";

export default function SelectSubCarousel({
  parentCarouselId,
  classId,
  selectedSubCarousels, // Now expects an array
  setSelectedSubCarousels, // Function to update the array
  level = 1,
}) {
  const [subCarousels, setSubCarousels] = useState([]);
  const [newSubName, setNewSubName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (parentCarouselId) {
      fetchSubCarousels();
    } else {
      setSubCarousels([]);
      // Don't clear the entire array, just this level's selection
      setSelectedSubCarousels((prev) => prev.slice(0, level - 1));
    }
  }, [parentCarouselId]);

  const fetchSubCarousels = () => {
    api
      .get(`/get/carousels/${parentCarouselId}/sub`)
      .then((res) => setSubCarousels(res.data.crousel || []))
      .catch(console.error);
  };

  const createSubCarousel = () => {
    if (!newSubName.trim()) return;

    setIsCreating(true);
    api
      .post(`/carousels/${parentCarouselId}/sub`, {
        name: newSubName,
        classId,
      })
      .then((res) => {
        setSubCarousels([...subCarousels, res.data]);
        setNewSubName("");
        // Update the array with the new selection
        setSelectedSubCarousels((prev) => {
          const newArray = [...prev];
          newArray[level - 1] = res.data._id;
          return newArray;
        });
      })
      .catch(console.error)
      .finally(() => setIsCreating(false));
  };

  const handleSelectionChange = (e) => {
    const value = e.target.value;
    setSelectedSubCarousels((prev) => {
      const newArray = [...prev];
      newArray[level - 1] = value;
      // Clear any deeper level selections
      return newArray.slice(0, level);
    });
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {level === 1 ? "Sub Carousel" : `Sub Carousel Level ${level}`}
      </label>
      <select
        value={selectedSubCarousels[level - 1] || ""}
        onChange={handleSelectionChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">
          -- Select {level === 1 ? "Sub Carousel" : `Level ${level}`} --
        </option>
        {subCarousels.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name}
          </option>
        ))}
      </select>

      <div className="mt-2 flex gap-2">
        <input
          type="text"
          placeholder={`New ${
            level === 1 ? "Sub Carousel" : `Level ${level + 1}`
          } Name`}
          value={newSubName}
          onChange={(e) => setNewSubName(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={createSubCarousel}
          disabled={isCreating || !newSubName.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isCreating ? "Adding..." : "Add"}
        </button>
      </div>

      {/* Render nested sub-carousel selector if a sub-carousel is selected */}
      {selectedSubCarousels[level - 1] && (
        <div className="ml-4 mt-4 pl-4 border-l-2 border-gray-200">
          <SelectSubCarousel
            parentCarouselId={selectedSubCarousels[level - 1]}
            classId={classId}
            selectedSubCarousels={selectedSubCarousels}
            setSelectedSubCarousels={setSelectedSubCarousels}
            level={level + 1}
          />
        </div>
      )}
    </div>
  );
}
