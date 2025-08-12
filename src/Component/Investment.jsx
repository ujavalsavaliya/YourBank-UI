import React from 'react'

const plans = [
  {
    name: "Basic Saver",
    price: "$0",
    description: "Start your savings journey with zero fees.",
    features: [
      "🏦 1 Savings Account",
      "🏧 ATM Access",
      "📄 Monthly Statements",
      "❌ No Maintenance Fee",
    ],
    cta: "Start Saving",
    highlight: false,
  },
  {
    name: "Growth Plan",
    price: "$29",
    description: "Boost your savings with premium benefits.",
    features: [
      "🏦 2 Savings Accounts",
      "🎧 Priority Support",
      "📈 Interest Booster",
      "🔁 Auto Recurring Deposits",
    ],
    cta: "Go Premium",
    highlight: true,
  },
  {
    name: "Family Plan",
    price: "+ $10",
    description: "Ideal for families or multiple account holders.",
    features: [
      "👨‍👩‍👧‍👦 Up to 4 Account Holders",
      "🔒 Parental Controls",
      "📊 Shared Budget Tools",
      "💎 Exclusive Financial Perks",
    ],
    cta: "Join Now",
    highlight: false,
  },
];

function Investment() {
  return (
    <section className="py-16 bg-white">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-blue-800 mt-3">Investment Plans</h2>
        <p className="text-gray-600 mt-2">
          Choose the plan that fits your banking needs.
        </p>
      </div>
      <div className="flex justify-center flex-wrap gap-8 px-4">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`rounded-2xl w-[240px] shadow-md px-6 py-8 space-y-4 ${
              plan.name === "Growth Plan"
                ? "bg-orange-100 text-gray-800 border border-orange-400 shadow-[0_10px_20px_rgba(255,165,0,0.3)]"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-3xl font-extrabold">{plan.price}</p>
              <p>{plan.description}</p>
            </div>
            <ul className="text-sm space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`w-full mt-5 py-2 rounded-md font-semibold ${
                plan.name === "Growth Plan"
                  ? "bg-orange-500 text-white"
                  : "bg-blue-600 text-white"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Investment
