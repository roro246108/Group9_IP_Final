import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import visaimg from "../assets/Images/visa4.png";
import img from "../assets/Images/PaymentFormPage.jpg";
import { createBooking } from "../services/bookingsApi";

export default function PaymentPage({ room: propsRoom, nights: propsNights, total: propsTotal }) {
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("token");
    console.log("Token Debug:", {
      localStorage: localToken ? "✓ Found" : "✗ Not found",
      sessionStorage: sessionToken ? "✓ Found" : "✗ Not found",
      localToken: localToken?.substring(0, 20) + "...",
      sessionToken: sessionToken?.substring(0, 20) + "...",
    });
  }, []);

  const location = useLocation();
  const locationState = location.state || {};
  const pendingBooking = (() => {
    try {
      const raw = sessionStorage.getItem("pendingBooking");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();
  
  const room = locationState.room || pendingBooking.room || propsRoom || null;
  const nights = locationState.nights || pendingBooking.nights || propsNights || 0;
  const total = locationState.total || pendingBooking.total || propsTotal || 0;
  const checkIn = locationState.checkIn || pendingBooking.checkIn || "";
  const checkOut = locationState.checkOut || pendingBooking.checkOut || "";
  const branch = locationState.branch || pendingBooking.branch || room?.branch || "";
  const guests = locationState.guests || pendingBooking.guests || room?.guests || 1;

  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  
  const handleCardNumber = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(value);
    if (value.length > 0 && value.length < 16) {
      setError("Card number must be exactly 16 digits.");
    } else {
      setError("");
    }
  };

  const handleName = (e) => {
    const value = e.target.value;
    setName(value);
    if (/[^a-zA-Z\s]/.test(value)) setError("Name must contain letters only.");
    else setError("");
  };

  const handlePhone = (e) => {
    const rawValue = e.target.value;
    const value = rawValue.replace(/\D/g, "").slice(0, 11);
    setPhone(value);
    if (rawValue.replace(/\D/g, "").length > 11) {
      setPhoneError("Phone number must not exceed 11 digits.");
    } else {
      setPhoneError("");
    }
  };

  const handleExpiry = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2, 4);
    setExpiry(value);
  };

  const handleCVV = (e) => {
    const rawValue = e.target.value;
    const value = rawValue.replace(/\D/g, "").slice(0, 3);
    setCvv(value);
    if (/[^0-9]/.test(rawValue)) setError("CVV must contain numbers only.");
    else if (rawValue.length > 3) setError("CVV must be exactly 3 digits.");
    else setError("");
  };

  // backend section
  const handlePayment = async () => {
  if (!cardNumber || !expiry || !cvv || !name || !email || !phone) {
    setError("Please fill in all fields first.");
    return;
  }

  if (cardNumber.length !== 16) {
    setError("Card number must be exactly 16 digits.");
    return;
  }

  if (phone.length !== 11) {
    setError("Phone number must be exactly 11 digits.");
    return;
  }

  if (cvv.length !== 3) {
    setError("CVV must be exactly 3 digits.");
    return;
  }

  try {
    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("token");
    const token = localToken || sessionToken;

    if (!token) {
      setError("Authentication token not found. Please login again and make sure to check 'Remember Me' or use the same browser tab.");
      console.error("No token found in localStorage or sessionStorage");
      return;
    }

    console.log("Using token:", token.substring(0, 20) + "...");

    await createBooking({
      roomId: room?._id || room?.id,
      roomKey: room?._id || room?.id || "",
      name,
      email,
      phone,
      roomName: room?.roomName || "Room",
      hotelName: room?.hotelName || "Blue Wave Hotel",
      city: room?.city || "",
      location: room?.location || "",
      image: room?.image || "",
      roomType: room?.type || "",
      beds: room?.beds || 1,
      baths: room?.baths || 1,
      size: room?.size || 1,
      description: room?.description || "",
      amenities: room?.amenities || [],
      price: room?.price || 0,
      nights: nights || 1,
      total: total || 0,
      branch,
      guests,
      checkIn: checkIn || new Date().toISOString(),
      checkOut: checkOut || new Date().toISOString(),
    }, token);

    sessionStorage.removeItem("pendingBooking");
    setError("");
    alert("Payment Successful");

  } catch (err) {
    const message = err?.message || "Payment failed. Please try again.";
    const isDbTimeout = message.includes("buffering timed out") || message.includes("insertOne()");
    setError(
      isDbTimeout
        ? "Booking service is temporarily unavailable. Please try again in a moment."
        : message
    );
    console.error("Payment error:", err);
  }
};
  return (
    <div className="min-h-screen w-full bg-[#edf7ff] flex items-center justify-center py-20">

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">

        {/* IMAGE */}
        <div className="md:w-1/2">
          <img src={img} alt="Room" className="w-full h-full object-cover" />
        </div>

        {/* FORM */}
        <div className="md:w-1/2 bg-white p-12 flex flex-col justify-center text-[#1e3a8a]">

          <h2 className="text-3xl font-bold mb-8 text-center">
            Payment Details
          </h2>

          <h3 className="font-semibold mb-3 text-lg">
            Personal Information
          </h3>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={handleName}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={handlePhone}
            inputMode="numeric"
            pattern="[0-9]{11}"
            className={`w-full border p-3 rounded-lg ${phoneError ? "mb-2" : "mb-6"}`}
          />
          {phoneError && (
            <p className="text-red-500 text-sm mb-6">
              {phoneError}
            </p>
          )}

          <h3 className="font-semibold mb-3 text-lg">
            Card Details
          </h3>

          <img src={visaimg} alt="Card Logos" className="w-[280px] mb-4" />

          <input
            type="text"
            placeholder="Card Number"
            value={cardNumber}
            onChange={handleCardNumber}
            inputMode="numeric"
            maxLength="16"
            pattern="[0-9]{16}"
            className="w-full border p-3 rounded-lg mb-4"
          />

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="MM / YY"
              value={expiry}
              onChange={handleExpiry}
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="text"
              placeholder="CVV"
              value={cvv}
              onChange={handleCVV}
              inputMode="numeric"
              maxLength="3"
              pattern="[0-9]{3}"
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error}
            </p>
          )}

          <button
            onClick={handlePayment}
            className="w-full bg-[#edf7ff] text-blue-800 py-3 rounded-xl hover:bg-[#1e3a8a] hover:text-white transition duration-300"
          >
            Confirm Payment
          </button>

        </div>
      </div>
    </div>
  );
}
