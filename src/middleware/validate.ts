import { z } from "zod";
import type { Request, Response, NextFunction } from 'express'


const EmailJobSchema = z.object({
    channel: z.literal('email'),
    to: z.string().email('Invalid Email Address'),
    subject: z.string().min(1, 'Subject is required'),
    template: z.string().min(1, 'Template name is required'),
    data: z.record(z.string(), z.any()),

})
const SMSJobSchema = z.object({
    channel: z.literal('sms'),
    to: z.string().min(10, 'Invalid phone number'),
    template: z.string().min(1, 'Template name is required'),
    data: z.record(z.string(), z.any()),
});
const PushJobSchema = z.object({
    channel: z.literal('push'),
    token: z.string().min(1, 'Device token is required'),
    title: z.string().min(1, 'Title is required'),
    body: z.string().min(1, 'Body is required'),
});

const notificationJobSchema = z.discriminatedUnion('channel', [
    EmailJobSchema,
    SMSJobSchema,
    PushJobSchema
])

export const validateNotification = (req: Request, res: Response, next: NextFunction) => {
    const result = notificationJobSchema.safeParse(req.body)
    if (!result.success) {
        res.status(400).json({
            message: 'Validation Failed',
            errors: result.error.flatten().fieldErrors
        })
        return;
    }
    req.body = result.data
    next()
}

export default validateNotification;