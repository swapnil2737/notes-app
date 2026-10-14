import Note from "../models/Note.js";
import Group from "../models/Group.js";

export async function getAllNotes(req, res) {
    try {
        // Get user's own notes
        const ownNotes = await Note.find({ owner: req.user._id })
            .populate('owner', 'username email')
            .populate('sharedWithGroups', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(ownNotes);
    } catch (error) {
        console.error("Error in getAllNotes controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getNote(req, res) {
    try {
        const note = await Note.findById(req.params.id)
            .populate('owner', 'username email')
            .populate('sharedWithGroups', 'name');

        if (!note) return res.status(404).json({ message: "Not Found" });

        // Check if user has access: owns it, shared directly, or member of a shared group
        const isOwner = note.owner._id.toString() === req.user._id.toString();
        const isSharedUser = note.sharedWithUsers?.some(
            (u) => u.toString() === req.user._id.toString()
        );

        if (!isOwner && !isSharedUser) {
            // Check group membership
            const userGroups = await Group.find({ members: req.user._id });
            const userGroupIds = userGroups.map((g) => g._id.toString());
            const hasGroupAccess = note.sharedWithGroups.some((g) =>
                userGroupIds.includes(g._id.toString())
            );
            if (!hasGroupAccess) {
                return res.status(403).json({ message: "Access denied" });
            }
        }

        res.status(200).json(note);
    } catch (error) {
        console.error("Error in getNote controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function createNote(req, res) {
    try {
        const { title, description } = req.body;
        const newNote = new Note({ title, description, owner: req.user._id });
        const savedNote = await newNote.save();
        const populated = await savedNote.populate('owner', 'username email');
        res.status(201).json(populated);
    } catch (error) {
        console.error("Error in createNote controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateNote(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Not Found" });

        if (note.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only edit your own notes" });
        }

        const { title, description } = req.body;
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { title, description },
            { new: true }
        )
            .populate('owner', 'username email')
            .populate('sharedWithGroups', 'name');

        res.status(200).json(updatedNote);
    } catch (error) {
        console.error("Error in updateNote controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteNote(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Not Found" });

        if (note.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only delete your own notes" });
        }

        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedNote);
    } catch (error) {
        console.error("Error in deleteNote controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Share a note with a group
export async function shareNoteWithGroup(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Not Found" });

        if (note.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only share your own notes" });
        }

        const { groupId } = req.body;
        if (!groupId) return res.status(400).json({ message: "groupId is required" });

        // Verify the user is in that group
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        const isMember = group.members.some(
            (m) => m.toString() === req.user._id.toString()
        );
        if (!isMember && group.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not a member of this group" });
        }

        if (!note.sharedWithGroups.includes(groupId)) {
            note.sharedWithGroups.push(groupId);
            await note.save();
        }

        const updated = await Note.findById(note._id)
            .populate('owner', 'username email')
            .populate('sharedWithGroups', 'name');

        res.status(200).json(updated);
    } catch (error) {
        console.error("Error in shareNoteWithGroup:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Unshare a note from a group
export async function unshareNoteFromGroup(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Not Found" });

        if (note.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only manage your own notes" });
        }

        const { groupId } = req.params;
        note.sharedWithGroups = note.sharedWithGroups.filter(
            (g) => g.toString() !== groupId
        );
        await note.save();

        const updated = await Note.findById(note._id)
            .populate('owner', 'username email')
            .populate('sharedWithGroups', 'name');

        res.status(200).json(updated);
    } catch (error) {
        console.error("Error in unshareNoteFromGroup:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}