import { useState } from "react";
import { useAuth } from "@/features/Auth/context/AuthContext";
import { User, Mail, Phone, Camera, Lock, ArrowRight } from "lucide-react";
import { authApi } from "@/features/Auth/api";

export function SettingsPage() {
    const { user, updateProfile, isLoading } = useAuth();
    const [formData, setFormData] = useState({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [securityMessage, setSecurityMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage(null);
        try {
            await updateProfile(formData);
            setSuccessMessage("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateEmail = async () => {
        setSecurityMessage(null);
        try {
            await authApi.updateEmail();
        } catch (err: any) {
            setSecurityMessage({
                text: err.response?.data?.error || "Failed to update email",
                type: 'error'
            });
        }
    };

    const handleUpdatePhone = async () => {
        setSecurityMessage(null);
        try {
            await authApi.updatePhone();
        } catch (err: any) {
            setSecurityMessage({
                text: err.response?.data?.error || "Failed to update phone",
                type: 'error'
            });
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-text">Settings</h1>
                <p className="text-text-muted">Manage your account settings and preferences.</p>
            </div>

            {/* Profile Section */}
            <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-medium text-text">Profile Information</h2>
                    <p className="mt-1 text-sm text-text-muted">Update your photo and personal details.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="relative group cursor-pointer">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-border overflow-hidden">
                                {user?.profile_photo ? (
                                    <img src={user.profile_photo} alt={user.username} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8" />
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text">Profile Photo</p>
                            <p className="text-xs text-text-muted">Click to upload (Coming Soon)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="first_name" className="block text-sm font-medium text-text-muted">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                id="first_name"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-text placeholder-text-muted focus:border-primary focus:ring-primary sm:text-sm transition-colors"
                            />
                        </div>
                        <div>
                            <label htmlFor="last_name" className="block text-sm font-medium text-text-muted">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                id="last_name"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-text placeholder-text-muted focus:border-primary focus:ring-primary sm:text-sm transition-colors"
                            />
                        </div>
                    </div>

                    {successMessage && (
                        <div className="rounded-md bg-green-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">{successMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t border-border">
                        <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="inline-flex justify-center rounded-lg border border-transparent bg-primary py-2 px-4 text-sm font-medium text-text-on-primary shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Security & Contact Section */}
            <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-medium text-text">Security & Contact</h2>
                    <p className="mt-1 text-sm text-text-muted">Manage your login and restricted contact details.</p>
                </div>

                {securityMessage && (
                    <div className={`mx-6 mt-6 p-4 rounded-md ${securityMessage.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                        <p className="text-sm font-medium">{securityMessage.text}</p>
                    </div>
                )}

                <div className="divide-y divide-border">
                    {/* Email Row */}
                    <div className="p-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-text-muted flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Email Address
                            </p>
                            <p className="text-text font-medium">{user?.email}</p>
                            <p className="text-xs text-text-muted flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Read-only
                            </p>
                        </div>
                        <button
                            onClick={handleUpdateEmail}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                            Update <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Phone Row */}
                    <div className="p-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-text-muted flex items-center gap-2">
                                <Phone className="w-4 h-4" /> Phone Number
                            </p>
                            <p className="text-text font-medium">{user?.phone_number || "Not set"}</p>
                            <p className="text-xs text-text-muted flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Read-only
                            </p>
                        </div>
                        <button
                            onClick={handleUpdatePhone}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                            Update <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
