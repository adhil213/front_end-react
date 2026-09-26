import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowUpRight, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { fadeUp, revealInitial, revealFinal, viewportOnce } from "../component/motionPresets";
import { ReviewsSection } from "../component/ReviewsSection";
import useDocumentMeta from "../hooks/useDocumentMeta";
import { buildProductJsonLd, truncate } from "../config/seo";

const formatPrice = (p) => `\u20B9${Number(p || 0).toLocaleString('en-IN')}`;

export const Productsdetaail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [catalog, setCatalog] = useState([]);

  const productJsonLd = useMemo(
    () => (product ? buildProductJsonLd(product) : null),
    [product]
  );

  useDocumentMeta({
    title: product?.name,
    description: product
      ? truncate(
          `${product.description} Free express shipping, 30-day returns and a 2-year warranty.`
        )
      : undefined,
    path: `/products/${id}`,
    image: product?.image || undefined,
    imageAlt: product ? `${product.name} by ${product.brand || "Ezbuy"}` : undefined,
    type: "product",
    jsonLd: productJsonLd,
  });

  useEffect(() => {
    fetch(`https://backend-sk0h.onrender.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetch("https://backend-sk0h.onrender.com/products")
      .then((res) => res.json())
      .then((data) => setCatalog(data.data || []))
      .catch(() => setCatalog([]));
  }, []);

  const [realRecs, setRealRecs] = useState(null);

  useEffect(() => {
    let active = true;
    setRealRecs(null);
    fetch(`https://backend-sk0h.onrender.com/products/${id}/recommendations`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setRealRecs(Array.isArray(data) && data.length ? data : []);
      })
      .catch(() => {
        if (active) setRealRecs([]);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const fallback = useMemo(() => {
    if (!product) return [];
    const others = catalog.filter((p) => p._id !== product._id);
    const sameBrand = others.filter((p) => p.brand === product.brand);
    const sameCategory = others.filter(
      (p) => p.category === product.category && p.brand !== product.brand
    );
    const rest = others.filter(
      (p) => p.brand !== product.brand && p.category !== product.category
    );
    return [...sameBrand, ...sameCategory, ...rest].slice(0, 4);
  }, [catalog, product]);

  const realHasData = realRecs !== null && realRecs.length > 0;
  const recommendations = realHasData ? realRecs : fallback;
  const boughtTogether = realHasData;

const handleAddToCart = async () => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!loggedInUser || !token) {
    navigate("/login");
    return;
  }

  setIsProcessing(true);

  try {
    const res = await fetch("https://backend-sk0h.onrender.com/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product._id,
        qty: quantity,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    toast.success("Added to cart!");

  } catch (error) {
    toast.error(error.message || "Error adding to cart");
  } finally {
    setIsProcessing(false);
  }
};

  if (loading)
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <span className="text-gold font-bold animate-pulse text-sm uppercase tracking-[0.3em]">
          Loading product...
        </span>
      </div>
    );

  if (!product)
    return (
      <div className="bg-surface min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="text-warm-100 text-3xl font-black tracking-tight">
          Product not found
        </p>
        <p className="text-warm-500 text-sm">
          It may have sold out or the link is wrong.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="inline-flex items-center gap-2 bg-gold text-surface font-bold px-6 py-3 rounded-full hover:bg-gold-light transition-colors text-sm"
        >
          Back to collection
        </button>
      </div>
    );

  const stockStatus =
    product.stock === 0
      ? { label: "Out of stock", cls: "text-red-400 border-red-500/30 bg-red-500/10" }
      : product.stock <= 5
        ? { label: `Only ${product.stock} left`, cls: "text-gold border-gold/30 bg-gold/10" }
        : { label: "In stock", cls: "text-warm-300 border-surface-border bg-elevated" };

  return (
    <div className="bg-surface text-warm-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 md:pt-12 pb-20 md:pb-28">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-warm-500 hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Main */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-[1.5rem] border border-surface-border bg-surface-raised aspect-square flex items-center justify-center overflow-hidden p-8 md:p-14 group"
          >
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[radial-gradient(closest-side,rgba(201,168,76,0.12),transparent)] pointer-events-none" />

            {product.stock === 0 ? (
              <span className="absolute top-5 left-5 z-10 bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-md">
                Out of stock
              </span>
            ) : (
              product.tag && (
                <span className="absolute top-5 left-5 z-10 bg-gold text-surface text-xs font-bold px-3 py-1.5 rounded-md">
                  {product.tag}
                </span>
              )
            )}

            <img
              src={product.image}
              alt={product.name}
              className="relative max-h-full w-auto object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]"
              onError={(e) => {
                e.target.src = "https://placehold.co/600x600/1a1a1f/e8e6e1?text=Ezbuy";
              }}
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-7"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-gold text-xs font-semibold uppercase tracking-[0.22em]">
                  {product.brand} · {product.category}
                </p>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${stockStatus.cls}`}>
                  {stockStatus.label}
                </span>
              </div>
              <h1 className="text-warm-100 text-4xl md:text-5xl font-black tracking-tight leading-[1.05]">
                {product.name}
              </h1>
            </div>

            <p className="text-warm-400 text-base leading-relaxed max-w-xl">
              {product.description}
            </p>

            <div className="flex items-center gap-5 pt-2">
              <span className="text-warm-100 text-4xl md:text-5xl font-black tracking-tight">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Qty + add to cart */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div className="flex items-center bg-surface-raised border border-surface-border rounded-full overflow-hidden h-12">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="px-4 h-full text-warm-400 hover:text-gold transition-colors font-bold"
                >
                  −
                </button>
                <span className="px-3 font-black text-warm-100 min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  aria-label="Increase quantity"
                  className="px-4 h-full text-warm-400 hover:text-gold transition-colors font-bold"
                >
                  +
                </button>
              </div>

              <button
                disabled={isProcessing || product.stock === 0}
                onClick={handleAddToCart}
                className="h-12 px-8 bg-gold text-surface font-bold rounded-full hover:bg-gold-light active:scale-[0.98] transition-all text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock === 0
                  ? "Out of stock"
                  : isProcessing
                    ? "Adding..."
                    : "Add to cart"}
              </button>
            </div>

            {/* Trust */}
            <div className="pt-5 border-t border-surface-border grid sm:grid-cols-3 gap-6">
              {[
                { icon: Truck, title: "Free shipping", sub: "On every order" },
                { icon: RotateCcw, title: "30-day returns", sub: "On us" },
                { icon: ShieldCheck, title: "2-year warranty", sub: "Full coverage" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-surface-border bg-elevated flex items-center justify-center text-gold shrink-0">
                    <item.icon className="w-[18px] h-[18px]" />
                  </div>
                  <div>
                    <p className="text-warm-100 text-xs font-bold leading-tight">{item.title}</p>
                    <p className="text-warm-600 text-[11px] mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <ReviewsSection product={product} />

        {/* Recommended */}
        {recommendations.length > 0 && (
          <div className="mt-20 md:mt-28">
            <motion.div
              initial={revealInitial}
              whileInView={revealFinal}
              viewport={viewportOnce}
              transition={fadeUp}
              className="flex items-end justify-between gap-4 mb-8 md:mb-10"
            >
              <div>
                <p className="text-gold text-xs font-semibold uppercase tracking-[0.22em] mb-3">
                  {boughtTogether ? "Frequently bought together" : "Keep browsing"}
                </p>
                <h2 className="text-warm-100 text-2xl md:text-3xl font-black tracking-tight">
                  {boughtTogether ? "Bought with this" : "Also worth a look"}
                </h2>
              </div>
              <button
                onClick={() => navigate("/products")}
                className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-warm-300 hover:text-gold transition-colors"
              >
                View all
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
              {recommendations.map((rec, i) => (
                <motion.div
                  key={rec._id}
                  initial={revealInitial}
                  whileInView={revealFinal}
                  viewport={viewportOnce}
                  transition={{ ...fadeUp, delay: i * 0.06 }}
                >
                  <Link
                    to={`/products/${rec._id}`}
                    className="group flex flex-col h-full rounded-xl lg:rounded-2xl border border-surface-border bg-surface-raised p-3 lg:p-4 hover:border-gold/40 transition-all"
                  >
                    <div className="relative aspect-square bg-elevated rounded-lg overflow-hidden flex items-center justify-center mb-3 p-4">
                      {rec.stock === 0 && (
                        <span className="absolute top-2.5 left-2.5 bg-red-500/90 text-white text-[9px] font-bold px-2 py-1 rounded-md z-10">
                          Out of stock
                        </span>
                      )}
                      <img
                        src={rec.image}
                        alt={rec.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[10px] text-gold font-bold uppercase tracking-[0.18em] mb-1">
                        {rec.brand}
                      </p>
                      <h3 className="text-sm font-bold text-warm-100 leading-tight group-hover:text-gold line-clamp-1">
                        {rec.name}
                      </h3>
                    </div>
                    <div className="mt-3 pt-3 border-t border-surface-border">
                      <span className="text-gold font-black text-base">
                        {formatPrice(rec.price)}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};