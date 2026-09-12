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
    <div className="bg-surface min-h-screen py-6 md:py-10 px-4 w-full text-white font-sans">
      <div className="w-full max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 px-2 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
              Registered Users
            </h2>
            <div className="h-1.5 w-16 bg-gold mt-2 rounded-full shadow-[0_0_10px_rgba(201,168,76,0.5)]"></div>
          </div>

          <div className="bg-surface-raised px-6 py-3 rounded-2xl border border-surface-border text-warm-500 font-bold text-sm shadow-xl w-full md:w-auto text-center">
            Total Users:{" "}
            <span className="text-gold ml-1">{usercount}</span>
          </div>
        </div>

        <div className="w-full">
          <div className="hidden md:grid grid-cols-12 px-8 mb-4 text-warm-600 text-[10px] uppercase tracking-[0.2em] font-black">
            <div className="col-span-5">Member Details</div>
            <div className="col-span-2">Status / Role</div>
            <div className="col-span-2 text-center">Activity</div>
            <div className="col-span-3 text-right">Management</div>
          </div>

          <div className="flex flex-col gap-4">
            {user.map((v) => (
              <div
                key={v._id || v.id}
                className="group transition-all duration-300 hover:border-gold/40 flex flex-col md:grid md:grid-cols-12 items-center bg-surface-raised p-4 md:px-8 md:py-5 rounded-2xl border border-surface-border shadow-lg"
              >
                <div className="col-span-5 w-full flex items-center gap-5 mb-4 md:mb-0">
                  <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-surface font-black shadow-lg shadow-gold/20 uppercase text-lg">
                    {v.name ? v.name.charAt(0) : "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-warm-100 text-base md:text-lg leading-tight capitalize truncate">
                      {v.name}
                    </p>
                    <p className="text-xs text-warm-600 lowercase truncate mt-1">
                      {v.email}
                    </p>
                  </div>
                </div>

                <div className="col-span-2 w-full flex md:block justify-between items-center mb-4 md:mb-0 border-t border-surface-border md:border-t-0 pt-4 md:pt-0">
                  <span className="md:hidden text-[10px] font-black text-warm-600 uppercase tracking-widest">
                    Role
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      v.role === "user"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-gold/10 text-gold border-gold/20"
                    }`}
                  >
                    {v.role}
                  </span>
                </div>

                <div className="col-span-2 w-full flex md:block justify-between items-center mb-4 md:mb-0">
                  <span className="md:hidden text-[10px] font-black text-warm-600 uppercase tracking-widest">
                    Activity
                  </span>
                  <div className="text-center md:inline-block">
                    <p className="text-lg md:text-xl font-black text-white leading-none">
                      {v.orders ? v.orders.length : 0}
                    </p>
                    <p className="text-[10px] text-warm-600 uppercase font-bold tracking-tighter mt-1">
                      Orders
                    </p>
                  </div>
                </div>

                <div className="col-span-3 w-full flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end gap-4 border-t border-surface-border md:border-t-0 pt-5 md:pt-0">
                  <div className="flex gap-5 items-center">
                    <button
                      onClick={() => changeRole(v._id)}
                      className="text-[11px] font-black text-gold hover:text-gold-light uppercase tracking-widest transition-colors"
                    >
                      {v.role === "user" ? "Promote" : "Demote"}
                    </button>

                    {v.role !== "admin" && (
                      <button
                        onClick={() => deleteuser(v._id)}
                        className="text-[11px] font-black text-red-400 hover:text-red-300 uppercase tracking-widest transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/admin/users/${v._id}`)}
                    className="w-full md:w-auto bg-elevated border border-surface-border text-warm-100 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gold hover:text-surface transition-all active:scale-95 shadow-lg"
                  >
                    Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
