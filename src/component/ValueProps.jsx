import React from 'react';
import { motion } from 'framer-motion';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';
import { fadeUp, revealInitial, revealFinal, viewportOnce } from './motionPresets';

const items = [
  {
    icon: Truck,
    title: 'Free express shipping',
    text: 'On every order, no minimums or fine print.',
  },
  {
    icon: RotateCcw,
    title: '30-day returns',
    text: 'Changed your mind? Send it back, on us.',
  },
  {
    icon: ShieldCheck,
    title: '2-year warranty',
    text: 'Coverage on every product we sell.',
  },
  {
    icon: Headphones,
    title: 'Human support',
    text: 'Real people who answer, in minutes.',
  },
];

const ValueProps = () => {
  return (
    <section className="py-14 md:py-20 bg-surface border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={revealInitial}
              whileInView={revealFinal}
              viewport={viewportOnce}
              transition={{ ...fadeUp, delay: i * 0.08 }}
              className="group"
            >
              <div className="w-12 h-12 rounded-2xl border border-surface-border bg-elevated flex items-center justify-center text-gold mb-5 transition-colors duration-300 group-hover:border-gold/40 group-hover:bg-gold-muted">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-warm-100 font-bold tracking-tight mb-1.5">{item.title}</h3>
              <p className="text-warm-500 text-sm leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;