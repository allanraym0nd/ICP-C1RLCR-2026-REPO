import admin from 'firebase-admin'
import { config } from '../config/index.js';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(config.firebase.credentialPath)
    })
}
export const sendPush = async (token: string, title: string, body: string): Promise<void> => {

    await admin.messaging().send({
        token,
        notification: { title, body }
    })

}


