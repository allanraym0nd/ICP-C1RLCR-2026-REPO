import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import swaggerUi from 'swagger-ui-express';
import { config } from './config/index.js'
import { initDB } from './db/logger.js'
import notifyRouter from './routes/notify.js'
import { errorHandler } from './middleware/errorHandler.js'
import { swaggerSpec } from './docs/swagger.js';

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'notification-dispatcher' })
})
app.use('/notify', notifyRouter)
app.use(errorHandler)

initDB().then(() => {
    app.listen(config.port, () => {
        console.log(`notification-dispatcher running on port ${config.port}`)
        console.log(`API docs available at http://localhost:${config.port}/api-docs`);

    })
})


export default app;

