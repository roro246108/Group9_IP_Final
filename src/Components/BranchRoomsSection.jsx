import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { getSafeRoomImage } from "../utils/roomMedia";

export default function BranchRoomsSection({ rooms = [] }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = React.useState(false);
  const [roomToBook, setRoomToBook] = React.useState(null);

  const handleBookRoom = (room) => {
    if (!isAuthenticated) {
      setRoomToBook(room);
      setShowLoginPrompt(true);
      return;
    }

    navigate("/booking", {
      state: { room },
    });
  };

  const handleGoToLogin = () => {
    setShowLoginPrompt(false);

    navigate("/login", {
      state: {
        from: {
          pathname: "/booking",
          state: { room: roomToBook },
        },
      },
    });
  };

  return (
    <section className="bg-[#edf7ff] py-16">
      <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-12">
        <div className="mb-12">
          <h2 className="mb-4 font-serif text-4xl leading-tight text-[#0b2b6f] md:text-5xl">
            Accommodations
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-[#5f6f8c] md:text-base">
            Choose from our carefully curated selection of rooms and suites,
            each designed for ultimate comfort and elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room, index) => (
            <div
              key={room.id || index}
              className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
            >
              <div className="relative overflow-hidden">
                <img
                  src={getSafeRoomImage(room)}
                  onError={(e) => {
                    e.currentTarget.src = getSafeRoomImage({ type: room.type });
                  }}
                  alt={room.roomName}
                  className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <span className="absolute bottom-3 right-3 z-10 rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow">
                  ${room.price}/night
                </span>
              </div>

              <div className="p-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-serif text-2xl text-[#0b1f44]">
                    {room.roomName}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {room.guests} Guests
                  </span>
                </div>

                <p className="mb-4 text-sm leading-6 text-gray-600">
                  {room.cardDescription || room.roomName}
                </p>

                <div className="mb-5 flex flex-wrap gap-2">
                  {(room.amenities || []).slice(0, 3).map((feature, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-[#f3f4f6] px-3 py-1 text-xs text-gray-600"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleBookRoom(room)}
                  className="group/button w-full rounded-xl bg-[#d9ecff] py-3 font-medium text-[#071d49] transition-all duration-300 hover:bg-[#0b2b6f] hover:text-white hover:shadow-lg"
                >
                  <span className="inline-flex items-center transition-transform duration-300 group-hover/button:translate-x-2">
                    Book Room
                    <span className="ml-2 transition-transform duration-300 group-hover/button:translate-x-1">
                      →
                    </span>
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showLoginPrompt && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-2xl font-semibold text-[#0b2b6f]">
              Login required
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              You have to log in first before booking this room.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleGoToLogin}
                className="flex-1 rounded-xl bg-[#0b2b6f] px-4 py-3 font-semibold text-white transition hover:bg-[#163f8f]"
              >
                OK
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowLoginPrompt(false);
                  setRoomToBook(null);
                }}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
