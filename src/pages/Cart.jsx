import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { RiDeleteBin6Line, RiAddLine, RiSubtractLine, RiShoppingBag3Line, RiShieldCheckLine } from "react-icons/ri";
import useDocumentMeta from "../hooks/useDocumentMeta";

const fmt = (n) => `\u20B9${Number(n || 0).toLocaleString("en-IN")}`;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useDocumentMeta({ title: "Your Cart", path: "/cart", noindex: true });

  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`https://backend-sk0h.onrender.com/cart/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setCartItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQty = async (productId, delta) => {
    const item = cartItems.find((i) => i._id === productId);

    const newQty = item.qty + delta;

    if (newQty < 1 || newQty > item.stock) return;

    const updated = cartItems.map((i) =>
      i._id === productId ? { ...i, qty: newQty } : i,
    );

    setCartItems(updated);

    const token = localStorage.getItem("token");

    await fetch("https://backend-sk0h.onrender.com/cart/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        qty: newQty,
      }),
    });
  };
  const removeItem = async (productId) => {
    setCartItems(cartItems.filter((item) => item._id !== productId));

    const token = localStorage.getItem("token");

    await fetch("https://backend-sk0h.onrender.com/cart/remove", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
      }),
    });
  };
  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
    [cartItems],
  );
  const deliveryFee = subtotal > 1500 || subtotal === 0 ? 0 : 10;
  const total = subtotal + deliveryFee;
  const hasOutOfStock = cartItems.some((item) => item.stock === 0);
  if (isLoading)
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <span className="text-gold font-bold animate-pulse text-sm uppercase tracking-[0.3em]">
          Syncing bag...
        </span>
      </div>
    );
  if (cartItems.length === 0) {
    return (
      <div className="bg-surface min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-24 h-24 rounded-2xl border border-surface-border bg-surface-raised flex items-center justify-center text-gold mb-8">
          <RiShoppingBag3Line size={48} />
        </div>
        <h2 className="text-warm-100 text-3xl font-black tracking-tight mb-2">
          Your bag is empty
        </h2>
        <p className="text-warm-500 text-sm mb-8">
          Browse the collection and find something worth keeping.
        </p>
        <Link
          to="/products"
          className="bg-gold text-surface px-10 py-4 rounded-full font-bold hover:bg-gold-light transition-colors text-sm uppercase tracking-wider"
        >
          Explore store
        </Link>
      </div>
    );
  }
  return (
    <div className="bg-surface text-warm-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 md:pt-16 pb-20 md:pb-28">
        <div className="mb-10">
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.22em] mb-3">
            Your items
          </p>
          <h1 className="text-warm-100 text-4xl md:text-5xl font-black tracking-tight">
            Shopping bag
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-surface-raised border border-surface-border rounded-2xl p-4 md:p-5 flex items-center gap-4 md:gap-6"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-elevated flex items-center justify-center p-2 shrink-0 relative overflow-hidden">
                    {item.stock === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-red-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-md z-10">
                        Out of stock
                      </span>
                    )}
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/200x200/1a1a1f/e8e6e1?text=Ezbuy";
                      }}
                      className="max-h-full w-auto object-contain"
                    />
                  </div>

                  <div className="flex-grow min-w-0">
                    <p className="text-gold text-[10px] font-bold uppercase tracking-[0.18em]">
                      {item.brand}
                    </p>
                    <h3 className="text-warm-100 font-bold leading-tight truncate mt-0.5">
                      {item.name}
                    </h3>
                    <p className="text-warm-100 font-black text-lg mt-1.5">
                      {fmt(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center bg-elevated border border-surface-border rounded-full overflow-hidden h-9">
                      <button
                        onClick={() => updateQty(item._id, -1)}
                        aria-label="Decrease quantity"
                        className="px-3 h-full text-warm-400 hover:text-gold transition-colors"
                      >
                        <RiSubtractLine />
                      </button>
                      <span className="px-3 font-black text-warm-100 min-w-[1.5rem] text-center text-sm">
                        {item.qty}
                      </span>
                      <button
                        disabled={item.qty >= item.stock}
                        onClick={() => updateQty(item._id, 1)}
                        aria-label="Increase quantity"
                        className="px-3 h-full text-warm-400 hover:text-gold disabled:text-warm-600 disabled:cursor-not-allowed transition-colors"
                      >
                        <RiAddLine />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      aria-label="Remove item"
                      className="text-warm-500 hover:text-red-400 transition-colors"
                    >
                      <RiDeleteBin6Line size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ORDER SUMMARY */}
          <aside className="bg-surface-raised border border-surface-border rounded-2xl p-6 md:p-8 lg:sticky lg:top-24">
            <h3 className="font-black text-lg tracking-tight mb-6 flex items-center gap-2">
              <RiShieldCheckLine className="text-gold" />
              Order summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-500">Subtotal</span>
                <span className="text-warm-100 font-bold">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-500">Shipping</span>
                <span className="text-warm-100 font-bold">
                  {deliveryFee === 0 ? "FREE" : fmt(deliveryFee)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-surface-border">
              <span className="text-warm-500 text-sm">Total</span>
              <span className="text-warm-100 text-3xl font-black tracking-tight">
                {fmt(total)}
              </span>
            </div>

            {hasOutOfStock && (
              <p className="text-xs text-red-400 mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 font-bold">
                Some items are out of stock. Remove them to continue.
              </p>
            )}

            <button
              disabled={hasOutOfStock}
              onClick={() => navigate("/payment")}
              className="w-full bg-gold text-surface font-bold py-4 rounded-full hover:bg-gold-light active:scale-[0.98] transition-all mt-6 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Checkout
            </button>

            <p className="text-warm-600 text-[11px] text-center mt-4">
              Free shipping on orders {`\u20B9`}1,500+
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;