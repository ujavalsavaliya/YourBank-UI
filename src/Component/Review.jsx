import { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";

export default function Services() {
  const [showAll, setShowAll] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/review")
      .then(response => {
        console.log("Fetched reviews:", response.data);
        setReviews(response.data);
      })
      .catch(error => {
        console.error("Error fetching reviews:", error);
      });
  }, []);

  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="w-full">
      <div className="container mx-auto my-3 w-full text-center flex flex-col justify-center items-center">
        <div className="mb-8">
          <h1 className="text-5xl text-[#7C76BB] font-bold">Customer Reviews</h1>
          <p className="max-w-xl text-gray-600 mt-4">
            Hear what our happy customers have to say about their experience with our bank.
          </p>
        </div>

        <div className="container mx-auto w-full flex flex-wrap p-2 items-center justify-center">
          {visibleReviews.map((review) => (
            <Card
              key={review.id}
              reviewerName={review.reviewerName}
              review={review.review}
              star={review.star}
            />
          ))}
        </div>

        {!showAll && reviews.length > 3 && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-6 mb-7 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            See More Reviews
          </button>
        )}
      </div>
    </div>
  );
}
