// import React, { useEffect, useRef, useState } from "react";
// import Quill from "quill";
// import "quill/dist/quill.snow.css";

// // Register toolbar options including image
// const toolbarOptions = [
//   [{ header: [1, 2, 3, false] }],
//   ["bold", "italic", "underline", "strike"],
//   [{ list: "ordered" }, { list: "bullet" }],
//   ["link", "image"],
//   ["clean"],
// ];

// const TextEditor = () => {
//   const editorRef = useRef(null);
//   const quillRef = useRef(null);
//   const [title, setTitle] = useState("");

//   useEffect(() => {
//     if (!quillRef.current) {
//       quillRef.current = new Quill(editorRef.current, {
//         theme: "snow",
//         modules: {
//           toolbar: {
//             container: toolbarOptions,
//             handlers: {
//               image: imageHandler,
//             },
//           },
//         },
//       });
//     }
//   }, []);

//   // 🖼 Custom Image Upload Handler
//   const imageHandler = () => {
//     const input = document.createElement("input");
//     input.setAttribute("type", "file");
//     input.setAttribute("accept", "image/*");
//     input.click();

//     input.onchange = async () => {
//       const file = input.files[0];
//       const formData = new FormData();
//       formData.append("image", file);

//       try {
//         // Replace with your own image upload API endpoint
//         const res = await fetch(
//           "http://localhost:5000/api/blogs/upload-image",
//           {
//             method: "POST",
//             body: formData,
//           }
//         );

//         const data = await res.json();
//         const range = quillRef.current.getSelection();
//         quillRef.current.insertEmbed(range.index, "image", data.imageUrl);
//       } catch (err) {
//         console.error("Image upload failed", err);
//       }
//     };
//   };

//   // 📝 Blog Submit
//   const handleSubmit = async () => {
//     const content = quillRef.current.root.innerHTML;

//     const blogData = {
//       title,
//       content,
//     };

//     try {
//       const res = await fetch("http://localhost:5000/api/blogs", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(blogData),
//       });

//       const result = await res.json();
//       alert("Blog uploaded successfully!");
//       console.log(result);
//     } catch (err) {
//       console.error("Blog upload failed", err);
//     }
//   };

//   return (
//     <div style={{ padding: "1rem" }}>
//       <input
//         type="text"
//         placeholder="Enter blog title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         style={{
//           width: "100%",
//           padding: "10px",
//           fontSize: "1.2rem",
//           marginBottom: "10px",
//         }}
//       />

//       <div ref={editorRef} style={{ height: "300px", marginBottom: "20px" }} />

//       <button
//         onClick={handleSubmit}
//         style={{ padding: "10px 20px", fontSize: "1rem" }}
//       >
//         Submit Blog
//       </button>
//     </div>
//   );
// };

// export default TextEditor;
import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";

const Font = Quill.import("formats/font");
Font.whitelist = ["sans-serif", "serif", "monospace"];
Quill.register(Font, true);

const Size = Quill.import("attributors/style/size");
Size.whitelist = ["small", "normal", "large", "huge"];
Quill.register(Size, true);
Quill.register("modules/imageResize", ImageResize);

const toolbarOptions = [
  [{ font: [] }, { size: [] }],
  ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
  [{ script: "sub" }, { script: "super" }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
  [{ align: [] }, { direction: "rtl" }],
  ["link", "image", "video"],
  ["clean"],
];

const TextEditor = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [title, setTitle] = useState("");
  const [localImages, setLocalImages] = useState([]); // Track images inserted as blobs

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

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const blobUrl = e.target.result; // Base64 data URL
          const range = quillRef.current.getSelection(true);

          quillRef.current.insertEmbed(range.index, "image", blobUrl);
          quillRef.current.setSelection(range.index + 1);

          // Track for uploading later
          setLocalImages((prev) => [...prev, { blobUrl, file }]);
        };

        reader.readAsDataURL(file); // Convert image to base64
      }
    };
  };

  const handleSubmit = async () => {
    const contentHTML = quillRef.current.root.innerHTML;
    let finalContent = contentHTML;

    // Replace all blob URLs with uploaded image URLs
    for (const img of localImages) {
      const formData = new FormData();
      formData.append("image", img.file);

      try {
        const res = await fetch(
          "http://localhost:5000/api/blogs/upload-image",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        finalContent = finalContent.replace(
          new RegExp(img.blobUrl, "g"),
          data.imageUrl
        );
      } catch (err) {
        console.error("Image upload failed", err);
        alert("Image upload failed");
        return;
      }
    }

    const blogData = {
      title,
      content: finalContent,
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

      <div ref={editorRef} style={{ height: "400px", marginBottom: "20px" }} />

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
