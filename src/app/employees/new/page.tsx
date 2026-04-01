"use client";

import { campuses, departments } from "@/lib/mock-data";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/page-transition";
import { useToast } from "@/components/toast";

export default function NewEmployeePage() {
  const { showToast } = useToast();
  return (
    <PageTransition><div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/employees" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
          <p className="text-sm text-gray-500 mt-0.5">Onboard a new staff member</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-3xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">First Name</label><input type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20" placeholder="Enter first name" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label><input type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20" placeholder="Enter last name" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label><input type="email" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20" placeholder="email@icsghana.info" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label><input type="tel" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20" placeholder="+233 XX XXXXXXX" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label><input type="date" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">National ID</label><input type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20" placeholder="GHA-XXXX-XXXX-XXX" /></div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
            <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20">
              <option value="">Select campus</option>
              {campuses.filter(c => c.id !== "all").map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20">
              <option value="">Select department</option>
              {departments.map((d) => (<option key={d} value={d}>{d}</option>))}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Position</label><input type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20" placeholder="e.g. Class Teacher" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label><input type="date" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">SSNIT Number</label><input type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20" placeholder="SSNIT number" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">TIN</label><input type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20" placeholder="Tax Identification Number" /></div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-4">Salary Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary (GH₵)</label><input type="number" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20" placeholder="0.00" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Housing Allowance (GH₵)</label><input type="number" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20" placeholder="0.00" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Transport Allowance (GH₵)</label><input type="number" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20" placeholder="0.00" /></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tier 3 Provident Fund</label>
            <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20">
              <option value="no">Not Enrolled</option>
              <option value="yes">Enrolled (5%)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button onClick={() => showToast("Employee saved successfully! They have been added to the directory.", "success")} className="flex items-center gap-2 bg-gradient-to-r from-[#0B2545] to-[#1a4a7a] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0B2545]/20 transition-all active:scale-[0.98]">
            <Save size={16} /> Save Employee
          </button>
          <Link href="/employees" className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
        </div>
      </div>
    </div></PageTransition>
  );
}
