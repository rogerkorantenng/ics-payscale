"use client";

import { useState } from "react";
import { activeEmployees, formatGHS, complianceItems } from "@/lib/mock-data";
import { ArrowLeft, Send, CheckCircle, Loader2, Download, Search, AlertTriangle, FileText, Shield, Building2, Users, RefreshCw, X } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/page-transition";
import { useToast } from "@/components/toast";
import { motion, AnimatePresence } from "framer-motion";
import { downloadCSV } from "@/lib/export-utils";

type ActionType = "ssnit-submit" | "ssnit-validate" | "gra-paye" | "gra-tin" | "hr-pull" | "hr-push" | null;

interface SSNITResponse {
  referenceNo: string;
  submittedAt: string;
  totalContribution: number;
  employeeCount: number;
  period: string;
  status: string;
}

interface GRAResponse {
  filingId: string;
  submittedAt: string;
  totalTax: number;
  employeeCount: number;
  period: string;
  acknowledgementNo: string;
}

interface TINValidation {
  id: string;
  name: string;
  tin: string;
  status: "valid" | "invalid" | "mismatch";
  message: string;
}

interface HRSyncResult {
  synced: number;
  added: number;
  updated: number;
  errors: number;
  duration: string;
  records: { id: string; name: string; action: string; status: string }[];
}

export default function IntegrationActionsPage() {
  const { showToast } = useToast();
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [loading, setLoading] = useState(false);

  // SSNIT state
  const [ssnitResult, setSsnitResult] = useState<SSNITResponse | null>(null);
  const [ssnitPeriod, setSsnitPeriod] = useState("2026-03");

  // GRA state
  const [graResult, setGraResult] = useState<GRAResponse | null>(null);
  const [graPeriod, setGraPeriod] = useState("2026-03");

  // TIN validation state
  const [tinResults, setTinResults] = useState<TINValidation[]>([]);

  // HR sync state
  const [hrResult, setHrResult] = useState<HRSyncResult | null>(null);
  const [hrSyncProgress, setHrSyncProgress] = useState(0);

  const totalSSNIT = activeEmployees.reduce((s, e) => s + e.ssnitEmployee + e.ssnitEmployer, 0);
  const totalPAYE = activeEmployees.reduce((s, e) => s + e.paye, 0);

  const handleSSNITSubmit = () => {
    setLoading(true);
    setSsnitResult(null);
    setTimeout(() => {
      setLoading(false);
      setSsnitResult({
        referenceNo: `SSNIT-REF-${Date.now().toString(36).toUpperCase()}`,
        submittedAt: new Date().toISOString(),
        totalContribution: totalSSNIT,
        employeeCount: activeEmployees.length,
        period: ssnitPeriod,
        status: "ACCEPTED",
      });
      showToast("SSNIT Tier 1 contribution submitted successfully!", "success");
    }, 3000);
  };

  const handleGRASubmit = () => {
    setLoading(true);
    setGraResult(null);
    setTimeout(() => {
      setLoading(false);
      setGraResult({
        filingId: `GRA-PAYE-${Date.now().toString(36).toUpperCase()}`,
        submittedAt: new Date().toISOString(),
        totalTax: totalPAYE,
        employeeCount: activeEmployees.length,
        period: graPeriod,
        acknowledgementNo: `ACK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      });
      showToast("PAYE filing submitted to Ghana Revenue Authority!", "success");
    }, 3500);
  };

  const handleTINValidation = () => {
    setLoading(true);
    setTinResults([]);

    let idx = 0;
    const batch = activeEmployees.slice(0, 20);

    const processNext = () => {
      if (idx >= batch.length) {
        setLoading(false);
        showToast(`TIN validation complete — ${batch.length} records checked`, "success");
        return;
      }

      const emp = batch[idx];
      const r = Math.random();
      const status: TINValidation["status"] = r < 0.85 ? "valid" : r < 0.95 ? "mismatch" : "invalid";

      setTinResults((prev) => [...prev, {
        id: emp.id,
        name: `${emp.firstName} ${emp.lastName}`,
        tin: `TIN-${emp.id.replace("EMP", "")}GH`,
        status,
        message: status === "valid" ? "TIN verified — matches GRA records"
          : status === "mismatch" ? "Name mismatch — verify with employee"
          : "TIN not found in GRA registry",
      }]);

      idx++;
      setTimeout(processNext, 150);
    };

    processNext();
  };

  const handleHRPull = () => {
    setLoading(true);
    setHrResult(null);
    setHrSyncProgress(0);

    const steps = 20;
    let step = 0;

    const tick = () => {
      if (step >= steps) {
        setLoading(false);
        const added = Math.floor(Math.random() * 3);
        const updated = Math.floor(Math.random() * 8) + 2;
        setHrResult({
          synced: activeEmployees.length,
          added,
          updated,
          errors: 0,
          duration: `${(1.2 + Math.random()).toFixed(1)}s`,
          records: [
            ...Array.from({ length: added }, (_, i) => ({
              id: `EMP${249 + i}`, name: `New Employee ${i + 1}`, action: "CREATED", status: "success",
            })),
            ...activeEmployees.slice(0, updated).map((e) => ({
              id: e.id, name: `${e.firstName} ${e.lastName}`, action: "UPDATED", status: "success",
            })),
          ],
        });
        showToast(`HR sync complete — ${added} new, ${updated} updated`, "success");
        return;
      }
      step++;
      setHrSyncProgress(Math.round((step / steps) * 100));
      setTimeout(tick, 100);
    };

    tick();
  };

  const handleHRPush = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast(`Pushed ${activeEmployees.length} payroll records back to HR system`, "success");
    }, 2000);
  };

  const actions = [
    {
      id: "ssnit-submit" as const, icon: Shield, color: "text-[#0B2545]", bg: "bg-[#0B2545]/10",
      title: "Submit SSNIT Filing", desc: "Submit Tier 1 social security contributions to SSNIT portal",
      system: "🏛️ SSNIT Portal",
    },
    {
      id: "ssnit-validate" as const, icon: Search, color: "text-purple-600", bg: "bg-purple-50",
      title: "Validate TINs with GRA", desc: "Batch validate employee Tax Identification Numbers against GRA registry",
      system: "🏛️ Ghana Revenue Authority",
    },
    {
      id: "gra-paye" as const, icon: FileText, color: "text-[#D4A843]", bg: "bg-[#D4A843]/10",
      title: "File PAYE Returns", desc: "Submit monthly PAYE income tax returns to Ghana Revenue Authority",
      system: "🏛️ Ghana Revenue Authority",
    },
    {
      id: "hr-pull" as const, icon: Download, color: "text-blue-600", bg: "bg-blue-50",
      title: "Pull Employee Data from HR", desc: "Sync latest employee records, departments, and contracts from HR system",
      system: "👥 HR Management System",
    },
    {
      id: "hr-push" as const, icon: Send, color: "text-green-600", bg: "bg-green-50",
      title: "Push Payroll Data to HR", desc: "Send latest payroll records and salary updates back to the HR system",
      system: "👥 HR Management System",
    },
  ];

  return (
    <PageTransition><div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/integrations" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">File & Submit</h1>
          <p className="text-sm text-gray-500 mt-0.5">Submit statutory filings, sync employee data, and validate records</p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {actions.map((action, i) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -2, boxShadow: "0 8px 25px -5px rgba(0,0,0,0.1)" }}
            onClick={() => { setActiveAction(action.id); setSsnitResult(null); setGraResult(null); setTinResults([]); setHrResult(null); }}
            className={`text-left bg-white rounded-xl border p-5 transition-all ${activeAction === action.id ? "border-[#0B2545] shadow-md" : "border-gray-200 shadow-sm"}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl ${action.bg}`}>
                <action.icon size={20} className={action.color} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{action.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
                <p className="text-xs text-gray-400 mt-2">{action.system}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Action Panel */}
      <AnimatePresence mode="wait">
        {activeAction && (
          <motion.div
            key={activeAction}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* SSNIT Submit */}
            {activeAction === "ssnit-submit" && (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">🏛️</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Submit SSNIT Tier 1 Contribution</h3>
                    <p className="text-sm text-gray-500">Connect to SSNIT portal and submit monthly contributions</p>
                  </div>
                </div>

                {!ssnitResult ? (
                  <div>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Period</label>
                        <input type="month" value={ssnitPeriod} onChange={(e) => setSsnitPeriod(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Endpoint</label>
                        <input readOnly value="https://portal.ssnit.org.gh/api/contributions" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono" />
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-500">Employees</span><span className="font-medium">{activeEmployees.length}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Employee Contribution (5.5%)</span><span className="font-medium">{formatGHS(activeEmployees.reduce((s, e) => s + e.ssnitEmployee, 0))}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Employer Contribution (13%)</span><span className="font-medium">{formatGHS(activeEmployees.reduce((s, e) => s + e.ssnitEmployer, 0))}</span></div>
                      <div className="flex justify-between border-t border-gray-200 pt-2"><span className="font-semibold">Total Contribution</span><span className="font-bold text-[#0B2545]">{formatGHS(totalSSNIT)}</span></div>
                    </div>

                    <button onClick={handleSSNITSubmit} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0B2545] to-[#1a4a7a] text-white py-3 rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50">
                      {loading ? <><Loader2 size={16} className="animate-spin" /> Connecting to SSNIT Portal...</> : <><Send size={16} /> Submit to SSNIT</>}
                    </button>

                    {loading && (
                      <div className="mt-4 space-y-2">
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xs text-gray-500 flex items-center gap-2"><CheckCircle size={12} className="text-green-500" /> Establishing secure connection...</motion.p>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-xs text-gray-500 flex items-center gap-2"><CheckCircle size={12} className="text-green-500" /> Authenticating with SSNIT portal...</motion.p>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }} className="text-xs text-gray-500 flex items-center gap-2"><Loader2 size={12} className="text-blue-500 animate-spin" /> Uploading {activeEmployees.length} contribution records...</motion.p>
                      </div>
                    )}
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="text-center mb-5">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle size={32} className="text-green-600" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-green-700">SSNIT Filing Accepted</h3>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2 text-sm font-mono mb-4">
                      <div className="flex justify-between"><span className="text-green-700">Reference No:</span><span className="font-bold">{ssnitResult.referenceNo}</span></div>
                      <div className="flex justify-between"><span className="text-green-700">Status:</span><span className="px-2 py-0.5 bg-green-200 text-green-800 rounded-full text-xs font-semibold">{ssnitResult.status}</span></div>
                      <div className="flex justify-between"><span className="text-green-700">Period:</span><span>{ssnitResult.period}</span></div>
                      <div className="flex justify-between"><span className="text-green-700">Employees:</span><span>{ssnitResult.employeeCount}</span></div>
                      <div className="flex justify-between"><span className="text-green-700">Total:</span><span className="font-bold">{formatGHS(ssnitResult.totalContribution)}</span></div>
                      <div className="flex justify-between"><span className="text-green-700">Submitted:</span><span>{new Date(ssnitResult.submittedAt).toLocaleString()}</span></div>
                    </div>
                    <p className="text-xs text-gray-500 text-center mb-4">This reference number has been saved to your compliance records.</p>
                    <button onClick={() => setSsnitResult(null)} className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">Submit Another Period</button>
                  </motion.div>
                )}
              </div>
            )}

            {/* GRA PAYE Filing */}
            {activeAction === "gra-paye" && (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">🏛️</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">File PAYE Returns with GRA</h3>
                    <p className="text-sm text-gray-500">Submit monthly income tax returns to Ghana Revenue Authority</p>
                  </div>
                </div>

                {!graResult ? (
                  <div>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Tax Period</label>
                        <input type="month" value={graPeriod} onChange={(e) => setGraPeriod(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">GRA Portal</label>
                        <input readOnly value="https://taxpayerportal.gra.gov.gh/api/paye" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono" />
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-500">Total Employees</span><span className="font-medium">{activeEmployees.length}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Total Taxable Income</span><span className="font-medium">{formatGHS(activeEmployees.reduce((s, e) => s + (e.grossSalary - e.ssnitEmployee), 0))}</span></div>
                      <div className="flex justify-between border-t border-gray-200 pt-2"><span className="font-semibold">Total PAYE Tax</span><span className="font-bold text-[#D4A843]">{formatGHS(totalPAYE)}</span></div>
                    </div>

                    <button onClick={handleGRASubmit} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4A843] to-[#c49632] text-white py-3 rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50">
                      {loading ? <><Loader2 size={16} className="animate-spin" /> Connecting to GRA Portal...</> : <><FileText size={16} /> File PAYE Returns</>}
                    </button>

                    {loading && (
                      <div className="mt-4 space-y-2">
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xs text-gray-500 flex items-center gap-2"><CheckCircle size={12} className="text-green-500" /> Connecting to GRA taxpayer portal...</motion.p>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-xs text-gray-500 flex items-center gap-2"><CheckCircle size={12} className="text-green-500" /> Validating employer TIN...</motion.p>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="text-xs text-gray-500 flex items-center gap-2"><Loader2 size={12} className="text-blue-500 animate-spin" /> Submitting PAYE returns for {activeEmployees.length} employees...</motion.p>
                      </div>
                    )}
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="text-center mb-5">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle size={32} className="text-green-600" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-green-700">PAYE Filing Accepted by GRA</h3>
                    </div>
                    <div className="bg-[#D4A843]/5 border border-[#D4A843]/30 rounded-xl p-4 space-y-2 text-sm font-mono mb-4">
                      <div className="flex justify-between"><span className="text-[#8B7530]">Filing ID:</span><span className="font-bold">{graResult.filingId}</span></div>
                      <div className="flex justify-between"><span className="text-[#8B7530]">Acknowledgement:</span><span className="font-bold">{graResult.acknowledgementNo}</span></div>
                      <div className="flex justify-between"><span className="text-[#8B7530]">Period:</span><span>{graResult.period}</span></div>
                      <div className="flex justify-between"><span className="text-[#8B7530]">Employees:</span><span>{graResult.employeeCount}</span></div>
                      <div className="flex justify-between"><span className="text-[#8B7530]">Total PAYE:</span><span className="font-bold">{formatGHS(graResult.totalTax)}</span></div>
                      <div className="flex justify-between"><span className="text-[#8B7530]">Filed:</span><span>{new Date(graResult.submittedAt).toLocaleString()}</span></div>
                    </div>
                    <button onClick={() => setGraResult(null)} className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">File Another Period</button>
                  </motion.div>
                )}
              </div>
            )}

            {/* TIN Validation */}
            {activeAction === "ssnit-validate" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏛️</span>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Batch TIN Validation</h3>
                      <p className="text-sm text-gray-500">Validate employee TINs against GRA registry</p>
                    </div>
                  </div>
                  <button onClick={handleTINValidation} disabled={loading} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50">
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Validating...</> : <><Search size={16} /> Validate All TINs</>}
                  </button>
                </div>

                {tinResults.length > 0 && (
                  <div>
                    <div className="flex gap-3 mb-4">
                      <div className="flex-1 p-3 bg-green-50 rounded-xl text-center">
                        <p className="text-xl font-bold text-green-600">{tinResults.filter((t) => t.status === "valid").length}</p>
                        <p className="text-xs text-green-700">Valid</p>
                      </div>
                      <div className="flex-1 p-3 bg-yellow-50 rounded-xl text-center">
                        <p className="text-xl font-bold text-yellow-600">{tinResults.filter((t) => t.status === "mismatch").length}</p>
                        <p className="text-xs text-yellow-700">Mismatch</p>
                      </div>
                      <div className="flex-1 p-3 bg-red-50 rounded-xl text-center">
                        <p className="text-xl font-bold text-red-600">{tinResults.filter((t) => t.status === "invalid").length}</p>
                        <p className="text-xs text-red-700">Invalid</p>
                      </div>
                    </div>
                    <div className="max-h-[350px] overflow-auto rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-gray-50">
                          <tr className="border-b border-gray-200">
                            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">TIN</th>
                            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Message</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tinResults.map((result) => (
                            <motion.tr key={result.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="border-b border-gray-50">
                              <td className="px-4 py-2 text-sm font-medium">{result.name}</td>
                              <td className="px-4 py-2 text-xs font-mono text-gray-500">{result.tin}</td>
                              <td className="px-4 py-2">
                                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                                  result.status === "valid" ? "bg-green-50 text-green-700" :
                                  result.status === "mismatch" ? "bg-yellow-50 text-yellow-700" :
                                  "bg-red-50 text-red-700"
                                }`}>
                                  {result.status === "valid" ? <CheckCircle size={10} /> : result.status === "mismatch" ? <AlertTriangle size={10} /> : <X size={10} />}
                                  {result.status}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-xs text-gray-500">{result.message}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {tinResults.length === 0 && !loading && (
                  <div className="text-center py-10 text-gray-400">
                    <Search size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Click &quot;Validate All TINs&quot; to check employee records against GRA</p>
                  </div>
                )}
              </div>
            )}

            {/* HR Pull */}
            {activeAction === "hr-pull" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👥</span>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Pull Employee Data from HR</h3>
                      <p className="text-sm text-gray-500">Sync employee records, contracts, and department changes</p>
                    </div>
                  </div>
                  <button onClick={handleHRPull} disabled={loading} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50">
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Syncing...</> : <><Download size={16} /> Pull from HR</>}
                  </button>
                </div>

                {loading && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-800">Syncing employee records...</span>
                      <span className="text-sm font-medium">{hrSyncProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
                      <motion.div className="h-full bg-gradient-to-r from-blue-500 to-[#0B2545] rounded-full" style={{ width: `${hrSyncProgress}%` }} />
                    </div>
                  </div>
                )}

                {hrResult && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className="p-3 bg-blue-50 rounded-xl text-center"><p className="text-xl font-bold text-blue-600">{hrResult.synced}</p><p className="text-xs text-blue-700">Total Synced</p></div>
                      <div className="p-3 bg-green-50 rounded-xl text-center"><p className="text-xl font-bold text-green-600">{hrResult.added}</p><p className="text-xs text-green-700">New Added</p></div>
                      <div className="p-3 bg-yellow-50 rounded-xl text-center"><p className="text-xl font-bold text-yellow-600">{hrResult.updated}</p><p className="text-xs text-yellow-700">Updated</p></div>
                      <div className="p-3 bg-gray-50 rounded-xl text-center"><p className="text-xl font-bold text-gray-600">{hrResult.duration}</p><p className="text-xs text-gray-500">Duration</p></div>
                    </div>
                    <div className="max-h-[250px] overflow-auto rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-gray-50"><tr className="border-b border-gray-200"><th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">ID</th><th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Name</th><th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Action</th><th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Status</th></tr></thead>
                        <tbody>
                          {hrResult.records.map((r, i) => (
                            <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-gray-50">
                              <td className="px-4 py-2 text-xs font-mono">{r.id}</td>
                              <td className="px-4 py-2 text-sm">{r.name}</td>
                              <td className="px-4 py-2"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.action === "CREATED" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>{r.action}</span></td>
                              <td className="px-4 py-2"><CheckCircle size={14} className="text-green-500" /></td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {!hrResult && !loading && (
                  <div className="text-center py-10 text-gray-400">
                    <Users size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Click &quot;Pull from HR&quot; to sync latest employee data</p>
                  </div>
                )}
              </div>
            )}

            {/* HR Push */}
            {activeAction === "hr-push" && (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">👥</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Push Payroll Data to HR</h3>
                    <p className="text-sm text-gray-500">Send latest payroll records back to the HR system</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Records to push</span><span className="font-medium">{activeEmployees.length} employees</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Data includes</span><span className="font-medium">Salary, deductions, net pay</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Latest payroll</span><span className="font-medium">March 2026</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Destination</span><span className="font-mono text-xs">https://hr.icsghana.info/api/v2/payroll</span></div>
                </div>

                <button onClick={handleHRPush} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Pushing data...</> : <><Send size={16} /> Push to HR System</>}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!activeAction && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center">
          <Building2 size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Select an action above to connect to an external system</p>
        </div>
      )}
    </div></PageTransition>
  );
}
