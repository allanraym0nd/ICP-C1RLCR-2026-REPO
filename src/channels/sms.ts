import twilio from 'twilio'
import { config } from '../config/index.js';

const client = twilio(config.twilio.accountSid, config.twilio.authToken)

export const sendSMS = async (to: string, body: string): Promise<void> => {
    await client.messages.create({
        to,
        from: config.twilio.from,
        body
    }
    )
}