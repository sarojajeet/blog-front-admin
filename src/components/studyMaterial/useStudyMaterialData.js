// hooks/useStudyMaterialData.js
import { useState, useEffect } from "react";
import axios from "axios";
import { IP } from "../../utils/Constent";

export const useStudyMaterialData = () => {
  const [categories, setCategories] = useState([]);
  const [classes, setClasses] = useState([]);
  const [carousels, setCarousels] = useState([]);
  const [subCarousels, setSubCarousels] = useState([]);
  // console.log(subCarousels);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${IP}/api/v1/categoriesWithSubcategories`);
      setCategories(res.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error;
    }
  };

  const fetchClasses = async (subcategoryId) => {
    try {
      const res = await axios.get(
        `${IP}/api/v1/subcategory/${subcategoryId}/classes`
      );
      setClasses(res.data.classes);
    } catch (error) {
      console.error("Failed to load classes:", error);
      throw error;
    }
  };

  const fetchCarousels = async (classId) => {
    try {
      const res = await axios.get(`${IP}/api/v1/class/${classId}/carousels`);
      setCarousels(res.data.carousels);
    } catch (error) {
      console.error("Failed to load carousels:", error);
      throw error;
    }
  };

  const fetchSubCarousels = async (carouselId) => {
    try {
      const res = await axios.get(
        `${IP}/api/v1/get/carousels/${carouselId}/sub`
      );
      setSubCarousels(res.data.crousel);
    } catch (error) {
      console.error("Failed to load sub-carousels:", error);
      throw error;
    }
  };

  const createNewClass = async (name, subcategoryId) => {
    try {
      const res = await axios.post(`${IP}/api/v1/classes`, {
        name,
        subcategoryId,
      });
      return res.data;
    } catch (error) {
      console.error("Create class failed:", error);
      throw error;
    }
  };

  const createNewCarousel = async (name, classId) => {
    try {
      const res = await axios.post(`${IP}/api/v1/carousels`, {
        name,
        classId,
      });
      return res.data;
    } catch (error) {
      console.error("Create carousel failed:", error);
      throw error;
    }
  };

  const createNewSubCarousel = async (name, carouselId, classId) => {
    console.log("hitted");
    try {
      const res = await axios.post(`${IP}/api/v1/carousels/${carouselId}/sub`, {
        name,
        classId,
      });
      return res.data;
    } catch (error) {
      console.error("Create sub-carousel failed:", error);
      throw error;
    }
  };

  const uploadMaterial = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${IP}/api/v1/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    classes,
    carousels,
    subCarousels,
    loading,
    fetchCategories,
    fetchClasses,
    fetchCarousels,
    fetchSubCarousels,
    createNewClass,
    createNewCarousel,
    createNewSubCarousel,
    uploadMaterial,
  };
};
