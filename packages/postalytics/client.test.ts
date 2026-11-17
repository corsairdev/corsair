import { ZodError } from 'zod';
import { makePostalyticsRequest, PostalyticsRateLimitError } from './client';
import { errorHandlers } from './error-handlers';
import type { PostalyticsContext, PostalyticsKeyBuilderContext } from './index';
import { postalytics, postalyticsEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	AuthMissingError: class AuthMissingError extends Error {},
}));

const mockFetch = jest.fn();
const originalFetch = globalThis.fetch;
// The handlers exercised here only use key and options; Corsair supplies the rest.
const ctx = { key: 'test-key', options: {} } as PostalyticsContext;

beforeAll(() => {
	globalThis.fetch = mockFetch as typeof fetch;
});
afterAll(() => {
	globalThis.fetch = originalFetch;
});
beforeEach(() => mockFetch.mockReset());

describe('Postalytics request seam', () => {
	it('reads the current account with HTTP Basic authentication', async () => {
		mockFetch.mockResolvedValue(
			new Response(JSON.stringify([{ account_id: 42, address_city: null }]), {
				status: 200,
			}),
		);
		const plugin = postalytics({ key: 'test-key' });
		const input = postalyticsEndpointSchemas[
			'account.getMyAccount'
		].input.parse({});
		expect(await plugin.endpoints!.account.getMyAccount(ctx, input)).toEqual([
			{ account_id: 42, address_city: null },
		]);
		const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.postalytics.com/api/v1/account/me');
		expect(init.method).toBe('GET');
		expect(new Headers(init.headers).get('Authorization')).toBe(
			`Basic ${Buffer.from('test-key:').toString('base64')}`,
		);
		expect(init.redirect).toBe('error');
	});
	it('parses populated campaign and suppression contact resources', async () => {
		mockFetch.mockResolvedValueOnce(
			new Response(
				JSON.stringify([{ campaign_id: 7, name: null, delivered: 3 }]),
				{ status: 200 },
			),
		);
		mockFetch.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					ContactDetails: [{ DataId: 9, FirstName: null }],
					ListDetails: { Id: 4, Name: 'Suppression' },
				}),
				{ status: 200 },
			),
		);
		const endpoints = postalytics().endpoints!;
		expect(await endpoints.campaigns.getAllCampaigns(ctx, {})).toEqual([
			{ campaign_id: 7, name: null, delivered: 3 },
		]);
		expect(
			await endpoints.suppressionContacts.getSuppressionListContacts(ctx, {
				listId: 4,
				offset: 2,
			}),
		).toEqual({
			ContactDetails: [{ DataId: 9, FirstName: null }],
			ListDetails: { Id: 4, Name: 'Suppression' },
		});
	});
	it('rejects malformed required fields from both template reads', async () => {
		const invalidTemplate = {
			is_full_html: true,
			is_proofed: 'false',
			name: 'The Architect',
			size: '0',
		};
		mockFetch.mockImplementation(
			async () =>
				new Response(JSON.stringify([invalidTemplate]), { status: 200 }),
		);
		const endpoints = postalytics().endpoints!;
		await expect(endpoints.templates.getAllTemplates(ctx, {})).rejects.toThrow(
			ZodError,
		);
		await expect(
			endpoints.templates.getTemplate(ctx, { id: 42 }),
		).rejects.toThrow(ZodError);
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});
	it('gets an account from the sandbox using its numeric ID', async () => {
		mockFetch.mockResolvedValue(new Response('[]', { status: 200 }));
		const plugin = postalytics();
		const input = postalyticsEndpointSchemas['account.getAccount'].input.parse({
			id: 7,
		});
		expect(
			await plugin.endpoints!.account.getAccount(
				{ ...ctx, options: { sandbox: true } },
				input,
			),
		).toEqual([]);
		expect(mockFetch.mock.calls[0][0]).toBe(
			'https://api-dev.postalytics.com/api/v1/account/7',
		);
		expect(() =>
			postalyticsEndpointSchemas['account.getAccount'].input.parse({
				id: '../7',
			}),
		).toThrow();
	});
	it('forwards non-first-page query parameters', async () => {
		mockFetch.mockResolvedValue(new Response('[]', { status: 200 }));
		await postalytics().endpoints!.campaigns.getCampaignEvents(ctx, {
			id: 7,
			PageNumber: 2,
			PageSize: 10,
		});
		expect(mockFetch.mock.calls[0][0]).toBe(
			'https://api.postalytics.com/api/v1/campaigns/7/events?PageNumber=2&PageSize=10',
		);
	});
	it('sends mail to the id inside the EndPointId URL that Get Campaign returns', async () => {
		mockFetch.mockImplementation(
			async () =>
				new Response(JSON.stringify({ send_date: '2026-11-15T12:00:00' }), {
					status: 200,
				}),
		);
		const recipient = {
			address_city: 'New York',
			address_state: 'NY',
			address_street: '36 Pipers Row',
			address_zip: '10001',
			first_name: 'Thomas',
			last_name: 'Anderson',
		};
		const input = postalyticsEndpointSchemas['mail.sendMail'].input.parse({
			endPoint: 'https://app.postalytics.com/1234567890',
			body: recipient,
		});
		await postalytics().endpoints!.mail.sendMail(ctx, input);
		expect(mockFetch.mock.calls[0][0]).toBe(
			'https://api.postalytics.com/api/v1/send/1234567890',
		);
		for (const endPoint of [
			'https://example.org/1234567890',
			'https://app.postalytics.com.example.org/1234567890',
			'http://app.postalytics.com/a/..',
		])
			expect(() =>
				postalyticsEndpointSchemas['mail.sendMail'].input.parse({
					endPoint,
					body: recipient,
				}),
			).toThrow();
	});
	it('creates a contact without a contact_id', async () => {
		mockFetch.mockImplementation(
			async () =>
				new Response(JSON.stringify({ created_date: '2026-11-15T12:00:00' }), {
					status: 200,
				}),
		);
		const input = postalyticsEndpointSchemas[
			'contacts.createContactOnList'
		].input.parse({ body: { contact_list_id: 5, first_name: 'Thomas' } });
		await postalytics().endpoints!.contacts.createContactOnList(ctx, input);
		const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
		expect(JSON.parse(String(init.body))).toEqual({
			contact_list_id: 5,
			first_name: 'Thomas',
		});
	});
	it('keeps account credentials out of results and login-link input', async () => {
		mockFetch.mockImplementation(
			async () =>
				new Response(
					JSON.stringify([
						{ account_id: 42, api_key: 'provider-key', password: 'secret' },
					]),
					{ status: 200 },
				),
		);
		const endpoints = postalytics().endpoints!;
		expect(await endpoints.account.getMyAccount(ctx, {})).toEqual([
			{ account_id: 42 },
		]);
		expect(await endpoints.account.getAccount(ctx, { id: 42 })).toEqual([
			{ account_id: 42 },
		]);
		mockFetch.mockImplementation(
			async () =>
				new Response(JSON.stringify({ LoginLink: 'https://example' }), {
					status: 200,
				}),
		);
		const input = postalyticsEndpointSchemas[
			'login.createLoginLink'
		].input.parse({ body: { url: 'dashboard', api_key: 'from-tool-input' } });
		await endpoints.login.createLoginLink(ctx, input);
		const [, init] = mockFetch.mock.calls[2] as [string, RequestInit];
		expect(JSON.parse(String(init.body))).toEqual({
			url: 'dashboard',
			api_key: 'test-key',
		});
	});
	it('marks every operation that can mail paper as destructive', () => {
		const meta = postalytics().endpointMeta!;
		for (const op of [
			'mail.sendMail',
			'flows.enrollContactToFlow',
			'campaigns.updateCampaignStatus',
		] as const)
			expect(meta[op]?.riskLevel).toBe('destructive');
	});
	it('reads the empty-account 400 on the campaign and template lists as []', async () => {
		const endpoints = postalytics().endpoints!;
		mockFetch.mockImplementation(
			async () => new Response('Campaign not found', { status: 400 }),
		);
		expect(await endpoints.campaigns.getAllCampaigns(ctx, {})).toEqual([]);
		mockFetch.mockImplementation(
			async () => new Response('Template not found', { status: 400 }),
		);
		expect(await endpoints.templates.getAllTemplates(ctx, {})).toEqual([]);
		mockFetch.mockImplementation(
			async () => new Response('Validation error', { status: 400 }),
		);
		await expect(
			endpoints.campaigns.getAllCampaigns(ctx, {}),
		).rejects.toMatchObject({ status: 400 });
	});
	it('rejects unsafe string route parameters', () => {
		const input = postalyticsEndpointSchemas['flows.getFlow'].input;
		for (const endpointId of [
			'',
			'.',
			'..',
			'a/b',
			'a\\b',
			'a"b',
			"a'b",
			'%2f',
			'\u0000',
		])
			expect(() => input.parse({ endpointId })).toThrow();
	});
	it('surfaces 429 Retry-After without replaying the request', async () => {
		mockFetch.mockResolvedValue(
			new Response('limited', { status: 429, headers: { 'Retry-After': '3' } }),
		);
		await expect(
			postalytics().endpoints!.account.getMyAccount(ctx, {}),
		).rejects.toMatchObject({ retryAfterMs: 3000, status: 429 });
		expect(mockFetch).toHaveBeenCalledTimes(1);
		expect(new PostalyticsRateLimitError('limited', 3000).status).toBe(429);
	});
	it('retries a short 429 three times and returns a long one to the caller', async () => {
		const handler = errorHandlers.RATE_LIMIT_ERROR;
		const short = new PostalyticsRateLimitError('limited', 3000);
		expect(handler.match(short)).toBe(true);
		await expect(handler.handler(short)).resolves.toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 3000,
		});
		await expect(
			handler.handler(new PostalyticsRateLimitError('limited')),
		).resolves.toMatchObject({ maxRetries: 3 });
		await expect(
			handler.handler(new PostalyticsRateLimitError('limited', 3_600_000)),
		).resolves.toEqual({ maxRetries: 0 });
	});
	it('backs off exponentially when Retry-After is 0', async () => {
		const handler = errorHandlers.RATE_LIMIT_ERROR;
		await expect(
			handler.handler(new PostalyticsRateLimitError('limited', 0)),
		).resolves.toEqual({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff',
			headersRetryAfterMs: undefined,
		});
	});
	it('does not send credentials to an absolute or scheme-relative URL', async () => {
		for (const path of [
			'https://example.org',
			'//example.org',
			'/\\example.org',
			'/\t/example.org',
			'/\n/example.org',
		]) {
			await expect(
				makePostalyticsRequest(path, 'test-key', { method: 'GET' }),
			).rejects.toThrow();
		}
		expect(mockFetch).not.toHaveBeenCalled();
	});
	it('rejects missing API credentials before making a request', async () => {
		const plugin = postalytics();
		await expect(
			plugin.keyBuilder!(
				{
					authType: 'api_key',
					options: {},
					tenantId: 'fixture-tenant',
					keys: {
						get_api_key: async () => null,
						set_api_key: async () => {},
						get_webhook_signature: async () => null,
						set_webhook_signature: async () => {},
						get_dek: async () => '',
						issue_new_dek: async () => '',
					},
				} satisfies PostalyticsKeyBuilderContext,
				'endpoint',
			),
		).rejects.toThrow();
		await expect(
			makePostalyticsRequest('/api/v1/account/me', '', { method: 'GET' }),
		).rejects.toThrow('API key is required');
		expect(mockFetch).not.toHaveBeenCalled();
	});
	it('puts the problem+json title and field errors in the message', async () => {
		mockFetch.mockImplementation(
			async () =>
				new Response(
					JSON.stringify({
						type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
						title: 'One or more validation errors occurred.',
						status: 400,
						errors: { id: ["The value 'x' is not valid."] },
					}),
					{
						status: 400,
						headers: { 'Content-Type': 'application/problem+json' },
					},
				),
		);
		await expect(
			postalytics().endpoints!.account.getAccount(ctx, { id: 1 }),
		).rejects.toThrow(
			"One or more validation errors occurred. id: The value 'x' is not valid.",
		);
	});
	it('retains provider error details on non-rate-limit failures', async () => {
		mockFetch.mockResolvedValue(
			new Response(JSON.stringify({ error: 'bad request' }), { status: 400 }),
		);
		await expect(
			postalytics().endpoints!.account.getMyAccount(ctx, {}),
		).rejects.toMatchObject({ status: 400, body: { error: 'bad request' } });
	});
});
