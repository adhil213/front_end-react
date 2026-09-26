import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiTruckLine,
  RiWallet3Line,
  RiInformationLine,
  RiQrCodeLine,
  RiArrowRightLine,
} from "react-icons/ri";
import toast from "react-hot-toast";
import useDocumentMeta from "../hooks/useDocumentMeta";

const fmt = (n) => `\u20B9${Number(n || 0).toLocaleString("en-IN")}`;

const inputCls =
  "w-full bg-elevated border border-surface-border rounded-xl px-4 py-3 text-sm text-warm-100 placeholder-warm-600 focus:outline-none focus:border-gold/50 transition-all";

const PaymentPage = () => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  useDocumentMeta({ title: "Secure Checkout", path: "/payment", noindex: true });

  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    zip: "",
    country: "",
    phone: "",
    upiId: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/login");
      return;
    }

    const loadCheckoutData = async () => {
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
        toast.error("Failed to sync with server");
      } finally {
        setIsLoading(false);
      }
    };

    loadCheckoutData();
  }, []);

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
    [cartItems],
  );

  const deliveryFee = subtotal > 1500 || subtotal === 0 ? 0 : 10;

  const total = subtotal + deliveryFee;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const finalizeOrder = async () => {
    if (cartItems.length === 0) {
      return toast.error("ACCESS DENIED: No items found in payload.");
    }

    if (!formData.firstName || !formData.phone) {
      return toast.error("Incomplete Logistics: Fill in required details");
    }

    try {
      if (paymentMethod === "COD") {
        toast.loading("Authorizing Transaction...");
        console.log("Calling backend...");

        const token = localStorage.getItem("token");

        const response = await fetch("https://backend-sk0h.onrender.com/order/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            address: formData,
            paymentMethod: "COD",
          }),
        });

        if (!response.ok) throw new Error();

        toast.dismiss();
        toast.success("Transaction Encrypted & Confirmed!");

        navigate("/orders");
        return;
      }

      toast.loading("Connecting to Payment Gateway...");

      const res = await fetch("https://backend-sk0h.onrender.com/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: total }),
      });

      const order = await res.json();

      toast.dismiss();

      const options = {
        key: "rzp_test_SVsyt6P0MG74K5",
        amount: order.amount,
        currency: "INR",
        name: "EzBuy",
        description: "Secure Payment",
        order_id: order.id,

        handler: async function (response) {
          const token = localStorage.getItem("token");

          const verifyRes = await fetch("https://backend-sk0h.onrender.com/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              address: formData,
              paymentMethod: "Online",
            }),
          });

          if (!verifyRes.ok) throw new Error();

          toast.success("Payment Verified!");

          navigate("/orders");
        },

        theme: {
          color: "#c9a84c",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.dismiss();
      toast.error("System Override: Transaction Failed");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <span className="text-gold font-bold animate-pulse text-sm uppercase tracking-[0.3em]">
          Syncing checkout...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-surface text-warm-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 md:pt-16 pb-20 md:pb-28">
        <header className="mb-10">
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.22em] mb-3">
            Secure checkout
          </p>
          <h1 className="text-warm-100 text-4xl md:text-5xl font-black tracking-tight">
            Confirm your order
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-2 space-y-8">
            {/* DELIVERY */}
            <section className="bg-surface-raised border border-surface-border rounded-2xl p-6 md:p-8">
              <h3 className="flex items-center gap-2 text-gold font-bold uppercase text-[10px] tracking-widest mb-6">
                <RiTruckLine /> Delivery logistics
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="firstName"
                  placeholder="First Name *"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={inputCls}
                />

                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={inputCls}
                />

                <input
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${inputCls} sm:col-span-2`}
                />

                <input
                  name="street"
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={handleInputChange}
                  className={`${inputCls} sm:col-span-2`}
                />

                <input
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={inputCls}
                />

                <input
                  name="zip"
                  placeholder="Zip Code"
                  value={formData.zip}
                  onChange={handleInputChange}
                  className={inputCls}
                />

                <input
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`${inputCls} sm:col-span-2`}
                />
              </div>
            </section>

            {/* PAYMENT */}
            <section className="bg-surface-raised border border-surface-border rounded-2xl p-6 md:p-8">
              <h3 className="flex items-center gap-2 text-gold font-bold uppercase text-[10px] tracking-widest mb-6">
                <RiWallet3Line /> Payment method
              </h3>

              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod("COD")}
                  className={`w-full p-4 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all text-left ${
                    paymentMethod === "COD"
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-surface-border bg-elevated text-warm-500 hover:border-gold/30"
                  }`}
                >
                  Cash on Delivery
                </button>

                <button
                  onClick={() => setPaymentMethod("Online")}
                  className={`w-full p-4 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all text-left ${
                    paymentMethod === "Online"
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-surface-border bg-elevated text-warm-500 hover:border-gold/30"
                  }`}
                >
                  UPI / Online Pay
                </button>
              </div>

              {paymentMethod === "Online" && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="relative">
                    <RiQrCodeLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
                    <input
                      name="upiId"
                      placeholder="Enter UPI ID (e.g. user@okaxis)"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      className="w-full bg-elevated border border-surface-border rounded-xl px-4 py-3 pl-12 text-sm text-warm-100 placeholder-warm-600 focus:outline-none focus:border-gold/50 transition-all"
                    />
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* SUMMARY */}
          <aside className="bg-surface-raised border border-surface-border rounded-2xl p-6 md:p-8 lg:sticky lg:top-24 space-y-6">
            <div>
              <h3 className="flex items-center gap-2 font-black text-base tracking-tight mb-4">
                <RiInformationLine className="text-gold" /> Summary
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
            </div>

            <div className="space-y-2">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 bg-elevated rounded-xl p-3 border border-surface-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-raised flex items-center justify-center p-1 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full object-contain"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/100x100/1a1a1f/e8e6e1?text=E";
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <p className="text-xs font-bold text-warm-100 truncate">{item.name}</p>
                    <p className="text-[10px] text-warm-600 font-bold">
                      {item.qty} × {fmt(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={finalizeOrder}
              disabled={cartItems.length === 0}
              className={`w-full font-black h-14 rounded-full transition-all uppercase tracking-[0.15em] text-xs inline-flex items-center justify-center gap-2 ${
                cartItems.length === 0
                  ? "bg-elevated text-warm-600 cursor-not-allowed opacity-50"
                  : "bg-gold text-surface hover:bg-gold-light active:scale-[0.98]"
              }`}
            >
              {cartItems.length === 0 ? "Bag empty" : (
                <>
                  Confirm transaction
                  <RiArrowRightLine />
                </>
              )}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;