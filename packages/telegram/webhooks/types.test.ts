import { verifyTelegramWebhookSignature } from './types';

describe('verifyTelegramWebhookSignature', () => {
    const request = {
        headers: {
            'x-telegram-bot-api-secret-token': 'test-secret',
        },
    };

    it('rejects when webhook secret is missing', () => {
        const result = verifyTelegramWebhookSignature(
            request as any,
            '',
        );

        expect(result).toEqual({
            valid: false,
            error: 'Missing webhook secret',
        });
    });

    it('rejects when the secret header is missing', () => {
        const requestWithoutHeader = {
            headers: {},
        };

        const result = verifyTelegramWebhookSignature(
            requestWithoutHeader as any,
            'test-secret',
        );

        expect(result).toEqual({
            valid: false,
            error: 'Missing x-telegram-bot-api-secret-token header',
        });
    });

    it('accepts a correct secret', () => {
        const result = verifyTelegramWebhookSignature(
            request as any,
            'test-secret',
        );

        expect(result.valid).toBe(true);
    });

    it('rejects an incorrect secret', () => {
        const result = verifyTelegramWebhookSignature(
            request as any,
            'wrong-secret',
        );

        expect(result).toEqual({
            valid: false,
            error: 'Invalid secret token',
        });
    });
});