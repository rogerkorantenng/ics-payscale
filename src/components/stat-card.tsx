"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  delay?: number;
}

export default function StatCard({ label, value, change, changeType = "neutral", icon: Icon, iconColor = "text-[#0B2545]", iconBg = "bg-[#0B2545]/10", delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -2, boxShadow: "0 8px 25px -5px rgba(0,0,0,0.1)" }}
      className="bg-white rounded-xl border border-gray-200 p-5 cursor-default transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
          {change && (
            <p className={`text-xs mt-1.5 font-medium flex items-center gap-1 ${
              changeType === "up" ? "text-green-600" : changeType === "down" ? "text-red-600" : "text-gray-500"
            }`}>
              {changeType === "up" && <span className="inline-block">↑</span>}
              {changeType === "down" && <span className="inline-block">↓</span>}
              {change}
            </p>
          )}
        </div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`p-3 rounded-xl ${iconBg}`}
        >
          <Icon size={22} className={iconColor} />
        </motion.div>
      </div>
    </motion.div>
  );
}
