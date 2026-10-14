import mongoose from 'mongoose';

const noteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Groups this note is shared with
    sharedWithGroups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    }],
    // Allow individual sharing too
    sharedWithUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);
export default Note;