import { useState, useEffect, useCallback, useRef } from "react";
import Footer from "../Components/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  AtSign,
  FileText,
  Headphones,
  Globe,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import FAQAccordion from "../Components/FAQAccordion";
import { apiGet, apiPost } from "../services/apiClient";
import { useAuth } from "../Context/AuthContext";

const INQUIRY_TYPES = [
  "General Inquiry",
  "Booking Assistance",
  "Cancellation / Refund",
  "Room Upgrade Request",
  "Event Planning",
  "Lost & Found",
  "Complaint / Feedback",
];

const MAX_MESSAGE_LENGTH = 1000;

function normalizeBranch(hotel = {}) {
  return {
    name: hotel.name || "Branch",
    address: hotel.address || "Address not available",
    phone: hotel.phone || "Phone not available",
    email: hotel.email || "Email not available",
    hours: hotel.status === "Active" ? "24 / 7 Front Desk" : "Currently unavailable",
  };
}

// ── Toast ──
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = type === "success" ? "bg-teal-600" : "bg-red-600";

  return (
    <div
      className={`fixed top-6 right-6 z-50 ${bg} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-[slideIn_0.3s_ease-out]`}
    >
      {type === "success" ? <Check size={18} /> : <X size={18} />}
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
}

// ── Main component ──
export default function ContactHelp() {
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "",
    inquiryType: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("faq"); // "faq" | "contact" | "branches"
  const [branches, setBranches] = useState([]);
  const formRef = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, key: Date.now() });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadBranches = async () => {
      try {
        const data = await apiGet("/hotels");
        if (!isMounted) return;

        const hotelBranches = Array.isArray(data?.hotels)
          ? data.hotels
              .filter((hotel) => hotel?.status !== "Inactive")
              .map(normalizeBranch)
          : [];

        setBranches(hotelBranches);
      } catch (error) {
        if (isMounted) {
          setBranches([]);
          showToast(error.message || "Unable to load branch data right now.", "error");
        }
      }
    };

    loadBranches();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  // ── Validation ──
  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!form.message.trim()) newErrors.message = "Message cannot be empty.";
    return newErrors;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "message" && value.length > MAX_MESSAGE_LENGTH) return;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast("Please log in first to send a message.", "error");
      return;
    }

    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      showToast("Please fix the highlighted fields.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await apiPost("/contact-messages", form);
      showToast("Your message has been sent! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", phone: "", branch: "", inquiryType: "", message: "" });
      setErrors({});
    } catch (error) {
      showToast(error.message || "Could not send your message right now.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Tab data ──
  const tabs = [
    { key: "faq", label: "FAQ", icon: <Sparkles size={16} /> },
    { key: "contact", label: "Contact Us", icon: <Send size={16} /> },
    { key: "branches", label: "Our Branches", icon: <MapPin size={16} /> },
  ];

  // ── Helper: input class ──
  function inputClass(field) {
    return `w-full border ${
      errors[field] ? "border-red-400 ring-1 ring-red-300" : "border-sky-200"
    } rounded-xl px-4 py-3 text-blue-900 bg-sky-50 placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-sky-50 to-teal-50 w-full">
      {/* Toast */}
      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(80px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .contact-page button, .contact-page select {
          background-color: transparent;
          border: none;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 contact-page">
        {/* ── Hero ── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-teal-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
            <Headphones size={14} />
            Support &amp; Assistance
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-950 tracking-tight mb-3">
            Help Center
          </h1>
          <p className="text-teal-600 max-w-xl mx-auto text-lg">
            Have a question or need assistance? Our dedicated team is ready to help you around the clock.
          </p>
        </div>

        {/* ── Quick-info cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              icon: <Phone size={22} className="text-teal-500" />,
              title: "Call Us",
              detail: "+966 11 456 7890",
              sub: "Toll-free · 24 / 7",
            },
            {
              icon: <Mail size={22} className="text-sky-500" />,
              title: "Email",
              detail: "support@luxestay.com",
              sub: "Response within 24 h",
            },
            {
              icon: <Clock size={22} className="text-amber-500" />,
              title: "Working Hours",
              detail: "Mon – Sun",
              sub: "Front desk open 24 / 7",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl shadow-md border border-sky-100 p-5 flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-full bg-sky-50 flex items-center justify-center shrink-0">
                {card.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-950">{card.title}</p>
                <p className="text-blue-800 font-medium">{card.detail}</p>
                <p className="text-xs text-sky-500 mt-0.5">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tab Navigation ── */}
        <div className="flex justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? "!bg-teal-600 !text-white shadow-md shadow-teal-200"
                  : "!bg-white text-blue-800 !border !border-sky-200 hover:!bg-sky-50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════ FAQ TAB ══════════════════════════ */}
        {activeTab === "faq" && (
          <div className="bg-white rounded-2xl shadow-md border border-sky-100 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-blue-950 mb-6 flex items-center gap-2">
              <Sparkles size={22} className="text-teal-500" />
              Frequently Asked Questions
            </h2>
            <FAQAccordion />
          </div>
        )}

        {/* ══════════════════════════ CONTACT TAB ══════════════════════════ */}
        {activeTab === "contact" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form — 3 cols */}
            <div
              ref={formRef}
              className="lg:col-span-3 bg-white rounded-2xl shadow-md border border-sky-100 p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-blue-950 mb-1 flex items-center gap-2">
                <Send size={22} className="text-teal-500" />
                Send Us a Message
              </h2>
              <p className="text-sky-500 text-sm mb-6">
                Fill out the form and we'll respond within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-blue-900 mb-1.5">
                      <User size={14} className="inline mr-1 -mt-0.5" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Ali Mohammed"
                      className={inputClass("name")}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-900 mb-1.5">
                      <AtSign size={14} className="inline mr-1 -mt-0.5" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="ali@example.com"
                      className={inputClass("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone + Branch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-blue-900 mb-1.5">
                      <Phone size={14} className="inline mr-1 -mt-0.5" />
                      Phone <span className="text-sky-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+966 5XX XXX XXXX"
                      className={inputClass("phone")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-900 mb-1.5">
                      <MapPin size={14} className="inline mr-1 -mt-0.5" />
                      Branch <span className="text-sky-400 font-normal">(optional)</span>
                    </label>
                    <select
                      name="branch"
                      value={form.branch}
                      onChange={handleChange}
                      className={`${inputClass("branch")} border border-sky-200`}
                    >
                      <option value="">Select a branch…</option>
                      {branches.map((b) => (
                        <option key={b.name} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Inquiry type */}
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5">
                    <FileText size={14} className="inline mr-1 -mt-0.5" />
                    Inquiry Type <span className="text-sky-400 font-normal">(optional)</span>
                  </label>
                  <select
                    name="inquiryType"
                    value={form.inquiryType}
                    onChange={handleChange}
                    className={`${inputClass("inquiryType")} border border-sky-200`}
                  >
                    <option value="">Select a topic…</option>
                    {INQUIRY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Describe how we can help you…"
                    className={`${inputClass("message")} resize-none`}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.message ? (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.message}
                      </p>
                    ) : (
                      <span />
                    )}
                    <p
                      className={`text-xs ${
                        form.message.length > MAX_MESSAGE_LENGTH * 0.9
                          ? "text-red-500"
                          : "text-sky-500"
                      }`}
                    >
                      {form.message.length}/{MAX_MESSAGE_LENGTH}
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full !bg-teal-600 hover:!bg-teal-700 disabled:!bg-sky-300 disabled:cursor-not-allowed !text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg shadow-md shadow-teal-200"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar — 2 cols */}
            <div className="lg:col-span-2 space-y-6">
              {/* Live chat card */}
              <div className="bg-white rounded-2xl shadow-md border border-sky-100 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                    <MessageSquare size={20} className="text-teal-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-950">Live Chat</h3>
                    <p className="text-xs text-sky-500">
                      Avg. response &lt; 2 min
                    </p>
                  </div>
                </div>
                <p className="text-sm text-blue-800 leading-relaxed mb-4">
                  Chat with a real team member instantly. Available Mon–Fri 9 AM – 6 PM (GMT+3).
                </p>
                <button className="w-full !bg-sky-100 hover:!bg-sky-200 !text-blue-800 font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm !border !border-sky-200">
                  <MessageSquare size={16} />
                  Start Chat
                </button>
              </div>

              {/* Emergency */}
              <div className="bg-white rounded-2xl shadow-md border border-sky-100 p-6">
                <h3 className="font-bold text-blue-950 mb-2 flex items-center gap-2">
                  <Phone size={18} className="text-red-500" />
                  Urgent Assistance
                </h3>
                <p className="text-sm text-blue-800 leading-relaxed mb-3">
                  For emergencies during your stay — safety, medical, or urgent booking issues — call our 24/7 priority line.
                </p>
                <p className="text-xl font-bold text-teal-600">+966 11 999 0000</p>
              </div>

              {/* Social / global */}
              <div className="bg-white rounded-2xl shadow-md border border-sky-100 p-6">
                <h3 className="font-bold text-blue-950 mb-3 flex items-center gap-2">
                  <Globe size={18} className="text-sky-500" />
                  Connect With Us
                </h3>
                <div className="space-y-2">
                  {[
                    { label: "Twitter / X", handle: "@LuxeStayHotels" },
                    { label: "Instagram", handle: "@luxestay" },
                    { label: "WhatsApp", handle: "+966 5XX XXX XXXX" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-blue-800 font-medium">{s.label}</span>
                      <span className="text-teal-600 font-semibold">{s.handle}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════ BRANCHES TAB ══════════════════════════ */}
        {activeTab === "branches" && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-blue-950 flex items-center gap-2">
              <MapPin size={22} className="text-teal-500" />
              Our Branches
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {branches.map((branch) => (
                <div
                  key={branch.name}
                  className="bg-white rounded-2xl shadow-md border border-sky-100 p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-bold text-blue-950 text-lg mb-3">
                    {branch.name}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin size={15} className="text-teal-500 mt-0.5 shrink-0" />
                      <span className="text-blue-800">{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={15} className="text-teal-500 shrink-0" />
                      <span className="text-blue-800">{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={15} className="text-sky-500 shrink-0" />
                      <span className="text-blue-800">{branch.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={15} className="text-amber-500 shrink-0" />
                      <span className="text-blue-800">{branch.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer note ── */}
        <p className="text-center text-xs text-sky-500 mt-12">
          Blue Wave Support - Committed to exceptional guest service across our branches.
        </p>
      </div>
      <Footer />
    </div>
  );
}


