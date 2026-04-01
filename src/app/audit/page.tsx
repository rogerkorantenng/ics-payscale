"use client";

import { auditLog } from "@/lib/mock-data";
import { FileSearch, Shield, Lock, CheckCircle, Download } from "lucide-react";
import PageTransition from "@/components/page-transition";
import { useToast } from "@/components/toast";
import { downloadCSV } from "@/lib/export-utils";

export default function AuditPage() {
  const { showToast } = useToast();

  const handleExport = () => {
    downloadCSV(
      "audit-log.csv",
      ["Timestamp", "User", "Action", "Detail", "IP Address"],
      auditLog.map((l) => [l.timestamp, l.user, l.action, l.detail, l.ip])
    );
    showToast("Audit log exported as CSV", "success");
  };

  return (
    <PageTransition><div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Trail & Security</h1>
          <p className="text-sm text-gray-500 mt-1">Activity logs, access history, and security overview</p>
        </div>
      <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all active:scale-[0.98]">
        <Download size={16} /> Export Audit Log
      </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg"><Shield size={24} className="text-green-600" /></div>
          <div><p className="text-sm font-semibold text-gray-900">Data Encryption</p><p className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle size={12} /> AES-256 Active</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg"><Lock size={24} className="text-blue-600" /></div>
          <div><p className="text-sm font-semibold text-gray-900">RBAC Status</p><p className="text-xs text-blue-600 font-medium flex items-center gap-1"><CheckCircle size={12} /> 5 Roles Configured</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-lg"><FileSearch size={24} className="text-purple-600" /></div>
          <div><p className="text-sm font-semibold text-gray-900">Audit Retention</p><p className="text-xs text-purple-600 font-medium">90 days — Ghana DPA Compliant</p></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Activity Log</h3>
          <span className="text-xs text-gray-500">{auditLog.length} recent entries</span>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Detail</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {auditLog.map((log) => (
              <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 text-xs font-mono text-gray-500">{log.timestamp}</td>
                <td className="px-5 py-3 text-sm font-medium text-gray-800">{log.user}</td>
                <td className="px-5 py-3">
                  <span className="text-xs px-2 py-0.5 bg-[#0B2545]/5 text-[#0B2545] rounded font-medium">{log.action}</span>
                </td>
                <td className="px-5 py-3 text-sm text-gray-600">{log.detail}</td>
                <td className="px-5 py-3 text-xs font-mono text-gray-400">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div></PageTransition>
  );
}
