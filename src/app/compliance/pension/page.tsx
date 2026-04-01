"use client";

import { activeEmployees, formatGHS } from "@/lib/mock-data";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/page-transition";
import { useToast } from "@/components/toast";
import { downloadCSV } from "@/lib/export-utils";

export default function PensionReportPage() {
  const { showToast } = useToast();
  const totalTier2 = activeEmployees.reduce((s, e) => s + e.tier2, 0);
  const tier3Employees = activeEmployees.filter((e) => e.tier3 > 0);
  const totalTier3 = tier3Employees.reduce((s, e) => s + e.tier3, 0);

  const handleExport = () => {
    downloadCSV(
      "pension-report-march-2026.csv",
      ["Employee ID", "Name", "Gross Salary", "Tier 2 (5%)", "Tier 3 (5%)", "Total Pension"],
      activeEmployees.map((e) => [
        e.id, `${e.firstName} ${e.lastName}`, e.grossSalary.toFixed(2),
        e.tier2.toFixed(2), e.tier3.toFixed(2), (e.tier2 + e.tier3).toFixed(2),
      ])
    );
    showToast("Pension report exported — " + activeEmployees.length + " records", "success");
  };

  return (
    <PageTransition><div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/compliance" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft size={20} className="text-gray-600" /></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Pension Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tier 2 & Tier 3 Pension Fund Reports — March 2026</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 bg-gradient-to-r from-[#0B2545] to-[#1a4a7a] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg transition-all active:scale-[0.98]"><Download size={16} /> Export CSV</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"><p className="text-xs text-gray-500">Tier 2 Mandatory (5% Employer)</p><p className="text-2xl font-bold text-gray-900 mt-1">{formatGHS(totalTier2)}</p><p className="text-xs text-gray-500 mt-1">{activeEmployees.length} employees</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"><p className="text-xs text-gray-500">Tier 3 Voluntary (5%)</p><p className="text-2xl font-bold text-gray-900 mt-1">{formatGHS(totalTier3)}</p><p className="text-xs text-gray-500 mt-1">{tier3Employees.length} enrolled</p></div>
        <div className="bg-[#0B2545]/5 border border-[#0B2545]/20 rounded-xl p-5"><p className="text-xs text-gray-500">Total Pension</p><p className="text-2xl font-bold text-[#0B2545] mt-1">{formatGHS(totalTier2 + totalTier3)}</p></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
        <div className="px-5 py-4 border-b border-gray-200"><h3 className="font-semibold text-gray-900">Tier 2 — Mandatory Occupational Pension</h3></div>
        <div className="overflow-auto max-h-[300px]">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50"><tr className="border-b border-gray-200"><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th><th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Gross Salary</th><th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tier 2 (5%)</th></tr></thead>
            <tbody>
              {activeEmployees.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-50"><td className="px-4 py-2 text-sm">{emp.firstName} {emp.lastName}</td><td className="px-4 py-2 text-sm text-right">{formatGHS(emp.grossSalary)}</td><td className="px-4 py-2 text-sm text-right font-medium">{formatGHS(emp.tier2)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {tier3Employees.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-200"><h3 className="font-semibold text-gray-900">Tier 3 — Voluntary Provident Fund ({tier3Employees.length} enrolled)</h3></div>
          <div className="overflow-auto max-h-[300px]">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50"><tr className="border-b border-gray-200"><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th><th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Gross Salary</th><th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tier 3 (5%)</th></tr></thead>
              <tbody>
                {tier3Employees.map((emp) => (
                  <tr key={emp.id} className="border-b border-gray-50"><td className="px-4 py-2 text-sm">{emp.firstName} {emp.lastName}</td><td className="px-4 py-2 text-sm text-right">{formatGHS(emp.grossSalary)}</td><td className="px-4 py-2 text-sm text-right font-medium">{formatGHS(emp.tier3)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div></PageTransition>
  );
}
