import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

// Register toolbar options including image
const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image"],
  ["clean"],
];

const TextEditor = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: imageHandler,
            },
          },
        },
      });
    }
  }, []);

  // 🖼 Custom Image Upload Handler
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("image", file);

      try {
        // Replace with your own image upload API endpoint
        const res = await fetch(
          "http://localhost:5000/api/blogs/upload-image",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        const range = quillRef.current.getSelection();
        quillRef.current.insertEmbed(range.index, "image", data.imageUrl);
      } catch (err) {
        console.error("Image upload failed", err);
      }
    };
  };

  // 📝 Blog Submit
  const handleSubmit = async () => {
    const content = quillRef.current.root.innerHTML;

    const blogData = {
      title,
      content,
    };

    try {
      const res = await fetch("http://localhost:5000/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      const result = await res.json();
      alert("Blog uploaded successfully!");
      console.log(result);
    } catch (err) {
      console.error("Blog upload failed", err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <input
        type="text"
        placeholder="Enter blog title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "1.2rem",
          marginBottom: "10px",
        }}
      />

      <div ref={editorRef} style={{ height: "300px", marginBottom: "20px" }} />

      <button
        onClick={handleSubmit}
        style={{ padding: "10px 20px", fontSize: "1rem" }}
      >
        Submit Blog
      </button>
    </div>
  );
};

export default TextEditor;
