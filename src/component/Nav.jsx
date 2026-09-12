import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { IoMdSearch } from 'react-icons/io';
import { HiMenuAlt3 } from 'react-icons/hi';
import { RiUser3Line, RiShoppingCartLine, RiCloseLine } from 'react-icons/ri';
import { SearchContext } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import BrandMark from './BrandMark';

const Navbar = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const navigate = useNavigate();

  const cartCount = 0;

  const MenuLinks = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "Products", link: "/products" },
    { id: 3, name: "About", link: "/aboutus" },
    { id: 4, name: "Contact", link: "/contact" }
  ];

  const handleSearch = () => setSearchTerm('');

  return (
    <nav className="bg-surface/85 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between gap-6 border-b border-surface-border">
        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-3 shrink-0 group">
          <BrandMark />
          <span className="uppercase font-black tracking-[0.32em] text-warm-100 text-sm group-hover:text-gold transition-colors duration-300">
            Ezbuy
          </span>
        </NavLink>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-9">
          {MenuLinks.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.link}
                className="relative text-[11px] font-bold uppercase tracking-[0.22em] pb-1.5 transition-colors duration-300"
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? "text-gold" : "text-warm-500 hover:text-warm-100"}>
                      {item.name}
                    </span>
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300 ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Search */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchTerm}
              placeholder="Search"
              onFocus={() => setIsSearchActive(true)}
              onBlur={() => setTimeout(() => setIsSearchActive(false), 200)}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`
                bg-elevated text-warm-100 text-sm rounded-full py-2 pl-4 pr-9 outline-none
                border border-surface-border transition-all duration-500
                focus:border-gold/60 focus:bg-surface
                ${isSearchActive ? "w-44 lg:w-60" : "w-24 lg:w-32"}
              `}
            />
            <button
              onClick={handleSearch}
              aria-label="Search"
              className="absolute right-3 text-lg text-warm-500 hover:text-gold"
            >
              <IoMdSearch />
            </button>
          </div>

          {/* Cart */}
          <NavLink to="/cart" aria-label="Cart" className="relative p-1.5 text-warm-400 hover:text-gold transition-colors">
            <RiShoppingCartLine className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-gold text-surface text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </NavLink>

          {/* Account */}
          <button
            onClick={() => navigate("/login")}
            aria-label="Account"
            className="p-1.5 text-warm-400 hover:text-gold transition-colors"
          >
            <RiUser3Line className="text-xl" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className="md:hidden p-1 text-warm-100"
          >
            <HiMenuAlt3 className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-surface/70 backdrop-blur-sm z-[60] md:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 h-full w-[78%] max-w-xs bg-surface-raised z-[70] border-l border-surface-border p-8 md:hidden"
            >
              <div className="flex items-center justify-between mb-14">
                <NavLink to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                  <BrandMark className="w-8 h-8" iconClass="w-[18px] h-[18px]" />
                  <span className="uppercase font-black tracking-[0.32em] text-warm-100 text-xs">Ezbuy</span>
                </NavLink>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-1 text-warm-400 text-2xl hover:text-warm-100"
                >
                  <RiCloseLine />
                </button>
              </div>

              <ul className="flex flex-col gap-6">
                {MenuLinks.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={item.link}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `text-[13px] font-bold uppercase tracking-[0.22em] transition-colors ${
                          isActive ? "text-gold" : "text-warm-100"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
                <li className="pt-8 border-t border-surface-border">
                  <button
                    onClick={() => { navigate("/login"); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.22em] text-warm-100"
                  >
                    <RiUser3Line className="text-gold text-xl" /> Account
                  </button>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;