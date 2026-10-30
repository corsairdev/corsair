import type { WebhookRequest } from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { verifyLinearWebhookSignature } from './types';

jest.mock('corsair/http', () => ({
	verifyHmacSignature: jest.fn(),
}));

describe('verifyLinearWebhookSignature', () => {
	const validRequest: WebhookRequest<unknown> = {
		payload: { action: 'create', type: 'Issue' },
		headers: { 'linear-signature': 'dummy_sig' },
		rawBody: JSON.stringify({ action: 'create', type: 'Issue' }),
	};

	it('should return error when webhookSecret is an empty string', () => {
		const result = verifyLinearWebhookSignature(validRequest, '');
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('should return error when webhookSecret is undefined', () => {
		const result = verifyLinearWebhookSignature(validRequest, undefined);
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('should return error when rawBody is missing', () => {
		const requestWithoutBody: WebhookRequest<unknown> = {
			...validRequest,
			rawBody: '',
		};
		const result = verifyLinearWebhookSignature(requestWithoutBody, 'secret');
		expect(result).toEqual({
			valid: false,
			error: 'Missing raw body for signature verification',
		});
	});

	it('should return error when linear-signature header is missing', () => {
		const requestWithoutHeader: WebhookRequest<unknown> = {
			payload: { action: 'create', type: 'Issue' },
			headers: {},
			rawBody: JSON.stringify({ action: 'create', type: 'Issue' }),
		};
		const result = verifyLinearWebhookSignature(requestWithoutHeader, 'secret');
		expect(result).toEqual({
			valid: false,
			error: 'Missing linear-signature header',
		});
	});

	it('should return error when signature is invalid', () => {
		jest.mocked(verifyHmacSignature).mockReturnValue(false);

		const result = verifyLinearWebhookSignature(validRequest, 'secret');
		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('should accept a valid signature', () => {
		jest.mocked(verifyHmacSignature).mockReturnValue(true);

		const result = verifyLinearWebhookSignature(validRequest, 'secret');
		expect(result).toEqual({
			valid: true,
		});
		expect(verifyHmacSignature).toHaveBeenCalledWith(
			validRequest.rawBody,
			'secret',
			'dummy_sig',
		);
	});

	it('should accept a valid signature when header is passed as an array', () => {
		jest.mocked(verifyHmacSignature).mockReturnValue(true);

		const requestWithArrayHeader: WebhookRequest<unknown> = {
			...validRequest,
			headers: { 'linear-signature': ['array_sig_1', 'array_sig_2'] },
		};

		const result = verifyLinearWebhookSignature(
			requestWithArrayHeader,
			'secret',
		);
		expect(result).toEqual({
			valid: true,
		});
		expect(verifyHmacSignature).toHaveBeenCalledWith(
			validRequest.rawBody,
			'secret',
			'array_sig_1',
		);
	});
});
