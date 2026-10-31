import { makeEsputnikRequest } from './client';
import {
	accountEndpoints,
	accountExtendedEndpoints,
	appInboxEndpoints,
	batchTwoRemainderEndpoints,
	broadcastEndpoints,
	contactEndpoints,
	emailEndpoints,
	eventEndpoints,
	finalBatchEndpoints,
	interfaceEndpoints,
	mobilePushEndpoints,
	orderEndpoints,
	smsEndpoints,
	telegramBotEndpoints,
	viberEndpoints,
} from './endpoints';
import type { EsputnikContext } from './index';

jest.mock('./client', () => ({ makeEsputnikRequest: jest.fn() }));

const request = jest.mocked(makeEsputnikRequest);
const ctx = { key: 'test-api-key' } as EsputnikContext;

beforeEach(() => {
	request.mockResolvedValue({});
});
afterEach(() => jest.clearAllMocks());

describe('eSputnik routes', () => {
	it('gets account information', async () => {
		await accountEndpoints.getAccountInfo(ctx, {});
		expect(request).toHaveBeenCalledWith(
			'/api/v1/account/info',
			'test-api-key',
			{},
		);
	});

	it('creates contacts with a JSON body', async () => {
		const input = {
			channels: [{ type: 'email', value: 'person@example.com' }],
			address: { city: 'London' },
			fields: { customerTier: 'gold' },
		};
		await contactEndpoints.addContact(ctx, input);
		expect(request).toHaveBeenCalledWith('/api/v1/contact', 'test-api-key', {
			method: 'POST',
			body: input,
		});
	});

	it('updates a contact using its path ID and body fields', async () => {
		await contactEndpoints.updateContact(ctx, {
			id: 42,
			channels: [{ type: 'email', value: 'person@example.com' }],
			address: { city: 'London' },
			fields: { customerTier: 'gold' },
		});
		expect(request).toHaveBeenCalledWith('/api/v1/contact/42', 'test-api-key', {
			method: 'PUT',
			body: {
				channels: [{ type: 'email', value: 'person@example.com' }],
				address: { city: 'London' },
				fields: { customerTier: 'gold' },
			},
		});
	});

	it('searches contacts with provider query names', async () => {
		await contactEndpoints.searchContacts(ctx, {
			email: 'person@example.com',
			maxrows: 100,
		});
		expect(request).toHaveBeenCalledWith('/api/v1/contacts', 'test-api-key', {
			query: { email: 'person@example.com', maxrows: 100 },
		});
	});

	it('routes the remaining batch families to documented paths', async () => {
		await contactEndpoints.getContactIdByToken(ctx, {
			app_uuid: 'app',
			token_id: 'token',
		});
		await accountExtendedEndpoints.getOrganisationBalanceHistory(ctx, {});
		await orderEndpoints.ordersBulkInsert(ctx, {});
		await eventEndpoints.registerEvent(ctx, {});
		await eventEndpoints.sendHistoryEvents(ctx, {});
		await eventEndpoints.removeHistoryEvents(ctx, {});
		await emailEndpoints.searchEmails(ctx, {});
		await emailEndpoints.getEmailMessageViewLink(ctx, { id: 1 });
		await emailEndpoints.sendPreparedMessage(ctx, {});
		await emailEndpoints.addEmail(ctx, {
			name: 'Welcome',
			from: 'sender@example.com',
			subject: 'Hi',
			htmlText: '<p>Hi</p>',
		});
		await emailEndpoints.getEmail(ctx, { id: 1 });
		await emailEndpoints.updateMessage(ctx, {
			id: 1,
			name: 'Welcome',
			from: 'sender@example.com',
			subject: 'Hi',
			htmlText: '<p>Hi</p>',
		});
		await emailEndpoints.deleteEmail(ctx, { id: 1 });
		await emailEndpoints.updateTranslatedMessage(ctx, {
			id: 1,
			language: 'en',
			name: 'Welcome',
			from: 'sender@example.com',
			subject: 'Hi',
			htmlText: '<p>Hi</p>',
		});
		await emailEndpoints.deleteTranslatedEmail(ctx, { id: 1, language: 'en' });
		await emailEndpoints.sendEmail(ctx, {});

		expect(request).toHaveBeenCalledWith(
			'/api/v1/contact/token/app/token/contactId',
			'test-api-key',
			{},
		);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/balance/history',
			'test-api-key',
			{ query: {} },
		);
		expect(request).toHaveBeenCalledWith('/api/v1/orders', 'test-api-key', {
			method: 'POST',
			body: {},
		});
		expect(request).toHaveBeenCalledWith('/api/v3/event', 'test-api-key', {
			method: 'POST',
			body: {},
		});
		expect(request).toHaveBeenCalledWith(
			'/api/v3/past_events',
			'test-api-key',
			{
				method: 'POST',
				body: {},
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/messages/email',
			'test-api-key',
			{
				method: 'POST',
				body: {
					name: 'Welcome',
					from: 'sender@example.com',
					subject: 'Hi',
					htmlText: '<p>Hi</p>',
				},
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/messages/email/1',
			'test-api-key',
			{},
		);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/messages/email/1',
			'test-api-key',
			{
				method: 'PUT',
				body: {
					name: 'Welcome',
					from: 'sender@example.com',
					subject: 'Hi',
					htmlText: '<p>Hi</p>',
				},
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/messages/email/1',
			'test-api-key',
			{ method: 'DELETE' },
		);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/messages/email/1/en',
			'test-api-key',
			{
				method: 'PUT',
				body: {
					name: 'Welcome',
					from: 'sender@example.com',
					subject: 'Hi',
					htmlText: '<p>Hi</p>',
				},
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/messages/email/1/en',
			'test-api-key',
			{ method: 'DELETE' },
		);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/message/email',
			'test-api-key',
			{
				method: 'POST',
				body: {},
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/past_events',
			'test-api-key',
			{
				method: 'DELETE',
				body: {},
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/messages/email',
			'test-api-key',
			{
				query: {},
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/messages/email/1/view',
			'test-api-key',
			{},
		);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/messages/send',
			'test-api-key',
			{
				method: 'POST',
				body: {},
			},
		);
	});

	it('routes Batch 2 message families to their documented resources', async () => {
		await mobilePushEndpoints.searchMobilePushMessages(ctx, {});
		await viberEndpoints.search(ctx, {});
		await appInboxEndpoints.search(ctx, {});
		await telegramBotEndpoints.search(ctx, {});
		await smsEndpoints.search(ctx, {});
		await broadcastEndpoints.getBroadcasts(ctx, {});
		await interfaceEndpoints.getSmsInterfaces(ctx);
		await interfaceEndpoints.getEmailInterfaces(ctx);

		expect(request).toHaveBeenCalledWith(
			'/api/v1/messages/mobilepush',
			'test-api-key',
			{ query: {} },
		);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/messages/viber',
			'test-api-key',
			{ query: {} },
		);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/messages/appinbox',
			'test-api-key',
			{ query: {} },
		);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/messages/telegrambot',
			'test-api-key',
			{ query: {} },
		);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/messages/sms',
			'test-api-key',
			{ query: {} },
		);
		expect(request).toHaveBeenCalledWith('/api/v1/broadcasts', 'test-api-key', {
			query: {},
		});
		expect(request).toHaveBeenCalledWith(
			'/api/v1/interfaces/sms',
			'test-api-key',
			{},
		);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/interfaces/email',
			'test-api-key',
			{},
		);
	});

	it('encodes mobile push token path segments', async () => {
		await contactEndpoints.getContactIdByToken(ctx, {
			app_uuid: 'app/id',
			token_id: 'token?fragment',
		});

		expect(request).toHaveBeenCalledWith(
			'/api/v1/contact/token/app%2Fid/token%3Ffragment/contactId',
			'test-api-key',
			{},
		);
	});

	it('asserts every final-batch request contract', async () => {
		await batchTwoRemainderEndpoints.updateTranslatedViberMessage(ctx, {
			id: 1,
			language: 'en',
		});
		await batchTwoRemainderEndpoints.deleteTranslatedViberMessage(ctx, {
			id: 1,
			language: 'en',
		});
		await batchTwoRemainderEndpoints.updateTranslatedAppInboxMessage(ctx, {
			id: 1,
			language: 'en',
		});
		await batchTwoRemainderEndpoints.deleteTranslatedAppInboxMessage(ctx, {
			id: 1,
			language: 'en',
		});
		await batchTwoRemainderEndpoints.updateTranslatedTelegramMessage(ctx, {
			id: 1,
			language: 'en',
		});
		await batchTwoRemainderEndpoints.deleteTranslatedTelegramMessage(ctx, {
			id: 1,
			language: 'en',
		});
		await batchTwoRemainderEndpoints.addSmsMessage(ctx, {});
		await batchTwoRemainderEndpoints.sendSms(ctx, {});
		await batchTwoRemainderEndpoints.cancelBroadcast(ctx, { id: 1 });
		await finalBatchEndpoints.contactActivity(ctx, { dateFrom: '2024-01-01' });
		await finalBatchEndpoints.contactMessages(ctx, { dateFrom: '2024-01-01' });
		await finalBatchEndpoints.getTokenActivated(ctx, {
			app_uuid: 'app',
			token_id: 'token',
		});
		await finalBatchEndpoints.changeTokenActivated(ctx, {
			app_uuid: 'app',
			token_id: 'token',
			active: true,
		});
		await finalBatchEndpoints.getDomains(ctx);
		await finalBatchEndpoints.createDomain(ctx, { domain: 'example.com' });
		await finalBatchEndpoints.getScript(ctx);
		await finalBatchEndpoints.getWebPushDomains(ctx);
		await finalBatchEndpoints.addWebPushDomain(ctx, {});
		await finalBatchEndpoints.deleteWebPushDomain(ctx, {
			domain: 'example.com',
		});
		await finalBatchEndpoints.getWebPushScript(ctx, { domain: 'example.com' });
		await finalBatchEndpoints.getProductFeedsConfiguration(ctx);
		await finalBatchEndpoints.configureProductFeeds(ctx, {});
		await finalBatchEndpoints.addAppTokens(ctx, {});
		await finalBatchEndpoints.muteAppToken(ctx, {});
		await finalBatchEndpoints.unmuteAppToken(ctx, {});
		await finalBatchEndpoints.getSubscriptionCategories(ctx);
		await finalBatchEndpoints.getPromocodes(ctx, {});
		await finalBatchEndpoints.getPromocodesCount(ctx);
		await finalBatchEndpoints.insertPromocodes(ctx, {});
		await finalBatchEndpoints.getPreprocessorFileStatus(ctx, {
			sessionId: 'session',
		});
		await finalBatchEndpoints.updatePreprocessorFile(ctx, {});
		await finalBatchEndpoints.uploadPreprocessorFile(ctx, {});
		await finalBatchEndpoints.generateApiToken(ctx, {});
		await finalBatchEndpoints.getInteractionStatus(ctx, {});
		await finalBatchEndpoints.sendViber(ctx, {});
		await finalBatchEndpoints.sendAppInbox(ctx, {});
		await finalBatchEndpoints.sendTelegramBot(ctx, {});
		await finalBatchEndpoints.updateTranslatedSmsMessage(ctx, {
			id: 1,
			language: 'en',
		});
		await finalBatchEndpoints.deleteTranslatedSmsMessage(ctx, {
			id: 1,
			language: 'en',
		});

		const paths = request.mock.calls.map(([path]) => path);
		expect(paths).toEqual(
			expect.arrayContaining([
				'/api/v1/messages/viber/1/en',
				'/api/v1/messages/appinbox/1/en',
				'/api/v1/messages/telegrambot/1/en',
				'/api/v1/contact/token/activated/app/token',
				'/api/v1/site/domains',
				'/api/v1/site/webpush/domains',
				'/api/v2/contacts/activity',
				'/api/v2/contacts/messages',
				'/api/v1/message/viber',
				'/api/v1/message/appinbox',
				'/api/v1/message/telegrambot',
				'/api/v1/messages/sms/1/en',
			]),
		);
		expect(request).toHaveBeenCalledWith(
			'/api/v1/broadcasts/1',
			'test-api-key',
			{
				method: 'DELETE',
			},
		);
	});
});
