import { NotFoundState } from "@/components/States/NotFoundState";
import { Skeleton } from "@/components/Skeleton";
import { contactsApi } from "@/features/Contacts/api";
import type { Contact } from "@/features/Contacts/api";
import { useChatMessages } from "@/features/Chat/hooks/useChatMessages";
import { ArrowLeft, UserX, MessageSquare, Ban, Trash2, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

export function ContactDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<number | null>(null);

    // Fetch Messages to derive stats/history
    // Note: This hooks expects 'username'. We need to wait for contact to be loaded to get username.
    const username = contact?.contact.username;
    // conditionally call hook or just handle null inside? 
    // Hooks must be called unconditionally. We'll pass logic inside.
    const { messages, isLoading: loadingMessages } = useChatMessages(username || "");

    useEffect(() => {
        const fetchContact = async () => {
            if (!id) return;
            // Strict ID Validation
            if (!/^\d+$/.test(id)) {
                setError(404);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const contacts = await contactsApi.getContacts();
                const found = contacts.find(c => c.id === parseInt(id));

                if (found) {
                    setContact(found);
                } else {
                    setError(404);
                }
            } catch (err) {
                console.error(err);
                setError(500);
            } finally {
                setLoading(false);
            }
        };

        fetchContact();
    }, [id]);

    // Derive Stats from loaded messages
    const transactions = messages.map(m => m.transaction).filter(t => t);
    console.log("messages", messages);
    const totalTransactions = transactions.length;
    // Simple client-side calc for MVP (only based on loaded messages)
    const lastTransaction = transactions[0];

    if (loading) {
        return (
            <div className="h-full flex flex-col bg-surface-muted/30 p-6">
                <Skeleton className="h-64 w-full rounded-3xl mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-48 w-full rounded-3xl" />
                    <Skeleton className="h-48 w-full rounded-3xl" />
                </div>
            </div>
        );
    }

    if (error === 404 || !contact) {
        return (
            <NotFoundState
                title="Contact Not Found"
                description={`The contact you are looking for could not be found.`}
                backLink="/app/contacts"
                backText="Back to Contacts"
                icon={UserX}
            />
        );
    }

    const user = contact.contact;

    return (
        <div className="h-full flex flex-col bg-surface-muted/30 overflow-y-auto">
            {/* Header / Banner */}
            <div className="bg-surface border-b border-border shadow-sm p-6 md:p-10 flex flex-col items-center justify-center relative">
                <button
                    onClick={() => navigate('/app/contacts')}
                    className="absolute top-6 left-6 p-2 hover:bg-surface-muted rounded-full transition-colors text-text-muted"
                    title="Back"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-surface shadow-xl flex items-center justify-center overflow-hidden mb-4">
                    {user.profile_photo ? (
                        <img src={user.profile_photo} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-4xl font-bold text-primary">
                            {user.first_name[0]}{user.last_name?.[0]}
                        </span>
                    )}
                </div>

                <h1 className="text-3xl font-bold text-text mb-1">
                    {user.first_name} {user.last_name}
                </h1>
                <p className="text-text-muted text-lg mb-6">@{user.username}</p>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`/app/chats/${user.username}`)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-text-on-primary rounded-full hover:bg-primary-hover font-medium transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30"
                    >
                        <MessageSquare className="w-5 h-5" />
                        Message
                    </button>
                    <button className="p-3 bg-surface border border-border text-text-muted hover:bg-surface-muted hover:text-red-500 rounded-full transition-colors" title="Block User">
                        <Ban className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-surface border border-border text-text-muted hover:bg-surface-muted hover:text-red-500 rounded-full transition-colors" title="Delete Contact">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
                        <h3 className="text-text-muted text-sm font-medium mb-1">Shared History</h3>
                        <div className="text-2xl font-bold">{totalTransactions} <span className="text-sm font-normal text-text-muted">Transactions</span></div>
                    </div>
                    <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
                        <h3 className="text-text-muted text-sm font-medium mb-1">Last Interaction</h3>
                        <div className="text-lg font-medium">
                            {lastTransaction ? new Date(lastTransaction.created_at).toLocaleDateString() : "Never"}
                        </div>
                    </div>
                    <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
                        <h3 className="text-text-muted text-sm font-medium mb-1">Status</h3>
                        <div className="text-lg font-medium text-green-500 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Active Contact
                        </div>
                    </div>
                </div>

                {/* Detail Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
                            <h3 className="font-semibold text-lg mb-4">Contact Details</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Email</label>
                                    <p className="text-text font-medium break-all">{user.email || 'Hidden'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Since</label>
                                    <p className="text-text font-medium">December 2025</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="lg:col-span-2">
                        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm min-h-[300px]">
                            <h3 className="font-semibold text-lg mb-4">Recent Transactions</h3>

                            {loadingMessages ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-16 w-full rounded-xl" />
                                    <Skeleton className="h-16 w-full rounded-xl" />
                                </div>
                            ) : transactions.length === 0 ? (
                                <div className="text-center py-12 text-text-muted">
                                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No financial history yet.</p>
                                </div>
                            ) : (
                                        <div className="space-y-3">
                                    {transactions.slice(0, 5).map((txn : any) => {
                                        const isIncoming = txn.payer.username === user.username;
                                        return (
                                            <div key={txn.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-muted/50 hover:bg-surface-muted transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn("p-2.5 rounded-full", isIncoming ? "bg-green-100 text-green-600 dark:bg-green-900/20" : "bg-surface border border-border text-text-muted")}>
                                                        {isIncoming ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-text">{txn.description}</p>
                                                        <p className="text-xs text-text-muted">{new Date(txn.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <span className={cn("font-bold text-lg", isIncoming ? "text-green-600" : "text-text")}>
                                                    {isIncoming ? '+' : '-'}${parseFloat(txn.amount).toLocaleString()}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
