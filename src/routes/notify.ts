import { Router } from "express";
import { sendNotification, getNotification, getNotifications } from "../controllers/notification.controller.js";

const router = Router();

router.post('/', sendNotification)
router.get('/', getNotification)
router.get('/:id', getNotifications)

export default router;