// components/ClassSelector.js
import React, { useState } from "react";
import { Form, Select, Input, Button, message } from "antd";

export const ClassSelector = ({
  classes,
  selectedClassId,
  handleClassChange,
  onCreateNewClass,
}) => {
  const [newClassName, setNewClassName] = useState("");

  const handleCreateClass = async () => {
    if (!newClassName) return;
    try {
      await onCreateNewClass(newClassName);
      setNewClassName("");
    } catch (error) {
      message.error("Failed to create class.");
    }
  };

  return (
    <Form.Item label="Class" required>
      <Select
        placeholder="Select Class"
        value={selectedClassId}
        onChange={handleClassChange}
      >
        {classes.map((cls) => (
          <Option key={cls._id} value={cls._id}>
            {cls.name}
          </Option>
        ))}
      </Select>
      <Input
        className="mt-2"
        placeholder="Or enter new class name"
        value={newClassName}
        onChange={(e) => setNewClassName(e.target.value)}
      />
      <Button
        disabled={!newClassName}
        onClick={handleCreateClass}
        className="mt-2"
      >
        Create New Class
      </Button>
    </Form.Item>
  );
};
