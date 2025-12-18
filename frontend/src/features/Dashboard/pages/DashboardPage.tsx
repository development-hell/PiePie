import { useEffect, useState } from "react";
import { dashboardApi, type DashboardStats } from "../api";
import { type Transaction } from "@/features/Chat/types";
import { StatsOverview } from "../components/StatsOverview";
import { ActivityFeed } from "../components/ActivityFeed";
import { TrendGraph } from "../components/TrendGraph";
import { useAuth } from "@/features/Auth/context/AuthContext";

export function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentTxns, setRecentTxns] = useState<Transaction[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [statsData, activityData] = await Promise.all([
                    dashboardApi.getStats(),
                    dashboardApi.getActivity()
                ]);
                setStats(statsData);
                setRecentTxns(activityData);
            } catch (error) {
                console.error("Failed to load dashboard", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboard();
    }, []);

    return (
        <div className="flex flex-col h-full bg-surface-muted/30 overflow-y-auto no-scrollbar">
            <div className="p-6 max-w-7xl mx-auto w-full space-y-6">

                {/* Header */}
                <div className="mb-2">
                    <h1 className="text-2xl font-bold text-text">Welcome back, {user?.first_name}! 👋</h1>
                    <p className="text-text-muted">Here's what's happening with your finances.</p>
                </div>

                {/* Stats Cards */}
                <StatsOverview stats={stats} isLoading={isLoading} />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Graph (Takes up 2 cols) */}
                    <div className="lg:col-span-2 min-h-[400px]">
                        <TrendGraph />
                    </div>

                    {/* Feed (Takes up 1 col) */}
                    <div className="min-h-[400px]">
                        <ActivityFeed transactions={recentTxns} isLoading={isLoading} />
                    </div>
                </div>

            </div>
        </div>
    );
}
