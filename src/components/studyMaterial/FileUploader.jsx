// components/FileUploader.js
import React from "react";
import { Form, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export const FileUploader = ({ fileList, handleFileChange }) => {
  return (
    <Form.Item label="Upload PDF" required>
      <Upload
        accept=".pdf"
        beforeUpload={() => false}
        fileList={fileList}
        onChange={handleFileChange}
        maxCount={1}
      >
        <Button icon={<UploadOutlined />}>Select PDF File</Button>
      </Upload>
    </Form.Item>
  );
};
