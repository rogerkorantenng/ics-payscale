"use client";

import { useState } from "react";
import { employees, departments, campuses, formatGHS } from "@/lib/mock-data";
import { useCampus } from "@/lib/campus-context";
import { Search, UserPlus, Eye, MoreVertical } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/page-transition";

export default function EmployeesPage() {
  const { selectedCampus } = useCampus();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  const filtered = employees.filter((e) => {
    const matchCampus = selectedCampus === "all" || e.campusId === selectedCampus;
    const matchDept = deptFilter === "all" || e.department === deptFilter;
    const matchSearch = search === "" || `${e.firstName} ${e.lastName} ${e.id}`.toLowerCase().includes(search.toLowerCase());
    return matchCampus && matchDept && matchSearch;
  });

  return (
    <PageTransition><div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} employees found</p>
        </div>
        <Link href="/employees/new" className="flex items-center gap-2 bg-[#0B2545] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0B2545]/90 transition-colors">
          <UserPlus size={16} /> Add Employee
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20" />
          </div>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20">
            <option value="all">All Departments</option>
            {departments.map((d) => (<option key={d} value={d}>{d}</option>))}
          </select>
        </div>

        <div className="overflow-auto max-h-[600px]">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Campus</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Position</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Net Pay</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map((emp) => (
                <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#0B2545] rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-gray-500">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs font-mono text-gray-500">{emp.id}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{campuses.find(c => c.id === emp.campusId)?.name.split(",")[0]}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{emp.department}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{emp.position}</td>
                  <td className="px-5 py-3 text-sm text-gray-800 text-right font-medium">{formatGHS(emp.netPay)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      emp.status === "active" ? "bg-green-50 text-green-700" :
                      emp.status === "on-leave" ? "bg-yellow-50 text-yellow-700" :
                      "bg-red-50 text-red-700"
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/employees/${emp.id}`} className="p-1.5 text-gray-400 hover:text-[#0B2545] hover:bg-gray-100 rounded-lg inline-flex transition-colors">
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div></PageTransition>
  );
}
