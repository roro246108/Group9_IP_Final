import { Link } from "react-router-dom";
import suiteAlex from "/Images/Suite.jpg";
import suiteCairo from "/Images/Suite3.jpg";
import penthouseSharm from "/Images/Penthouse4.jpg";
import hotels from "../data/hotels";

const featuredRooms = hotels.filter((r) => r.featured).slice(0, 3);

export default function RoomTypesPreview() {
  return (
    <section className="bg-[#F8FAFC] px-6 py-20 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7ea0d6]">
            Room Types
          </p>

          <h2 className="mt-4 text-3xl font-semibold text-[#2F4156] md:text-5xl">
            Discover Your Perfect Stay
          </h2>

          <p className="mt-5 text-base leading-8 text-[#5c6b7a] md:text-lg">
            Explore a selection of our real room categories, designed for
            comfort, elegance, and memorable moments.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {featuredRooms.map((room) => (
            <div
              key={room.id}
              className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.roomName}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#2F4156] shadow-md">
                  ${room.price}/night
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-semibold text-[#2F4156]">
                  {room.roomName}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#5c6b7a] md:text-base">
                  {room.branch} · {room.guests} guests · {room.beds} bed{room.beds > 1 ? "s" : ""} · {room.size} sq ft
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {room.amenities.slice(0, 3).map((a) => (
                    <span key={a} className="rounded-full bg-[#f0f4f8] px-3 py-1 text-xs text-[#5c6b7a]">{a}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/hotels"
            className="inline-block rounded-full bg-[#2F4156] px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#7ea0d6]"
          >
            View All Rooms
          </Link>
        </div>
      </div>
    </section>
  );
}