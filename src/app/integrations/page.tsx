"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, Link2, RefreshCw, ArrowRight, Loader2, X, Zap, Activity, Database, Shield, Settings, Play, AlertTriangle } from "lucide-react";
import PageTransition from "@/components/page-transition";
import { useToast } from "@/components/toast";
import { motion, AnimatePresence } from "framer-motion";

interface Integration {
  id: string;
  name: string;
  status: "connected" | "pending" | "error";
  lastSync: string;
  records: string;
  icon: string;
  type: string;
  uptime: number;
  latency: number;
  endpoint: string;
  apiKey: string;
  syncSchedule: string;
  dataPoints: { label: string; source: string; target: string }[];
}

const initialIntegrations: Integration[] = [
  {
    id: "hr", name: "HR Management System", status: "connected", lastSync: "5 minutes ago", records: "248 employees synced",
    icon: "👥", type: "REST API", uptime: 99.8, latency: 124, endpoint: "https://hr.icsghana.info/api/v2",
    apiKey: "ics_hr_••••••••••••k4Qm", syncSchedule: "Every 30 minutes",
    dataPoints: [
      { label: "Employee Records", source: "HR.employees", target: "PayScale.employees" },
      { label: "Department Structure", source: "HR.departments", target: "PayScale.departments" },
      { label: "Leave Balances", source: "HR.leave_balances", target: "PayScale.leave" },
      { label: "Contract Details", source: "HR.contracts", target: "PayScale.contracts" },
    ],
  },
  {
    id: "accounting", name: "Accounting Software", status: "pending", lastSync: "Never", records: "Setup required",
    icon: "📊", type: "REST API", uptime: 0, latency: 0, endpoint: "", apiKey: "",
    syncSchedule: "Not configured",
    dataPoints: [
      { label: "Journal Entries", source: "PayScale.payroll_runs", target: "Accounting.journals" },
      { label: "Cost Centers", source: "PayScale.departments", target: "Accounting.cost_centers" },
      { label: "Bank Payments", source: "PayScale.disbursements", target: "Accounting.bank_txns" },
    ],
  },
  {
    id: "bank", name: "Bank Payment Gateway", status: "connected", lastSync: "2 hours ago", records: "March payroll disbursed",
    icon: "🏦", type: "SFTP + API", uptime: 99.95, latency: 89, endpoint: "https://payments.ghanabank.com/api/v1",
    apiKey: "ics_bank_••••••••••••r7Wx", syncSchedule: "On payroll approval",
    dataPoints: [
      { label: "Salary Disbursement", source: "PayScale.net_pay", target: "Bank.batch_transfer" },
      { label: "Bank Account Mapping", source: "PayScale.employee_bank", target: "Bank.beneficiaries" },
      { label: "Payment Confirmation", source: "Bank.transfer_status", target: "PayScale.pay_status" },
    ],
  },
  {
    id: "gra", name: "Ghana Revenue Authority", status: "connected", lastSync: "1 day ago", records: "PAYE filing submitted",
    icon: "🏛️", type: "XML/SOAP", uptime: 97.2, latency: 340, endpoint: "https://taxpayerportal.gra.gov.gh/api",
    apiKey: "ics_gra_••••••••••••n3Fp", syncSchedule: "Monthly (filing deadline)",
    dataPoints: [
      { label: "PAYE Returns", source: "PayScale.paye_summary", target: "GRA.monthly_returns" },
      { label: "TIN Validation", source: "GRA.tin_registry", target: "PayScale.employee_tin" },
      { label: "Tax Certificates", source: "GRA.certificates", target: "PayScale.tax_certs" },
    ],
  },
];

const syncLogs = [
  { time: "2026-03-31 14:28:00", system: "HR System", action: "Employee data sync", status: "success" as const, records: 248, duration: "1.2s" },
  { time: "2026-03-31 12:15:00", system: "Bank Gateway", action: "March payroll disbursement", status: "success" as const, records: 228, duration: "4.8s" },
  { time: "2026-03-30 16:45:00", system: "GRA Portal", action: "PAYE filing upload", status: "success" as const, records: 1, duration: "3.1s" },
  { time: "2026-03-30 14:00:00", system: "HR System", action: "Employee data sync", status: "success" as const, records: 248, duration: "1.1s" },
  { time: "2026-03-30 09:00:00", system: "HR System", action: "Employee data sync", status: "warning" as const, records: 245, duration: "2.4s" },
  { time: "2026-03-29 16:00:00", system: "GRA Portal", action: "TIN batch validation", status: "success" as const, records: 248, duration: "8.2s" },
  { time: "2026-03-29 14:00:00", system: "HR System", action: "Employee data sync", status: "success" as const, records: 245, duration: "1.3s" },
  { time: "2026-03-28 10:00:00", system: "Bank Gateway", action: "Beneficiary list update", status: "success" as const, records: 3, duration: "0.8s" },
];

const webhookEvents = [
  { id: 1, event: "employee.created", payload: '{"id":"EMP0249","name":"Ama Boateng"}', source: "HR System", time: "5 hours ago", status: "delivered" },
  { id: 2, event: "payroll.processed", payload: '{"run_id":"PR-2026-03","total":2263700}', source: "PayScale", time: "2 hours ago", status: "delivered" },
  { id: 3, event: "employee.updated", payload: '{"id":"EMP0156","field":"campus"}', source: "HR System", time: "1 day ago", status: "delivered" },
  { id: 4, event: "filing.submitted", payload: '{"type":"PAYE","period":"Feb 2026"}', source: "PayScale", time: "2 days ago", status: "delivered" },
  { id: 5, event: "payment.completed", payload: '{"batch":"PAY-2026-03","count":228}', source: "Bank Gateway", time: "2 hours ago", status: "delivered" },
];

export default function IntegrationsPage() {
  const { showToast } = useToast();
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [configuring, setConfiguring] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "logs" | "webhooks" | "api">("overview");
  const [setupStep, setSetupStep] = useState(0);
  const [setupEndpoint, setSetupEndpoint] = useState("");
  const [setupApiKey, setSetupApiKey] = useState("");
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<null | { status: number; time: number; body: string }>(null);
  const [apiTestLoading, setApiTestLoading] = useState(false);

  const handleSync = (id: string) => {
    setSyncing(id);
    setTimeout(() => {
      setSyncing(null);
      setIntegrations((prev) =>
        prev.map((i) => i.id === id ? { ...i, lastSync: "Just now", status: "connected" } : i)
      );
      const name = integrations.find((i) => i.id === id)?.name;
      showToast(`${name} synced successfully — data is up to date`, "success");
    }, 2000);
  };

  const handleSyncAll = () => {
    setSyncing("all");
    setTimeout(() => {
      setSyncing(null);
      setIntegrations((prev) => prev.map((i) => ({ ...i, lastSync: i.status === "connected" ? "Just now" : i.lastSync })));
      showToast("All connected systems synced successfully!", "success");
    }, 3000);
  };

  const handleSetupComplete = () => {
    setIntegrations((prev) =>
      prev.map((i) => i.id === "accounting" ? {
        ...i, status: "connected", lastSync: "Just now", records: "Connected — initial sync complete",
        endpoint: setupEndpoint || "https://accounting.icsghana.info/api/v1",
        apiKey: "ics_acc_••••••••••••x9Kp", uptime: 99.5, latency: 156,
      } : i)
    );
    setConfiguring(null);
    setSetupStep(0);
    showToast("Accounting Software connected successfully! Initial data sync complete.", "success");
  };

  const handleTestApi = () => {
    setApiTestLoading(true);
    setApiTestResult(null);
    setTimeout(() => {
      setApiTestLoading(false);
      setApiTestResult({
        status: 200,
        time: 124 + Math.floor(Math.random() * 50),
        body: JSON.stringify({
          status: "ok",
          version: "2.4.1",
          school: "International Community School",
          employees: 248,
          last_payroll: "2026-03-28",
          timestamp: new Date().toISOString(),
        }, null, 2),
      });
      showToast("API health check passed — all systems operational", "success");
    }, 1500);
  };

  const handleTestWebhook = () => {
    setTestingWebhook(true);
    setTimeout(() => {
      setTestingWebhook(false);
      showToast("Test webhook delivered successfully to all registered endpoints", "success");
    }, 2000);
  };

  const configIntegration = integrations.find((i) => i.id === configuring);

  return (
    <PageTransition><div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Connected Systems</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor HR, banking, and government portal connections</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleTestApi} disabled={apiTestLoading} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-50">
            {apiTestLoading ? <Loader2 size={16} className="animate-spin" /> : <Activity size={16} />} Health Check
          </button>
          <button onClick={handleSyncAll} disabled={syncing !== null} className="flex items-center gap-2 bg-gradient-to-r from-[#0B2545] to-[#1a4a7a] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50">
            {syncing === "all" ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} {syncing === "all" ? "Syncing..." : "Sync All"}
          </button>
        </div>
      </div>

      {/* API Test Result Banner */}
      <AnimatePresence>
        {apiTestResult && (
          <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }} className="mb-6 overflow-hidden">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" />
                  <span className="font-semibold text-green-800">API Health Check Passed</span>
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">HTTP {apiTestResult.status}</span>
                  <span className="text-xs text-green-600">{apiTestResult.time}ms</span>
                </div>
                <button onClick={() => setApiTestResult(null)} className="p-1 hover:bg-green-100 rounded-lg"><X size={14} className="text-green-600" /></button>
              </div>
              <pre className="text-xs bg-green-100/50 rounded-lg p-3 font-mono text-green-800 overflow-auto max-h-32">{apiTestResult.body}</pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {(["overview", "logs", "webhooks", "api"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? "bg-white text-[#0B2545] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {tab === "overview" ? "System Status" : tab === "logs" ? "Sync History" : tab === "webhooks" ? "Event Stream" : "API Explorer"}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {integrations.map((i, idx) => (
            <motion.div key={i.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{i.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{i.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{i.type} — {i.records}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                  i.status === "connected" ? "bg-green-50 text-green-700" :
                  i.status === "error" ? "bg-red-50 text-red-700" :
                  "bg-yellow-50 text-yellow-700"
                }`}>
                  {i.status === "connected" ? <CheckCircle size={12} /> : i.status === "error" ? <AlertTriangle size={12} /> : <Clock size={12} />}
                  {i.status === "connected" ? "Connected" : i.status === "error" ? "Error" : "Pending Setup"}
                </span>
              </div>

              {i.status === "connected" && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg text-center">
                    <p className="text-lg font-bold text-green-600">{i.uptime}%</p>
                    <p className="text-[10px] text-gray-500 uppercase">Uptime</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg text-center">
                    <p className="text-lg font-bold text-blue-600">{i.latency}ms</p>
                    <p className="text-[10px] text-gray-500 uppercase">Latency</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg text-center">
                    <p className="text-lg font-bold text-[#0B2545]">{i.dataPoints.length}</p>
                    <p className="text-[10px] text-gray-500 uppercase">Data Points</p>
                  </div>
                </div>
              )}

              {/* Data Mapping Preview */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Data Mapping</p>
                <div className="space-y-1.5">
                  {i.dataPoints.slice(0, 3).map((dp, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-mono truncate max-w-[120px]">{dp.source}</span>
                      <ArrowRight size={10} className="text-gray-400 flex-shrink-0" />
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded font-mono truncate max-w-[120px]">{dp.target}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">Last sync: {i.lastSync}</span>
                <div className="flex items-center gap-2">
                  {i.status === "connected" && (
                    <button onClick={() => handleSync(i.id)} disabled={syncing !== null} className="text-xs text-[#0B2545] font-medium flex items-center gap-1 hover:underline disabled:opacity-50">
                      {syncing === i.id ? <><Loader2 size={12} className="animate-spin" /> Syncing...</> : <>Sync <RefreshCw size={11} /></>}
                    </button>
                  )}
                  <button onClick={() => { setConfiguring(i.id); setSetupStep(i.status === "pending" ? 0 : 3); }} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-1">
                    <Settings size={11} /> {i.status === "pending" ? "Setup" : "Configure"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Sync Logs Tab */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Sync History</h3>
            <span className="text-xs text-gray-500">{syncLogs.length} events</span>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">System</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Records</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Duration</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {syncLogs.map((log, i) => (
                <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3 text-xs font-mono text-gray-500">{log.time}</td>
                  <td className="px-5 py-3 text-sm text-gray-800">{log.system}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{log.action}</td>
                  <td className="px-5 py-3 text-sm text-right text-gray-600">{log.records}</td>
                  <td className="px-5 py-3 text-sm text-right font-mono text-gray-500">{log.duration}</td>
                  <td className="px-5 py-3">
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium w-fit ${
                      log.status === "success" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${log.status === "success" ? "bg-green-500" : "bg-yellow-500"}`} />
                      {log.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Webhooks Tab */}
      {activeTab === "webhooks" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-[#D4A843]" />
              <div>
                <h3 className="font-semibold text-gray-900">Webhook Events</h3>
                <p className="text-xs text-gray-500">Real-time event notifications between systems</p>
              </div>
            </div>
            <button onClick={handleTestWebhook} disabled={testingWebhook} className="flex items-center gap-2 bg-[#D4A843] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#c49632] transition-all active:scale-[0.98] disabled:opacity-50">
              {testingWebhook ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />} {testingWebhook ? "Sending..." : "Send Test Event"}
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {webhookEvents.map((event, i) => (
              <motion.div key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-4 p-4 border-b border-gray-50 hover:bg-gray-50/50">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono font-semibold text-[#0B2545]">{event.event}</span>
                    <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">{event.status}</span>
                  </div>
                  <pre className="text-xs bg-gray-50 rounded-lg p-2 font-mono text-gray-600 overflow-auto">{event.payload}</pre>
                  <p className="text-xs text-gray-400 mt-1">{event.source} — {event.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* API Explorer Tab */}
      {activeTab === "api" && (
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Database size={20} className="text-[#0B2545]" />
              <h3 className="font-semibold text-gray-900">API Explorer</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Base URL</label>
                <div className="flex items-center gap-2">
                  <input readOnly value="https://api.payscale.icsghana.info/v1" className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none" />
                  <button onClick={() => { navigator.clipboard.writeText("https://api.payscale.icsghana.info/v1"); showToast("API URL copied to clipboard", "info"); }} className="px-3 py-2 bg-gray-100 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">Copy</button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">API Key</label>
                <div className="flex items-center gap-2">
                  <input readOnly value="ics_live_••••••••••••••••••Qm4x" className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none" />
                  <button onClick={() => showToast("API key copied — keep it secure!", "warning")} className="px-3 py-2 bg-gray-100 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">Copy</button>
                </div>
              </div>
            </div>

            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Available Endpoints</p>
            <div className="space-y-2">
              {[
                { method: "GET", path: "/employees", desc: "List all employees with pagination" },
                { method: "GET", path: "/employees/:id", desc: "Get employee details and salary structure" },
                { method: "GET", path: "/payroll/runs", desc: "List payroll runs with status" },
                { method: "POST", path: "/payroll/process", desc: "Trigger a new payroll run" },
                { method: "GET", path: "/compliance/ssnit", desc: "SSNIT contribution report" },
                { method: "GET", path: "/compliance/paye", desc: "PAYE tax report" },
                { method: "GET", path: "/analytics/campus", desc: "Campus comparison data" },
                { method: "POST", path: "/webhooks/register", desc: "Register a webhook endpoint" },
              ].map((ep, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => showToast(`${ep.method} ${ep.path} — Try it in your terminal: curl -H "Authorization: Bearer <key>" https://api.payscale.icsghana.info/v1${ep.path}`, "info")}>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ep.method === "GET" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{ep.method}</span>
                  <span className="text-sm font-mono text-gray-800">{ep.path}</span>
                  <span className="text-xs text-gray-500 flex-1">{ep.desc}</span>
                  <ArrowRight size={12} className="text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0B2545] rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-[#D4A843]" />
              <h4 className="font-semibold text-sm">API Security</h4>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><p className="text-white/50 text-xs">Authentication</p><p className="font-medium">Bearer Token (API Key)</p></div>
              <div><p className="text-white/50 text-xs">Encryption</p><p className="font-medium">TLS 1.3 / AES-256</p></div>
              <div><p className="text-white/50 text-xs">Rate Limit</p><p className="font-medium">1,000 req/min</p></div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      <AnimatePresence>
        {configIntegration && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-40" onClick={() => { setConfiguring(null); setSetupStep(0); }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 w-[550px] max-h-[80vh] overflow-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{configIntegration.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{configIntegration.status === "pending" ? "Setup" : "Configure"}: {configIntegration.name}</h3>
                    <p className="text-sm text-gray-500">{configIntegration.type}</p>
                  </div>
                </div>
                <button onClick={() => { setConfiguring(null); setSetupStep(0); }} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
              </div>

              <div className="p-5">
                {configIntegration.status === "pending" && setupStep < 3 ? (
                  <>
                    {/* Setup Wizard */}
                    <div className="flex items-center gap-2 mb-6">
                      {["Connection", "Authentication", "Test & Verify"].map((s, i) => (
                        <div key={s} className="flex items-center gap-2 flex-1">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i < setupStep ? "bg-green-500 text-white" : i === setupStep ? "bg-[#0B2545] text-white" : "bg-gray-100 text-gray-400"}`}>
                            {i < setupStep ? <CheckCircle size={14} /> : i + 1}
                          </div>
                          <span className={`text-xs font-medium ${i === setupStep ? "text-[#0B2545]" : "text-gray-400"}`}>{s}</span>
                          {i < 2 && <div className={`flex-1 h-0.5 ${i < setupStep ? "bg-green-500" : "bg-gray-200"}`} />}
                        </div>
                      ))}
                    </div>

                    {setupStep === 0 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">API Endpoint URL</label>
                          <input value={setupEndpoint} onChange={(e) => setSetupEndpoint(e.target.value)} placeholder="https://accounting.example.com/api/v1" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Sync Direction</label>
                          <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20">
                            <option>PayScale → Accounting (push payroll data)</option>
                            <option>Bidirectional sync</option>
                          </select>
                        </div>
                        <button onClick={() => setSetupStep(1)} className="w-full py-2.5 bg-[#0B2545] text-white rounded-xl text-sm font-medium hover:bg-[#0B2545]/90 transition-all">Next: Authentication</button>
                      </div>
                    )}

                    {setupStep === 1 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                          <input type="password" value={setupApiKey} onChange={(e) => setSetupApiKey(e.target.value)} placeholder="Enter your API key" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Authentication Method</label>
                          <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20">
                            <option>Bearer Token</option>
                            <option>Basic Auth</option>
                            <option>OAuth 2.0</option>
                          </select>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => setSetupStep(0)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">Back</button>
                          <button onClick={() => setSetupStep(2)} className="flex-1 py-2.5 bg-[#0B2545] text-white rounded-xl text-sm font-medium hover:bg-[#0B2545]/90 transition-all">Next: Test Connection</button>
                        </div>
                      </div>
                    )}

                    {setupStep === 2 && (
                      <div className="text-center py-4">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle size={32} className="text-green-600" />
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Connection Successful!</h3>
                        <p className="text-sm text-gray-500 mb-4">API endpoint is reachable and authentication is valid.</p>
                        <div className="bg-gray-50 rounded-xl p-3 text-left space-y-2 text-sm mb-4">
                          <div className="flex justify-between"><span className="text-gray-500">Endpoint</span><span className="font-mono text-xs">{setupEndpoint || "https://accounting.icsghana.info/api/v1"}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Latency</span><span className="font-medium">156ms</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Data points</span><span className="font-medium">3 mappings configured</span></div>
                        </div>
                        <button onClick={handleSetupComplete} className="w-full py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-all">Complete Setup & Sync</button>
                      </div>
                    )}
                  </>
                ) : (
                  /* Configuration view for connected integrations */
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Connection Details</label>
                      <div className="space-y-2">
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg text-sm"><span className="text-gray-500">Endpoint</span><span className="font-mono text-xs">{configIntegration.endpoint}</span></div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg text-sm"><span className="text-gray-500">API Key</span><span className="font-mono text-xs">{configIntegration.apiKey}</span></div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg text-sm"><span className="text-gray-500">Sync Schedule</span><span>{configIntegration.syncSchedule}</span></div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg text-sm"><span className="text-gray-500">Status</span><span className="flex items-center gap-1 text-green-600 font-medium"><CheckCircle size={14} /> Connected</span></div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Data Mapping ({configIntegration.dataPoints.length} points)</label>
                      <div className="space-y-2">
                        {configIntegration.dataPoints.map((dp, i) => (
                          <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <span className="text-xs font-medium text-gray-700 w-32">{dp.label}</span>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-mono">{dp.source}</span>
                            <ArrowRight size={12} className="text-gray-400" />
                            <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-mono">{dp.target}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => { handleSync(configIntegration.id); setConfiguring(null); }} className="flex-1 py-2.5 bg-[#0B2545] text-white rounded-xl text-sm font-medium hover:bg-[#0B2545]/90 transition-all">Sync Now</button>
                      <button onClick={() => { setConfiguring(null); showToast("Configuration saved", "success"); }} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">Save & Close</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div></PageTransition>
  );
}
