import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(userInfo)

  useEffect(() => {
    fetch(`https://backend-sk0h.onrender.com/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserInfo(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-surface text-warm-500 font-bold">
      Loading profile...
    </div>
  );

  const totalSpent = userInfo.orders?.reduce((acc, curr) => acc + curr.totalAmount, 0) || 0;
  const lastOrderAddress = userInfo.orders?.length > 0 ? userInfo.orders[userInfo.orders.length - 1].address : null;

  return (
    <div className="p-3 md:p-8 bg-surface min-h-screen w-full flex justify-center text-white font-sans">
      <div className="w-full max-w-6xl bg-surface-raised rounded-2xl md:rounded-3xl shadow-2xl border border-surface-border overflow-hidden">
        
        
        <div className="p-5 md:p-8 border-b border-surface-border flex justify-between items-center bg-surface-raised">
          <h2 className="text-base md:text-2xl font-black text-white tracking-tight uppercase leading-tight">
            Details: <span className="text-gold block sm:inline">{userInfo.name}</span>
          </h2>
          <button 
            onClick={() => navigate(-1)} 
            className="text-warm-600 hover:text-white text-3xl md:text-4xl transition-colors leading-none"
          >
            &times;
          </button>
        </div>

       
        <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          
         
          <div className="bg-elevated border border-surface-border rounded-2xl p-6 shadow-lg">
            <h3 className="text-gold text-[10px] font-black mb-6 uppercase tracking-[0.2em]">Account Info</h3>
            <div className="space-y-5">
              <div className="flex flex-col">
                <span className="text-[10px] text-warm-600 font-bold uppercase tracking-widest mb-1">Email Address</span>
                <span className="text-sm text-warm-100 font-medium break-all">{userInfo.email}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-warm-600 font-bold uppercase tracking-widest mb-1">User Role</span>
                  <p className="text-sm text-gold font-black capitalize tracking-tight">{userInfo.role}</p>
                </div>
                <div>
                  <span className="text-[10px] text-warm-600 font-bold uppercase tracking-widest mb-1">Orders</span>
                  <p className="text-sm text-emerald-400 font-black">{userInfo.orders?.length || 0}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-surface-border">
                <span className="text-[10px] text-warm-600 font-bold uppercase tracking-widest mb-1">Lifetime Value</span>
                <p className="text-2xl text-emerald-400 font-black tracking-tighter">${totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          
          <div className="bg-elevated border border-surface-border rounded-2xl p-6 shadow-lg">
            <h3 className="text-warm-500 text-[10px] font-black mb-6 uppercase tracking-[0.2em]">Default Shipping</h3>
            {lastOrderAddress ? (
              <div className="grid grid-cols-1 gap-y-4 text-sm text-warm-300">
                <p>
                  <span className="font-bold text-warm-600 text-[9px] uppercase tracking-widest block mb-1">Recipient</span> 
                  <span className="font-medium">{lastOrderAddress.firstName} {lastOrderAddress.lastName}</span>
                </p>
                <p>
                  <span className="font-bold text-warm-600 text-[9px] uppercase tracking-widest block mb-1">Contact</span> 
                  <span className="font-medium">{lastOrderAddress.phone}</span>
                </p>
                <p>
                  <span className="font-bold text-warm-600 text-[9px] uppercase tracking-widest block mb-1">Street Address</span> 
                  <span className="font-medium">{lastOrderAddress.street}, {lastOrderAddress.city}</span>
                </p>
                <p>
                  <span className="font-bold text-warm-600 text-[9px] uppercase tracking-widest block mb-1">Location Details</span> 
                  <span className="font-medium">{lastOrderAddress.country || "India"} ({lastOrderAddress.zip})</span>
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-6">
                <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mb-3">
                   <span className="text-warm-700 text-xl">!</span>
                </div>
                <p className="text-warm-600 italic text-xs font-bold uppercase tracking-tighter">No address on file</p>
              </div>
            )}
          </div>
        </div>

        
        <div className="p-4 md:p-8 pt-0">
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-warm-500 font-black text-[10px] uppercase tracking-[0.2em]">Order History</h3>
            <span className="text-[9px] text-warm-600 font-bold md:hidden tracking-widest animate-pulse">SWIPE LEFT âž”</span>
          </div>
          
         
          <div className="border border-surface-border rounded-2xl overflow-x-auto bg-elevated/50 shadow-inner">
            {userInfo.orders?.length > 0 ? (
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-elevated text-[10px] uppercase font-black text-warm-600 border-b border-surface-border">
                  <tr>
                    <th className="px-6 py-4">Reference</th>
                    <th className="px-6 py-4">Placement Date</th>
                    <th className="px-6 py-4 text-right">Amount Paid</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {userInfo.orders.map((order, index) => (
                    <tr key={index} className="hover:bg-elevated transition-colors group">
                      <td className="px-6 py-5 font-mono text-[10px] text-gold font-bold">
                        #{order.orderId.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-5 text-xs text-warm-300 font-medium">
                        {order.date}
                      </td>
                      <td className="px-6 py-5 text-xs font-black text-white text-right">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                          order.status === "Delivered" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                          order.status === "Processing" ? "bg-gold/10 text-gold border-gold/20" : 
                          "bg-warm-600/10 text-warm-400 border-warm-600/20"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-16 text-center text-warm-600 text-xs font-black uppercase tracking-[0.2em]">
                Account has no transaction history
              </div>
            )}
          </div>
          
          
          <div className="mt-8">
            <button 
              onClick={() => navigate(-1)} 
              className="w-full bg-gold text-surface hover:bg-gold-light py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-[0.98] focus:ring-2 focus:ring-gold/50"
            >
              Return to User Directory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};