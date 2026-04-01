"use client";

import { useState } from "react";
import { CalendarDays, CheckCircle, Clock, XCircle } from "lucide-react";
import PageTransition from "@/components/page-transition";
import { useToast } from "@/components/toast";
import { motion } from "framer-motion";

interface LeaveRequest {
  id: number;
  employee: string;
  type: string;
  days: number;
  from: string;
  to: string;
  status: "pending" | "approved" | "rejected";
}

const initialLeaveRequests: LeaveRequest[] = [
  { id: 1, employee: "Yaw Frimpong", type: "Annual Leave", days: 5, from: "2026-04-07", to: "2026-04-11", status: "pending" },
  { id: 2, employee: "Ama Boateng", type: "Sick Leave", days: 2, from: "2026-04-03", to: "2026-04-04", status: "pending" },
  { id: 3, employee: "Kofi Mensah", type: "Annual Leave", days: 10, from: "2026-04-14", to: "2026-04-25", status: "pending" },
  { id: 4, employee: "Akua Darko", type: "Maternity Leave", days: 84, from: "2026-04-01", to: "2026-06-23", status: "approved" },
  { id: 5, employee: "Kwesi Asante", type: "Annual Leave", days: 3, from: "2026-03-24", to: "2026-03-26", status: "approved" },
  { id: 6, employee: "Efua Osei", type: "Sick Leave", days: 1, from: "2026-03-28", to: "2026-03-28", status: "approved" },
];

const leaveBalanceSummary = [
  { type: "Annual Leave", entitled: 21, avgUsed: 8.5, avgRemaining: 12.5 },
  { type: "Sick Leave", entitled: 10, avgUsed: 2.3, avgRemaining: 7.7 },
  { type: "Maternity Leave", entitled: 84, avgUsed: 0, avgRemaining: 84 },
  { type: "Study Leave", entitled: 5, avgUsed: 1.2, avgRemaining: 3.8 },
];

export default function LeavePage() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState(initialLeaveRequests);

  const handleApprove = (id: number) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "approved" as const } : r));
    const req = requests.find((r) => r.id === id)!;
    showToast(`Leave approved for ${req.employee} — ${req.days} day${req.days > 1 ? "s" : ""} ${req.type}`, "success");
  };

  const handleReject = (id: number) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "rejected" as const } : r));
    const req = requests.find((r) => r.id === id)!;
    showToast(`Leave request rejected for ${req.employee}`, "warning");
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;

  return (
    <PageTransition><div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leave & Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">Manage leave requests and track attendance</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm"><p className="text-3xl font-bold text-orange-600">{pendingCount}</p><p className="text-xs text-gray-500 mt-1">Pending Approvals</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm"><p className="text-3xl font-bold text-green-600">{approvedCount}</p><p className="text-xs text-gray-500 mt-1">Approved</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm"><p className="text-3xl font-bold text-blue-600">8</p><p className="text-xs text-gray-500 mt-1">On Leave Today</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm"><p className="text-3xl font-bold text-[#0B2545]">96%</p><p className="text-xs text-gray-500 mt-1">Attendance Rate</p></div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Leave Requests</h3>
          <div className="space-y-3">
            {requests.map((req) => (
              <motion.div key={req.id} layout className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{req.employee}</p>
                  <p className="text-xs text-gray-500">{req.type} — {req.days} day{req.days > 1 ? "s" : ""} ({req.from} to {req.to})</p>
                </div>
                {req.status === "pending" ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleApprove(req.id)} className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Approve">
                      <CheckCircle size={16} />
                    </button>
                    <button onClick={() => handleReject(req.id)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Reject">
                      <XCircle size={16} />
                    </button>
                  </div>
                ) : (
                  <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                    req.status === "approved" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}>
                    {req.status === "approved" ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {req.status === "approved" ? "Approved" : "Rejected"}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Leave Balance Summary (Avg. per Employee)</h3>
          <table className="w-full">
            <thead><tr className="border-b border-gray-200"><th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Type</th><th className="text-right px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Entitled</th><th className="text-right px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Used</th><th className="text-right px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Remaining</th></tr></thead>
            <tbody>
              {leaveBalanceSummary.map((l) => (
                <tr key={l.type} className="border-b border-gray-50">
                  <td className="px-3 py-2.5 text-sm font-medium">{l.type}</td>
                  <td className="px-3 py-2.5 text-sm text-right">{l.entitled}</td>
                  <td className="px-3 py-2.5 text-sm text-right text-red-600">{l.avgUsed}</td>
                  <td className="px-3 py-2.5 text-sm text-right font-medium text-green-600">{l.avgRemaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
        <CalendarDays size={24} className="text-blue-600 mx-auto mb-2" />
        <h3 className="font-semibold text-blue-900">Full Leave Management Module — Phase 2</h3>
        <p className="text-sm text-blue-700 mt-1">Leave calendar, automated approval workflows, and attendance tracking linked to payroll will be available in Phase 2.</p>
      </div>
    </div></PageTransition>
  );
}
