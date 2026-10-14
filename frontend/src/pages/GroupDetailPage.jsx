import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import NavBar from '../components/NavBar.jsx';
import api from '../lib/axios.js';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore.js';
import {
    ArrowLeftIcon,
    LoaderIcon,
    UsersIcon,
    Trash2Icon,
    CopyIcon,
    UserXIcon,
    NotebookIcon,
} from 'lucide-react';
import { formatDate } from '../lib/utils.js';

const GroupDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuthStore();
    const [group, setGroup] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('notes');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [groupRes, notesRes] = await Promise.all([
                    api.get(`/groups/${id}`),
                    api.get(`/groups/${id}/notes`),
                ]);
                setGroup(groupRes.data);
                setNotes(notesRes.data);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load group data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleRemoveMember = async (memberId, memberUsername) => {
        if (!window.confirm(`Remove ${memberUsername} from the group?`)) return;
        try {
            const res = await api.delete(`/groups/${id}/members/${memberId}`);
            setGroup(res.data);
            toast.success(`Removed ${memberUsername}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove member');
        }
    };

    const copyInviteCode = () => {
        navigator.clipboard.writeText(group.inviteCode).then(() => toast.success('Invite code copied!'));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100">
                <NavBar />
                <div className="flex items-center justify-center min-h-[70vh]">
                    <LoaderIcon className="animate-spin size-10 text-primary" />
                </div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="min-h-screen bg-base-100">
                <NavBar />
                <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                    <p className="text-base-content/60">Group not found or access denied.</p>
                    <Link to="/groups" className="btn btn-primary btn-sm">Back to Groups</Link>
                </div>
            </div>
        );
    }

    const isOwner = group.owner._id === user?._id;

    return (
        <div className="min-h-screen bg-base-100">
            <NavBar />
            <div className="max-w-5xl mx-auto p-4 mt-6">
                {/* Header */}
                <Link to="/groups" className="btn btn-ghost btn-sm mb-4">
                    <ArrowLeftIcon className="size-4" />
                    Back to Groups
                </Link>

                <div className="card bg-base-200 mb-6">
                    <div className="card-body">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold">{group.name}</h2>
                                    {isOwner && <span className="badge badge-primary badge-sm">Owner</span>}
                                </div>
                                {group.description && (
                                    <p className="text-base-content/60 mt-1">{group.description}</p>
                                )}
                                <p className="text-xs text-base-content/40 mt-2">
                                    Created {formatDate(new Date(group.createdAt))}
                                </p>
                            </div>

                            {isOwner && (
                                <div className="flex items-center gap-2 bg-base-300 rounded-lg px-4 py-2">
                                    <div>
                                        <p className="text-xs text-base-content/50">Invite Code</p>
                                        <p className="font-mono font-bold text-lg tracking-widest text-primary">
                                            {group.inviteCode}
                                        </p>
                                    </div>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={copyInviteCode}
                                        title="Copy invite code"
                                    >
                                        <CopyIcon className="size-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs tabs-boxed mb-6 bg-base-200 p-1">
                    <button
                        className={`tab ${activeTab === 'notes' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('notes')}
                    >
                        <NotebookIcon className="size-4 mr-2" />
                        Shared Notes ({notes.length})
                    </button>
                    <button
                        className={`tab ${activeTab === 'members' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('members')}
                    >
                        <UsersIcon className="size-4 mr-2" />
                        Members ({group.members.length})
                    </button>
                </div>

                {/* Notes Tab */}
                {activeTab === 'notes' && (
                    <div>
                        {notes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                                <div className="bg-primary/10 rounded-full p-6">
                                    <NotebookIcon className="size-8 text-primary" />
                                </div>
                                <p className="text-base-content/60">No notes shared in this group yet.</p>
                                <p className="text-base-content/40 text-sm">
                                    Open any of your notes and share it to this group.
                                </p>
                                <Link to="/" className="btn btn-primary btn-sm">Go to My Notes</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {notes.map((note) => (
                                    <Link
                                        key={note._id}
                                        to={`/note/${note._id}`}
                                        className="card bg-base-200 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#42AA00]"
                                    >
                                        <div className="card-body">
                                            <h3 className="card-title text-base-content">{note.title}</h3>
                                            <p className="text-base-content/70 line-clamp-3">{note.description}</p>
                                            <div className="card-actions justify-between items-center mt-2">
                                                <span className="text-xs text-base-content/50">
                                                    by {note.owner.username}
                                                </span>
                                                <span className="text-xs text-base-content/40">
                                                    {formatDate(new Date(note.createdAt))}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Members Tab */}
                {activeTab === 'members' && (
                    <div className="space-y-2">
                        {group.members.map((member) => {
                            const memberIsOwner = member._id === group.owner._id;
                            const isCurrentUser = member._id === user?._id;
                            return (
                                <div
                                    key={member._id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="avatar placeholder">
                                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                <span className="text-sm font-bold">
                                                    {member.username[0].toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">
                                                {member.username}
                                                {isCurrentUser && (
                                                    <span className="text-base-content/40 text-xs ml-2">(you)</span>
                                                )}
                                            </p>
                                            <p className="text-xs text-base-content/50">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {memberIsOwner && (
                                            <span className="badge badge-primary badge-xs">Owner</span>
                                        )}
                                        {isOwner && !memberIsOwner && (
                                            <button
                                                className="btn btn-ghost btn-xs text-error"
                                                onClick={() => handleRemoveMember(member._id, member.username)}
                                                title="Remove member"
                                            >
                                                <UserXIcon className="size-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupDetailPage;
