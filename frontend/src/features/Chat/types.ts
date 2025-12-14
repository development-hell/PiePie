import type { User } from "@/features/Auth/types";

export interface Transaction {
    id: number;
    payer: User;
    recipient: User;
    created_by: User;
    amount: string; // Decimal string from backend
    description: string;
    status: "PENDING" | "CONFIRMED" | "REJECTED";
    created_at: string;
}

export interface Message {
    id: number;
    sender: User;
    recipient: User;
    content: string;
    transaction?: Transaction;
    created_at: string;
    is_read: boolean;
}

export interface RecentChat {
    user: User;
    last_message: Message;
}

export interface SendMessagePayload {
    recipient_username: string;
    content?: string;
    amount?: number;
    description?: string;
    transaction_type?: "pay" | "request";
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
