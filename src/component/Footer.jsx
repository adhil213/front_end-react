import React from 'react';
import { Link } from 'react-router-dom';
import { RiInstagramLine, RiTwitterLine, RiGithubLine } from 'react-icons/ri';

const Footer = () => {
  return (
    <footer className="w-full bg-surface-raised border-t border-surface-border py-14 px-6 lg:px-12 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Section */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-gold rounded-md flex items-center justify-center text-surface text-sm font-black tracking-tight">
                E
              </span>
              <span className="text-warm-100 text-sm font-bold uppercase tracking-widest">
                Ezbuy
              </span>
            </div>
            <p className="text-warm-500 text-sm font-medium leading-relaxed max-w-sm">
              A considered store for the gadgets you actually want. Curated hardware, honest pricing, careful delivery.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h3 className="text-warm-100 text-xs font-semibold uppercase tracking-[0.2em] mb-4">Browse</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-warm-500 hover:text-gold text-sm transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-warm-500 hover:text-gold text-sm transition-colors">Products</Link></li>
              <li><Link to="/orders" className="text-warm-500 hover:text-gold text-sm transition-colors">Orders</Link></li>
              <li><Link to="/aboutus" className="text-warm-500 hover:text-gold text-sm transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="md:col-span-4 space-y-6">
            <div className="space-y-2">
              <h3 className="text-warm-100 text-xs font-semibold uppercase tracking-[0.2em] mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link to="/contact" className="text-warm-500 hover:text-gold text-sm transition-colors">Contact Us</Link></li>
                <li><span className="text-warm-500 text-sm cursor-default">Privacy Policy</span></li>
                <li><span className="text-warm-500 text-sm cursor-default">Terms of Service</span></li>
              </ul>
            </div>

            <div className="flex items-center gap-2">
              <a href="#" className="p-2.5 bg-elevated rounded-lg text-warm-500 hover:text-gold border border-surface-border transition-colors">
                <RiInstagramLine size={16} />
              </a>
              <a href="#" className="p-2.5 bg-elevated rounded-lg text-warm-500 hover:text-gold border border-surface-border transition-colors">
                <RiTwitterLine size={16} />
              </a>
              <a href="#" className="p-2.5 bg-elevated rounded-lg text-warm-500 hover:text-gold border border-surface-border transition-colors">
                <RiGithubLine size={16} />
              </a>
              <span className="ml-auto text-warm-500 text-sm font-medium">support@ezbuy.com</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-surface-border flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[10px] font-semibold text-warm-600 uppercase tracking-[0.25em]">
            &copy; 2026 Ezbuy. All rights reserved.
          </p>
          <p className="text-[10px] font-semibold text-warm-600 uppercase tracking-[0.25em]">
            Crafted with care
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;