import { useState, useEffect, useMemo, useRef } from "react";
import { validPromoCodes } from "../data/offersData";
import { useOffers } from "../Context/OffersContext";
import OfferCard from "../components/OfferCard";
import PromoSection from "../components/PromoSection";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

const categories = ["All", "Bundle", "Discount", "Package", "Seasonal"];

const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: "#FFFFFF", boxShadow: "0 2px 12px rgba(47,65,86,0.08)" }}>
    <div className="h-44" style={{ background: "#e5e7eb" }} />
    <div className="p-4 space-y-3">
      <div className="h-5 rounded w-3/4" style={{ background: "#e5e7eb" }} />
      <div className="h-3 rounded w-full" style={{ background: "#e5e7eb" }} />
      <div className="h-3 rounded w-5/6" style={{ background: "#e5e7eb" }} />
      <div className="h-8 rounded-xl mt-2" style={{ background: "#67e8f9", opacity: 0.5 }} />
      <div className="flex justify-between mt-4">
        <div className="h-8 w-20 rounded" style={{ background: "#e5e7eb" }} />
        <div className="h-8 w-24 rounded-full" style={{ background: "#67e8f9", opacity: 0.5 }} />
      </div>
    </div>
  </div>
);

const NumberTicker = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !hasStarted) setHasStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [hasStarted, target, duration]);

  return <span ref={ref} className="tabular-nums">{count.toLocaleString()}</span>;
};

const OffersPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [appliedPromo, setAppliedPromo] = useState(null);

  const { mappedOffers, loading } = useOffers();

  const visibleOffers = useMemo(() => {
    const activeOffers = mappedOffers.filter((o) => o.active);
    return selectedCategory === "All"
      ? activeOffers
      : activeOffers.filter((o) => o.category === selectedCategory);
  }, [selectedCategory, mappedOffers]);

  const handlePromoApplied = (code) => {
    if (code && validPromoCodes[code]) {
      setAppliedPromo({ code, ...validPromoCodes[code] });
    } else {
      setAppliedPromo(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
       <Navbar />
      <div className="relative pt-32 pb-12 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5"
            style={{ background: "#C8D9E6", color: "#2F4156" }}
          >
            Discover Exclusive Weekly Deals ✨
          </div>

         <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight" style={{ color: "#96d0f2" }}>
            Unbeatable<br />
            <span style={{ color: "#26567e" }}>Offers & Deals</span>
             </h1>  

          <p className="text-lg max-w-xl mx-auto mb-8" style={{ color: "#6b7280" }}>
            Discover handpicked packages, seasonal escapes, and exclusive bundles — crafted for unforgettable stays.
          </p>

          {/* Stats in sky blue boxes */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="text-center px-8 py-3 rounded-2xl" style={{ background: "#96d0f2" }}>
              <div className="text-2xl font-black" style={{ color: "#2F4156" }}>
                + <NumberTicker target={100} duration={2000} />
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#567C8D" }}>Offers Online</div>
            </div>
            <div className="text-center px-8 py-3 rounded-2xl" style={{ background: "#96d0f2" }}>
              <div className="text-2xl font-black" style={{ color: "#2F4156" }}>Up to 35%</div>
              <div className="text-xs mt-0.5" style={{ color: "#567C8D" }}>Savings</div>
            </div>
            <div className="text-center px-8 py-3 rounded-2xl" style={{ background: "#96d0f2" }}>
              <div className="text-2xl font-black" style={{ color: "#2F4156" }}>4 Active</div>
              <div className="text-xs mt-0.5" style={{ color: "#567C8D" }}>Codes</div>
            </div>
          </div>

        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 pb-20 pt-6">

        <PromoSection onPromoApplied={handlePromoApplied} />

        {/* FILTER */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <span className="text-sm mr-1 font-semibold" style={{ color: "#6b7280" }}>Filter</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
              style={{
                background: selectedCategory === cat ? "#26567e" : "#f5f9fc",
                color: selectedCategory === cat ? "#f5f9fc" : "#26567e",
                transform: selectedCategory === cat ? "scale(1.05)" : "scale(1)",
              }}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-sm" style={{ color: "#6b7280" }}>
            {visibleOffers.length} offer{visibleOffers.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {appliedPromo && (
          <div
            className="mb-6 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
            style={{ background: "#67e8f9", border: "1px solid #22d3ee" }}
          >
            <span style={{ color: "#1a1a2e", fontWeight: 700 }}>🎉 Promo Active:</span>
            <span style={{ color: "#1a1a2e" }}>{appliedPromo.label} applied to all offers below!</span>
          </div>
        )}

        {/* OFFERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : visibleOffers.length > 0 ? (
            visibleOffers.map((offer, i) => (
              <div
                key={offer.id}
                style={{
                  opacity: 0,
                  animation: `fadeSlideUp 0.5s ease forwards`,
                  animationDelay: `${i * 0.08}s`,
                  height: "100%",
                }}
              >
                <OfferCard offer={offer} appliedPromo={appliedPromo} />
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-20" style={{ color: "#6b7280" }}>
              <div className="text-5xl mb-4">🏷️</div>
              <p className="text-lg font-semibold">No offers in this category yet.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
       <Footer />
    </div>
    
  );
};

export default OffersPage;
