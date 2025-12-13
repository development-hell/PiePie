import { useState, useEffect, useRef } from "react";
import type { Message, SendMessagePayload } from "../types";
import { chatApi } from "../api";
import { MessageBubble } from "./MessageBubble";
import { Send, DollarSign, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
    recipientUsername: string;
}

export function ChatWindow({ recipientUsername }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inputText, setInputText] = useState("");
    const [isSending, setIsSending] = useState(false);

    // Transaction Mode State
    const [isTransactionMode, setIsTransactionMode] = useState(false);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch Messages
    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                const data = await chatApi.getMessages(recipientUsername);
                setMessages(data);
            } catch (error) {
                console.error("Failed to load messages", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (recipientUsername) {
            fetchMessages();
            // Optional: Poll for new messages here or setup WebSocket
        }
    }, [recipientUsername]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

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
                payload.description = description || inputText; // Use input text as description if desc empty
            }

            const newMsg = await chatApi.sendMessage(payload);
            setMessages([...messages, newMsg]);

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
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
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
