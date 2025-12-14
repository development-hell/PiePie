import { useState, useEffect, useRef } from "react";
import { useChatMessages } from "@/features/Chat/hooks/useChatMessages";
import type { SendMessagePayload } from "@/features/Chat/types";
import { chatApi } from "@/features/Chat/api";
import { MessageBubble } from "@/features/Chat/components/MessageBubble";
import { Send, DollarSign, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
    recipientUsername: string;
}

export function ChatWindow({ recipientUsername }: ChatWindowProps) {
    const { messages, isLoading, isLoadingHistory, hasMore, loadMore, addMessage } = useChatMessages(recipientUsername);

    // Input State
    const [inputText, setInputText] = useState("");
    const [isSending, setIsSending] = useState(false);

    // Transaction Mode State
    const [isTransactionMode, setIsTransactionMode] = useState(false);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const scrollRef = useRef<HTMLDivElement>(null);
    const previousHeightRef = useRef(0);

    // Auto-scroll to bottom ONCE on initial load or when sending new message (if near bottom)
    // Complex scroll logic: 
    // 1. If loading history: maintain relative position.
    // 2. If new message arrives/polling: scroll to bottom ONLY IF user was at bottom. 
    // For MVP: Scroll to bottom on mount. Scroll to bottom on NEW message sent (handled by sending).

    // UseRef to track if we just loaded history
    const isHistoryLoadingRef = useRef(false);

    useEffect(() => {
        if (isLoadingHistory) {
            // Capture height before update
            if (scrollRef.current) {
                previousHeightRef.current = scrollRef.current.scrollHeight;
                isHistoryLoadingRef.current = true;
            }
        }
    }, [isLoadingHistory]);

    // Handle Scroll Position Restoration after History Load
    useEffect(() => {
        if (isHistoryLoadingRef.current && !isLoadingHistory && scrollRef.current) {
            const newHeight = scrollRef.current.scrollHeight;
            const diff = newHeight - previousHeightRef.current;
            scrollRef.current.scrollTop = diff; // Jump down by the amount of added content
            isHistoryLoadingRef.current = false;
        }
    }, [messages, isLoadingHistory]); // Run when messages update

    // Handle Initial Scroll to Bottom
    useEffect(() => {
        if (!isLoading && messages.length > 0 && !isHistoryLoadingRef.current) {
            // Logic handled by initialScrolled below
        }
    }, [isLoading, recipientUsername]);

    // Simple auto-scroll to bottom on MOUNT only or change of recipient
    const [initialScrolled, setInitialScrolled] = useState(false);
    useEffect(() => {
        if (!isLoading && messages.length > 0 && scrollRef.current) {
            // If this is a fresh conversation load (not polling update), scroll to bottom
            // We can heuristic: if messages length is small (30) it's likely initial.
            // OR just scroll to bottom initially.
            // We will assume users want to see latest.
            if (!initialScrolled) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                setInitialScrolled(true);
            }
        }
    }, [isLoading, recipientUsername, messages.length]); // messages.length check might be annoying on poll.

    // Reset initialScrolled on recipient change
    useEffect(() => {
        setInitialScrolled(false);
    }, [recipientUsername]);


    // Infinite Scroll Handler
    const handleScroll = () => {
        if (!scrollRef.current) return;
        if (scrollRef.current.scrollTop === 0 && hasMore && !isLoadingHistory) {
            loadMore();
        }
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if ((!inputText.trim() && !isTransactionMode) || isSending) return;
        if (isTransactionMode && !amount) return;

        setIsSending(true);
        try {
            const payload: SendMessagePayload = {
                recipient_username: recipientUsername,
                content: inputText,
            };

            if (isTransactionMode) {
                payload.amount = parseFloat(amount);
                payload.description = description || inputText;
            }

            const newMsg = await chatApi.sendMessage(payload);
            addMessage(newMsg); // Optimistic update via hook

            // Scroll to bottom
            if (scrollRef.current) {
                // Determine if we should smooth scroll?
                setTimeout(() => {
                    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }, 100);
            }

            // Reset
            setInputText("");
            setAmount("");
            setDescription("");
            setIsTransactionMode(false);
        } catch (error) {
            console.error("Failed to send", error);
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex flex-col h-full bg-surface-muted/30">
            {/* Header */}
            <div className="p-4 bg-surface border-b border-border shadow-sm flex items-center gap-3">
                <h2 className="font-semibold text-lg">@{recipientUsername}</h2>
            </div>

            {/* Messages Area */}
            <div
                className="flex-1 overflow-y-auto p-4 space-y-4"
                ref={scrollRef}
                onScroll={handleScroll}
            >
                {isLoadingHistory && (
                    <div className="flex justify-center py-2">
                        <Loader2 className="w-5 h-5 animate-spin text-primary/50" />
                    </div>
                )}

                {messages.length === 0 ? (
                    <div className="text-center text-text-muted mt-10">
                        <p>No messages yet.</p>
                        <p className="text-sm">Say hello or share an expense!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-surface border-t border-border">
                {isTransactionMode && (
                    <div className="mb-4 p-4 bg-surface-muted rounded-xl border border-primary/20 animate-in slide-in-from-bottom-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-primary">New Expense</span>
                            <button onClick={() => setIsTransactionMode(false)} className="text-xs text-text-muted hover:text-text">Cancel</button>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-text-muted" />
                            <input
                                type="number"
                                placeholder="0.00"
                                className="bg-transparent text-2xl font-bold focus:outline-none w-full border-b border-border focus:border-primary"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="What for? (Description)"
                            className="w-full bg-transparent text-sm p-2 focus:outline-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                )}

                <form onSubmit={handleSend} className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setIsTransactionMode(!isTransactionMode)}
                        className={cn(
                            "p-3 rounded-full transition-colors",
                            isTransactionMode ? "bg-primary text-text-on-primary" : "bg-surface-muted text-text hover:bg-border"
                        )}
                        title="Add Transaction"
                    >
                        <DollarSign className="w-5 h-5" />
                    </button>

                    <input
                        type="text"
                        className="flex-1 bg-surface-muted border-0 rounded-full px-4 text-text focus:ring-2 focus:ring-primary focus:outline-none placeholder-text-muted"
                        placeholder={isTransactionMode ? "Add a note..." : "Type a message..."}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={!inputText.trim() && !amount}
                        className="p-3 bg-primary text-text-on-primary rounded-full hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
