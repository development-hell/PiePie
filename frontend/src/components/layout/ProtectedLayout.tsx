import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";

export function ProtectedLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-text">
      <Navbar />
      <div className="flex flex-1 container mx-auto px-0 md:px-4 max-w-7xl">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-y-auto h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
      {/* Mobile Bottom Nav could go here or replace Footer */}
      <div className="md:hidden">
        <Footer />
      </div>
    </div>
  );
}
