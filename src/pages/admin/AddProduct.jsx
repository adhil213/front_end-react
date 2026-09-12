import { useState } from "react";
import toast from "react-hot-toast";

export const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    description: "",
    image: null,
    tag: "",
  });

  function formfunction(e) {
    const { name, value, type, files } = e.target;
    if (!name) return;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  }
  async function handlefunction(e) {
    e.preventDefault();

    if (!form.image) {
      return toast.error("Please select an image first");
    }

    const toastId = toast.loading("Uploading product to secure database...");

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", Number(form.price));
      formData.append("stock", Number(form.stock));
      formData.append("category", form.category);
      formData.append("brand", form.brand);
      formData.append("tag", form.tag);
      formData.append("image", form.image);

      const res = await fetch("https://backend-sk0h.onrender.com/admin/products/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast.success("Product Saved!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Upload Failed: Check connection", { id: toastId });
    }
  }

  const inputStyle =
    "w-full px-3 py-2 bg-elevated border border-surface-border rounded-lg text-sm text-warm-100 placeholder-warm-600 focus:ring-2 focus:ring-gold/50 focus:border-transparent outline-none transition-all";
  const labelStyle =
    "block text-[10px] font-bold text-warm-600 uppercase mb-1.5";

  return (
    <div className="min-h-screen bg-surface p-4 md:p-6 flex justify-center w-full overflow-x-hidden font-sans">
      <div className="w-full max-w-3xl bg-surface-raised rounded-xl border border-surface-border p-5 md:p-6">
        <header className="mb-6">
          <h2 className="text-lg md:text-xl font-bold text-warm-100">
            Add New Product
          </h2>
          <p className="text-warm-500 text-xs mt-0.5">
            Fill in the details to list a new item in your store.
          </p>
        </header>

        <form
          onSubmit={handlefunction}
          onChange={formfunction}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="md:col-span-2">
            <label className={labelStyle}>Product Name</label>
            <input
              required
              name="name"
              type="text"
              placeholder="e.g. Wireless Headphones"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Price ($)</label>
            <input
              required
              type="number"
              name="price"
              min={0}
              placeholder="0.00"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Stock Quantity</label>
            <input
              required
              type="number"
              name="stock"
              min={0}
              placeholder="Quantity"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Category</label>
            <select
              name="category"
              required
              className={`${inputStyle} appearance-none cursor-pointer`}
            >
              <option value="" className="bg-surface-raised">Select Category</option>
              <option value="Laptops" className="bg-surface-raised">Laptops</option>
              <option value="Smartphones" className="bg-surface-raised">Smartphones</option>
              <option value="Headphones" className="bg-surface-raised">Headphones</option>
              <option value="Tablets" className="bg-surface-raised">Tablets</option>
              <option value="Accessories" className="bg-surface-raised">Accessories</option>
              <option value="Wearables" className="bg-surface-raised">Wearables</option>
            </select>
          </div>
          <div>
            <label className={labelStyle}>Brand Name</label>
            <input
              name="brand"
              required
              type="text"
              placeholder="e.g. Sony, Apple"
              className={inputStyle}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelStyle}>Description</label>
            <textarea
              name="description"
              required
              placeholder="Tell your customers about this product..."
              rows="3"
              className={`${inputStyle} resize-none`}
            ></textarea>
          </div>
          <div>
            <label className={labelStyle}>Product Image</label>
            <input
              name="image"
              required
              type="file"
              className="w-full text-xs text-warm-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-surface file:text-gold hover:file:bg-surface-raised cursor-pointer bg-elevated border border-surface-border rounded-lg p-2"
            />
          </div>
          <div>
            <label className={labelStyle}>Promotion Tag</label>
            <input
              name="tag"
              type="text"
              placeholder="NEW, SALE, BESTSELLER"
              className={inputStyle}
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              className="w-full bg-gold hover:bg-gold-light text-surface font-bold py-3 rounded-lg transition-all text-sm active:scale-[0.98]"
            >
              Confirm & Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};