import Navbar from "../Components/Navbar";
import PaymentForm from "../Components/PaymentForm";
import RoomDetails from "../Components/RoomDetails";
import BookingCard from "../Components/BookingCard";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import { calculateNights, calculateTotal } from "../hooks/useBookingpayment";
import { apiGet } from "../services/apiClient";
import { normalizeRoomRecord } from "../utils/roomMedia";

function mergeOfferIntoRoom(baseRoom = {}, sourceRoom = {}) {
  const normalizedBase = normalizeRoomRecord(baseRoom);
  const offerPrice = Number(sourceRoom?.discountedPrice || sourceRoom?.price);
  const originalPrice = Number(sourceRoom?.originalPrice);

  if (!offerPrice || !originalPrice || offerPrice >= originalPrice) {
    return normalizedBase;
  }

  return {
    ...normalizedBase,
    price: offerPrice,
    discountedPrice: offerPrice,
    originalPrice,
    discountPercent: Number(sourceRoom?.discountPercent) || 0,
    offerBadge: sourceRoom?.offerBadge || "",
    offerTitle: sourceRoom?.offerTitle || "",
  };
}

function getAvailabilityMessage(error) {
  const reason = error?.response?.data?.reason;
  const message = error?.response?.data?.message;

  const fallbackMessages = {
    room_not_found: message || "We could not find this room in the database.",
    room_reserved:
      message || "This room is already reserved for the selected dates.",
    room_manually_blocked:
      message || "This room is blocked in the room calendar for those dates.",
  };

  if (reason && fallbackMessages[reason]) {
    return fallbackMessages[reason];
  }

  return message || "Error checking availability. Please try again.";
}

export default function RoomBooking() {
  const location = useLocation();
  const roomFromNavigation = location.state?.room || location.state?.selectedRoom;

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [nights, setNights] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [roomLoading, setRoomLoading] = useState(false);
  const [availabilityNotice, setAvailabilityNotice] = useState({
    open: false,
    title: "",
    message: "",
  });
  const [room, setRoom] = useState(
    roomFromNavigation ? normalizeRoomRecord(roomFromNavigation) : null
  );

  const roomId = useMemo(
    () => roomFromNavigation?._id || roomFromNavigation?.id,
    [roomFromNavigation]
  );

  useEffect(() => {
    if (!roomFromNavigation) {
      setRoom(null);
      return;
    }

    setRoom(mergeOfferIntoRoom(roomFromNavigation, roomFromNavigation));
  }, [roomFromNavigation]);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId) return;

      try {
        setRoomLoading(true);
        const latestRoom = await apiGet(`/rooms/${roomId}`);
        setRoom(mergeOfferIntoRoom(latestRoom, roomFromNavigation));
      } catch (error) {
        console.error("Failed to load room details:", error.message);
      } finally {
        setRoomLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId, roomFromNavigation]);

  if (!room && roomLoading) {
    return <p className="mt-40 text-center text-xl">Loading room details...</p>;
  }

  if (!room) {
    return <p className="mt-40 text-center text-xl">No room selected</p>;
  }

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select both dates.");
      return;
    }

    const calculatedNights = calculateNights(checkIn, checkOut);

    if (calculatedNights <= 0) {
      alert("Check-out must be after check-in.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/bookings/search", {
        roomId: room._id || room.id,
        branch: room.branch || room.city,
        roomName: room.roomName,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests: room.guests || 1,
      });

      if (response.data.available) {
        const calculatedTotal = calculateTotal(calculatedNights, room.price);
        setNights(calculatedNights);
        setTotal(calculatedTotal);
        setAvailabilityNotice({
          open: true,
          title: "Room Available",
          message: `This room is available for ${calculatedNights} nights.`,
        });
      }
    } catch (error) {
      setAvailabilityNotice({
        open: true,
        title: "Room Unavailable",
        message: getAvailabilityMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex w-full justify-center pt-40">
        <div className="grid w-full max-w-7xl gap-10 px-10 lg:grid-cols-2">
          <div className="space-y-6">
            <RoomDetails room={room} />

            <BookingCard
              checkIn={checkIn}
              checkOut={checkOut}
              setCheckIn={setCheckIn}
              setCheckOut={setCheckOut}
              onCheckAvailability={handleCheckAvailability}
              isLoading={loading}
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="mt-2 flex items-center gap-3">
                <span className="rounded-full bg-[#1e3a8a] px-3 py-1 text-sm text-white">
                  {room.type}
                </span>

                {room.discountPercent > 0 && (
                  <span className="rounded-full bg-[#dbeafe] px-3 py-1 text-sm text-[#1e3a8a]">
                    -{room.discountPercent}% offer
                  </span>
                )}

                <span className="text-yellow-500">* {room.rating}</span>

                <span className="text-sm text-gray-500">
                  ({Math.floor(room.rating * 30)} reviews)
                </span>
              </div>

              <h2 className="text-3xl font-semibold">{room.roomName}</h2>

              <p className="mt-3 text-gray-600">
                {room.description ||
                  `${room.type} room in ${room.city} with capacity for ${room.guests} guests.`}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 text-gray-600">
                {(room.amenities || []).map((item, index) => (
                  <p key={`${item}-${index}`}>- {item}</p>
                ))}
              </div>
            </div>

            <PaymentForm
              room={room}
              nights={nights}
              total={total}
              checkIn={checkIn}
              checkOut={checkOut}
            />
          </div>
        </div>
      </div>

      {availabilityNotice.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#1e3a8a]">
                {availabilityNotice.title}
              </h3>
              <button
                type="button"
                onClick={() =>
                  setAvailabilityNotice({ open: false, title: "", message: "" })
                }
                className="rounded-full px-2 py-1 text-2xl leading-none text-gray-400 hover:text-gray-700"
                aria-label="Close availability message"
              >
                &times;
              </button>
            </div>
            <p className="text-sm leading-6 text-gray-700">
              {availabilityNotice.message}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setAvailabilityNotice({ open: false, title: "", message: "" })
                }
                className="rounded-xl bg-[#1e3a8a] px-5 py-2.5 text-sm font-semibold text-white"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

