import express from 'express';
const router = express.Router();
import {getAllNotes, createNote,deleteNote,updateNote,getNote} from '../controllers/notescontroller.js';


router.get('/', getAllNotes);
router.get('/:id',getNote);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id',deleteNote);


export default router;