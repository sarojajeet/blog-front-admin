// CreateStudyMaterialForm.js
import React, { useState, useEffect, useMemo } from "react";
import { Form, Select, message, Button, Input, Space } from "antd";
import { useStudyMaterialData } from "./useStudyMaterialData";
import { CategorySelector } from "./CategorySelector";
import { ClassSelector } from "./ClassSelector";
import { CarouselSelector } from "./CarouselSelector";
import { FileUploader } from "./FileUploader";
// import BlogForm from "./BlogForm";

const { Option } = Select;

const CreateStudyMaterialForm = () => {
  const [selectionPath, setSelectionPath] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedCarouselId, setSelectedCarouselId] = useState(null);
  const [selectedSubCarouselId, setSelectedSubCarouselId] = useState(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogData, setBlogData] = useState(null);
  const [form] = Form.useForm();

  const {
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
  } = useStudyMaterialData();

  // Get the current category tree based on selection path
  const currentCategoryTree = useMemo(() => {
    let current = { subcategories: categories };
    for (const id of selectionPath) {
      const found = current.subcategories?.find((c) => c._id === id);
      if (!found) break;
      current = found;
    }
    return current;
  }, [categories, selectionPath]);

  // Check if the current selection is a leaf node (has no subcategories)
  const isLeafCategory = useMemo(() => {
    return (
      !currentCategoryTree.subcategories ||
      currentCategoryTree.subcategories.length === 0
    );
  }, [currentCategoryTree]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryChange = async (level, value) => {
    const newPath = [...selectionPath.slice(0, level), value];
    setSelectionPath(newPath);

    // Reset downstream selections
    setSelectedClassId(null);
    setSelectedCarouselId(null);
    setSelectedSubCarouselId(null);
  };

  // Load classes when we reach a leaf category
  useEffect(() => {
    if (isLeafCategory && selectionPath.length > 0) {
      const subcategoryId = selectionPath[selectionPath.length - 1];
      fetchClasses(subcategoryId);
    }
  }, [isLeafCategory, selectionPath, fetchClasses]);

  // Load carousels when class is selected
  useEffect(() => {
    if (selectedClassId) {
      fetchCarousels(selectedClassId);
    }
  }, [selectedClassId, fetchCarousels]);

  // Load sub-carousels when carousel is selected
  useEffect(() => {
    if (selectedCarouselId) {
      fetchSubCarousels(selectedCarouselId);
    } else {
      setSelectedSubCarouselId(null);
    }
  }, [selectedCarouselId, fetchSubCarousels]);

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList.slice(-1)); // Only keep the latest file
  };

  const handleFinish = async (values) => {
    if (!fileList.length && !blogData) {
      message.warning("Please upload a PDF file or add a blog.");
      return;
    }

    if (!selectedClassId) {
      message.warning("Please select or create a class.");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("language", values.language);

    if (fileList.length) {
      formData.append("pdf", fileList[0].originFileObj);
    }

    formData.append("category", selectionPath[0]);
    selectionPath
      .slice(1)
      .forEach((subId) => formData.append("subCategories[]", subId));
    formData.append("classId", selectedClassId);

    if (selectedCarouselId) {
      formData.append("carouselId", selectedCarouselId);
    }
    if (selectedSubCarouselId) {
      formData.append("subCarouselId", selectedSubCarouselId);
    }

    if (blogData) {
      formData.append("blogData", JSON.stringify(blogData));
    }

    try {
      await uploadMaterial(formData);
      message.success("Study material uploaded!");
      form.resetFields();
      setSelectionPath([]);
      setFileList([]);
      setSelectedClassId(null);
      setSelectedCarouselId(null);
      setSelectedSubCarouselId(null);
      setBlogData(null);
      setShowBlogForm(false);
    } catch (error) {
      message.error("Upload failed.");
    }
  };

  const handleBlogSubmit = (data) => {
    setBlogData(data);
    setShowBlogForm(false);
    message.success("Blog content added!");
  };

  // Render category selectors
  const renderCategorySelectors = () => {
    const selectors = [];
    let currentOptions = categories;

    for (let level = 0; level <= selectionPath.length; level++) {
      if (level > 0) {
        const parentId = selectionPath[level - 1];
        const parent = currentOptions.find((c) => c._id === parentId);
        currentOptions = parent?.subcategories || [];
      }

      if (!currentOptions.length) break;

      selectors.push(
        <CategorySelector
          key={level}
          level={level}
          selectionPath={selectionPath}
          currentOptions={currentOptions}
          handleCategoryChange={handleCategoryChange}
        />
      );
    }

    return selectors;
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Create Study Material</h2>

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Material Name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter material name" />
        </Form.Item>

        <Form.Item
          name="language"
          label="Language"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select language">
            <Option value="English">English</Option>
            <Option value="Hindi">Hindi</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        {renderCategorySelectors()}

        {isLeafCategory && selectionPath.length > 0 && (
          <ClassSelector
            classes={classes}
            selectedClassId={selectedClassId}
            handleClassChange={setSelectedClassId}
            onCreateNewClass={async (name) => {
              const subcategoryId = selectionPath[selectionPath.length - 1];
              const newClass = await createNewClass(name, subcategoryId);
              setSelectedClassId(newClass._id);
            }}
          />
        )}

        {selectedClassId && (
          <CarouselSelector
            carousels={carousels}
            selectedCarouselId={selectedCarouselId}
            setSelectedCarouselId={setSelectedCarouselId}
            selectedClassId={selectedClassId}
            onCreateNewCarousel={async (name, classId) => {
              const newCarousel = await createNewCarousel(name, classId);
              setSelectedCarouselId(newCarousel._id);
            }}
          />
        )}

        {selectedCarouselId && (
          <CarouselSelector
            carousels={subCarousels}
            selectedCarouselId={selectedSubCarouselId}
            setSelectedCarouselId={setSelectedSubCarouselId}
            selectedClassId={selectedClassId}
            onCreateNewCarousel={async (name, classId) => {
              const newSubCarousel = await createNewSubCarousel(
                name,
                selectedCarouselId,
                classId
              );
              setSelectedSubCarouselId(newSubCarousel._id);
            }}
            label="Sub-Carousel"
          />
        )}

        <FileUploader fileList={fileList} handleFileChange={handleFileChange} />

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={loading}
          >
            Submit
          </Button>
        </Form.Item>

        <div className="mb-4">
          <Space>
            <FileUploader
              fileList={fileList}
              handleFileChange={handleFileChange}
            />
            <Button
              type={blogData ? "default" : "primary"}
              onClick={() => setShowBlogForm(!showBlogForm)}
            >
              {blogData ? "Edit Blog" : "Add Blog"}
            </Button>
          </Space>

          {blogData && (
            <div className="mt-2 p-2 border rounded bg-gray-50">
              <h4 className="font-medium">{blogData.title}</h4>
              <p className="text-sm text-gray-600">
                {blogData.shortDescription}
              </p>
              <Button
                type="link"
                size="small"
                danger
                onClick={() => setBlogData(null)}
              >
                Remove Blog
              </Button>
            </div>
          )}
        </div>

        {/* {showBlogForm && (
          <BlogForm
            onBlogSubmit={handleBlogSubmit}
            onCancel={() => setShowBlogForm(false)}
          />
        )} */}
      </Form>
    </div>
  );
};

export default CreateStudyMaterialForm;
