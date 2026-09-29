import { CloudflareApiKeyAPIError } from './api-error';
import {
	cloudflareErrorFromApiErrorBody,
	isCloudflareEnvelope,
	unwrapCloudflareResponse,
} from './response';

describe('unwrapCloudflareResponse', () => {
	it('unwraps a successful JSON envelope', () => {
		const result = unwrapCloudflareResponse<{ id: string }>({
			success: true,
			result: { id: 'zone-1' },
			errors: [],
			messages: [],
		});
		expect(result).toEqual({ id: 'zone-1' });
	});

	it('throws when success is false', () => {
		expect(() =>
			unwrapCloudflareResponse({
				success: false,
				result: null,
				errors: [{ code: 1000, message: 'Invalid request' }],
				messages: [],
			}),
		).toThrow(CloudflareApiKeyAPIError);
	});

	it('passes through non-envelope delete payloads', () => {
		const payload = { id: 'record-1' };
		expect(unwrapCloudflareResponse(payload)).toEqual(payload);
	});

	it('unwraps null result for ruleset DELETE', () => {
		expect(
			unwrapCloudflareResponse<null>({
				success: true,
				result: null,
				errors: [],
				messages: [],
			}),
		).toBeNull();
	});
});

describe('isCloudflareEnvelope', () => {
	it('returns false for strings', () => {
		expect(isCloudflareEnvelope('not-json')).toBe(false);
	});
});

describe('cloudflareErrorFromApiErrorBody', () => {
	it('maps envelope errors', () => {
		const err = cloudflareErrorFromApiErrorBody({
			success: false,
			result: null,
			errors: [{ code: 9109, message: 'Unauthorized' }],
			messages: [],
		});
		expect(err).toBeInstanceOf(CloudflareApiKeyAPIError);
		expect(err?.message).toContain('Unauthorized');
	});

	it('gives null for unrelated bodies', () => {
		expect(cloudflareErrorFromApiErrorBody({ random: [] })).toBeNull();
	});
});
