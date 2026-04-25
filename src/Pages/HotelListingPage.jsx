import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles, Heart } from "lucide-react";
import Navbar from "../Components/Navbar";
import SearchBar from "../Components/SearchBar";
import FilterSidebar from "../Components/FilterSidebar";
import HotelCard from "../Components/HotelCard";
import Footer from "../Components/Footer";
import { apiGet, apiPost } from "../services/apiClient";
import { getSafeRoomImage, normalizeRoomRecord } from "../utils/roomMedia";
import { useFavorites } from "../Context/FavoritesContext";
import { getFallbackRooms } from "../utils/catalogFallbacks";
import Background1 from "../assets/Images/Background.jpg";
import Background2 from "../assets/Images/Background2.jpg";
import Background3 from "../assets/Images/Backgroud3.jpg";
import Background4 from "../assets/Images/Background4.jpg";
import Background5 from "../assets/Images/Background 5.jpg";

const DEFAULT_BRANCH_OPTIONS = [
  "Cairo Branch",
  "Alexandria Branch",
  "Marsa Alam Branch",
  "Sharm El Sheikh Branch",
  "Ain El Sokhna Branch",
];

const DEFAULT_ROOM_TYPE_OPTIONS = ["Standard", "Deluxe", "Suite", "Penthouse"];

export default function HotelListingPage() {
  const location = useLocation();
  const initialState = location.state || {};
  const initialBranch = initialState.branch || "";
  const initialCheckIn = initialState.checkIn || "";
  const initialCheckOut = initialState.checkOut || "";
  const initialGuests = initialState.guests || "";
  const initialRoomType = initialState.roomType || "";
  const scrollRef = useRef(null);
  const availableRoomsRef = useRef(null);
  const { favoriteCount } = useFavorites();

  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animateText, setAnimateText] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [searchPopup, setSearchPopup] = useState({
    open: false,
    title: "",
    message: "",
  });

  const normalizeGuests = (value) => {
    if (!value) return "";
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? "" : parsed;
  };

  const [filters, setFilters] = useState({
    destination: initialBranch,
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
    guests: normalizeGuests(initialGuests) || "",
    maxPrice: 1000,
    roomType: initialRoomType,
    type: "",
    branch: initialBranch,
    rating: "",
    sortBy: "popularity",
  });

  const heroImages = [
    Background1,
    Background2,
    Background3,
    Background4,
    Background5,
  ];

  const heroContent = [
    {
      badge: "Blue Wave Escape",
      title: "Stay somewhere that feels unforgettable",
      text: "Browse elegant rooms, ocean escapes, and premium suites across our branches.",
    },
    {
      badge: "Luxury Collection",
      title: "Handpicked rooms for every kind of traveler",
      text: "Find modern comfort, stylish interiors, and memorable views in one place.",
    },
    {
      badge: "Exclusive Offers",
      title: "Your next premium stay starts here",
      text: "Search by city, price, and room type to discover the ideal room faster.",
    },
    {
      badge: "Signature Experience",
      title: "Designed for comfort, chosen for elegance",
      text: "From standard rooms to premium suites, enjoy a smoother booking experience.",
    },
    {
      badge: "Blue Wave Hotel",
      title: "Relax, search, and book with confidence",
      text: "Explore our best rooms with smart filters and featured stays.",
    },
  ];

  const fetchAllRooms = async () => {
    try {
      const data = await apiGet("/rooms");
      const normalizedRooms = Array.isArray(data) && data.length > 0
        ? data.map(normalizeRoomRecord)
        : getFallbackRooms();
      setAllRooms(normalizedRooms);
      return normalizedRooms;
    } catch (error) {
      console.error("Failed to fetch rooms:", error.message);
      const fallbackRooms = getFallbackRooms();
      setAllRooms(fallbackRooms);
      return fallbackRooms;
    }
  };

  useEffect(() => {
    const loadInitialRooms = async () => {
      try {
        setLoading(true);
        const databaseRooms = await fetchAllRooms();

        if (
          initialBranch &&
          initialCheckIn &&
          initialCheckOut &&
          initialGuests
        ) {
          try {
            const data = await apiPost("/bookings/search", {
              branch: initialBranch,
              roomType: initialRoomType || "",
              checkIn: initialCheckIn,
              checkOut: initialCheckOut,
              guests: Number(initialGuests),
            });
            setRooms((data.rooms || []).map(normalizeRoomRecord));
          } catch {
            setRooms(databaseRooms.filter((room) => {
              const branchMatch = !initialBranch || room.branch === initialBranch;
              const typeMatch = !initialRoomType || room.type === initialRoomType;
              const guestsMatch = !initialGuests || room.guests >= Number(initialGuests);
              return branchMatch && typeMatch && guestsMatch;
            }));
          }
          return;
        }

        setRooms(databaseRooms);
      } catch (error) {
        console.error("Failed to load searched rooms:", error.message);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialRooms();
  }, [initialBranch, initialCheckIn, initialCheckOut, initialGuests, initialRoomType]);

  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setAnimateText(false);

      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        setAnimateText(true);
      }, 180);
    }, 5000);

    return () => clearInterval(sliderInterval);
  }, [heroImages.length]);

  const scrollToAvailableRooms = () => {
    window.setTimeout(() => {
      availableRoomsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  };

  const handleSearchClick = async (values) => {
    const updatedFilters = {
      ...filters,
      destination: values.branch || "",
      branch: values.branch || "",
      roomType: values.roomType || "",
      type: values.roomType || "",
      checkIn: values.checkIn || "",
      checkOut: values.checkOut || "",
      guests: normalizeGuests(values.guests) || "",
    };

    try {
      setLoading(true);

      try {
        const data = await apiPost("/bookings/search", {
          branch: values.branch,
          roomType: values.roomType || "",
          checkIn: values.checkIn,
          checkOut: values.checkOut,
          guests: Number(values.guests),
        });

        setFilters(updatedFilters);
        setRooms((data.rooms || []).map(normalizeRoomRecord));
        scrollToAvailableRooms();
      } catch {
        const localResults = (allRooms.length > 0 ? allRooms : getFallbackRooms()).filter((room) => {
          const branchMatch = !values.branch || room.branch === values.branch;
          const typeMatch = !values.roomType || room.type === values.roomType;
          const guestsMatch = !values.guests || room.guests >= Number(values.guests);
          return branchMatch && typeMatch && guestsMatch && room.available;
        });

        setFilters(updatedFilters);
        setRooms(localResults);
        scrollToAvailableRooms();
      }
    } catch (error) {
      console.error("Search failed:", error.message);
      setFilters(updatedFilters);
      setRooms((allRooms.length > 0 ? allRooms : getFallbackRooms()).filter((room) => {
        const branchMatch = !values.branch || room.branch === values.branch;
        const typeMatch = !values.roomType || room.type === values.roomType;
        const guestsMatch = !values.guests || room.guests >= Number(values.guests);
        return branchMatch && typeMatch && guestsMatch && room.available;
      }));
      scrollToAvailableRooms();
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters((prev) => ({
      destination: "",
      checkIn: prev.checkIn,
      checkOut: prev.checkOut,
      guests: prev.guests,
      maxPrice: 1000,
      roomType: "",
      type: "",
      branch: "",
      rating: "",
      sortBy: "popularity",
    }));
    if (allRooms.length > 0) {
      setRooms(allRooms);
    } else {
      setLoading(true);
      fetchAllRooms()
        .then((databaseRooms) => setRooms(databaseRooms))
        .finally(() => setLoading(false));
    }
  };

  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    result = result.filter((room) => room.available);

    if (filters.destination.trim()) {
      const keyword = filters.destination.toLowerCase();

      result = result.filter(
        (room) =>
          room.hotelName?.toLowerCase().includes(keyword) ||
          room.branch?.toLowerCase().includes(keyword) ||
          room.city?.toLowerCase().includes(keyword) ||
          room.location?.toLowerCase().includes(keyword) ||
          room.roomName?.toLowerCase().includes(keyword) ||
          room.type?.toLowerCase().includes(keyword)
      );
    }

    result = result.filter((room) => room.price <= filters.maxPrice);

    if (filters.type) {
      result = result.filter((room) => room.type === filters.type);
    }

    if (filters.branch) {
      result = result.filter((room) => room.branch === filters.branch);
    }

    if (filters.rating) {
      result = result.filter((room) => room.rating >= Number(filters.rating));
    }

    if (filters.guests) {
      const guestNumber = parseInt(filters.guests, 10);
      if (!Number.isNaN(guestNumber)) {
        result = result.filter((room) => room.guests >= guestNumber);
      }
    }

    if (filters.sortBy === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "high-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === "rating" || filters.sortBy === "popularity") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [rooms, filters]);

  const featuredRooms = useMemo(() => {
    const databaseFeaturedRooms = allRooms.filter((room) => room.featured);
    const sourceRooms =
      databaseFeaturedRooms.length > 0
        ? databaseFeaturedRooms
        : [...allRooms].sort((a, b) => b.rating - a.rating);

    return sourceRooms.slice(0, 5);
  }, [allRooms]);

  const branchOptions = useMemo(
    () =>
      [
        ...new Set([
          ...DEFAULT_BRANCH_OPTIONS,
          ...allRooms.map((room) => room.branch).filter(Boolean),
        ]),
      ].sort(),
    [allRooms]
  );

  const typeOptions = useMemo(
    () =>
      [
        ...new Set([
          ...DEFAULT_ROOM_TYPE_OPTIONS,
          ...allRooms.map((room) => room.type).filter(Boolean),
        ]),
      ].sort(),
    [allRooms]
  );

  const uniqueBranchesCount = useMemo(() => {
    return new Set(allRooms.map((room) => room.branch).filter(Boolean)).size;
  }, [allRooms]);

  const currentHero = heroContent[currentSlide];

  const scrollFeatured = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -380 : 380,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-[#f7fafd] pt-28">
      <Navbar />

      {searchPopup.open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#223a5e]">{searchPopup.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{searchPopup.message}</p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setSearchPopup({
                    open: false,
                    title: "",
                    message: "",
                  })
                }
                className="rounded-2xl bg-[#2f6fb3] px-5 py-3 font-semibold text-white transition hover:bg-[#24588f]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="relative px-4 md:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] shadow-2xl">
          <div className="relative h-[540px] md:h-[620px]">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
                  index === currentSlide ? "scale-100 opacity-100" : "scale-105 opacity-0"
                }`}
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172acc] via-[#0f172a66] to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            <div className="relative z-10 flex h-full items-center">
              <div className="max-w-2xl px-6 md:px-10">
                <div
                  className={`transition-all duration-500 ${
                    animateText ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                >
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md">
                    <Sparkles size={16} />
                    {currentHero.badge}
                  </div>

                  <h1 className="max-w-xl text-4xl font-semibold leading-tight text-white md:text-6xl">
                    {currentHero.title}
                  </h1>

                  <p className="mt-5 max-w-lg text-base leading-8 text-white/85 md:text-lg">
                    {currentHero.text}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      to="/offers"
                      className="rounded-full bg-white px-6 py-3 font-semibold text-[#244a86] transition hover:-translate-y-1 hover:bg-[#eaf2ff]"
                    >
                      Explore Offers
                    </Link>

                    <Link
                      to="/favorites"
                      className="rounded-full border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/20"
                    >
                      Saved Rooms ({favoriteCount})
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-24 left-6 z-20 flex items-center gap-3 md:left-10">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setAnimateText(false);
                    setTimeout(() => {
                      setCurrentSlide(index);
                      setAnimateText(true);
                    }, 120);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "h-2.5 w-10 bg-white"
                      : "h-2.5 w-2.5 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-30 mx-auto -mt-14 max-w-6xl px-2">
          <div className="rounded-[32px] border border-white/70 bg-white/95 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl md:p-5">
            <SearchBar
              filters={{
                branch: filters.branch,
                roomType: filters.roomType,
                checkIn: filters.checkIn,
                checkOut: filters.checkOut,
                guests: filters.guests,
                maxPrice: filters.maxPrice,
              }}
              onSearchClick={handleSearchClick}
              resultCount={filteredRooms.length}
              branchOptions={branchOptions}
              roomTypeOptions={typeOptions}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10 md:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-[#e6eef7] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <p className="text-sm font-medium text-[#5b7aa3]">Available Branches</p>
            <h3 className="mt-2 text-4xl font-bold text-[#223a5e]">{uniqueBranchesCount}</h3>
            <p className="mt-2 text-sm text-slate-500">
              Discover different locations and room styles.
            </p>
          </div>

          <div className="rounded-3xl border border-[#e6eef7] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <p className="text-sm font-medium text-[#5b7aa3]">Featured Rooms</p>
            <h3 className="mt-2 text-4xl font-bold text-[#223a5e]">{featuredRooms.length}</h3>
            <p className="mt-2 text-sm text-slate-500">
              Handpicked premium rooms for a better stay.
            </p>
          </div>

          <div className="rounded-3xl border border-[#e6eef7] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <p className="text-sm font-medium text-[#5b7aa3]">Saved Favorites</p>
            <h3 className="mt-2 text-4xl font-bold text-[#223a5e]">{favoriteCount}</h3>
            <p className="mt-2 text-sm text-slate-500">
              Keep your preferred rooms in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2f6fb3]">
              Featured Stays
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#223a5e]">Premium Blue Wave Rooms</h2>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => scrollFeatured("left")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dbe4f0] bg-white text-[#223a5e] shadow-sm transition hover:-translate-y-1 hover:bg-[#eef4fb]"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollFeatured("right")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dbe4f0] bg-white text-[#223a5e] shadow-sm transition hover:-translate-y-1 hover:bg-[#eef4fb]"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [-ms-overflow-style:none]"
        >
          {featuredRooms.map((room) => (
            <Link
              key={room._id}
              to="/booking"
              state={{ selectedRoom: room }}
              className="group relative block min-h-[360px] min-w-[320px] flex-shrink-0 overflow-hidden rounded-3xl md:min-w-[360px]"
            >
              <img
                src={getSafeRoomImage(room)}
                alt={room.roomName}
                onError={(e) => {
                  e.currentTarget.src = getSafeRoomImage({ type: room.type });
                }}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
              <div className="absolute bottom-0 p-6 text-white">
                <p className="text-sm text-[#cfe2ff]">{room.branch}</p>
                <h3 className="mt-1 text-2xl font-bold">{room.roomName}</h3>
                <p className="mt-2 text-slate-200">{room.location}</p>
                <p className="mt-3 text-lg font-semibold">${room.price} / night</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        ref={availableRoomsRef}
        className="mx-auto max-w-7xl scroll-mt-32 px-4 pb-16 md:px-6 lg:px-8"
      >
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-4xl font-bold text-[#223a5e]">Available Rooms</h2>
            <p className="mt-2 text-sm text-[#8A99A8]">
              {filteredRooms.length} rooms found across Blue Wave branches
            </p>
          </div>

          <Link
            to="/favorites"
            className="inline-flex items-center gap-2 rounded-2xl border border-[#dbe4f0] bg-white px-5 py-3 font-medium text-[#223a5e] shadow-sm transition hover:bg-[#eef4fb]"
          >
            <Heart size={18} className="fill-red-500 text-red-500" />
            Favorites ({favoriteCount})
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
            branchOptions={branchOptions}
            typeOptions={typeOptions}
          />

          <div>
            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-[420px] animate-pulse rounded-3xl bg-white shadow-md"
                  />
                ))}
              </div>
            ) : filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {filteredRooms.map((room) => (
                  <HotelCard key={room._id || room.id} hotel={room} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-12 text-center shadow-md">
                <h3 className="text-2xl font-bold text-[#223a5e]">No rooms found</h3>
                <p className="mt-2 text-slate-500">Try changing your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
