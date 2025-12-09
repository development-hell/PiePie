import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { RegisterCredentials } from "@/features/Auth/types";
import { useAuth } from "@/features/Auth/context/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, error: authError } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<RegisterCredentials>({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.first_name) return;

    try {
      setIsSubmitting(true);
      await register(formData);
      navigate("/login");
    } catch (err) {
      console.error("Register Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-8 bg-surface p-8 rounded-2xl shadow-xl border border-border">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Join PiePie to manage your finances together
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-text-muted">
                First Name *
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-text placeholder-text-muted focus:border-primary focus:ring-primary sm:text-sm"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-text-muted">
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-text placeholder-text-muted focus:border-primary focus:ring-primary sm:text-sm"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-muted">
                Username (@handle)
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-text placeholder-text-muted focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="cool_user_123"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            
             <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-muted">
                Email address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-text placeholder-text-muted focus:border-primary focus:ring-primary sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-text-muted">
                Phone Number
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-text placeholder-text-muted focus:border-primary focus:ring-primary sm:text-sm"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-muted">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-text placeholder-text-muted focus:border-primary focus:ring-primary sm:text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {authError && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center text-sm">
          <p className="text-text-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
