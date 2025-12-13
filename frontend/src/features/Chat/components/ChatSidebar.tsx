import type { RecentChat } from "../types";
import { Link, useParams } from "react-router-dom";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/Auth/context/AuthContext";

interface ChatSidebarProps {
    chats: RecentChat[];
    isLoading: boolean;
}

export function ChatSidebar({ chats, isLoading }: ChatSidebarProps) {
    const { username } = useParams();
    const { user } = useAuth();

    if (isLoading) {
        return <div className="p-4 text-center text-text-muted">Loading chats...</div>;
    }

    if (chats.length === 0) {
        return (
            <div className="p-4 text-center text-text-muted">
                <p>No chats yet.</p>
                <Link to="/app/contacts" className="text-primary hover:underline mt-2 block">
                    Start a chat from Contacts
                </Link>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto">
            {chats.map((chat) => {
                const isActive = username === chat.user.username;
                const lastMsg = chat.last_message;
                const isTransaction = !!lastMsg.transaction;

                return (
                    <Link
                        key={chat.user.id}
                        to={`/app/chats/${chat.user.username}`}
                        className={cn(
                            "flex items-center gap-3 p-4 hover:bg-surface-muted transition-colors border-b border-border/50",
                            isActive && "bg-primary/5 border-l-4 border-l-primary"
                        )}
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-border flex-shrink-0">
                            {chat.user.profile_photo ? (
                                <img src={chat.user.profile_photo} alt={chat.user.username} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <User className="w-6 h-6" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-sm font-semibold text-text truncate">
                                    {chat.user.first_name} {chat.user.last_name}
                                </h3>
                                <span className="text-xs text-text-muted whitespace-nowrap ml-2">
                                    {new Date(lastMsg.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-text-muted truncate">
                                {isTransaction
                                    ? `💸 Transaction: $${lastMsg.transaction?.amount}`
                                    : (lastMsg.sender.username === user?.username ? "You: " : `${lastMsg.sender.first_name}: `) + lastMsg.content}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
