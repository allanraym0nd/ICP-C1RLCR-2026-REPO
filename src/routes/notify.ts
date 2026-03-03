import { Router } from 'express';
import {
    sendNotification,
    getNotification,
    getNotifications,
} from '../controllers/notification.controller.js';
import { validateNotification } from '../middleware/validate.js';

const router = Router();

/**
 * @swagger
 * /notify:
 *   post:
 *     summary: Queue a notification
 *     description: Accepts an email, SMS, or push notification job and adds it to the queue for async delivery.
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/EmailJob'
 *               - $ref: '#/components/schemas/SMSJob'
 *               - $ref: '#/components/schemas/PushJob'
 *     responses:
 *       202:
 *         description: Notification queued successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification queued
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.post('/', validateNotification, sendNotification);

/**
 * @swagger
 * /notify:
 *   get:
 *     summary: Get all notification logs
 *     description: Returns a list of all notification logs, with optional filters.
 *     tags: [Notifications]
 *     parameters:
 *       - in: query
 *         name: channel
 *         schema:
 *           type: string
 *           enum: [email, sms, push]
 *         description: Filter by channel
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [sent, failed]
 *         description: Filter by delivery status
 *       - in: query
 *         name: recipient
 *         schema:
 *           type: string
 *         description: Filter by recipient
 *     responses:
 *       200:
 *         description: List of notification logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NotificationLog'
 *       400:
 *         description: Invalid query parameters
 */
router.get('/', getNotifications);

/**
 * @swagger
 * /notify/{id}:
 *   get:
 *     summary: Get a notification log by ID
 *     description: Returns a single notification log by its ID.
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification log ID
 *     responses:
 *       200:
 *         description: Notification log found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationLog'
 *       400:
 *         description: ID must be a number
 *       404:
 *         description: Notification not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 */
router.get('/:id', getNotification);

export default router;