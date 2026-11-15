import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	makeGosquaredRequest,
	resolveSiteToken,
	sanitizeError,
} from './client';
import { Account, Now, People, Tracking } from './endpoints';
import { GosquaredEndpointInputSchemas } from './endpoints/types';
import type { GosquaredContext, GosquaredKeyBuilderContext } from './index';
import { gosquared, gosquaredAuthConfig, gosquaredEndpointMeta } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeGosquaredRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

const mockMakeRequest = jest.mocked(makeGosquaredRequest);

function buildCtx(
	options: { siteToken?: string } = {},
	storedSiteToken: string | null = 'GSN-STORED-SITE',
): GosquaredContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options,
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_site_token: () => Promise.resolve(storedSiteToken),
			set_site_token: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

function keyBuilderCtx(
	apiKey: string | null,
	siteToken: string | null,
): GosquaredKeyBuilderContext {
	return {
		authType: 'api_key',
		keys: {
			get_api_key: () => Promise.resolve(apiKey),
			get_site_token: () => Promise.resolve(siteToken),
		},
	} as unknown as GosquaredKeyBuilderContext;
}

function keyBuilder() {
	const kb = gosquared().keyBuilder;
	if (!kb) throw new Error('keyBuilder missing');
	return kb;
}

beforeEach(() => {
	mockMakeRequest.mockReset();
	mockMakeRequest.mockResolvedValue({});
});

describe('site token is a stored per-account field', () => {
	it('keyBuilder throws AuthMissingError when the connection has no site token', async () => {
		await expect(
			keyBuilder()(keyBuilderCtx('stored-key', null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			keyBuilder()(keyBuilderCtx('stored-key', '  '), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('keyBuilder throws AuthMissingError when the API key is missing', async () => {
		await expect(
			keyBuilder()(keyBuilderCtx(null, 'GSN-1'), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('keyBuilder returns the stored key when both fields are present', async () => {
		await expect(
			keyBuilder()(keyBuilderCtx('stored-key', 'GSN-1'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('declares site_token as an account field', () => {
		expect(gosquaredAuthConfig.api_key.account).toEqual(['site_token']);
	});

	it('resolveSiteToken prefers the call input, then the option, then the stored value', async () => {
		await expect(
			resolveSiteToken(buildCtx({ siteToken: 'GSN-OPT' }), 'GSN-INPUT'),
		).resolves.toBe('GSN-INPUT');
		await expect(
			resolveSiteToken(buildCtx({ siteToken: 'GSN-OPT' })),
		).resolves.toBe('GSN-OPT');
		await expect(resolveSiteToken(buildCtx())).resolves.toBe('GSN-STORED-SITE');
		await expect(resolveSiteToken(buildCtx({}, null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('endpoints use the stored site token when no option is set', async () => {
		await Now.getConcurrents(buildCtx(), {});
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'/now/v3/concurrents',
			'test-api-key',
			expect.objectContaining({ siteToken: 'GSN-STORED-SITE' }),
		);
	});
});

describe('documented request fields', () => {
	it('account.createSite sends the site address as url', async () => {
		mockMakeRequest.mockResolvedValue({ site_token: 'GSN-NEW' });
		await Account.createSite(buildCtx(), {
			url: 'https://example.com',
			timezone: 'Europe/London',
		});
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'/account/v1/sites',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: { url: 'https://example.com', timezone: 'Europe/London' },
			}),
		);
		expect(() =>
			GosquaredEndpointInputSchemas['account.createSite'].parse({
				domain_name: 'example.com',
			}),
		).toThrow();
	});

	it('tracking.trackPageview requires visitor_id', () => {
		expect(() =>
			GosquaredEndpointInputSchemas['tracking.trackPageview'].parse({
				page: { url: 'https://example.com' },
			}),
		).toThrow();
	});

	it('tracking.identify accepts the documented nulls', async () => {
		await Tracking.identify(buildCtx(), {
			person_id: 'email:corsair-tests@inkboxmail.com',
			properties: {
				name: null,
				phone: null,
				first_name: null,
				last_name: null,
			},
		});
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'/tracking/v1/properties',
			'test-api-key',
			expect.objectContaining({
				body: expect.objectContaining({
					properties: {
						name: null,
						phone: null,
						first_name: null,
						last_name: null,
					},
				}),
			}),
		);
	});

	it('chat.sendMessage accepts from: bot', () => {
		expect(
			GosquaredEndpointInputSchemas['chat.sendMessage'].parse({
				chat_id: 'c1',
				content: 'hi',
				from: 'bot',
			}).from,
		).toBe('bot');
	});

	it('people.getPeople folds order into sort and never sends order', async () => {
		await People.getPeople(buildCtx(), { order: 'asc' });
		let query = mockMakeRequest.mock.calls[0]?.[2]?.query;
		expect(query?.sort).toBe('last.seen:asc');
		expect(query).not.toHaveProperty('order');

		mockMakeRequest.mockClear();
		await People.getPeople(buildCtx(), {
			sort: 'created_at:desc',
			order: 'asc',
		});
		query = mockMakeRequest.mock.calls[0]?.[2]?.query;
		expect(query?.sort).toBe('created_at:asc');
	});

	it.each([
		['getBrowsers', '/now/v3/browsers'],
		['getCountries', '/now/v3/countries'],
		['getPlatforms', '/now/v3/platforms'],
		['getGeo', '/now/v3/geo'],
	] as const)('now.%s forwards limit (offset,count)', async (name, path) => {
		await Now[name](buildCtx(), { limit: '5,10' });
		expect(mockMakeRequest).toHaveBeenCalledWith(
			path,
			'test-api-key',
			expect.objectContaining({
				query: expect.objectContaining({ limit: '5,10' }),
			}),
		);
	});

	it('now.getCampaigns still rejects limit (the API has none)', () => {
		expect(() =>
			GosquaredEndpointInputSchemas['now.getCampaigns'].parse({ limit: 5 }),
		).toThrow();
	});
});

describe('people.deletePerson', () => {
	it('sends DELETE /people/v1/people/{id} with the id encoded and blacklist forwarded', async () => {
		mockMakeRequest.mockResolvedValue(undefined);
		const res = await People.deletePerson(buildCtx(), {
			person_id: 'email:corsair-tests@inkboxmail.com',
			blacklist: false,
		});
		expect(res).toEqual({});
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'/people/v1/people/email%3Acorsair-tests%40inkboxmail.com',
			'test-api-key',
			{
				method: 'DELETE',
				query: { blacklist: false },
				siteToken: 'GSN-STORED-SITE',
			},
		);
	});

	it('is marked destructive', () => {
		expect(gosquaredEndpointMeta['people.deletePerson'].riskLevel).toBe(
			'destructive',
		);
	});
});

describe('error redaction', () => {
	it('masks an email address in the request path', () => {
		const err = new ApiError(
			{
				method: 'GET',
				url: 'https://api.gosquared.com/chat/v1/chats/email%3Ajon%40example.com?api_key=k&site_token=t',
			},
			{
				url: 'https://api.gosquared.com/chat/v1/chats/email%3Ajon%40example.com?api_key=k&site_token=t',
				ok: false,
				status: 404,
				statusText: 'Not Found',
				body: { code: 4004, message: 'Not found' },
			},
			'Not Found',
		);
		const sanitized = sanitizeError(err) as ApiError;
		expect(sanitized.url).not.toContain('example.com');
		expect(sanitized.request.url).not.toContain('example.com');
		expect(sanitized.url).toContain('/chat/v1/chats/');
		expect(sanitized.status).toBe(404);
	});

	it('drops chat message text from the request body', () => {
		const err = new ApiError(
			{
				method: 'POST',
				url: 'https://api.gosquared.com/chat/v1/chats/c1/messages',
				body: { content: 'my private message' },
			},
			{
				url: 'https://api.gosquared.com/chat/v1/chats/c1/messages',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: { code: 4000, message: 'bad' },
			},
			'Bad Request',
		);
		expect(JSON.stringify(sanitizeError(err))).not.toContain('private message');
	});
});

describe('round 3 review fixes', () => {
	it('masks an email address inside a query value such as People filters', () => {
		const url =
			'https://api.gosquared.com/people/v1/people?filters=%5B%7B%22key%22%3A%22property%22%2C%22path%22%3A%22email%22%2C%22value%22%3A%22alice%40example.com%22%7D%5D&limit=10';
		const err = new ApiError(
			{ method: 'GET', url },
			{ url, ok: false, status: 400, statusText: 'Bad Request', body: {} },
			'Bad Request',
		);
		const sanitized = sanitizeError(err) as ApiError;
		expect(decodeURIComponent(sanitized.url)).not.toContain('alice');
		expect(decodeURIComponent(sanitized.request.url)).not.toContain('alice');
		expect(sanitized.url).toContain('limit=10');
	});

	it('tracking.trackEvent keeps the event name out of the completion event', async () => {
		const { logEventFromContext } = jest.requireMock('corsair/core') as {
			logEventFromContext: jest.Mock;
		};
		logEventFromContext.mockClear();
		mockMakeRequest.mockResolvedValue({ success: true });
		await Tracking.trackEvent(buildCtx(), {
			event: { name: 'Signup alice@example.com' },
		});
		expect(JSON.stringify(logEventFromContext.mock.calls)).not.toContain(
			'alice',
		);
	});

	it('people.getPeople accepts and forwards the documented query term', async () => {
		await People.getPeople(buildCtx(), { query: 'Acme' });
		expect(mockMakeRequest.mock.calls[0]?.[2]?.query).toEqual(
			expect.objectContaining({ query: 'Acme' }),
		);
	});

	it('tracking.trackTransaction accepts a transaction without an id', () => {
		expect(() =>
			GosquaredEndpointInputSchemas['tracking.trackTransaction'].parse({
				visitor_id: 'visitor-1',
				transaction: { items: [{ name: 'Widget', price: 10 }] },
			}),
		).not.toThrow();
	});

	it('now.getTimeSeries accepts and forwards from, to, interval and dateFormat', async () => {
		await Now.getTimeSeries(buildCtx(), {
			from: '2026-11-14',
			to: '2026-11-15',
			interval: '15min',
			dateFormat: 'YYYY-MM-DD',
		});
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'/now/v3/timeSeries',
			'test-api-key',
			expect.objectContaining({
				query: expect.objectContaining({
					from: '2026-11-14',
					to: '2026-11-15',
					interval: '15min',
					dateFormat: 'YYYY-MM-DD',
				}),
			}),
		);
	});

	it('now.getCampaigns still takes no time-series fields', () => {
		expect(() =>
			GosquaredEndpointInputSchemas['now.getCampaigns'].parse({
				interval: '15min',
			}),
		).toThrow();
	});
});
