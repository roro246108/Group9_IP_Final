import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useOffers } from "../Context/OffersContext";

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-3xl bg-[#EEF4FB] shadow-sm animate-pulse">
    <div className="h-64 bg-slate-200" />
    <div className="p-6 space-y-3">
      <div className="h-8 w-3/4 rounded bg-slate-200" />
      <div className="h-4 w-full rounded bg-slate-200" />
      <div className="h-4 w-5/6 rounded bg-slate-200" />
    </div>
  </div>
);

export default function SpecialOffersPreview() {
  const { mappedOffers, loading } = useOffers();

  const featuredOffers = useMemo(
    () => mappedOffers.filter((offer) => offer.active).slice(0, 3),
    [mappedOffers]
  );

  return (
    <section className="bg-white px-6 py-20 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7ea0d6]">
            Exclusive Offers
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-[#2F4156] md:text-5xl">
            Offers Worth Discovering
          </h2>
          <p className="mt-5 text-base leading-8 text-[#5c6b7a] md:text-lg">
            Explore exclusive deals inspired by our most luxurious rooms and
            standout branch experiences.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
          ) : featuredOffers.length > 0 ? (
            featuredOffers.map((offer) => (
              <div
                key={offer.id}
                className="group overflow-hidden rounded-3xl bg-[#EEF4FB] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute right-4 top-4 rounded-full bg-[#2f6fb3] px-4 py-2 text-sm font-semibold text-white shadow-md">
                    -{offer.discountPercent}%
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-[#2F4156]">
                    {offer.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-[#5c6b7a] md:text-base">
                    {offer.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-3xl bg-[#EEF4FB] p-10 text-center text-[#5c6b7a] shadow-sm">
              No offers available right now.
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/offers"
            className="inline-block rounded-full bg-[#2F4156] px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#7ea0d6]"
          >
            View All Offers
          </Link>
        </div>
      </div>
    </section>
  );
}
