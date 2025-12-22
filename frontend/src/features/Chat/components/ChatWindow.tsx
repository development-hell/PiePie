import { NotFoundState } from "@/components/States/NotFoundState";
import type { User } from "@/features/Auth/types";
import { useChatMessages } from "@/features/Chat/hooks/useChatMessages";
import { ArrowLeft, Loader2, MoreVertical, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChatWindowContent } from "./ChatWindowContent"; // Import the Presenter

interface ChatWindowProps {
    recipientUsername: string;
    recipientUser?: User;
}

// Container Component
export function ChatWindow(props: ChatWindowProps) {
    const navigate = useNavigate();
    const { recipientUsername } = props;
    const { messages, isLoading, isLoadingHistory, hasMore, loadMore, addMessage, error } = useChatMessages(recipientUsername);

    // Handle 404 User Not Found
    if (error === 404) {
        return (
            <div className="flex flex-col h-full bg-surface-muted/30">
                {/* Header */}
                <div className="p-3 bg-surface border-b border-border shadow-sm flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/app/chats')}
                            className="p-2 -ml-2 hover:bg-surface-muted rounded-full transition-colors"
                            title="Back"
                        >
                            <ArrowLeft className="w-5 h-5 text-text-muted" />
                        </button>
                        <h2 className="font-semibold text-lg">{recipientUsername}</h2>
                    </div>
                    <button
                        className="p-2 hover:bg-surface-muted rounded-full transition-colors text-text-muted hover:text-text"
                        title="Menu"
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
                <NotFoundState
                    title="User Not Found"
                    description={`This user does not exist.`}
                    backLink="/app/chats"
                    backText="Back to Chats"
                    icon={UserX}
                />
            </div>
        );
    }

    // Handle Initial Loading
    if (isLoading) {
        return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    // Handle Generic Error
    if (error) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center" role="alert">
                <h2 className="text-lg font-semibold text-text mb-2">Something went wrong</h2>
                <p className="text-text-muted mb-6">We couldn't load this chat.</p>
                <button
                    onClick={() => navigate('/app/chats')}
                    className="px-5 py-2.5 bg-surface border border-border rounded-xl hover:bg-surface-muted transition-colors"
                >
                    Back to Chats
                </button>
            </div>
        );
    }

    return (
        <ChatWindowContent
            {...props}
            messages={messages}
            isLoading={isLoading}
            isLoadingHistory={isLoadingHistory}
            hasMore={hasMore}
            loadMore={loadMore}
            addMessage={addMessage}
        />
    );
}
