import type { EsputnikEndpoints } from '..';
import { makeEsputnikRequest } from '../client';
import type { EsputnikEndpointInputs, EsputnikEndpointOutputs } from './types';

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
		request<EsputnikEndpointOutputs['deleteContactById']>(
			ctx,
			`/api/v1/contact/${input.id}`,
			{
				method: 'DELETE',
				query: { erase: input.erase },
			},
		),
	deleteContactByExternalCustomerId: (ctx, input) =>
		request<EsputnikEndpointOutputs['deleteContactByExternalCustomerId']>(
			ctx,
			'/api/v1/contact',
			{
				method: 'DELETE',
				query: input,
			},
		),
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
		request(ctx, '/api/v1/contacts', { method: 'POST', body: input }),
	fileContactsBulkUpdate: (ctx, input) =>
		request(ctx, '/api/v1/contacts/upload', { method: 'POST', body: input }),
	getImportSessionStatus: (ctx, input) =>
		request(ctx, `/api/v1/importstatus/${segment(input.sessionId)}`, {}),
	getContactEmails: (ctx, input) =>
		request(ctx, '/api/v1/contacts/email', { query: input }),
	addToUnsubscribed: (ctx, input) =>
		request(ctx, '/api/v1/emails/unsubscribed/add', {
			method: 'POST',
			body: input,
		}),
	deleteFromUnsubscribed: (ctx, input) =>
		request(ctx, '/api/v1/emails/unsubscribed/delete', {
			method: 'POST',
			body: input,
		}),
	getGroupContacts: (ctx, input) => {
		const { id, ...query } = input;
		return request(ctx, `/api/v1/group/${id}/contacts`, { query });
	},
	detachContactsFromGroup: (ctx, input) => {
		const { id, ...body } = input;
		return request(ctx, `/api/v1/group/${id}/contacts/detach`, {
			method: 'POST',
			body,
		});
	},
	attachContactsToGroup: (ctx, input) => {
		const { id, ...body } = input;
		return request(ctx, `/api/v1/group/${id}/contacts/attach`, {
			method: 'POST',
			body,
		});
	},
	searchGroups: (ctx, input) =>
		request(ctx, '/api/v1/groups', { query: input }),
	searchWorkflows: (ctx, input) =>
		request(ctx, '/api/v1/workflows', { query: input }),
	getContactIdByToken: (ctx, input) =>
		request(
			ctx,
			`/api/v1/contact/token/${segment(input.app_uuid)}/${segment(input.token_id)}/contactId`,
			{},
		),
	getContactSubscriptionCategories: (ctx, input) =>
		request(ctx, `/api/v1/contact/${input.id}/subscriptions`, {}),
	changeContactSubscriptionCategories: (ctx, input) => {
		const { id, ...body } = input;
		return request(ctx, `/api/v1/contact/${id}/subscriptions`, {
			method: 'PUT',
			body,
		});
	},
	contactRecoms: (ctx, input) => {
		const { dataSourceId, ...query } = input;
		return request(ctx, `/api/v2/contacts/recoms/${dataSourceId}`, { query });
	},
	getAdditionalFields: (ctx) => request(ctx, '/api/v1/additionalfields', {}),
};

export const accountExtendedEndpoints = {
	getOrganisationBalanceHistory: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['getOrganisationBalanceHistory'],
	) => request(ctx, '/api/v1/balance/history', { query: input }),
};

export const orderEndpoints = {
	ordersBulkInsert: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['ordersBulkInsert'],
	) => request(ctx, '/api/v1/orders', { method: 'POST', body: input }),
};

export const eventEndpoints = {
	registerEvent: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['registerEvent'],
	) => request(ctx, '/api/v3/event', { method: 'POST', body: input }),
	sendHistoryEvents: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['sendHistoryEvents'],
	) => request(ctx, '/api/v3/past_events', { method: 'POST', body: input }),
	removeHistoryEvents: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['removeHistoryEvents'],
	) => request(ctx, '/api/v1/past_events', { method: 'DELETE', body: input }),
};

export const emailEndpoints = {
	searchEmails: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['searchEmails'],
	) => request(ctx, '/api/v1/messages/email', { query: input }),
	getEmailMessageViewLink: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['getEmailMessageViewLink'],
	) => request(ctx, `/api/v1/messages/email/${input.id}/view`, {}),
	sendPreparedMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['sendPreparedMessage'],
	) => request(ctx, '/api/v1/messages/send', { method: 'POST', body: input }),
	addEmail: (ctx: { key: string }, input: EsputnikEndpointInputs['addEmail']) =>
		request(ctx, '/api/v1/messages/email', { method: 'POST', body: input }),
	getEmail: (ctx: { key: string }, input: EsputnikEndpointInputs['getEmail']) =>
		request(ctx, `/api/v1/messages/email/${input.id}`, {}),
	updateMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['updateMessage'],
	) => {
		const { id, ...body } = input;
		return request(ctx, `/api/v1/messages/email/${id}`, {
			method: 'PUT',
			body,
		});
	},
	deleteEmail: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['deleteEmail'],
	) => request(ctx, `/api/v1/messages/email/${input.id}`, { method: 'DELETE' }),
	updateTranslatedMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['updateTranslatedMessage'],
	) => {
		const { id, language, ...body } = input;
		return request(ctx, `/api/v1/messages/email/${id}/${segment(language)}`, {
			method: 'PUT',
			body,
		});
	},
	deleteTranslatedEmail: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['deleteTranslatedEmail'],
	) =>
		request(
			ctx,
			`/api/v1/messages/email/${input.id}/${segment(input.language)}`,
			{
				method: 'DELETE',
			},
		),
	sendEmail: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['sendEmail'],
	) => request(ctx, '/api/v1/message/email', { method: 'POST', body: input }),
};

export const mobilePushEndpoints = {
	searchMobilePushMessages: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['searchMobilePushMessages'],
	) => request(ctx, '/api/v1/messages/mobilepush', { query: input }),
	addMobilePushMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['addMobilePushMessage'],
	) =>
		request(ctx, '/api/v1/messages/mobilepush', {
			method: 'POST',
			body: input,
		}),
	getMobilePushMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['getMobilePushMessage'],
	) => request(ctx, `/api/v1/messages/mobilepush/${input.id}`, {}),
	updateBaseMobilePushMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['updateBaseMobilePushMessage'],
	) => {
		const { id, ...body } = input;
		return request(ctx, `/api/v1/messages/mobilepush/${id}`, {
			method: 'PUT',
			body,
		});
	},
	deleteMobilePushMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['deleteMobilePushMessage'],
	) =>
		request(ctx, `/api/v1/messages/mobilepush/${input.id}`, {
			method: 'DELETE',
		}),
	updateTranslatedMobilePushMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['updateTranslatedMobilePushMessage'],
	) => {
		const { id, language, ...body } = input;
		return request(
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
		request(
			ctx,
			`/api/v1/messages/mobilepush/${input.id}/${segment(input.language)}`,
			{
				method: 'DELETE',
			},
		),
};

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
	search: (
		ctx: { key: string },
		input: Record<string, string | number | boolean | undefined>,
	) =>
		typedRequest(keys.search, ctx, `/api/v1/messages/${base}`, {
			query: input,
		}),
	add: (ctx: { key: string }, input: Record<string, unknown>) =>
		typedRequest(keys.add, ctx, `/api/v1/messages/${base}`, {
			method: 'POST',
			body: input,
		}),
	get: (ctx: { key: string }, input: { id: number }) =>
		typedRequest(keys.get, ctx, `/api/v1/messages/${base}/${input.id}`, {}),
	update: (
		ctx: { key: string },
		input: { id: number } & Record<string, unknown>,
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
	search: (
		ctx: { key: string },
		input: Record<string, string | number | boolean | undefined>,
	) => request(ctx, '/api/v1/messages/sms', { query: input }),
	get: (ctx: { key: string }, input: { id: number }) =>
		request(ctx, `/api/v1/messages/sms/${input.id}`, {}),
	update: (
		ctx: { key: string },
		input: { id: number } & Record<string, unknown>,
	) => {
		const { id, ...body } = input;
		return request(ctx, `/api/v1/messages/sms/${id}`, { method: 'PUT', body });
	},
	delete: (ctx: { key: string }, input: { id: number }) =>
		request(ctx, `/api/v1/messages/sms/${input.id}`, { method: 'DELETE' }),
};

export const broadcastEndpoints = {
	getBroadcasts: (
		ctx: { key: string },
		input: Record<string, string | number | boolean | undefined>,
	) => request(ctx, '/api/v1/broadcasts', { query: input }),
	createBroadcast: (ctx: { key: string }, input: Record<string, unknown>) =>
		request(ctx, '/api/v1/broadcasts', { method: 'POST', body: input }),
	getBroadcast: (ctx: { key: string }, input: { id: number }) =>
		request(ctx, `/api/v1/broadcasts/${input.id}`, {}),
};

export const interfaceEndpoints = {
	getSmsInterfaces: (ctx: { key: string }) =>
		request(ctx, '/api/v1/interfaces/sms', {}),
	getEmailInterfaces: (ctx: { key: string }) =>
		request(ctx, '/api/v1/interfaces/email', {}),
};

export const batchTwoRemainderEndpoints = {
	updateTranslatedViberMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['updateTranslatedViberMessage'],
	) => {
		const { id, language, ...body } = input;
		return request(ctx, `/api/v1/messages/viber/${id}/${segment(language)}`, {
			method: 'PUT',
			body,
		});
	},
	deleteTranslatedViberMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['deleteTranslatedViberMessage'],
	) =>
		request(
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
		return request(
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
		request(
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
		return request(
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
		request(
			ctx,
			`/api/v1/messages/telegrambot/${input.id}/${segment(input.language)}`,
			{
				method: 'DELETE',
			},
		),
	addSmsMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['addSmsMessage'],
	) => request(ctx, '/api/v1/messages/sms', { method: 'POST', body: input }),
	sendSms: (ctx: { key: string }, input: EsputnikEndpointInputs['sendSms']) =>
		request(ctx, '/api/v1/message/sms', { method: 'POST', body: input }),
	cancelBroadcast: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['cancelBroadcast'],
	) => request(ctx, `/api/v1/broadcasts/${input.id}`, { method: 'DELETE' }),
};

export const finalBatchEndpoints = {
	contactActivity: (
		ctx: { key: string },
		input: Record<string, string | number | boolean | undefined>,
	) => request(ctx, '/api/v2/contacts/activity', { query: input }),
	contactMessages: (
		ctx: { key: string },
		input: Record<string, string | number | boolean | undefined>,
	) => request(ctx, '/api/v2/contacts/messages', { query: input }),
	getTokenActivated: (
		ctx: { key: string },
		input: { app_uuid: string; token_id: string },
	) =>
		request(
			ctx,
			`/api/v1/contact/token/activated/${segment(input.app_uuid)}/${segment(input.token_id)}`,
			{},
		),
	changeTokenActivated: (
		ctx: { key: string },
		input: { app_uuid: string; token_id: string; active: boolean },
	) => {
		const { app_uuid, token_id, active } = input;
		return request(
			ctx,
			`/api/v1/contact/token/activated/${segment(app_uuid)}/${segment(token_id)}`,
			{ method: 'PUT', body: { active } },
		);
	},
	getDomains: (ctx: { key: string }) =>
		request(ctx, '/api/v1/site/domains', {}),
	createDomain: (ctx: { key: string }, input: Record<string, unknown>) =>
		request(ctx, '/api/v1/site/domains', { method: 'POST', body: input }),
	getScript: (ctx: { key: string }) => request(ctx, '/api/v1/site/script', {}),
	getWebPushDomains: (ctx: { key: string }) =>
		request(ctx, '/api/v1/site/webpush/domains', {}),
	addWebPushDomain: (ctx: { key: string }, input: Record<string, unknown>) =>
		request(ctx, '/api/v1/site/webpush/domain', {
			method: 'POST',
			body: input,
		}),
	deleteWebPushDomain: (ctx: { key: string }, input: { domain: string }) =>
		request(ctx, '/api/v1/site/webpush/domains', {
			method: 'DELETE',
			query: input,
		}),
	getWebPushScript: (ctx: { key: string }, input: { domain?: string }) =>
		request(ctx, '/api/v1/site/webpush/script', { query: input }),
	getProductFeedsConfiguration: (ctx: { key: string }) =>
		request(ctx, '/api/v1/productfeeds/configuration', {}),
	configureProductFeeds: (
		ctx: { key: string },
		input: Record<string, unknown>,
	) =>
		request(ctx, '/api/v1/productfeeds/configuration', {
			method: 'PUT',
			body: input,
		}),
	addAppTokens: (ctx: { key: string }, input: Record<string, unknown>) =>
		request(ctx, '/api/v1/apptokens', { method: 'POST', body: input }),
	muteAppToken: (ctx: { key: string }, input: Record<string, unknown>) =>
		request(ctx, '/api/v1/apptokens/mute', { method: 'POST', body: input }),
	unmuteAppToken: (ctx: { key: string }, input: Record<string, unknown>) =>
		request(ctx, '/api/v1/apptokens/unmute', { method: 'POST', body: input }),
	getSubscriptionCategories: (ctx: { key: string }) =>
		request(ctx, '/api/v1/subscriptioncategories', {}),
	getPromocodes: (
		ctx: { key: string },
		input: Record<string, string | number | boolean | undefined>,
	) => request(ctx, '/api/v1/promocodes', { query: input }),
	getPromocodesCount: (ctx: { key: string }) =>
		request(ctx, '/api/v1/promocodes/count', {}),
	insertPromocodes: (ctx: { key: string }, input: Record<string, unknown>) =>
		request(ctx, '/api/v1/promocodes', { method: 'POST', body: input }),
	getPreprocessorFileStatus: (
		ctx: { key: string },
		input: { sessionId: string },
	) =>
		request(ctx, `/api/v1/preprocessor/file/${segment(input.sessionId)}`, {}),
	updatePreprocessorFile: (
		ctx: { key: string },
		input: Record<string, unknown>,
	) =>
		request(ctx, '/api/v1/preprocessor/file', { method: 'PUT', body: input }),
	uploadPreprocessorFile: (
		ctx: { key: string },
		input: Record<string, unknown>,
	) =>
		request(ctx, '/api/v1/preprocessor/file', { method: 'POST', body: input }),
	generateApiToken: (ctx: { key: string }, input: Record<string, unknown>) =>
		request(ctx, '/api/v1/apikey', { method: 'POST', body: input }),
	getInteractionStatus: (
		ctx: { key: string },
		input: Record<string, string | number | boolean | undefined>,
	) => request(ctx, '/api/v1/interactions/status', { query: input }),
	sendViber: (ctx: { key: string }, input: Record<string, unknown>) =>
		request(ctx, '/api/v1/message/viber', { method: 'POST', body: input }),
	sendAppInbox: (ctx: { key: string }, input: Record<string, unknown>) =>
		request(ctx, '/api/v1/message/appinbox', { method: 'POST', body: input }),
	sendTelegramBot: (ctx: { key: string }, input: Record<string, unknown>) =>
		request(ctx, '/api/v1/message/telegrambot', {
			method: 'POST',
			body: input,
		}),
	updateTranslatedSmsMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['updateTranslatedSmsMessage'],
	) => {
		const { id, language, ...body } = input;
		return request(ctx, `/api/v1/messages/sms/${id}/${segment(language)}`, {
			method: 'PUT',
			body,
		});
	},
	deleteTranslatedSmsMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['deleteTranslatedSmsMessage'],
	) =>
		request(
			ctx,
			`/api/v1/messages/sms/${input.id}/${segment(input.language)}`,
			{
				method: 'DELETE',
			},
		),
};

export * from './types';
