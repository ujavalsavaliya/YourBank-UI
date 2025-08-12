import React, { useEffect, useState } from "react";
import MFA from "../assets/MFA.jpg";
import Encryption from "../assets/ETE.jpg";
import FraudDetection from "../assets/Hacker.jpeg";
import AppSecurity from "../assets/24for7.png";

const imageMap = {
  MFA: MFA,
  Encryption: Encryption,
  FraudDetection: FraudDetection,
  AppSecurity: AppSecurity,
};

export default function Security() {
  const [features, setFeatures] = useState([]);
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/security")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((item) => ({
          ...item,
          image: imageMap[item.image] || "", // Map image string to imported asset
        }));
        setFeatures(mapped);
        setExpanded(Array(mapped.length).fill(false));
      })
      .catch((error) => console.error("Error fetching features:", error));
  }, []);

  const toggleExpand = (index) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">
          Bank Security: Your Safety Is Our Priority
        </h1>
        <p className="text-gray-700 mb-12">
          At SecureBank, we use advanced technology and best practices to
          protect your data, money, and trust.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-100 p-5 rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-transform duration-300 flex flex-col justify-between"
          >
            <div>
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h2>
              <p className="text-gray-600">
                {expanded[index]
                  ? feature.desc
                  : feature.desc.split(".").slice(0, 2).join(".") + "..."}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => toggleExpand(index)}
                className="relative group overflow-hidden px-4 py-2 bg-amber-100 text-gray-800 text-sm font-semibold rounded shadow hover:shadow-lg transition-all duration-300"
              >
                <span className="relative z-10">
                  {expanded[index] ? "Show Less" : "Explore"}
                </span>
                <div className="absolute inset-0 bg-amber-300 scale-0 group-hover:scale-100 transition-transform duration-300 origin-bottom"></div>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-16 text-center">
        <h3 className="text-xl font-semibold text-blue-800 mb-2">
          Our Promise
        </h3>
        <p className="text-gray-700">
          We continuously update our security systems to stay ahead of cyber
          threats. With SecureBank, you're always protected, informed, and in
          control.
        </p>
      </div>
    </div>
  );
}
