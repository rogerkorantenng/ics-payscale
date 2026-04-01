"use client";

import { CampusProvider } from "@/lib/campus-context";
import { ToastProvider } from "./toast";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <CampusProvider>
      <ToastProvider>
        <Sidebar />
        <Topbar />
        <main className="ml-64 mt-16 p-6 min-h-[calc(100vh-4rem)]">{children}</main>
      </ToastProvider>
    </CampusProvider>
  );
}
