"use client";

import { campuses, payeBrackets, statutoryRates } from "@/lib/mock-data";
import { Settings, Shield, Users, Building2, DollarSign, Save } from "lucide-react";
import PageTransition from "@/components/page-transition";
import { useToast } from "@/components/toast";

const roles = [
  { name: "Super Admin", users: 2, permissions: "Full access to all modules" },
  { name: "HR Director", users: 1, permissions: "Employee management, payroll processing, reports" },
  { name: "Finance Officer", users: 3, permissions: "Payroll processing, compliance reports, analytics" },
  { name: "Campus Admin", users: 3, permissions: "Campus-level employee data, leave approvals" },
  { name: "Viewer", users: 5, permissions: "Read-only access to dashboards and reports" },
];

const payGrades = [
  { grade: "Grade A", title: "Senior Management", range: "GH₵ 10,000 - 15,000" },
  { grade: "Grade B", title: "Head of Department", range: "GH₵ 7,000 - 10,000" },
  { grade: "Grade C", title: "Senior Staff", range: "GH₵ 5,000 - 7,000" },
  { grade: "Grade D", title: "Standard Staff", range: "GH₵ 3,000 - 5,000" },
  { grade: "Grade E", title: "Support Staff", range: "GH₵ 2,000 - 3,000" },
];

export default function SettingsPage() {
  const { showToast } = useToast();
  return (
    <PageTransition><div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings & Configuration</h1>
          <p className="text-sm text-gray-500 mt-1">Manage tax tables, pension rates, campuses, and user roles</p>
        </div>
        <button onClick={() => showToast("Settings saved successfully", "success")} className="flex items-center gap-2 bg-gradient-to-r from-[#0B2545] to-[#1a4a7a] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg transition-all active:scale-[0.98]">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* PAYE Tax Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign size={20} className="text-[#0B2545]" />
            <h3 className="font-semibold text-gray-900">Ghana PAYE Tax Brackets (Monthly)</h3>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-gray-200"><th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Range</th><th className="text-right px-3 py-2 text-xs font-semibold text-gray-500">Rate</th></tr></thead>
            <tbody>
              {payeBrackets.map((b, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="px-3 py-2 text-sm">GH₵ {b.min.toLocaleString()} — {b.max === Infinity ? "Above" : `GH₵ ${b.max.toLocaleString()}`}</td>
                  <td className="px-3 py-2 text-sm text-right font-medium">{(b.rate * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Statutory Rates */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <Settings size={20} className="text-[#0B2545]" />
            <h3 className="font-semibold text-gray-900">Statutory Contribution Rates</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">{statutoryRates.ssnit.label}</p>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Employer: {(statutoryRates.ssnit.employer * 100).toFixed(1)}%</span>
                <span>Employee: {(statutoryRates.ssnit.employee * 100).toFixed(1)}%</span>
                <span>Total: {((statutoryRates.ssnit.employer + statutoryRates.ssnit.employee) * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">{statutoryRates.tier2.label}</p>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Employer: {(statutoryRates.tier2.employer * 100).toFixed(1)}%</span>
                <span>Employee: 0%</span>
                <span>Total: {(statutoryRates.tier2.employer * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">{statutoryRates.tier3.label}</p>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Voluntary: {(statutoryRates.tier3.voluntary * 100).toFixed(1)}%</span>
                <span>Employee opt-in only</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Campus Management */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <Building2 size={20} className="text-[#0B2545]" />
            <h3 className="font-semibold text-gray-900">Campus Management</h3>
          </div>
          <div className="space-y-2">
            {campuses.filter(c => c.id !== "all").map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-500">ID: {c.id}</p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-green-50 text-green-700 rounded-full">Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Roles & Permissions */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={20} className="text-[#0B2545]" />
            <h3 className="font-semibold text-gray-900">User Roles & Permissions</h3>
          </div>
          <div className="space-y-2">
            {roles.map((r) => (
              <div key={r.name} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-800">{r.name}</p>
                  <span className="text-xs text-gray-500">{r.users} user{r.users > 1 ? "s" : ""}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{r.permissions}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pay Grades */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-3 mb-4">
          <Users size={20} className="text-[#0B2545]" />
          <h3 className="font-semibold text-gray-900">Pay Grades & Allowance Types</h3>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b border-gray-200"><th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Grade</th><th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Title</th><th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Salary Range</th></tr></thead>
          <tbody>
            {payGrades.map((g) => (
              <tr key={g.grade} className="border-b border-gray-50">
                <td className="px-4 py-2.5 text-sm font-medium text-[#0B2545]">{g.grade}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{g.title}</td>
                <td className="px-4 py-2.5 text-sm text-right font-medium">{g.range}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div></PageTransition>
  );
}
