import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/features/Auth/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { LogOut, Settings, User as UserIcon, Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
  onMenuDoubleClick?: () => void;
}

export function Navbar({ onMenuClick, onMenuDoubleClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAppSection = location.pathname.startsWith("/app");

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    // Redirect handled by RouteGuard or Context, but explicit here is fine too
    navigate("/login");
  };

  return (
    <nav className="border-b border-border bg-surface-overlay backdrop-blur-md sticky top-0 z-50">
      <div className="w-full px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Menu Button - Visible on both Mobile and Desktop now */}
          {user && onMenuClick && (
            <button
              onClick={onMenuClick}
              onDoubleClick={onMenuDoubleClick}
              className="p-2 -ml-2 text-text hover:bg-surface-muted rounded-md"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            PiePie
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Case 1: Not Logged In */}
          {!user && (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-medium hover:text-primary">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-medium bg-primary text-text-on-primary rounded-lg hover:bg-primary-hover transition-colors">
                Get Started
              </Link>
            </>
          )}

          {/* Case 2: Logged In, but on Public Page (e.g. Landing) */}
          {user && !isAppSection && (
            <Link to="/app/chats" className="px-4 py-2 text-sm font-medium bg-primary text-text-on-primary rounded-lg hover:bg-primary-hover transition-colors">
              Go to App
            </Link>
          )}

          {/* Case 3: Logged In AND in App Section -> Show Profile Menu */}
          {user && isAppSection && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-border">
                  {user.profile_photo ? (
                    <img src={user.profile_photo} alt={user.username} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5" />
                  )}
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg py-1 border border-border ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 text-sm text-text-muted border-b border-border mb-1">
                    <p className="font-medium text-text truncate">{user.first_name} {user.last_name}</p>
                    <p className="text-xs truncate">@{user.username}</p>
                  </div>

                  <Link
                    to="/app/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-surface-muted transition-colors w-full text-left"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-danger hover:bg-surface-danger-muted transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
