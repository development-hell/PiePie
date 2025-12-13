import type { Contact } from "@/features/Contacts/api";
import { contactsApi } from "@/features/Contacts/api";
import { AddContactModal } from "@/features/Contacts/components/AddContactModal";
import { ContactSettingsModal } from "@/features/Contacts/components/ContactSettingsModal";
import { Plus, Settings, Trash2, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ContactsPage() {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Settings Modal State
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    const fetchContacts = async () => {
        try {
            const data = await contactsApi.getContacts();
            console.log("Fetched data:", data);
            if (Array.isArray(data)) {
                setContacts(data);
            }
        } catch (error) {
            console.error("Failed to load contacts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to remove this contact?")) return;
        try {
            await contactsApi.deleteContact(id);
            setContacts(contacts.filter((c) => c.id !== id));
        } catch (error) {
            console.error("Failed to delete contact", error);
        }
    };

    const openSettings = (contact: Contact) => {
        setSelectedContact(contact);
        setIsSettingsModalOpen(true);
    };

    const handleContactUpdate = (updated: Contact) => {
        setContacts(contacts.map(c => c.id === updated.id ? updated : c));
        setSelectedContact(updated);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-surface/95 backdrop-blur z-10">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
                    <p className="text-text-muted">Manage your friends and expense partners.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Add Contact
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-48 text-text-muted">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-2" />
                        Loading contacts...
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-xl bg-surface-muted/30">
                        <div className="bg-surface-muted p-4 rounded-full mb-4">
                            <UserIcon className="w-8 h-8 text-text-muted" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No contacts yet</h3>
                        <p className="text-text-muted max-w-sm mb-6">
                            Add your friends to start splitting bills and tracking expenses together.
                        </p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="text-primary hover:underline font-medium"
                        >
                            Add your first contact
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {contacts.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/app/chats/${item.contact.username}`)}
                                className="group flex items-center p-4 bg-surface border border-border rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                                {/* Avatar */}
                                <div className="flex-shrink-0 mr-4">
                                    {item.contact.profile_photo ? (
                                        <img
                                            src={item.contact.profile_photo}
                                            alt={item.contact.username}
                                            className="w-12 h-12 rounded-full object-cover border border-border"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                            {item.contact.first_name[0]?.toUpperCase() || item.contact.username[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-semibold truncate">
                                        {item.contact.first_name} {item.contact.last_name}
                                    </h3>
                                    <p className="text-sm text-text-muted truncate">@{item.contact.username}</p>
                                    {/* Status Badges */}
                                    <div className="flex gap-1 mt-1">
                                        {!item.allow_transactions && <span className="text-[10px] bg-surface-danger-muted text-text-danger px-1.5 py-0.5 rounded">Blocked</span>}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openSettings(item)}
                                        className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                                        title="Settings"
                                    >
                                        <Settings className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-text-muted hover:text-text-danger hover:bg-surface-danger-muted rounded-full transition-colors"
                                        title="Remove Contact"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AddContactModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchContacts}
            />

            <ContactSettingsModal
                isOpen={isSettingsModalOpen}
                contact={selectedContact}
                onClose={() => setIsSettingsModalOpen(false)}
                onUpdate={handleContactUpdate}
            />
        </div>
    );
}
