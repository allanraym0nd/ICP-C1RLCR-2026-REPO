import express from 'express'
import { config } from './config/index.js'

const app = express()


app.use(express.json())

app.get('health', (req, res) => {
    res.json({ status: 'ok', service: 'notification-dispatcher' })
})

app.listen(config.port, () => {
    console.log(`notification-dispatcher running on port ${config.port}`)

})

export default app;

