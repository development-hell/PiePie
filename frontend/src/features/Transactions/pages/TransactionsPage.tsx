import { useState, useEffect } from "react";
import { transactionsApi, type TransactionListResponse } from "@/features/Transactions/api";
import { Loader2, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, Filter } from "lucide-react";
import { useAuth } from "@/features/Auth/context/AuthContext";
import { cn } from "@/lib/utils";
import { type Transaction } from "@/features/Chat/types";
import { TransactionDetailsModal } from "../components/TransactionDetailsModal";

export function TransactionsPage() {
    const { user } = useAuth();
    const [data, setData] = useState<TransactionListResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [typeFilter, setTypeFilter] = useState<string>("");
    const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTxns = async () => {
        setIsLoading(true);
        try {
            const res = await transactionsApi.getTransactions({
                status: (statusFilter as 'pending' | 'confirmed' | 'rejected') || undefined,
                type: (typeFilter as 'sent' | 'received') || undefined
            });
            setData(res);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTxns();
    }, [statusFilter, typeFilter]);

    const handleTransactionClick = (txn: Transaction) => {
        setSelectedTxn(txn);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedTxn(null);
    };

    const handleTransactionUpdate = () => {
        // Refresh list to show new status
        fetchTxns();
    };

    if (!user) return null;

    return (
        <div className="h-full flex flex-col p-4 md:p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                    <p className="text-text-muted mt-1">Manage and review your financial history.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 items-center bg-surface p-1 rounded-lg border border-border">
                    <div className="flex items-center gap-2 px-3 text-text-muted">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm font-medium">Filter</span>
                    </div>
                    <div className="h-4 w-px bg-border mx-1"></div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <div className="h-4 w-px bg-border mx-1"></div>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
                    >
                        <option value="">All Types</option>
                        <option value="sent">Sent</option>
                        <option value="received">Received</option>
                    </select>
                </div>
            </header>

            {/* List */}
            <div className="flex-1 overflow-auto bg-surface border border-border rounded-xl shadow-sm no-scrollbar">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-text-muted">
                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                        <p>Loading transactions...</p>
                    </div>
                ) : !data || data.results.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-text-muted">
                        <p>No transactions found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {data.results.map((txn) => {
                            const isPayer = txn.payer.username === user.username;
                            const isIncoming = !isPayer; // Received if I am not the payer

                            // Visuals based on status
                            let StatusIcon = Clock;
                            let statusColor = "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";

                            if (txn.status === 'CONFIRMED') {
                                StatusIcon = CheckCircle;
                                statusColor = "text-green-600 bg-green-100 dark:bg-green-900/20";
                            } else if (txn.status === 'REJECTED') {
                                StatusIcon = XCircle;
                                statusColor = "text-red-600 bg-red-100 dark:bg-red-900/20";
                            }

                            return (
                                <div
                                    key={txn.id}
                                    onClick={() => handleTransactionClick(txn)}
                                    className="flex items-center justify-between p-4 hover:bg-surface-muted/50 transition-colors cursor-active cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn("p-2 rounded-full", isIncoming ? "bg-green-100 text-green-600 dark:bg-green-900/20" : "bg-surface-muted text-text-muted border border-border")}>
                                            {isIncoming ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-text">{txn.description || "No Description"}</p>
                                            <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                                                <span>{new Date(txn.created_at).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    {isPayer ? `To: ${txn.recipient.first_name}` : `From: ${txn.payer.first_name}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        <span className={cn("font-bold text-lg", isIncoming ? "text-green-600" : "text-text")}>
                                            {isIncoming ? '+' : '-'}${parseFloat(txn.amount).toLocaleString()}
                                        </span>
                                        <span className={cn("text-xs px-2 py-0.5 rounded-full flex items-center gap-1", statusColor)}>
                                            <StatusIcon className="w-3 h-3" />
                                            {txn.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedTxn && (
                <TransactionDetailsModal
                    transaction={selectedTxn}
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onUpdate={handleTransactionUpdate}
                />
            )}
        </div>
    );
}
