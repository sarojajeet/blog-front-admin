// components/CategorySelector.js
import React from "react";
import { Form, Select } from "antd";

const { Option } = Select;

export const CategorySelector = ({
  level,
  selectionPath,
  currentOptions,
  handleCategoryChange,
}) => {
  return (
    <Form.Item
      label={level === 0 ? "Category" : `Subcategory ${level}`}
      required
    >
      <Select
        value={selectionPath[level]}
        placeholder={`Select ${level === 0 ? "category" : "subcategory"}`}
        onChange={(value) => handleCategoryChange(level, value)}
      >
        {currentOptions.map((cat) => (
          <Option key={cat._id} value={cat._id}>
            {cat.name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};
