import Note from "../models/Note.js";

export async function getAllNotes(req, res){
    //controller for getting all the notes and sorting then to latest.
    try{
        const notes = await Note.find().sort({createdAt: -1});
        res.status(200).json(notes)
    }
    catch(error){
        console.error("Error in getAllNotes controller", error);
        res.status(500).json({message:"Internal Server Error"})
    }
}
export async function getNote(req, res){
    //controller for getting only one note.
    try{
        const note = await Note.findById(req.params.id);
        if(!note){
            return res.status(404).json({message:"Not Found"})
        }

        res.status(200).json(note)
    }
    catch(error){
        console.error("Error in getAllNotes controller", error);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export async function createNote(req, res){
    //create a note
    try{
        const {title, description} = req.body;
        const newNote = new Note({title, description});
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    }catch(error){
        console.error("Error in createNote controller", error);
        res.status(500).json({message:"Internal Server Error"})
    }
}
export async function updateNote(req, res){
    //update existing note.
    try{
        const {title, description} = req.body;
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!updatedNote){ return res.status(404).json({message:"Not Found"})}
        else{res.status(200).json(updatedNote);}
    }catch(error){
        console.error("Error in updateNote controller", error);
        res.status(500).json({message:"Internal Server Error"})
    }
}
export async function deleteNote(req, res){
    //controller for deleting a note.
    try{
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if(!deletedNote){ return res.status(404).json({message:"Not Found"})}
        res.status(200).json(deletedNote);
    }catch(error){
        console.error("Error in deleteNote controller", error);
        res.status(500).json({message:"Internal Server Error"})
    }

}