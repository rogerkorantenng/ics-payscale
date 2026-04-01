"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, Search, User, X, Menu } from "lucide-react";
import { campuses, employees } from "@/lib/mock-data";
import { useCampus } from "@/lib/campus-context";
import NotificationPanel from "./notification-panel";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Topbar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { selectedCampus, setSelectedCampus } = useCampus();
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const results = search.length >= 2
    ? employees.filter((e) =>
        `${e.firstName} ${e.lastName} ${e.id} ${e.department} ${e.position}`.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 8)
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-4 md:px-6 fixed top-0 left-0 lg:left-64 right-0 z-30">
        <div className="flex items-center gap-3" ref={searchRef}>
          <button onClick={onMenuToggle} className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <Menu size={20} />
          </button>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees, reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-44 md:w-72 focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20 focus:border-[#0B2545] transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
            <AnimatePresence>
              {searchFocused && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full left-0 mt-1 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                >
                  <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">{results.length} result{results.length !== 1 ? "s" : ""}</div>
                  {results.map((emp) => (
                    <Link
                      key={emp.id}
                      href={`/employees/${emp.id}`}
                      onClick={() => { setSearch(""); setSearchFocused(false); }}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-[#0B2545] rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{emp.id} — {emp.department} — {emp.position}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${emp.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>{emp.status}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
              {searchFocused && search.length >= 2 && results.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 text-center z-50"
                >
                  <p className="text-sm text-gray-500">No employees found for &quot;{search}&quot;</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="hidden md:block px-3 py-2 bg-[#0B2545]/5 border border-[#0B2545]/20 rounded-lg text-sm font-medium text-[#0B2545] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20 transition-all"
          >
            {campuses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          </button>

          <div className="flex items-center gap-2 pl-4 border-l border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0B2545] to-[#1a4a7a] rounded-full flex items-center justify-center shadow-sm">
              <User size={16} className="text-white" />
            </div>
            <div className="text-sm hidden md:block">
              <p className="font-medium text-gray-800">Kwame Mensah</p>
              <p className="text-xs text-gray-500">HR Director</p>
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden md:block" />
          </div>
        </div>
      </header>
      <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
