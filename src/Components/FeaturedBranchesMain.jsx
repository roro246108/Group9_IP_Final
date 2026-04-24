import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { apiGet } from "../services/apiClient";
import { normalizeHotelBranch } from "../utils/hotelBranches";

export default function FeaturedBranchesPreview() {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadBranches = async () => {
      try {
        const data = await apiGet("/hotels");
        if (!isMounted) return;

        const normalizedBranches = Array.isArray(data?.hotels)
          ? data.hotels
              .filter((hotel) => hotel?.status !== "Inactive")
              .map(normalizeHotelBranch)
              .slice(0, 3)
          : [];

        setBranches(normalizedBranches);
      } catch {
        if (isMounted) {
          setBranches([]);
        }
      }
    };

    loadBranches();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-[#F8FAFC] px-6 py-20 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7ea0d6]">
            Featured Branches
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-[#2F4156] md:text-5xl">
            Discover Our Finest Destinations
          </h2>
          <p className="mt-5 text-base leading-8 text-[#5c6b7a] md:text-lg">
            Explore a selection of our most loved branches, each offering a unique luxury experience.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={branch.image}
                  alt={branch.name}
                  onError={(event) => {
                    if (branch.fallbackImage && event.currentTarget.src !== branch.fallbackImage) {
                      event.currentTarget.src = branch.fallbackImage;
                    }
                  }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-semibold text-[#2F4156]">
                  {branch.name}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-[#6b7b8c]">
                  <MapPin size={18} className="text-[#7ea0d6]" />
                  <span className="text-sm md:text-base">{branch.location}</span>
                </div>

                <p className="mt-4 text-sm leading-7 text-[#5c6b7a] md:text-base">
                  {branch.description}
                </p>

                
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/hotelDetails"
            className="inline-block rounded-full bg-[#2F4156] px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#7ea0d6] hover:-translate-y-1"
          >
            Explore All Branches
          </Link>
        </div>
      </div>
    </section>
  );
}
