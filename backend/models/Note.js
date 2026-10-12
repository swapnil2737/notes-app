import mongoose from 'mongoose';

//creating schema for note

const noteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

},{timestamps: true})


const Note = mongoose.model('Note', noteSchema);

export default Note;