import { type NotificationJob } from "../types/index.js";
import { Queue } from "bullmq";
import { config } from "../config/index.js"

const connection = {
    host: config.redis.host,
    port: config.redis.port
}

export const notificationQueue = new Queue('notifications', { connection })

export const enqueueNotification = async (job: NotificationJob) => {
    await notificationQueue.add(job.channel, job, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
        removeOnFail: true
    })
}