import React from "react";
import {
  Wifi,
  Waves,
  Dumbbell,
  Utensils,
  Car,
  Sparkles,
  Briefcase,
  ConciergeBell,
} from "lucide-react";

const iconMap = {
  wifi: Wifi,
  waves: Waves,
  dumbbell: Dumbbell,
  utensils: Utensils,
  car: Car,
  sparkles: Sparkles,
  briefcase: Briefcase,
  concierge: ConciergeBell,
};

export default function AmenitiesSection({ amenities }) {
  return (
    <section className="bg-white py-16 px-6 md:px-10 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-serif text-[#0b2b6f] mb-4">
            Hotel Amenities
          </h2>
          <p className="text-[#0b2b6f] max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Experience world-class facilities designed for your comfort and
            convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {amenities.map((item, index) => {
            const IconComponent = iconMap[item.icon];

            return (
              <div
                key={index}
                className="group bg-[#eaf4ff] border border-[#cfe3f8] rounded-2xl p-5 shadow-[0_10px_25px_rgba(11,31,68,0.18)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_16px_35px_rgba(11,31,68,0.28)]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#2f6fb3] flex items-center justify-center mb-4 shadow-md transition-transform duration-300 group-hover:scale-105">
                  <IconComponent className="text-white w-5 h-5" />
                </div>

                <h3 className="text-lg font-serif text-[#0b1f44] mb-2 transition-all duration-300 group-hover:text-[1.15rem]">
                  {item.title}
                </h3>

                <p className="text-sm text-[#243b63] leading-6 transition-all duration-300 group-hover:text-[0.96rem]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}