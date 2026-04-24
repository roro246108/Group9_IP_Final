import { getSafeRoomImage } from "../utils/roomMedia";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "./CountdownTimer";
import { useAuth } from "../Context/AuthContext";

const OfferCard = ({ offer, appliedPromo }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const finalPrice = appliedPromo
    ? (offer.discountedPrice * (1 - appliedPromo.discount / 100)).toFixed(0)
    : offer.discountedPrice;

  return (
    <div
      className="relative flex flex-col cursor-pointer"
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        boxShadow: isHovered
          ? "0 8px 24px rgba(47,65,86,0.15)"
          : "0 2px 12px rgba(47,65,86,0.08)",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        height: "100%",
        overflow: "hidden",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "180px", borderRadius: "14px 14px 0 0" }}>
        <img
          src={offer.image}
          alt={offer.title}
          onError={(e) => {
            e.currentTarget.src = getSafeRoomImage({ type: offer.type || "Standard" });
          }}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: isHovered ? "scale(1.06)" : "scale(1)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(47,65,86,0.65) 0%, transparent 55%)" }}
        />
        {/* Tag */}
        <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${offer.tagColor}`}>
          {offer.tag}
        </span>
        {/* Discount badge */}
        <div
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center font-black"
          style={{ background: "rgba(47,65,86,0.75)", color: "#FFFFFF", fontSize: "10px" }}
        >
          -{offer.discountPercent}%
        </div>
        {/* Badge */}
        <div
          className="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: "rgba(47,65,86,0.7)", color: "#FFFFFF" }}
        >
          {offer.badge}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-base mb-0.5" style={{ color: "#1a1a2e" }}>
          {offer.title}
        </h3>
        {/* Room name + branch pulled from hotels.js */}
        {offer.roomName && (
          <p className="text-xs font-semibold mb-1" style={{ color: "#567C8D" }}>
            🏨 {offer.roomName} · {offer.branch}
          </p>
        )}
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: "#6b7280" }}>
          {offer.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
          {(offer.features || []).map((f, i) => (
            <span key={i} className="text-xs" style={{ color: "#567C8D" }}>
              ✓ {f}
            </span>
          ))}
        </div>

        {/* Countdown */}
        <div className="mb-3">
          <CountdownTimer expiresAt={offer.expiresAt} />
        </div>

        {/* Price */}
        <div
          className="flex items-end justify-between pt-3"
          style={{ borderTop: "1px solid #e5e7eb" }}
        >
          <div>
            <div className="text-xs mb-0.5" style={{ color: "#6b7280" }}>Price</div>
            <span className="line-through text-xs" style={{ color: "#9ca3af" }}>
              ${offer.originalPrice}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black" style={{ color: "#1a1a2e" }}>
                ${finalPrice}
              </span>
              <span className="text-xs" style={{ color: "#6b7280" }}>/night</span>
            </div>
            {appliedPromo && (
              <span className="text-xs font-semibold" style={{ color: "#567C8D" }}>
                Extra {appliedPromo.discount}% off!
              </span>
            )}
          </div>

          {/* Book Now — navigates to booking page (login required) */}
          <button
            onClick={(e) => {
              e.stopPropagation();

              const discountedPrice = Number(finalPrice);

              // Build a room object from the offer's hotel data so BookingCheckOut works
              const room = {
                _id:       offer.roomId,
                image:     offer.image,
                price:     discountedPrice,
                originalPrice: Number(offer.originalPrice) || discountedPrice,
                discountedPrice,
                discountPercent: Number(offer.discountPercent) || 0,
                offerBadge: offer.badge,
                offerTitle: offer.title,
                roomName:  offer.roomName,
                branch:    offer.branch,
                guests:    offer.guests,
                beds:      offer.beds,
                baths:     offer.baths,
                size:      offer.size,
                rating:    offer.rating,
                amenities: offer.amenities || [],
              };

              // Guests must log in first
              if (!isAuthenticated) {
                alert("Please log in or create an account to book this offer.");
                navigate("/login", { state: { from: "/offers", pendingRoom: room } });
                return;
              }

              navigate("/booking", { state: { room } });
            }}
            className="px-8 z-30 py-2 rounded-md relative font-semibold
              after:-z-20 after:absolute after:h-1 after:w-1 after:bg-blue-400 after:left-5
              overflow-hidden after:bottom-0 after:translate-y-full after:rounded-md
              after:hover:scale-[300] after:hover:transition-all after:hover:duration-700
              after:transition-all after:duration-700 transition-all duration-700 text-sm"
            style={{
              background: "#b9d3ea",
              color: "#1a1a2e",
            }}
          >
            <span className="relative z-10">Book Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
