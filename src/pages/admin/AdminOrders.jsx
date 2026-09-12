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
    <div className="bg-surface min-h-screen p-4 md:p-6 w-full text-white font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-warm-100">
              Order Management
            </h1>
            <p className="text-warm-600 text-xs mt-0.5">
              Real-time customer transactions overview
            </p>
          </div>
          <div className="bg-surface-raised px-3 py-1.5 rounded-lg border border-surface-border w-full md:w-auto text-center">
            <span className="text-warm-500 text-xs font-bold uppercase tracking-wider">
              Total Volume:{" "}
            </span>
            <span className="text-gold font-bold ml-1">
              {orders.length}
            </span>
          </div>
        </header>

        <div className="space-y-4">
          {orders.map((order, idx) => (
            <div
              key={`${order.orderId}-${idx}`}
              className="bg-surface-raised rounded-xl border border-surface-border overflow-hidden transition-all hover:border-gold/40"
            >
              <div className="bg-elevated/40 px-4 py-3 flex flex-col sm:flex-row justify-between gap-3 border-b border-surface-border">
                <div className="flex items-center gap-3">
                  <div className="bg-surface px-2.5 py-1.5 rounded-lg border border-surface-border text-left min-w-[100px]">
                    <p className="text-[9px] uppercase font-bold text-warm-600">
                      Order Ref
                    </p>
                    <p className="text-[11px] font-mono font-bold text-gold">
                      {order.orderId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-warm-100">
                      {order.user?.name}
                    </p>
                    <p className="text-xs text-warm-600">{order.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] uppercase font-bold text-warm-600">
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
                    className={`text-[11px] font-bold py-1.5 px-3 rounded-lg border outline-none bg-transparent cursor-pointer transition-all ${getStatusColor(order.status)}`}
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

              <div className="p-4 md:p-5">
                <div className="hidden md:grid grid-cols-4 text-[10px] uppercase font-bold text-warm-600 border-b border-surface-border pb-2 mb-4 tracking-wider">
                  <div>Product Details</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Unit Price</div>
                  <div className="text-right">Line Total</div>
                </div>

                <div className="space-y-4 md:space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:grid md:grid-cols-4 gap-2 md:gap-0 items-center md:items-center py-1"
                    >
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="w-11 h-11 bg-elevated rounded-lg border border-surface-border p-1.5 flex items-center justify-center">
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

                      <div className="flex justify-between items-center w-full md:contents border-t border-surface-border/50 pt-2 md:pt-0">
                        <div className="md:text-center text-xs">
                          <span className="md:hidden text-warm-600 mr-2 uppercase text-[10px] font-bold">
                            Qty:
                          </span>
                          <span className="font-bold text-warm-200">
                            x{item.qty}
                          </span>
                        </div>
                        <div className="md:text-right text-xs">
                          <span className="md:hidden text-warm-600 mr-2 uppercase text-[10px] font-bold">
                            Unit:
                          </span>
                          <span className="text-warm-500">
                            ${Number(item.price || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="md:text-right text-sm font-bold text-white">
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

              <div className="bg-elevated/30 px-4 py-4 border-t border-surface-border flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="grid grid-cols-2 md:flex gap-6 md:gap-12 w-full md:w-auto">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-warm-600">
                      Shipping Destination
                    </p>
                    <p className="text-xs text-warm-500 leading-relaxed">
                      {order.address.street},<br /> {order.address.city},{" "}
                      {order.address.zip}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-warm-600">
                      Payment Method
                    </p>
                    <p className="text-xs font-bold text-gold uppercase tracking-tighter">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end w-full md:w-auto pt-3 md:pt-0 border-t border-surface-border md:border-0">
                  <p className="text-[10px] uppercase font-bold text-warm-600 mb-0.5">
                    Grand Total
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-warm-100">
                    <span className="text-gold text-sm mr-1">$</span>
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