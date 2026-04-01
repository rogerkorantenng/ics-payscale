"use client";

import { activeEmployees, formatGHS, payeBrackets } from "@/lib/mock-data";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/page-transition";
import { useToast } from "@/components/toast";
import { downloadCSV, downloadPDF, formatCurrency } from "@/lib/export-utils";

export default function PAYEReportPage() {
  const { showToast } = useToast();
  const totalPAYE = activeEmployees.reduce((s, e) => s + e.paye, 0);

  const handleExportCSV = () => {
    downloadCSV(
      "paye-gra-march-2026.csv",
      ["Employee ID", "Name", "TIN", "Gross Income", "SSNIT Deduction", "Taxable Income", "PAYE Tax"],
      activeEmployees.map((e) => [
        e.id, `${e.firstName} ${e.lastName}`, `TIN-${e.id.replace("EMP", "")}GH`,
        e.grossSalary.toFixed(2), e.ssnitEmployee.toFixed(2),
        (e.grossSalary - e.ssnitEmployee).toFixed(2), e.paye.toFixed(2),
      ])
    );
    showToast("PAYE/GRA report exported as CSV — " + activeEmployees.length + " records", "success");
  };

  return (
    <PageTransition><div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/compliance" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft size={20} className="text-gray-600" /></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">PAYE/GRA Report</h1>
          <p className="text-sm text-gray-500 mt-0.5">Pay As You Earn Income Tax Report — March 2026</p>
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 bg-gradient-to-r from-[#0B2545] to-[#1a4a7a] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg transition-all active:scale-[0.98]"><Download size={16} /> Export CSV</button>
        <button
          onClick={() => {
            downloadPDF("paye-gra-march-2026.pdf", "PAYE/GRA Report — March 2026", `
              <h1>PAYE / GRA Income Tax Report</h1>
              <p>Period: March 2026 | Employees: ${activeEmployees.length}</p>
              <div class="summary-box">
                <div class="summary-row"><span>Total PAYE Tax:</span> <strong>${formatCurrency(totalPAYE)}</strong></div>
                <div class="summary-row"><span>Total Employees:</span> <strong>${activeEmployees.length}</strong></div>
              </div>
              <h2>Tax Brackets Applied</h2>
              <table><tr><th>Range</th><th>Rate</th></tr>${payeBrackets.map((b) => `<tr><td>GH₵ ${b.min.toLocaleString()} — ${b.max === Infinity ? "Above" : "GH₵ " + b.max.toLocaleString()}</td><td>${(b.rate * 100).toFixed(1)}%</td></tr>`).join("")}</table>
              <h2>Employee PAYE Details</h2>
              <table><tr><th>Employee</th><th>TIN</th><th>Gross</th><th>Taxable</th><th>PAYE</th></tr>
              ${activeEmployees.map((e) => `<tr><td>${e.firstName} ${e.lastName}</td><td>TIN-${e.id.replace("EMP", "")}GH</td><td>${formatCurrency(e.grossSalary)}</td><td>${formatCurrency(e.grossSalary - e.ssnitEmployee)}</td><td>${formatCurrency(e.paye)}</td></tr>`).join("")}
              </table>
            `);
            showToast("PAYE report opened for printing", "success");
          }}
          className="flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all active:scale-[0.98]"
        >Print PDF</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-gray-500">Total PAYE Tax</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatGHS(totalPAYE)}</p>
          <p className="text-xs text-gray-500 mt-1">{activeEmployees.length} employees</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-gray-500">Ghana PAYE Tax Brackets (Monthly)</p>
          <div className="mt-2 space-y-1">
            {payeBrackets.slice(0, 5).map((b, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-gray-500">GH₵ {b.min.toLocaleString()} - {b.max === Infinity ? "Above" : `GH₵ ${b.max.toLocaleString()}`}</span>
                <span className="font-medium">{(b.rate * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-auto max-h-[500px]">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">TIN</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Gross Income</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">SSNIT Deduction</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Taxable Income</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">PAYE Tax</th>
              </tr>
            </thead>
            <tbody>
              {activeEmployees.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{emp.firstName} {emp.lastName}</td>
                  <td className="px-4 py-2.5 text-xs font-mono text-gray-500">TIN-{emp.id.replace("EMP", "")}GH</td>
                  <td className="px-4 py-2.5 text-sm text-right">{formatGHS(emp.grossSalary)}</td>
                  <td className="px-4 py-2.5 text-sm text-right text-gray-500">{formatGHS(emp.ssnitEmployee)}</td>
                  <td className="px-4 py-2.5 text-sm text-right">{formatGHS(emp.grossSalary - emp.ssnitEmployee)}</td>
                  <td className="px-4 py-2.5 text-sm text-right font-medium text-red-600">{formatGHS(emp.paye)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div></PageTransition>
  );
}
