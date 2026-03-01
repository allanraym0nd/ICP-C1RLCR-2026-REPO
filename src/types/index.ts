export type NotificationJob =
    | { channel: 'email'; to: string; subject: string; template: string; data: Record<string, any> }
    | { channel: 'sms'; to: string; subject: string; data: Record<string, any> }
    | { channel: 'push'; token: string; title: string; body: string; }