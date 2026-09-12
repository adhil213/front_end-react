import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RiPhoneLine, RiMailLine, RiMapPinLine } from 'react-icons/ri';
import { ArrowUpRight } from 'lucide-react';
import { fadeUp, revealInitial, revealFinal, viewportOnce } from '../component/motionPresets';

const ContactPage = () => {
  const navigate = useNavigate();

  const contactDetails = [
    {
      icon: RiPhoneLine,
      title: "Call us",
      value: "+91 98765 43210",
      label: "Mon–Sat, 10am–7pm IST",
    },
    {
      icon: RiMailLine,
      title: "Email us",
      value: "support@ezbuy.com",
      label: "Replies within one business day",
    },
    {
      icon: RiMapPinLine,
      title: "Our office",
      value: "123 Food Street, Sector 7G",
      label: "Bangalore, India",
    },
  ];

  return (
    <div className="min-h-screen bg-surface text-warm-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 md:pt-24 pb-20 md:pb-28">
        {/* Header */}
        <motion.div
          initial={revealInitial}
          whileInView={revealFinal}
          viewport={viewportOnce}
          transition={fadeUp}
          className="mb-14 md:mb-20 max-w-2xl"
        >
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.22em] mb-4">
            Get in touch
          </p>
          <h1 className="text-warm-100 text-4xl md:text-6xl font-black tracking-tight leading-[1.05]">
            Talk to a{" "}
            <span className="bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
              human.
            </span>
          </h1>
          <p className="text-warm-400 text-base md:text-lg leading-relaxed mt-5 max-w-lg">
            Questions about an order, a product, or a guarantee — real people
            answer, fast.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
          {/* Contact cards */}
          <div className="lg:col-span-7 space-y-5 md:space-y-6">
            {contactDetails.map((item, i) => (
              <motion.div
                key={item.title}
                initial={revealInitial}
                whileInView={revealFinal}
                viewport={viewportOnce}
                transition={{ ...fadeUp, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-[1.5rem] border border-surface-border bg-surface-raised p-7 md:p-9 hover:border-gold/40 transition-colors duration-500"
              >
                <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-[radial-gradient(closest-side,rgba(201,168,76,0.10),transparent)] pointer-events-none" />
                <div className="relative flex items-center gap-6">
                  <div className="shrink-0 w-14 h-14 rounded-2xl border border-surface-border bg-elevated flex items-center justify-center text-gold transition-colors duration-500 group-hover:border-gold/40 group-hover:bg-gold-muted">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xl md:text-2xl font-bold tracking-tight text-warm-100">
                      {item.value}
                    </p>
                    <p className="text-warm-500 text-sm mt-1">{item.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Response card */}
          <motion.div
            initial={revealInitial}
            whileInView={revealFinal}
            viewport={viewportOnce}
            transition={{ ...fadeUp, delay: 0.2 }}
            className="lg:col-span-5 relative overflow-hidden rounded-[1.5rem] border border-surface-border bg-surface-raised p-8 md:p-10 flex flex-col justify-between gap-10"
          >
            <div className="absolute -bottom-24 -right-16 w-64 h-64 rounded-full bg-[radial-gradient(closest-side,rgba(201,168,76,0.14),transparent)] animate-breathe pointer-events-none" />

            <div className="relative">
              <p className="text-gold text-[11px] font-semibold uppercase tracking-[0.2em] mb-4">
                Live support
              </p>
              <h2 className="text-warm-100 text-3xl md:text-4xl font-black tracking-tight">
                Fast answers,
                <br />
                no runaround.
              </h2>
              <p className="text-warm-400 text-sm leading-relaxed mt-5 max-w-sm">
                Bought something that's not quite right? Ask us before you send
                it back — we'll point you to the simpler fix.
              </p>
            </div>

            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-warm-300">
                  Usually replies within hours
                </span>
              </div>

              <button
                onClick={() => navigate("/products")}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-warm-300 hover:text-gold transition-colors"
              >
                Prefer browsing? Explore the collection
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;