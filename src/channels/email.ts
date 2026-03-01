import sgMail from '@sendgrid/mail'
import { config } from '../config/index.js';

sgMail.setApiKey(config.sendgrid.apiKey)
export const sendMail = async (to: string, subject: string, html: string): Promise<void> => {
    await sgMail.send({
        to,
        from: config.sendgrid.from,
        subject,
        html
    })

}