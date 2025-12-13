import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";

export function ProtectedLayout() {
  // Mobile State
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Desktop State
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const handleMenuClick = () => {
    // Mobile: Toggle Drawer
    setIsMobileOpen((prev) => !prev);

    // Desktop: Toggle Expand/Collapse (unless pinned)
    if (isDesktopExpanded) {
      if (isPinned) setIsPinned(false); // Unpin if manually closing
      setIsDesktopExpanded(false);
    } else {
      setIsDesktopExpanded(true);
    }
  };

  const handleMenuDoubleClick = () => {
    setIsDesktopExpanded(true);
    setIsPinned(true);
  };

  const handleContentClick = () => {
    // Desktop: Auto-collapse if not pinned
    if (isDesktopExpanded && !isPinned) {
      setIsDesktopExpanded(false);
    }
  };

  return (
    <div className="h-dvh flex flex-col bg-surface text-text overflow-hidden">
      <Navbar
        onMenuClick={handleMenuClick}
        onMenuDoubleClick={handleMenuDoubleClick}
      />
      <div className="flex flex-1 w-full px-0 overflow-hidden relative">
        <Sidebar
          isMobileOpen={isMobileOpen}
          isDesktopExpanded={isDesktopExpanded}
          onCloseMobile={() => {
            setIsMobileOpen(false);
            if (!isPinned) { setIsDesktopExpanded(false) };
          }}
        />
        <div
          className="flex-1 flex flex-col h-full overflow-hidden"
          onClick={handleContentClick} // Capture outside clicks
        >
          <main className="flex-1 h-full overflow-y-auto no-scrollbar">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
