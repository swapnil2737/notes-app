import express from 'express';
const router = express.Router();
import {
    createGroup,
    getMyGroups,
    getGroup,
    joinGroup,
    leaveGroup,
    deleteGroup,
    getGroupNotes,
    removeMember,
} from '../controllers/groupController.js';
import { protect } from '../middleware/authMiddleware.js';

router.use(protect);

router.get('/', getMyGroups);
router.post('/', createGroup);
router.post('/join', joinGroup);
router.get('/:id', getGroup);
router.delete('/:id', deleteGroup);
router.post('/:id/leave', leaveGroup);
router.get('/:id/notes', getGroupNotes);
router.delete('/:id/members/:memberId', removeMember);

export default router;
