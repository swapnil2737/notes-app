import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon, ShareIcon, XIcon, UsersIcon } from "lucide-react";
import useAuthStore from "../store/useAuthStore.js";

const NotePage = () => {
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [myGroups, setMyGroups] = useState([]);
    const [showShareModal, setShowShareModal] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await api.get(`/notes/${id}`);
                setNote(res.data);
            } catch (error) {
                console.log("Error in fetching note", error);
                toast.error("Failed to fetch the note");
            } finally {
                setLoading(false);
            }
        };
        fetchNote();
    }, [id]);

    useEffect(() => {
        if (showShareModal) {
            api.get('/groups').then((res) => setMyGroups(res.data)).catch(() => {});
        }
    }, [showShareModal]);

    const isOwner = note?.owner?._id === user?._id || note?.owner === user?._id;

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;
        try {
            await api.delete(`/notes/${id}`);
            toast.success("Note deleted");
            navigate("/");
        } catch (error) {
            console.log("Error deleting the note:", error);
            toast.error(error.response?.data?.message || "Failed to delete note");
        }
    };

    const handleSave = async () => {
        if (!note.title.trim() || !note.description.trim()) {
            toast.error("Please add a title or content");
            return;
        }
        setSaving(true);
        try {
            const res = await api.put(`/notes/${id}`, note);
            setNote(res.data);
            toast.success("Note updated successfully");
            navigate("/");
        } catch (error) {
            console.log("Error saving the note:", error);
            toast.error(error.response?.data?.message || "Failed to update note");
        } finally {
            setSaving(false);
        }
    };

    const handleShareGroup = async (groupId) => {
        try {
            const res = await api.post(`/notes/${id}/share-group`, { groupId });
            setNote(res.data);
            toast.success("Note shared with group!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to share note");
        }
    };

    const handleUnshareGroup = async (groupId) => {
        try {
            const res = await api.delete(`/notes/${id}/unshare-group/${groupId}`);
            setNote(res.data);
            toast.success("Removed from group");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to unshare note");
        }
    };

    const isSharedWithGroup = (groupId) => {
        return note?.sharedWithGroups?.some(
            (g) => (g._id || g) === groupId
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <LoaderIcon className="animate-spin size-10" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <Link to="/" className="btn btn-ghost">
                            <ArrowLeftIcon className="h-5 w-5" />
                            Back to Notes
                        </Link>
                        <div className="flex gap-2">
                            {isOwner && (
                                <button
                                    onClick={() => setShowShareModal(true)}
                                    className="btn btn-outline btn-sm gap-2"
                                    id="share-note-btn"
                                >
                                    <ShareIcon className="h-4 w-4" />
                                    Share
                                </button>
                            )}
                            {isOwner && (
                                <button onClick={handleDelete} className="btn btn-error btn-outline btn-sm">
                                    <Trash2Icon className="h-4 w-4" />
                                    Delete Note
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Shared with groups badge */}
                    {note?.sharedWithGroups?.length > 0 && (
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                            <UsersIcon className="size-4 text-base-content/50" />
                            <span className="text-xs text-base-content/50">Shared with:</span>
                            {note.sharedWithGroups.map((g) => (
                                <span key={g._id || g} className="badge badge-outline badge-sm">
                                    {g.name || g}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="card bg-base-100">
                        <div className="card-body">
                            {/* Owned by info */}
                            {note?.owner?.username && !isOwner && (
                                <div className="text-xs text-base-content/40 mb-2">
                                    Created by <span className="font-semibold">{note.owner.username}</span>
                                </div>
                            )}

                            <div className="flex flex-col mb-4">
                                <label className="label mb-2">
                                    <span className="label-text">Title</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Note title"
                                    className="input input-bordered w-full"
                                    value={note.title}
                                    onChange={(e) => setNote({ ...note, title: e.target.value })}
                                    disabled={!isOwner}
                                />
                            </div>

                            <div className="flex flex-col mb-4">
                                <label className="label mb-2">
                                    <span className="label-text">Content</span>
                                </label>
                                <textarea
                                    placeholder="Write your note here..."
                                    className="textarea textarea-bordered h-48 w-full"
                                    value={note.description}
                                    onChange={(e) => setNote({ ...note, description: e.target.value })}
                                    disabled={!isOwner}
                                />
                            </div>

                            {isOwner && (
                                <div className="card-actions justify-end">
                                    <button
                                        className="btn btn-primary"
                                        disabled={saving}
                                        onClick={handleSave}
                                    >
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <ShareIcon className="size-5" />
                                Share Note with Groups
                            </h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="btn btn-ghost btn-sm btn-circle"
                            >
                                <XIcon className="size-4" />
                            </button>
                        </div>

                        {myGroups.length === 0 ? (
                            <div className="text-center py-8">
                                <UsersIcon className="size-8 text-base-content/30 mx-auto mb-3" />
                                <p className="text-base-content/60 text-sm">You're not in any groups yet.</p>
                                <Link
                                    to="/groups"
                                    className="btn btn-primary btn-sm mt-3"
                                    onClick={() => setShowShareModal(false)}
                                >
                                    Create or Join a Group
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {myGroups.map((group) => {
                                    const shared = isSharedWithGroup(group._id);
                                    return (
                                        <div
                                            key={group._id}
                                            className="flex items-center justify-between p-3 rounded-lg bg-base-200"
                                        >
                                            <div>
                                                <p className="font-medium text-sm">{group.name}</p>
                                                <p className="text-xs text-base-content/50">
                                                    {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <button
                                                className={`btn btn-sm ${shared ? 'btn-error btn-outline' : 'btn-primary'}`}
                                                onClick={() =>
                                                    shared
                                                        ? handleUnshareGroup(group._id)
                                                        : handleShareGroup(group._id)
                                                }
                                            >
                                                {shared ? 'Unshare' : 'Share'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="modal-action">
                            <button onClick={() => setShowShareModal(false)} className="btn btn-ghost">
                                Close
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowShareModal(false)} />
                </div>
            )}
        </div>
    );
};

export default NotePage;
