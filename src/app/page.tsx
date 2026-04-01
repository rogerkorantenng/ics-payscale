"use client";

import { useCampus } from "@/lib/campus-context";
import {
  getPayrollByCampus,
  payrollHistory,
  recentActivity,
  complianceItems,
  formatGHS,
  campuses,
} from "@/lib/mock-data";
import StatCard from "@/components/stat-card";
import PageTransition from "@/components/page-transition";
import AnimatedCounter from "@/components/animated-counter";
import { Users, Banknote, Clock, ShieldCheck, ArrowRight, Play, UserPlus, FileText } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function Dashboard() {
  const { selectedCampus } = useCampus();
  const summary = getPayrollByCampus(selectedCampus);
  const campusName = campuses.find((c) => c.id === selectedCampus)?.name || "All Campuses";
  const pendingCompliance = complianceItems.filter((c) => c.status === "pending").length;

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, Kwame. Here&apos;s your payroll overview for {campusName}.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/payroll/run"
            className="flex items-center gap-2 bg-gradient-to-r from-[#0B2545] to-[#1a4a7a] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0B2545]/20 transition-all active:scale-[0.98]"
          >
            <Play size={16} /> Run Payroll
          </Link>
          <Link
            href="/employees/new"
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
          >
            <UserPlus size={16} /> Add Employee
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Payroll Cost"
          value={formatGHS(summary.totalGross)}
          change="+2.3% from last month"
          changeType="up"
          icon={Banknote}
          iconColor="text-[#D4A843]"
          iconBg="bg-[#D4A843]/10"
          delay={0}
        />
        <StatCard
          label="Total Employees"
          value={summary.totalEmployees.toString()}
          change="+3 new this month"
          changeType="up"
          icon={Users}
          delay={0.1}
        />
        <StatCard
          label="Pending Payroll"
          value="April 2026"
          change="Due in 28 days"
          changeType="neutral"
          icon={Clock}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          delay={0.2}
        />
        <StatCard
          label="Compliance Status"
          value={`${pendingCompliance} Pending`}
          change="3 filings due this month"
          changeType="down"
          icon={ShieldCheck}
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Payroll Cost Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={payrollHistory}>
              <defs>
                <linearGradient id="colorPakyi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B2545" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0B2545" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOgbojo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4A843" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#D4A843" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEL" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E86AB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2E86AB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                formatter={(value) => formatGHS(Number(value))}
              />
              <Legend />
              <Area type="monotone" dataKey="pakyi" name="Pakyi Campus" stroke="#0B2545" strokeWidth={2} fill="url(#colorPakyi)" dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Area type="monotone" dataKey="ogbojo" name="Ogbojo Campus" stroke="#D4A843" strokeWidth={2} fill="url(#colorOgbojo)" dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Area type="monotone" dataKey="eastLegon" name="East Legon Campus" stroke="#2E86AB" strokeWidth={2} fill="url(#colorEL)" dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Staff by Department</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={summary.byDepartment} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="department" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              />
              <Bar dataKey="count" name="Employees" fill="#0B2545" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Upcoming Compliance Deadlines</h3>
            <Link href="/compliance" className="text-sm text-[#0B2545] font-medium flex items-center gap-1 hover:underline">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {complianceItems
              .filter((c) => c.status === "pending")
              .map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-3.5 bg-orange-50/50 rounded-xl border border-orange-100 cursor-pointer transition-colors hover:bg-orange-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.type}</p>
                    <p className="text-xs text-gray-500">{item.period} — Due {item.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatGHS(item.amount)}</p>
                    <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">Pending</span>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            <Link href="/audit" className="text-sm text-[#0B2545] font-medium flex items-center gap-1 hover:underline">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.slice(0, 5).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#0B2545]/10 to-[#0B2545]/5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText size={14} className="text-[#0B2545]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{item.action}</p>
                  <p className="text-xs text-gray-500 truncate">{item.detail}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.user} — {item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
