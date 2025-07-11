import React, { useState } from "react";

export default function AccordiansList({ accordians }) {
  const [openAccordians, setOpenAccordians] = useState([]);
  const [subAccordians, setSubAccordians] = useState({});
  const [studyMaterials, setStudyMaterials] = useState({});
  const [loading, setLoading] = useState({
    accordians: {},
    materials: {},
  });

  const toggleAccordian = async (id) => {
    const isOpen = openAccordians.includes(id);

    if (isOpen) {
      setOpenAccordians((prev) => prev.filter((item) => item !== id));
    } else {
      if (!subAccordians[id]) {
        setLoading((prev) => ({
          ...prev,
          accordians: { ...prev.accordians, [id]: true },
        }));
        try {
          const res = await fetch(
            `http://localhost:5000/api/v1/get/carousels/${id}/sub`
          );
          const data = await res.json();
          setSubAccordians((prev) => ({
            ...prev,
            [id]: data.crousel || [],
          }));
        } catch (err) {
          console.error("Failed to fetch subAccordian:", err);
        } finally {
          setLoading((prev) => ({
            ...prev,
            accordians: { ...prev.accordians, [id]: false },
          }));
        }
      }
      setOpenAccordians((prev) => [...prev, id]);
    }
  };

  const fetchStudyMaterials = async (subAccordianId) => {
    if (!studyMaterials[subAccordianId]) {
      setLoading((prev) => ({
        ...prev,
        materials: { ...prev.materials, [subAccordianId]: true },
      }));
      try {
        const res = await fetch(
          `http://localhost:5000/api/v1/get-study-material?subCarouselId=${subAccordianId}`
        );
        const data = await res.json();
        setStudyMaterials((prev) => ({
          ...prev,
          [subAccordianId]: data || [],
        }));
      } catch (err) {
        console.error("Failed to fetch study materials:", err);
      } finally {
        setLoading((prev) => ({
          ...prev,
          materials: { ...prev.materials, [subAccordianId]: false },
        }));
      }
    }
  };

  if (!accordians.length) return null;

  return (
    <div className="bg-gray-50 py-6 px-6">
      <h2 className="text-lg font-semibold mb-4">Accordians</h2>
      <ul className="space-y-2">
        {accordians.map((acc) => (
          <li key={acc._id} className="bg-white rounded shadow">
            <button
              onClick={() => toggleAccordian(acc._id)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 flex justify-between items-center"
            >
              <span>{acc.name}</span>
              <span>
                {loading.accordians[acc._id]
                  ? "..."
                  : openAccordians.includes(acc._id)
                  ? "−"
                  : "+"}
              </span>
            </button>

            {openAccordians.includes(acc._id) && (
              <div className="px-6 py-2 border-t">
                {subAccordians[acc._id] ? (
                  subAccordians[acc._id].length > 0 ? (
                    <ul className="space-y-1">
                      {subAccordians[acc._id].map((sub) => (
                        <li key={sub._id} className="py-1">
                          <button
                            onClick={() => fetchStudyMaterials(sub._id)}
                            className="w-full text-left hover:text-black flex justify-between items-center"
                          >
                            <span className="text-gray-700 hover:text-black">
                              {sub.name}
                            </span>
                            <span>
                              {loading.materials[sub._id] ? "..." : "›"}
                            </span>
                          </button>

                          {studyMaterials[sub._id] && (
                            <div className="ml-4 mt-1 space-y-1">
                              {studyMaterials[sub._id].map((material) => (
                                <div
                                  key={material._id}
                                  className="text-sm text-gray-600 hover:text-black"
                                >
                                  <a
                                    href={material.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center"
                                  >
                                    <span className="mr-2">📄</span>
                                    {material.name} ({material.language})
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 py-2">
                      No sub-accordions found
                    </p>
                  )
                ) : (
                  <p className="text-gray-500 py-2">
                    Loading sub-accordions...
                  </p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
