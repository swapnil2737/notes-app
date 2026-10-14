import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import { UserPlusIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim() || !email.trim() || !password.trim()) {
            toast.error('All fields are required');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        const result = await register(username, email, password);
        if (result.success) {
            toast.success('Account created! Welcome to Margin 🎉');
            navigate('/');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-primary font-mono tracking-tighter mb-2">Margin</h1>
                    <p className="text-base-content/60 text-sm">Your collaborative note-taking space</p>
                </div>

                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-1">Create Account</h2>
                        <p className="text-base-content/50 text-sm mb-5">Join Margin and start taking notes.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <label className="label">
                                    <span className="label-text">Username</span>
                                </label>
                                <input
                                    id="register-username"
                                    type="text"
                                    placeholder="cooluser123"
                                    className="input input-bordered w-full"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="username"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    id="register-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="input input-bordered w-full"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                    <span className="label-text-alt text-base-content/40">Min. 6 characters</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="register-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="input input-bordered w-full pr-12"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                id="register-submit"
                                type="submit"
                                className="btn btn-primary w-full mt-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="loading loading-spinner loading-sm" />
                                ) : (
                                    <>
                                        <UserPlusIcon className="size-4" />
                                        Create Account
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="divider text-base-content/40 text-xs">Already have an account?</div>

                        <Link to="/login" className="btn btn-outline btn-sm w-full">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
