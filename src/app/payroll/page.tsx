"use client";

import { payrollRuns, formatGHS, activeEmployees } from "@/lib/mock-data";
import { Play, Download, Eye, CheckCircle, X } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/page-transition";
import { useToast } from "@/components/toast";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { downloadCSV, downloadPDF, formatCurrency } from "@/lib/export-utils";

export default function PayrollPage() {
  const { showToast } = useToast();
  const [viewingRun, setViewingRun] = useState<string | null>(null);
  const run = payrollRuns.find((r) => r.id === viewingRun);

  const handleDownload = (runId: string) => {
    const r = payrollRuns.find((pr) => pr.id === runId)!;
    downloadCSV(
      `payroll-${r.id}.csv`,
      ["Employee ID", "Name", "Department", "Campus", "Gross Salary", "SSNIT (Employee)", "PAYE", "Total Deductions", "Net Pay"],
      activeEmployees.slice(0, 50).map((e) => [
        e.id, `${e.firstName} ${e.lastName}`, e.department, e.campusId,
        e.grossSalary.toFixed(2), e.ssnitEmployee.toFixed(2), e.paye.toFixed(2),
        e.totalDeductions.toFixed(2), e.netPay.toFixed(2),
      ])
    );
    showToast(`Payroll CSV downloaded for ${r.period}`, "success");
  };

  return (
    <PageTransition><div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Runs</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and review payroll processing history</p>
        </div>
        <Link
          href="/payroll/run"
          className="flex items-center gap-2 bg-gradient-to-r from-[#0B2545] to-[#1a4a7a] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0B2545]/20 transition-all active:scale-[0.98]"
        >
          <Play size={16} /> New Payroll Run
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Run ID</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Period</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Campus</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Employees</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Total Gross</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Total Net</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Processed</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payrollRuns.map((run, i) => (
              <motion.tr
                key={run.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-5 py-4 text-sm font-mono font-medium text-[#0B2545]">{run.id}</td>
                <td className="px-5 py-4 text-sm text-gray-800 font-medium">{run.period}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{run.campus}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{run.employeeCount}</td>
                <td className="px-5 py-4 text-sm text-gray-800 text-right font-medium">{formatGHS(run.totalGross)}</td>
                <td className="px-5 py-4 text-sm text-gray-800 text-right font-medium">{formatGHS(run.totalNet)}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                    <CheckCircle size={12} /> Completed
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{run.processedDate}</td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setViewingRun(run.id)} className="p-1.5 text-gray-400 hover:text-[#0B2545] hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => handleDownload(run.id)} className="p-1.5 text-gray-400 hover:text-[#0B2545] hover:bg-gray-100 rounded-lg transition-colors" title="Download CSV">
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {run && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-40" onClick={() => setViewingRun(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 w-[600px] max-h-[80vh] overflow-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Payroll Run: {run.id}</h3>
                  <p className="text-sm text-gray-500">{run.period}</p>
                </div>
                <button onClick={() => setViewingRun(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500">Campus</p><p className="text-sm font-medium mt-0.5">{run.campus}</p></div>
                  <div className="p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500">Employees</p><p className="text-sm font-medium mt-0.5">{run.employeeCount}</p></div>
                  <div className="p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500">Total Gross</p><p className="text-sm font-bold text-gray-900 mt-0.5">{formatGHS(run.totalGross)}</p></div>
                  <div className="p-3 bg-green-50 rounded-xl"><p className="text-xs text-gray-500">Total Net</p><p className="text-sm font-bold text-green-700 mt-0.5">{formatGHS(run.totalNet)}</p></div>
                  <div className="p-3 bg-red-50 rounded-xl"><p className="text-xs text-gray-500">Total Deductions</p><p className="text-sm font-bold text-red-600 mt-0.5">{formatGHS(run.totalGross - run.totalNet)}</p></div>
                  <div className="p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500">Processed Date</p><p className="text-sm font-medium mt-0.5">{run.processedDate}</p></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { handleDownload(run.id); setViewingRun(null); }} className="flex-1 flex items-center justify-center gap-2 bg-[#0B2545] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#0B2545]/90 transition-all">
                    <Download size={16} /> Download CSV
                  </button>
                  <button
                    onClick={() => {
                      downloadPDF(`payroll-${run.id}.pdf`, `Payroll Report - ${run.period}`, `
                        <h1>Payroll Report — ${run.period}</h1>
                        <div class="summary-box">
                          <div class="summary-row"><span>Campus:</span> <strong>${run.campus}</strong></div>
                          <div class="summary-row"><span>Employees:</span> <strong>${run.employeeCount}</strong></div>
                          <div class="summary-row"><span>Total Gross:</span> <strong>${formatCurrency(run.totalGross)}</strong></div>
                          <div class="summary-row"><span>Total Deductions:</span> <strong>${formatCurrency(run.totalGross - run.totalNet)}</strong></div>
                          <div class="summary-row"><span>Total Net Pay:</span> <strong>${formatCurrency(run.totalNet)}</strong></div>
                          <div class="summary-row"><span>Processed:</span> <strong>${run.processedDate}</strong></div>
                        </div>
                        <h2>Employee Breakdown (Sample)</h2>
                        <table>
                          <tr><th>ID</th><th>Name</th><th>Department</th><th>Gross</th><th>Deductions</th><th>Net Pay</th></tr>
                          ${activeEmployees.slice(0, 20).map((e) => `<tr><td>${e.id}</td><td>${e.firstName} ${e.lastName}</td><td>${e.department}</td><td>${formatCurrency(e.grossSalary)}</td><td>${formatCurrency(e.totalDeductions)}</td><td>${formatCurrency(e.netPay)}</td></tr>`).join("")}
                        </table>
                      `);
                      showToast("Payroll PDF report opened for printing", "success");
                      setViewingRun(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all"
                  >
                    Print Report
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div></PageTransition>
  );
}
