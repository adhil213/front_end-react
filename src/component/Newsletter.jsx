import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Add your email to join the list.');
      return;
    }
    toast.success('You’re on the list — check your inbox.');
    setEmail('');
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-surface">
      {/* Animated backdrop */}
      <div className="absolute -top-32 left-1/4 w-[28rem] h-[28rem] rounded-full bg-[radial-gradient(closest-side,rgba(201,168,76,0.14),transparent)] animate-breathe pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[26rem] h-[26rem] rounded-full bg-[radial-gradient(closest-side,rgba(110,140,190,0.12),transparent)] animate-breathe pointer-events-none" style={{ animationDelay: '1.4s' }} />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.24em] mb-4">
            The good list
          </p>
          <h2 className="text-warm-100 text-4xl md:text-5xl font-black tracking-tight mb-4">
            Get first dibs.
          </h2>
          <p className="text-warm-400 text-base md:text-lg leading-relaxed max-w-md mx-auto">
            New drops, restocks, and honest deals — once a week, never spam.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-9 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-elevated border border-surface-border rounded-full px-5 py-3.5 text-warm-100 text-sm outline-none placeholder:text-warm-600 focus:border-gold/60 transition-colors"
            />
            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-2 bg-gold text-surface font-bold px-7 py-3.5 rounded-full hover:bg-gold-light active:scale-[0.98] transition-all duration-300 text-sm"
            >
              Subscribe
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-4 text-warm-600 text-xs font-medium">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;