import type { WebhookRequest } from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { verifyTwitterWebhookSignature } from './webhooks/types';

jest.mock('corsair/http', () => ({
	verifyHmacSignature: jest.fn(),
}));

const mockedVerify = verifyHmacSignature as jest.Mock;

describe('Twitter Webhooks Tests', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Signature Verification', () => {
		it('Should verify correct signature via HMAC SHA256', async () => {
			mockedVerify.mockReturnValue(true);

			const mockRequest: WebhookRequest<unknown> = {
				payload: {},
				rawBody: 'mock-body-string',
				headers: {
					'x-twitter-webhooks-signature': 'sha256=valid-signature',
				},
			};

			const result = verifyTwitterWebhookSignature(
				mockRequest,
				'my-app-secret',
			);

			expect(mockedVerify).toHaveBeenCalledWith(
				'mock-body-string',
				'my-app-secret',
				'sha256=valid-signature',
				'sha256',
			);
			expect(result.valid).toBe(true);
		});

		it('should reject when verification fails', async () => {
			mockedVerify.mockReturnValue(false);

			const mockRequest: WebhookRequest<unknown> = {
				payload: {},
				rawBody: 'mock-body-string',
				headers: {
					'x-twitter-webhooks-signature': 'sha256=invalid-signature',
				},
			};

			const result = verifyTwitterWebhookSignature(
				mockRequest,
				'my-app-secret',
			);

			expect(result.valid).toBe(false);
		});

		it('Should reject when webhook secret is missing', () => {
			mockedVerify.mockReturnValue(false);

			const mockRequest: WebhookRequest<unknown> = {
				payload: {},
				rawBody: 'mock-body-string',
				headers: {
					'x-twitter-webhooks-signature': 'sha256=valid-signature',
				},
			};

			const result = verifyTwitterWebhookSignature(mockRequest, '');

			expect(result.valid).toBe(false);
			expect(result.error).toMatch('Missing webhook secret');
		});

		it('Should reject when signature is missing with configured secret', () => {
			mockedVerify.mockReturnValue(false);

			const mockRequest: WebhookRequest<unknown> = {
				payload: {},
				rawBody: 'mock-body-string',
				headers: {},
			};

			const result = verifyTwitterWebhookSignature(
				mockRequest,
				'my-app-secret',
			);

			expect(result.valid).toBe(false);
			expect(result.error).toMatch(
				'Missing x-twitter-webhooks-signature header',
			);
		});

		it('should reject when both signature and secret missing', () => {
			mockedVerify.mockReturnValue(false);

			const mockRequest: WebhookRequest<unknown> = {
				payload: {},
				rawBody: 'mock-body-string',
				headers: {},
			};

			const result = verifyTwitterWebhookSignature(mockRequest, '');

			expect(result.valid).toBe(false);
			expect(result.error).toMatch(
				'Missing x-twitter-webhooks-signature header',
			);
		});
	});
});
