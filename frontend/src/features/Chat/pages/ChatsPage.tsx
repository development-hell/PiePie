import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChatSidebar } from "@/features/Chat/components/ChatSidebar";
import { ChatWindow } from "@/features/Chat/components/ChatWindow";
import { chatApi } from "@/features/Chat/api";
import type { RecentChat } from "@/features/Chat/types";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

export function ChatsPage() {
    const { username } = useParams();
    const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecent = async () => {
            setIsLoading(true);
            try {
                const data = await chatApi.getRecentChats();

                // If we have a username param but not in lists, we might want to manually fetch it or just let ChatWindow handle 404
                // But generally RecentChats are those with history.
                // If user clicks "Contact" -> "Chat", they might not be in recent yet.
                // We should assume if URL has username, we show ChatWindow regardless of list presence.

                setRecentChats(data);
            } catch (error) {
                console.error("Failed to load recent chats", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecent();
    }, [username]); // Re-fetch when navigating to ensure sort order updates? Maybe overkill. Just once on mount is fine usually.

    return (
        <div className="flex h-[calc(93vh-4rem)] border border-border bg-surface w-full overflow-hidden">
            {/* Sidebar List - Hidden on Mobile if Chat Open */}
            <div className={cn(
                "w-full md:w-80 border border-border flex flex-col bg-surface",
                username ? "hidden md:flex" : "flex"
            )}>
                <div className="p-4 border-b border-border flex items-center justify-between bg-surface z-10">
                    <h1 className="font-bold text-xl">Chats</h1>
                </div>
                <ChatSidebar chats={recentChats} isLoading={isLoading} />
            </div>

            {/* Chat Window - Hidden on Mobile if No Chat Selected (Default View) */}
            <div className={cn(
                "flex-1 flex flex-col border border-border bg-surface-muted/30 w-full",
                !username ? "hidden md:flex" : "flex"
            )}>
                {username ? (
                    <ChatWindow
                        recipientUsername={username}
                        recipientUser={recentChats.find(c => c.user.username === username)?.user}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-text-muted p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 opacity-50" />
                        </div>
                        <h2 className="text-lg font-semibold text-text mb-2">Select a conversation</h2>
                        <p>Choose a contact from the left to start chatting or splitting expenses.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
