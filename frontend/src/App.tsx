import { Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/features/Auth/pages/LoginPage";
import { RegisterPage } from "@/features/Auth/pages/RegisterPage";
import { RequireAuth, PublicOnly } from "@/components/RouteGuards";
import { SettingsPage } from "@/features/Settings/pages/SettingsPage";

function App() {
  return (
    <Routes>
      {/* Public Routes (Accessible to everyone, but auth pages divert if logged in) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />

        {/* Only allow access if NOT logged in */}
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Protected Routes (Require Login) */}
      <Route element={<RequireAuth />}>
        <Route path="/app" element={<ProtectedLayout />}>
          <Route index element={<Navigate to="/app/chats" replace />} />
          <Route path="chats" element={<div className="p-4">Chats Placeolder</div>} />
          <Route path="contacts" element={<div className="p-4">Contacts Placeholder</div>} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
