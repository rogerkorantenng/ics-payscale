"use client";

import { getPayrollByCampus, headcountTrends, payrollHistory, formatGHS, activeEmployees, campuses } from "@/lib/mock-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell,
} from "recharts";
import PageTransition from "@/components/page-transition";

const COLORS = ["#0B2545", "#D4A843", "#2E86AB", "#A23B72", "#F18F01"];

export default function AnalyticsPage() {
  const allSummary = getPayrollByCampus("all");
  const pakyiSummary = getPayrollByCampus("pakyi");
  const ogbojoSummary = getPayrollByCampus("ogbojo");
  const eastLegonSummary = getPayrollByCampus("east-legon");

  const campusComparison = [
    { campus: "Pakyi", employees: pakyiSummary.totalEmployees, totalGross: pakyiSummary.totalGross, avgSalary: Math.round(pakyiSummary.totalGross / pakyiSummary.totalEmployees), city: "Kumasi" },
    { campus: "Ogbojo", employees: ogbojoSummary.totalEmployees, totalGross: ogbojoSummary.totalGross, avgSalary: Math.round(ogbojoSummary.totalGross / ogbojoSummary.totalEmployees), city: "Accra" },
    { campus: "East Legon", employees: eastLegonSummary.totalEmployees, totalGross: eastLegonSummary.totalGross, avgSalary: Math.round(eastLegonSummary.totalGross / eastLegonSummary.totalEmployees), city: "Accra" },
  ];

  const roleDistribution = [
    { name: "Teaching Staff", value: activeEmployees.filter((e) => e.roleType === "Teaching Staff").length },
    { name: "Non-Teaching", value: activeEmployees.filter((e) => e.roleType === "Non-Teaching Staff").length },
    { name: "Management", value: activeEmployees.filter((e) => e.roleType === "Management").length },
  ];

  const budgetVsActual = [
    { campus: "Pakyi", budget: 950000, actual: pakyiSummary.totalGross },
    { campus: "Ogbojo", budget: 820000, actual: ogbojoSummary.totalGross },
    { campus: "East Legon", budget: 580000, actual: eastLegonSummary.totalGross },
  ];

  return (
    <PageTransition><div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Campus Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Strategic payroll insights across all campuses</p>
      </div>

      {/* Campus Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {campusComparison.map((c) => (
          <div key={c.campus} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{c.campus} Campus</h3>
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{c.city}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div><p className="text-xl font-bold text-[#0B2545]">{c.employees}</p><p className="text-xs text-gray-500">Staff</p></div>
              <div><p className="text-xl font-bold text-[#D4A843]">{formatGHS(c.totalGross).replace("GH₵ ", "")}</p><p className="text-xs text-gray-500">Gross Payroll</p></div>
              <div><p className="text-xl font-bold text-gray-700">{formatGHS(c.avgSalary).replace("GH₵ ", "")}</p><p className="text-xs text-gray-500">Avg. Salary</p></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Headcount Trends */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Headcount Trends (12 Months)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={headcountTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pakyi" name="Pakyi" stroke="#0B2545" strokeWidth={2} />
              <Line type="monotone" dataKey="ogbojo" name="Ogbojo" stroke="#D4A843" strokeWidth={2} />
              <Line type="monotone" dataKey="eastLegon" name="East Legon" stroke="#2E86AB" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Budget vs Actual */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Budget vs Actual Payroll</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={budgetVsActual}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="campus" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => formatGHS(Number(value))} />
              <Legend />
              <Bar dataKey="budget" name="Budget" fill="#0B2545" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Actual" fill="#D4A843" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Staff Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Staff by Role Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {roleDistribution.map((_, i) => (<Cell key={i} fill={COLORS[i]} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cost of Living Comparison */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Cost-of-Living Adjustment Comparison</h3>
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Metric</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Kumasi (Pakyi)</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Accra (Ogbojo)</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Accra (East Legon)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50"><td className="px-4 py-3 text-sm font-medium">Avg. Teacher Salary</td><td className="px-4 py-3 text-sm text-right">GH₵ 5,200</td><td className="px-4 py-3 text-sm text-right">GH₵ 5,800</td><td className="px-4 py-3 text-sm text-right">GH₵ 6,200</td></tr>
              <tr className="border-b border-gray-50"><td className="px-4 py-3 text-sm font-medium">Cost-of-Living Index</td><td className="px-4 py-3 text-sm text-right">1.00 (baseline)</td><td className="px-4 py-3 text-sm text-right">1.15</td><td className="px-4 py-3 text-sm text-right">1.25</td></tr>
              <tr className="border-b border-gray-50"><td className="px-4 py-3 text-sm font-medium">Housing Allowance Adj.</td><td className="px-4 py-3 text-sm text-right">Standard</td><td className="px-4 py-3 text-sm text-right">+15%</td><td className="px-4 py-3 text-sm text-right">+25%</td></tr>
              <tr className="border-b border-gray-50"><td className="px-4 py-3 text-sm font-medium">Transport Allowance Adj.</td><td className="px-4 py-3 text-sm text-right">Standard</td><td className="px-4 py-3 text-sm text-right">+10%</td><td className="px-4 py-3 text-sm text-right">+20%</td></tr>
              <tr><td className="px-4 py-3 text-sm font-medium">Total Payroll / Headcount</td><td className="px-4 py-3 text-sm text-right font-semibold">{formatGHS(Math.round(pakyiSummary.totalGross / pakyiSummary.totalEmployees))}</td><td className="px-4 py-3 text-sm text-right font-semibold">{formatGHS(Math.round(ogbojoSummary.totalGross / ogbojoSummary.totalEmployees))}</td><td className="px-4 py-3 text-sm text-right font-semibold">{formatGHS(Math.round(eastLegonSummary.totalGross / eastLegonSummary.totalEmployees))}</td></tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div></PageTransition>
  );
}
