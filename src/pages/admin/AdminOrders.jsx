import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllUsersAndOrders = () => {
    const token = localStorage.getItem("token");

    fetch("https://backend-sk0h.onrender.com/all/userorder", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // const usersArray = Array.isArray(data) ? data : data.users || [];
        // let allOrders = [];

        // usersArray.forEach((user) => {
        //   if (user.orders && Array.isArray(user.orders)) {
        //     user.orders.forEach((order) => {
        //       allOrders.push({
        //         ...order,
        //         userId: user.id,
        //         userName: user.name,
        //         userEmail: user.email,
        //       });
        //     });
        //   }
        // });

        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAllUsersAndOrders();
  }, []);

  const handleStatusChange = async (userId, orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://backend-sk0h.onrender.com/all/order-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({
          userId,
          orderId,
          status: newStatus,
        }),
      });

      if (!res.ok) throw new Error();

      // update UI
      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order,
        ),
      );

      toast.success(`Order updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Shipped":
        return "bg-gold/10 text-gold border-gold/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-surface text-warm-500 font-medium">
        Loading Orders Dashboard...
      </div>
    );

  return (
    <div className="bg-surface min-h-screen py-4 md:py-10 px-4 w-full text-white font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
              Order Management
            </h1>
            <p className="text-warm-600 text-sm mt-1">
              Real-time customer transactions overview
            </p>
          </div>
          <div className="bg-surface-raised px-6 py-3 rounded-2xl border border-surface-border shadow-xl w-full md:w-auto text-center">
            <span className="text-warm-500 text-xs font-bold uppercase tracking-wider">
              Total Volume:{" "}
            </span>
            <span className="text-gold font-black ml-2">
              {orders.length}
            </span>
          </div>
        </header>

        <div className="space-y-8">
          {orders.map((order, idx) => (
            <div
              key={`${order.orderId}-${idx}`}
              className="bg-surface-raised rounded-2xl shadow-2xl border border-surface-border overflow-hidden transition-all hover:border-gold/40"
            >
              <div className="bg-elevated/50 px-5 py-4 flex flex-col sm:flex-row justify-between gap-4 border-b border-surface-border">
                <div className="flex items-center gap-4">
                  <div className="bg-surface p-2 rounded-xl border border-surface-border text-center min-w-[90px]">
                    <p className="text-[9px] uppercase font-bold text-warm-600 mb-1">
                      Order Ref
                    </p>
                    <p className="text-xs font-mono font-bold text-gold">
                      {order.orderId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {order.user?.name}
                    </p>
                    <p className="text-xs text-warm-600">{order.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] uppercase font-bold text-warm-600 mb-1">
                      Timestamp
                    </p>
                    <p className="text-xs font-medium text-warm-300">
                      {order.date}
                    </p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(
                        order.user.userId,
                        order.orderId,
                        e.target.value,
                      )
                    }
                    className={`text-[11px] font-black py-2 px-4 rounded-xl border outline-none bg-transparent cursor-pointer transition-all ${getStatusColor(order.status)}`}
                  >
                    <option value="Processing" className="bg-surface-raised">
                      Processing
                    </option>
                    <option value="Shipped" className="bg-surface-raised">
                      Shipped
                    </option>
                    <option value="Delivered" className="bg-surface-raised">
                      Delivered
                    </option>
                    <option value="Cancelled" className="bg-surface-raised">
                      Cancelled
                    </option>
                  </select>
                </div>
              </div>

              <div className="p-5 md:p-8">
                <div className="hidden md:grid grid-cols-4 text-[10px] uppercase font-bold text-warm-600 border-b border-surface-border pb-3 mb-6 tracking-widest">
                  <div>Product Details</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Unit Price</div>
                  <div className="text-right">Line Total</div>
                </div>

                <div className="space-y-6 md:space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:grid md:grid-cols-4 gap-3 md:gap-0 items-center md:items-center py-2"
                    >
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-14 h-14 bg-elevated rounded-xl border border-surface-border p-2 flex items-center justify-center">
                          <img
                            src={item.image}
                            className="w-full h-full object-contain"
                            alt=""
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-warm-100">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-gold/70 uppercase font-bold tracking-tighter">
                            {item.brand}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center w-full md:contents border-t border-surface-border/50 pt-3 md:pt-0">
                        <div className="md:text-center text-xs md:text-sm">
                          <span className="md:hidden text-warm-600 mr-2 uppercase text-[10px] font-bold">
                            Qty:
                          </span>
                          <span className="font-bold text-warm-200">
                            x{item.qty}
                          </span>
                        </div>
                        <div className="md:text-right text-xs md:text-sm">
                          <span className="md:hidden text-warm-600 mr-2 uppercase text-[10px] font-bold">
                            Unit:
                          </span>
                          <span className="text-warm-500">
                            ${Number(item.price || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="md:text-right text-sm font-black text-white">
                          <span className="md:hidden text-warm-600 mr-2 uppercase text-[10px] font-bold">
                            Total:
                          </span>
                          $
                          {Number(item.price * item.qty || 0).toLocaleString(
                            "en-IN",
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-elevated/30 p-5 md:p-8 border-t border-surface-border flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="grid grid-cols-2 md:flex gap-8 md:gap-16 w-full md:w-auto">
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-black text-warm-600 tracking-widest">
                      Shipping Destination
                    </p>
                    <p className="text-[12px] text-warm-500 leading-relaxed italic">
                      {order.address.street},<br /> {order.address.city},{" "}
                      {order.address.zip}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-black text-warm-600 tracking-widest">
                      Payment Method
                    </p>
                    <p className="text-[12px] font-black text-gold uppercase tracking-tighter">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end w-full md:w-auto pt-6 md:pt-0 border-t border-surface-border md:border-0">
                  <p className="text-[10px] uppercase font-black text-warm-600 tracking-widest mb-1">
                    Grand Total
                  </p>
                  <p className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">
                    <span className="text-gold text-xl mr-1">$</span>
                    {Number(order.totalAmount || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
