import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	MailcheckEndpointInputSchemas,
	MailcheckEndpointOutputSchemas,
} from './endpoints/types';
import type { MailcheckContext } from './index';
import { mailcheck } from './index';

const mockMakeMailcheckRequest = jest.fn();
jest.mock('./client', () => ({
	makeMailcheckRequest: (...args: unknown[]) =>
		mockMakeMailcheckRequest(...args),
}));
jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

const { Mailcheck } = require('./endpoints') as typeof import('./endpoints');

const mockCtx = {
	key: 'test-api-key',
} as MailcheckContext;

const sampleResult = {
	email: 'test@example.com',
	trustRate: 95,
	mxExists: true,
	smtpExists: true,
	isNotDisposable: true,
	isNotSmtpCatchAll: true,
};

describe('mailcheck plugin shape', () => {
	it('registers api key auth and no leftover oauth or webhooks', () => {
		const instance = mailcheck({ key: 'k' });
		expect(instance.authConfig).toEqual({
			api_key: { account: [] },
		});
		expect(instance.webhooks).toBeUndefined();
		expect(instance.pluginWebhookMatcher).toBeUndefined();
		expect(instance.webhookHooks).toBeUndefined();
		expect(instance.endpointMeta?.['email.verify']?.description).not.toMatch(
			/breach/i,
		);
		expect(instance.endpointMeta?.['domain.validate']?.description).not.toMatch(
			/age|spam/i,
		);
	});

	it('keeps DEFAULT last after option merge', () => {
		const instance = mailcheck({
			key: 'k',
			errorHandlers: {
				CUSTOM: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const keys = Object.keys(instance.errorHandlers ?? {});
		expect(keys[keys.length - 1]).toBe('DEFAULT');
	});
});

describe('mailcheck keyBuilder', () => {
	it('returns the configured api key', async () => {
		const instance = mailcheck({ key: 'configured-key' });
		expect(instance.keyBuilder).toEqual(expect.any(Function));
		const key = await instance.keyBuilder?.(
			{ authType: 'api_key' } as never,
			'endpoint',
		);
		expect(key).toBe('configured-key');
	});

	it('throws AuthMissingError when the api key is absent', async () => {
		const instance = mailcheck();
		await expect(
			instance.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});
});

describe('Mailcheck endpoints', () => {
	beforeEach(() => {
		mockMakeMailcheckRequest.mockReset();
		mockMakeMailcheckRequest.mockResolvedValue(sampleResult);
	});

	describe('verifyEmail', () => {
		it('POSTs singleEmail:check with the parsed email', async () => {
			const result = await Mailcheck.verifyEmail(mockCtx, {
				email: 'test@example.com',
			});

			expect(mockMakeMailcheckRequest).toHaveBeenCalledWith(
				'/v1/singleEmail:check',
				'test-api-key',
				{
					method: 'POST',
					body: { email: 'test@example.com' },
				},
			);
			expect(result).toEqual(sampleResult);
		});

		it('rejects a malformed email before calling the API', async () => {
			await expect(
				Mailcheck.verifyEmail(mockCtx, { email: 'not-an-email' }),
			).rejects.toThrow();
			expect(mockMakeMailcheckRequest).not.toHaveBeenCalled();
		});

		it('throws when the API omits required output fields', async () => {
			mockMakeMailcheckRequest.mockResolvedValueOnce({
				email: 'test@example.com',
			});

			await expect(
				Mailcheck.verifyEmail(mockCtx, { email: 'test@example.com' }),
			).rejects.toThrow();
		});

		it('propagates ApiError', async () => {
			const apiError = new ApiError(
				{ method: 'POST', url: '/v1/singleEmail:check' },
				{
					url: '/v1/singleEmail:check',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: 'rate limited',
				},
				'Too Many Requests',
			);
			mockMakeMailcheckRequest.mockRejectedValueOnce(apiError);

			await expect(
				Mailcheck.verifyEmail(mockCtx, { email: 'test@example.com' }),
			).rejects.toThrow(ApiError);
		});
	});

	describe('validateDomain', () => {
		it('checks admin@{domain} through singleEmail:check', async () => {
			mockMakeMailcheckRequest.mockResolvedValueOnce({
				...sampleResult,
				email: 'admin@example.com',
			});

			const result = await Mailcheck.validateDomain(mockCtx, {
				domain: 'example.com',
			});

			expect(mockMakeMailcheckRequest).toHaveBeenCalledWith(
				'/v1/singleEmail:check',
				'test-api-key',
				{
					method: 'POST',
					body: { email: 'admin@example.com' },
				},
			);
			expect(result).toEqual({
				domain: 'example.com',
				mxExists: true,
				isNotDisposable: true,
				isNotSmtpCatchAll: true,
			});
			expect(result).not.toHaveProperty('email');
		});

		it('rejects an email address as a domain before calling the API', async () => {
			await expect(
				Mailcheck.validateDomain(mockCtx, {
					domain: 'user@example.com' as never,
				}),
			).rejects.toThrow();
			expect(mockMakeMailcheckRequest).not.toHaveBeenCalled();
		});
	});
});

describe('mailcheck schemas', () => {
	it('verifyEmail requires a real email', () => {
		expect(
			MailcheckEndpointInputSchemas.verifyEmail.safeParse({
				email: 'user@example.com',
			}).success,
		).toBe(true);
		expect(
			MailcheckEndpointInputSchemas.verifyEmail.safeParse({
				email: 'not-an-email',
			}).success,
		).toBe(false);
	});

	it('validateDomain rejects emails, URLs, and paths', () => {
		expect(
			MailcheckEndpointInputSchemas.validateDomain.safeParse({
				domain: 'example.com',
			}).success,
		).toBe(true);
		expect(
			MailcheckEndpointInputSchemas.validateDomain.safeParse({
				domain: 'user@example.com',
			}).success,
		).toBe(false);
		expect(
			MailcheckEndpointInputSchemas.validateDomain.safeParse({
				domain: 'https://example.com',
			}).success,
		).toBe(false);
		expect(
			MailcheckEndpointInputSchemas.validateDomain.safeParse({
				domain: 'example.com/docs',
			}).success,
		).toBe(false);
	});

	it('validateDomain accepts an IDNA A-label TLD', () => {
		expect(
			MailcheckEndpointInputSchemas.validateDomain.safeParse({
				domain: 'example.xn--p1ai',
			}).success,
		).toBe(true);
	});

	it('validateDomain output is domain fields without the admin mailbox', () => {
		expect(
			MailcheckEndpointOutputSchemas.validateDomain.safeParse({
				domain: 'example.com',
				mxExists: true,
				isNotDisposable: true,
				isNotSmtpCatchAll: false,
			}).success,
		).toBe(true);
		expect(
			MailcheckEndpointOutputSchemas.validateDomain.safeParse({
				email: 'admin@example.com',
				trustRate: 80,
				mxExists: true,
				smtpExists: false,
				isNotDisposable: true,
				isNotSmtpCatchAll: false,
			}).success,
		).toBe(false);
	});
});
