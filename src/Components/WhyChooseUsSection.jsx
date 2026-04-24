import { MapPin, BedDouble, BadgePercent, Headset } from "lucide-react";

const features = [
  {
    id: 1,
    title: "Prime Locations",
    description:
      "Discover our hotels in carefully selected destinations that bring you closer to comfort, elegance, and convenience.",
    icon: MapPin,
  },
  {
    id: 2,
    title: "Luxury Rooms",
    description:
      "Enjoy beautifully designed rooms and suites crafted to offer relaxation, style, and a premium hospitality experience.",
    icon: BedDouble,
  },
  {
    id: 3,
    title: "Best Offers",
    description:
      "Take advantage of exclusive seasonal deals, special packages, and exceptional value tailored for every guest.",
    icon: BadgePercent,
  },
  {
    id: 4,
    title: "24/7 Service",
    description:
      "Our dedicated team is available around the clock to ensure your stay is smooth, comfortable, and memorable.",
    icon: Headset,
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="bg-white px-6 py-20 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7ea0d6]">
            Why Choose Us
          </p>

          <h2 className="mt-4 text-3xl font-semibold text-[#2F4156] md:text-5xl">
            Redefining Luxury Hospitality
          </h2>

          <p className="mt-5 text-base leading-8 text-[#5c6b7a] md:text-lg">
            At Blue Waves Hotel, we combine premium comfort, elegant spaces,
            and exceptional service to create a stay that feels both relaxing
            and unforgettable.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                className="group rounded-3xl border border-[#e6edf5] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#dbe8f7] via-[#b8cdea] to-[#7ea0d6] text-white shadow-md transition-all duration-300 group-hover:scale-110">
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-[#2F4156]">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#5c6b7a] md:text-base">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}