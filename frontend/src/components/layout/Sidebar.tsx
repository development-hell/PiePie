import { MessageSquare, Users, Settings, LogOut, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/features/Auth/context/AuthContext";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility, if not use clsx logic or template literals

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth();
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content - Mobile Drawer + Desktop Sticky */}
      <aside className={cn(
        "bg-surface-muted border-r border-border flex flex-col transition-transform duration-300 ease-in-out z-50",
        // Desktop styles (always visible, sticky)
        "md:flex md:w-64 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0",
        // Mobile styles (fixed, full height, toggleable)
        "fixed inset-y-0 left-0 w-64 h-full shadow-xl md:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile Header with Close Button */}
        <div className="md:hidden p-4 border-b border-border flex items-center justify-between">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={onClose} className="p-1 hover:bg-surface-overlay rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-1">
            <Link to="/app/chats" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-border text-text">
              <MessageSquare className="h-4 w-4" />
              Chats
            </Link>
            <Link to="/app/contacts" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-border text-text">
              <Users className="h-4 w-4" />
              Contacts
            </Link>
            <Link to="/app/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-border text-text">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
        <div className="p-4 border-t border-border">
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md w-full text-text-danger hover:bg-surface-danger-muted"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
