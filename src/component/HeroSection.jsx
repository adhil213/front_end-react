import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowDownRight } from 'lucide-react';

const ROTATE_MS = 5000;

const formatPrice = (p) => `\u20B9${Number(p || 0).toLocaleString('en-IN')}`;

const HeroSection = ({ onLoad }) => {
  const [products, setProducts] = useState([]);
  const [tickerItems, setTickerItems] = useState([]);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [rotating, setRotating] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://backend-sk0h.onrender.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data.slice(0, 3));
        setTickerItems(data.data);
        setLoaded(true);
        onLoad?.();
      })
      .catch((err) => {
        console.error("Error fetching hero data:", err);
        setLoaded(true);
        onLoad?.();
      });
  }, []);

  useEffect(() => {
    if (!rotating || products.length === 0) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % products.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [rotating, products.length]);

  const current = products[active];
  const categoryWord = useMemo(
    () => (current?.category || 'shop').toUpperCase(),
    [current]
  );

  const handleNavigate = useCallback((path) => () => navigate(path), [navigate]);

  if (!loaded) return null;

  return (
    <section className="relative bg-surface overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-24 right-0 w-[38rem] h-[38rem] rounded-full bg-[radial-gradient(closest-side,rgba(201,168,76,0.12),transparent)] animate-breathe pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[30rem] h-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(110,140,190,0.08),transparent)] pointer-events-none" />

      {/* Ghost category word */}
      {current && (
        <span
          aria-hidden
          className="hidden md:block absolute right-6 bottom-16 text-[11rem] xl:text-[14rem] font-black tracking-tighter text-warm-100/[0.025] leading-none select-none pointer-events-none animate-drift"
        >
          {categoryWord}
        </span>
      )}

      {/* Hero grid */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-14 lg:pt-20 pb-16 lg:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* ------ Left: editorial copy ------ */}
        <div className="relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-gold mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Curated electronics
          </motion.span>

          <h1 className="text-warm-100 text-5xl md:text-6xl xl:text-7xl font-black tracking-[-0.03em] leading-[1.04]">
            {['Buy once.', 'Buy right.'].map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className={`block pb-1 ${i === 1 ? 'bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent' : ''}`}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-warm-400 text-base md:text-lg leading-relaxed max-w-md"
          >
            Headphones, phones, and laptops we’ve tested and stand behind — with easy returns and support that actually answers.
          </motion.p>

          {/* Rotating product block */}
          <div className="mt-9 min-h-[150px]">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-[11px] font-semibold uppercase tracking-[0.24em] text-warm-500 mb-3"
            >
              Now featuring
            </motion.p>
            <AnimatePresence mode="popLayout">
              {current && (
                <motion.div
                  key={current._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => setRotating(false)}
                  onMouseLeave={() => setRotating(true)}
                  className="flex flex-wrap items-end gap-x-6 gap-y-4"
                >
                  <div>
                    <p className="text-warm-500 text-sm font-medium uppercase tracking-[0.18em] mb-1">
                      {current.brand}
                    </p>
                    <h2 className="text-warm-100 text-2xl md:text-3xl font-bold tracking-tight">
                      {current.name}
                    </h2>
                    <p className="text-warm-500 text-sm mt-1 max-w-xs line-clamp-1">
                      {current.description}
                    </p>
                  </div>

                  <div className="pb-1">
                    <button
                      onClick={handleNavigate(`/products/${current._id}`)}
                      className="group inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-light transition-colors"
                    >
                      View product
                      <ArrowDownRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-10 pt-6 border-t border-surface-border flex flex-wrap gap-x-8 gap-y-3"
          >
            {[
              ['4.9 / 5', '12,000+ reviews'],
              ['2 yr', 'warranty'],
              ['Free', 'express shipping'],
            ].map(([big, small]) => (
              <div key={small} className="flex items-baseline gap-2">
                <span className="text-warm-100 text-lg font-bold tracking-tight">{big}</span>
                <span className="text-warm-500 text-xs font-medium uppercase tracking-wider">{small}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ------ Right: product stage ------ */}
        <div className="relative lg:border-l border-surface-border lg:pl-10 flex items-center justify-center">
          <div className="relative w-full max-w-sm aspect-square">
            {/* Rings */}
            <div className="absolute inset-0 rounded-full border border-warm-100/[0.05] animate-spin-slow">
              <span className="absolute top-6 right-8 w-1.5 h-1.5 rounded-full bg-gold/60" />
            </div>
            <div className="absolute inset-6 rounded-full border border-warm-100/[0.03]" />
            <div className="absolute inset-16 rounded-full bg-[radial-gradient(closest-side,rgba(201,168,76,0.08),transparent)] animate-breathe" />

            {/* Product image */}
            <AnimatePresence mode="popLayout">
              {current && (
                <motion.img
                  key={current._id}
                  src={current.image}
                  alt={current.name}
                  initial={{ opacity: 0, x: 40, scale: 0.92, rotate: -2 }}
                  animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, x: -30, scale: 0.96 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))" }}
                />
              )}
            </AnimatePresence>

            {/* Floating badges */}
            <AnimatePresence>
              {current && (
                <>
                  <motion.div
                    key={`price-${current._id}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    className="absolute top-0 left-2 bg-surface-raised border border-gold/25 rounded-2xl px-4 py-2.5 animate-float"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-warm-500">From</p>
                    <p className="text-gold font-bold text-lg leading-tight">{formatPrice(current.price)}</p>
                  </motion.div>

                  <motion.div
                    key={`tag-${current._id}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                    className="absolute bottom-2 right-0 bg-surface-raised border border-surface-border rounded-full px-4 py-2 animate-float-slow"
                  >
                    <span className="text-xs font-semibold tracking-wide text-warm-300">
                      {current.tag || current.category}
                    </span>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Progress dots */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {products.map((p, i) => (
                <button
                  key={p._id}
                  onClick={() => setActive(i)}
                  aria-label={`Show ${p.name}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === active ? 'w-6 bg-gold' : 'w-1.5 bg-warm-600 hover:bg-warm-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ------ Price tape ------ */}
      <div className="relative border-y border-surface-border bg-surface-raised overflow-hidden">
        {/* Fixed live label */}
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center gap-3 pl-6 lg:pl-10 pr-8 bg-gradient-to-r from-surface-raised via-surface-raised to-transparent">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-warm-300">
            Price tape
          </span>
        </div>

        {/* Right edge fade */}
        <div className="absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-surface-raised to-transparent" />

        {/* Scrolling quotes */}
        <div className="group">
          <div className="flex w-max animate-marquee py-4 group-hover:[animation-play-state:paused]">
            {tickerItems.length > 0 && [0, 1].map((copy) => (
              <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
                {tickerItems.map((p) => (
                  <span key={p._id} className="flex items-center">
                    <span className="mx-7 flex items-center text-sm">
                      <span className="font-bold uppercase tracking-[0.2em] text-warm-100">
                        {p.brand || p.category}
                      </span>
                      <span className="text-warm-600 mx-3">·</span>
                      <span className="text-warm-400 max-w-[16ch] truncate">{p.name}</span>
                      <span className="text-gold font-bold ml-6">{formatPrice(p.price)}</span>
                    </span>
                    <span className="text-gold/40 text-xs">◆</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;