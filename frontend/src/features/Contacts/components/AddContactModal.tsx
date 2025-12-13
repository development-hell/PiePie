import { useState } from "react";
import { X, UserPlus, Loader2 } from "lucide-react";
import { contactsApi } from "@/features/Contacts/api";

interface AddContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddContactModal({ isOpen, onClose, onSuccess }: AddContactModalProps) {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        setLoading(true);
        setError(null);

        try {
            await contactsApi.addContact(username);
            setUsername("");
            onSuccess();
            onClose();
        } catch (err: any) {
            // Extract error message from DRF response
            const msg =
                err.response?.data?.username?.[0] ||
                err.response?.data?.non_field_errors?.[0] ||
                err.response?.data?.detail ||
                "Failed to add contact. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface border border-border rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-muted/50">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        Add New Contact
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-text-muted hover:text-text hover:bg-surface-muted p-1 rounded-md transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="username" className="text-sm font-medium text-text-muted">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username to search..."
                            className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            autoFocus
                        />
                        {error && <p className="text-sm text-text-danger">{error}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text hover:bg-surface-muted rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !username.trim()}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                "Add Contact"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
