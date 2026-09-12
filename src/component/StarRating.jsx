import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export const StarRating = ({ value, onChange, size = 18, interactive = false }) => {
  const [hover, setHover] = useState(0);

  const display = hover || value;

  const stars = [1, 2, 3, 4, 5].map((n) => {
    const filled = interactive ? n <= display : n <= Math.round(display);
    const fill = n <= display ? 100 : 0;
    return (
      <button
        key={n}
        disabled={!interactive}
        onMouseEnter={() => interactive && setHover(n)}
        onMouseLeave={() => interactive && setHover(0)}
        onClick={() => interactive && onChange && onChange(n)}
        className={interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}
        aria-label={`${n} star${n > 1 ? "s" : ""}`}
      >
        <span className="relative inline-flex">
          <Star
            size={size}
            className="text-surface-border"
            style={{ fill: "none", strokeWidth: 2 }}
          />
          <span
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${fill}%` }}
          >
            <Star
              size={size}
              className="text-gold"
              style={{ fill: "currentColor", strokeWidth: 2 }}
            />
          </span>
        </span>
      </button>
    );
  });

  if (!interactive) {
    return <div className="flex items-center gap-0.5">{stars}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-0.5"
    >
      {stars}
    </motion.div>
  );
};