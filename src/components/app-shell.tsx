"use client";

import { useState } from "react";
import { CampusProvider } from "@/lib/campus-context";
import { ToastProvider } from "./toast";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <CampusProvider>
      <ToastProvider>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Topbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="lg:ml-64 mt-16 p-4 md:p-6 min-h-[calc(100vh-4rem)]">{children}</main>
      </ToastProvider>
    </CampusProvider>
  );
}
