import { MessageSquare, Users, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/Auth/context/AuthContext";

export function Sidebar() {
  const { logout } = useAuth();
  return (
    <aside className="w-64 border-r border-border bg-surface-muted hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16">
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
  );
}
