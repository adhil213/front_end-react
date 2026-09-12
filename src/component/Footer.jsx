import React from 'react';
import { Link } from 'react-router-dom';
import { RiInstagramLine, RiTwitterLine, RiGithubLine } from 'react-icons/ri';
import BrandMark from './BrandMark';

const Footer = () => {
  return (
    <footer className="bg-surface-raised border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 md:pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-10">
          {/* Brand */}
          <div className="lg:col-span-5 space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <BrandMark />
              <span className="text-warm-100 font-black uppercase tracking-[0.32em] text-sm group-hover:text-gold transition-colors duration-300">
                Ezbuy
              </span>
            </Link>
            <p className="text-warm-500 text-sm font-medium leading-relaxed max-w-xs">
              A considered store for the gadgets you actually want. Curated hardware, honest pricing, careful delivery.
            </p>
            <div className="flex items-center gap-2">
              <a href="#" aria-label="Instagram" className="p-2.5 bg-elevated rounded-lg text-warm-500 hover:text-gold hover:border-gold/40 border border-surface-border transition-colors">
                <RiInstagramLine size={16} />
              </a>
              <a href="#" aria-label="Twitter" className="p-2.5 bg-elevated rounded-lg text-warm-500 hover:text-gold hover:border-gold/40 border border-surface-border transition-colors">
                <RiTwitterLine size={16} />
              </a>
              <a href="#" aria-label="GitHub" className="p-2.5 bg-elevated rounded-lg text-warm-500 hover:text-gold hover:border-gold/40 border border-surface-border transition-colors">
                <RiGithubLine size={16} />
              </a>
            </div>
          </div>

          {/* Browse */}
          <div className="lg:col-span-2 space-y-2">
            <h3 className="text-warm-100 text-xs font-bold uppercase tracking-[0.22em] mb-5">Browse</h3>
            <ul className="space-y-3.5">
              <li><Link to="/" className="text-warm-500 hover:text-gold text-sm transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-warm-500 hover:text-gold text-sm transition-colors">Products</Link></li>
              <li><Link to="/orders" className="text-warm-500 hover:text-gold text-sm transition-colors">Orders</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2 space-y-2">
            <h3 className="text-warm-100 text-xs font-bold uppercase tracking-[0.22em] mb-5">Support</h3>
            <ul className="space-y-3.5">
              <li><Link to="/contact" className="text-warm-500 hover:text-gold text-sm transition-colors">Contact Us</Link></li>
              <li><span className="text-warm-500 text-sm cursor-default">Privacy Policy</span></li>
              <li><span className="text-warm-500 text-sm cursor-default">Terms of Service</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 space-y-2">
            <h3 className="text-warm-100 text-xs font-bold uppercase tracking-[0.22em] mb-5">Contact</h3>
            <div className="space-y-3.5">
              <a href="mailto:support@ezbuy.com" className="text-warm-500 hover:text-gold text-sm transition-colors">
                support@ezbuy.com
              </a>
              <p className="text-warm-500 text-sm font-medium">+91 98765 43210</p>
              <p className="text-warm-600 text-xs leading-relaxed max-w-[22ch]">
                Replies within one business day.
              </p>
            </div>
          </div>
        </div>

        {/* Signature wordmark */}
        <div className="relative mt-14 md:mt-20 overflow-hidden pointer-events-none select-none" aria-hidden="true">
          <span className="block text-center font-black tracking-tighter text-[22vw] md:text-[17rem] leading-[0.78] text-warm-100/[0.035]">
            EZBUY
          </span>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-6 border-t border-surface-border flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[10px] font-semibold text-warm-600 uppercase tracking-[0.25em]">
            &copy; 2026 Ezbuy. All rights reserved.
          </p>
          <p className="text-[10px] font-semibold text-warm-600 uppercase tracking-[0.25em]">
            Buy once. Buy right.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;