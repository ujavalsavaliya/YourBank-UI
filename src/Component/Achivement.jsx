import React from 'react';
import './anime.css';

function Achivement() {
  return (
    <div className="animated-gradient py-16 rounded-4xl shadow-xl">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h2 className="text-4xl font-bold text-indigo-700 mb-6">
          Why Choose Our Bank?
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-10">
          We're committed to delivering secure, seamless, and customer-centric banking experiences for individuals and businesses alike.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              title: 'Secure Transactions',
              description:
                'Your data and transactions are protected with bank-grade encryption and 2FA security.',
            },
            {
              title: '24/7 Customer Support',
              description:
                'Need help? Our expert support team is always available by phone, chat, or email.',
            },
            {
              title: 'Fast & Reliable',
              description:
                'Enjoy instant money transfers, real-time updates, and a hassle-free banking experience.',
            },
          ].map((card, index) => (
            <div
              key={index}
              className="relative group bg-white rounded-xl p-6 overflow-hidden cursor-pointer transition-all duration-200 shadow-md hover:shadow-2xl"
            >
              {/* Expanding background animation */}
              <div className="absolute inset-0 bg-amber-100 scale-0 group-hover:scale-100 transition-transform duration-200 origin-bottom rounded-xl z-0"></div>

              {/* Foreground content */}
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Achivement;
