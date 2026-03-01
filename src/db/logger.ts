import pool from "./index.js";

export const initDB = async (): Promise<void> => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS notification_logs (
        id  SERIAL PRIMARY KEY,
        channel VARCHAR(20) NOT NULL,
        recipient TEXT NOT NULL,
        status VARCHAR(20) NOT NULL,
        payload JSONB NOT NULL,
        created_at TIMESTAMPZ DEFAULT_NOW()
        )
     `)

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_logs_channel ON notification_logs (channel);
        CREATE INDEX IF NOT EXISTS idx_logs_recipient ON notification_logs (recipient);
        CREATE INDEX IF NOT EXISTS idx_logs_status ON notification_logs (status);
        CREATE INDEX IF NOT EXISTS idx_logs_created_at ON notification_logs (created_at DESC);
        `)
    console.log('DB initialized');
}
export const logNotification = async (channel: string, status: string, payload: Record<string, any>): Promise<void> => {

    const recipient = payload.to || payload.token || 'unknown'
    await pool.query(`
        INSERT INTO notification_logs (channel, recipient, status, payload)
        VALUES($1, $2, $3, $4)
        `,
        [channel, recipient, status, JSON.stringify(payload)]
    )

}

