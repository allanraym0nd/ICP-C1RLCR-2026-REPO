import { Worker, Job } from "bullmq";
import { config } from '../config/index.js'
import { sendMail } from "../channels/email.js";
import { sendSMS } from "../channels/sms.js";
import { sendPush } from "../channels/push.js";
import { renderTemplate } from "../templates/engine.js";
import { logNotification } from "../db/logger.js";
import { type EmailJob, type SMSJob, type PushJob } from '../types/index.js';
import { type NotificationJob } from "../types/index.js";

const connection = {
    host: config.redis.host,
    port: config.redis.port
}

const worker = new Worker<NotificationJob>('notifications',
    async (job: Job<NotificationJob>) => {
        const { channel } = job.data
        let status = 'sent'

        try {
            if (channel === 'email') {
                const { to, subject, template, data } = job.data as EmailJob;
                const html = renderTemplate('email', template, data)
                await sendMail(to, subject, html)
            }
            else if (channel === 'sms') {
                const { to, template, data } = job.data as SMSJob
                const body = renderTemplate('sms', template, data)
                await sendSMS(to, body)
            }
            else if (channel === 'push') {
                const { token, title, body } = job.data as PushJob;
                await sendPush(token, title, body);

            }

            console.log(`processing job [${job.id}] on channel: ${job.data.channel}`)
        }
        catch (err) {
            status = "failed"
            throw err;

        } finally {
            await logNotification(channel, job.data, status)
        }
    },
    { connection, concurrency: 5 }
)

worker.on('completed', (job) => console.log(`Job ${job.id} completed`))
worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed: ${err.message}`))

console.log('Worker started, waiting for jobs')