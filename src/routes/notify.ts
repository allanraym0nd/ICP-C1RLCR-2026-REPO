import { Router } from "express";
import { sendNotification, getNotification, getNotifications } from "../controllers/notification.controller.js";
import validateNotification from "../middleware/validate.js";

const router = Router();

router.post('/', validateNotification, sendNotification)
router.get('/', getNotification)
router.get('/:id', getNotifications)

export default router;