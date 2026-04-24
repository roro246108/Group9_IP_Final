import { useState, useCallback } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ_DATA = [
  {
    category: "Booking",
    items: [
      {
        question: "How do I book a hotel room?",
        answer:
          "Browse our destinations, pick your dates and preferred room type, then complete the secure checkout. You'll receive an instant confirmation email with your booking details and a unique reservation code.",
      },
      {
        question: "Can I book for someone else?",
        answer:
          "Absolutely. During checkout, simply enter the guest's name in the 'Guest Details' section. The confirmation will be sent to your email, and the guest can check in with a valid ID matching the name on the reservation.",
      },
      {
        question: "Is there a minimum stay requirement?",
        answer:
          "Most of our properties have a one-night minimum. During peak seasons or holidays some branches may require a two-night minimum — this will be clearly noted on the room selection page.",
      },
    ],
  },
  {
    category: "Cancellations & Refunds",
    items: [
      {
        question: "What is your cancellation policy?",
        answer:
          "Free cancellation is available on most bookings up to 48 hours before check-in. Late cancellations (within 48 hours) may incur a one-night charge. Non-refundable rates, if selected, are clearly marked at the time of booking.",
      },
      {
        question: "How long do refunds take to process?",
        answer:
          "Once a cancellation is confirmed, refunds are initiated within 24 hours. Depending on your payment provider, the funds typically appear in your account within 5–10 business days.",
      },
    ],
  },
  {
    category: "Your Stay",
    items: [
      {
        question: "What time is check-in and check-out?",
        answer:
          "Standard check-in is from 3:00 PM and check-out is by 11:00 AM. Early check-in and late check-out can be requested — availability varies by branch and occupancy.",
      },
      {
        question: "Do you offer airport transfers?",
        answer:
          "Yes, all five LuxeStay branches offer private airport transfer services. You can add a transfer during booking or contact the concierge at least 24 hours before arrival to arrange one.",
      },
      {
        question: "Are pets allowed at LuxeStay?",
        answer:
          "Our Lakeside Retreat and Mountain Lodge branches are pet-friendly for dogs under 25 kg. A small nightly surcharge applies. Other branches do not currently allow pets.",
      },
    ],
  },
  {
    category: "Account & Loyalty",
    items: [
      {
        question: "How do I join the loyalty programme?",
        answer:
          "Simply create a free LuxeStay account and you're automatically enrolled. Every eligible booking earns points that can be redeemed for room upgrades, spa credits, and complimentary nights.",
      },
      {
        question: "I forgot my password — what should I do?",
        answer:
          "Click 'Sign In' then 'Forgot Password'. Enter your registered email and we'll send a secure reset link within minutes. If you don't see it, check your spam folder or contact support.",
      },
    ],
  },
];

export default function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState(FAQ_DATA[0].category);
  const [searchQuery, setSearchQuery] = useState("");

  const toggle = useCallback(
    (idx) => setActiveIndex((prev) => (prev === idx ? null : idx)),
    []
  );

  // Flatten & filter by search
  const visibleItems = searchQuery.trim()
    ? FAQ_DATA.flatMap((cat) =>
        cat.items.filter(
          (item) =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : FAQ_DATA.find((c) => c.category === activeCategory)?.items || [];

  return (
    <div>
      {/* Search */}
      <div className="relative mb-5">
        <HelpCircle
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search frequently asked questions…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sm text-blue-900 placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Category pills — hidden while searching */}
      {!searchQuery.trim() && (
        <div className="flex flex-wrap gap-2 mb-5">
          {FAQ_DATA.map((cat) => (
            <button
              key={cat.category}
              onClick={() => {
                setActiveCategory(cat.category);
                setActiveIndex(null);
              }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                activeCategory === cat.category
                  ? "bg-teal-600 text-white"
                  : "bg-sky-100 text-blue-800 hover:bg-sky-200"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>
      )}

      {/* Accordion items */}
      <div className="space-y-3">
        {visibleItems.length === 0 && (
          <p className="text-center text-sky-500 py-6 text-sm">
            No results found. Try a different search term.
          </p>
        )}

        {visibleItems.map((faq, index) => {
          const isOpen = activeIndex === index;
          return (
            <div
              key={index}
              className={`rounded-xl border transition-shadow ${
                isOpen
                  ? "border-teal-400 shadow-md"
                  : "border-sky-200 hover:border-sky-300"
              } bg-white overflow-hidden`}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-blue-950 text-[15px]">
                  {faq.question}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-teal-500 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-5 pb-4 pt-0 text-blue-800 leading-relaxed text-[15px] border-t border-sky-100">
                  <p className="pt-3">{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}