import React, { useRef, useState, useEffect } from "react";

export default function Card({ reviewerName, review, star }) {
  const [showFull, setShowFull] = useState(false);
  const [height, setHeight] = useState("auto");
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      if (showFull) {
        setHeight(`${contentRef.current.scrollHeight}px`);
      } else {
        setHeight("4.5em"); // Approx height for 3 lines
      }
    }
  }, [showFull, review]);

  return (
    <div
      className="w-[250px] bg-[rgba(39,163,255,0.12)] my-4 mx-6 p-4 rounded-3xl shadow-md flex flex-col items-center text-center transition-all duration-500 ease-in-out"
      style={{ boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
    >
      <img
        src={`https://i.pravatar.cc/100?u=${reviewerName}`}
        alt="Customer"
        className="w-16 h-16 rounded-full object-cover mb-3"
      />

      <h3 className="text-lg font-semibold text-gray-800">{reviewerName}</h3>
      <p className="text-sm text-gray-500 mb-3">Verified Customer</p>

      {/* Animated Review Section */}
      <div
        className="overflow-hidden text-sm text-gray-700 mb-4 transition-all duration-500 ease-in-out"
        style={{ maxHeight: height }}
        ref={contentRef}
      >
        “{review}”
      </div>

      <div className="text-yellow-500 text-sm font-semibold mb-2">
        ⭐ {star} / 5
      </div>

      {review.length > 100 && (
        <button
          className="px-3 py-1 rounded-md border border-black/50 text-sm hover:bg-blue-500 hover:text-white transition"
          onClick={() => setShowFull(!showFull)}
        >
          {showFull ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
}
