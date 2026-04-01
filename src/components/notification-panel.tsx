"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, CheckCircle, AlertTriangle, Clock, UserPlus } from "lucide-react";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const notifications = [
  { id: 1, icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-50", title: "SSNIT Filing Due", desc: "March 2026 SSNIT contribution due April 14", time: "2 hours ago", unread: true },
  { id: 2, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", title: "Payroll Processed", desc: "March 2026 payroll completed for all campuses", time: "5 hours ago", unread: true },
  { id: 3, icon: UserPlus, color: "text-blue-500", bg: "bg-blue-50", title: "New Employee Added", desc: "Ama Boateng onboarded to Ogbojo Campus", time: "1 day ago", unread: false },
  { id: 4, icon: Clock, color: "text-purple-500", bg: "bg-purple-50", title: "Leave Request", desc: "Yaw Frimpong requested 5 days annual leave", time: "1 day ago", unread: false },
  { id: 5, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", title: "PAYE Filed", desc: "February 2026 PAYE submitted to GRA", time: "2 days ago", unread: false },
  { id: 6, icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-50", title: "Tier 2 Pension Due", desc: "March 2026 Tier 2 contribution due April 14", time: "2 days ago", unread: false },
];

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-16 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-[#0B2545]" />
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <span className="text-xs px-2 py-0.5 bg-red-500 text-white rounded-full font-medium">2</span>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="max-h-[400px] overflow-auto">
              {notifications.map((n) => (
                <motion.div
                  key={n.id}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  className={`flex items-start gap-3 px-5 py-3.5 border-b border-gray-50 cursor-pointer ${n.unread ? "bg-blue-50/30" : ""}`}
                >
                  <div className={`p-2 rounded-lg ${n.bg} flex-shrink-0 mt-0.5`}>
                    <n.icon size={14} className={n.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-800">{n.title}</p>
                      {n.unread && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-gray-100 text-center">
              <button className="text-xs text-[#0B2545] font-medium hover:underline">Mark all as read</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
