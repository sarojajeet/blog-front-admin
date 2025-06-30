// // components/CarouselSelector.js
// import React, { useState } from "react";
// import { Form, Select, Input, Button, message } from "antd";

// export const CarouselSelector = ({
//   carousels,
//   selectedCarouselId,
//   setSelectedCarouselId,
//   selectedClassId,
//   onCreateNewCarousel,
//   label = "Carousel",
// }) => {
//   const [newCarouselName, setNewCarouselName] = useState("");

//   const handleCreateCarousel = async () => {
//     if (!newCarouselName) return;
//     try {
//       await onCreateNewCarousel(newCarouselName, selectedClassId);
//       setNewCarouselName("");
//     } catch (error) {
//       message.error("Failed to create carousel.");
//     }
//   };

//   return (
//     <Form.Item label={label}>
//       <Select
//         placeholder={`Select ${label}`}
//         value={selectedCarouselId}
//         onChange={(value) => setSelectedCarouselId(value)}
//       >
//         {carousels.map((c) => (
//           <Option key={c._id} value={c._id}>
//             {c.name}
//           </Option>
//         ))}
//       </Select>
//       <Input
//         className="mt-2"
//         placeholder={`Or enter new ${label.toLowerCase()} name`}
//         value={newCarouselName}
//         onChange={(e) => setNewCarouselName(e.target.value)}
//       />
//       <Button
//         disabled={!newCarouselName}
//         onClick={handleCreateCarousel}
//         className="mt-2"
//       >
//         Create New {label}
//       </Button>
//     </Form.Item>
//   );
// };

// components/CarouselSelector.js
import React, { useState } from "react";
import { Form, Select, Input, Button, message } from "antd";

const { Option } = Select;

export const CarouselSelector = ({
  carousels,
  selectedCarouselId,
  setSelectedCarouselId,
  selectedClassId,
  onCreateNewCarousel,
  label = "Carousel",
}) => {
  const [newCarouselName, setNewCarouselName] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state

  const handleCreateCarousel = async () => {
    if (!newCarouselName) return;
    try {
      setLoading(true); // ✅ start loading
      await onCreateNewCarousel(newCarouselName, selectedClassId);
      setNewCarouselName("");
    } catch (error) {
      message.error("Failed to create carousel.");
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <Form.Item label={label}>
      <Select
        placeholder={`Select ${label}`}
        value={selectedCarouselId}
        onChange={(value) => setSelectedCarouselId(value)}
      >
        {carousels.map((c) => (
          <Option key={c._id} value={c._id}>
            {c.name}
          </Option>
        ))}
      </Select>
      <Input
        className="mt-2"
        placeholder={`Or enter new ${label.toLowerCase()} name`}
        value={newCarouselName}
        onChange={(e) => setNewCarouselName(e.target.value)}
      />
      <Button
        type="primary"
        disabled={!newCarouselName}
        loading={loading} // ✅ show spinner
        onClick={handleCreateCarousel}
        className="mt-2"
      >
        Create New {label}
      </Button>
    </Form.Item>
  );
};
