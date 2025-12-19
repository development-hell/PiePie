import { chatApi } from "@/features/Chat/api";
import { MessageBubble } from "@/features/Chat/components/MessageBubble";
import { useChatMessages } from "@/features/Chat/hooks/useChatMessages";
import type { SendMessagePayload } from "@/features/Chat/types";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, DollarSign, Loader2, MessageSquare, MoreVertical, Send, User as UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { User } from "@/features/Auth/types";

interface ChatWindowProps {
    recipientUsername: string;
    recipientUser?: User;
}

export function ChatWindow({ recipientUsername, recipientUser: initialRecipientUser }: ChatWindowProps) {
    const navigate = useNavigate();
    const { messages, isLoading, isLoadingHistory, hasMore, loadMore, addMessage } = useChatMessages(recipientUsername);

    // Derive display name & photo
    const getUserDetails = () => {
        let user: User | undefined = initialRecipientUser;

        if (!user && messages.length > 0) {
            const msg = messages.find(m => m.sender.username === recipientUsername || m.recipient.username === recipientUsername);
            if (msg) {
                user = msg.sender.username === recipientUsername ? msg.sender : msg.recipient;
            }
        }

        return {
            displayName: user ? (user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.username) : `@${recipientUsername}`,
            profilePhoto: user?.profile_photo
        };
    };

    const { displayName, profilePhoto } = getUserDetails();

    // Input State
    const [inputText, setInputText] = useState("");
    const [isSending, setIsSending] = useState(false);

    // Mode State: 'transaction' is now Default.
    const [mode, setMode] = useState<'transaction' | 'message'>('transaction');

    // Transaction State
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const scrollRef = useRef<HTMLDivElement>(null);
    const previousHeightRef = useRef(0);
    const isHistoryLoadingRef = useRef(false);

    useEffect(() => {
        if (isLoadingHistory && scrollRef.current) {
            previousHeightRef.current = scrollRef.current.scrollHeight;
            isHistoryLoadingRef.current = true;
        }
    }, [isLoadingHistory]);

    useEffect(() => {
        if (isHistoryLoadingRef.current && !isLoadingHistory && scrollRef.current) {
            const newHeight = scrollRef.current.scrollHeight;
            const diff = newHeight - previousHeightRef.current;
            scrollRef.current.scrollTop = diff;
            isHistoryLoadingRef.current = false;
        }
    }, [messages, isLoadingHistory]);

    const [initialScrolled, setInitialScrolled] = useState(false);
    useEffect(() => {
        if (!isLoading && messages.length > 0 && scrollRef.current) {
            if (!initialScrolled) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                setInitialScrolled(true);
            }
        }
    }, [isLoading, recipientUsername, messages.length, initialScrolled]);

    useEffect(() => {
        setInitialScrolled(false);
    }, [recipientUsername]);

    const handleScroll = () => {
        if (scrollRef.current && scrollRef.current.scrollTop === 0 && hasMore && !isLoadingHistory) {
            loadMore();
        }
    };

    const handleSend = async (e?: React.FormEvent, type?: 'pay' | 'request') => {
        e?.preventDefault();

        // Validation based on mode
        if (mode === 'message' && !inputText.trim()) return;
        if (mode === 'transaction' && !amount) return;
        if (isSending) return;

        setIsSending(true);
        try {
            const payload: SendMessagePayload = {
                recipient_username: recipientUsername,
                content: inputText,
            };

            if (mode === 'transaction') {
                payload.amount = parseFloat(amount);
                payload.description = description;
                payload.transaction_type = type || 'pay';
            }

            const newMsg = await chatApi.sendMessage(payload);
            addMessage(newMsg);

            // Scroll
            if (scrollRef.current) {
                setTimeout(() => {
                    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }, 100);
            }

            // Reset
            setInputText("");
            setAmount("");
            setDescription("");
            // Keep current mode
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
            <div className="p-3 bg-surface border-b border-border shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/app/chats')}
                        className="p-2 -ml-2 hover:bg-surface-muted rounded-full transition-colors"
                        title="Back"
                    >
                        <ArrowLeft className="w-5 h-5 text-text-muted" />
                    </button>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
                        {profilePhoto ? (
                            <img src={profilePhoto} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon className="w-5 h-5 text-primary" />
                        )}
                    </div>

                    <h2 className="font-semibold text-lg">{displayName}</h2>
                </div>

                <button
                    className="p-2 hover:bg-surface-muted rounded-full transition-colors text-text-muted hover:text-text"
                    title="Menu"
                >
                    <MoreVertical className="w-5 h-5" />
                </button>
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
                {mode === 'transaction' ? (
                    <div className="animate-in slide-in-from-bottom-2 fade-in duration-200">
                        {/* Transaction Inputs (Permanent/Default) */}
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <DollarSign className="w-6 h-6 text-primary" />
                            <input
                                type="number"
                                min="0.00"
                                step="1"
                                placeholder="0.00"
                                className="bg-transparent text-4xl font-bold focus:outline-none w-full border-none placeholder-text-muted/20"
                                value={amount}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    // Prevent negative signs or invalid chars, keep it simple
                                    if (val === '' || parseFloat(val) >= 0) {
                                        setAmount(val);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    // Prevent minus sign
                                    if (e.key === '-') {
                                        e.preventDefault();
                                    }
                                }}
                                autoFocus
                            />
                        </div>

                        <div className="mb-4 px-2">
                            <input
                                type="text"
                                placeholder="Add a note (optional)..."
                                className="w-full bg-transparent border-b border-border text-sm py-2 focus:outline-none focus:border-primary transition-colors placeholder:text-text-muted/50"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleSend(undefined, 'pay')}
                                disabled={!amount || parseFloat(amount) <= 0}
                                className="flex-1 py-3 bg-primary text-text-on-primary rounded-xl font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
                            >
                                <ArrowUpRight className="w-5 h-5" />
                                <span>I Paid</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSend(undefined, 'request')}
                                disabled={!amount || parseFloat(amount) <= 0}
                                className="flex-1 py-3 bg-surface-muted border border-border text-text rounded-xl font-medium hover:bg-border disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
                            >
                                <ArrowDownLeft className="w-5 h-5" />
                                <span>I Request</span>
                            </button>

                            {/* Switch to Message Mode */}
                            <button
                                type="button"
                                onClick={() => setMode('message')}
                                className="p-3 bg-surface-muted text-text-muted hover:text-text hover:bg-border rounded-xl transition-colors"
                                title="Send Message"
                            >
                                <MessageSquare className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={(e) => handleSend(e)} className="flex gap-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
                        {/* Switch Back to Transaction */}
                        <button
                            type="button"
                            onClick={() => setMode('transaction')}
                            className="p-3 bg-surface-muted text-text hover:bg-border rounded-full transition-colors"
                            title="Back to Transaction"
                        >
                            <DollarSign className="w-5 h-5" />
                        </button>

                        <input
                            type="text"
                            className="flex-1 bg-surface-muted border-0 rounded-full px-4 text-text focus:ring-2 focus:ring-primary focus:outline-none placeholder-text-muted"
                            placeholder="Type a message..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            autoFocus
                        />

                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className="p-3 bg-primary text-text-on-primary rounded-full hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
