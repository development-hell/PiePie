import { MessageSquare, Users, Settings, LogOut, X, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/features/Auth/context/AuthContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Chats", href: "/app/chats", icon: MessageSquare },
  { name: "Contacts", href: "/app/contacts", icon: Users },
  { name: "Settings", href: "/app/settings", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth();
  const location = useLocation();

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
        "md:flex md:w-56 md:sticky md:top-16 md:h-[calc(97vh-4rem)] md:translate-x-0",
        // Mobile styles (fixed, full height, toggleable)
        "fixed inset-y-0 left-0 w-56 h-full shadow-xl md:shadow-none",
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
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-4 px-3 py-3 text-base font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-text hover:bg-border"
                  )}
                  onClick={onClose} // Auto-close on mobile selection
                >
                  <item.icon className="h-6 w-6" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={() => {
              logout();
              onClose?.();
            }}
            className="flex items-center gap-4 px-3 py-2 text-base font-medium rounded-md w-full text-text-danger hover:bg-surface-danger-muted transition-colors"
          >
            <LogOut className="h-6 w-6" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
