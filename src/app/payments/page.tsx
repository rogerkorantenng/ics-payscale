"use client";

import { useState } from "react";
import { activeEmployees, formatGHS, payrollRuns, campuses } from "@/lib/mock-data";
import { Send, CheckCircle, Clock, Loader2, Download, AlertTriangle, CreditCard, Building2, ArrowRight, RefreshCw } from "lucide-react";
import PageTransition from "@/components/page-transition";
import { useToast } from "@/components/toast";
import { motion, AnimatePresence } from "framer-motion";
import { downloadCSV } from "@/lib/export-utils";

interface PaymentRecord {
  id: string;
  name: string;
  campusId: string;
  bank: string;
  accountNo: string;
  amount: number;
  status: "pending" | "processing" | "sent" | "failed";
}

const banks = ["GCB Bank", "Ecobank Ghana", "Stanbic Bank", "Absa Ghana", "Fidelity Bank", "CalBank", "Republic Bank", "Access Bank"];

function generatePayments(): PaymentRecord[] {
  return activeEmployees.map((emp, i) => ({
    id: `PAY-${emp.id}`,
    name: `${emp.firstName} ${emp.lastName}`,
    campusId: emp.campusId,
    bank: banks[i % banks.length],
    accountNo: `${1000000000 + i * 7331}`,
    amount: emp.netPay,
    status: "pending" as const,
  }));
}

const recentBatches = [
  { id: "BATCH-2026-03", period: "March 2026", date: "2026-03-28", total: 1798400, count: 228, status: "completed" as const },
  { id: "BATCH-2026-02", period: "February 2026", date: "2026-02-27", total: 1783600, count: 226, status: "completed" as const },
  { id: "BATCH-2026-01", period: "January 2026", date: "2026-01-29", total: 1771200, count: 225, status: "completed" as const },
];

export default function PaymentsPage() {
  const { showToast } = useToast();
  const [payments, setPayments] = useState<PaymentRecord[]>(generatePayments);
  const [processing, setProcessing] = useState(false);
  const [batchComplete, setBatchComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPayroll, setSelectedPayroll] = useState("PR-2026-03");
  const [campusFilter, setCampusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");

  const filtered = campusFilter === "all" ? payments : payments.filter((p) => p.campusId === campusFilter);
  const totalAmount = filtered.reduce((s, p) => s + p.amount, 0);
  const sentCount = filtered.filter((p) => p.status === "sent").length;
  const pendingCount = filtered.filter((p) => p.status === "pending").length;

  const handleProcessAll = () => {
    setProcessing(true);
    setBatchComplete(false);
    setCurrentIndex(0);

    const total = filtered.length;
    let idx = 0;

    const processNext = () => {
      if (idx >= total) {
        setProcessing(false);
        setBatchComplete(true);
        showToast(`All ${total} payments sent successfully! Total: ${formatGHS(totalAmount)}`, "success");
        return;
      }

      const empId = filtered[idx].id;
      setPayments((prev) => prev.map((p) => p.id === empId ? { ...p, status: "processing" } : p));

      setTimeout(() => {
        setPayments((prev) => prev.map((p) => p.id === empId ? { ...p, status: "sent" } : p));
        idx++;
        setCurrentIndex(idx);
        processNext();
      }, 40);
    };

    processNext();
  };

  const handleRetrySingle = (id: string) => {
    setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status: "processing" } : p));
    setTimeout(() => {
      setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status: "sent" } : p));
      showToast("Payment retried and sent successfully", "success");
    }, 1500);
  };

  const handleExportReceipt = () => {
    downloadCSV(
      `payment-batch-${selectedPayroll}.csv`,
      ["Payment ID", "Employee", "Bank", "Account No.", "Amount (GHS)", "Status"],
      payments.map((p) => [p.id, p.name, p.bank, p.accountNo, p.amount.toFixed(2), p.status])
    );
    showToast("Payment receipt exported as CSV", "success");
  };

  const handleReset = () => {
    setPayments(generatePayments());
    setBatchComplete(false);
    setCurrentIndex(0);
    showToast("Payment batch reset — ready for new disbursement", "info");
  };

  return (
    <PageTransition><div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salary Disbursement</h1>
          <p className="text-sm text-gray-500 mt-1">Send payments directly to employee bank accounts</p>
        </div>
        <div className="flex gap-3">
          {batchComplete && (
            <button onClick={handleExportReceipt} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all active:scale-[0.98]">
              <Download size={16} /> Export Receipt
            </button>
          )}
          {batchComplete && (
            <button onClick={handleReset} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all active:scale-[0.98]">
              <RefreshCw size={16} /> New Batch
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        <button onClick={() => setActiveTab("new")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "new" ? "bg-white text-[#0B2545] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>New Disbursement</button>
        <button onClick={() => setActiveTab("history")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "history" ? "bg-white text-[#0B2545] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Payment History</button>
      </div>

      {activeTab === "history" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Batch ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Period</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Employees</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBatches.map((batch) => (
                <tr key={batch.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3 text-sm font-mono font-medium text-[#0B2545]">{batch.id}</td>
                  <td className="px-5 py-3 text-sm text-gray-800">{batch.period}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{batch.date}</td>
                  <td className="px-5 py-3 text-sm text-right font-medium">{formatGHS(batch.total)}</td>
                  <td className="px-5 py-3 text-sm text-right">{batch.count}</td>
                  <td className="px-5 py-3"><span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-green-50 text-green-700 rounded-full font-medium"><CheckCircle size={12} /> Completed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "new" && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#0B2545]/10 rounded-xl"><CreditCard size={20} className="text-[#0B2545]" /></div>
                <div>
                  <p className="text-xs text-gray-500">Total Disbursement</p>
                  <p className="text-lg font-bold text-gray-900">{formatGHS(totalAmount)}</p>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-xl"><Building2 size={20} className="text-blue-600" /></div>
                <div>
                  <p className="text-xs text-gray-500">Employees</p>
                  <p className="text-lg font-bold text-gray-900">{filtered.length}</p>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-50 rounded-xl"><CheckCircle size={20} className="text-green-600" /></div>
                <div>
                  <p className="text-xs text-gray-500">Sent</p>
                  <p className="text-lg font-bold text-green-600">{sentCount} / {filtered.length}</p>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-50 rounded-xl"><Clock size={20} className="text-orange-600" /></div>
                <div>
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="text-lg font-bold text-orange-600">{pendingCount}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Progress Bar */}
          {(processing || batchComplete) && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 overflow-hidden">
              <div className={`rounded-xl p-4 ${batchComplete ? "bg-green-50 border border-green-200" : "bg-blue-50 border border-blue-200"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {batchComplete ? <CheckCircle size={18} className="text-green-600" /> : <Loader2 size={18} className="text-blue-600 animate-spin" />}
                    <span className={`font-semibold text-sm ${batchComplete ? "text-green-800" : "text-blue-800"}`}>
                      {batchComplete ? "All payments sent successfully!" : `Processing payments... ${currentIndex} / ${filtered.length}`}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{Math.round((sentCount / filtered.length) * 100)}%</span>
                </div>
                <div className="w-full bg-white/50 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${batchComplete ? "bg-green-500" : "bg-gradient-to-r from-blue-500 to-[#0B2545]"}`}
                    initial={{ width: "0%" }}
                    animate={{ width: `${(sentCount / filtered.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4 mb-4">
            <select value={campusFilter} onChange={(e) => setCampusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20">
              {campuses.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
            <select value={selectedPayroll} onChange={(e) => setSelectedPayroll(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20">
              {payrollRuns.map((r) => (<option key={r.id} value={r.id}>{r.period} ({r.id})</option>))}
            </select>
            <div className="flex-1" />
            {!processing && !batchComplete && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProcessAll}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-green-600/20 transition-all"
              >
                <Send size={16} /> Send All Payments ({filtered.length})
              </motion.button>
            )}
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-auto max-h-[500px]">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Bank</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Account No.</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((payment) => (
                    <tr key={payment.id} className={`border-b border-gray-50 transition-colors ${payment.status === "processing" ? "bg-blue-50/30" : payment.status === "sent" ? "bg-green-50/20" : "hover:bg-gray-50/50"}`}>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-[#0B2545] rounded-full flex items-center justify-center text-white text-[10px] font-medium flex-shrink-0">
                            {payment.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="text-sm font-medium text-gray-800">{payment.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{payment.bank}</td>
                      <td className="px-4 py-2.5 text-sm font-mono text-gray-500">{payment.accountNo}</td>
                      <td className="px-4 py-2.5 text-sm text-right font-medium text-gray-800">{formatGHS(payment.amount)}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                          payment.status === "sent" ? "bg-green-50 text-green-700" :
                          payment.status === "processing" ? "bg-blue-50 text-blue-700" :
                          payment.status === "failed" ? "bg-red-50 text-red-700" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {payment.status === "sent" && <CheckCircle size={11} />}
                          {payment.status === "processing" && <Loader2 size={11} className="animate-spin" />}
                          {payment.status === "failed" && <AlertTriangle size={11} />}
                          {payment.status === "pending" && <Clock size={11} />}
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {payment.status === "pending" && !processing && (
                          <button onClick={() => handleRetrySingle(payment.id)} className="text-xs text-[#0B2545] font-medium hover:underline flex items-center gap-1 ml-auto">
                            <Send size={11} /> Send
                          </button>
                        )}
                        {payment.status === "failed" && (
                          <button onClick={() => handleRetrySingle(payment.id)} className="text-xs text-red-600 font-medium hover:underline flex items-center gap-1 ml-auto">
                            <RefreshCw size={11} /> Retry
                          </button>
                        )}
                        {payment.status === "sent" && (
                          <span className="text-xs text-green-600">✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div></PageTransition>
  );
}
