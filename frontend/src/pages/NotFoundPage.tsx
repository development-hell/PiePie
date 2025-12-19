import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { NotFoundState } from "@/components/States/NotFoundState";
import { FileQuestion, Home, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-surface text-text">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-4">
                <NotFoundState
                    title="Page Not Found"
                    description="The page you're looking for doesn't exist or has been moved."
                    icon={FileQuestion}
                >
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-surface text-text font-medium border border-border rounded-xl hover:bg-surface-muted transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </button>
                    <button
                        onClick={() => navigate('/app')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-text-on-primary font-medium rounded-xl hover:bg-primary-hover transition-colors shadow-sm"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Go to App
                    </button>
                </NotFoundState>
            </main>
            <Footer />
        </div>
    );
}
