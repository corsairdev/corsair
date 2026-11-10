import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import { mixmaxPathParameter } from './path';
import type { MixmaxEndpointOutputs } from './types';

export const salesforceListAccounts: MixmaxEndpoints['salesforceListAccounts'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceListAccounts']
		>(ctx, '/v1/salesforce/account', {
			method: 'GET',
			query: {
				fields: input.fields,
				next: input.next,
				previous: input.previous,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.listAccounts',
			{ ...input },
			'completed',
		);
		return result;
	};

export const salesforceCreateAccount: MixmaxEndpoints['salesforceCreateAccount'] =
	async (ctx, input) => {
		const { ...account } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceCreateAccount']
		>(ctx, '/v1/salesforce/account', {
			method: 'POST',
			body: account,
		});

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.createAccount',
			// CRM field values (names, addresses, phone numbers) are private;
			// log how many fields were sent, never their values.
			{ fields: Object.keys(input).length },
			'completed',
		);
		return result;
	};

export const salesforceGetAccountImplicit: MixmaxEndpoints['salesforceGetAccountImplicit'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceGetAccountImplicit']
		>(ctx, '/v1/salesforce/account/implicit', {
			method: 'GET',
			query: {
				emailDomain: input.emailDomain,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.getAccountImplicit',
			{ ...input },
			'completed',
		);
		return result;
	};

export const salesforceGetAccount: MixmaxEndpoints['salesforceGetAccount'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceGetAccount']
		>(ctx, mixmaxPathParameter('/v1/salesforce/account/{id}', 'id', input.id), {
			method: 'GET',
			query: {
				fields: input.fields,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.getAccount',
			{ ...input },
			'completed',
		);
		return result;
	};

export const salesforceUpdateAccount: MixmaxEndpoints['salesforceUpdateAccount'] =
	async (ctx, input) => {
		const { id, ...update } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceUpdateAccount']
		>(ctx, mixmaxPathParameter('/v1/salesforce/account/{id}', 'id', id), {
			method: 'PUT',
			body: update,
		});

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.updateAccount',
			// Field values are private; log the record id and the field count.
			{ id: input.id, fields: Object.keys(input).length - 1 },
			'completed',
		);
		return result;
	};

export const salesforceCreateContact: MixmaxEndpoints['salesforceCreateContact'] =
	async (ctx, input) => {
		const { ...contact } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceCreateContact']
		>(ctx, '/v1/salesforce/contact', {
			method: 'POST',
			body: contact,
		});

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.createContact',
			// CRM field values (names, addresses, phone numbers) are private;
			// log how many fields were sent, never their values.
			{ fields: Object.keys(input).length },
			'completed',
		);
		return result;
	};

export const salesforceGetContact: MixmaxEndpoints['salesforceGetContact'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceGetContact']
		>(ctx, mixmaxPathParameter('/v1/salesforce/contact/{id}', 'id', input.id), {
			method: 'GET',
			query: {
				fields: input.fields,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.getContact',
			{ ...input },
			'completed',
		);
		return result;
	};

export const salesforceUpdateContact: MixmaxEndpoints['salesforceUpdateContact'] =
	async (ctx, input) => {
		const { id, ...update } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceUpdateContact']
		>(ctx, mixmaxPathParameter('/v1/salesforce/contact/{id}', 'id', id), {
			method: 'PUT',
			body: update,
		});

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.updateContact',
			// Field values are private; log the record id and the field count.
			{ id: input.id, fields: Object.keys(input).length - 1 },
			'completed',
		);
		return result;
	};

export const salesforceListContactTasks: MixmaxEndpoints['salesforceListContactTasks'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceListContactTasks']
		>(
			ctx,
			mixmaxPathParameter('/v1/salesforce/contact/{id}/tasks', 'id', input.id),
			{
				method: 'GET',
				query: {
					fields: input.fields,
					next: input.next,
					previous: input.previous,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.listContactTasks',
			{ ...input },
			'completed',
		);
		return result;
	};

export const salesforceGetContactOrLead: MixmaxEndpoints['salesforceGetContactOrLead'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceGetContactOrLead']
		>(ctx, '/v1/salesforce/contactOrLead', {
			method: 'GET',
			query: {
				email: input.email,
				withRelatedObjects: input.withRelatedObjects,
				fetch: input.fetch,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.getContactOrLead',
			{ ...input },
			'completed',
		);
		return result;
	};

export const salesforceCreateLead: MixmaxEndpoints['salesforceCreateLead'] =
	async (ctx, input) => {
		const { ...lead } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceCreateLead']
		>(ctx, '/v1/salesforce/lead', {
			method: 'POST',
			body: lead,
		});

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.createLead',
			// CRM field values (names, addresses, phone numbers) are private;
			// log how many fields were sent, never their values.
			{ fields: Object.keys(input).length },
			'completed',
		);
		return result;
	};

export const salesforceGetLead: MixmaxEndpoints['salesforceGetLead'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['salesforceGetLead']
	>(ctx, mixmaxPathParameter('/v1/salesforce/lead/{id}', 'id', input.id), {
		method: 'GET',
		query: {
			fields: input.fields,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.salesforce.getLead',
		{ ...input },
		'completed',
	);
	return result;
};

export const salesforceUpdateLead: MixmaxEndpoints['salesforceUpdateLead'] =
	async (ctx, input) => {
		const { id, ...update } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceUpdateLead']
		>(ctx, mixmaxPathParameter('/v1/salesforce/lead/{id}', 'id', id), {
			method: 'PUT',
			body: update,
		});

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.updateLead',
			// Field values are private; log the record id and the field count.
			{ id: input.id, fields: Object.keys(input).length - 1 },
			'completed',
		);
		return result;
	};

export const salesforceListLeadTasks: MixmaxEndpoints['salesforceListLeadTasks'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceListLeadTasks']
		>(
			ctx,
			mixmaxPathParameter('/v1/salesforce/lead/{id}/tasks', 'id', input.id),
			{
				method: 'GET',
				query: {
					fields: input.fields,
					next: input.next,
					previous: input.previous,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.listLeadTasks',
			{ ...input },
			'completed',
		);
		return result;
	};

export const salesforceCreateOpportunity: MixmaxEndpoints['salesforceCreateOpportunity'] =
	async (ctx, input) => {
		const { ...opportunity } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceCreateOpportunity']
		>(ctx, '/v1/salesforce/opportunity', {
			method: 'POST',
			body: opportunity,
		});

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.createOpportunity',
			// CRM field values (names, addresses, phone numbers) are private;
			// log how many fields were sent, never their values.
			{ fields: Object.keys(input).length },
			'completed',
		);
		return result;
	};

export const salesforceGetOpportunity: MixmaxEndpoints['salesforceGetOpportunity'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceGetOpportunity']
		>(
			ctx,
			mixmaxPathParameter('/v1/salesforce/opportunity/{id}', 'id', input.id),
			{
				method: 'GET',
				query: {
					fields: input.fields,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.getOpportunity',
			{ ...input },
			'completed',
		);
		return result;
	};

export const salesforceUpdateOpportunity: MixmaxEndpoints['salesforceUpdateOpportunity'] =
	async (ctx, input) => {
		const { id, ...update } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceUpdateOpportunity']
		>(ctx, mixmaxPathParameter('/v1/salesforce/opportunity/{id}', 'id', id), {
			method: 'PUT',
			body: update,
		});

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.updateOpportunity',
			// Field values are private; log the record id and the field count.
			{ id: input.id, fields: Object.keys(input).length - 1 },
			'completed',
		);
		return result;
	};

export const salesforceDeleteOpportunity: MixmaxEndpoints['salesforceDeleteOpportunity'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceDeleteOpportunity']
		>(
			ctx,
			mixmaxPathParameter('/v1/salesforce/opportunity/{id}', 'id', input.id),
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.deleteOpportunity',
			{ ...input },
			'completed',
		);
		return result;
	};

export const salesforceSearch: MixmaxEndpoints['salesforceSearch'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['salesforceSearch']
	>(ctx, '/v1/salesforce/search', {
		method: 'GET',
		query: {
			type: input.type,
			q: input.q,
			fields: input.fields,
			next: input.next,
			previous: input.previous,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.salesforce.search',
		{ ...input },
		'completed',
	);
	return result;
};

export const salesforceSyncedFields: MixmaxEndpoints['salesforceSyncedFields'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceSyncedFields']
		>(ctx, '/v1/salesforce/syncedFields', {
			method: 'GET',
			query: {
				fields: input.fields,
				useSyncUser: input.useSyncUser,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.syncedFields',
			{ ...input },
			'completed',
		);
		return result;
	};

export const salesforceCreateTask: MixmaxEndpoints['salesforceCreateTask'] =
	async (ctx, input) => {
		const { ...task } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceCreateTask']
		>(ctx, '/v1/salesforce/task', {
			method: 'POST',
			body: task,
		});

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.createTask',
			// CRM field values (names, addresses, phone numbers) are private;
			// log how many fields were sent, never their values.
			{ fields: Object.keys(input).length },
			'completed',
		);
		return result;
	};

export const salesforceGetTask: MixmaxEndpoints['salesforceGetTask'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['salesforceGetTask']
	>(ctx, mixmaxPathParameter('/v1/salesforce/task/{id}', 'id', input.id), {
		method: 'GET',
		query: {
			fields: input.fields,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.salesforce.getTask',
		{ ...input },
		'completed',
	);
	return result;
};

export const salesforceUpdateTask: MixmaxEndpoints['salesforceUpdateTask'] =
	async (ctx, input) => {
		const { id, ...update } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceUpdateTask']
		>(ctx, mixmaxPathParameter('/v1/salesforce/task/{id}', 'id', id), {
			method: 'PUT',
			body: update,
		});

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.updateTask',
			// Field values are private; log the record id and the field count.
			{ id: input.id, fields: Object.keys(input).length - 1 },
			'completed',
		);
		return result;
	};

export const salesforceDeleteTask: MixmaxEndpoints['salesforceDeleteTask'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['salesforceDeleteTask']
		>(ctx, mixmaxPathParameter('/v1/salesforce/task/{id}', 'id', input.id), {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'mixmax.salesforce.deleteTask',
			{ ...input },
			'completed',
		);
		return result;
	};

export const salesforceGetWhat: MixmaxEndpoints['salesforceGetWhat'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['salesforceGetWhat']
	>(ctx, mixmaxPathParameter('/v1/salesforce/what/{id}', 'id', input.id), {
		method: 'GET',
		query: {
			fields: input.fields,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.salesforce.getWhat',
		{ ...input },
		'completed',
	);
	return result;
};

export const salesforceGetWho: MixmaxEndpoints['salesforceGetWho'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['salesforceGetWho']
	>(ctx, mixmaxPathParameter('/v1/salesforce/who/{id}', 'id', input.id), {
		method: 'GET',
		query: {
			fields: input.fields,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.salesforce.getWho',
		{ ...input },
		'completed',
	);
	return result;
};
