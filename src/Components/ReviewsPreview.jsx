import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Star, CheckCircle } from "lucide-react";
import { apiGet } from "../services/apiClient";

function normalizeReview(review = {}) {
  return {
    id: review._id ?? review.id,
    name: review.name ?? "Anonymous Guest",
    title: review.title?.trim() || "Untitled Review",
    text: review.comment ?? "",
    branch: review.branch ?? "",
    rating: Number(review.rating) || 0,
    verified:
      typeof review.verified === "boolean" ? review.verified : Boolean(review.userId),
    createdAt: review.createdAt || review.date || new Date().toISOString(),
  };
}

function formatReviewTime(value) {
  const reviewDate = new Date(value);
  const now = new Date();
  const diffMs = now - reviewDate;

  if (Number.isNaN(reviewDate.getTime()) || diffMs < 0) {
    return "Recently";
  }

  const day = 1000 * 60 * 60 * 24;
  const days = Math.floor(diffMs / day);

  if (days < 7) {
    return days <= 1 ? "1 day ago" : `${days} days ago`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 5) {
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }

  const years = Math.floor(days / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

function avatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=dbe7f5&color=2F4156`;
}

export default function ReviewsPreview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      try {
        const data = await apiGet("/reviews");
        if (!isMounted) return;

        const normalized = Array.isArray(data) ? data.map(normalizeReview) : [];
        setReviews(normalized);
      } catch (error) {
        if (isMounted) {
          console.error("Unable to load homepage reviews:", error.message);
          setReviews([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayedReviews = useMemo(
    () => [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6),
    [reviews]
  );

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "0.0";
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  return (
    <section className="bg-white px-6 py-20 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-[#2F4156] md:text-5xl">
            Guest Reviews
          </h2>

          <div className="mt-4 flex items-center justify-center gap-2 text-[#f4b400]">
            {[...Array(5)].map((_, index) => (
              <Star key={index} size={18} className="fill-[#f4b400] text-[#f4b400]" />
            ))}
            <span className="ml-1 text-base font-semibold text-[#2F4156]">
              {averageRating}
            </span>
          </div>

          <p className="mt-3 text-sm text-[#6b7b8c] md:text-base">
            Based on {reviews.length.toLocaleString()} verified guest
            {reviews.length === 1 ? " review" : " reviews"}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            [...Array(3)].map((_, index) => (
              <div
                key={index}
                className="h-[280px] animate-pulse rounded-2xl border border-[#dbe4f0] bg-[#EEF4FB] p-5 shadow-sm"
              />
            ))
          ) : displayedReviews.length > 0 ? (
            displayedReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-[#dbe4f0] bg-[#EEF4FB] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={avatarUrl(review.name)}
                    alt={review.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="text-sm font-semibold text-[#2F4156] md:text-base">
                      {review.name}
                    </h3>
                    <p className="text-xs text-[#7b8a9a] md:text-sm">
                      {review.branch || "Guest Review"} • {formatReviewTime(review.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1 text-[#f4b400]">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={15}
                      className={
                        index < review.rating
                          ? "fill-[#f4b400] text-[#f4b400]"
                          : "text-[#d0dae5]"
                      }
                    />
                  ))}
                </div>

                <h4 className="mt-4 text-base font-semibold text-[#2F4156]">
                  {review.title}
                </h4>

                <p className="mt-3 text-sm leading-7 text-[#5c6b7a]">
                  {review.text}
                </p>

                {review.verified && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-[#52a56b]">
                    <CheckCircle size={16} className="fill-white text-[#52a56b]" />
                    <span>Verified Stay</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-[#dbe4f0] bg-[#EEF4FB] p-10 text-center text-[#5c6b7a] shadow-sm">
              No reviews yet. Be the first guest to share your experience.
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/reviews"
            className="inline-block rounded-full bg-[#2F4156] px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#7ea0d6]"
          >
            Load More Reviews
          </Link>
        </div>
      </div>
    </section>
  );
}

