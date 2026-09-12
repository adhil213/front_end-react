import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProducts } from './ProductsContext';
import { fadeUp, revealInitial, revealFinal, viewportOnce } from './motionPresets';

const formatPrice = (p) => `\u20B9${Number(p || 0).toLocaleString('en-IN')}`;

const ProductMarquee = () => {
  const { products } = useProducts();
  const navigate = useNavigate();

  if (products.length === 0) return null;

  const items = [...products, ...products];

  return (
    <section className="bg-surface border-t border-surface-border py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-10 md:mb-12">
        <motion.div
          initial={revealInitial}
          whileInView={revealFinal}
          viewport={viewportOnce}
          transition={fadeUp}
        >
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.22em] mb-3">
            Fresh on the shelf
          </p>
          <h2 className="text-warm-100 text-3xl md:text-4xl font-black tracking-tight">
            What's new — take a look
          </h2>
        </motion.div>
      </div>

      {/* Infinite marquee */}
      <div className="group relative">
        <div className="flex w-max animate-marquee gap-5 pr-5 group-hover:[animation-play-state:paused]">
          {items.map((product, i) => (
            <button
              key={`${product._id}-${i}`}
              onClick={() => product._id && navigate(`/products/${product._id}`)}
              className="w-[220px] md:w-[260px] shrink-0 text-left group/card"
            >
              <div className="h-40 md:h-48 rounded-2xl border border-surface-border bg-surface-raised hover:border-gold/40 transition-colors duration-500 overflow-hidden flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-28 md:w-36 h-full object-contain transition-transform duration-500 group-hover/card:scale-105 group-hover/card:brightness-110"
                  style={{ filter: "drop-shadow(0 16px 24px rgba(0,0,0,0.35))" }}
                />
              </div>
              <p className="mt-4 text-warm-100 font-semibold tracking-tight truncate">
                {product.name}
              </p>
              <p className="text-warm-500 text-sm mt-0.5 truncate capitalize">{product.category}</p>
              <p className="text-gold font-bold mt-1.5 text-sm">{formatPrice(product.price)}</p>
            </button>
          ))}
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-28 bg-gradient-to-r from-surface to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-28 bg-gradient-to-l from-surface to-transparent" />
      </div>

      {/* CTA strip */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={revealInitial}
          whileInView={revealFinal}
          viewport={viewportOnce}
          transition={{ ...fadeUp, delay: 0.1 }}
          className="mt-10 md:mt-12 rounded-3xl border border-surface-border bg-surface-raised px-8 md:px-12 py-8 md:py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-warm-100 text-xl md:text-2xl font-bold tracking-tight">
              Ready when you are.
            </h3>
            <p className="text-warm-500 text-sm mt-1.5">
              Every item above ships free, returns on us.
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="group inline-flex items-center justify-center gap-2 bg-gold text-surface font-bold px-7 py-3.5 rounded-full hover:bg-gold-light active:scale-[0.98] transition-all duration-300 text-sm shrink-0"
          >
            Browse the collection
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductMarquee;