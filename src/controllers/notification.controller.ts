import { type NextFunction, type Request, type Response } from "express";
import { enqueueNotification } from "../queue/producer.js";
import { type NotificationJob } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";
import pool from "../db/index.js";

export const sendNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        const job = req.body as NotificationJob;
        await enqueueNotification(job);
        res.status(202).json({ message: 'Notification queued' })
    }
    catch (err) {
        next(err)
    }


}

export const getNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        if (!isNaN(Number(id))) {
            throw new AppError(400, "ID must be a number")

        }
        const result = await pool.query(
            `SELECT * FROM notification_logs WHERE id =$1`, [id]
        )
        if (result.rows.length === 0) {
            throw new AppError(404, `Notification with id ${id} not found`);
            return;
        }
        res.status(200).json(result.rows[0])

    }
    catch (err) {
        next(err)
    }

}

export const getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { channel, status, recipient } = req.query

        const validChannels = ['email', 'sms', 'push']
        const validStatuses = ['sent', 'failed']

        if (channel && !validChannels.includes(channel as string)) {
            throw new AppError(400, `Must be one of: ${validChannels.join(', ')}`)
        }
        if (status && !validStatuses.includes(status as string)) {
            throw new AppError(400, `Must be one of: ${validStatuses.join(', ')}`)
        }

        const conditions: string[] = []
        const values: any[] = []
        let i = 1;
        if (channel) {
            conditions.push(`channel = $${i++}`)
            values.push(channel)
        }
        if (status) {
            conditions.push(`status = $${i++}`)
            values.push(status)
        }
        if (recipient) {
            conditions.push(`recipient = $${i++}`)
            values.push(recipient)
        }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const result = await pool.query(
            `SELECT * FROM notifications_logs ${where} ORDER BY created_at`, values
        );

        res.status(200).json(result.rows)

    } catch (err) {
        next(err)
    }


}
