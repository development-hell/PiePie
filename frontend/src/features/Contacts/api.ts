import { api } from "@/lib/api";
import type { User } from "@/features/Auth/types";

export interface Contact {
  id: number;
  user: number; // Owner ID
  contact: User; // The actual contact person details
  created_at: string;
  allow_transactions: boolean;
  auto_accept_transactions: boolean;
}

export interface AddContactPayload {
  username: string;
}

export interface UpdateContactSettingsPayload {
  allow_transactions?: boolean;
  auto_accept_transactions?: boolean;
}

export const contactsApi = {
  getContacts: async (): Promise<Contact[]> => {
    const response = await api.get<Contact[]>("/contacts/");
    return response.data;
  },

  addContact: async (username: string): Promise<Contact> => {
    const response = await api.post<Contact>("/contacts/", { username });
    return response.data;
  },

  deleteContact: async (id: number): Promise<void> => {
    await api.delete(`/contacts/${id}/`);
  },

  updateSettings: async (id: number, settings: UpdateContactSettingsPayload): Promise<Contact> => {
    const response = await api.patch<Contact>(`/contacts/${id}/`, settings);
    return response.data;
  },
};
