import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import { mixmaxPathParameter } from './path';
import type { MixmaxEndpointOutputs } from './types';

export const sequencesList: MixmaxEndpoints['sequencesList'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['sequencesList']
	>(ctx, '/v1/sequences', {
		method: 'GET',
		query: {
			name: input.name,
			folder: input.folder,
			expand: input.expand,
			fields: input.fields,
			limit: input.limit,
			next: input.next,
			previous: input.previous,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.sequences.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const sequencesSearch: MixmaxEndpoints['sequencesSearch'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['sequencesSearch']
	>(ctx, '/v1/sequences/search', {
		method: 'GET',
		query: {
			query: input.query,
			recipients: input.recipients,
			sequenceId: input.sequenceId,
			limit: input.limit,
			offset: input.offset,
			sortBy: input.sortBy,
			sortDesc: input.sortDesc,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.sequences.search',
		{ ...input },
		'completed',
	);
	return result;
};

export const sequencesCancelAll: MixmaxEndpoints['sequencesCancelAll'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['sequencesCancelAll']
	>(ctx, '/v1/sequences/cancel', {
		method: 'POST',
		body: {
			emails: input.emails,
			reason: input.reason,
			orgId: input.orgId,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.sequences.cancelAll',
		{ ...input },
		'completed',
	);
	return result;
};

export const sequencesCancel: MixmaxEndpoints['sequencesCancel'] = async (
	ctx,
	input,
) => {
	const { id, emails } = input;
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['sequencesCancel']
	>(ctx, mixmaxPathParameter('/v1/sequences/{id}/cancel', 'id', id), {
		method: 'POST',
		body: {
			emails,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.sequences.cancel',
		{ ...input },
		'completed',
	);
	return result;
};

export const sequencesRecipientsList: MixmaxEndpoints['sequencesRecipientsList'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['sequencesRecipientsList']
		>(
			ctx,
			// The reference writes this route with a trailing slash, in the
			// path and in its curl sample, so the request keeps it.
			mixmaxPathParameter('/v1/sequences/{id}/recipients/', 'id', input.id),
			{
				method: 'GET',
				query: {
					limit: input.limit,
					offset: input.offset,
					sortBy: input.sortBy,
					sortDesc: input.sortDesc,
					query: input.query,
					analyticsFrom: input.analyticsFrom,
					includeVariables: input.includeVariables,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'mixmax.sequences.recipients.list',
			{ ...input },
			'completed',
		);
		return result;
	};

export const sequencesRecipientsAdd: MixmaxEndpoints['sequencesRecipientsAdd'] =
	async (ctx, input) => {
		const { id, recipients, scheduledAt, enrich, allowMissingVariables } =
			input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['sequencesRecipientsAdd']
		>(ctx, mixmaxPathParameter('/v1/sequences/{id}/recipients/', 'id', id), {
			method: 'POST',
			body: {
				recipients,
				scheduledAt,
				enrich,
				allowMissingVariables,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.sequences.recipients.add',
			{ ...input },
			'completed',
		);
		return result;
	};

export const sequenceFoldersList: MixmaxEndpoints['sequenceFoldersList'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['sequenceFoldersList']
		>(ctx, '/v1/sequencefolders', { method: 'GET' });

		await logEventFromContext(
			ctx,
			'mixmax.sequenceFolders.list',
			{ ...input },
			'completed',
		);
		return result;
	};

export const sequenceFoldersCreate: MixmaxEndpoints['sequenceFoldersCreate'] =
	async (ctx, input) => {
		const { name, options } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['sequenceFoldersCreate']
		>(ctx, '/v1/sequencefolders', {
			method: 'POST',
			body: {
				name,
				options,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.sequenceFolders.create',
			{ ...input },
			'completed',
		);
		return result;
	};

export const sequenceFoldersGet: MixmaxEndpoints['sequenceFoldersGet'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['sequenceFoldersGet']
	>(ctx, mixmaxPathParameter('/v1/sequencefolders/{id}', 'id', input.id), {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'mixmax.sequenceFolders.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const sequenceFoldersRename: MixmaxEndpoints['sequenceFoldersRename'] =
	async (ctx, input) => {
		const { id, name, options } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['sequenceFoldersRename']
		>(ctx, mixmaxPathParameter('/v1/sequencefolders/{id}', 'id', id), {
			method: 'PATCH',
			body: {
				name,
				options,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.sequenceFolders.rename',
			{ ...input },
			'completed',
		);
		return result;
	};

export const sequenceFoldersDelete: MixmaxEndpoints['sequenceFoldersDelete'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['sequenceFoldersDelete']
		>(ctx, mixmaxPathParameter('/v1/sequencefolders/{id}', 'id', input.id), {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'mixmax.sequenceFolders.delete',
			{ ...input },
			'completed',
		);
		return result;
	};

export const sequenceFoldersAddSequences: MixmaxEndpoints['sequenceFoldersAddSequences'] =
	async (ctx, input) => {
		const { id, _id, sequenceIds } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['sequenceFoldersAddSequences']
		>(
			ctx,
			mixmaxPathParameter('/v1/sequencefolders/{id}/sequences', 'id', id),
			{
				method: 'POST',
				body: {
					_id,
					sequenceIds,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'mixmax.sequenceFolders.addSequences',
			{ ...input },
			'completed',
		);
		return result;
	};
