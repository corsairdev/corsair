import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { CertifierAPIError, makeCertifierRequest } from './client';
import {
	CertifierEndpointInputSchemas,
	CertifierEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { CertifierContext, CertifierKeyBuilderContext } from './index';
import { certifier, certifierEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;
const mockLog = jest.mocked(logEventFromContext);

const credential = {
	id: '01hz2f0c9ryvzajg20jqh9taab',
	publicId: '124a8110-1af5-4747-9308-e9d06bd1852a',
	groupId: '01g90279gp5sbmfek7wymcsvec',
	status: 'issued',
	recipient: {
		id: '01jmerb62apgachxwx6db76c7s',
		name: 'John Doe',
		email: 'john.doe@example.com',
	},
	issueDate: '2022-01-01',
	expiryDate: null,
	attributes: { 'recipient.name': 'John Doe' },
	customAttributes: {},
	createdAt: '2022-01-01T00:00:00.000Z',
	updatedAt: '2022-01-01T00:00:00.000Z',
};

const page = <T>(data: T[]) => ({
	data,
	pagination: { prev: null, next: null },
});

const mockCtx = {
	key: 'certifier_test_key',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
	keyBuilder: async () => 'certifier_test_key',
} as unknown as CertifierContext;

function pluginEndpoints() {
	const endpoints = certifier({ key: 'certifier_test_key' }).endpoints;
	if (!endpoints) {
		throw new Error('missing endpoints');
	}
	return endpoints;
}

function classify(error: Error): string {
	const name = (
		Object.keys(errorHandlers) as Array<keyof typeof errorHandlers>
	).find((key) => errorHandlers[key].match(error));
	return name ?? 'none';
}

function httpError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://api.certifier.io/v1/credentials' },
		{
			url: 'https://api.certifier.io/v1/credentials',
			ok: false,
			status,
			statusText: 'Error',
			body: { error: { code: message, message } },
		},
		message,
	);
}

describe('certifier plugin shape', () => {
	it('registers the nine operations and no webhooks', () => {
		const plugin = certifier();
		expect(plugin.id).toBe('certifier');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
		expect(plugin.webhookHooks).toBeUndefined();
		expect(Object.keys(certifierEndpointSchemas).sort()).toEqual([
			'attributes.list',
			'credentialInteractions.list',
			'credentials.createIssueSend',
			'credentials.list',
			'credentials.search',
			'credentials.send',
			'designs.list',
			'emailTemplates.list',
			'groups.list',
		]);
	});
});

describe('certifier keyBuilder', () => {
	it('returns options.key for endpoint calls', async () => {
		const plugin = certifier({ key: 'certifier_test_key' });
		await expect(
			(plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>)(
				{ authType: 'api_key' },
				'endpoint',
			),
		).resolves.toBe('certifier_test_key');
	});

	it('throws AuthMissingError when the api key is absent', async () => {
		const plugin = certifier();
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async (): Promise<string | null> => null },
		} as unknown as CertifierKeyBuilderContext;

		await expect(
			(plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>)(
				ctx,
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError for non-endpoint sources', async () => {
		const plugin = certifier({ key: 'certifier_test_key' });
		await expect(
			(plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>)(
				{ authType: 'api_key' },
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('certifier request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue(page([credential]));
	});

	it('sends Bearer auth and Certifier-Version against api.certifier.io/v1', async () => {
		await makeCertifierRequest('credentials', 'certifier_test_key', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.certifier.io/v1',
				TOKEN: 'certifier_test_key',
				HEADERS: expect.objectContaining({
					'Certifier-Version': '2022-10-26',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: 'credentials',
			}),
		);
	});

	it('forwards body and query for POST', async () => {
		await makeCertifierRequest('credentials/search', 'certifier_test_key', {
			method: 'POST',
			body: { filter: { AND: [] } },
			query: { limit: 25 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'credentials/search',
				body: { filter: { AND: [] } },
				query: { limit: 25 },
			}),
		);
	});

	it('rethrows ApiError so status stays on the error', async () => {
		const err = httpError(429, 'rate_limited');
		mockRequest.mockRejectedValue(err);

		await expect(
			makeCertifierRequest('credentials', 'certifier_test_key'),
		).rejects.toBe(err);
	});

	it('preserves a wrapper for unknown failures', async () => {
		mockRequest.mockRejectedValue(new Error('boom'));

		await expect(
			makeCertifierRequest('credentials', 'certifier_test_key'),
		).rejects.toBeInstanceOf(CertifierAPIError);
	});

	it('rejects an empty key before calling the API', async () => {
		await expect(
			makeCertifierRequest('credentials', '  '),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('credentials.createIssueSend', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue(credential);
	});

	it('POSTs the official create-issue-send path', async () => {
		const result = await pluginEndpoints().credentials.createIssueSend(
			mockCtx,
			{
				groupId: '01g90279gp5sbmfek7wymcsvec',
				recipient: { name: 'Jane Doe', email: 'jane@example.com' },
				issueDate: '2026-09-03',
				customAttributes: { 'custom.mentor': 'Alex' },
			},
		);

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'credentials/create-issue-send',
				body: {
					groupId: '01g90279gp5sbmfek7wymcsvec',
					recipient: { name: 'Jane Doe', email: 'jane@example.com' },
					issueDate: '2026-09-03',
					customAttributes: { 'custom.mentor': 'Alex' },
				},
			}),
		);
		expect(result.id).toBe(credential.id);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'certifier.credentials.create_issue_send',
			{ groupId: '01g90279gp5sbmfek7wymcsvec', id: credential.id },
			'completed',
		);
	});

	it('rejects a missing recipient email before calling the API', async () => {
		await expect(
			pluginEndpoints().credentials.createIssueSend(mockCtx, {
				groupId: 'g1',
				recipient: { name: 'Jane' },
			} as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('list endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
	});

	it('lists credentials with limit and cursor', async () => {
		mockRequest.mockResolvedValue(page([credential]));
		const result = await pluginEndpoints().credentials.list(mockCtx, {
			limit: 20,
			cursor: 'next-cursor',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'credentials',
				query: { limit: 20, cursor: 'next-cursor' },
			}),
		);
		expect(result.data).toHaveLength(1);
	});

	it('lists groups', async () => {
		mockRequest.mockResolvedValue(
			page([{ id: '01g90279gp5sbmfek7wymcsvec', name: 'Training' }]),
		);
		const result = await pluginEndpoints().groups.list(mockCtx, { limit: 10 });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'GET', url: 'groups' }),
		);
		expect(result.data[0]?.id).toBe('01g90279gp5sbmfek7wymcsvec');
	});

	it('lists designs', async () => {
		mockRequest.mockResolvedValue(
			page([{ id: '01design', type: 'certificate', name: 'Cert' }]),
		);
		const result = await pluginEndpoints().designs.list(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'GET', url: 'designs' }),
		);
		expect(result.data[0]?.type).toBe('certificate');
	});

	it('lists attributes', async () => {
		mockRequest.mockResolvedValue(
			page([{ tag: 'recipient.name', name: 'Recipient name' }]),
		);
		const result = await pluginEndpoints().attributes.list(mockCtx, {
			limit: 50,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'GET', url: 'attributes' }),
		);
		expect(result.data[0]?.tag).toBe('recipient.name');
	});

	it('lists email templates', async () => {
		mockRequest.mockResolvedValue(page([{ id: '01email', name: 'Default' }]));
		const result = await pluginEndpoints().emailTemplates.list(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'GET', url: 'email-templates' }),
		);
		expect(result.data[0]?.id).toBe('01email');
	});

	it('lists credential interactions filtered by credentialId', async () => {
		mockRequest.mockResolvedValue(
			page([
				{
					id: '01interaction',
					credentialId: credential.id,
					eventType: 'credential_viewed',
					triggeredBy: 'recipient',
				},
			]),
		);
		const result = await pluginEndpoints().credentialInteractions.list(
			mockCtx,
			{
				credentialId: credential.id,
				limit: 20,
			},
		);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'credential-interactions',
				query: { limit: 20, credentialId: credential.id },
			}),
		);
		expect(result.data[0]?.eventType).toBe('credential_viewed');
	});
});

describe('credentials.search', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue(page([credential]));
	});

	it('POSTs the documented filter, sort, and pagination', async () => {
		const filter = {
			AND: [{ status: { equals: 'issued' } }],
		};
		const result = await pluginEndpoints().credentials.search(mockCtx, {
			filter,
			sort: { property: 'createdAt', order: 'desc' },
			limit: 25,
			cursor: 'page-2',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'credentials/search',
				body: {
					filter,
					sort: { property: 'createdAt', order: 'desc' },
					limit: 25,
					cursor: 'page-2',
				},
			}),
		);
		expect(result.data[0]?.status).toBe('issued');
	});

	it('rejects an invalid sort property', () => {
		expect(
			CertifierEndpointInputSchemas.searchCredentials.safeParse({
				filter: { AND: [] },
				sort: { property: 'recipient.email', order: 'desc' },
			}).success,
		).toBe(false);
	});
});

describe('credentials.send', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue(credential);
	});

	it('POSTs deliveryMethod email to the credential send path', async () => {
		const result = await pluginEndpoints().credentials.send(mockCtx, {
			id: credential.id,
			deliveryMethod: 'email',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: `credentials/${credential.id}/send`,
				body: { deliveryMethod: 'email' },
			}),
		);
		expect(result.id).toBe(credential.id);
	});

	it('rejects unsupported delivery methods', () => {
		expect(
			CertifierEndpointInputSchemas.sendCredential.safeParse({
				id: credential.id,
				deliveryMethod: 'sms',
			}).success,
		).toBe(false);
	});
});

describe('output contracts', () => {
	it('rejects a credential page missing data', () => {
		expect(() =>
			CertifierEndpointOutputSchemas.listCredentials.parse({
				items: [credential],
			}),
		).toThrow();
	});
});

describe('certifier error classification', () => {
	it('classifies official Certifier status codes', () => {
		expect(classify(httpError(400, 'validation_error'))).toBe(
			'VALIDATION_ERROR',
		);
		expect(classify(httpError(401, 'unauthorized'))).toBe('AUTH_ERROR');
		expect(classify(httpError(402, 'payment_required'))).toBe(
			'PAYMENT_REQUIRED_ERROR',
		);
		expect(classify(httpError(403, 'forbidden'))).toBe('PERMISSION_ERROR');
		expect(classify(httpError(404, 'not_found'))).toBe('NOT_FOUND_ERROR');
		expect(classify(httpError(409, 'conflict'))).toBe('CONFLICT_ERROR');
		expect(classify(httpError(429, 'rate_limited'))).toBe('RATE_LIMIT_ERROR');
		expect(classify(httpError(500, 'internal_server_error'))).toBe(
			'SERVER_ERROR',
		);
	});
});
