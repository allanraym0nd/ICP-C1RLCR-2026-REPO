import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Notification Dispatcher API',
            version: '1.0.0',
            description: 'A notification service supporting email, SMS, and push notification channels with templating and queue-based delivery.',
        },
        servers: [{ url: 'http://localhost:3000' }],
        components: {
            schemas: {
                EmailJob: {
                    type: 'object',
                    required: ['channel', 'to', 'subject', 'template', 'data'],
                    properties: {
                        channel: { type: 'string', enum: ['email'], example: 'email' },
                        to: { type: 'string', format: 'email', example: 'user@example.com' },
                        subject: { type: 'string', example: 'Welcome!' },
                        template: { type: 'string', example: 'welcome' },
                        data: { type: 'object', example: { name: 'Alice', link: 'https://example.com/verify' } },
                    },
                },
                SMSJob: {
                    type: 'object',
                    required: ['channel', 'to', 'template', 'data'],
                    properties: {
                        channel: { type: 'string', enum: ['sms'], example: 'sms' },
                        to: { type: 'string', example: '+254713559983' },
                        template: { type: 'string', example: 'otp' },
                        data: { type: 'object', example: { code: '123456', expiry: '5' } },
                    },
                },
                PushJob: {
                    type: 'object',
                    required: ['channel', 'token', 'title', 'body'],
                    properties: {
                        channel: { type: 'string', enum: ['push'], example: 'push' },
                        token: { type: 'string', example: 'fp5RDGeMdAK...' },
                        title: { type: 'string', example: 'New Notification' },
                        body: { type: 'string', example: 'You have a new message' },
                    },
                },
                NotificationLog: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        channel: { type: 'string', example: 'email' },
                        recipient: { type: 'string', example: 'user@example.com' },
                        status: { type: 'string', example: 'sent' },
                        payload: { type: 'object' },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
                ValidationError: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Validation failed' },
                        errors: { type: 'object' },
                    },
                },
                NotFoundError: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Notification with id 1 not found' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);