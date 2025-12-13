import { MessageSquare, Users, Settings, LogOut, X, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/features/Auth/context/AuthContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isMobileOpen: boolean;
  isDesktopExpanded: boolean;
  onCloseMobile: () => void;
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

export function Sidebar({ isMobileOpen, isDesktopExpanded, onCloseMobile }: SidebarProps) {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "bg-surface-muted border-r border-border flex flex-col transition-all duration-300 ease-in-out z-40",

        // Desktop Styles (Relative flow, collapsible width)
        "md:flex md:h-full md:relative md:translate-x-0",
        isDesktopExpanded ? "md:w-56" : "md:w-20",

        // Mobile Styles (Fixed Drawer)
        "fixed inset-y-0 left-0 w-56 h-full shadow-xl md:shadow-none",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile Header with Close Button */}
        <div className="md:hidden p-4 border-b border-border flex items-center justify-between">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={onCloseMobile} className="p-1 hover:bg-surface-overlay rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-4 px-3 py-3 rounded-md transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-text hover:bg-border",
                    !isDesktopExpanded && "justify-center px-2"
                  )}
                  onClick={onCloseMobile}
                  title={!isDesktopExpanded ? item.name : undefined}
                >
                  <item.icon className="h-6 w-6 flex-shrink-0" />
                  <span className={cn(
                    "transition-opacity duration-200",
                    isDesktopExpanded ? "opacity-100" : "hidden md:hidden opacity-0"
                  )}>
                    {item.name}
                  </span>
                  {/* Keep text visible on mobile since it's always w-56 */}
                  {/* <span className="md:hidden ml-2">{item.name}</span> */}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-3 border-t border-border">
          <button
            onClick={() => {
              logout();
              onCloseMobile();
            }}
            className={cn(
              "flex items-center gap-4 px-3 py-2 text-base font-medium rounded-md w-full text-text-danger hover:bg-surface-danger-muted transition-colors whitespace-nowrap",
              !isDesktopExpanded && "justify-center px-2"
            )}
            title={!isDesktopExpanded ? "Logout" : undefined}
          >
            <LogOut className="h-6 w-6 flex-shrink-0" />
            <span className={cn(
              "transition-opacity duration-200",
              isDesktopExpanded ? "opacity-100" : "hidden md:hidden opacity-0"
            )}>
              Logout
            </span>
            {/* <span className="md:hidden ml-2">Logout</span> */}
          </button>
        </div>
      </aside>
    </>
  );
}
