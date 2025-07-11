import React, { useState } from "react";
import SelectCategory from "./SelectCategory";
import SelectSubcategory from "./SelectSubcategory";
import SelectClass from "./SelectClass";
import SelectCarousel from "./SelectCarousel";
import SelectSubCarousel from "./SelectSubCarousel";

export default function CreateStudyMaterial() {
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [classId, setClassId] = useState("");
  const [carouselId, setCarouselId] = useState("");
  //   const [subCarouselId, setSubCarouselId] = useState("");
  const [subCarousels, setSubCarousels] = useState([]); // Now an array

  const [name, setName] = useState("");
  const [language, setLanguage] = useState("english");
  const [pdfFile, setPdfFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      name,
      language,
      categoryId,
      subcategoryId,
      classId,
      carouselId,
      subCarousels,
      pdfFile: pdfFile?.name || null,
    };

    console.log("Form data:", formData);
    // Post your Study Material here...

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Study material created successfully!");
    }, 1500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please select a PDF file");
      e.target.value = null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Create Study Material
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Material Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter material name"
            required
          />
        </div>

        {/* Language Field */}
        <div>
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="german">German</option>
          </select>
        </div>

        {/* PDF Upload */}
        <div>
          <label
            htmlFor="pdf"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            PDF File
          </label>
          <div className="flex items-center">
            <input
              type="file"
              id="pdf"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {pdfFile && (
              <span className="ml-2 text-sm text-gray-600">{pdfFile.name}</span>
            )}
          </div>
        </div>

        {/* Category Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <SelectCategory
              selectedCategory={categoryId}
              setSelectedCategory={setCategoryId}
            />
          </div>
          <div>
            <SelectSubcategory
              categoryId={categoryId}
              selectedSubcategory={subcategoryId}
              setSelectedSubcategory={setSubcategoryId}
            />
          </div>
        </div>

        {/* Class Selection */}
        <div>
          <SelectClass
            subcategoryId={subcategoryId}
            selectedClass={classId}
            setSelectedClass={setClassId}
          />
        </div>

        {/* Carousel Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <SelectCarousel
              classId={classId}
              selectedCarousel={carouselId}
              setSelectedCarousel={setCarouselId}
            />
          </div>
          <div>
            <SelectSubCarousel
              parentCarouselId={carouselId}
              classId={classId}
              selectedSubCarousels={subCarousels}
              setSelectedSubCarousels={setSubCarousels}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Study Material"}
          </button>
        </div>
      </form>
    </div>
  );
}
