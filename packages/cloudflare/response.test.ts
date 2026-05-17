import { CloudflareAPIError } from './api-error';
import {
	isCloudflareEnvelope,
	unwrapCloudflareResponse,
	cloudflareErrorFromApiErrorBody,
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

	it('throws CloudflareAPIError when success is false', () => {
		expect(() =>
			unwrapCloudflareResponse({
				success: false,
				result: null,
				errors: [{ code: 1000, message: 'Invalid request' }],
				messages: [],
			}),
		).toThrow(CloudflareAPIError);
	});

	it('returns plain string for Workers script download', () => {
		const source = 'export default { fetch() {} };';
		const result = unwrapCloudflareResponse<string>(source);
		expect(result).toBe(source);
	});

	it('passes through non-envelope delete payloads', () => {
		const payload = { id: 'ruleset-1' };
		expect(unwrapCloudflareResponse(payload)).toEqual(payload);
	});

	it('unwraps null result for Workers/Rulesets DELETE', () => {
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
	it('returns false for script source strings', () => {
		expect(isCloudflareEnvelope('addEventListener("fetch")')).toBe(false);
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
		expect(err).toBeInstanceOf(CloudflareAPIError);
		expect(err?.message).toContain('Unauthorized');
	});
});
