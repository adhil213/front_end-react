import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Eye, ArrowUpRight } from 'lucide-react';
import { useProducts } from '../component/ProductsContext';
import BrandMark from '../component/BrandMark';
import { fadeUp, revealInitial, revealFinal, viewportOnce } from '../component/motionPresets';
import useDocumentMeta from '../hooks/useDocumentMeta';

const AboutUs = () => {
  const { products } = useProducts();
  const navigate = useNavigate();

  useDocumentMeta({
    title: 'About Ezbuy — Our Story, Mission & Values',
    description:
      'Ezbuy exists to take the guesswork out of buying gear. We test what we stock, price it honestly, and stand behind it with 30-day returns and a 2-year warranty.',
    path: '/aboutus',
  });

  const stats = useMemo(() => {
    const brands = new Set(products.map((p) => p.brand).filter(Boolean));
    return [
      { value: `${brands.size}+`, label: "Brands stocked" },
      { value: `${products.length}+`, label: "Products live" },
    ];
  }, [products]);

  const purposes = [
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: "Our mission",
      desc: "Curate hardware we'd buy ourselves — tested, honest pricing, and careful delivery to your door.",
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Our vision",
      desc: "The place people trust first for a gadget, because every product earns its place on the shelf.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Our values",
      desc: "Honest specs, easy returns, and support that actually answers. No fine print, no runaround.",
    },
  ];

  return (
    <div className="min-h-screen bg-surface text-warm-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 md:pt-24 pb-20 md:pb-28">
        {/* Hero */}
        <motion.div
          initial={revealInitial}
          whileInView={revealFinal}
          viewport={viewportOnce}
          transition={fadeUp}
          className="max-w-3xl"
        >
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.22em] mb-4">
            Our story
          </p>
          <h1 className="text-warm-100 text-4xl md:text-6xl font-black tracking-tight leading-[1.05]">
            Buy once.
            <br />
            <span className="bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
              Buy right.
            </span>
          </h1>
          <p className="text-warm-400 text-base md:text-lg leading-relaxed mt-6 max-w-xl">
            Ezbuy exists to take the guesswork out of buying gear. We test what
            we stock, price it honestly, and stand behind it.
          </p>
        </motion.div>

        {/* Story */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center">
          <motion.div
            initial={revealInitial}
            whileInView={revealFinal}
            viewport={viewportOnce}
            transition={fadeUp}
            className="relative overflow-hidden rounded-[1.5rem] border border-surface-border bg-surface-raised aspect-[4/3]"
          >
            <img
              src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1200"
              alt="Tech workspace"
              loading="lazy"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute bottom-5 left-5 rounded-2xl border border-surface-border bg-surface/80 backdrop-blur-md px-5 py-4">
              <p className="text-[10px] text-warm-500 uppercase tracking-widest mb-1">Established</p>
              <p className="text-gold font-black tracking-tight text-2xl">2019</p>
            </div>
          </motion.div>

          <motion.div
            initial={revealInitial}
            whileInView={revealFinal}
            viewport={viewportOnce}
            transition={{ ...fadeUp, delay: 0.1 }}
            className="space-y-6"
          >
            <h2 className="text-warm-100 text-3xl md:text-4xl font-black tracking-tight">
              From a frustrations
              <span className="text-warm-500">, to a shelf you can trust.</span>
            </h2>
            <div className="space-y-4 text-warm-400 leading-relaxed">
              <p>
                Ezbuy started with a simple frustration: finding quality,
                authentic tech gear was harder than it should be.
              </p>
              <p>
                What began as a small, carefully checked collection has grown
                into a store we'd actually shop ourselves — and we keep it that
                way, one product decision at a time.
              </p>
            </div>

            <div className="flex gap-10 pt-2">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl md:text-4xl font-black tracking-tight text-warm-100">
                    {stat.value}
                  </p>
                  <p className="text-warm-500 text-[10px] font-semibold uppercase tracking-[0.18em] mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Purpose */}
        <div className="mt-20 md:mt-28">
          <motion.div
            initial={revealInitial}
            whileInView={revealFinal}
            viewport={viewportOnce}
            transition={fadeUp}
            className="mb-10 md:mb-14"
          >
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.22em] mb-3">
              What we stand for
            </p>
            <h2 className="text-warm-100 text-3xl md:text-4xl font-black tracking-tight">
              Driven by purpose.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {purposes.map((item, i) => (
              <motion.div
                key={item.title}
                initial={revealInitial}
                whileInView={revealFinal}
                viewport={viewportOnce}
                transition={{ ...fadeUp, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-[1.5rem] border border-surface-border bg-surface-raised p-8 hover:border-gold/40 transition-colors duration-500"
              >
                <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[radial-gradient(closest-side,rgba(201,168,76,0.10),transparent)] pointer-events-none" />
                <div className="w-12 h-12 rounded-2xl border border-surface-border bg-elevated flex items-center justify-center text-gold mb-7 transition-colors duration-500 group-hover:border-gold/40 group-hover:bg-gold-muted">
                  {item.icon}
                </div>
                <h3 className="text-warm-100 text-xl font-bold tracking-tight mb-3">
                  {item.title}
                </h3>
                <p className="text-warm-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* The team */}
        <div className="mt-20 md:mt-28">
          <motion.div
            initial={revealInitial}
            whileInView={revealFinal}
            viewport={viewportOnce}
            transition={fadeUp}
            className="mb-10 md:mb-14 flex flex-wrap items-end justify-between gap-4"
          >
            <div>
              <p className="text-gold text-xs font-semibold uppercase tracking-[0.22em] mb-3">
                The humans
              </p>
              <h2 className="text-warm-100 text-3xl md:text-4xl font-black tracking-tight">
                Run by people who shop here.
              </h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            <motion.div
              initial={revealInitial}
              whileInView={revealFinal}
              viewport={viewportOnce}
              transition={fadeUp}
              className="group"
            >
              <div className="relative rounded-[1.5rem] border border-surface-border bg-surface-raised hover:border-gold/40 transition-colors duration-500 aspect-[4/5] overflow-hidden flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center text-surface text-3xl font-black tracking-tight">
                  A
                </div>
                <h4 className="text-warm-100 text-xl font-bold tracking-tight">
                  Adhil
                </h4>
                <p className="text-warm-500 text-[10px] font-semibold uppercase tracking-[0.2em]">
                  Founder &amp; CEO
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={revealInitial}
          whileInView={revealFinal}
          viewport={viewportOnce}
          transition={{ ...fadeUp, delay: 0.05 }}
          className="mt-20 md:mt-28 relative overflow-hidden rounded-[1.5rem] border border-surface-border bg-surface-raised p-10 md:p-16"
        >
          <div className="absolute -top-24 left-1/4 w-80 h-80 rounded-full bg-[radial-gradient(closest-side,rgba(201,168,76,0.14),transparent)] animate-breathe pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="text-warm-100 text-3xl md:text-4xl font-black tracking-tight">
                See what's on the shelf.
              </h2>
              <p className="text-warm-400 text-sm md:text-base leading-relaxed mt-3 max-w-md">
                Real products, honest prices, and support that answers.
              </p>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="group inline-flex items-center justify-center gap-2 bg-gold text-surface font-bold px-8 py-4 rounded-full hover:bg-gold-light active:scale-[0.98] transition-all duration-300 text-sm shrink-0"
            >
              Browse the collection
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </motion.div>

        {/* Signature */}
        <div className="relative mt-16 md:mt-24 overflow-hidden pointer-events-none select-none" aria-hidden="true">
          <div className="flex items-center justify-center gap-6">
            <BrandMark className="w-8 h-8" iconClass="w-4 h-4" />
            <span className="text-warm-100/[0.06] font-black uppercase tracking-[0.5em] text-3xl md:text-5xl">
              Ezbuy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;