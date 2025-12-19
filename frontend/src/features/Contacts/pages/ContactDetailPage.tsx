import { NotFoundState } from "@/components/States/NotFoundState";
import { Skeleton } from "@/components/Skeleton";
import { contactsApi } from "@/features/Contacts/api";
import type { Contact } from "@/features/Contacts/api";
import { ArrowLeft, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function ContactDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<number | null>(null);

    useEffect(() => {
        const fetchContact = async () => {
            if (!id) return;

            // Strict ID Validation: Ensure ID is purely numeric
            if (!/^\d+$/.test(id)) {
                setError(404);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // We'll need to fetch all contacts and find by ID since we don't have a specific getContactById endpoint yet,
                // OR we assume the API supports it. For now, since contactsApi.getContacts() returns all, we might filter.
                // Optimally we'd add getContactById to API.

                // Assuming we might have to filter for now if backend doesn't support detail view yet.
                // Let's rely on the list for now or simulate a fetch. 
                // Actually, let's verify if 'contactsApi' has a get-single method.
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

    if (loading) {
        return (
            <Skeleton className="h-full flex flex-col">
                <Skeleton className="p-6 border-b border-border flex items-center gap-4 bg-surface">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </Skeleton>
                <Skeleton className="p-8 space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-32 w-full rounded-md" />
                </Skeleton>
            </Skeleton>
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

    // Basic Detail View (Placeholder for now)
    return (
        <div className="h-full flex flex-col">
            <div className="p-6 border-b border-border flex items-center gap-4 bg-surface">
                <button
                    onClick={() => navigate('/app/contacts')}
                    className="p-2 -ml-2 hover:bg-surface-muted rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-text-muted" />
                </button>
                <h1 className="text-xl font-bold">{contact.contact.first_name} {contact.contact.last_name}</h1>
            </div>
            <div className="p-8">
                <p className="text-text-muted">Contact Detail View (Placeholder)</p>
                <code className="block mt-4 p-4 bg-surface-muted rounded-md text-sm">
                    {JSON.stringify(contact, null, 2)}
                </code>
            </div>
        </div>
    );
}
