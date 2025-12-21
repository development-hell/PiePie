import { api } from "@/lib/api";
import type { Transaction } from "@/features/Chat/types";

export interface TransactionParams {
    page?: number;
    status?: 'pending' | 'confirmed' | 'rejected';
    type?: 'sent' | 'received';
}

export interface TransactionListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Transaction[];
}

export const transactionsApi = {
    getTransactions: async (params: TransactionParams = {}): Promise<TransactionListResponse> => {
        const response = await api.get('/transactions/', { params });
        return response.data;
    }
};
