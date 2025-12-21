import { api } from "@/lib/api";
import type { Transaction } from "../Chat/types";

export interface DashboardStats {
    total_sent: number;
    total_received: number;
    pending_action_count: number;
}

export interface GraphPoint {
    date: string;
    sent: number;
    received: number;
}

export interface GraphParams {
    filter: 'all' | 'sent' | 'received' | 'owned' | 'not_owned';
    range: '7d' | '30d' | '90d' | '1y';
}

export const dashboardApi = {
    getStats: async (): Promise<DashboardStats> => {
        const response = await api.get('/dashboard/stats/');
        return response.data;
    },

    getActivity: async (): Promise<Transaction[]> => {
        const response = await api.get('/dashboard/activity/');
        return response.data;
    },

    getGraphData: async (params: GraphParams): Promise<GraphPoint[]> => {
        const response = await api.get('/dashboard/graph_data/', { params });
        return response.data;
    }
};
