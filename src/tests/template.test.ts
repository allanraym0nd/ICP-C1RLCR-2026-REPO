import { renderTemplate } from '../templates/engine.js';

describe('Template Engine', () => {
    it("Should render email template with correct data", () => {
        const result = renderTemplate('email', 'welcome', {
            name: "Alice",
            link: 'https://example.com/verify',
        })
        expect(result).toContain('Alice')
        expect(result).toContain('https://example.com/verify')
    })

    it("Should render sms with correct data", () => {
        const result = renderTemplate('sms', 'otp', {
            code: '123456',
            expiry: '5'
        })
        expect(result).toContain('123456')
        expect(result).toContain('5')
    })

    it("Should throw if template doesnt exist", () => {
        expect(() => renderTemplate('email', 'nonexistsent', {})).toThrow()
    })
})