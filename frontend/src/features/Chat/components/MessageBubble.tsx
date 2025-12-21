import { useAuth } from "@/features/Auth/context/AuthContext";
import { chatApi } from "@/features/Chat/api";
import type { Message, Transaction } from "@/features/Chat/types";
import { cn } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { useState } from "react";

interface MessageBubbleProps {
    message: Message;
    onTransactionClick?: (transaction: Transaction) => void;
}

export function MessageBubble({ message, onTransactionClick }: MessageBubbleProps) {
    const { user } = useAuth();
    const isMe = message.sender.username === user?.username;
    const isTransaction = !!message.transaction;

    // Local state for status updates (optimistic/immediate feedback)
    const [status, setStatus] = useState(message.transaction?.status);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAction = async (action: 'confirm' | 'reject') => {
        if (!message.transaction || isProcessing) return;
        setIsProcessing(true);
        try {
            if (action === 'confirm') {
                await chatApi.confirmTransaction(message.transaction.id);
                setStatus('CONFIRMED');
            } else {
                await chatApi.rejectTransaction(message.transaction.id);
                setStatus('REJECTED');
            }
        } catch (error) {
            console.error(`Failed to ${action}`, error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isTransaction || !message.transaction) {
        return (
            <div id={`msg-${message.id}`} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                <div className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 shadow-sm",
                    isMe ? "bg-primary text-text-on-primary rounded-tr-none" : "bg-surface text-text rounded-tl-none border border-border"
                )}>
                    <p className="text-sm">{message.content}</p>
                    <div className="text-[10px] opacity-70 flex justify-end mt-1">
                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>
        )
    }

    const { transaction } = message;
    const isPayer = transaction.payer.username === user?.username;
    // Determine context: "You paid" vs "X paid" vs "You requested"
    // Ideally use created_by to distinguish Send vs Request intent
    const isCreator = transaction.created_by?.username === user?.username;

    // Logic for Title
    let title = "";
    if (transaction.payer.username === transaction.created_by?.username) {
        // "Pay" flow
        title = isPayer ? "You paid" : `${transaction.payer.first_name} paid`;
    } else {
        // "Request" flow
        // Creator (Recipient) requested from Payer
        if (isCreator) {
            title = `You requested from ${transaction.payer.first_name}`;
        } else {
            title = `${transaction.recipient.first_name} requested`;
        }
    }

    const canAction = status === 'PENDING' && !isCreator && message.transaction.created_by?.username !== user?.username;

    // Status Colors
    const statusColor = {
        'PENDING': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        'CONFIRMED': 'bg-green-500/10 text-green-600 border-green-500/20',
        'REJECTED': 'bg-red-500/10 text-red-600 border-red-500/20'
    }[status || 'PENDING'];

    return (
        <div id={`msg-${message.id}`} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
            <div
                onClick={() => isTransaction && message.transaction && onTransactionClick?.(message.transaction)}
                className={cn(
                    "max-w-[85%] sm:max-w-[300px] rounded-2xl shadow-sm overflow-hidden border transition-transform active:scale-95",
                    isMe ? "bg-surface rounded-tr-none border-primary/20" : "bg-surface rounded-tl-none border-border",
                    onTransactionClick ? "cursor-pointer hover:bg-surface-muted/50" : ""
                )}>
                {/* Header Section */}
                <div className="p-4 bg-surface-muted/50 border-b border-border flex items-center gap-3">
                    <div className={cn("p-2 rounded-full", isMe ? "bg-primary/10 text-primary" : "bg-surface-muted text-text-muted")}>
                        {isPayer ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <div>
                        <p className="text-xs font-medium text-text-muted">{title}</p>
                        <p className="text-xl font-bold text-text">${transaction.amount}</p>
                    </div>
                </div>

                {/* Content / Status */}
                <div className="p-3 space-y-3">
                    {/* Description */}
                    {(transaction.description && transaction.description !== "Money Transfer") && (
                        <p className="text-sm text-text italic">"{transaction.description}"</p>
                    )}

                    {/* Status Badge */}
                    <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border w-fit text-xs font-medium", statusColor)}>
                        {status === 'PENDING' && <Clock className="w-3 h-3" />}
                        {status === 'CONFIRMED' && <CheckCircle2 className="w-3 h-3" />}
                        {status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                        <span>{status}</span>
                    </div>

                    {/* Action Buttons */}
                    {canAction && (
                        <div className="flex gap-2 mt-2 pt-2 border-t border-border">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction('confirm');
                                }}
                                disabled={isProcessing}
                                className="flex-1 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition flex justify-center items-center gap-1"
                            >
                                {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                Confirm
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction('reject');
                                }}
                                disabled={isProcessing}
                                className="flex-1 py-1.5 bg-surface border border-red-200 text-red-600 text-xs rounded hover:bg-red-50 transition flex justify-center items-center gap-1"
                            >
                                <XCircle className="w-3 h-3" />
                                Reject
                            </button>
                        </div>
                    )}
                </div>

                {/* Timestamp */}
                <div className="px-3 pb-2 text-[10px] opacity-50 text-right">
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
}
