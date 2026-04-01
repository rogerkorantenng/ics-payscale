"use client";

import { activeEmployees, formatGHS } from "@/lib/mock-data";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/page-transition";
import { useToast } from "@/components/toast";
import { downloadCSV, downloadPDF, formatCurrency } from "@/lib/export-utils";

export default function SSNITReportPage() {
  const { showToast } = useToast();
  const totalEmployeeSSNIT = activeEmployees.reduce((s, e) => s + e.ssnitEmployee, 0);
  const totalEmployerSSNIT = activeEmployees.reduce((s, e) => s + e.ssnitEmployer, 0);

  const handleExport = () => {
    downloadCSV(
      "ssnit-tier1-march-2026.csv",
      ["Employee ID", "Name", "SSNIT No.", "Gross Salary", "Employee (5.5%)", "Employer (13%)", "Total"],
      activeEmployees.map((e) => [
        e.id, `${e.firstName} ${e.lastName}`, `SSNIT-${e.id.replace("EMP", "")}`,
        e.grossSalary.toFixed(2), e.ssnitEmployee.toFixed(2), e.ssnitEmployer.toFixed(2),
        (e.ssnitEmployee + e.ssnitEmployer).toFixed(2),
      ])
    );
    showToast("SSNIT Tier 1 report exported as CSV — " + activeEmployees.length + " records", "success");
  };

  return (
    <PageTransition><div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/compliance" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft size={20} className="text-gray-600" /></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">SSNIT Tier 1 Report</h1>
          <p className="text-sm text-gray-500 mt-0.5">Social Security Contribution Report — March 2026</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 bg-gradient-to-r from-[#0B2545] to-[#1a4a7a] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg transition-all active:scale-[0.98]">
          <Download size={16} /> Export CSV
        </button>
        <button
          onClick={() => {
            downloadPDF("ssnit-tier1-march-2026.pdf", "SSNIT Tier 1 Report — March 2026", `
              <h1>SSNIT Tier 1 Contribution Report</h1>
              <p>Period: March 2026 | Employees: ${activeEmployees.length}</p>
              <div class="summary-box">
                <div class="summary-row"><span>Employee Contribution (5.5%):</span> <strong>${formatCurrency(totalEmployeeSSNIT)}</strong></div>
                <div class="summary-row"><span>Employer Contribution (13%):</span> <strong>${formatCurrency(totalEmployerSSNIT)}</strong></div>
                <div class="summary-row"><span>Total SSNIT Contribution:</span> <strong>${formatCurrency(totalEmployeeSSNIT + totalEmployerSSNIT)}</strong></div>
              </div>
              <h2>Contribution Details</h2>
              <table>
                <tr><th>Employee</th><th>SSNIT No.</th><th>Gross Salary</th><th>Employee (5.5%)</th><th>Employer (13%)</th><th>Total</th></tr>
                ${activeEmployees.map((e) => `<tr><td>${e.firstName} ${e.lastName}</td><td>SSNIT-${e.id.replace("EMP", "")}</td><td>${formatCurrency(e.grossSalary)}</td><td>${formatCurrency(e.ssnitEmployee)}</td><td>${formatCurrency(e.ssnitEmployer)}</td><td>${formatCurrency(e.ssnitEmployee + e.ssnitEmployer)}</td></tr>`).join("")}
              </table>
            `);
            showToast("SSNIT report opened for printing", "success");
          }}
          className="flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all active:scale-[0.98]"
        >
          Print PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"><p className="text-xs text-gray-500">Employee Contribution (5.5%)</p><p className="text-2xl font-bold text-gray-900 mt-1">{formatGHS(totalEmployeeSSNIT)}</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"><p className="text-xs text-gray-500">Employer Contribution (13%)</p><p className="text-2xl font-bold text-gray-900 mt-1">{formatGHS(totalEmployerSSNIT)}</p></div>
        <div className="bg-[#0B2545]/5 border border-[#0B2545]/20 rounded-xl p-5"><p className="text-xs text-gray-500">Total SSNIT Contribution</p><p className="text-2xl font-bold text-[#0B2545] mt-1">{formatGHS(totalEmployeeSSNIT + totalEmployerSSNIT)}</p></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-auto max-h-[500px]">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">SSNIT No.</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Gross Salary</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Employee (5.5%)</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Employer (13%)</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody>
              {activeEmployees.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{emp.firstName} {emp.lastName}</td>
                  <td className="px-4 py-2.5 text-xs font-mono text-gray-500">SSNIT-{emp.id.replace("EMP", "")}</td>
                  <td className="px-4 py-2.5 text-sm text-right">{formatGHS(emp.grossSalary)}</td>
                  <td className="px-4 py-2.5 text-sm text-right">{formatGHS(emp.ssnitEmployee)}</td>
                  <td className="px-4 py-2.5 text-sm text-right">{formatGHS(emp.ssnitEmployer)}</td>
                  <td className="px-4 py-2.5 text-sm text-right font-medium">{formatGHS(emp.ssnitEmployee + emp.ssnitEmployer)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div></PageTransition>
  );
}
