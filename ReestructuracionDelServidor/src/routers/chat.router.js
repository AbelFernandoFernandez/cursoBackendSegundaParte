import { Router } from 'express';
import { getMessagesController } from '../controllers/chat.controller.js';

const router = Router();

router.get('/', getMessagesController)

export default router