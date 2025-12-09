import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
        Unified Finance <br /> for Everyone.
      </h1>
      <p className="text-lg md:text-xl text-text-muted max-w-2xl mb-10">
        Track expenses, split bills, and manage shared ledgers with friends. 
        All in one chat-centric interface.
      </p>
      <div className="flex gap-4">
        <Link to="/register" className="px-8 py-3 rounded-full bg-primary text-text-on-primary font-semibold text-lg hover:bg-primary-hover transition-all shadow-lg hover:shadow-indigo-500/25">
          Get Started Free
        </Link>
        <Link to="/login" className="px-8 py-3 rounded-full bg-surface text-text font-semibold text-lg border border-border hover:bg-surface-muted transition-all">
          Login
        </Link>
      </div>
    </div>
  );
}
