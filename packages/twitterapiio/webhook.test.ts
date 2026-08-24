import type { WebhookRequest } from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { verifyTwitterApiIOWebhookSignature } from './webhooks/types';

jest.mock('corsair/http', () => ({
	verifyHmacSignature: jest.fn(),
}));

const mockedVerify = verifyHmacSignature as jest.Mock;

describe('TwitterApiIO Webhooks', () => {
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
					'x-twitterapiio-signature': 'sha256=valid-signature',
				},
			};

			const result = verifyTwitterApiIOWebhookSignature(
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
					'x-twitterapiio-signature': 'sha256=invalid-signature',
				},
			};

			const result = verifyTwitterApiIOWebhookSignature(
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
				headers: {},
			};

			const result = verifyTwitterApiIOWebhookSignature(mockRequest, '');

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

			const result = verifyTwitterApiIOWebhookSignature(
				mockRequest,
				'my-app-secret',
			);

			expect(result.valid).toBe(false);
			expect(result.error).toMatch('Missing x-twitterapiio-signature header');
		});
	});
});
