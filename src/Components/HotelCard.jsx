import { Heart, MapPin, Star, Users, BedDouble, Bath } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../Context/AuthContext";
import { useFavorites } from "../Context/FavoritesContext";
import { getSafeRoomImage } from "../utils/roomMedia";

export default function HotelCard({ hotel, onFavoriteToggle }) {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favoriteActive = isFavorite(hotel._id);

  const handleFavoriteClick = async () => {
    if (!token || !isAuthenticated) {
      alert("Please login first to add favorites.");
      navigate("/login");
      return;
    }

    try {
      const action = await toggleFavorite(hotel);
      onFavoriteToggle?.(action, hotel);
    } catch (error) {
      console.error("Favorite error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden">
       <img
  src={getSafeRoomImage(hotel)}
  onError={(e) => {
    e.currentTarget.src = getSafeRoomImage({ type: hotel.type });
  }}
  alt={hotel.roomName}
  className="w-full h-[260px] object-cover rounded-t-3xl transition duration-500 group-hover:scale-105"
/>

        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
            hotel.available
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {hotel.available ? "Available" : "Booked"}
        </span>

        <button
          onClick={handleFavoriteClick}
          className="absolute right-4 top-4 rounded-full bg-white/90 p-2 shadow transition hover:scale-110"
        >
          <Heart
            size={18}
            className={
              favoriteActive ? "fill-red-500 text-red-500" : "text-slate-600"
            }
          />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#2f6fb3]">{hotel.branch}</p>
            <h3 className="text-xl font-bold text-[#223a5e]">
              {hotel.roomName}
            </h3>
          </div>

          <div className="flex items-center gap-1 font-semibold text-amber-500">
            <Star size={16} className="fill-amber-400" />
            {hotel.rating}
          </div>
        </div>

        <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
          <MapPin size={16} />
          {hotel.location}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(hotel.amenities || []).map((item, index) => (
            <span
              key={index}
              className="rounded-full bg-[#eff5fc] px-3 py-1 text-xs text-[#2f6fb3]"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <BedDouble size={16} />
            {hotel.beds} Beds
          </span>
          <span className="flex items-center gap-1">
            <Bath size={16} />
            {hotel.baths} Baths
          </span>
          <span className="flex items-center gap-1">
            <Users size={16} />
            {hotel.guests} Guests
          </span>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-[#223a5e]">
              ${hotel.price}
              <span className="text-sm font-normal text-slate-500">
                {" "}
                / night
              </span>
            </p>
          </div>

          <Link
            to="/booking"
            state={{ room: hotel }}
            className="rounded-2xl bg-[#2f6fb3] px-5 py-3 font-medium text-white transition hover:bg-[#24588f]"
          >
            Booking Now
          </Link>
        </div>
      </div>
    </div>
  );
}
