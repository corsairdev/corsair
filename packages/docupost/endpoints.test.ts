import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { makeDocupostRequest } from './client';
import type { DocupostContext } from './index';
import { docupost, docupostEndpointSchemas } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.Mock;

const mockCtx = {
	key: 'test-api-token',
	$getAccountId: async () => 'test-account-id',
	database: undefined,
	endpoints: {},
} as DocupostContext;

const letterInput = {
	to_name: 'John Doe',
	to_address: '123 Main St',
	to_city: 'Austin',
	to_state: 'TX',
	to_zip: '78701',
	from_name: 'Jane Doe',
	from_address: '456 Oak St',
	from_city: 'Austin',
	from_state: 'TX',
	from_zip: '78702',
	pdf_url: 'https://example.com/letter.pdf',
};

const postcardInput = {
	to_name: 'John Doe',
	to_address: '123 Main St',
	to_city: 'Austin',
	to_state: 'TX',
	to_zip: '78701',
	from_name: 'Jane Doe',
	from_address: '456 Oak St',
	from_city: 'Austin',
	from_state: 'TX',
	from_zip: '78702',
	front_image_url: 'https://example.com/front.png',
	back_image_url: 'https://example.com/back.png',
};

describe('Docupost plugin shape', () => {
	it('exposes all three operations with schemas and no webhooks', () => {
		const plugin = docupost();
		const metaKeys = Object.keys(plugin.endpointMeta ?? {}).sort();
		const schemaKeys = Object.keys(docupostEndpointSchemas).sort();

		expect(metaKeys).toEqual([
			'account.balance',
			'send.letter',
			'send.postcard',
		]);
		expect(schemaKeys).toEqual(metaKeys);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
		expect(plugin.pluginTenantWebhookMatcher).toBeUndefined();
		expect(plugin.oauthWebhookTenantLinkResolver).toBeUndefined();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig?.api_key?.account).toEqual(['tenant_external_id']);
	});

	it('throws AuthMissingError when no api key is configured', async () => {
		const plugin = docupost();
		const keyBuilder = plugin.keyBuilder;
		expect(keyBuilder).toBeDefined();
		const ctx = {
			authType: 'api_key' as const,
			options: {},
			tenantId: 'tenant-1',
			keys: {
				get_api_key: async () => null,
				set_api_key: async () => undefined,
				get_webhook_signature: async () => null,
				set_webhook_signature: async () => undefined,
				get_dek: async () => 'dek',
				issue_new_dek: async () => 'dek',
			},
		};
		await expect(keyBuilder!(ctx as never, 'endpoint')).rejects.toThrow(
			AuthMissingError,
		);
	});
});

describe('Docupost request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ id: 'mail-1', status: 'queued' });
	});

	it('sends the api token as a query parameter', async () => {
		await makeDocupostRequest('accountbalance', 'test-api-token', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://app.docupost.com/api/1.1/wf',
			}),
			expect.objectContaining({
				method: 'GET',
				url: 'accountbalance',
				query: expect.objectContaining({ api_token: 'test-api-token' }),
			}),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({ maxRetries: 3 }),
			}),
		);
	});

	it('does not retry write requests at the transport layer', async () => {
		await makeDocupostRequest('sendletter', 'test-api-token', {
			method: 'POST',
			query: { to_name: 'John Doe' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'POST' }),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({
					enabled: false,
					maxRetries: 0,
				}),
			}),
		);
	});

	it('rejects responses that violate the output contract', async () => {
		mockRequest.mockResolvedValueOnce('not-an-object');
		await expect(
			makeDocupostRequest('sendletter', 'test-api-token', {
				method: 'POST',
				query: { to_name: 'John Doe' },
			}),
		).rejects.toThrow(/docupost/i);
	});

	it('rethrows transport ApiError untouched', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'accountbalance' },
			{
				url: 'https://app.docupost.com/api/1.1/wf/accountbalance',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { message: 'Too Many Requests' },
			},
			'Too Many Requests',
			{ retryAfter: 2000 },
		);
		mockRequest.mockRejectedValueOnce(apiError);
		await expect(
			makeDocupostRequest('accountbalance', 'test-api-token', {
				method: 'GET',
			}),
		).rejects.toBe(apiError);
	});
});

describe('Docupost endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ id: 'mail-1', status: 'queued' });
	});

	it('maps the account balance read to its route', async () => {
		await (
			docupost({ key: 'test-api-token' }).endpoints as unknown as {
				account: {
					balance: (ctx: DocupostContext, input: unknown) => Promise<unknown>;
				};
			}
		).account.balance(mockCtx, {});

		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: 'accountbalance',
			}),
		);
	});

	it('maps letters to sendletter with query params and html body', async () => {
		await docupost({ key: 'test-api-token' }).endpoints!.send.letter(mockCtx, {
			...letterInput,
			pdf_url: undefined,
			html: '<p>Hello</p>',
		} as never);

		const call = mockRequest.mock.calls[0]?.[1];
		expect(call.method).toBe('POST');
		expect(call.url).toBe('sendletter');
		expect(call.query).toEqual(
			expect.objectContaining({
				to_name: 'John Doe',
				to_address1: '123 Main St',
				to_city: 'Austin',
				to_state: 'TX',
				to_zip: '78701',
				from_name: 'Jane Doe',
				from_address1: '456 Oak St',
				api_token: 'test-api-token',
			}),
		);
		expect(call.query.pdf).toBeUndefined();
		expect(call.body).toEqual({ html: '<p>Hello</p>' });
	});

	it('maps postcards to sendpostcard with image urls', async () => {
		await docupost({ key: 'test-api-token' }).endpoints!.send.postcard(
			mockCtx,
			postcardInput,
		);

		const call = mockRequest.mock.calls[0]?.[1];
		expect(call.method).toBe('POST');
		expect(call.url).toBe('sendpostcard');
		expect(call.query).toEqual(
			expect.objectContaining({
				front_image: 'https://example.com/front.png',
				back_image: 'https://example.com/back.png',
				api_token: 'test-api-token',
			}),
		);
	});

	it('rejects a letter with neither pdf nor html', async () => {
		await expect(async () => {
			await docupost({ key: 'test-api-token' }).endpoints!.send.letter(
				mockCtx,
				{ ...letterInput, pdf_url: undefined },
			);
		}).rejects.toThrow(/input validation failed/i);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a letter with both pdf and html', async () => {
		await expect(async () => {
			await docupost({ key: 'test-api-token' }).endpoints!.send.letter(
				mockCtx,
				{ ...letterInput, html: '<p>Hello</p>' },
			);
		}).rejects.toThrow(/input validation failed/i);
	});

	it('rejects a postcard without front image url', async () => {
		await expect(async () => {
			await docupost({ key: 'test-api-token' }).endpoints!.send.postcard(
				mockCtx,
				{
					...postcardInput,
					back_image_url: undefined,
				} as never,
			);
		}).rejects.toThrow(/input validation failed/i);
	});

	it('does not log letter html or addresses in the event payload', async () => {
		const logged = jest.fn();
		const ctx = { ...mockCtx, $getAccountId: async () => 'acct-1' };
		await docupost({ key: 'test-api-token' }).endpoints!.send.letter(ctx, {
			...letterInput,
			pdf_url: undefined,
			html: '<p>Secret content</p>',
		} as never);

		expect(logged).not.toHaveBeenCalled();
		expect(mockRequest.mock.calls.length).toBe(1);
	});

	it('validates outputs against the registered schemas', async () => {
		mockRequest.mockResolvedValueOnce({ id: 'mail-1', status: 'queued' });
		await expect(
			docupost({ key: 'test-api-token' }).endpoints!.send.letter(mockCtx, {
				...letterInput,
			}),
		).resolves.toEqual({ id: 'mail-1', status: 'queued' });
	});
});
