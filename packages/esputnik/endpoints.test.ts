import { makeEsputnikRequest } from './client';
import {
	accountEndpoints,
	appEndpoints,
	broadcastEndpoints,
	contactEndpoints,
	emailEndpoints,
	messageEndpoints,
	preprocessorEndpoints,
	productFeedEndpoints,
	siteEndpoints,
	telegramBotEndpoints,
} from './endpoints';
import type { EsputnikContext } from './index';

jest.mock('./client', () => ({ makeEsputnikRequest: jest.fn() }));

const request = jest.mocked(makeEsputnikRequest);
const ctx = { key: 'test-api-key' } as EsputnikContext;

beforeEach(() => {
	request.mockResolvedValue({});
});
afterEach(() => jest.clearAllMocks());

function lastCall() {
	const call = request.mock.calls.at(-1);
	if (!call) throw new Error('makeEsputnikRequest was not called');
	const [path, key, options] = call;
	expect(key).toBe('test-api-key');
	return { path, options };
}

describe('eSputnik routes', () => {
	it('gets account information', async () => {
		await accountEndpoints.getAccountInfo(ctx, {});
		expect(lastCall()).toEqual({ path: '/api/v1/account/info', options: {} });
	});

	it('creates contacts with id/value additional fields', async () => {
		const input = {
			channels: [{ type: 'email', value: 'person@example.com' }],
			address: { town: 'Toulouse' },
			fields: [{ id: 79814, value: 'gold' }],
		};
		await contactEndpoints.addContact(ctx, input);
		expect(lastCall()).toEqual({
			path: '/api/v1/contact',
			options: { method: 'POST', body: input },
		});
	});

	it('updates a contact using its path ID and body fields', async () => {
		await contactEndpoints.updateContact(ctx, {
			id: 42,
			channels: [{ type: 'email', value: 'person@example.com' }],
		});
		expect(lastCall()).toEqual({
			path: '/api/v1/contact/42',
			options: {
				method: 'PUT',
				body: { channels: [{ type: 'email', value: 'person@example.com' }] },
			},
		});
	});

	it('searches contacts with provider query names', async () => {
		await contactEndpoints.searchContacts(ctx, {
			email: 'person@example.com',
			maxrows: 100,
		});
		expect(lastCall()).toEqual({
			path: '/api/v1/contacts',
			options: { query: { email: 'person@example.com', maxrows: 100 } },
		});
	});

	it('searches email messages with the documented search parameter', async () => {
		await emailEndpoints.searchEmails(ctx, { search: 'welcome', maxrows: 5 });
		expect(lastCall()).toEqual({
			path: '/api/v1/messages/email',
			options: { query: { search: 'welcome', maxrows: 5 } },
		});
	});

	it('gets the email view link from /viewLink', async () => {
		await emailEndpoints.getEmailMessageViewLink(ctx, { id: 5 });
		expect(lastCall()).toEqual({
			path: '/api/v1/messages/email/5/viewLink',
			options: {},
		});
	});

	it('sends prepared messages through /message/{id}/smartsend', async () => {
		await messageEndpoints.sendPreparedMessage(ctx, {
			id: 7,
			recipients: [{ locator: 'person@example.com' }],
			email: true,
		});
		expect(lastCall()).toEqual({
			path: '/api/v1/message/7/smartsend',
			options: {
				method: 'POST',
				body: { recipients: [{ locator: 'person@example.com' }], email: true },
			},
		});
	});

	it('reports interaction status with PUT /interactions/{id}/status', async () => {
		await messageEndpoints.updateInteractionStatus(ctx, {
			interactionId: '2E2E831C/486C',
			status: 'OPENED',
		});
		expect(lastCall()).toEqual({
			path: '/api/v1/interactions/2E2E831C%2F486C/status',
			options: { method: 'PUT', body: { status: 'OPENED' } },
		});
	});

	it('uses /messages/telegram for Telegram bot messages', async () => {
		await telegramBotEndpoints.searchTelegramBotMessages(ctx, {});
		expect(lastCall().path).toBe('/api/v1/messages/telegram');
		await telegramBotEndpoints.getTelegramBotMessage(ctx, { id: 3 });
		expect(lastCall().path).toBe('/api/v1/messages/telegram/3');
		await telegramBotEndpoints.deleteTranslatedTelegramMessage(ctx, {
			id: 3,
			language: 'uk',
		});
		expect(lastCall()).toEqual({
			path: '/api/v1/messages/telegram/3/uk',
			options: { method: 'DELETE' },
		});
	});

	it('uses the singular /broadcast route for one broadcast', async () => {
		await broadcastEndpoints.createBroadcast(ctx, {
			messageId: '123',
			groups: [5],
		});
		expect(lastCall()).toEqual({
			path: '/api/v1/broadcast',
			options: { method: 'POST', body: { messageId: '123', groups: [5] } },
		});
		await broadcastEndpoints.getBroadcast(ctx, { id: 'b/1' });
		expect(lastCall()).toEqual({
			path: '/api/v1/broadcast/b%2F1',
			options: {},
		});
		await broadcastEndpoints.cancelBroadcast(ctx, { id: 9 });
		expect(lastCall()).toEqual({
			path: '/api/v1/broadcast/9',
			options: { method: 'DELETE' },
		});
		await broadcastEndpoints.getBroadcasts(ctx, { maxrows: 10 });
		expect(lastCall()).toEqual({
			path: '/api/v1/broadcasts',
			options: { query: { maxrows: 10 } },
		});
	});

	it('reads and writes product feeds at /products/config', async () => {
		await productFeedEndpoints.getProductFeedsConfiguration(ctx, {});
		expect(lastCall()).toEqual({
			path: '/api/v1/products/config',
			options: {},
		});
		const feeds = [{ url: 'https://example.com/feed.xml', default: true }];
		await productFeedEndpoints.configureProductFeeds(ctx, { feeds });
		expect(lastCall()).toEqual({
			path: '/api/v1/products/config',
			options: { method: 'POST', body: { feeds } },
		});
	});

	it('scopes application tokens to the app UUID in the path', async () => {
		await appEndpoints.addAppTokens(ctx, {
			app_uuid: 'app/1',
			tokens: [{ token: 't1' }],
		});
		expect(lastCall()).toEqual({
			path: '/api/v1/apps/app%2F1/tokens',
			options: { method: 'POST', body: { tokens: [{ token: 't1' }] } },
		});
		await appEndpoints.muteAppToken(ctx, {
			app_uuid: 'app-1',
			token: 't1',
			duration: 60,
		});
		expect(lastCall()).toEqual({
			path: '/api/v1/apps/app-1/token/mute',
			options: { method: 'POST', body: { token: 't1', duration: 60 } },
		});
		await appEndpoints.unmuteAppToken(ctx, { app_uuid: 'app-1', token: 't1' });
		expect(lastCall()).toEqual({
			path: '/api/v1/apps/app-1/token/unmute',
			options: { method: 'POST', body: { token: 't1' } },
		});
	});

	it('uses the documented preprocessor file routes', async () => {
		await preprocessorEndpoints.uploadPreprocessorFile(ctx, {
			link: 'https://example.com/data.csv',
			preprocessorType: 'Key',
		});
		expect(lastCall()).toEqual({
			path: '/api/v1/preprocessor/file/upload',
			options: {
				method: 'POST',
				body: { link: 'https://example.com/data.csv', preprocessorType: 'Key' },
			},
		});
		await preprocessorEndpoints.updatePreprocessorFile(ctx, {
			fileId: 'f-1',
			link: 'https://example.com/data.csv',
		});
		expect(lastCall()).toEqual({
			path: '/api/v1/preprocessor/file/f-1',
			options: {
				method: 'POST',
				body: { link: 'https://example.com/data.csv' },
			},
		});
		await preprocessorEndpoints.getPreprocessorFileStatus(ctx, {
			sessionId: 's-1',
		});
		expect(lastCall()).toEqual({
			path: '/api/v1/preprocessor/file/s-1/status',
			options: {},
		});
	});

	it('lists subscription categories and generates tokens at the documented routes', async () => {
		await contactEndpoints.getSubscriptionCategories(ctx, {});
		expect(lastCall()).toEqual({ path: '/api/v1/subscriptions', options: {} });
		await accountEndpoints.generateApiToken(ctx, {});
		expect(lastCall()).toEqual({
			path: '/api/v1/auth/token',
			options: { method: 'POST' },
		});
	});

	it('encodes mobile push token path segments', async () => {
		await contactEndpoints.getContactIdByToken(ctx, {
			app_uuid: 'app/id',
			token_id: 'token?fragment',
		});
		expect(lastCall()).toEqual({
			path: '/api/v1/contact/token/app%2Fid/token%3Ffragment/contactId',
			options: {},
		});
	});

	it('returns no domains when eSputnik sends an empty body', async () => {
		request.mockResolvedValueOnce(undefined);
		await expect(siteEndpoints.getDomains(ctx, {})).resolves.toEqual([]);
		request.mockResolvedValueOnce([{ domain: 'example.com' }]);
		await expect(siteEndpoints.getDomains(ctx, {})).resolves.toEqual([
			{ domain: 'example.com' },
		]);
	});

	it('turns a single match sent as a bare object into a list', async () => {
		// messages/email search answered `{ "id": 4768507, ... }` live when
		// exactly one template matched.
		const template = { id: 4768507, name: 'Welcome' };
		request.mockResolvedValueOnce(template);
		await expect(
			emailEndpoints.searchEmails(ctx, { search: 'Welcome' }),
		).resolves.toEqual([template]);
		request.mockResolvedValueOnce([template]);
		await expect(emailEndpoints.searchEmails(ctx, {})).resolves.toEqual([
			template,
		]);
		request.mockResolvedValueOnce(undefined);
		await expect(contactEndpoints.searchContacts(ctx, {})).resolves.toEqual([]);
	});

	it('returns results envelopes with an array of results', async () => {
		// Live: {"results":{"contactId":3669451280,"email":"..."}}
		const result = { contactId: 1, email: 'person@example.com' };
		request.mockResolvedValueOnce({ results: result });
		await expect(
			contactEndpoints.getContactEmails(ctx, { ids: '1' }),
		).resolves.toEqual({ results: [result] });
		request.mockResolvedValueOnce({
			results: [{ status: 'OK' }, { status: 'ERROR' }],
		});
		await expect(
			messageEndpoints.sendPreparedMessage(ctx, {
				id: 7,
				recipients: [{ locator: 'person@example.com' }],
			}),
		).resolves.toEqual({ results: [{ status: 'OK' }, { status: 'ERROR' }] });
	});
});
