import React, { useState } from "react";

const questions = [
  {
    question: "Is online banking secure?",
    answer:
      "Yes. We use advanced encryption, real-time fraud detection, and multi-factor authentication to protect your data.",
  },
  {
    question: "What should I do if I see suspicious activity?",
    answer:
      "Immediately report the issue to our 24/7 support. We'll block any unauthorized access and help you recover quickly.",
  },
  {
    question: "How does MFA protect my account?",
    answer:
      "MFA adds a second layer of security by requiring OTPs or biometrics in addition to your password.",
  },
  {
    question: "Is my personal data shared?",
    answer:
      "No. Your data is securely encrypted and never shared without your explicit permission.",
  },
  {
    question: "Can I turn off security alerts?",
    answer:
      "We recommend keeping them on for your safety, but you can manage alert preferences in settings.",
  },
];

export default function Question() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [previousIndex, setPreviousIndex] = useState(null);

  const toggle = (index) => {
    setPreviousIndex(activeIndex);
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="py-12 px-4 flex justify-center bg-transparent">
      <div className="w-full max-w-2xl space-y-2">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>

        {questions.map((item, index) => {
          const isActive = activeIndex === index;
          const wasActive = previousIndex === index;
          const isClosing = !isActive && wasActive;

          return (
            <div
              key={index}
              onClick={() => toggle(index)}
              className={`bg-gray-900 rounded-lg p-4 border border-gray-700 transition-all duration-300 cursor-pointer hover:bg-gray-700`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-amber-100">
                  {item.question}
                </h3>
                <span
                  className={`text-amber-100 text-xl font-bold transition-transform duration-300 ${
                    isActive ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ^
                </span>
              </div>

              <div
                className={`overflow-hidden transition-all ease-in-out ${
                  isActive
                    ? "max-h-96 opacity-100 mt-3 duration-500"
                    : isClosing
                    ? "max-h-0 opacity-0 duration-200"
                    : "max-h-0 opacity-0 duration-500"
                }`}
              >
                <p className="text-amber-100 text-sm leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
