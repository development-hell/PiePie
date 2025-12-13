import { useState } from "react";
import { X, Settings } from "lucide-react";
import { contactsApi } from "@/features/Contacts/api";
import type { Contact } from "@/features/Contacts/api";

interface ContactSettingsModalProps {
    contact: Contact | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedContact: Contact) => void;
}

export function ContactSettingsModal({ contact, isOpen, onClose, onUpdate }: ContactSettingsModalProps) {
    const [loading, setLoading] = useState(false);

    if (!isOpen || !contact) return null;

    const handleToggle = async (key: 'allow_transactions' | 'auto_accept_transactions') => {
        setLoading(true);
        try {
            const updated = await contactsApi.updateSettings(contact.id, {
                [key]: !contact[key]
            });
            onUpdate(updated);
        } catch (error) {
            console.error("Failed to update settings", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface border border-border rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-muted/50">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Settings className="w-5 h-5 text-primary" />
                        Settings for {contact.contact.first_name}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-surface-muted rounded-md transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">

                    {/* Allow Transactions */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium text-text">Allow Transactions</label>
                            <p className="text-xs text-text-muted">Block or allow new expenses.</p>
                        </div>
                        <button
                            onClick={() => handleToggle('allow_transactions')}
                            disabled={loading}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 \${
                        contact.allow_transactions ? 'bg-primary' : 'bg-surface-muted border border-border'
                    }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${
                        contact.allow_transactions ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                        </button>
                    </div>

                    {/* Auto Accept */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium text-text">Auto-Accept</label>
                            <p className="text-xs text-text-muted">Automatically approve requests.</p>
                        </div>
                        <button
                            onClick={() => handleToggle('auto_accept_transactions')}
                            disabled={loading}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 \${
                        contact.auto_accept_transactions ? 'bg-primary' : 'bg-surface-muted border border-border'
                    }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${
                        contact.auto_accept_transactions ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                        </button>
                    </div>

                </div>

                <div className="p-4 bg-surface-muted/30 border-t border-border flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-text bg-surface border border-border rounded-md hover:bg-surface-muted">
                        Done
                    </button>
                </div>

            </div>
        </div>
    );
}
