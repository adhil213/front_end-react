import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

export const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    brand: "",
    stock: "",
    tag: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [revLoading, setRevLoading] = useState(false);
  const [deletingRev, setDeletingRev] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://backend-sk0h.onrender.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setFormData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("stock", formData.stock);
      form.append("brand", formData.brand);
      form.append("tag", formData.tag);

      if (formData.image instanceof File) {
        form.append("image", formData.image);
      }

      const token = localStorage.getItem("token");

      const res = await fetch(`https://backend-sk0h.onrender.com/updatepro/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: form,
      });

      if (!res.ok) throw new Error();

      toast.success("Product updated successfully!");
      navigate("/admin/list-products");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const loadReviews = () => {
    setRevLoading(true);
    fetch(`https://backend-sk0h.onrender.com/products/${id}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setRevLoading(false);
      })
      .catch(() => setRevLoading(false));
  };

  useEffect(() => {
    if (loading || error) return;
    loadReviews();
  }, [loading, id]);

  const handleDeleteReview = async (reviewId) => {
    setDeletingRev(reviewId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://backend-sk0h.onrender.com/products/${id}/review/${reviewId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      toast.success("Review deleted");
      loadReviews();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingRev(null);
    }
  };

  const darkInput =
    "w-full p-3 bg-elevated border border-surface-border rounded-xl text-white placeholder-warm-600 focus:ring-2 focus:ring-gold/50 focus:border-transparent outline-none transition-all text-sm font-medium";

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface text-warm-500 font-bold">
        Loading Product Data...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface text-red-500 font-bold">
        {error}
      </div>
    );

  return (
    <div className="p-4 md:p-6 bg-surface min-h-screen w-full flex justify-center font-sans text-white">
      <div className="w-full max-w-6xl bg-surface-raised rounded-2xl border border-surface-border overflow-hidden shadow-2xl">
        <div className="p-4 md:p-6 border-b border-surface-border flex flex-col sm:flex-row justify-between items-start sm:items-center bg-surface-raised gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
              Edit Product
            </h2>
            <p className="text-[10px] md:text-xs text-warm-600 font-mono">
              Editing ID: {id}
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-[10px] md:text-xs font-bold text-warm-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            ← CANCEL & GO BACK
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-warm-600 uppercase mb-2 tracking-widest ml-1">
                Product Name
              </label>
              <input
                type="text"
                className={darkInput}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-warm-600 uppercase mb-2 tracking-widest ml-1">
                Price ($)
              </label>
              <input
                type="number"
                className={darkInput}
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-warm-600 uppercase mb-2 tracking-widest ml-1">
                Stock Level
              </label>
              <input
                type="number"
                className={darkInput}
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-warm-600 uppercase mb-2 tracking-widest ml-1">
                Status Tag
              </label>
              <select
                className={`${darkInput} appearance-none cursor-pointer`}
                value={formData.tag || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tag: e.target.value })
                }
              >
                <option value="" className="bg-surface">
                  No Tag
                </option>
                <option value="Sale" className="bg-surface">
                  Sale
                </option>
                <option value="New" className="bg-surface">
                  New
                </option>
                <option value="Bestseller" className="bg-surface">
                  Bestseller
                </option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <label className="block text-[10px] font-bold text-warm-600 uppercase mb-2 tracking-widest ml-1">
              Product Image (Upload to replace)
            </label>
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-elevated p-5 rounded-2xl border border-surface-border">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-surface border border-surface-border flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
                <img
                  src={
                    formData.image instanceof File
                      ? URL.createObjectURL(formData.image)
                      : formData.image
                  }
                  alt="Preview"
                  className="w-full h-full object-contain p-2"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/150?text=No+Image")
                  }
                />
              </div>

              <div className="flex-grow space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-warm-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-surface file:text-gold hover:file:bg-surface-raised cursor-pointer transition-all border border-surface-border rounded-xl p-1"
                />
                <p className="text-[10px] text-warm-600 font-medium italic">
                  * Supported: JPG, PNG, WEBP. Max recommended size: 2MB.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 md:pt-8">
            <button
              type="submit"
              className="w-full py-4 bg-gold text-surface font-bold rounded-xl hover:bg-gold-light transition-all shadow-lg shadow-gold/10 uppercase tracking-widest text-[11px] md:text-xs active:scale-[0.98]"
            >
              Update Product Data
            </button>
          </div>
        </form>

        {/* Reviews */}
        <div className="p-4 md:p-8 pt-0">
          <div className="rounded-2xl border border-surface-border bg-surface overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-tight">
                Customer Reviews ({reviews.length})
              </h3>
              {revLoading && (
                <span className="text-[10px] font-bold text-warm-600 uppercase tracking-widest">
                  Loading...
                </span>
              )}
            </div>

            {revLoading && reviews.length === 0 ? (
              <div className="px-6 py-10 text-center text-warm-600 text-xs font-bold uppercase tracking-widest">
                Fetching reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="px-6 py-10 text-center text-warm-600 text-xs font-bold uppercase tracking-widest">
                No reviews for this product yet
              </div>
            ) : (
              <div className="divide-y divide-surface-border">
                {reviews.map((r) => (
                  <div
                    key={r._id}
                    className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex-grow">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xs font-black">
                          {(r.user?.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white text-sm font-bold">
                          {r.user?.name || "Anonymous"}
                        </span>
                        {r.verifiedPurchase && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-gold border border-gold/20 bg-gold/10 px-2 py-0.5 rounded-full">
                            Certified buyer
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[12px] text-gold font-black">
                          {"★".repeat(r.rating)}
                          <span className="text-warm-600">{"★".repeat(5 - r.rating)}</span>
                        </span>
                        <span className="text-[10px] text-warm-600">
                          {new Date(r.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      {r.comment && (
                        <p className="mt-2 text-sm text-warm-300 leading-relaxed">
                          {r.comment}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteReview(r._id)}
                      disabled={deletingRev === r._id}
                      className="shrink-0 text-[10px] font-bold text-red-400 hover:text-red-300 border border-red-500/20 bg-red-500/10 px-4 py-2 rounded-lg uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                      {deletingRev === r._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
