import { Resend } from 'resend';
import { config } from '../config/index.js';

const resend = new Resend(config.resend.apiKey);

export const sendMail = async (to: string, subject: string, html: string): Promise<void> => {
    await resend.emails.send({
        from: config.resend.from,
        to,
        subject,
        html,
    });
};