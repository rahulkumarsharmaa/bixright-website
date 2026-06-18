"use client";

import { useEffect, useState } from "react";
import { Star, ChevronDown, Edit3, X, User } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  customerName: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [count, setCount] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Review Form State
  const [showForm, setShowForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function fetchReviews() {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/review/get-reviews/${productId}`
      );
      const data = await res.json();
      if (data && data.success) {
        setRating(data.averageRating);
        setCount(data.totalReviews);
        setReviews(data.reviews || []);
      } else {
        setReviews([]);
        setCount(0);
        setRating(0);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to write a review");
      router.push("/user/login");
      return;
    }

    if (userRating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a review title");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/add-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          rating: userRating,
          title,
          comment,
        }),
      });

      const json = await res.json();

      if (json.success) {
        toast.success("Review submitted successfully!");
        setShowForm(false);
        setTitle("");
        setComment("");
        setUserRating(0);
        fetchReviews();
      } else {
        toast.error(json.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const formattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full mt-6 border-t border-gray-100 pt-4">
      {/* Compact Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between group py-2"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-900 group-hover:text-black transition-colors">
            Reviews ({count})
          </span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < Math.round(rating || 0)
                  ? "fill-black text-black"
                  : "text-gray-300"
                  }`}
              />
            ))}
          </div>
        </div>
        <div className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}>
          <ChevronDown className="h-4 w-4" />
        </div>
      </button>

      {/* Dropdown Content */}
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-2">
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full mb-6 flex items-center justify-center gap-2 border border-black text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-black hover:text-white transition-all active:scale-95"
                >
                  <Edit3 size={14} /> Write a Review
                </button>
              )}

              {/* Compact Review Form */}
              <AnimatePresence>
                {showForm && (
                  <m.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100"
                  >
                    <form onSubmit={handleSubmit}>
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-sm font-bold text-gray-900">Write Review</h4>
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-center gap-1 group">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setUserRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="focus:outline-none p-1 transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${star <= (hoverRating || userRating)
                                    ? "fill-black text-black"
                                    : "text-gray-300"
                                  }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Review Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full mb-3 p-2.5 text-sm rounded-lg border border-gray-200 outline-none focus:border-black transition-colors bg-white"
                        required
                      />

                      <textarea
                        rows={3}
                        className="w-full p-2.5 text-sm rounded-lg border border-gray-200 outline-none focus:border-black transition-colors resize-none bg-white mb-3"
                        placeholder="Share your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      ></textarea>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-70"
                      >
                        {submitting ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  </m.div>
                )}
              </AnimatePresence>

              {/* Compact Review List */}
              {loading ? (
                <div className="text-center py-4 text-sm text-gray-500">Loading reviews...</div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="border-b border-gray-100 last:border-0 pb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700">
                            {rev.customerName ? rev.customerName.charAt(0).toUpperCase() : "U"}
                          </div>
                          <span className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">
                            {rev.customerName || "Anonymous"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {formattedDate(rev.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center mb-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < rev.rating
                              ? "fill-black text-black"
                              : "text-gray-200"
                              }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">No reviews yet</p>
                </div>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
