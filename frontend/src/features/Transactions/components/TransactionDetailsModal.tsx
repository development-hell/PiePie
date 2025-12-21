import { X, CheckCircle, XCircle, User, Calendar, FileText, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { type Transaction } from "@/features/Chat/types";
import { chatApi } from "@/features/Chat/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/Auth/context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TransactionDetailsModalProps {
    transaction: Transaction;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void; // Trigger refresh after action
}

export function TransactionDetailsModal({ transaction, isOpen, onClose, onUpdate }: TransactionDetailsModalProps) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !user) return null;

    const isPayer = transaction.payer.username === user.username;
    const isIncoming = !isPayer;
    const isCreator = transaction.created_by.username === user.username;

    // Logic for Actions:
    // Can Confirm/Reject if: 
    // 1. Status is PENDING
    // 2. User is NOT the creator (cannot approve own request)
    const canAct = transaction.status === 'PENDING' && !isCreator;

    const handleAction = async (action: 'confirm' | 'reject') => {
        setIsProcessing(true);
        setError(null);
        try {
            if (action === 'confirm') {
                await chatApi.confirmTransaction(transaction.id);
            } else {
                await chatApi.rejectTransaction(transaction.id);
            }
            onUpdate(); // Refresh parent
            onClose();
        } catch (err) {
            console.error("Failed to process transaction", err);
            setError("Failed to process action. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            >
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center justify-between bg-surface-muted/30">
                    <h2 className="text-lg font-bold">Transaction Details</h2>
                    <button onClick={onClose} className="p-2 hover:bg-surface-muted rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Amount & Main Info */}
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className={cn("p-4 rounded-full mb-4", isIncoming ? "bg-green-100 text-green-600 dark:bg-green-900/20" : "bg-surface-muted border border-border text-text-muted")}>
                            {isIncoming ? <ArrowDownLeft className="w-10 h-10" /> : <ArrowUpRight className="w-10 h-10" />}
                        </div>
                        <h1 className={cn("text-4xl font-bold mb-1", isIncoming ? "text-green-600" : "text-text")}>
                            {isIncoming ? '+' : '-'}${parseFloat(transaction.amount).toLocaleString()}
                        </h1>
                        <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
                            transaction.status === 'CONFIRMED' ? "bg-green-100 text-green-700 dark:bg-green-900/30" :
                                transaction.status === 'REJECTED' ? "bg-red-100 text-red-700 dark:bg-red-900/30" :
                                    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30"
                        )}>
                            {transaction.status === 'CONFIRMED' && <CheckCircle className="w-3 h-3" />}
                            {transaction.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                            {transaction.status}
                        </span>
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-surface-muted/30 rounded-xl border border-border/50">
                            <label className="text-xs text-text-muted flex items-center gap-1 mb-1">
                                <User className="w-3 h-3" /> From
                            </label>
                            <div className="font-medium text-sm truncate">{transaction.payer.first_name} {transaction.payer.last_name}</div>
                            <div className="text-xs text-text-muted cursor-help" title={transaction.payer.username}>@{transaction.payer.username}</div>
                        </div>
                        <div className="p-3 bg-surface-muted/30 rounded-xl border border-border/50">
                            <label className="text-xs text-text-muted flex items-center gap-1 mb-1">
                                <User className="w-3 h-3" /> To
                            </label>
                            <div className="font-medium text-sm truncate">{transaction.recipient.first_name} {transaction.recipient.last_name}</div>
                            <div className="text-xs text-text-muted cursor-help" title={transaction.recipient.username}>@{transaction.recipient.username}</div>
                        </div>
                        <div className="p-3 bg-surface-muted/30 rounded-xl border border-border/50">
                            <label className="text-xs text-text-muted flex items-center gap-1 mb-1">
                                <Calendar className="w-3 h-3" /> Date
                            </label>
                            <div className="font-medium text-sm">{new Date(transaction.created_at).toLocaleDateString()}</div>
                            <div className="text-xs text-text-muted">{new Date(transaction.created_at).toLocaleTimeString()}</div>
                        </div>
                        <div className="p-3 bg-surface-muted/30 rounded-xl border border-border/50">
                            <label className="text-xs text-text-muted flex items-center gap-1 mb-1">
                                <FileText className="w-3 h-3" /> Note
                            </label>
                            <div className="font-medium text-sm truncate" title={transaction.description}>{transaction.description || "—"}</div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200 text-center">
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-border bg-surface-muted/30 flex flex-col gap-3">
                    {canAct && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleAction('reject')}
                                disabled={isProcessing}
                                className="flex-1 py-2.5 bg-white border border-border text-red-600 rounded-xl hover:bg-red-50 font-medium transition-colors disabled:opacity-50"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleAction('confirm')}
                                disabled={isProcessing}
                                className="flex-1 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 font-medium transition-colors shadow-lg shadow-gray-900/20 disabled:opacity-50"
                            >
                                Confirm
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            onClose();
                            const username = isPayer ? transaction.recipient.username : transaction.payer.username;
                            const query = transaction.message_id ? `?highlight=${transaction.message_id}` : '';
                            navigate(`/app/chats/${username}${query}`);
                        }}
                        className="w-full py-2.5 bg-surface border border-border text-text rounded-xl hover:bg-surface-muted font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        Show in Chat
                    </button>

                    {!canAct && transaction.status === 'PENDING' && (
                        <div className="text-center text-xs text-text-muted mt-1">
                            Waiting for {isCreator ? 'counterparty' : 'other party'} to confirm.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
