import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const cardThemes = [
  {
    bg: "from-gold/[0.10]",
    border: "hover:border-gold/30",
    chip: "text-gold",
    glow: "bg-[radial-gradient(closest-side,rgba(201,168,76,0.10),transparent)]",
  },
  {
    bg: "from-[#6e8cbe]/[0.10]",
    border: "hover:border-[#9bb0d0]/30",
    chip: "text-[#9bb0d0]",
    glow: "bg-[radial-gradient(closest-side,rgba(110,140,190,0.10),transparent)]",
  },
  {
    bg: "from-[#a07896]/[0.10]",
    border: "hover:border-[#c9a8bd]/25",
    chip: "text-[#c9a8bd]",
    glow: "bg-[radial-gradient(closest-side,rgba(160,120,150,0.12),transparent)]",
  },
];

const CategorySection = ({ onLoad }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://backend-sk0h.onrender.com/products")
      .then((res) => res.json())
      .then((data) => {
        const items = data.data;
        const pick = (category) => items.find((p) => p.category === category);

        const headphones = pick("Headphones");
        const smartphones = pick("Smartphones");
        const laptops = pick("Laptops");

        setCategories([
          { ...headphones, label: "Wireless sound", meta: `30-day home trial`, theme: 0 },
          { ...smartphones, label: "Handheld power", meta: `All-day battery`, theme: 1 },
          { ...laptops, label: "Built to last", meta: `Thin. Light. Serious.`, theme: 2 },
        ].filter(Boolean));
        setLoading(false);
        onLoad?.();
      })
      .catch((err) => {
        console.error("Error fetching category data:", err);
        setLoading(false);
        onLoad?.();
      });
  }, []);

  if (loading) return null;

  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-end justify-between gap-4 mb-10 md:mb-14"
        >
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.22em] mb-3">
              Shop by category
            </p>
            <h2 className="text-warm-100 text-3xl md:text-4xl font-black tracking-tight max-w-md">
              Three aisles, each one worth browsing
            </h2>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-warm-300 hover:text-gold transition-colors"
          >
            View all products
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>

        {/* Row 1 — split editorial */}
        {categories[0] && categories[1] && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 mb-5 md:mb-6">
            <CategoryCard
              product={categories[0]}
              className="lg:col-span-7 h-[380px] md:h-[420px]"
              imageClass="w-[240px] h-[220px] md:w-[320px] md:h-[300px] -right-2 md:-right-6 -bottom-0"
            />
            <CategoryCard
              product={categories[1]}
              className="lg:col-span-5 h-[380px] md:h-[420px]"
              imageClass="w-[220px] h-[200px] md:w-[280px] md:h-[260px] -right-0 -bottom-0"
              delay={0.12}
            />
          </div>
        )}

        {/* Row 2 — wide horizontal */}
        {categories[2] && (
          <CategoryCard
            product={categories[2]}
            wide
            className="h-[300px] md:h-[240px]"
            imageClass="w-[200px] md:w-[260px] -bottom-6 right-8 md:-right-4"
            delay={0.08}
          />
        )}
      </div>
    </section>
  );
};

const CategoryCard = ({ product, className, imageClass, delay = 0, wide = false }) => {
  const theme = cardThemes[product.theme] || cardThemes[0];
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => product._id && navigate(`/products/${product._id}`)}
      className={`group relative overflow-hidden cursor-pointer border border-surface-border ${theme.border} rounded-[1.5rem] p-8 transition-colors duration-500 bg-gradient-to-tl ${theme.bg} via-transparent to-transparent ${className}`}
    >
      {/* Corner glow on hover */}
      <div className={`absolute inset-0 ${theme.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

      {/* Ghost category word */}
      <span
        aria-hidden
        className={`absolute font-black uppercase tracking-tighter text-warm-100/[0.04] leading-none select-none pointer-events-none ${
          wide ? 'right-10 bottom-4 text-6xl md:text-7xl' : 'top-7 right-7 text-5xl'
        }`}
      >
        {product.category}
      </span>

      {/* Copy */}
      <div className={`relative z-10 flex ${wide ? 'md:w-1/2 h-full flex-col items-start justify-center' : 'flex-col items-start justify-end h-full'}`}>
        <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] mb-2 ${theme.chip}`}>
          {product.label}
        </p>
        <h3 className="text-warm-100 text-2xl md:text-3xl font-bold tracking-tight max-w-[13ch]">
          {product.name}
        </h3>
        <p className="text-warm-500 text-sm mt-1 line-clamp-1 max-w-[22ch]">{product.meta}</p>

        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-warm-300 group-hover:text-gold transition-colors">
          Explore
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>

      {/* Product image */}
      <motion.img
        src={product.image}
        alt={product.name}
        initial={false}
        whileHover={{ scale: 1.05, y: -6 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`absolute ${imageClass} object-contain pointer-events-none transition-[filter] duration-500 group-hover:brightness-110 ${wide ? 'md:top-1/2 md:-translate-y-1/2' : ''}`}
        style={{ filter: "drop-shadow(0 24px 32px rgba(0,0,0,0.45))" }}
      />
    </motion.div>
  );
};

export default CategorySection;