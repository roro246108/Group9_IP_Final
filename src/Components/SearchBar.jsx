import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { ChevronDown } from "lucide-react";
import * as Yup from "yup";

function DownDropdown({ name, value, options, placeholder, onChange, onBlur }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onBlur={onBlur}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#d7e3ef] bg-white px-5 py-4 text-left text-[#223a5e] outline-none"
      >
        <span className="min-w-0 truncate">
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-[#223a5e] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+8px)] z-[100] max-h-64 w-full overflow-y-auto rounded-2xl border border-[#d7e3ef] bg-white py-2 shadow-xl"
        >
          {options.map((option) => (
            <button
              key={`${name}-${option.value || "empty"}`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`block w-full px-5 py-3 text-left text-sm transition ${
                option.value === value
                  ? "bg-[#2f4156] text-white"
                  : "text-[#223a5e] hover:bg-[#edf5fc]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchBar({
  filters = {},
  onSearch,
  onSearchClick,
  resultCount,
  branchOptions = [],
  roomTypeOptions = [],
}) {
  const submitHandler = onSearchClick || onSearch;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validationSchema = Yup.object({
    branch: Yup.string().required("Branch is required"),
    roomType: Yup.string(),
    checkIn: Yup.date()
      .required("Check-in date is required")
      .min(today, "You cannot search using past dates"),
    checkOut: Yup.date()
      .required("Check-out date is required")
      .min(today, "You cannot search using past dates")
      .test(
        "after-check-in",
        "Check-out must be after check-in",
        function (value) {
          const { checkIn } = this.parent;
          if (!value || !checkIn) return true;
          return new Date(value) > new Date(checkIn);
        }
      ),
    guests: Yup.string().required("Guests is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      branch: filters.branch || "Cairo Branch",
      roomType: filters.roomType || "",
      checkIn: filters.checkIn || "",
      checkOut: filters.checkOut || "",
      guests:
        filters.guests && Number(filters.guests) > 0
          ? `${filters.guests} Guest${Number(filters.guests) > 1 ? "s" : ""}`
          : "1 Guest",
    },
    validationSchema,
    onSubmit: (values) => {
      const guestsNumber = parseInt(values.guests) || 1;

      submitHandler?.({
        destination: values.branch,
        branch: values.branch,
        roomType: values.roomType,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        guests: guestsNumber,
        maxPrice: filters.maxPrice || 1000,
      });
    },
  });

  const branchSelectOptions =
    branchOptions.length > 0
      ? [
          { value: "", label: "Select branch" },
          ...branchOptions.map((branch) => ({ value: branch, label: branch })),
        ]
      : [
          { value: "", label: "Select branch" },
          { value: "Cairo Branch", label: "Cairo Branch" },
          { value: "Alexandria Branch", label: "Alexandria Branch" },
          { value: "Marsa Alam Branch", label: "Marsa Alam Branch" },
          { value: "Sharm El Sheikh Branch", label: "Sharm El Sheikh Branch" },
          { value: "Ain El Sokhna Branch", label: "Ain El Sokhna Branch" },
        ];

  const roomTypeSelectOptions =
    roomTypeOptions.length > 0
      ? [
          { value: "", label: "Any Room Type" },
          ...roomTypeOptions.map((type) => ({ value: type, label: type })),
        ]
      : [
          { value: "", label: "Any Room Type" },
          { value: "Standard", label: "Standard" },
          { value: "Deluxe", label: "Deluxe" },
          { value: "Suite", label: "Suite" },
          { value: "Penthouse", label: "Penthouse" },
        ];

  const guestSelectOptions = [
    { value: "", label: "Select guests" },
    { value: "1 Guest", label: "1 Guest" },
    { value: "2 Guests", label: "2 Guests" },
    { value: "3 Guests", label: "3 Guests" },
    { value: "4 Guests", label: "4 Guests" },
    { value: "5 Guests", label: "5 Guests" },
  ];

  return (
    <div className="w-full">
      <form
        onSubmit={formik.handleSubmit}
        className="rounded-[30px] bg-[#CBD9E6] p-5 md:p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6 items-start">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#223a5e]">
              Branch
            </label>
            <DownDropdown
              name="branch"
              value={formik.values.branch}
              options={branchSelectOptions}
              placeholder="Select branch"
              onChange={(value) => formik.setFieldValue("branch", value)}
              onBlur={() => formik.setFieldTouched("branch", true)}
            />
            {formik.touched.branch && formik.errors.branch && (
              <p className="mt-2 text-sm text-red-500">{formik.errors.branch}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#223a5e]">
              Room Type
            </label>
            <DownDropdown
              name="roomType"
              value={formik.values.roomType}
              options={roomTypeSelectOptions}
              placeholder="Any Room Type"
              onChange={(value) => formik.setFieldValue("roomType", value)}
              onBlur={() => formik.setFieldTouched("roomType", true)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#223a5e]">
              Check-in
            </label>
            <input
              type="date"
              name="checkIn"
              value={formik.values.checkIn}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-2xl border border-[#d7e3ef] bg-white px-5 py-4 text-[#223a5e] outline-none"
            />
            {formik.touched.checkIn && formik.errors.checkIn && (
              <p className="mt-2 text-sm text-red-500">{formik.errors.checkIn}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#223a5e]">
              Check-out
            </label>
            <input
              type="date"
              name="checkOut"
              value={formik.values.checkOut}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-2xl border border-[#d7e3ef] bg-white px-5 py-4 text-[#223a5e] outline-none"
            />
            {formik.touched.checkOut && formik.errors.checkOut && (
              <p className="mt-2 text-sm text-red-500">{formik.errors.checkOut}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#223a5e]">
              Guests
            </label>
            <DownDropdown
              name="guests"
              value={formik.values.guests}
              options={guestSelectOptions}
              placeholder="Select guests"
              onChange={(value) => formik.setFieldValue("guests", value)}
              onBlur={() => formik.setFieldTouched("guests", true)}
            />
            {formik.touched.guests && formik.errors.guests && (
              <p className="mt-2 text-sm text-red-500">{formik.errors.guests}</p>
            )}
          </div>

          <div className="pt-7">
            <button
  type="submit"
  className="
    w-full 
    rounded-2xl 
    bg-[#314763] 
    py-4 
    font-semibold 
    text-white 
    transition-all duration-200 
    
    hover:bg-[#24364d] 
    hover:-translate-y-0.5 
    
    active:scale-95 
    active:translate-y-0.5 
    active:bg-[#1d2b3d]
  "
>
  Search Now
</button>
          </div>
        </div>
      </form>

      {typeof resultCount === "number" && (
        <div className="mt-3 pr-2 text-right text-sm text-[#6c7f95]">
          {resultCount} results
        </div>
      )}
    </div>
  );
}
