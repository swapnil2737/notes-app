import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar.jsx';
import api from '../lib/axios.js';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore.js';
import { Link } from 'react-router';
import {
    UsersIcon,
    PlusIcon,
    LogInIcon,
    Trash2Icon,
    CopyIcon,
    ChevronRightIcon,
    LoaderIcon,
    XIcon,
    LogOutIcon,
} from 'lucide-react';

const GroupsPage = () => {
    const { user } = useAuthStore();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    // Create group form
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    const [creating, setCreating] = useState(false);

    // Join group form
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [inviteCode, setInviteCode] = useState('');
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const res = await api.get('/groups');
            setGroups(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch groups');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!newGroupName.trim()) {
            toast.error('Group name is required');
            return;
        }
        setCreating(true);
        try {
            const res = await api.post('/groups', {
                name: newGroupName.trim(),
                description: newGroupDesc.trim(),
            });
            setGroups((prev) => [res.data, ...prev]);
            setNewGroupName('');
            setNewGroupDesc('');
            setShowCreateModal(false);
            toast.success('Group created!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create group');
        } finally {
            setCreating(false);
        }
    };

    const handleJoinGroup = async (e) => {
        e.preventDefault();
        if (!inviteCode.trim()) {
            toast.error('Invite code is required');
            return;
        }
        setJoining(true);
        try {
            const res = await api.post('/groups/join', { inviteCode: inviteCode.trim() });
            setGroups((prev) => [res.data, ...prev]);
            setInviteCode('');
            setShowJoinModal(false);
            toast.success(`Joined "${res.data.name}"!`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to join group');
        } finally {
            setJoining(false);
        }
    };

    const handleDeleteGroup = async (groupId, groupName) => {
        if (!window.confirm(`Delete group "${groupName}"? This action cannot be undone.`)) return;
        try {
            await api.delete(`/groups/${groupId}`);
            setGroups((prev) => prev.filter((g) => g._id !== groupId));
            toast.success('Group deleted');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete group');
        }
    };

    const handleLeaveGroup = async (groupId, groupName) => {
        if (!window.confirm(`Leave group "${groupName}"?`)) return;
        try {
            await api.post(`/groups/${groupId}/leave`);
            setGroups((prev) => prev.filter((g) => g._id !== groupId));
            toast.success(`Left "${groupName}"`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to leave group');
        }
    };

    const copyInviteCode = (code) => {
        navigator.clipboard.writeText(code).then(() => toast.success('Invite code copied!'));
    };

    return (
        <div className="min-h-screen bg-base-100">
            <NavBar />
            <div className="max-w-5xl mx-auto p-4 mt-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-base-content">My Groups</h2>
                        <p className="text-base-content/50 text-sm mt-1">Collaborate and share notes with your team</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            id="join-group-btn"
                            onClick={() => setShowJoinModal(true)}
                            className="btn btn-outline btn-sm"
                        >
                            <LogInIcon className="size-4" />
                            Join
                        </button>
                        <button
                            id="create-group-btn"
                            onClick={() => setShowCreateModal(true)}
                            className="btn btn-primary btn-sm"
                        >
                            <PlusIcon className="size-4" />
                            New Group
                        </button>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-16">
                        <LoaderIcon className="animate-spin size-8 text-primary" />
                    </div>
                )}

                {/* Empty state */}
                {!loading && groups.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-5 text-center">
                        <div className="bg-primary/10 rounded-full p-8">
                            <UsersIcon className="size-10 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold">No groups yet</h3>
                        <p className="text-base-content/60 max-w-xs">
                            Create a group to collaborate with others, or join one with an invite code.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowJoinModal(true)} className="btn btn-outline btn-sm">
                                Join a Group
                            </button>
                            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary btn-sm">
                                Create a Group
                            </button>
                        </div>
                    </div>
                )}

                {/* Groups grid */}
                {!loading && groups.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groups.map((group) => {
                            const isOwner = group.owner._id === user?._id;
                            return (
                                <div
                                    key={group._id}
                                    className="card bg-base-200 border-t-4 border-solid border-primary hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="card-body">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="card-title text-lg">{group.name}</h3>
                                                {group.description && (
                                                    <p className="text-base-content/60 text-sm mt-1 line-clamp-2">
                                                        {group.description}
                                                    </p>
                                                )}
                                            </div>
                                            {isOwner && (
                                                <span className="badge badge-primary badge-sm">Owner</span>
                                            )}
                                        </div>

                                        {/* Members */}
                                        <div className="flex items-center gap-2 mt-3">
                                            <UsersIcon className="size-4 text-base-content/50" />
                                            <span className="text-sm text-base-content/60">
                                                {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                                            </span>
                                            <div className="flex -space-x-2 ml-1">
                                                {group.members.slice(0, 4).map((m) => (
                                                    <div
                                                        key={m._id}
                                                        className="avatar placeholder"
                                                        title={m.username}
                                                    >
                                                        <div className="bg-neutral text-neutral-content rounded-full w-6 text-xs">
                                                            <span>{m.username[0].toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {group.members.length > 4 && (
                                                    <div className="avatar placeholder">
                                                        <div className="bg-base-300 text-base-content rounded-full w-6 text-xs">
                                                            <span>+{group.members.length - 4}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Invite code */}
                                        {isOwner && (
                                            <div className="flex items-center gap-2 mt-2 bg-base-300 rounded-lg px-3 py-2">
                                                <span className="text-xs text-base-content/50 flex-1">
                                                    Code: <span className="font-mono font-bold text-base-content">{group.inviteCode}</span>
                                                </span>
                                                <button
                                                    className="btn btn-ghost btn-xs"
                                                    onClick={() => copyInviteCode(group.inviteCode)}
                                                    title="Copy invite code"
                                                >
                                                    <CopyIcon className="size-3" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="card-actions justify-between items-center mt-3">
                                            <Link
                                                to={`/groups/${group._id}`}
                                                className="btn btn-ghost btn-xs gap-1"
                                            >
                                                View Notes
                                                <ChevronRightIcon className="size-3" />
                                            </Link>
                                            {isOwner ? (
                                                <button
                                                    className="btn btn-ghost btn-xs text-error"
                                                    onClick={() => handleDeleteGroup(group._id, group.name)}
                                                >
                                                    <Trash2Icon className="size-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-ghost btn-xs text-warning"
                                                    onClick={() => handleLeaveGroup(group._id, group.name)}
                                                    title="Leave group"
                                                >
                                                    <LogOutIcon className="size-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create Group Modal */}
            {showCreateModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">Create New Group</h3>
                            <button onClick={() => setShowCreateModal(false)} className="btn btn-ghost btn-sm btn-circle">
                                <XIcon className="size-4" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateGroup} className="space-y-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Group Name *</span>
                                </label>
                                <input
                                    id="group-name-input"
                                    type="text"
                                    placeholder="e.g. Study Group"
                                    className="input input-bordered w-full"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <textarea
                                    id="group-desc-input"
                                    placeholder="What is this group about?"
                                    className="textarea textarea-bordered w-full"
                                    value={newGroupDesc}
                                    onChange={(e) => setNewGroupDesc(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="modal-action mt-2">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-ghost">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={creating}>
                                    {creating ? <span className="loading loading-spinner loading-sm" /> : 'Create Group'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowCreateModal(false)} />
                </div>
            )}

            {/* Join Group Modal */}
            {showJoinModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">Join a Group</h3>
                            <button onClick={() => setShowJoinModal(false)} className="btn btn-ghost btn-sm btn-circle">
                                <XIcon className="size-4" />
                            </button>
                        </div>
                        <form onSubmit={handleJoinGroup} className="space-y-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Invite Code</span>
                                </label>
                                <input
                                    id="invite-code-input"
                                    type="text"
                                    placeholder="Enter 8-character invite code"
                                    className="input input-bordered w-full font-mono uppercase"
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                    maxLength={8}
                                />
                            </div>
                            <div className="modal-action mt-2">
                                <button type="button" onClick={() => setShowJoinModal(false)} className="btn btn-ghost">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={joining}>
                                    {joining ? <span className="loading loading-spinner loading-sm" /> : 'Join Group'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowJoinModal(false)} />
                </div>
            )}
        </div>
    );
};

export default GroupsPage;
