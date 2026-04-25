import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import MainBackground from "../assets/Images/home_video.mp4";
import hotels from "../data/hotels";

export default function HomeMainSection() {
  const navigate = useNavigate();

  const [branch, setBranch] = useState("Cairo Branch");
  const [roomType, setRoomType] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [loading, setLoading] = useState(false);
  const roomTypes = [...new Set(hotels.map((room) => room.type))].sort();

  const isPastDate = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const chosenDate = new Date(dateString);
    chosenDate.setHours(0, 0, 0, 0);

    return chosenDate < today;
  };

  const handleSearch = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    if (isPastDate(checkIn) || isPastDate(checkOut)) {
      alert("You cannot search using past dates.");
      return;
    }

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    if (outDate <= inDate) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    try {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:5050/api/bookings/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            branch,
            roomType,
            checkIn,
            checkOut,
            guests: Number(guests),
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const message =
            response.status === 409
              ? "This room is already reserved for these dates."
              : data.message || "No rooms available matching your criteria.";
          alert(message);
          return;
        }
      } catch {
        console.warn("Booking search API is unavailable. Falling back to local room search.");
      }

      navigate("/hotels", {
        state: {
          branch,
          roomType,
          checkIn,
          checkOut,
          guests: Number(guests),
        },
      });
    } catch (error) {
      console.error("Search error:", error);
      navigate("/hotels", {
        state: {
          branch,
          roomType,
          checkIn,
          checkOut,
          guests: Number(guests),
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative min-h-[92vh] w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={MainBackground} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 flex min-h-[92vh] flex-col items-center justify-start px-6 pt-44 text-center md:pt-48">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-[#dbe4f0] md:text-sm">
            Welcome to Blue Waves Hotel
          </p>

          <h1 className="max-w-5xl text-5xl font-semibold leading-[1.08] text-white md:text-7xl lg:text-[72px]">
            Experience Comfort Like Never Before
          </h1>

          <p className="mt-8 max-w-3xl text-base leading-8 text-white/90 md:text-[20px]">
            Book premium stays, exclusive offers, and unforgettable experiences
            in our finest destinations.
          </p>
        </div>

        <div className="absolute -bottom-6 left-0 z-10 w-full overflow-hidden leading-none md:-bottom-8">
          <svg
            viewBox="0 0 1440 220"
            className="block h-[120px] w-full md:h-[160px]"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              d="M0,105 C240,55 470,45 720,105 C980,170 1180,160 1440,70 L1440,220 L0,220 Z"
            />
          </svg>
        </div>
      </div>

      <div className="relative z-20 mx-auto -mt-16 flex w-full justify-center px-6 pb-10 md:-mt-20 md:pb-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Link
            to="/hotelDetails"
            className="rounded-full bg-[#7ea0d6] px-9 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(47,65,86,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#2f6fb3]"
          >
            Explore Hotels
          </Link>

          <Link
            to="/offers"
            className="rounded-full border border-[#2F4156] bg-white px-9 py-3 text-sm font-semibold text-[#2F4156] shadow-[0_10px_24px_rgba(47,65,86,0.08)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#2F4156] hover:text-white"
          >
            View Offers
          </Link>
        </div>
      </div>

      <div className="relative z-20 mx-auto mt-4 w-full max-w-7xl px-6 pb-12 md:mt-6 md:pb-16">
        <div className="rounded-[22px] bg-[#bfd1e0] p-4 md:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
            <div className="xl:col-span-1">
              <label className="mb-2 block text-sm font-semibold text-[#2F4156]">
                Branch
              </label>
              <div className="relative">
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full appearance-none rounded-2xl bg-white px-4 py-3 pr-12 text-[#2F4156] outline-none"
                >
                  <option>Cairo Branch</option>
                  <option>Alexandria Branch</option>
                  <option>Marsa Alam Branch</option>
                  <option>Sharm El Sheikh Branch</option>
                  <option>Ain El Sokhna Branch</option>
                </select>
                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#2F4156]"
                />
              </div>
            </div>

            <div className="xl:col-span-1">
              <label className="mb-2 block text-sm font-semibold text-[#2F4156]">
                Room Type
              </label>
              <div className="relative">
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full appearance-none rounded-2xl bg-white px-4 py-3 pr-12 text-[#2F4156] outline-none"
                >
                  <option value="">Any Room Type</option>
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#2F4156]"
                />
              </div>
            </div>

            <div className="xl:col-span-1">
              <label className="mb-2 block text-sm font-semibold text-[#2F4156]">
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full rounded-2xl bg-white px-4 py-3 text-[#2F4156] outline-none"
              />
            </div>

            <div className="xl:col-span-1">
              <label className="mb-2 block text-sm font-semibold text-[#2F4156]">
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full rounded-2xl bg-white px-4 py-3 text-[#2F4156] outline-none"
              />
            </div>

            <div className="xl:col-span-1">
              <label className="mb-2 block text-sm font-semibold text-[#2F4156]">
                Guests
              </label>
              <div className="relative">
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full appearance-none rounded-2xl bg-white px-4 py-3 pr-12 text-[#2F4156] outline-none"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                </select>
                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#2F4156]"
                />
              </div>
            </div>

            <div className="xl:col-span-1">
              <label className="mb-2 block text-sm font-semibold opacity-0">
                Search
              </label>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full rounded-2xl bg-[#2F4156] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#7ea0d6] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Searching..." : "Search Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
