import mongoose from 'mongoose';

const groupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    inviteCode: {
        type: String,
        unique: true,
    },
}, { timestamps: true });

// Generate a unique invite code before saving
groupSchema.pre('save', function () {
    if (!this.inviteCode) {
        this.inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    }
});

const Group = mongoose.model('Group', groupSchema);
export default Group;
