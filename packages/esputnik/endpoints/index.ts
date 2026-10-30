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

export * from './types';
