import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Dashboard = () => {
  const [data, setData] = useState({
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalOrders: 0,
    statusStats: { completed: 0, processing: 0, cancelled: 0 },
    chartData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [userRes, productRes] = await Promise.all([
          fetch("https://backend-sk0h.onrender.com/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("https://backend-sk0h.onrender.com/products"), 
        ]);

        const users = await userRes.json();
        const products = await productRes.json();

        let revenue = 0;
        let pending = 0;
        let cancelled = 0;
        let completed = 0;
        let orderCount = 0;
        const dailyRevenueMap = {};

        users.forEach((user) => {
          if (user.orders) {
            user.orders.forEach((order) => {
              orderCount++;
              if (order.status === "Delivered") {
                revenue += order.totalAmount;
                completed++;

                const dateKey = order.date;
                dailyRevenueMap[dateKey] =
                  (dailyRevenueMap[dateKey] || 0) + order.totalAmount;
              } else if (
                order.status === "Processing" ||
                order.status === "Shipped"
              ) {
                pending++;
              } else if (order.status === "Cancelled") {
                cancelled++;
              }
            });
          }
        });

        const formattedChartData = Object.entries(dailyRevenueMap)
          .map(([date, amount]) => ({
            date,
            amount,
            sortDate: new Date(date.split("/").reverse().join("-")),
          }))
          .sort((a, b) => a.sortDate - b.sortDate);

        setData({
          totalRevenue: revenue,
          pendingOrders: pending,
          totalProducts: products.data.length,
          totalOrders: orderCount,
          chartData: formattedChartData,
          statusStats: {
            completed: orderCount
              ? Math.round((completed / orderCount) * 100)
              : 0,
            processing: orderCount
              ? Math.round((pending / orderCount) * 100)
              : 0,
            cancelled: orderCount
              ? Math.round((cancelled / orderCount) * 100)
              : 0,
          },
        });
        setLoading(false);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-warm-500 bg-surface min-h-screen font-sans">
        Loading Analytics...
      </div>
    );

  // SVG Ring Calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  // Calculate offsets for stacking
  const completedOffset =
    circumference - (data.statusStats.completed / 100) * circumference;
  const processingOffset =
    circumference -
    ((data.statusStats.completed + data.statusStats.processing) / 100) *
      circumference;
  const cancelledOffset =
    circumference -
    ((data.statusStats.completed +
      data.statusStats.processing +
      data.statusStats.cancelled) /
      100) *
      circumference;

  return (
    <div className="bg-surface min-h-screen text-white p-4 md:p-6 font-sans w-full max-w-full overflow-x-hidden">
      <header className="mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-warm-100">Dashboard</h1>
          <p className="text-warm-500 text-xs mt-0.5">
            Welcome back, here's what's happening with your store today.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mb-5">
        <StatCard
          title="TOTAL REVENUE"
          value={`$${data.totalRevenue.toLocaleString()}`}
          icon="💰"
        />
        <StatCard
          title="PENDING ORDERS"
          value={data.pendingOrders}
          icon="📋"
          subtext="Needs attention"
        />
        <StatCard title="TOTAL PRODUCTS" value={data.totalProducts} icon="📦" />
        <StatCard title="TOTAL ORDERS" value={data.totalOrders} icon="🛍️" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-surface-raised p-4 rounded-xl border border-surface-border">
          <h3 className="font-bold mb-4 text-sm text-warm-100">Order Status</h3>
          <div className="relative flex justify-center items-center h-48 mb-5">
            <svg className="block w-40 h-40 overflow-visible transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#252529"
                strokeWidth="12"
                fill="transparent"
              />

              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#3d3c39"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                style={{
                  strokeDashoffset: cancelledOffset,
                  transition: "stroke-dashoffset 1s ease",
                  strokeLinecap: "round",
                }}
              />

              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#dabe62"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                style={{
                  strokeDashoffset: processingOffset,
                  transition: "stroke-dashoffset 1s ease",
                  strokeLinecap: "round",
                }}
              />

              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#c9a84c"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                style={{
                  strokeDashoffset: completedOffset,
                  transition: "stroke-dashoffset 1s ease",
                  strokeLinecap: "round",
                }}
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-[10px] text-warm-500 block uppercase">
                Delivered
              </span>
              <span className="text-lg font-bold text-warm-100">
                {data.statusStats.completed}%
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <StatusRow
              label="Completed"
              percent={data.statusStats.completed}
              color="bg-gold"
            />
            <StatusRow
              label="Processing"
              percent={data.statusStats.processing}
              color="bg-gold-light"
            />
            <StatusRow
              label="Cancelled"
              percent={data.statusStats.cancelled}
              color="bg-warm-600"
            />
          </div>
        </div>

        <div className="lg:col-span-2 bg-surface-raised p-4 rounded-xl border border-surface-border flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-warm-100">Daily Revenue Trend</h3>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gold"></span>
              <span className="text-xs text-warm-500 font-bold uppercase tracking-wider">
                Revenue
              </span>
            </div>
          </div>

          <div className="flex-1 w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#252529"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9a968d", fontSize: 11, fontWeight: "bold" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9a968d", fontSize: 11 }}
                  tickFormatter={(val) => val.toLocaleString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1f",
                    border: "1px solid #252529",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#dabe62" }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#c9a84c"
                  strokeWidth={4}
                  dot={{
                    r: 6,
                    fill: "#c9a84c",
                    strokeWidth: 2,
                    stroke: "#131316",
                  }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, subtext }) => (
  <div className="bg-surface-raised p-4 rounded-xl border border-surface-border">
    <div className="flex justify-between items-start mb-3">
      <div>
        <p className="text-warm-500 text-[10px] font-bold uppercase">{title}</p>
        <h2 className="text-xl md:text-2xl font-bold text-warm-100 mt-0.5">{value}</h2>
      </div>
      <div className="w-9 h-9 bg-elevated border border-surface-border rounded-lg flex items-center justify-center text-sm">
        {icon}
      </div>
    </div>
    {subtext && (
      <p className="text-[10px] text-gold font-medium">⚠️ {subtext}</p>
    )}
  </div>
);

const StatusRow = ({ label, percent, color }) => (
  <div className="flex justify-between items-center text-xs">
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${color}`}></span>
      <span className="text-warm-500 font-medium">{label}</span>
    </div>
    <span className="font-bold text-warm-100">{percent}%</span>
  </div>
);