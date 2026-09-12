import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MessageSquareText, Trash2, PenLine } from "lucide-react";
import { fadeUp, revealInitial, revealFinal, viewportOnce } from "./motionPresets";
import { StarRating } from "./StarRating";

const API = "https://backend-sk0h.onrender.com";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const AvatarChip = ({ name }) => (
  <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-sm font-black shrink-0">
    {(name || "?").charAt(0).toUpperCase()}
  </div>
);

export const ReviewsSection = ({ product }) => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editing, setEditing] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const load = () => {
    fetch(`${API}/products/${product._id}/reviews`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setSummary(data.summary || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, [product._id, loggedInUser?._id]);

  useEffect(() => {
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [product._id]);

  useEffect(() => {
    if (!loggedInUser) return;
    const mine = reviews.find((r) => r.user && r.user._id === loggedInUser._id);
    if (mine) {
      setRating(mine.rating);
      setComment(mine.comment || "");
    }
  }, [reviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Tap a star to add a rating");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/products/${product._id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `Could not save review (${res.status})`);
      toast.success(data.comment ? "Review updated" : "Review added");
      setComment("");
      setRating(0);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    setDeletingId(reviewId);
    try {
      const res = await fetch(
        `${API}/products/${product._id}/review/${reviewId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not delete review");
      toast.success("Review deleted");
      setRating(0);
      setComment("");
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const mine = reviews.find((r) => r.user && r.user._id === loggedInUser?._id);

  const levels = [5, 4, 3, 2, 1];

  return (
    <section id="reviews" className="mt-20 md:mt-28">
      <motion.div
        initial={revealInitial}
        whileInView={revealFinal}
        viewport={viewportOnce}
        transition={fadeUp}
        className="mb-8 md:mb-10"
      >
        <p className="text-gold text-xs font-semibold uppercase tracking-[0.22em] mb-3">
          <MessageSquareText className="inline w-4 h-4 mr-1 -mt-0.5" />
          Ratings &amp; Reviews
        </p>
        <h2 className="text-warm-100 text-2xl md:text-3xl font-black tracking-tight">
          What people say
        </h2>
      </motion.div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <span className="text-gold font-bold animate-pulse text-xs uppercase tracking-[0.3em]">
            Loading reviews...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-6 lg:gap-10 items-start">
          {/* Summary */}
          <motion.div
            initial={revealInitial}
            whileInView={revealFinal}
            viewport={viewportOnce}
            transition={fadeUp}
            className="rounded-2xl border border-surface-border bg-surface-raised p-7 flex flex-col items-center text-center"
          >
            <span className="text-warm-100 text-6xl font-black tracking-tight leading-none">
              {summary ? summary.avg.toFixed(1) : "0.0"}
            </span>
            <div className="my-4">
              <StarRating value={summary?.avg || 0} size={22} />
            </div>
            <p className="text-warm-500 text-sm mb-6">
              {summary ? `${summary.count} rating${summary.count === 1 ? "" : "s"}` : "No ratings yet"}
            </p>
            <div className="w-full space-y-2">
              {levels.map((lv) => {
                const n = summary?.distribution?.[lv] || 0;
                const pct = summary && summary.count ? (n / summary.count) * 100 : 0;
                return (
                  <div key={lv} className="flex items-center gap-3">
                    <span className="text-warm-500 text-xs font-bold w-5">{lv}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-elevated overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gold transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-warm-500 text-xs w-6 text-right">{n}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Write a review */}
            <motion.div
              initial={revealInitial}
              whileInView={revealFinal}
              viewport={viewportOnce}
              transition={fadeUp}
              className="rounded-2xl border border-surface-border bg-surface-raised p-6 md:p-7"
            >
              {loggedInUser ? (
                <form onSubmit={handleSubmit}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-warm-100 font-black text-base tracking-tight">
                        {mine ? "Update your review" : "Write a review"}
                      </h3>
                      <p className="text-warm-500 text-xs mt-1">
                        {mine ? "Your rating & thoughts will be replaced." : "Rate it honestly — others will see it."}
                      </p>
                    </div>
                    {mine && (
                      <button
                        type="button"
                        onClick={() => handleDelete(mine._id)}
                        disabled={deletingId === mine._id}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {deletingId === mine._id ? "Deleting..." : "Delete"}
                      </button>
                    )}
                  </div>
                  <div className="mb-4">
                    <div
                      className="inline-flex items-center gap-3 rounded-full border border-surface-border bg-elevated px-5 py-3"
                      onMouseLeave={() => {}}
                    >
                      <StarRating value={rating} onChange={setRating} interactive size={26} />
                    </div>
                    {rating > 0 && (
                      <p className="text-warm-500 text-xs mt-2 ml-1">
                        {["", "Poor", "Below average", "Good", "Very good", "Excellent"][rating]}
                      </p>
                    )}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    maxLength={600}
                    placeholder="Share what you liked or didn't like about this product..."
                    className="w-full bg-elevated border border-surface-border rounded-xl px-4 py-3 text-sm text-warm-100 placeholder-warm-600 focus:outline-none focus:border-gold/50 resize-none [color-scheme:dark]"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-warm-600 text-xs">{comment.length}/600</span>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 bg-gold text-surface font-bold px-6 py-2.5 rounded-full hover:bg-gold-light active:scale-[0.98] transition-all text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PenLine className="w-4 h-4" />
                      {submitting ? "Saving..." : mine ? "Update review" : "Post review"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-warm-100 font-black text-base tracking-tight">
                      Rate &amp; review this product
                    </h3>
                    <p className="text-warm-500 text-sm mt-1">
                      Log in to share your rating with other shoppers.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-gold text-surface font-bold px-6 py-2.5 rounded-full hover:bg-gold-light transition-colors text-xs uppercase tracking-wider"
                  >
                    Log in to review
                  </button>
                </div>
              )}
            </motion.div>

            {/* Review list */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="rounded-2xl border border-surface-border bg-surface-raised p-10 text-center">
                  <p className="text-warm-100 font-bold tracking-tight">No reviews yet</p>
                  <p className="text-warm-500 text-sm mt-1">
                    Be the first to share your experience with this product.
                  </p>
                </div>
              ) : (
                reviews.map((r, i) => (
                  <motion.div
                    key={r._id}
                    initial={revealInitial}
                    whileInView={revealFinal}
                    viewport={viewportOnce}
                    transition={{ ...fadeUp, delay: i * 0.05 }}
                    className="rounded-2xl border border-surface-border bg-surface-raised p-6 md:p-7"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <AvatarChip name={r.user?.name} />
                        <div>
                          <p className="text-warm-100 text-sm font-bold leading-tight">
                            {r.user?.name || "Anonymous"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating value={r.rating} size={14} />
                            <span className="text-warm-600 text-xs">
                              {fmtDate(r.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {r.verifiedPurchase && (
                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-gold border border-gold/25 bg-gold/10 px-2 py-1 rounded-full">
                          Certified buyer
                        </span>
                      )}
                    </div>
                    {r.comment ? (
                      <p className="text-warm-300 text-sm leading-relaxed mt-4">
                        {r.comment}
                      </p>
                    ) : (
                      <p className="text-warm-600 text-sm italic mt-4">
                        Rated {r.rating} star{r.rating > 1 ? "s" : ""} without a comment.
                      </p>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};