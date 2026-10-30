import type { EsputnikEndpoints } from '..';
import { makeEsputnikRequest } from '../client';
import type { EsputnikEndpointInputs, EsputnikEndpointOutputs } from './types';

const request = <T>(
	ctx: { key: string },
	path: string,
	options: Parameters<typeof makeEsputnikRequest>[2],
) => makeEsputnikRequest<T>(path, ctx.key, options);

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
		request(ctx, `/api/v1/importstatus/${input.sessionId}`, {}),
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
			`/api/v1/contact/token/${input.app_uuid}/${input.token_id}/contactId`,
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
		return request(ctx, `/api/v1/messages/email/${id}/${language}`, {
			method: 'PUT',
			body,
		});
	},
	deleteTranslatedEmail: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['deleteTranslatedEmail'],
	) =>
		request(ctx, `/api/v1/messages/email/${input.id}/${input.language}`, {
			method: 'DELETE',
		}),
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
		return request(ctx, `/api/v1/messages/mobilepush/${id}/${language}`, {
			method: 'PUT',
			body,
		});
	},
	deleteTranslatedMobilePushMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['deleteTranslatedMobilePushMessage'],
	) =>
		request(ctx, `/api/v1/messages/mobilepush/${input.id}/${input.language}`, {
			method: 'DELETE',
		}),
};

const messageFamily = (base: string) => ({
	search: (
		ctx: { key: string },
		input: Record<string, string | number | boolean | undefined>,
	) => request(ctx, `/api/v1/messages/${base}`, { query: input }),
	add: (ctx: { key: string }, input: Record<string, unknown>) =>
		request(ctx, `/api/v1/messages/${base}`, { method: 'POST', body: input }),
	get: (ctx: { key: string }, input: { id: number }) =>
		request(ctx, `/api/v1/messages/${base}/${input.id}`, {}),
	update: (
		ctx: { key: string },
		input: { id: number } & Record<string, unknown>,
	) => {
		const { id, ...body } = input;
		return request(ctx, `/api/v1/messages/${base}/${id}`, {
			method: 'PUT',
			body,
		});
	},
	delete: (ctx: { key: string }, input: { id: number }) =>
		request(ctx, `/api/v1/messages/${base}/${input.id}`, { method: 'DELETE' }),
});

export const viberEndpoints = messageFamily('viber');
export const appInboxEndpoints = messageFamily('appinbox');
export const telegramBotEndpoints = messageFamily('telegrambot');
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
		return request(ctx, `/api/v1/messages/viber/${id}/${language}`, {
			method: 'PUT',
			body,
		});
	},
	deleteTranslatedViberMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['deleteTranslatedViberMessage'],
	) =>
		request(ctx, `/api/v1/messages/viber/${input.id}/${input.language}`, {
			method: 'DELETE',
		}),
	updateTranslatedAppInboxMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['updateTranslatedAppInboxMessage'],
	) => {
		const { id, language, ...body } = input;
		return request(ctx, `/api/v1/messages/appinbox/${id}/${language}`, {
			method: 'PUT',
			body,
		});
	},
	deleteTranslatedAppInboxMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['deleteTranslatedAppInboxMessage'],
	) =>
		request(ctx, `/api/v1/messages/appinbox/${input.id}/${input.language}`, {
			method: 'DELETE',
		}),
	updateTranslatedTelegramMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['updateTranslatedTelegramMessage'],
	) => {
		const { id, language, ...body } = input;
		return request(ctx, `/api/v1/messages/telegrambot/${id}/${language}`, {
			method: 'PUT',
			body,
		});
	},
	deleteTranslatedTelegramMessage: (
		ctx: { key: string },
		input: EsputnikEndpointInputs['deleteTranslatedTelegramMessage'],
	) =>
		request(ctx, `/api/v1/messages/telegrambot/${input.id}/${input.language}`, {
			method: 'DELETE',
		}),
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

export * from './types';
