import type { Message } from "@/features/Chat/types";
import { useAuth } from "@/features/Auth/context/AuthContext";
import { cn } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface MessageBubbleProps {
    message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const { user } = useAuth();
    const isMe = message.sender.username === user?.username;
    const isTransaction = !!message.transaction;

    return (
        <div className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
            <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                isMe ? "bg-primary text-text-on-primary rounded-tr-none" : "bg-surface text-text rounded-tl-none border border-border",
                isTransaction && "p-0 overflow-hidden" // Remove padding for transaction card
            )}>
                {isTransaction ? (
                    <div className="flex flex-col">
                        <div className={cn("p-4 flex items-center gap-3", isMe ? "bg-primary-hover" : "bg-surface-muted")}>
                            <div className={cn("p-2 rounded-full", isMe ? "bg-white/20" : "bg-slate-200")}>
                                {isMe ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="text-sm font-medium opacity-90">
                                    {isMe ? "You paid" : `${message.sender.first_name} paid`}
                                </p>
                                <p className="text-xl font-bold">
                                    ${message.transaction?.amount}
                                </p>
                            </div>
                        </div>
                        {/* Optional Description / Content if any */}
                        {(message.content && message.content !== `💸 Sent ${message.transaction?.amount}`) && (
                            <div className="p-3 text-sm opacity-90 border-t border-white/10">
                                {message.content}
                            </div>
                        )}
                        {/* If no custom content, maybe show description? */}
                        {(!message.content || message.content === `💸 Sent ${message.transaction?.amount}`) && message.transaction?.description && (
                            <div className="p-3 text-sm opacity-90 border-t border-white/10">
                                {message.transaction.description}
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-sm">{message.content}</p>
                )}

                <div className={cn("text-[10px] mt-1 opacity-70 flex justify-end gap-1", isTransaction && "px-3 pb-2")}>
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
}
