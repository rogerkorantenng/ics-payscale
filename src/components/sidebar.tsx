"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Banknote,
  Users,
  ShieldCheck,
  BarChart3,
  Link2,
  CalendarDays,
  Settings,
  FileSearch,
  ChevronDown,
  ChevronRight,
  Play,
  List,
  UserPlus,
  FileText,
  PieChart,
  Send,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    label: "Payroll",
    icon: Banknote,
    children: [
      { label: "Payroll Runs", href: "/payroll", icon: List },
      { label: "Run Payroll", href: "/payroll/run", icon: Play },
      { label: "Disbursements", href: "/payments", icon: Send },
    ],
  },
  {
    label: "Employees",
    icon: Users,
    children: [
      { label: "Directory", href: "/employees", icon: Users },
      { label: "Add Employee", href: "/employees/new", icon: UserPlus },
    ],
  },
  {
    label: "Compliance",
    icon: ShieldCheck,
    children: [
      { label: "Overview", href: "/compliance", icon: ShieldCheck },
      { label: "SSNIT Report", href: "/compliance/ssnit", icon: FileText },
      { label: "PAYE Report", href: "/compliance/paye", icon: FileText },
      { label: "Pension Reports", href: "/compliance/pension", icon: PieChart },
    ],
  },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  {
    label: "External Systems",
    icon: Link2,
    children: [
      { label: "Connected Systems", href: "/integrations", icon: Link2 },
      { label: "File & Submit", href: "/integrations/actions", icon: Send },
    ],
  },
  { label: "Leave & Attendance", href: "/leave", icon: CalendarDays },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Audit Trail", href: "/audit", icon: FileSearch },
];

export default function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Payroll: true,
    Employees: true,
    Compliance: true,
  });

  const toggle = (label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className={`w-64 bg-gradient-to-b from-[#0B2545] to-[#0a1f3a] text-white min-h-screen flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D4A843] to-[#c49632] rounded-xl flex items-center justify-center font-bold text-[#0B2545] text-lg shadow-lg shadow-[#D4A843]/20">
            P
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">ICS PayScale</h1>
            <p className="text-xs text-white/40">Payroll Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          if ("children" in item && item.children) {
            const isExpanded = expanded[item.label];
            const hasActiveChild = item.children.some((c) => isActive(c.href));
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggle(item.label)}
                  className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-all hover:bg-white/5 ${
                    hasActiveChild ? "text-[#D4A843]" : "text-white/70"
                  }`}
                >
                  <item.icon size={18} />
                  <span className="flex-1 text-left">{item.label}</span>
                  <motion.div animate={{ rotate: isExpanded ? 0 : -90 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={14} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-5 border-l border-white/10">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 pl-5 pr-5 py-2 text-sm transition-all ${
                              isActive(child.href)
                                ? "text-[#D4A843] bg-white/5"
                                : "text-white/50 hover:text-white/80 hover:bg-white/5"
                            }`}
                          >
                            <child.icon size={15} />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          const href = item.href!;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-all relative ${
                isActive(href)
                  ? "text-[#D4A843] bg-white/5"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive(href) && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#D4A843] rounded-l"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link href="/proposal" className="flex items-center gap-2 px-3 py-2 bg-[#D4A843]/20 text-[#D4A843] rounded-lg text-xs font-medium hover:bg-[#D4A843]/30 transition-colors mb-3">
          <FileText size={14} /> View Proposal Document
        </Link>
        <p className="text-xs text-white/30">© 2026 Brownshift Technologies</p>
        <p className="text-xs text-white/30 mt-0.5">Built for ICS Ghana</p>
      </div>
    </aside>
  );
}
