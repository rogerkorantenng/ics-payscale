"use client";

import { useState } from "react";
import { campuses, activeEmployees, formatGHS } from "@/lib/mock-data";
import { ArrowLeft, ArrowRight, Check, FileText, Printer, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/toast";
import PageTransition from "@/components/page-transition";

const steps = ["Select Campus & Period", "Review Employees", "Payroll Breakdown", "Preview Payslips", "Approve & Process"];

export default function PayrollRunWizard() {
  const [step, setStep] = useState(0);
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("2026-04");
  const [showPayslip, setShowPayslip] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const { showToast } = useToast();

  const filtered = selectedCampus === "all" ? activeEmployees : activeEmployees.filter((e) => e.campusId === selectedCampus);
  const totalGross = filtered.reduce((s, e) => s + e.grossSalary, 0);
  const totalNet = filtered.reduce((s, e) => s + e.netPay, 0);
  const totalDeductions = filtered.reduce((s, e) => s + e.totalDeductions, 0);
  const totalSSNITEmp = filtered.reduce((s, e) => s + e.ssnitEmployee, 0);
  const totalSSNITEr = filtered.reduce((s, e) => s + e.ssnitEmployer, 0);
  const totalPAYE = filtered.reduce((s, e) => s + e.paye, 0);
  const totalTier2 = filtered.reduce((s, e) => s + e.tier2, 0);

  const payslipEmployee = filtered.find((e) => e.id === showPayslip);

  const handleProcess = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
      showToast("Payroll processed successfully! Bank files generated for " + filtered.length + " employees.", "success");
    }, 3000);
  };

  return (
    <PageTransition>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/payroll" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Run Payroll</h1>
          <p className="text-sm text-gray-500 mt-0.5">Process payroll for your employees</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <motion.div
                initial={false}
                animate={{
                  scale: i === step ? 1.1 : 1,
                  backgroundColor: i < step ? "#22c55e" : i === step ? "#0B2545" : "#f3f4f6",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ color: i <= step ? "white" : "#9ca3af" }}
              >
                {i < step ? <Check size={16} /> : i + 1}
              </motion.div>
              <span className={`text-xs font-medium hidden xl:block ${i === step ? "text-[#0B2545]" : "text-gray-400"}`}>{s}</span>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ width: i < step ? "100%" : "0%" }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-green-500 rounded-full"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          {step === 0 && (
            <div className="max-w-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Campus & Pay Period</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
                  <select value={selectedCampus} onChange={(e) => setSelectedCampus(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20 transition-all">
                    {campuses.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pay Period</label>
                  <input type="month" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20 transition-all" />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-blue-50 rounded-xl border border-blue-100"
                >
                  <p className="text-sm text-blue-800"><strong>{filtered.length}</strong> active employees will be included in this payroll run.</p>
                  <p className="text-sm text-blue-600 mt-1">Estimated gross: <strong>{formatGHS(totalGross)}</strong></p>
                </motion.div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Review Employees ({filtered.length})</h2>
              <div className="overflow-auto max-h-[500px] rounded-lg">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">ID</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Name</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Department</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Position</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Basic Salary</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Gross</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 50).map((emp, i) => (
                      <motion.tr
                        key={emp.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-b border-gray-50 hover:bg-gray-50/50"
                      >
                        <td className="px-4 py-2.5 text-xs font-mono text-gray-500">{emp.id}</td>
                        <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{emp.firstName} {emp.lastName}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-600">{emp.department}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-600">{emp.position}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-800 text-right">{formatGHS(emp.basicSalary)}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-800 text-right font-medium">{formatGHS(emp.grossSalary)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length > 50 && <p className="text-xs text-gray-400 mt-2 px-4">Showing 50 of {filtered.length} employees</p>}
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payroll Breakdown</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Gross", value: totalGross, color: "bg-[#0B2545]/5", textColor: "text-gray-900" },
                  { label: "Total Deductions", value: totalDeductions, color: "bg-red-50", textColor: "text-red-700" },
                  { label: "Total Net Pay", value: totalNet, color: "bg-green-50", textColor: "text-green-700" },
                  { label: "Employer Costs", value: totalSSNITEr + totalTier2, color: "bg-[#D4A843]/10", textColor: "text-[#D4A843]" },
                ].map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`p-4 ${item.color} rounded-xl`}>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className={`text-lg font-bold mt-1 ${item.textColor}`}>{formatGHS(item.value)}</p>
                  </motion.div>
                ))}
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Statutory Breakdown</h3>
              <div className="overflow-auto rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Deduction Type</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Employer</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100"><td className="px-4 py-3 text-sm font-medium">SSNIT Tier 1</td><td className="px-4 py-3 text-sm text-right">{formatGHS(totalSSNITEmp)}</td><td className="px-4 py-3 text-sm text-right">{formatGHS(totalSSNITEr)}</td><td className="px-4 py-3 text-sm text-right font-medium">{formatGHS(totalSSNITEmp + totalSSNITEr)}</td></tr>
                    <tr className="border-b border-gray-100"><td className="px-4 py-3 text-sm font-medium">PAYE (GRA)</td><td className="px-4 py-3 text-sm text-right">{formatGHS(totalPAYE)}</td><td className="px-4 py-3 text-sm text-right text-gray-400">—</td><td className="px-4 py-3 text-sm text-right font-medium">{formatGHS(totalPAYE)}</td></tr>
                    <tr className="border-b border-gray-100"><td className="px-4 py-3 text-sm font-medium">Tier 2 Pension</td><td className="px-4 py-3 text-sm text-right text-gray-400">—</td><td className="px-4 py-3 text-sm text-right">{formatGHS(totalTier2)}</td><td className="px-4 py-3 text-sm text-right font-medium">{formatGHS(totalTier2)}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview Payslips</h2>
              <p className="text-sm text-gray-500 mb-4">Click on an employee to preview their payslip.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-[400px] overflow-auto">
                {filtered.slice(0, 30).map((emp, i) => (
                  <motion.button
                    key={emp.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPayslip(emp.id)}
                    className={`text-left p-3 rounded-xl border transition-all ${showPayslip === emp.id ? "border-[#0B2545] bg-[#0B2545]/5 shadow-md" : "border-gray-200 hover:border-gray-300 hover:shadow-sm"}`}
                  >
                    <p className="text-sm font-medium text-gray-800">{emp.firstName} {emp.lastName}</p>
                    <p className="text-xs text-gray-500">{emp.department} — {emp.position}</p>
                    <p className="text-sm font-semibold text-[#0B2545] mt-1">{formatGHS(emp.netPay)}</p>
                  </motion.button>
                ))}
              </div>
              <AnimatePresence>
                {payslipEmployee && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: 20, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 border border-gray-200 rounded-xl p-6 bg-gray-50 shadow-inner overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#0B2545]">ICS PayScale — Payslip</h3>
                        <p className="text-xs text-gray-500">International Community School Ghana</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => showToast("Payslip sent to printer", "info")} className="p-2 text-gray-500 hover:text-[#0B2545] hover:bg-white rounded-lg transition-colors"><Printer size={16} /></button>
                        <button onClick={() => showToast("Payslip exported as PDF", "success")} className="p-2 text-gray-500 hover:text-[#0B2545] hover:bg-white rounded-lg transition-colors"><FileText size={16} /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div><span className="text-gray-500">Employee:</span> <strong>{payslipEmployee.firstName} {payslipEmployee.lastName}</strong></div>
                      <div><span className="text-gray-500">ID:</span> <strong>{payslipEmployee.id}</strong></div>
                      <div><span className="text-gray-500">Department:</span> <strong>{payslipEmployee.department}</strong></div>
                      <div><span className="text-gray-500">Period:</span> <strong>April 2026</strong></div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Earnings</h4>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between"><span>Basic Salary</span><span className="font-medium">{formatGHS(payslipEmployee.basicSalary)}</span></div>
                          <div className="flex justify-between"><span>Housing Allowance</span><span className="font-medium">{formatGHS(payslipEmployee.housingAllowance)}</span></div>
                          <div className="flex justify-between"><span>Transport Allowance</span><span className="font-medium">{formatGHS(payslipEmployee.transportAllowance)}</span></div>
                          <div className="flex justify-between pt-1.5 border-t border-gray-300 font-semibold"><span>Gross Salary</span><span>{formatGHS(payslipEmployee.grossSalary)}</span></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Deductions</h4>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between"><span>SSNIT (5.5%)</span><span className="font-medium text-red-600">{formatGHS(payslipEmployee.ssnitEmployee)}</span></div>
                          <div className="flex justify-between"><span>PAYE Tax</span><span className="font-medium text-red-600">{formatGHS(payslipEmployee.paye)}</span></div>
                          {payslipEmployee.tier3 > 0 && <div className="flex justify-between"><span>Tier 3</span><span className="font-medium text-red-600">{formatGHS(payslipEmployee.tier3)}</span></div>}
                          <div className="flex justify-between pt-1.5 border-t border-gray-300 font-semibold"><span>Total Deductions</span><span className="text-red-600">{formatGHS(payslipEmployee.totalDeductions)}</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200 flex justify-between items-center">
                      <span className="text-sm font-semibold text-green-800">Net Pay</span>
                      <span className="text-xl font-bold text-green-700">{formatGHS(payslipEmployee.netPay)}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {step === 4 && (
            <div className="text-center max-w-lg mx-auto py-8">
              {processing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 mx-auto mb-4"
                  >
                    <Loader2 size={64} className="text-[#0B2545]" />
                  </motion.div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Processing Payroll...</h2>
                  <p className="text-sm text-gray-500">Calculating salaries, deductions, and generating bank files for {filtered.length} employees.</p>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3, ease: "easeInOut" }}
                      className="h-full bg-gradient-to-r from-[#0B2545] to-[#D4A843] rounded-full"
                    />
                  </div>
                </motion.div>
              ) : processed ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check size={40} className="text-green-600" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-green-700 mb-2">Payroll Processed Successfully!</h2>
                  <p className="text-sm text-gray-500 mb-4">Bank files generated for {filtered.length} employees. Total disbursement: {formatGHS(totalNet)}</p>
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => showToast("Bank file downloaded", "success")} className="px-5 py-2.5 bg-[#0B2545] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all">Download Bank File</button>
                    <Link href="/payroll" className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">View All Runs</Link>
                  </div>
                </motion.div>
              ) : (
                <>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-16 h-16 bg-[#0B2545]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-[#0B2545]" />
                  </motion.div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Ready to Process</h2>
                  <p className="text-sm text-gray-500 mb-6">Review the summary below and approve the payroll run.</p>
                  <div className="text-left bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Campus</span><span className="font-medium">{campuses.find(c => c.id === selectedCampus)?.name}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Period</span><span className="font-medium">{selectedPeriod}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Employees</span><span className="font-medium">{filtered.length}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Total Gross</span><span className="font-semibold">{formatGHS(totalGross)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Total Deductions</span><span className="font-semibold text-red-600">{formatGHS(totalDeductions)}</span></div>
                    <div className="flex justify-between border-t border-gray-200 pt-3"><span className="text-gray-700 font-semibold">Total Net Pay</span><span className="font-bold text-green-700 text-lg">{formatGHS(totalNet)}</span></div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProcess}
                    className="mt-6 bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-green-600/20 transition-all"
                  >
                    Approve & Process Payroll
                  </motion.button>
                </>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {!processing && !processed && (
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft size={16} /> Previous
          </button>
          {step < steps.length - 1 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0B2545] to-[#1a4a7a] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0B2545]/20 transition-all"
            >
              Next <ArrowRight size={16} />
            </motion.button>
          )}
        </div>
      )}
    </PageTransition>
  );
}
