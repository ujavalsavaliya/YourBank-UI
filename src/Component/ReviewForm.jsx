import React, { useState } from "react";
import axios from "axios";
import bg from "../assets/bgReviewForm.jpg"; // Import background image

function ReviewForm() {
  const [reviewerName, setReviewerName] = useState("");
  const [review, setReview] = useState("");
  const [star, setStar] = useState(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popup, setPopup] = useState({ message: "", type: "" });

  const showPopup = (message, type) => {
    setPopup({ message, type });
    setPopupVisible(true);

    setTimeout(() => {
      setPopupVisible(false);
    }, 2000);

    setTimeout(() => {
      setPopup({ message: "", type: "" });
    }, 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewerName || !review || star === 0) {
      showPopup("Please fill out all fields", "error");
      return;
    }

    try {
      const payload = { reviewerName, review, star };
      await axios.post("http://localhost:8080/review", payload);
      showPopup("Review submitted successfully!", "success");

      setReviewerName("");
      setReview("");
      setStar(0);
    } catch (err) {
      console.error("Submit failed:", err);
      showPopup("Failed to submit review.", "error");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative mt-10"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay blur and tint */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 max-w-md w-full mx-4 p-6 shadow-xl rounded-xl bg-amber-100/90 backdrop-blur-md">
        {/* Popup */}
        {popup.message && (
          <div
            className={`absolute top-[-60px] left-0 right-0 mx-auto w-full text-center py-2 px-4 rounded shadow-md font-semibold text-white transition-all duration-500 ${
              popup.type === "success" ? "bg-green-400" : "bg-red-400"
            } ${
              popupVisible
                ? "animate-fade-slide-enter"
                : "animate-fade-slide-exit"
            }`}
          >
            {popup.message}
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4 text-center text-amber-800">
          Share Your Experience
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border px-3 py-2 rounded bg-white/80 backdrop-blur-md"
            type="text"
            placeholder="Your Name"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
          />
          <textarea
            className="w-full border px-3 py-2 rounded bg-white/80 backdrop-blur-md"
            rows={3}
            placeholder="Your Review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rate) => (
              <span
                key={rate}
                onClick={() => setStar(rate)}
                className={`text-2xl cursor-pointer transition-transform duration-200 ${
                  rate <= star ? "text-yellow-400 scale-110" : "text-gray-400"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-950 transition duration-300"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReviewForm;
