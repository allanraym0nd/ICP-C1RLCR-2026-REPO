import { Worker } from "bullmq";
import { config } from '../config/index.js'

const connection = {
    host: config.redis.host,
    port: config.redis.port
}

const worker = new Worker('notifications',
    async (job) => {
        console.log(`processing job [${job.id}] on channel: ${job.data.channel}`)
    },
    { connection, concurrency: 5 }
)

worker.on('completed', (job) => console.log(`Job ${job.id} completed`))
worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed: ${err.message}`))

console.log('Worker started, waiting for jobs')