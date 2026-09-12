import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { IoMdSearch } from 'react-icons/io';
import { HiMenuAlt3 } from 'react-icons/hi';
import { RiUser3Line, RiShoppingCartLine, RiCloseLine } from 'react-icons/ri';
import { SearchContext } from '../App';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const navigate = useNavigate();

  const cartCount = 0;

  const MenuLinks = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "Products", link: "/products" },
    { id: 3, name: "About Us", link: "/aboutus" },
    { id: 4, name: "Contact", link: "/contact" }
  ];

  const handleSearch = () => {
    setSearchTerm('');
  };

  const getLinkStyles = ({ isActive }) =>
    `relative text-sm font-medium tracking-wide transition-colors duration-300 ${
      isActive
        ? "text-warm-100"
        : "text-warm-500 hover:text-warm-100"
    }`;

  return (
    <nav className="bg-surface/85 backdrop-blur-xl sticky top-0 z-50 border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex justify-between items-center">
        
        {/* Logo Section */}
        <div className="flex items-center gap-12">
          <NavLink to="/" className="text-xl font-black tracking-tight text-warm-100 flex items-center gap-3">
            <span className="w-8 h-8 bg-gold rounded-md flex items-center justify-center text-surface text-sm font-black tracking-tight">E</span>
            <span className="uppercase tracking-widest text-sm font-bold">Ezbuy</span>
          </NavLink>

          <ul className="hidden md:flex items-center gap-8">
            {MenuLinks.map((item) => (
              <li key={item.id}>
                <NavLink to={item.link} className={getLinkStyles}>
                  {({ isActive }) => (
                    <>
                      {item.name}
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
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 lg:gap-5">
          
          {/* Search Bar */}
          <div className="relative group flex items-center">
            <input
              type="text"
              value={searchTerm}
              placeholder="Search"
              onFocus={() => setIsSearchActive(true)}
              onBlur={() => setTimeout(() => setIsSearchActive(false), 200)}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`
                bg-elevated text-warm-100 text-sm rounded-full py-2 pl-4 pr-10 outline-none 
                border border-surface-border transition-all duration-500
                focus:border-gold/60 focus:bg-surface
                ${isSearchActive ? "w-40 lg:w-64" : "w-28 lg:w-36"}
              `}
            />
            <button onClick={handleSearch} className="absolute right-3.5 text-lg text-warm-500">
              <IoMdSearch />
            </button>
          </div>

          {/* Cart Icon */}
          <NavLink to="/cart" className="relative p-2 text-warm-400 hover:text-gold transition-colors">
            <RiShoppingCartLine className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-gold text-surface text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </NavLink>

          {/* Login Button */}
          <button
            onClick={() => navigate("/login")}
            className="hidden sm:flex items-center justify-center p-2 text-warm-400 hover:text-gold hover:border-gold/40 border border-surface-border rounded-full bg-elevated/60 transition-all duration-300"
          >
            <RiUser3Line className="text-xl" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden text-warm-100 text-2xl"
          >
            <HiMenuAlt3 />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-surface/70 backdrop-blur-sm z-[60] md:hidden"
            />

            {/* Menu Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 h-full w-[70%] max-w-xs bg-surface-raised z-[70] border-l border-surface-border p-8 md:hidden"
            >
              <div className="flex justify-between items-center mb-14">
                <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="text-warm-400 text-2xl hover:text-warm-100">
                  <RiCloseLine />
                </button>
              </div>

              <ul className="flex flex-col gap-7">
                {MenuLinks.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={item.link}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `text-lg font-semibold tracking-tight transition-colors ${
                          isActive ? "text-gold" : "text-warm-100"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
                {/* Mobile Login Link */}
                <li className="pt-8 border-t border-surface-border">
                  <button
                    onClick={() => { navigate("/login"); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 text-warm-100 font-medium"
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