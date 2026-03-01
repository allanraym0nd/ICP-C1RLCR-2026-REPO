import { type Request, type Response } from "express";
import { enqueueNotification } from "../queue/producer.js";
import { type NotificationJob } from "../types/index.js";
import pool from "../db/index.js";

export const sendNotification = async (req: Request, res: Response): Promise<void> => {
    const job = req.body as NotificationJob;
    await enqueueNotification(job);
    res.status(202).json({ message: 'Notification queued' })

}

export const getNotification = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await pool.query(
        `SELECT * FROM notification_logs WHERE id =$1`, [id]
    )
    if (result.rows.length == 0) {
        res.status(404).json({ message: 'Notification not found' });
        return;
    }
    res.status(200).json(result.rows[0])
}

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
    const { channel, status, recipient } = req.query

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

}