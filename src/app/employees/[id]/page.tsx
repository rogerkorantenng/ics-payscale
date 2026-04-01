"use client";

import { use } from "react";
import { useState } from "react";
import { employees, campuses, formatGHS, payrollRuns } from "@/lib/mock-data";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, Building2 } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/page-transition";

const tabs = ["Personal Info", "Contract & Employment", "Salary Structure", "Leave", "Payroll History"];

export default function EmployeeProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState(0);
  const emp = employees.find((e) => e.id === id);

  if (!emp) {
    return <PageTransition><div className="text-center py-20 text-gray-500">Employee not found</div></PageTransition>;
  }

  const campus = campuses.find((c) => c.id === emp.campusId);

  return (
    <PageTransition><div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/employees" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{emp.firstName} {emp.lastName}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{emp.id} — {emp.position}</p>
        </div>
        <span className={`ml-4 text-xs px-2.5 py-1 rounded-full font-medium ${
          emp.status === "active" ? "bg-green-50 text-green-700" : emp.status === "on-leave" ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"
        }`}>{emp.status}</span>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-lg"><Mail size={18} className="text-blue-600" /></div>
          <div><p className="text-xs text-gray-500">Email</p><p className="text-sm font-medium text-gray-800 truncate">{emp.email}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="p-2.5 bg-green-50 rounded-lg"><Phone size={18} className="text-green-600" /></div>
          <div><p className="text-xs text-gray-500">Phone</p><p className="text-sm font-medium text-gray-800">{emp.phone}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 rounded-lg"><Building2 size={18} className="text-purple-600" /></div>
          <div><p className="text-xs text-gray-500">Campus</p><p className="text-sm font-medium text-gray-800">{campus?.name.split(",")[0]}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="p-2.5 bg-[#D4A843]/10 rounded-lg"><Briefcase size={18} className="text-[#D4A843]" /></div>
          <div><p className="text-xs text-gray-500">Department</p><p className="text-sm font-medium text-gray-800">{emp.department}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 flex">
          {tabs.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)} className={`px-5 py-3 text-sm font-medium transition-colors ${activeTab === i ? "text-[#0B2545] border-b-2 border-[#0B2545]" : "text-gray-500 hover:text-gray-700"}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 0 && (
            <div className="grid grid-cols-2 gap-6 max-w-2xl">
              <div><p className="text-xs text-gray-500 mb-1">Full Name</p><p className="text-sm font-medium">{emp.firstName} {emp.lastName}</p></div>
              <div><p className="text-xs text-gray-500 mb-1">Employee ID</p><p className="text-sm font-medium">{emp.id}</p></div>
              <div><p className="text-xs text-gray-500 mb-1">Email Address</p><p className="text-sm font-medium">{emp.email}</p></div>
              <div><p className="text-xs text-gray-500 mb-1">Phone Number</p><p className="text-sm font-medium">{emp.phone}</p></div>
              <div><p className="text-xs text-gray-500 mb-1">Date of Birth</p><p className="text-sm font-medium">15 March 1988</p></div>
              <div><p className="text-xs text-gray-500 mb-1">National ID</p><p className="text-sm font-medium">GHA-XXXX-XXXX-XXX</p></div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="grid grid-cols-2 gap-6 max-w-2xl">
              <div><p className="text-xs text-gray-500 mb-1">Position</p><p className="text-sm font-medium">{emp.position}</p></div>
              <div><p className="text-xs text-gray-500 mb-1">Department</p><p className="text-sm font-medium">{emp.department}</p></div>
              <div><p className="text-xs text-gray-500 mb-1">Role Type</p><p className="text-sm font-medium">{emp.roleType}</p></div>
              <div><p className="text-xs text-gray-500 mb-1">Campus</p><p className="text-sm font-medium">{campus?.name}</p></div>
              <div><p className="text-xs text-gray-500 mb-1">Start Date</p><p className="text-sm font-medium">{emp.startDate}</p></div>
              <div><p className="text-xs text-gray-500 mb-1">Contract Type</p><p className="text-sm font-medium">Full-Time</p></div>
              <div><p className="text-xs text-gray-500 mb-1">SSNIT Number</p><p className="text-sm font-medium">SSNIT-{emp.id.replace("EMP", "")}</p></div>
              <div><p className="text-xs text-gray-500 mb-1">TIN</p><p className="text-sm font-medium">TIN-{emp.id.replace("EMP", "")}GH</p></div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="max-w-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Monthly Salary Structure</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-600">Basic Salary</span><span className="text-sm font-medium">{formatGHS(emp.basicSalary)}</span></div>
                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-600">Housing Allowance</span><span className="text-sm font-medium">{formatGHS(emp.housingAllowance)}</span></div>
                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-600">Transport Allowance</span><span className="text-sm font-medium">{formatGHS(emp.transportAllowance)}</span></div>
                {emp.overtimePay > 0 && <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-600">Overtime ({emp.overtimeHours}hrs @ {emp.overtimeRate}x)</span><span className="text-sm font-medium text-blue-600">{formatGHS(emp.overtimePay)}</span></div>}
                <div className="flex justify-between py-2 border-b border-gray-200 font-semibold"><span className="text-sm">Gross Salary</span><span className="text-sm">{formatGHS(emp.grossSalary)}</span></div>

                <h3 className="text-sm font-semibold text-gray-700 mt-4 mb-2">Deductions</h3>
                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-600">SSNIT (5.5%)</span><span className="text-sm font-medium text-red-600">-{formatGHS(emp.ssnitEmployee)}</span></div>
                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-600">PAYE Tax</span><span className="text-sm font-medium text-red-600">-{formatGHS(emp.paye)}</span></div>
                {emp.tier3 > 0 && <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-600">Tier 3 Provident Fund</span><span className="text-sm font-medium text-red-600">-{formatGHS(emp.tier3)}</span></div>}
                <div className="flex justify-between py-2 border-b border-gray-200 font-semibold"><span className="text-sm">Total Deductions</span><span className="text-sm text-red-600">-{formatGHS(emp.totalDeductions)}</span></div>

                <div className="flex justify-between py-3 bg-green-50 px-3 rounded-lg mt-2">
                  <span className="text-sm font-semibold text-green-800">Net Pay</span>
                  <span className="text-lg font-bold text-green-700">{formatGHS(emp.netPay)}</span>
                </div>

                <h3 className="text-sm font-semibold text-gray-700 mt-4 mb-2">Employer Contributions</h3>
                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-600">SSNIT Employer (13%)</span><span className="text-sm font-medium">{formatGHS(emp.ssnitEmployer)}</span></div>
                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-600">Tier 2 Pension (5%)</span><span className="text-sm font-medium">{formatGHS(emp.tier2)}</span></div>

                <h3 className="text-sm font-semibold text-gray-700 mt-4 mb-2">Severance / End of Service</h3>
                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-600">Years of Service</span><span className="text-sm font-medium">{emp.yearsOfService} years</span></div>
                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-600">Severance Entitlement (1 month basic × years)</span><span className="text-sm font-medium">{formatGHS(emp.severancePay)}</span></div>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-700">Leave Balance</h3>
                <span className="text-2xl font-bold text-[#0B2545]">{emp.leaveBalance} days</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg flex justify-between"><span className="text-sm text-gray-600">Annual Leave Entitlement</span><span className="text-sm font-medium">21 days</span></div>
                <div className="p-3 bg-gray-50 rounded-lg flex justify-between"><span className="text-sm text-gray-600">Used This Year</span><span className="text-sm font-medium">{21 - emp.leaveBalance} days</span></div>
                <div className="p-3 bg-gray-50 rounded-lg flex justify-between"><span className="text-sm text-gray-600">Sick Leave Balance</span><span className="text-sm font-medium">5 days</span></div>
              </div>
            </div>
          )}

          {activeTab === 4 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Payroll History</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Period</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Gross</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Deductions</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Net Pay</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollRuns.map((run) => (
                    <tr key={run.id} className="border-b border-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{run.period}</td>
                      <td className="px-4 py-3 text-sm text-right">{formatGHS(emp.grossSalary)}</td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">{formatGHS(emp.totalDeductions)}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium">{formatGHS(emp.netPay)}</td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">Paid</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div></PageTransition>
  );
}
