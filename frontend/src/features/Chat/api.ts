import { api } from "@/lib/api";
import type { Message, PaginatedResponse, RecentChat, SendMessagePayload } from "@/features/Chat/types";

export const chatApi = {
    getRecentChats: async (): Promise<RecentChat[]> => {
        const response = await api.get("/chats/recent_chats/");
        return response.data;
    },

    getMessages: async (username: string, params: { page?: number; after?: string } = {}): Promise<PaginatedResponse<Message> | Message[]> => {
        const response = await api.get(`/chats/${username}/messages/`, { params });
        return response.data;
    },

    sendMessage: async (payload: SendMessagePayload): Promise<Message> => {
        const response = await api.post(`/chats/${payload.recipient_username}/send/`, payload);
        return response.data;
    }
};
