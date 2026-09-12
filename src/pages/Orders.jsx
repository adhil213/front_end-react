import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  RiShoppingBagLine,
  RiCloseCircleLine,
  RiCalendarLine,
  RiHashtag,
  RiMapPinUserLine,
} from "react-icons/ri";
import toast from "react-hot-toast";

const fmt = (n) => `\u20B9${Number(n || 0).toLocaleString("en-IN")}`;

const statusBadge =
  "inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`https://backend-sk0h.onrender.com/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (loggedInUser?._id) {
      fetchOrders();
    }
  }, [loggedInUser?._id]);

  const cancelOrder = async (orderId) => {
    try {
      toast.loading("Updating system...");

      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://backend-sk0h.onrender.com/orders/cancel",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: orderId,
          }),
        },
      );

      if (!res.ok) {
        throw new Error();
      }

      const updatedOrders = orders.filter((o) => o.orderId !== orderId);

      setOrders(updatedOrders);

      toast.dismiss();
      toast.success("Order cancelled");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <span className="text-gold font-bold animate-pulse text-sm uppercase tracking-[0.3em]">
          Syncing order history...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-surface text-warm-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-10 md:pt-16 pb-20 md:pb-28">
        <header className="mb-10">
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.22em] mb-3">
            Your account
          </p>
          <h1 className="text-warm-100 text-4xl md:text-5xl font-black tracking-tight">
            Order history
          </h1>
        </header>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-2 border-dashed border-surface-border rounded-3xl py-20 flex flex-col items-center justify-center text-center px-6"
          >
            <div className="w-20 h-20 rounded-2xl border border-surface-border bg-surface-raised flex items-center justify-center text-gold mb-6">
              <RiShoppingBagLine size={40} />
            </div>
            <h2 className="text-warm-100 text-xl font-bold tracking-tight">
              No orders yet
            </h2>
            <p className="text-warm-500 text-sm mt-1 mb-6">
              Your purchases will appear here once you check out.
            </p>
            <Link
              to="/products"
              className="bg-gold text-surface px-8 py-3.5 rounded-full font-bold hover:bg-gold-light transition-colors text-xs uppercase tracking-wider"
            >
              Start shopping
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {orders.map((order) => (
                <motion.div
                  key={order.orderId}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-surface-raised border border-surface-border rounded-2xl p-6 md:p-8 relative overflow-hidden"
                >
                  <span className="absolute -right-2 -bottom-6 text-[88px] font-black text-warm-100/[0.03] pointer-events-none select-none tracking-tight">
                    {order.orderId?.split("-")[1]?.slice(-4)}
                  </span>

                  <div className="flex flex-wrap justify-between items-start gap-4 mb-8 relative z-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gold text-[10px] font-black uppercase tracking-[0.2em]">
                        <RiHashtag /> {order.orderId}
                      </div>

                      <div className="flex items-center gap-2 text-warm-500 text-xs font-bold">
                        <RiCalendarLine className="text-gold" /> {order.date}
                      </div>

                      {order.address && (
                        <div className="flex items-center gap-2 text-warm-600 text-[10px] font-bold uppercase tracking-widest">
                          <RiMapPinUserLine className="text-gold" />
                          {order.address.city}, {order.address.country || "USA"}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`${statusBadge} ${
                          order.status === "Delivered"
                            ? "text-gold border-gold/30 bg-gold/10"
                            : "text-warm-300 border-surface-border bg-elevated"
                        }`}
                      >
                        {order.status || "In Progress"}
                      </span>

                      <span className="text-[10px] text-warm-600 font-bold uppercase tracking-widest">
                        Method: {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 bg-elevated p-3 rounded-xl border border-surface-border"
                      >
                        <div className="w-12 h-12 rounded-lg bg-surface-raised flex items-center justify-center p-1.5 shrink-0">
                          <img
                            src={item.productId?.image}
                            alt=""
                            onError={(e) => {
                              e.target.src = "https://placehold.co/80x80/1a1a1f/e8e6e1?text=E";
                            }}
                            className="max-h-full object-contain"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate text-warm-100">
                            {item.productId?.name}
                          </p>
                          <p className="text-[10px] text-gold font-black mt-0.5">
                            {item.qty} × {fmt(item.productId?.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap justify-between items-center gap-4 pt-6 border-t border-surface-border">
                    <div className="flex flex-col">
                      <span className="text-warm-600 text-[10px] font-black uppercase tracking-[0.25em]">
                        Order total
                      </span>
                      <h3 className="text-3xl font-black tracking-tight mt-1">
                        {fmt(order.totalAmount || order.total)}
                      </h3>
                    </div>

                    <button
                      disabled={order.status === "Delivered"}
                      onClick={() => cancelOrder(order.orderId)}
                      className={`flex items-center gap-2 px-7 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.18em] transition-all ${
                        order.status === "Delivered"
                          ? "bg-elevated text-warm-600 cursor-not-allowed border border-surface-border"
                          : "text-red-400 border border-red-500/25 bg-red-500/5 hover:bg-red-500 hover:text-surface"
                      }`}
                    >
                      <RiCloseCircleLine size={16} className="transition-transform group-hover:rotate-90" />
                      Cancel order
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;