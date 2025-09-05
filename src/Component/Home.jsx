import React, { useState, useEffect } from "react";
import sampleVideo from "../assets/sample.mp4";
import { Link } from "react-router-dom";

function Home() {
  const fullText = "Bank Smarter, Live Better";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (window.innerWidth < 768) {
      // Small screen - display full text immediately
      setTypedText(fullText);
      return;
    }

    // Typing animation for larger screens
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
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Side - Text Content */}
      <div className="flex-1 flex items-center justify-center p-2 md:p-3">
        <div className="text-center md:text-left">
          <div className="relative h-20 mt-10 md:mt-0">
            <h3 className="absolute top-0 left-0 text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-yellow-400 bg-clip-text text-transparent whitespace-nowrap">
              {typedText}
              {window.innerWidth >= 768 && (
                <span className="animate-pulse">|</span>
              )}
            </h3>
          </div>

          <p className="text-blue-800 mb-2 text-lg md:text-2xl pt-5 md:ml-4">
            Manage your money securely with us.
          </p>
          <p className="text-blue-800 text-lg md:text-2xl md:ml-4">
            Trusted by millions of people worldwide.
          </p>

          {/* Login & Signup Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
            <Link to="/login">
              <button className="px-5 py-2 rounded-md border bg-gray-900 border-white text-white hover:bg-white hover:border-black hover:text-black transition duration-200 md:ml-4">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-5 py-2 rounded-md border bg-gray-900 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition duration-200">
                Signup
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Video */}
      <div className="flex-1 flex items-center justify-center p-0 md:p-5">
        <video
          src={sampleVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full md:w-[80%] h-auto rounded-lg shadow-2xl object-cover"
        />
      </div>
    </div>
  );
}

export default Home;
