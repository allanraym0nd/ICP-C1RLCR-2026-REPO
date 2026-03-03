import { jest } from '@jest/globals';
import { validateNotification } from '../middleware/validate.js';
import type { Request, Response, NextFunction } from 'express';


const mockRes = () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    } as unknown as Response;
    return res;
};

const mockNext: NextFunction = jest.fn() as unknown as NextFunction

describe("Validation Middleware", () => {
    it("Should pass a valid email job", () => {
        const req = {
            body: {
                channel: 'email',
                to: 'test@example.com',
                subject: 'Hello',
                template: 'welcome',
                data: { name: "Alice", link: "https://example.com" }
            }
        } as Request
        validateNotification(req, mockRes(), mockNext)
        expect(mockNext).toHaveBeenCalled()

    })

    it('should reject email job with invalid email', () => {
        const req = {
            body: {
                channel: 'email',
                to: 'notanemail',
                subject: 'Hello',
                template: 'welcome',
                data: { name: 'Alice', link: 'https://example.com' },
            },
        } as Request;

        const res = mockRes();
        validateNotification(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("Should reject sms job with not template", () => {
        const req = {
            body: {
                channel: 'sms',
                to: '+254713559983',
                data: { code: '123456', expiry: '5' }
            }
        } as Request

        const res = mockRes();
        validateNotification(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
    })

    it("Should reject body with unknown channel", () => {
        const req = {
            body: {
                channel: 'whatsapp',
                to: '+254713559983',
            }
        } as Request

        const res = mockRes();
        validateNotification(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);

    })

})