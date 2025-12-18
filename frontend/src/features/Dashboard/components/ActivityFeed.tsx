import type { Transaction } from "@/features/Chat/types";
import { useAuth } from "@/features/Auth/context/AuthContext";
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/Skeleton";

interface ActivityFeedProps {
    transactions: Transaction[] | null;
    isLoading: boolean;
}

export function ActivityFeedSkeleton() {
    return (
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm h-full">
            <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1 space-y-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ActivityFeed({ transactions, isLoading }: ActivityFeedProps) {
    const { user } = useAuth();

    if (isLoading || !transactions) {
        return <ActivityFeedSkeleton />;
    }

    return (
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm h-full">
            <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>

            {transactions.length === 0 ? (
                <div className="text-center text-text-muted py-10">
                    <p>No transactions yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {transactions.map((txn) => {
                        const isPayer = txn.payer.username === user?.username;
                        const otherUser = isPayer ? txn.recipient : txn.payer;

                        // Status Config
                        const StatusIcon = {
                            'PENDING': Clock,
                            'CONFIRMED': CheckCircle2,
                            'REJECTED': XCircle
                        }[txn.status];

                        const statusColor = {
                            'PENDING': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
                            'CONFIRMED': 'text-green-600 bg-green-100 dark:bg-green-900/30',
                            'REJECTED': 'text-red-600 bg-red-100 dark:bg-red-900/30'
                        }[txn.status];

                        return (
                            <div key={txn.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2 rounded-full transition-colors",
                                        isPayer ? "bg-surface-muted text-text-muted" : "bg-green-50 text-green-600 dark:bg-green-900/20"
                                    )}>
                                        {isPayer ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-text">
                                            {isPayer ? `Paid ${otherUser.first_name}` : `Received from ${otherUser.first_name}`}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-text-muted">
                                            <span>{new Date(txn.created_at).toLocaleDateString()}</span>
                                            <span className={cn("px-1.5 py-0.5 rounded-full text-[10px] flex items-center gap-1", statusColor)}>
                                                <StatusIcon className="w-3 h-3" />
                                                {txn.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={cn("font-bold", isPayer ? "text-text" : "text-green-600")}>
                                    {isPayer ? "-" : "+"}${parseFloat(txn.amount).toLocaleString()}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
