import { Router } from 'express';
import { getAllMessages, sendMessage } from '../controllers/message.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = Router();

router.post('/send', isAuth, sendMessage);
router.get('/get/:senderId/:receiverId', isAuth, getAllMessages);

export default router;
