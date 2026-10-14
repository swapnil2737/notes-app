import express from 'express';
const router = express.Router();
import {
    getAllNotes,
    createNote,
    deleteNote,
    updateNote,
    getNote,
    shareNoteWithGroup,
    unshareNoteFromGroup,
} from '../controllers/notescontroller.js';
import { protect } from '../middleware/authMiddleware.js';

router.use(protect);

router.get('/', getAllNotes);
router.get('/:id', getNote);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);
router.post('/:id/share-group', shareNoteWithGroup);
router.delete('/:id/unshare-group/:groupId', unshareNoteFromGroup);

export default router;