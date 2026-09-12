import { useState } from "react";
import { MdPerson } from "react-icons/md";
import { Outlet, NavLink } from "react-router-dom";
import {
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiListBullet,
  HiPlusCircle,
  HiSquares2X2,
  HiBars3,
  HiXMark,
} from "react-icons/hi2";

export const Admin = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
      isActive
        ? "bg-gold text-surface"
        : "text-warm-500 hover:bg-surface-raised hover:text-warm-100"
    }`;

  return (
    <>
      <div className="flex min-h-screen bg-surface">
        {/* Mobile Menu Button - Moved slightly lower to avoid overlapping fixed navbars */}
        <div className="lg:hidden fixed top-24 left-4 z-50">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-gold text-surface shadow-lg active:scale-95 transition-transform hover:bg-gold-light"
          >
            {isOpen ? <HiXMark size={22} /> : <HiBars3 size={22} />}
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-surface transition-transform duration-300 transform 
            lg:relative lg:translate-x-0 lg:mt-0
            /* THIS IS THE FIX: Added margin-top and adjusted height for mobile */
            mt-20 h-[calc(100vh-5rem)] lg:h-screen 
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-3 px-4 py-5 border-b border-surface-border">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gold/10 border border-gold/20">
                <MdPerson size={18} className="text-gold" />
              </div>
              <div className="flex flex-col leading-tight">
                <h2 className="text-sm font-bold text-warm-100">Administrator</h2>
                <p className="text-xs text-warm-500">System Manager</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1" onClick={() => setIsOpen(false)}>
              <NavLink to="dashboard" className={linkCls}>
                <HiSquares2X2 size={18} /> Dashboard
              </NavLink>
              <NavLink to="add-product" className={linkCls}>
                <HiPlusCircle size={18} /> Add product
              </NavLink>
              <NavLink to="list-products" className={linkCls}>
                <HiListBullet size={18} /> List Products
              </NavLink>
              <NavLink to="orders" className={linkCls}>
                <HiOutlineShoppingBag size={18} /> Order Management
              </NavLink>
              <NavLink to="users" className={linkCls}>
                <HiOutlineUsers size={18} /> Users
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Content Area */}
        <div className="flex-1 h-auto overflow-x-hidden pt-20 lg:pt-0">
          <Outlet />
        </div>
      </div>
    </>
  );
};