import React, { useState, useEffect } from "react";
import sampleVideo from "../assets/sample.mp4";
import { Link } from "react-router-dom";

function Home() {
  const fullText = "Bank Smarter, Live Better";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full flex overflow-hidden">
      {/* Left Side - Text Content */}
      <div className="flex-[1.2] bg-opacity-50 flex items-start justify-start px-16 pt-50">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-yellow-400 bg-clip-text text-transparent whitespace-nowrap">
            {typedText}
            <span className="animate-pulse">|</span>
          </h1>
          <p className="text-blue-800 mb-2 text-2xl pt-5 ml-4">
            Manage your money securely with us.
          </p> 
          <p className="text-blue-800 text-2xl ml-4">
            Trusted by millions people worldwide.
          </p>

          {/* Login & Signup Buttons */}
          <div className="mt-6 flex space-x-4">
            <Link to="/login">
              <button className="px-5 py-1.5 rounded-md border bg-gray-900 border-white text-white hover:bg-white hover:border-black hover:text-black hover:backdrop-blur-md transition duration-200 ml-4">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-5 py-1.5 rounded-md border bg-gray-900 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black hover:backdrop-blur-md transition duration-200">
                Signup
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Video */}
      <div className="flex-[1.8] flex items-center justify-center">
        <video
          src={sampleVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-[80%] h-[60%] rounded-lg shadow-2xl object-cover ml-10"
        />
      </div>
    </div>
  );
}

export default Home;
