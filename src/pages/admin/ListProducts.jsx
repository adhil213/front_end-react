import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Products } from "../Products";
import { isGuest } from "../../config/guest";

export const ListProducts = () => {
  const [data, setData] = useState([]);
  const [search, setsearch] = useState("");
  // const [category, setCategory] = useState("");
  // const [brand, setbrand] = useState("");
  console.log(search)

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const guest = isGuest(loggedInUser);

  const [serchparams, setsearchparams] = useSearchParams();

 const selectedCategory = serchparams.get("category") || "All";
  const selectedBrand = serchparams.get("brand") || "All";
  

  const updatefilter = (key, value) => {
    const param = new URLSearchParams(serchparams);

    if (!value ||value === "All" ) {
      param.delete(key);
    } else {
      param.set(key, value);
    }

    setsearchparams(param);
  };
  useEffect(()=>{
    const delay=setTimeout(() => {
       const param = new URLSearchParams(serchparams);
    if(search){
      param.set("search",search)
    }else{
      param.delete("search")
    }
          setsearchparams(param);
    },500 );
   return ()=> clearTimeout(delay)
  },[search])

  useEffect(() => {
  fetch(`https://backend-sk0h.onrender.com/products?${serchparams.toString()}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    })
    .then((data) => setData(data.data || []))
    .catch((err) => {
      console.error(err);
      setData([]); 
    });
}, [serchparams]);

const deleteProduct = async (id) => {
  
  const token = localStorage.getItem("token");

  const toastId = toast.loading("Deleting product...");

  try {
    const res = await fetch(`https://backend-sk0h.onrender.com/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    if (!res.ok) throw new Error();

   
    setData((prev) => prev.filter((item) => item._id !== id));

    toast.success("Product deleted successfully", { id: toastId });

  } catch (err) {
    toast.error("Delete failed", { id: toastId });
  }
};
  // const filterproduct = useMemo(() => {
  //   const q = search.toLowerCase();
  //   return data.filter((v) => {
  //     const matchSearch = v.name.toLowerCase().includes(q);
  //     const matchCategory =
  //       category === "" || v.category.toLowerCase() === category.toLowerCase();
  //     const matchbrand =
  //       brand === "" || v.brand.toLowerCase() === brand.toLowerCase();
  //     return matchSearch && matchCategory && matchbrand;
  //   });
  // }, [data, search, category, brand]);

  const categories = [
    "Laptops",
    "Smartphones",
    "Headphones",
    "Tablets",
    "Accessories",
    "Wearables",
  ];
  const branditems = [
    "Amazon",
    "Apple",
    "Asus",
    "Bose",
    "Canon",
    "DJI",
    "Dell",
    "GoPro",
    "Keychron",
    "Logitech",
    "Microsoft",
    "Nintendo",
    "Razer",
    "Samsung",
    "Sony",
    "SteelSeries",
  ];

  const darkInput =
    "bg-elevated border border-surface-border text-warm-100 placeholder-warm-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold/50 transition-all";

  return (
    <div className="p-4 md:p-6 bg-surface min-h-screen w-full flex justify-center text-white font-sans">
      <div className="w-full max-w-6xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-warm-100">
              Product Management
            </h2>
            <p className="text-xs text-warm-500 mt-0.5">Inventory Overview</p>
          </div>
          <div className="text-[11px] font-bold text-gold bg-gold/10 border border-gold/20 px-3 py-1.5 rounded-lg">
            {data.length} ITEMS TOTAL
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          <input
            type="text"
            placeholder="Search products..."
            className={`flex-[2] ${darkInput}`}
            onChange={(e) => setsearch(e.target.value)}
          />
          <div className="flex gap-3 flex-1">
            <select
              value={selectedCategory}
              onChange={(e) => {
                // setCategory(e.target.value);
                updatefilter("category", e.target.value);
              }}
              className={`flex-1 ${darkInput} cursor-pointer`}
            >
              <option value="" className="bg-surface-raised">
                All Categories
              </option>
              {categories.map((c) => (
                <option key={c} value={c} className="bg-surface-raised">
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={selectedBrand}
              onChange={(e) => {
                // setbrand(e.target.value);
                updatefilter("brand", e.target.value);
              }}
              className={`flex-1 ${darkInput} cursor-pointer`}
            >
              <option value="" className="bg-surface-raised">
                All Brands
              </option>
              {branditems.map((b) => (
                <option key={b} value={b} className="bg-surface-raised">
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="hidden md:block bg-surface-raised rounded-xl border border-surface-border overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-elevated/40">
              <tr className="text-warm-500 text-[10px] uppercase font-bold tracking-wider border-b border-surface-border">
                <th className="py-3 px-5 text-left">Product</th>
                <th className="py-3 px-5 text-left">Category</th>
                <th className="py-3 px-5 text-left">Pricing</th>
                <th className="py-3 px-5 text-left">Stock</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {data.map((val) => (
                <tr
                  key={val._id}
                  className="hover:bg-gold/5 transition-all"
                >
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-elevated rounded-lg p-1.5 flex items-center justify-center border border-surface-border">
                        <img
                          src={
                            val.image
                          }
                          alt={val.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/40/131316/gold?text=?";
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-warm-100 text-sm">
                          {val.name}
                        </div>
                        <div className="text-[10px] text-warm-600 font-mono mt-0.5">
                          ID: {val._id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-xs text-warm-500 uppercase font-medium">
                    {val.category}
                  </td>
                  <td className="py-3 px-5 font-bold text-gold text-sm">
                    ${val.price.toLocaleString()}
                  </td>
                  <td className="py-3 px-5 text-sm text-warm-300">
                    {val.stock > 0 ? (
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {val.stock} in stock
                      </span>
                    ) : (
                      <span className="text-red-400">Out of stock</span>
                    )}
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex justify-end gap-2">
                      {guest ? (
                        <span
                          title="Guest admins cannot edit products"
                          className="px-3 py-1.5 bg-gold/10 text-gold/50 rounded-lg text-[11px] font-bold cursor-not-allowed"
                        >
                          Edit
                        </span>
                      ) : (
                        <Link
                          to={`/admin/list-products/${val._id}`}
                          className="px-3 py-1.5 bg-gold/10 text-gold hover:bg-gold hover:text-surface rounded-lg text-[11px] font-bold transition-all"
                        >
                          Edit
                        </Link>
                      )}
                      <button
                        onClick={() => deleteProduct(val._id)}
                        disabled={guest}
                        title={guest ? "Guest admins cannot delete products" : undefined}
                        className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-[11px] font-bold transition-all disabled:opacity-40 disabled:hover:bg-red-500/10 disabled:hover:text-red-400 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-3">
          {data.map((val) => (
            <div
              key={val._id}
              className="bg-surface-raised p-4 rounded-xl border border-surface-border"
            >
              <div className="flex gap-3 mb-3">
                <div className="w-14 h-14 bg-elevated rounded-lg p-1.5 border border-surface-border">
                  <img
                    src={val.image}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-warm-100 text-sm">{val.name}</div>
                  <div className="text-xs text-gold font-bold mt-0.5">
                    ${val.price}
                  </div>
                  <div className="text-[10px] text-warm-600 mt-0.5 uppercase font-bold tracking-wider">
                    {val.category} • Stock: {val.stock}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-surface-border">
                {guest ? (
                  <span
                    title="Guest admins cannot edit products"
                    className="flex-1 text-center py-2 bg-elevated text-warm-100/40 text-xs font-bold rounded-lg border border-surface-border cursor-not-allowed"
                  >
                    Edit
                  </span>
                ) : (
                  <Link
                    to={`/admin/list-products/${val._id}`}
                    className="flex-1 text-center py-2 bg-elevated text-warm-100 text-xs font-bold rounded-lg border border-surface-border"
                  >
                    Edit
                  </Link>
                )}
                <button
                  onClick={() => deleteProduct(val._id)}
                  disabled={guest}
                  title={guest ? "Guest admins cannot delete products" : undefined}
                  className="flex-1 text-center py-2 bg-red-500/10 text-red-400 text-xs font-bold rounded-lg border border-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {data.length === 0 && (
          <div className="p-16 text-center text-warm-600 text-sm bg-surface-raised rounded-xl border border-surface-border border-dashed">
            <div className="text-2xl mb-2">🔍</div>
            No products found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};