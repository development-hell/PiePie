import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PublicOnly, RequireAuth } from "@/components/RouteGuards";
import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Lazy Load Pages
const LoginPage = lazy(() => import("@/features/Auth/pages/LoginPage").then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("@/features/Auth/pages/RegisterPage").then(m => ({ default: m.RegisterPage })));
const ChatsPage = lazy(() => import("@/features/Chat/pages/ChatsPage").then(m => ({ default: m.ChatsPage })));
const TransactionsPage = lazy(() => import('@/features/Transactions/pages/TransactionsPage').then(m => ({ default: m.TransactionsPage })));
const ContactDetailPage = lazy(() => import("@/features/Contacts/pages/ContactDetailPage").then(m => ({ default: m.ContactDetailPage })));
const ContactsPage = lazy(() => import("@/features/Contacts/pages/ContactsPage").then(m => ({ default: m.ContactsPage })));
const DashboardPage = lazy(() => import("@/features/Dashboard/pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const SettingsPage = lazy(() => import("@/features/Settings/pages/SettingsPage").then(m => ({ default: m.SettingsPage })));
const LandingPage = lazy(() => import("@/pages/LandingPage").then(m => ({ default: m.LandingPage })));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));


function App() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-surface">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
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
            <Route path="contacts/:id" element={<ContactDetailPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
