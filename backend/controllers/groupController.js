import Group from '../models/Group.js';
import User from '../models/User.js';
import Note from '../models/Note.js';

// Create a new group
export async function createGroup(req, res) {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ message: 'Group name is required' });

        const group = new Group({
            name,
            description,
            owner: req.user._id,
            members: [req.user._id],
        });
        await group.save();

        const populated = await group.populate('members', 'username email');
        res.status(201).json(populated);
    } catch (error) {
        console.error('Error in createGroup:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Get all groups the user is a member of or owns
export async function getMyGroups(req, res) {
    try {
        const groups = await Group.find({
            $or: [{ owner: req.user._id }, { members: req.user._id }],
        })
            .populate('owner', 'username email')
            .populate('members', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json(groups);
    } catch (error) {
        console.error('Error in getMyGroups:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Get a single group
export async function getGroup(req, res) {
    try {
        const group = await Group.findById(req.params.id)
            .populate('owner', 'username email')
            .populate('members', 'username email');

        if (!group) return res.status(404).json({ message: 'Group not found' });

        const isMember = group.members.some(
            (m) => m._id.toString() === req.user._id.toString()
        );
        if (!isMember && group.owner._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json(group);
    } catch (error) {
        console.error('Error in getGroup:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Join a group via invite code
export async function joinGroup(req, res) {
    try {
        const { inviteCode } = req.body;
        if (!inviteCode) return res.status(400).json({ message: 'Invite code is required' });

        const group = await Group.findOne({ inviteCode: inviteCode.toUpperCase() });
        if (!group) return res.status(404).json({ message: 'Invalid invite code' });

        const alreadyMember = group.members.some(
            (m) => m.toString() === req.user._id.toString()
        );
        if (alreadyMember) {
            return res.status(400).json({ message: 'You are already a member of this group' });
        }

        group.members.push(req.user._id);
        await group.save();

        const populated = await Group.findById(group._id)
            .populate('owner', 'username email')
            .populate('members', 'username email');

        res.status(200).json(populated);
    } catch (error) {
        console.error('Error in joinGroup:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Leave a group
export async function leaveGroup(req, res) {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        if (group.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Owner cannot leave the group. Delete it instead.' });
        }

        group.members = group.members.filter(
            (m) => m.toString() !== req.user._id.toString()
        );
        await group.save();

        res.status(200).json({ message: 'Left the group successfully' });
    } catch (error) {
        console.error('Error in leaveGroup:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Delete a group (owner only)
export async function deleteGroup(req, res) {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        if (group.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only the owner can delete this group' });
        }

        // Remove this group from all notes that shared with it
        await Note.updateMany(
            { sharedWithGroups: group._id },
            { $pull: { sharedWithGroups: group._id } }
        );

        await Group.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        console.error('Error in deleteGroup:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Get notes shared in a group
export async function getGroupNotes(req, res) {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        const isMember = group.members.some(
            (m) => m.toString() === req.user._id.toString()
        );
        if (!isMember && group.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const notes = await Note.find({ sharedWithGroups: group._id })
            .populate('owner', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json(notes);
    } catch (error) {
        console.error('Error in getGroupNotes:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Remove a member (owner only)
export async function removeMember(req, res) {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        if (group.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only the owner can remove members' });
        }

        const { memberId } = req.params;
        if (group.owner.toString() === memberId) {
            return res.status(400).json({ message: 'Cannot remove the owner' });
        }

        group.members = group.members.filter((m) => m.toString() !== memberId);
        await group.save();

        const populated = await Group.findById(group._id)
            .populate('owner', 'username email')
            .populate('members', 'username email');

        res.status(200).json(populated);
    } catch (error) {
        console.error('Error in removeMember:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
