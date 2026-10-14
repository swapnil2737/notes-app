import React from 'react';
import { PlusIcon, UsersIcon, LogOutIcon, UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import useAuthStore from '../store/useAuthStore.js';
import toast from 'react-hot-toast';

const NavBar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <header className="bg-base-300 border-b border-base-content/10">
            <div className="mx-auto max-w-6xl p-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-3xl font-bold text-primary font-mono tracking-tighter">
                        Margin
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link to="/groups" className="btn btn-ghost btn-sm">
                            <UsersIcon className="size-4" />
                            <span className="hidden sm:inline">Groups</span>
                        </Link>
                        <Link to="/create" className="btn btn-primary btn-sm">
                            <PlusIcon className="size-4" />
                            <span className="hidden sm:inline">New note</span>
                        </Link>

                        {/* User dropdown */}
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar placeholder"
                                id="user-menu-btn"
                            >
                                <div className="bg-neutral text-neutral-content rounded-full w-9">
                                    <span className="text-sm font-bold">
                                        {user?.username?.[0]?.toUpperCase() || '?'}
                                    </span>
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-200 rounded-box z-50 mt-3 w-52 p-2 shadow-lg border border-base-content/10"
                            >
                                <li className="menu-title px-4 py-2">
                                    <div>
                                        <p className="font-semibold text-sm text-base-content">{user?.username}</p>
                                        <p className="text-xs text-base-content/50 truncate">{user?.email}</p>
                                    </div>
                                </li>
                                <div className="divider my-1" />
                                <li>
                                    <Link to="/groups" className="gap-2">
                                        <UsersIcon className="size-4" />
                                        My Groups
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        id="logout-btn"
                                        onClick={handleLogout}
                                        className="gap-2 text-error hover:bg-error/10"
                                    >
                                        <LogOutIcon className="size-4" />
                                        Sign Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default NavBar;
