import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";

export function ProtectedLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-[99vh] flex flex-col bg-surface text-text">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex flex-1 w-full px-0 h-[68vh] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <main className="flex-1 h-[80vh] overflow-y-auto no-scrollbar">
            <div className="p-4 pb-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
