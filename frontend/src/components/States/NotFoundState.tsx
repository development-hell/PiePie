import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";

interface NotFoundStateProps {
    title?: string;
    description?: string;
    backLink?: string;
    backText?: string;
    icon?: React.ElementType;
    children?: React.ReactNode;
}

export function NotFoundState({
    title = "Not Found",
    description = "The resource you are looking for does not exist.",
    backLink,
    backText = "Go Back",
    icon: Icon = AlertCircle,
    children
}: NotFoundStateProps) {
    const navigate = useNavigate();

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-text-muted" />
            </div>

            <h1 className="text-2xl font-bold text-text mb-2">{title}</h1>
            <p className="text-text-muted max-w-md mb-8">{description}</p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
                {children}

                {backLink ? (
                    <button
                        onClick={() => navigate(backLink)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-text-on-primary font-medium rounded-xl hover:bg-primary-hover transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {backText}
                    </button>
                ) : (
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-surface text-text font-medium border border-border rounded-xl hover:bg-surface-muted transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                )}
            </div>
        </div>
    );
}
