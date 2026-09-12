import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const AdminUsers = () => {
  const [user, userdata] = useState([]);
  const [usercount, setusercount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://backend-sk0h.onrender.com/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        userdata(data);
        setusercount(data.length);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  async function changeRole(id) {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`https://backend-sk0h.onrender.com/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      // update UIf
      userdata((prev) => prev.map((u) => (u._id === id ? data.user : u)));

      toast.success(`Role updated to ${data.user.role}`);
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  async function deleteuser(id) {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`https://backend-sk0h.onrender.com/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error();

      userdata((pre) => {
        const updated = pre.filter((u) => u._id !== id);
        setusercount(updated.length);
        return updated;
      });
      toast.success("User deleted");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  }

  return (
    <div className="bg-surface min-h-screen p-4 md:p-6 w-full text-white font-sans">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-3">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-warm-100">
              Registered Users
            </h2>
            <p className="text-xs text-warm-500 mt-0.5">
              Manage roles and access for your store
            </p>
          </div>
          <div className="bg-surface-raised px-3 py-1.5 rounded-lg border border-surface-border text-warm-500 font-bold text-xs w-full md:w-auto text-center">
            Total Users: <span className="text-gold ml-1">{usercount}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {user.map((v) => (
            <div
              key={v._id || v.id}
              className="group transition-all duration-300 hover:border-gold/40 flex flex-col md:grid md:grid-cols-12 items-center bg-surface-raised p-3 md:px-5 md:py-3 rounded-xl border border-surface-border"
            >
              <div className="col-span-5 w-full flex items-center gap-3 mb-3 md:mb-0">
                <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-surface font-black uppercase text-sm">
                  {v.name ? v.name.charAt(0) : "?"}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-warm-100 text-sm leading-tight capitalize truncate">
                    {v.name}
                  </p>
                  <p className="text-xs text-warm-600 lowercase truncate mt-0.5">
                    {v.email}
                  </p>
                </div>
              </div>

              <div className="col-span-2 w-full flex md:justify-start items-center mb-3 md:mb-0 border-t border-surface-border md:border-t-0 pt-3 md:pt-0">
                <span className="md:hidden text-[10px] font-bold text-warm-600 uppercase tracking-wider mr-2">
                  Role
                </span>
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                    v.role === "user"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-gold/10 text-gold border-gold/20"
                  }`}
                >
                  {v.role}
                </span>
              </div>

              <div className="col-span-2 w-full flex items-center mb-3 md:mb-0 border-t border-surface-border md:border-t-0 pt-3 md:pt-0">
                <div>
                  <p className="text-base font-bold text-warm-100 leading-none">
                    {v.orders ? v.orders.length : 0}
                  </p>
                  <p className="text-[10px] text-warm-600 uppercase font-bold mt-0.5">
                    Orders
                  </p>
                </div>
              </div>

              <div className="col-span-3 w-full flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end gap-3 border-t border-surface-border md:border-t-0 pt-3 md:pt-0">
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => changeRole(v._id)}
                    className="text-[11px] font-bold text-gold hover:text-gold-light uppercase tracking-wider transition-colors"
                  >
                    {v.role === "user" ? "Promote" : "Demote"}
                  </button>

                  {v.role !== "admin" && (
                    <button
                      onClick={() => deleteuser(v._id)}
                      className="text-[11px] font-bold text-red-400 hover:text-red-300 uppercase tracking-wider transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/admin/users/${v._id}`)}
                  className="w-full md:w-auto bg-elevated border border-surface-border text-warm-100 px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-gold hover:text-surface transition-all active:scale-95"
                >
                  Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};