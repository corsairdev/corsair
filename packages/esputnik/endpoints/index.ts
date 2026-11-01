import type { EsputnikEndpoints } from '..';
import { makeEsputnikRequest } from '../client';
import type { EsputnikEndpointInputs, EsputnikEndpointOutputs } from './types';

// Output types are required so every handler declares its exact operation
// response; untyped transport calls intentionally do not compile.
const request = <T>(
	ctx: { key: string },
	path: string,
	options: Parameters<typeof makeEsputnikRequest>[2],
) => makeEsputnikRequest<T>(path, ctx.key, options);

const typedRequest = <K extends keyof EsputnikEndpointOutputs>(
	operation: K,
	ctx: { key: string },
	path: string,
	options: Parameters<typeof makeEsputnikRequest>[2],
) => request<EsputnikEndpointOutputs[K]>(ctx, path, options);

const segment = (value: string): string => encodeURIComponent(value);

// Provider request bodies are parsed by endpoint Zod schemas before handlers
// run; provider-defined extension fields must be forwarded unchanged.
type ProviderRequestBody = Record<string, unknown>;
// Provider query filters are schema-validated and forwarded without reshaping.
type ProviderQuery = Record<string, string | number | boolean | undefined>;

export const accountEndpoints: Pick<
	EsputnikEndpoints,
	'getAccountInfo' | 'getBalance'
> = {
	getAccountInfo: (ctx) =>
		request<EsputnikEndpointOutputs['getAccountInfo']>(
			ctx,
			'/api/v1/account/info',
			{},
		),
	getBalance: (ctx) =>
		request<EsputnikEndpointOutputs['getBalance']>(ctx, '/api/v1/balance', {}),
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
> = {
	addContact: (ctx, input) =>
		request<EsputnikEndpointOutputs['addContact']>(ctx, '/api/v1/contact', {
			method: 'POST',
			body: input,
		}),
	getContact: (ctx, input) =>
		request<EsputnikEndpointOutputs['getContact']>(
			ctx,
			`/api/v1/contact/${input.id}`,
			{},
		),
	updateContact: (ctx, input) => {
		const { id, ...body } = input;
		return request<EsputnikEndpointOutputs['updateContact']>(
			ctx,
			`/api/v1/contact/${id}`,
			{
				method: 'PUT',
				body,
			},
		);
	},
	deleteContactById: (ctx, input) =>
		typedRequest('deleteContactById', ctx, `/api/v1/contact/${input.id}`, {
			method: 'DELETE',
			query: { erase: input.erase },
		}),
	deleteContactByExternalCustomerId: (ctx, input) =>
		typedRequest('deleteContactByExternalCustomerId', ctx, '/api/v1/contact', {
			method: 'DELETE',
			query: input,
		}),
	searchContacts: (ctx, input) =>
		request<EsputnikEndpointOutputs['searchContacts']>(
			ctx,
			'/api/v1/contacts',
			{
				query: input,
			},
		),
	subscribeContact: (ctx, input) =>
		request<EsputnikEndpointOutputs['subscribeContact']>(
			ctx,
			'/api/v1/contact/subscribe',
			{
				method: 'POST',
				body: input,
			},
		),
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
		typedRequest('getContactEmails', ctx, '/api/v1/contacts/email', {
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
			{
				method: 'POST',
				body: input,
			},
		),
	getGroupContacts: (ctx, input) => {
		const { id, ...query } = input;
		return typedRequest(
			'getGroupContacts',
			ctx,
			`/api/v1/group/${id}/contacts`,
			{
				query,
			},
		);
	},
	detachContactsFromGroup: (ctx, input) => {
		const { id, ...body } = input;
		return typedRequest(
			'detachContactsFromGroup',
			ctx,
			`/api/v1/group/${id}/contacts/detach`,
			{
				method: 'POST',
				body,
			},
		);
	},
	attachContactsToGroup: (ctx, input) => {
		const { id, ...body } = input;
		return typedRequest(
			'attachContactsToGroup',
			ctx,
			`/api/v1/group/${id}/contacts/attach`,
			{
				method: 'POST',
				body,
			},
		);
	},
	searchGroups: (ctx, input) =>
		typedRequest('searchGroups', ctx, '/api/v1/groups', { query: input }),
	searchWorkflows: (ctx, input) =>
		typedRequest('searchWorkflows', ctx, '/api/v1/workflows', { query: input }),
	getContactIdByToken: (ctx, input) =>
		typedRequest(
			'getContactIdByToken',
			ctx,
			`/api/v1/contact/token/${segment(input.app_uuid)}/${segment(input.token_id)}/contactId`,
			{},
		),
	getContactSubscriptionCategories: (ctx, input) =>
		typedRequest(
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
			{
				method: 'PUT',
				body,
			},
		);
	},
	contactRecoms: (ctx, input) => {
		const { dataSourceId, ...query } = input;
		return typedRequest(
			'contactRecoms',
			ctx,
			`/api/v2/contacts/recoms/${dataSourceId}`,
			{ query },
		);
	},
	getAdditionalFields: (ctx) =>
		typedRequest('getAdditionalFields', ctx, '/api/v1/additionalfields', {}),
};

export const accountExtendedEndpoints = {
	getOrganisationBalanceHistory: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['getOrganisationBalanceHistory'],
	) =>
		typedRequest(
			'getOrganisationBalanceHistory',
			ctx,
			'/api/v1/balance/history',
			{ query: input },
		),
};

export const orderEndpoints = {
	ordersBulkInsert: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['ordersBulkInsert'],
	) =>
		typedRequest('ordersBulkInsert', ctx, '/api/v1/orders', {
			method: 'POST',
			body: input,
		}),
};

export const eventEndpoints = {
	registerEvent: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['registerEvent'],
	) =>
		typedRequest('registerEvent', ctx, '/api/v3/event', {
			method: 'POST',
			body: input,
		}),
	sendHistoryEvents: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['sendHistoryEvents'],
	) =>
		typedRequest('sendHistoryEvents', ctx, '/api/v3/past_events', {
			method: 'POST',
			body: input,
		}),
	removeHistoryEvents: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['removeHistoryEvents'],
	) =>
		typedRequest('removeHistoryEvents', ctx, '/api/v1/past_events', {
			method: 'DELETE',
			body: input,
		}),
};

export const emailEndpoints = {
	searchEmails: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['searchEmails'],
	) =>
		typedRequest('searchEmails', ctx, '/api/v1/messages/email', {
			query: input,
		}),
	getEmailMessageViewLink: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['getEmailMessageViewLink'],
	) =>
		typedRequest(
			'getEmailMessageViewLink',
			ctx,
			`/api/v1/messages/email/${input.id}/view`,
			{},
		),
	sendPreparedMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['sendPreparedMessage'],
	) =>
		typedRequest('sendPreparedMessage', ctx, '/api/v1/messages/send', {
			method: 'POST',
			body: input,
		}),
	addEmail: (ctx: { key: string }, input: EsputnikEndpointInputs['addEmail']) =>
		typedRequest('addEmail', ctx, '/api/v1/messages/email', {
			method: 'POST',
			body: input,
		}),
	getEmail: (ctx: { key: string }, input: EsputnikEndpointInputs['getEmail']) =>
		typedRequest('getEmail', ctx, `/api/v1/messages/email/${input.id}`, {}),
	updateMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['updateMessage'],
	) => {
		const { id, ...body } = input;
		return typedRequest('updateMessage', ctx, `/api/v1/messages/email/${id}`, {
			method: 'PUT',
			body,
		});
	},
	deleteEmail: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['deleteEmail'],
	) =>
		typedRequest('deleteEmail', ctx, `/api/v1/messages/email/${input.id}`, {
			method: 'DELETE',
		}),
	updateTranslatedMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['updateTranslatedMessage'],
	) => {
		const { id, language, ...body } = input;
		return typedRequest(
			'updateTranslatedMessage',
			ctx,
			`/api/v1/messages/email/${id}/${segment(language)}`,
			{
				method: 'PUT',
				body,
			},
		);
	},
	deleteTranslatedEmail: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['deleteTranslatedEmail'],
	) =>
		typedRequest(
			'deleteTranslatedEmail',
			ctx,
			`/api/v1/messages/email/${input.id}/${segment(input.language)}`,
			{
				method: 'DELETE',
			},
		),
	sendEmail: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['sendEmail'],
	) =>
		typedRequest('sendEmail', ctx, '/api/v1/message/email', {
			method: 'POST',
			body: input,
		}),
};

export const mobilePushEndpoints = {
	searchMobilePushMessages: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['searchMobilePushMessages'],
	) =>
		typedRequest(
			'searchMobilePushMessages',
			ctx,
			'/api/v1/messages/mobilepush',
			{
				query: input,
			},
		),
	addMobilePushMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['addMobilePushMessage'],
	) =>
		typedRequest('addMobilePushMessage', ctx, '/api/v1/messages/mobilepush', {
			method: 'POST',
			body: input,
		}),
	getMobilePushMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['getMobilePushMessage'],
	) =>
		typedRequest(
			'getMobilePushMessage',
			ctx,
			`/api/v1/messages/mobilepush/${input.id}`,
			{},
		),
	updateBaseMobilePushMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['updateBaseMobilePushMessage'],
	) => {
		const { id, ...body } = input;
		return typedRequest(
			'updateBaseMobilePushMessage',
			ctx,
			`/api/v1/messages/mobilepush/${id}`,
			{
				method: 'PUT',
				body,
			},
		);
	},
	deleteMobilePushMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['deleteMobilePushMessage'],
	) =>
		typedRequest(
			'deleteMobilePushMessage',
			ctx,
			`/api/v1/messages/mobilepush/${input.id}`,
			{
				method: 'DELETE',
			},
		),
	updateTranslatedMobilePushMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['updateTranslatedMobilePushMessage'],
	) => {
		const { id, language, ...body } = input;
		return typedRequest(
			'updateTranslatedMobilePushMessage',
			ctx,
			`/api/v1/messages/mobilepush/${id}/${segment(language)}`,
			{
				method: 'PUT',
				body,
			},
		);
	},
	deleteTranslatedMobilePushMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['deleteTranslatedMobilePushMessage'],
	) =>
		typedRequest(
			'deleteTranslatedMobilePushMessage',
			ctx,
			`/api/v1/messages/mobilepush/${input.id}/${segment(input.language)}`,
			{
				method: 'DELETE',
			},
		),
};

// Generated message families share one route shape, so each operation key is
// passed as a type parameter to keep its exact declared response type. Bodies
// stay `ProviderRequestBody` because the schema parsing boundary accepts
// provider extension fields before transport.
const messageFamily = <
	SearchKey extends keyof EsputnikEndpointOutputs,
	AddKey extends keyof EsputnikEndpointOutputs,
	GetKey extends keyof EsputnikEndpointOutputs,
	UpdateKey extends keyof EsputnikEndpointOutputs,
	DeleteKey extends keyof EsputnikEndpointOutputs,
>(
	base: string,
	keys: {
		search: SearchKey;
		add: AddKey;
		get: GetKey;
		update: UpdateKey;
		delete: DeleteKey;
	},
) => ({
	search: (ctx: { key: string }, input: ProviderQuery) =>
		typedRequest(keys.search, ctx, `/api/v1/messages/${base}`, {
			query: input,
		}),
	add: (ctx: { key: string }, input: ProviderRequestBody) =>
		typedRequest(keys.add, ctx, `/api/v1/messages/${base}`, {
			method: 'POST',
			body: input,
		}),
	get: (ctx: { key: string }, input: { id: number }) =>
		typedRequest(keys.get, ctx, `/api/v1/messages/${base}/${input.id}`, {}),
	update: (
		ctx: { key: string },
		input: { id: number } & ProviderRequestBody,
	) => {
		const { id, ...body } = input;
		return typedRequest(keys.update, ctx, `/api/v1/messages/${base}/${id}`, {
			method: 'PUT',
			body,
		});
	},
	delete: (ctx: { key: string }, input: { id: number }) =>
		typedRequest(keys.delete, ctx, `/api/v1/messages/${base}/${input.id}`, {
			method: 'DELETE',
		}),
});

export const viberEndpoints = messageFamily('viber', {
	search: 'searchViberMessages',
	add: 'addViberMessage',
	get: 'getViberMessage',
	update: 'updateBaseViberMessage',
	delete: 'deleteViberMessage',
});
export const appInboxEndpoints = messageFamily('appinbox', {
	search: 'searchAppInboxMessages',
	add: 'addAppInboxMessage',
	get: 'getAppInboxMessage',
	update: 'updateBaseAppInboxMessage',
	delete: 'deleteAppInboxMessage',
});
export const telegramBotEndpoints = messageFamily('telegrambot', {
	search: 'searchTelegramBotMessages',
	add: 'addTelegramBotMessage',
	get: 'getTelegramBotMessage',
	update: 'updateBaseTelegramBotMessage',
	delete: 'deleteTelegramBotMessage',
});
export const smsEndpoints = {
	search: (ctx: { key: string }, input: ProviderQuery) =>
		typedRequest('searchSmsMessages', ctx, '/api/v1/messages/sms', {
			query: input,
		}),
	get: (ctx: { key: string }, input: { id: number }) =>
		typedRequest('getSms', ctx, `/api/v1/messages/sms/${input.id}`, {}),
	update: (
		ctx: { key: string },
		input: { id: number } & ProviderRequestBody,
	) => {
		const { id, ...body } = input;
		return typedRequest(
			'updateBaseSmsMessage',
			ctx,
			`/api/v1/messages/sms/${id}`,
			{
				method: 'PUT',
				body,
			},
		);
	},
	delete: (ctx: { key: string }, input: { id: number }) =>
		typedRequest('deleteSmsMessage', ctx, `/api/v1/messages/sms/${input.id}`, {
			method: 'DELETE',
		}),
};

export const broadcastEndpoints = {
	getBroadcasts: (ctx: { key: string }, input: ProviderQuery) =>
		typedRequest('getBroadcasts', ctx, '/api/v1/broadcasts', { query: input }),
	createBroadcast: (ctx: { key: string }, input: ProviderRequestBody) =>
		typedRequest('createBroadcast', ctx, '/api/v1/broadcasts', {
			method: 'POST',
			body: input,
		}),
	getBroadcast: (ctx: { key: string }, input: { id: number }) =>
		typedRequest('getBroadcast', ctx, `/api/v1/broadcasts/${input.id}`, {}),
};

export const interfaceEndpoints = {
	getSmsInterfaces: (ctx: { key: string }) =>
		typedRequest('getSmsInterfaces', ctx, '/api/v1/interfaces/sms', {}),
	getEmailInterfaces: (ctx: { key: string }) =>
		typedRequest('getEmailInterfaces', ctx, '/api/v1/interfaces/email', {}),
};

export const batchTwoRemainderEndpoints = {
	updateTranslatedViberMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['updateTranslatedViberMessage'],
	) => {
		const { id, language, ...body } = input;
		return typedRequest(
			'updateTranslatedViberMessage',
			ctx,
			`/api/v1/messages/viber/${id}/${segment(language)}`,
			{
				method: 'PUT',
				body,
			},
		);
	},
	deleteTranslatedViberMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['deleteTranslatedViberMessage'],
	) =>
		typedRequest(
			'deleteTranslatedViberMessage',
			ctx,
			`/api/v1/messages/viber/${input.id}/${segment(input.language)}`,
			{
				method: 'DELETE',
			},
		),
	updateTranslatedAppInboxMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['updateTranslatedAppInboxMessage'],
	) => {
		const { id, language, ...body } = input;
		return typedRequest(
			'updateTranslatedAppInboxMessage',
			ctx,
			`/api/v1/messages/appinbox/${id}/${segment(language)}`,
			{
				method: 'PUT',
				body,
			},
		);
	},
	deleteTranslatedAppInboxMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['deleteTranslatedAppInboxMessage'],
	) =>
		typedRequest(
			'deleteTranslatedAppInboxMessage',
			ctx,
			`/api/v1/messages/appinbox/${input.id}/${segment(input.language)}`,
			{
				method: 'DELETE',
			},
		),
	updateTranslatedTelegramMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['updateTranslatedTelegramMessage'],
	) => {
		const { id, language, ...body } = input;
		return typedRequest(
			'updateTranslatedTelegramMessage',
			ctx,
			`/api/v1/messages/telegrambot/${id}/${segment(language)}`,
			{
				method: 'PUT',
				body,
			},
		);
	},
	deleteTranslatedTelegramMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['deleteTranslatedTelegramMessage'],
	) =>
		typedRequest(
			'deleteTranslatedTelegramMessage',
			ctx,
			`/api/v1/messages/telegrambot/${input.id}/${segment(input.language)}`,
			{
				method: 'DELETE',
			},
		),
	addSmsMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['addSmsMessage'],
	) =>
		typedRequest('addSmsMessage', ctx, '/api/v1/messages/sms', {
			method: 'POST',
			body: input,
		}),
	sendSms: (ctx: { key: string }, input: EsputnikEndpointInputs['sendSms']) =>
		typedRequest('sendSms', ctx, '/api/v1/message/sms', {
			method: 'POST',
			body: input,
		}),
	cancelBroadcast: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['cancelBroadcast'],
	) =>
		typedRequest('cancelBroadcast', ctx, `/api/v1/broadcasts/${input.id}`, {
			method: 'DELETE',
		}),
};

export const finalBatchEndpoints = {
	contactActivity: (ctx: { key: string }, input: ProviderQuery) =>
		typedRequest('contactActivity', ctx, '/api/v2/contacts/activity', {
			query: input,
		}),
	contactMessages: (ctx: { key: string }, input: ProviderQuery) =>
		typedRequest('contactMessages', ctx, '/api/v2/contacts/messages', {
			query: input,
		}),
	getTokenActivated: (
		ctx: { key: string },
		input: { app_uuid: string; token_id: string },
	) =>
		typedRequest(
			'getTokenActivated',
			ctx,
			`/api/v1/contact/token/activated/${segment(input.app_uuid)}/${segment(input.token_id)}`,
			{},
		),
	changeTokenActivated: (
		ctx: { key: string },
		input: { app_uuid: string; token_id: string; active: boolean },
	) => {
		const { app_uuid, token_id, active } = input;
		return typedRequest(
			'changeTokenActivated',
			ctx,
			`/api/v1/contact/token/activated/${segment(app_uuid)}/${segment(token_id)}`,
			{ method: 'PUT', body: { active } },
		);
	},
	getDomains: (ctx: { key: string }) =>
		typedRequest('getDomains', ctx, '/api/v1/site/domains', {}),
	createDomain: (ctx: { key: string }, input: ProviderRequestBody) =>
		typedRequest('createDomain', ctx, '/api/v1/site/domains', {
			method: 'POST',
			body: input,
		}),
	getScript: (ctx: { key: string }) =>
		typedRequest('getScript', ctx, '/api/v1/site/script', {}),
	getWebPushDomains: (ctx: { key: string }) =>
		typedRequest('getWebPushDomains', ctx, '/api/v1/site/webpush/domains', {}),
	addWebPushDomain: (ctx: { key: string }, input: ProviderRequestBody) =>
		typedRequest('addWebPushDomain', ctx, '/api/v1/site/webpush/domain', {
			method: 'POST',
			body: input,
		}),
	deleteWebPushDomain: (ctx: { key: string }, input: { domain: string }) =>
		typedRequest('deleteWebPushDomain', ctx, '/api/v1/site/webpush/domains', {
			method: 'DELETE',
			query: input,
		}),
	getWebPushScript: (ctx: { key: string }, input: { domain?: string }) =>
		typedRequest('getWebPushScript', ctx, '/api/v1/site/webpush/script', {
			query: input,
		}),
	getProductFeedsConfiguration: (ctx: { key: string }) =>
		typedRequest(
			'getProductFeedsConfiguration',
			ctx,
			'/api/v1/productfeeds/configuration',
			{},
		),
	configureProductFeeds: (ctx: { key: string }, input: ProviderRequestBody) =>
		typedRequest(
			'configureProductFeeds',
			ctx,
			'/api/v1/productfeeds/configuration',
			{
				method: 'PUT',
				body: input,
			},
		),
	addAppTokens: (ctx: { key: string }, input: ProviderRequestBody) =>
		typedRequest('addAppTokens', ctx, '/api/v1/apptokens', {
			method: 'POST',
			body: input,
		}),
	muteAppToken: (ctx: { key: string }, input: ProviderRequestBody) =>
		typedRequest('muteAppToken', ctx, '/api/v1/apptokens/mute', {
			method: 'POST',
			body: input,
		}),
	unmuteAppToken: (ctx: { key: string }, input: ProviderRequestBody) =>
		typedRequest('unmuteAppToken', ctx, '/api/v1/apptokens/unmute', {
			method: 'POST',
			body: input,
		}),
	getSubscriptionCategories: (ctx: { key: string }) =>
		typedRequest(
			'getSubscriptionCategories',
			ctx,
			'/api/v1/subscriptioncategories',
			{},
		),
	getPromocodes: (ctx: { key: string }, input: ProviderQuery) =>
		typedRequest('getPromocodes', ctx, '/api/v1/promocodes', { query: input }),
	getPromocodesCount: (ctx: { key: string }) =>
		typedRequest('getPromocodesCount', ctx, '/api/v1/promocodes/count', {}),
	insertPromocodes: (ctx: { key: string }, input: ProviderRequestBody) =>
		typedRequest('insertPromocodes', ctx, '/api/v1/promocodes', {
			method: 'POST',
			body: input,
		}),
	getPreprocessorFileStatus: (
		ctx: { key: string },
		input: { sessionId: string },
	) =>
		typedRequest(
			'getPreprocessorFileStatus',
			ctx,
			`/api/v1/preprocessor/file/${segment(input.sessionId)}`,
			{},
		),
	updatePreprocessorFile: (ctx: { key: string }, input: ProviderRequestBody) =>
		typedRequest('updatePreprocessorFile', ctx, '/api/v1/preprocessor/file', {
			method: 'PUT',
			body: input,
		}),
	uploadPreprocessorFile: (ctx: { key: string }, input: ProviderRequestBody) =>
		typedRequest('uploadPreprocessorFile', ctx, '/api/v1/preprocessor/file', {
			method: 'POST',
			body: input,
		}),
	generateApiToken: (ctx: { key: string }, input: ProviderRequestBody) =>
		typedRequest('generateApiToken', ctx, '/api/v1/apikey', {
			method: 'POST',
			body: input,
		}),
	getInteractionStatus: (ctx: { key: string }, input: ProviderQuery) =>
		typedRequest('getInteractionStatus', ctx, '/api/v1/interactions/status', {
			query: input,
		}),
	sendViber: (ctx: { key: string }, input: ProviderRequestBody) =>
		typedRequest('sendViber', ctx, '/api/v1/message/viber', {
			method: 'POST',
			body: input,
		}),
	sendAppInbox: (ctx: { key: string }, input: ProviderRequestBody) =>
		typedRequest('sendAppInbox', ctx, '/api/v1/message/appinbox', {
			method: 'POST',
			body: input,
		}),
	sendTelegramBot: (ctx: { key: string }, input: ProviderRequestBody) =>
		typedRequest('sendTelegramBot', ctx, '/api/v1/message/telegrambot', {
			method: 'POST',
			body: input,
		}),
	updateTranslatedSmsMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['updateTranslatedSmsMessage'],
	) => {
		const { id, language, ...body } = input;
		return typedRequest(
			'updateTranslatedSmsMessage',
			ctx,
			`/api/v1/messages/sms/${id}/${segment(language)}`,
			{
				method: 'PUT',
				body,
			},
		);
	},
	deleteTranslatedSmsMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['deleteTranslatedSmsMessage'],
	) =>
		typedRequest(
			'deleteTranslatedSmsMessage',
			ctx,
			`/api/v1/messages/sms/${input.id}/${segment(input.language)}`,
			{
				method: 'DELETE',
			},
		),
};

export * from './types';
