import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";

export function ProtectedLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface text-text">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex flex-1 w-full px-4 h-[calc(100vh-4rem)] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col h-full">
          <main className="flex-1 p-4 md:p-6 pb-6 overflow-y-auto min-h-[calc(100vh-8rem)]">
            <Outlet />
          </main>
          <div className="p-4 md:p-0">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
