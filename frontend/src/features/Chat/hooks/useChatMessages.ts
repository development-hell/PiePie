import { useState, useEffect, useRef, useCallback } from "react";
import { chatApi } from "@/features/Chat/api";
import type { Message } from "@/features/Chat/types";

export function useChatMessages(recipientUsername: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    // Refs for state that shouldn't trigger re-renders or for closure safety
    const pageRef = useRef(1);
    const messagesRef = useRef<Message[]>([]);
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Sync ref with state
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    // Initial Load
    useEffect(() => {
        const loadInitial = async () => {
            if (!recipientUsername) return;
            
            setIsLoading(true);
            setMessages([]);
            pageRef.current = 1;
            setHasMore(true);

            try {
                const response = await chatApi.getMessages(recipientUsername, { page: 1 });
                if ('results' in response) {
                    // Pagination returns Newest First. Reverse to show Chronologically.
                    const initialMessages = response.results.reverse();
                    setMessages(initialMessages);
                    setHasMore(!!response.next);
                }
            } catch (error) {
                console.error("Failed to load messages", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitial();
        
        // Cleanup polling on unmount or user change
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [recipientUsername]);

    // Polling Logic
    useEffect(() => {
        if (!recipientUsername) return;

        pollingRef.current = setInterval(async () => {
            // Only poll if window is focused
            if (!document.hasFocus()) return;

            // Get last message timestamp safely from Ref
            const currentMessages = messagesRef.current;
            if (currentMessages.length === 0) return;

            const lastMsg = currentMessages[currentMessages.length - 1];
            const after = lastMsg.created_at;

            try {
                const response = await chatApi.getMessages(recipientUsername, { after });
                // Polling endpoint returns Array
                if (Array.isArray(response) && response.length > 0) {
                    setMessages(prev => [...prev, ...response]);
                }
            } catch (error) {
                console.error("Polling failed", error);
            }
        }, 3000); // 3 Seconds

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [recipientUsername]);


    // Load History (Previous Page)
    const loadMore = useCallback(async () => {
        if (isLoadingHistory || !hasMore || !recipientUsername) return;

        setIsLoadingHistory(true);
        const nextPage = pageRef.current + 1;

        try {
            const response = await chatApi.getMessages(recipientUsername, { page: nextPage });
            
            if ('results' in response) {
                const olderMessages = response.results.reverse();
                
                // Prepend older messages
                setMessages(prev => [...olderMessages, ...prev]);
                setHasMore(!!response.next);
                pageRef.current = nextPage;
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setIsLoadingHistory(false);
        }
    }, [recipientUsername, isLoadingHistory, hasMore]);

    // Helper to manually add a sent message (optimistic or confirmed)
    const addMessage = useCallback((msg: Message) => {
        setMessages(prev => [...prev, msg]);
    }, []);

    return {
        messages,
        isLoading,
        isLoadingHistory,
        hasMore,
        loadMore,
        addMessage
    };
}
