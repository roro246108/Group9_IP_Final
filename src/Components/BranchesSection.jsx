import React from "react";
import { useNavigate } from "react-router-dom";

export default function BranchesSection({ branches = [] }) {
  const navigate = useNavigate();

  return (
    <section className="bg-[#edf7ff] py-16 px-6 md:px-10 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-serif text-[#0b2b6f] mb-4">
            Our Branches
          </h2>
          <p className="text-[#0b2b6f] max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Explore our luxury branches across Egypt and choose the destination
            that suits your perfect stay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
          {branches.map((branch, index) => (
            <div
              key={branch.id || branch.slug || index}
              className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl flex flex-col h-full"
            >
              <div className="relative overflow-hidden">
                <img
                  src={branch.image}
                  alt={branch.title || branch.name}
                  onError={(event) => {
                    if (branch.fallbackImage && event.currentTarget.src !== branch.fallbackImage) {
                      event.currentTarget.src = branch.fallbackImage;
                    }
                  }}
                  className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {branch.badge && (
                  <span className="absolute top-3 right-3 bg-[#f4a51c] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full z-10">
                    {branch.badge}
                  </span>
                )}
              </div>

              <div className="p-4 flex flex-col flex-1">
                <div className="mb-3 min-h-[52px] flex justify-between items-start gap-3">
                  <h3 className="text-2xl leading-tight font-serif text-[#0b1f44] max-w-[68%]">
                    {branch.title || branch.name}
                  </h3>

                  <span className="text-[11px] text-gray-500 text-right whitespace-nowrap pt-1">
                    {branch.location || branch.city}
                  </span>
                </div>

                <p className="text-gray-600 text-xs leading-6 mb-4 min-h-[78px]">
                  {branch.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4 min-h-[44px] content-start">
                  {(branch.features || []).map((feature, i) => (
                    <span
                      key={i}
                      className="bg-[#f3f4f6] text-gray-600 text-[10px] px-2.5 py-1 rounded-md"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <button
                    onClick={() => navigate(`/branches/${branch.slug}`)}
                    className="group/button w-full bg-[#d9ecff] text-[#071d49] py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-[#0b2b6f] hover:text-white hover:shadow-lg"
                  >
                    <span className="inline-flex items-center transition-transform duration-300 group-hover/button:translate-x-2">
                      Explore Branch
                      <span className="ml-2 transition-transform duration-300 group-hover/button:translate-x-1">
                        →
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
