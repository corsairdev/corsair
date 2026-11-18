import type { EsputnikEndpoints } from '..';
import { makeEsputnikRequest } from '../client';
import type { EsputnikEndpointOutputs, JsonValue } from './types';

type RequestOptions = Parameters<typeof makeEsputnikRequest>[2];

// Each handler names its operation so the transport call returns that
// operation's declared response type.
const typedRequest = <K extends keyof EsputnikEndpointOutputs>(
	_operation: K,
	ctx: { key: string },
	path: string,
	options: RequestOptions,
) => makeEsputnikRequest<EsputnikEndpointOutputs[K]>(path, ctx.key, options);

type ListOperation = {
	[K in keyof EsputnikEndpointOutputs]: EsputnikEndpointOutputs[K] extends Array<unknown>
		? K
		: never;
}[keyof EsputnikEndpointOutputs];
type ListItem<K extends ListOperation> = EsputnikEndpointOutputs[K][number];

// Some list routes send a single match as a bare object (seen live on the
// email template search) and nothing as an empty body. Always return an array.
function toList<T>(value: T[] | T | undefined | null): T[] {
	if (value === undefined || value === null) return [];
	return Array.isArray(value) ? value : [value];
}

const listRequest = async <K extends ListOperation>(
	_operation: K,
	ctx: { key: string },
	path: string,
	options: RequestOptions,
): Promise<ListItem<K>[]> =>
	toList(
		await makeEsputnikRequest<ListItem<K>[] | ListItem<K> | undefined>(
			path,
			ctx.key,
			options,
		),
	);

// `{ results }` envelopes (contact emails, the send calls) hold an object
// for one result and an array for several; always return an array.
type ResultsEnvelope = { results?: JsonValue } & Record<string, JsonValue>;
const resultsRequest = async (
	ctx: { key: string },
	path: string,
	options: RequestOptions,
) => {
	const envelope = await makeEsputnikRequest<ResultsEnvelope | undefined>(
		path,
		ctx.key,
		options,
	);
	return { ...envelope, results: toList(envelope?.results) };
};

// String path values are encoded so `/`, `?` or `#` cannot change the route.
const segment = (value: string | number): string =>
	encodeURIComponent(String(value));

export const accountEndpoints: Pick<
	EsputnikEndpoints,
	| 'getAccountInfo'
	| 'getBalance'
	| 'getOrganisationBalanceHistory'
	| 'generateApiToken'
> = {
	getAccountInfo: (ctx) =>
		typedRequest('getAccountInfo', ctx, '/api/v1/account/info', {}),
	getBalance: (ctx) => typedRequest('getBalance', ctx, '/api/v1/balance', {}),
	getOrganisationBalanceHistory: (ctx, input) =>
		typedRequest(
			'getOrganisationBalanceHistory',
			ctx,
			'/api/v1/balance/history',
			{ query: input },
		),
	generateApiToken: (ctx) =>
		typedRequest('generateApiToken', ctx, '/api/v1/auth/token', {
			method: 'POST',
		}),
};

export const contactEndpoints: Pick<
	EsputnikEndpoints,
	| 'addContact'
	| 'getContact'
	| 'updateContact'
	| 'deleteContactById'
	| 'deleteContactByExternalCustomerId'
	| 'searchContacts'
	| 'subscribeContact'
	| 'contactsBulkUpdate'
	| 'fileContactsBulkUpdate'
	| 'getImportSessionStatus'
	| 'getContactEmails'
	| 'addToUnsubscribed'
	| 'deleteFromUnsubscribed'
	| 'getGroupContacts'
	| 'detachContactsFromGroup'
	| 'attachContactsToGroup'
	| 'searchGroups'
	| 'searchWorkflows'
	| 'getContactIdByToken'
	| 'getContactSubscriptionCategories'
	| 'changeContactSubscriptionCategories'
	| 'contactRecoms'
	| 'getAdditionalFields'
	| 'getSubscriptionCategories'
	| 'contactActivity'
	| 'contactMessages'
	| 'getTokenActivated'
	| 'changeTokenActivated'
> = {
	addContact: (ctx, input) =>
		typedRequest('addContact', ctx, '/api/v1/contact', {
			method: 'POST',
			body: input,
		}),
	getContact: (ctx, input) =>
		typedRequest('getContact', ctx, `/api/v1/contact/${input.id}`, {}),
	updateContact: (ctx, input) => {
		const { id, ...body } = input;
		return typedRequest('updateContact', ctx, `/api/v1/contact/${id}`, {
			method: 'PUT',
			body,
		});
	},
	deleteContactById: (ctx, input) => {
		const { id, ...query } = input;
		return typedRequest('deleteContactById', ctx, `/api/v1/contact/${id}`, {
			method: 'DELETE',
			query,
		});
	},
	deleteContactByExternalCustomerId: (ctx, input) =>
		typedRequest('deleteContactByExternalCustomerId', ctx, '/api/v1/contact', {
			method: 'DELETE',
			query: input,
		}),
	searchContacts: (ctx, input) =>
		listRequest('searchContacts', ctx, '/api/v1/contacts', { query: input }),
	subscribeContact: (ctx, input) =>
		typedRequest('subscribeContact', ctx, '/api/v1/contact/subscribe', {
			method: 'POST',
			body: input,
		}),
	contactsBulkUpdate: (ctx, input) =>
		typedRequest('contactsBulkUpdate', ctx, '/api/v1/contacts', {
			method: 'POST',
			body: input,
		}),
	fileContactsBulkUpdate: (ctx, input) =>
		typedRequest('fileContactsBulkUpdate', ctx, '/api/v1/contacts/upload', {
			method: 'POST',
			body: input,
		}),
	getImportSessionStatus: (ctx, input) =>
		typedRequest(
			'getImportSessionStatus',
			ctx,
			`/api/v1/importstatus/${segment(input.sessionId)}`,
			{},
		),
	getContactEmails: (ctx, input) =>
		resultsRequest(ctx, '/api/v1/contacts/email', {
			query: input,
		}),
	addToUnsubscribed: (ctx, input) =>
		typedRequest('addToUnsubscribed', ctx, '/api/v1/emails/unsubscribed/add', {
			method: 'POST',
			body: input,
		}),
	deleteFromUnsubscribed: (ctx, input) =>
		typedRequest(
			'deleteFromUnsubscribed',
			ctx,
			'/api/v1/emails/unsubscribed/delete',
			{ method: 'POST', body: input },
		),
	getGroupContacts: (ctx, input) => {
		const { id, ...query } = input;
		return listRequest(
			'getGroupContacts',
			ctx,
			`/api/v1/group/${id}/contacts`,
			{ query },
		);
	},
	detachContactsFromGroup: (ctx, input) => {
		const { id, ...body } = input;
		return typedRequest(
			'detachContactsFromGroup',
			ctx,
			`/api/v1/group/${id}/contacts/detach`,
			{ method: 'POST', body },
		);
	},
	attachContactsToGroup: (ctx, input) => {
		const { id, ...body } = input;
		return typedRequest(
			'attachContactsToGroup',
			ctx,
			`/api/v1/group/${id}/contacts/attach`,
			{ method: 'POST', body },
		);
	},
	searchGroups: (ctx, input) =>
		listRequest('searchGroups', ctx, '/api/v1/groups', { query: input }),
	searchWorkflows: (ctx, input) =>
		listRequest('searchWorkflows', ctx, '/api/v1/workflows', { query: input }),
	getContactIdByToken: (ctx, input) =>
		typedRequest(
			'getContactIdByToken',
			ctx,
			`/api/v1/contact/token/${segment(input.app_uuid)}/${segment(input.token_id)}/contactId`,
			{},
		),
	getContactSubscriptionCategories: (ctx, input) =>
		listRequest(
			'getContactSubscriptionCategories',
			ctx,
			`/api/v1/contact/${input.id}/subscriptions`,
			{},
		),
	changeContactSubscriptionCategories: (ctx, input) => {
		const { id, ...body } = input;
		return typedRequest(
			'changeContactSubscriptionCategories',
			ctx,
			`/api/v1/contact/${id}/subscriptions`,
			{ method: 'PUT', body },
		);
	},
	contactRecoms: (ctx, input) => {
		const { dataSourceId, ...query } = input;
		return listRequest(
			'contactRecoms',
			ctx,
			`/api/v2/contacts/recoms/${dataSourceId}`,
			{ query },
		);
	},
	getAdditionalFields: (ctx) =>
		typedRequest('getAdditionalFields', ctx, '/api/v1/additionalfields', {}),
	getSubscriptionCategories: (ctx) =>
		listRequest('getSubscriptionCategories', ctx, '/api/v1/subscriptions', {}),
	contactActivity: (ctx, input) =>
		listRequest('contactActivity', ctx, '/api/v2/contacts/activity', {
			query: input,
		}),
	contactMessages: (ctx, input) =>
		listRequest('contactMessages', ctx, '/api/v2/contacts/messages', {
			query: input,
		}),
	getTokenActivated: (ctx, input) =>
		typedRequest(
			'getTokenActivated',
			ctx,
			`/api/v1/contact/token/activated/${segment(input.app_uuid)}/${segment(input.token_id)}`,
			{},
		),
	changeTokenActivated: (ctx, input) => {
		const { app_uuid, token_id, ...body } = input;
		return typedRequest(
			'changeTokenActivated',
			ctx,
			`/api/v1/contact/token/activated/${segment(app_uuid)}/${segment(token_id)}`,
			{ method: 'PUT', body },
		);
	},
};

export const orderEndpoints: Pick<EsputnikEndpoints, 'ordersBulkInsert'> = {
	ordersBulkInsert: (ctx, input) =>
		typedRequest('ordersBulkInsert', ctx, '/api/v1/orders', {
			method: 'POST',
			body: input,
		}),
};

export const eventEndpoints: Pick<
	EsputnikEndpoints,
	'registerEvent' | 'sendHistoryEvents' | 'removeHistoryEvents'
> = {
	registerEvent: (ctx, input) =>
		typedRequest('registerEvent', ctx, '/api/v3/event', {
			method: 'POST',
			body: input,
		}),
	sendHistoryEvents: (ctx, input) =>
		typedRequest('sendHistoryEvents', ctx, '/api/v3/past_events', {
			method: 'POST',
			body: input,
		}),
	removeHistoryEvents: (ctx, input) =>
		typedRequest('removeHistoryEvents', ctx, '/api/v1/past_events', {
			method: 'DELETE',
			body: input,
		}),
};

export const emailEndpoints: Pick<
	EsputnikEndpoints,
	| 'searchEmails'
	| 'getEmailMessageViewLink'
	| 'addEmail'
	| 'getEmail'
	| 'updateMessage'
	| 'deleteEmail'
	| 'updateTranslatedMessage'
	| 'deleteTranslatedEmail'
	| 'sendEmail'
> = {
	searchEmails: (ctx, input) =>
		listRequest('searchEmails', ctx, '/api/v1/messages/email', {
			query: input,
		}),
	getEmailMessageViewLink: (ctx, input) =>
		typedRequest(
			'getEmailMessageViewLink',
			ctx,
			`/api/v1/messages/email/${input.id}/viewLink`,
			{},
		),
	addEmail: (ctx, input) =>
		typedRequest('addEmail', ctx, '/api/v1/messages/email', {
			method: 'POST',
			body: input,
		}),
	getEmail: (ctx, input) =>
		typedRequest('getEmail', ctx, `/api/v1/messages/email/${input.id}`, {}),
	updateMessage: (ctx, input) => {
		const { id, ...body } = input;
		return typedRequest('updateMessage', ctx, `/api/v1/messages/email/${id}`, {
			method: 'PUT',
			body,
		});
	},
	deleteEmail: (ctx, input) =>
		typedRequest('deleteEmail', ctx, `/api/v1/messages/email/${input.id}`, {
			method: 'DELETE',
		}),
	updateTranslatedMessage: (ctx, input) => {
		const { id, language, ...body } = input;
		return typedRequest(
			'updateTranslatedMessage',
			ctx,
			`/api/v1/messages/email/${id}/${segment(language)}`,
			{ method: 'PUT', body },
		);
	},
	deleteTranslatedEmail: (ctx, input) =>
		typedRequest(
			'deleteTranslatedEmail',
			ctx,
			`/api/v1/messages/email/${input.id}/${segment(input.language)}`,
			{ method: 'DELETE' },
		),
	sendEmail: (ctx, input) =>
		resultsRequest(ctx, '/api/v1/message/email', {
			method: 'POST',
			body: input,
		}),
};

export const mobilePushEndpoints: Pick<
	EsputnikEndpoints,
	| 'searchMobilePushMessages'
	| 'addMobilePushMessage'
	| 'getMobilePushMessage'
	| 'updateBaseMobilePushMessage'
	| 'deleteMobilePushMessage'
	| 'updateTranslatedMobilePushMessage'
	| 'deleteTranslatedMobilePushMessage'
> = {
	searchMobilePushMessages: (ctx, input) =>
		listRequest(
			'searchMobilePushMessages',
			ctx,
			'/api/v1/messages/mobilepush',
			{ query: input },
		),
	addMobilePushMessage: (ctx, input) =>
		typedRequest('addMobilePushMessage', ctx, '/api/v1/messages/mobilepush', {
			method: 'POST',
			body: input,
		}),
	getMobilePushMessage: (ctx, input) =>
		typedRequest(
			'getMobilePushMessage',
			ctx,
			`/api/v1/messages/mobilepush/${input.id}`,
			{},
		),
	updateBaseMobilePushMessage: (ctx, input) => {
		const { id, ...body } = input;
		return typedRequest(
			'updateBaseMobilePushMessage',
			ctx,
			`/api/v1/messages/mobilepush/${id}`,
			{ method: 'PUT', body },
		);
	},
	deleteMobilePushMessage: (ctx, input) =>
		typedRequest(
			'deleteMobilePushMessage',
			ctx,
			`/api/v1/messages/mobilepush/${input.id}`,
			{ method: 'DELETE' },
		),
	updateTranslatedMobilePushMessage: (ctx, input) => {
		const { id, language, ...body } = input;
		return typedRequest(
			'updateTranslatedMobilePushMessage',
			ctx,
			`/api/v1/messages/mobilepush/${id}/${segment(language)}`,
			{ method: 'PUT', body },
		);
	},
	deleteTranslatedMobilePushMessage: (ctx, input) =>
		typedRequest(
			'deleteTranslatedMobilePushMessage',
			ctx,
			`/api/v1/messages/mobilepush/${input.id}/${segment(input.language)}`,
			{ method: 'DELETE' },
		),
};

export const viberEndpoints: Pick<
	EsputnikEndpoints,
	| 'searchViberMessages'
	| 'addViberMessage'
	| 'getViberMessage'
	| 'updateBaseViberMessage'
	| 'deleteViberMessage'
	| 'updateTranslatedViberMessage'
	| 'deleteTranslatedViberMessage'
	| 'sendViber'
> = {
	searchViberMessages: (ctx, input) =>
		listRequest('searchViberMessages', ctx, '/api/v1/messages/viber', {
			query: input,
		}),
	addViberMessage: (ctx, input) =>
		typedRequest('addViberMessage', ctx, '/api/v1/messages/viber', {
			method: 'POST',
			body: input,
		}),
	getViberMessage: (ctx, input) =>
		typedRequest(
			'getViberMessage',
			ctx,
			`/api/v1/messages/viber/${input.id}`,
			{},
		),
	updateBaseViberMessage: (ctx, input) => {
		const { id, ...body } = input;
		return typedRequest(
			'updateBaseViberMessage',
			ctx,
			`/api/v1/messages/viber/${id}`,
			{ method: 'PUT', body },
		);
	},
	deleteViberMessage: (ctx, input) =>
		typedRequest(
			'deleteViberMessage',
			ctx,
			`/api/v1/messages/viber/${input.id}`,
			{ method: 'DELETE' },
		),
	updateTranslatedViberMessage: (ctx, input) => {
		const { id, language, ...body } = input;
		return typedRequest(
			'updateTranslatedViberMessage',
			ctx,
			`/api/v1/messages/viber/${id}/${segment(language)}`,
			{ method: 'PUT', body },
		);
	},
	deleteTranslatedViberMessage: (ctx, input) =>
		typedRequest(
			'deleteTranslatedViberMessage',
			ctx,
			`/api/v1/messages/viber/${input.id}/${segment(input.language)}`,
			{ method: 'DELETE' },
		),
	sendViber: (ctx, input) =>
		resultsRequest(ctx, '/api/v1/message/viber', {
			method: 'POST',
			body: input,
		}),
};

export const appInboxEndpoints: Pick<
	EsputnikEndpoints,
	| 'searchAppInboxMessages'
	| 'addAppInboxMessage'
	| 'getAppInboxMessage'
	| 'updateBaseAppInboxMessage'
	| 'deleteAppInboxMessage'
	| 'updateTranslatedAppInboxMessage'
	| 'deleteTranslatedAppInboxMessage'
> = {
	searchAppInboxMessages: (ctx, input) =>
		listRequest('searchAppInboxMessages', ctx, '/api/v1/messages/appinbox', {
			query: input,
		}),
	addAppInboxMessage: (ctx, input) =>
		typedRequest('addAppInboxMessage', ctx, '/api/v1/messages/appinbox', {
			method: 'POST',
			body: input,
		}),
	getAppInboxMessage: (ctx, input) =>
		typedRequest(
			'getAppInboxMessage',
			ctx,
			`/api/v1/messages/appinbox/${input.id}`,
			{},
		),
	updateBaseAppInboxMessage: (ctx, input) => {
		const { id, ...body } = input;
		return typedRequest(
			'updateBaseAppInboxMessage',
			ctx,
			`/api/v1/messages/appinbox/${id}`,
			{ method: 'PUT', body },
		);
	},
	deleteAppInboxMessage: (ctx, input) =>
		typedRequest(
			'deleteAppInboxMessage',
			ctx,
			`/api/v1/messages/appinbox/${input.id}`,
			{ method: 'DELETE' },
		),
	updateTranslatedAppInboxMessage: (ctx, input) => {
		const { id, language, ...body } = input;
		return typedRequest(
			'updateTranslatedAppInboxMessage',
			ctx,
			`/api/v1/messages/appinbox/${id}/${segment(language)}`,
			{ method: 'PUT', body },
		);
	},
	deleteTranslatedAppInboxMessage: (ctx, input) =>
		typedRequest(
			'deleteTranslatedAppInboxMessage',
			ctx,
			`/api/v1/messages/appinbox/${input.id}/${segment(input.language)}`,
			{ method: 'DELETE' },
		),
};

export const telegramBotEndpoints: Pick<
	EsputnikEndpoints,
	| 'searchTelegramBotMessages'
	| 'addTelegramBotMessage'
	| 'getTelegramBotMessage'
	| 'updateBaseTelegramBotMessage'
	| 'deleteTelegramBotMessage'
	| 'updateTranslatedTelegramMessage'
	| 'deleteTranslatedTelegramMessage'
> = {
	searchTelegramBotMessages: (ctx, input) =>
		listRequest('searchTelegramBotMessages', ctx, '/api/v1/messages/telegram', {
			query: input,
		}),
	addTelegramBotMessage: (ctx, input) =>
		typedRequest('addTelegramBotMessage', ctx, '/api/v1/messages/telegram', {
			method: 'POST',
			body: input,
		}),
	getTelegramBotMessage: (ctx, input) =>
		typedRequest(
			'getTelegramBotMessage',
			ctx,
			`/api/v1/messages/telegram/${input.id}`,
			{},
		),
	updateBaseTelegramBotMessage: (ctx, input) => {
		const { id, ...body } = input;
		return typedRequest(
			'updateBaseTelegramBotMessage',
			ctx,
			`/api/v1/messages/telegram/${id}`,
			{ method: 'PUT', body },
		);
	},
	deleteTelegramBotMessage: (ctx, input) =>
		typedRequest(
			'deleteTelegramBotMessage',
			ctx,
			`/api/v1/messages/telegram/${input.id}`,
			{ method: 'DELETE' },
		),
	updateTranslatedTelegramMessage: (ctx, input) => {
		const { id, language, ...body } = input;
		return typedRequest(
			'updateTranslatedTelegramMessage',
			ctx,
			`/api/v1/messages/telegram/${id}/${segment(language)}`,
			{ method: 'PUT', body },
		);
	},
	deleteTranslatedTelegramMessage: (ctx, input) =>
		typedRequest(
			'deleteTranslatedTelegramMessage',
			ctx,
			`/api/v1/messages/telegram/${input.id}/${segment(input.language)}`,
			{ method: 'DELETE' },
		),
};

export const smsEndpoints: Pick<
	EsputnikEndpoints,
	| 'searchSmsMessages'
	| 'addSmsMessage'
	| 'getSms'
	| 'updateBaseSmsMessage'
	| 'deleteSmsMessage'
	| 'updateTranslatedSmsMessage'
	| 'deleteTranslatedSmsMessage'
	| 'sendSms'
> = {
	searchSmsMessages: (ctx, input) =>
		listRequest('searchSmsMessages', ctx, '/api/v1/messages/sms', {
			query: input,
		}),
	addSmsMessage: (ctx, input) =>
		typedRequest('addSmsMessage', ctx, '/api/v1/messages/sms', {
			method: 'POST',
			body: input,
		}),
	getSms: (ctx, input) =>
		typedRequest('getSms', ctx, `/api/v1/messages/sms/${input.id}`, {}),
	updateBaseSmsMessage: (ctx, input) => {
		const { id, ...body } = input;
		return typedRequest(
			'updateBaseSmsMessage',
			ctx,
			`/api/v1/messages/sms/${id}`,
			{ method: 'PUT', body },
		);
	},
	deleteSmsMessage: (ctx, input) =>
		typedRequest('deleteSmsMessage', ctx, `/api/v1/messages/sms/${input.id}`, {
			method: 'DELETE',
		}),
	updateTranslatedSmsMessage: (ctx, input) => {
		const { id, language, ...body } = input;
		return typedRequest(
			'updateTranslatedSmsMessage',
			ctx,
			`/api/v1/messages/sms/${id}/${segment(language)}`,
			{ method: 'PUT', body },
		);
	},
	deleteTranslatedSmsMessage: (ctx, input) =>
		typedRequest(
			'deleteTranslatedSmsMessage',
			ctx,
			`/api/v1/messages/sms/${input.id}/${segment(input.language)}`,
			{ method: 'DELETE' },
		),
	sendSms: (ctx, input) =>
		resultsRequest(ctx, '/api/v1/message/sms', {
			method: 'POST',
			body: input,
		}),
};

export const broadcastEndpoints: Pick<
	EsputnikEndpoints,
	'getBroadcasts' | 'createBroadcast' | 'getBroadcast' | 'cancelBroadcast'
> = {
	getBroadcasts: (ctx, input) =>
		listRequest('getBroadcasts', ctx, '/api/v1/broadcasts', { query: input }),
	createBroadcast: (ctx, input) =>
		typedRequest('createBroadcast', ctx, '/api/v1/broadcast', {
			method: 'POST',
			body: input,
		}),
	getBroadcast: (ctx, input) =>
		typedRequest(
			'getBroadcast',
			ctx,
			`/api/v1/broadcast/${segment(input.id)}`,
			{},
		),
	cancelBroadcast: (ctx, input) =>
		typedRequest(
			'cancelBroadcast',
			ctx,
			`/api/v1/broadcast/${segment(input.id)}`,
			{ method: 'DELETE' },
		),
};

export const interfaceEndpoints: Pick<
	EsputnikEndpoints,
	'getSmsInterfaces' | 'getEmailInterfaces'
> = {
	getSmsInterfaces: (ctx) =>
		listRequest('getSmsInterfaces', ctx, '/api/v1/interfaces/sms', {}),
	getEmailInterfaces: (ctx) =>
		listRequest('getEmailInterfaces', ctx, '/api/v1/interfaces/email', {}),
};

export const messageEndpoints: Pick<
	EsputnikEndpoints,
	'sendPreparedMessage' | 'updateInteractionStatus'
> = {
	sendPreparedMessage: (ctx, input) => {
		const { id, ...body } = input;
		return resultsRequest(ctx, `/api/v1/message/${id}/smartsend`, {
			method: 'POST',
			body,
		});
	},
	updateInteractionStatus: (ctx, input) => {
		const { interactionId, ...body } = input;
		return typedRequest(
			'updateInteractionStatus',
			ctx,
			`/api/v1/interactions/${segment(interactionId)}/status`,
			{ method: 'PUT', body },
		);
	},
};

export const siteEndpoints: Pick<
	EsputnikEndpoints,
	| 'getDomains'
	| 'createDomain'
	| 'getScript'
	| 'getWebPushDomains'
	| 'addWebPushDomain'
	| 'deleteWebPushDomain'
	| 'getWebPushScript'
> = {
	getDomains: (ctx) =>
		listRequest('getDomains', ctx, '/api/v1/site/domains', {}),
	createDomain: (ctx, input) =>
		typedRequest('createDomain', ctx, '/api/v1/site/domains', {
			method: 'POST',
			body: input,
		}),
	// The script is served as text/plain; asking for JSON gets a 406.
	getScript: (ctx) =>
		typedRequest('getScript', ctx, '/api/v1/site/script', {
			accept: 'text/plain',
		}),
	getWebPushDomains: (ctx) =>
		typedRequest('getWebPushDomains', ctx, '/api/v1/site/webpush/domains', {}),
	addWebPushDomain: (ctx, input) =>
		typedRequest('addWebPushDomain', ctx, '/api/v1/site/webpush/domain', {
			method: 'POST',
			body: input,
		}),
	deleteWebPushDomain: (ctx, input) =>
		typedRequest('deleteWebPushDomain', ctx, '/api/v1/site/webpush/domains', {
			method: 'DELETE',
			query: input,
		}),
	getWebPushScript: (ctx, input) =>
		typedRequest('getWebPushScript', ctx, '/api/v1/site/webpush/script', {
			query: input,
		}),
};

export const productFeedEndpoints: Pick<
	EsputnikEndpoints,
	'getProductFeedsConfiguration' | 'configureProductFeeds'
> = {
	getProductFeedsConfiguration: (ctx) =>
		typedRequest(
			'getProductFeedsConfiguration',
			ctx,
			'/api/v1/products/config',
			{},
		),
	configureProductFeeds: (ctx, input) =>
		typedRequest('configureProductFeeds', ctx, '/api/v1/products/config', {
			method: 'POST',
			body: input,
		}),
};

export const appEndpoints: Pick<
	EsputnikEndpoints,
	'addAppTokens' | 'muteAppToken' | 'unmuteAppToken'
> = {
	addAppTokens: (ctx, input) => {
		const { app_uuid, ...body } = input;
		return typedRequest(
			'addAppTokens',
			ctx,
			`/api/v1/apps/${segment(app_uuid)}/tokens`,
			{ method: 'POST', body },
		);
	},
	muteAppToken: (ctx, input) => {
		const { app_uuid, ...body } = input;
		return typedRequest(
			'muteAppToken',
			ctx,
			`/api/v1/apps/${segment(app_uuid)}/token/mute`,
			{ method: 'POST', body },
		);
	},
	unmuteAppToken: (ctx, input) => {
		const { app_uuid, ...body } = input;
		return typedRequest(
			'unmuteAppToken',
			ctx,
			`/api/v1/apps/${segment(app_uuid)}/token/unmute`,
			{ method: 'POST', body },
		);
	},
};

export const promocodeEndpoints: Pick<
	EsputnikEndpoints,
	'getPromocodes' | 'getPromocodesCount' | 'insertPromocodes'
> = {
	getPromocodes: (ctx, input) =>
		typedRequest('getPromocodes', ctx, '/api/v1/promocodes', { query: input }),
	getPromocodesCount: (ctx, input) =>
		typedRequest('getPromocodesCount', ctx, '/api/v1/promocodes/count', {
			query: input,
		}),
	insertPromocodes: (ctx, input) =>
		typedRequest('insertPromocodes', ctx, '/api/v1/promocodes', {
			method: 'POST',
			body: input,
		}),
};

export const preprocessorEndpoints: Pick<
	EsputnikEndpoints,
	| 'getPreprocessorFileStatus'
	| 'updatePreprocessorFile'
	| 'uploadPreprocessorFile'
> = {
	getPreprocessorFileStatus: (ctx, input) =>
		typedRequest(
			'getPreprocessorFileStatus',
			ctx,
			`/api/v1/preprocessor/file/${segment(input.sessionId)}/status`,
			{},
		),
	updatePreprocessorFile: (ctx, input) => {
		const { fileId, ...body } = input;
		return typedRequest(
			'updatePreprocessorFile',
			ctx,
			`/api/v1/preprocessor/file/${segment(fileId)}`,
			{ method: 'POST', body },
		);
	},
	uploadPreprocessorFile: (ctx, input) =>
		typedRequest(
			'uploadPreprocessorFile',
			ctx,
			'/api/v1/preprocessor/file/upload',
			{ method: 'POST', body: input },
		),
};

export * from './types';
