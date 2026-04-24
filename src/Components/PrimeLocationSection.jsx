import React, { useMemo, useState } from "react";
import {
  MapPin,
  Plane,
  Landmark,
  Navigation,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function createBlueMarker() {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 22px;
        height: 22px;
        background: #2f6fb3;
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
      ">
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
    popupAnchor: [0, -22],
  });
}

const blueMarker = createBlueMarker();

export default function PrimeLocationSection({ hotelName, locations = [] }) {
  const [selectedLocation, setSelectedLocation] = useState(
    locations[0] || null
  );

  const mapCenter = useMemo(() => {
    if (!locations.length) return [26.8206, 30.8025];
    return [27.8, 31.8];
  }, [locations]);

  if (!selectedLocation) return null;

  const {
    name,
    address,
    airport,
    attractions,
    mapsQuery,
    checkIn,
    checkOut,
  } = selectedLocation;

  return (
    <section className="bg-[#edf7ff] py-16 px-6 md:px-10 lg:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-serif text-[#0b2b6f] mb-4">
            Prime Location
          </h2>

          <p className="text-[#0b2b6f] text-sm md:text-base leading-relaxed max-w-lg mb-6">
            Explore our branches across Egypt. Select any location on the map to
            view its exact address, airport access, nearby attractions, and get
            directions instantly.
          </p>

          <div className="mb-4">
            <span className="inline-block bg-white text-[#0b2b6f] text-sm font-medium px-4 py-2 rounded-full shadow-sm">
              Selected Branch: {name}
            </span>
          </div>

          <div className="space-y-4 mb-6">
            <div className="group bg-white rounded-2xl px-4 py-4 flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_10px_25px_rgba(11,31,68,0.16)]">
              <div className="w-10 h-10 rounded-full bg-[#2f6fb3] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-[#0b1f44] font-serif text-lg transition-all duration-300 group-hover:text-[1.15rem]">
                  Address
                </h3>
                <p className="text-gray-600 text-sm">{address}</p>
              </div>
            </div>

            <div className="group bg-white rounded-2xl px-4 py-4 flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_10px_25px_rgba(11,31,68,0.16)]">
              <div className="w-10 h-10 rounded-full bg-[#2f6fb3] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-[#0b1f44] font-serif text-lg transition-all duration-300 group-hover:text-[1.15rem]">
                  Airport
                </h3>
                <p className="text-gray-600 text-sm">{airport}</p>
              </div>
            </div>

            <div className="group bg-white rounded-2xl px-4 py-4 flex items-start gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_10px_25px_rgba(11,31,68,0.16)]">
              <div className="w-10 h-10 rounded-full bg-[#2f6fb3] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-[#0b1f44] font-serif text-lg transition-all duration-300 group-hover:text-[1.15rem]">
                  Nearby Attractions
                </h3>
                <p className="text-gray-600 text-sm">{attractions}</p>
              </div>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              mapsQuery
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/button inline-flex items-center gap-2 bg-[#2f6fb3] text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-[#0b2b6f] hover:text-white hover:shadow-lg"
          >
            <Navigation className="w-4 h-4 transition-transform duration-300 group-hover/button:translate-x-1" />
            <span className="transition-transform duration-300 group-hover/button:translate-x-2">
              Get Directions
            </span>
          </a>
        </div>

        <div className="relative">
          <div className="rounded-[28px] overflow-hidden shadow-md h-[420px]">
            <MapContainer
              center={mapCenter}
              zoom={6}
              scrollWheelZoom={true}
              zoomControl={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {locations.map((location) => (
                <Marker
                  key={location.id}
                  position={location.mapPosition}
                  icon={blueMarker}
                  eventHandlers={{
                    click: () => {
                      setSelectedLocation(location);
                      alert(
                        `${hotelName} - ${location.name}\n${location.address}\n\nCheck-in: ${location.checkIn}\nCheck-out: ${location.checkOut}`
                      );
                    },
                  }}
                />
              ))}

              <ZoomControl position="bottomright" />
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
}