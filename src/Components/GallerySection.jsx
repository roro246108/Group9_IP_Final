import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function GallerySection({ images }) {
  const [selectedImage, setSelectedImage] = useState(0);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const prevIndex = (selectedImage - 1 + images.length) % images.length;
  const nextIndex = (selectedImage + 1) % images.length;

  return (
    <section className="bg-white pt-28 pb-16 px-2 md:px-4 lg:px-10 xl:px-14 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="w-full mb-8 text-center">
          <p className="text-[12px] md:text-sm uppercase tracking-[0.28em] text-[#7b8aa8] mb-3">
            Our Spaces
          </p>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-[#0b2b6f] mb-2">
            Discover Blue Waves
          </h1>
          <p className="text-sm md:text-base text-[#5f6f8c] max-w-xl mx-auto leading-relaxed">
            A glimpse into our elegant stays, refined interiors, and signature experiences.
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          {/* Left stacked preview */}
          <div
            onClick={prevImage}
            className="hidden lg:block absolute left-[-70px] top-1/2 -translate-y-1/2 z-10 w-[390px] h-[460px] cursor-pointer transition-transform duration-500 hover:scale-105 animate-[floatLeft_4s_ease-in-out_infinite]"
          >
            <div className="absolute left-[125px] top-[38px] w-[260px] h-[330px] bg-white/60 border border-[#d9d2c3] shadow-md rounded-[14px] -rotate-[4deg]"></div>

            <div className="absolute left-[24px] top-[10px] w-[290px] h-[385px] bg-white/70 border border-[#d9d2c3] shadow-xl rounded-[16px] -rotate-[2deg] overflow-hidden">
              <img
                src={images[prevIndex]}
                alt="Previous preview"
                className="w-full h-full object-cover opacity-75 transition-all duration-500 hover:scale-110 hover:opacity-90"
              />
            </div>
          </div>

          {/* Main image */}
          <div className="relative w-full max-w-4xl z-20">
            <img
              src={images[selectedImage]}
              alt={`Gallery ${selectedImage + 1}`}
              className="w-full h-[280px] sm:h-[380px] md:h-[460px] lg:h-[520px] object-cover rounded-[28px] shadow-xl transition-transform duration-700 animate-[mainFloat_5s_ease-in-out_infinite]"
            />

            {/* Counter */}
            <div className="absolute top-4 right-4 bg-white/85 backdrop-blur-md text-[#0b1f44] text-sm font-medium px-4 py-2 rounded-full shadow">
              {selectedImage + 1} / {images.length}
            </div>

            {/* Left arrow */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/85 backdrop-blur-md shadow-lg flex items-center justify-center text-[#0b1f44] hover:bg-[#071d49] hover:text-white transition-all duration-300"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Right arrow */}
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/85 backdrop-blur-md shadow-lg flex items-center justify-center text-[#0b1f44] hover:bg-[#071d49] hover:text-white transition-all duration-300"
            >
              <ChevronRight size={22} />
            </button>

            {/* Bottom thumbnails */}
            <div className="flex items-center justify-center gap-3 mt-6 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 rounded-2xl overflow-hidden transition-all duration-300 ${
                    selectedImage === index
                      ? "ring-4 ring-[#0b1f44] scale-105"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right stacked preview */}
          <div
            onClick={nextImage}
            className="hidden lg:block absolute right-[-70px] top-1/2 -translate-y-1/2 z-10 w-[390px] h-[460px] cursor-pointer transition-transform duration-500 hover:scale-105 animate-[floatRight_4s_ease-in-out_infinite]"
          >
            <div className="absolute right-[125px] top-[38px] w-[260px] h-[330px] bg-white/60 border border-[#d9d2c3] shadow-md rounded-[14px] rotate-[4deg]"></div>

            <div className="absolute right-[24px] top-[10px] w-[290px] h-[385px] bg-white/70 border border-[#d9d2c3] shadow-xl rounded-[16px] rotate-[2deg] overflow-hidden">
              <img
                src={images[nextIndex]}
                alt="Next preview"
                className="w-full h-full object-cover opacity-75 transition-all duration-500 hover:scale-110 hover:opacity-90"
              />
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes floatLeft {
            0%, 100% {
              transform: translateY(-50%) translateX(0px);
            }
            50% {
              transform: translateY(calc(-50% - 6px)) translateX(-4px);
            }
          }

          @keyframes floatRight {
            0%, 100% {
              transform: translateY(-50%) translateX(0px);
            }
            50% {
              transform: translateY(calc(-50% - 6px)) translateX(4px);
            }
          }

          @keyframes mainFloat {
            0%, 100% {
              transform: translateY(0px) scale(1);
            }
            50% {
              transform: translateY(-4px) scale(1.01);
            }
          }
        `}
      </style>
    </section>
  );
}