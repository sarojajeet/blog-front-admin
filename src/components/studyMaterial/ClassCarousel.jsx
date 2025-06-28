import React, { useRef, useState } from "react";
import { Card, Collapse, Spin } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import axios from "axios";
import { IP } from "../../utils/Constent";

const { Panel } = Collapse;

const ClassCarousel = ({ classes = [], onFetchByCarousel }) => {
  const containerRef = useRef();
  const [selectedClass, setSelectedClass] = useState(null);
  const [carousels, setCarousels] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!classes.length) return null;

  const scroll = (direction) => {
    const { current } = containerRef;
    if (current) {
      const scrollAmount = 300;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const handleClassClick = async (cls) => {
    setSelectedClass(cls._id);
    setLoading(true);
    try {
      const response = await axios.get(
        `${IP}/api/v1/class/${cls._id}/carousels`
      );
      setCarousels(response.data.carousels);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubPanelClick = (subCarouselId) => {
    if (onFetchByCarousel) {
      onFetchByCarousel(subCarouselId);
    }
  };

  return (
    <div className="relative w-full mt-6">
      <h3 className="text-lg font-semibold mb-4">Classes</h3>
      <div className="relative">
        {/* Scroll Buttons */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-2 shadow"
          onClick={() => scroll("left")}
        >
          <LeftOutlined />
        </button>
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-2 shadow"
          onClick={() => scroll("right")}
        >
          <RightOutlined />
        </button>

        {/* Horizontal Scroll Container */}
        <div
          ref={containerRef}
          className="flex overflow-x-auto no-scrollbar space-x-4 mx-10"
        >
          {classes.map((cls) => (
            <button
              key={cls._id}
              onClick={() => handleClassClick(cls)}
              className={`p-2 px-5 border ${
                selectedClass === cls._id
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-200"
              } rounded-full`}
            >
              {cls.name}
            </button>
          ))}
        </div>
      </div>

      {/* Carousels Accordion */}
      <div className="mt-6 mx-10">
        {loading ? (
          <Spin />
        ) : (
          carousels.length > 0 && (
            <Collapse accordion>
              {carousels.map((carousel) => (
                <Panel header={carousel.name} key={carousel._id}>
                  <p>Main Carousel: {carousel.name}</p>
                  {carousel.subCarousels && carousel.subCarousels.length > 0 ? (
                    <Collapse>
                      {carousel.subCarousels.map((sub) => (
                        <Panel
                          header={sub.name}
                          key={sub._id}
                          onClick={(e) => {
                            e.stopPropagation(); // prevent parent collapse toggle
                            handleSubPanelClick(sub._id);
                          }}
                        >
                          <p>SubCarousel: {sub.name}</p>
                        </Panel>
                      ))}
                    </Collapse>
                  ) : (
                    <p className="text-gray-500">No sub carousels.</p>
                  )}
                </Panel>
              ))}
            </Collapse>
          )
        )}
      </div>
    </div>
  );
};

export default ClassCarousel;
