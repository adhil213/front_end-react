import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { RiTruckLine, RiShieldCheckLine, RiRefund2Line, RiArrowRightLine } from "react-icons/ri";
import toast from "react-hot-toast";
import BrandMark from "../component/BrandMark";
import { GUEST_ADMIN, isGuest, isPrivileged } from "../config/guest";

const inputCls =
  "w-full bg-elevated border border-surface-border rounded-xl px-5 py-3.5 text-sm text-warm-100 placeholder-warm-600 focus:outline-none focus:border-gold/50 transition-all";

const labelCls = "text-[10px] font-black uppercase tracking-widest text-gold/80 ml-1 mb-2 block";

export const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Session Terminated. Logged out.");
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await fetch("https://backend-sk0h.onrender.com/auth/login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const user = await response.json();

        if (response.ok) {
          localStorage.setItem("token", user.token);
          localStorage.setItem("user", JSON.stringify(user.user));
          toast.success(`Welcome back ${user.name}`);
          navigate("/");
        } else {
          toast.error(user.message);
        }
      } else {
        const response = await fetch("https://backend-sk0h.onrender.com/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("Registration Successful");
          setIsLogin(true);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      toast.error("Network Error: Cannot reach authorization server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-warm-100 min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-16">
      {/* Ambient glows */}
      <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-[radial-gradient(closest-side,rgba(201,168,76,0.12),transparent)] pointer-events-none" />
      <div className="absolute -bottom-40 -left-32 w-[520px] h-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(201,168,76,0.08),transparent)] pointer-events-none" />
      <span className="hidden lg:block absolute right-0 bottom-0 leading-none text-[28rem] font-black text-warm-100/[0.025] pointer-events-none select-none tracking-tighter">
        E
      </span>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-12 lg:gap-16 items-center relative z-10">
        {/* Brand panel */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-3 mb-8">
            <BrandMark className="w-11 h-11" iconClass="w-6 h-6" />
            <span className="text-warm-100 font-black text-2xl tracking-[0.18em]">
              EZBUY
            </span>
          </div>

          <h1 className="text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight">
            Shop with
            <br />
            <span className="text-gold">confidence.</span>
          </h1>

          <p className="text-warm-500 text-base mt-6 max-w-sm leading-relaxed">
            A considered collection, honest prices, and delivery that shows up
            when it says it will.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: RiTruckLine, label: "Free shipping on orders over ₹1,500" },
              { icon: RiRefund2Line, label: "30-day no-questions returns" },
              { icon: RiShieldCheckLine, label: "2-year warranty on everything" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-3 text-warm-400 text-sm font-semibold">
                <span className="w-9 h-9 rounded-lg border border-surface-border bg-surface-raised flex items-center justify-center text-gold shrink-0">
                  <b.icon className="w-4 h-4" />
                </span>
                {b.label}
              </div>
            ))}
          </div>
        </div>

        {/* Auth card */}
        <motion.div
          layout
          className="bg-surface-raised border border-surface-border rounded-[1.5rem] p-7 md:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
        >
          {loggedInUser ? (
            /* Profile View */
            <div className="text-center space-y-5">
              <div className="relative w-20 h-20 bg-gold/10 border border-gold/25 rounded-full flex items-center justify-center mx-auto">
                <span className="text-gold text-3xl font-black uppercase">
                  {loggedInUser.name.charAt(0)}
                </span>
                {isPrivileged(loggedInUser) && (
                  <span className="absolute -bottom-1 -right-1 bg-gold text-surface text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
                    Admin
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-black tracking-tight">Hi, {loggedInUser.name}</h2>
                <p className="text-warm-500 text-sm mt-1">{loggedInUser.email}</p>
              </div>

              {isPrivileged(loggedInUser) && (
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="w-full bg-gold text-surface font-bold py-3.5 rounded-full hover:bg-gold-light transition-all uppercase tracking-widest text-xs"
                >
                  Admin dashboard
                </button>
              )}

              {isGuest(loggedInUser) && (
                <p className="text-[10px] text-warm-500 font-bold uppercase tracking-widest">
                  Guest reviewer — destructive actions are disabled
                </p>
              )}

              <button
                onClick={() => navigate("/orders")}
                className="w-full bg-elevated border border-surface-border text-warm-100 font-bold py-3.5 rounded-full hover:border-gold/40 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                My order history
                <RiArrowRightLine />
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-red-400 border border-red-500/25 bg-red-500/5 hover:bg-red-500 hover:text-surface font-bold py-3.5 rounded-full transition-all uppercase tracking-widest text-xs"
              >
                Logout from account
              </button>

              <button
                onClick={() => navigate("/products")}
                className="w-full text-warm-500 hover:text-gold text-xs font-bold transition-colors"
              >
                Return to store
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-8 lg:hidden">
                <BrandMark className="w-10 h-10" iconClass="w-5 h-5" />
                <span className="text-warm-100 font-black text-xl tracking-[0.18em]">EZBUY</span>
              </div>

              <div className="mb-8">
                <p className="text-gold text-[10px] font-bold uppercase tracking-[0.25em] mb-2">
                  {isLogin ? "Sign in to continue" : "Create your account"}
                </p>
                <h2 className="text-3xl font-black tracking-tight">
                  {isLogin ? "Welcome back" : "Join EzBuy"}
                </h2>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className={labelCls}>Full name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={inputCls}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className={labelCls}>Email address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@company.com"
                    className={inputCls}
                  />
                </div>

                <div className="relative">
                  <label className={labelCls}>Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-9 text-warm-500 hover:text-gold transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <HiOutlineEyeSlash size={20} />
                    ) : (
                      <HiOutlineEye size={20} />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold text-surface font-black py-4 rounded-full mt-2 hover:bg-gold-light active:scale-[0.98] transition-all shadow-lg shadow-gold/10 disabled:opacity-50 uppercase tracking-widest text-xs"
                >
                  {loading
                    ? "Processing..."
                    : isLogin
                      ? "Sign in"
                      : "Create account"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-warm-500 text-sm">
                  {isLogin ? "Don't have an account?" : "Already a member?"}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-gold font-bold ml-2 hover:underline underline-offset-4"
                  >
                    {isLogin ? "Register now" : "Login here"}
                  </button>
                </p>
              </div>

              {isLogin && (
                <div className="mt-5 rounded-xl border border-gold/25 bg-gold/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gold mb-1.5">
                        Guest admin access
                      </p>
                      <p className="text-xs text-warm-400 leading-relaxed">
                        <span className="text-warm-200 font-bold">{GUEST_ADMIN.email}</span>
                        {"  /  "}
                        <span className="font-mono text-warm-200">{GUEST_ADMIN.password}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          email: GUEST_ADMIN.email,
                          password: GUEST_ADMIN.password,
                        }))
                      }
                      className="shrink-0 bg-gold text-surface text-[10px] font-black uppercase tracking-widest px-3.5 py-2 rounded-lg hover:bg-gold-light transition-all active:scale-95"
                    >
                      Fill login
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] text-warm-600 font-medium">
                    Reviewer account — can browse the admin but cannot delete products/users or change roles.
                  </p>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};