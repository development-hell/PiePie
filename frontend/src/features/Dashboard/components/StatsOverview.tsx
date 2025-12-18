import { ArrowDownLeft, ArrowUpRight, Clock } from "lucide-react";
import { type DashboardStats } from "../api";
import { Skeleton } from "@/components/Skeleton";

interface StatsOverviewProps {
    stats: DashboardStats | null;
    isLoading: boolean;
}

export function StatsOverview({ stats, isLoading }: StatsOverviewProps) {
    if (isLoading || !stats) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 bg-surface border border-border rounded-2xl shadow-sm">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-6 bg-surface border border-border rounded-2xl shadow-sm flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ArrowUpRight className="w-16 h-16 text-primary" />
                </div>
                <span className="text-text-muted text-sm font-medium mb-1">Total Sent</span>
                <span className="text-3xl font-bold text-text">
                    ${stats.total_sent.toLocaleString()}
                </span>
                <div className="mt-2 text-xs text-primary font-medium flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>Paid Out</span>
                </div>
            </div>

            <div className="p-6 bg-surface border border-border rounded-2xl shadow-sm flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ArrowDownLeft className="w-16 h-16 text-green-500" />
                </div>
                <span className="text-text-muted text-sm font-medium mb-1">Total Received</span>
                <span className="text-3xl font-bold text-text">
                    ${stats.total_received.toLocaleString()}
                </span>
                <div className="mt-2 text-xs text-green-500 font-medium flex items-center gap-1">
                    <ArrowDownLeft className="w-3 h-3" />
                    <span>Incoming</span>
                </div>
            </div>

            <div className="p-6 bg-surface border border-border rounded-2xl shadow-sm flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Clock className="w-16 h-16 text-yellow-500" />
                </div>
                <span className="text-text-muted text-sm font-medium mb-1">Pending Actions</span>
                <span className="text-3xl font-bold text-text">
                    {stats.pending_action_count}
                </span>
                <div className="mt-2 text-xs text-yellow-600 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Needs Attention</span>
                </div>
            </div>
        </div>
    );
}
