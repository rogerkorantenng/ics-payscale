"use client";

import { complianceItems, formatGHS } from "@/lib/mock-data";
import { ShieldCheck, AlertTriangle, CheckCircle, Clock, Download, FileText } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/page-transition";
import { useToast } from "@/components/toast";

export default function CompliancePage() {
  const { showToast } = useToast();
  const pending = complianceItems.filter((c) => c.status === "pending");
  const filed = complianceItems.filter((c) => c.status === "filed");
  const totalPending = pending.reduce((s, c) => s + c.amount, 0);

  return (
    <PageTransition><div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance & Statutory Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Track statutory filings and compliance status</p>
        </div>
        <button onClick={() => showToast("All compliance reports exported as PDF", "success")} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all active:scale-[0.98]">
          <Download size={16} /> Export Reports
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={20} className="text-orange-600" />
            <h3 className="font-semibold text-orange-900">Pending Filings</h3>
          </div>
          <p className="text-3xl font-bold text-orange-700">{pending.length}</p>
          <p className="text-sm text-orange-600 mt-1">Total: {formatGHS(totalPending)}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={20} className="text-green-600" />
            <h3 className="font-semibold text-green-900">Filed This Quarter</h3>
          </div>
          <p className="text-3xl font-bold text-green-700">{filed.length}</p>
          <p className="text-sm text-green-600 mt-1">All on time</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-blue-600" />
            <h3 className="font-semibold text-blue-900">Next Deadline</h3>
          </div>
          <p className="text-3xl font-bold text-blue-700">Apr 14</p>
          <p className="text-sm text-blue-600 mt-1">SSNIT Tier 1 & Tier 2</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link href="/compliance/ssnit" className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-[#0B2545]/10 rounded-lg"><ShieldCheck size={20} className="text-[#0B2545]" /></div>
            <h3 className="font-semibold text-gray-900">SSNIT Reports</h3>
          </div>
          <p className="text-sm text-gray-500">Tier 1 social security contribution reports and filing status</p>
        </Link>
        <Link href="/compliance/paye" className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-[#D4A843]/10 rounded-lg"><FileText size={20} className="text-[#D4A843]" /></div>
            <h3 className="font-semibold text-gray-900">PAYE/GRA Reports</h3>
          </div>
          <p className="text-sm text-gray-500">Pay As You Earn income tax reports for Ghana Revenue Authority</p>
        </Link>
        <Link href="/compliance/pension" className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-green-50 rounded-lg"><FileText size={20} className="text-green-600" /></div>
            <h3 className="font-semibold text-gray-900">Pension Reports</h3>
          </div>
          <p className="text-sm text-gray-500">Tier 2 mandatory and Tier 3 voluntary pension fund reports</p>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">All Filings</h3>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Period</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complianceItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 text-sm font-medium text-gray-800">{item.type}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{item.period}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{item.dueDate}</td>
                <td className="px-5 py-3 text-sm text-gray-800 text-right font-medium">{formatGHS(item.amount)}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    item.status === "pending" ? "bg-orange-50 text-orange-700" : "bg-green-50 text-green-700"
                  }`}>
                    {item.status === "pending" ? "Pending" : "Filed"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => showToast(item.type + " report for " + item.period + " downloaded", "success")} className="p-1.5 text-gray-400 hover:text-[#0B2545] hover:bg-gray-100 rounded-lg transition-colors">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div></PageTransition>
  );
}
