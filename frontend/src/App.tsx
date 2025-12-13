import { Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/features/Auth/pages/LoginPage";
import { RegisterPage } from "@/features/Auth/pages/RegisterPage";
import { RequireAuth, PublicOnly } from "@/components/RouteGuards";
import { SettingsPage } from "@/features/Settings/pages/SettingsPage";
import { ContactsPage } from "@/features/Contacts/pages/ContactsPage";

import { ChatsPage } from "@/features/Chat/pages/ChatsPage";

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
          <Route path="chats" element={<ChatsPage />} />
          <Route path="chats/:username" element={<ChatsPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
