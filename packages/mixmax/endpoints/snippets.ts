import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import { mixmaxPathParameter } from './path';
import type { MixmaxEndpointOutputs } from './types';

export const snippetsList: MixmaxEndpoints['snippetsList'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['snippetsList']>(
		ctx,
		'/v1/snippets',
		{
			method: 'GET',
			query: {
				search: input.search,
				isInline: input.isInline,
				deletedOnly: input.deletedOnly,
				archivedOnly: input.archivedOnly,
				sort: input.sort,
				sortAscending: input.sortAscending,
				expand: input.expand,
				limit: input.limit,
				next: input.next,
				previous: input.previous,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.snippets.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const snippetsGet: MixmaxEndpoints['snippetsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['snippetsGet']>(
		ctx,
		mixmaxPathParameter('/v1/snippets/{id}', 'id', input.id),
		{
			method: 'GET',
			query: {
				includeDeleted: input.includeDeleted,
				expand: input.expand,
				fields: input.fields,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.snippets.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const snippetsUpdate: MixmaxEndpoints['snippetsUpdate'] = async (
	ctx,
	input,
) => {
	// The id names the template in the path and `expand` is a query parameter,
	// so the body carries only the patchable template fields.
	const { id, expand, ...update } = input;
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['snippetsUpdate']
	>(ctx, mixmaxPathParameter('/v1/snippets/{id}', 'id', id), {
		method: 'PATCH',
		query: { expand },
		body: update,
	});

	await logEventFromContext(
		ctx,
		'mixmax.snippets.update',
		{
			// Template content is private email content; the event history
			// records the template id only.
			id: input.id,
		},
		'completed',
	);
	return result;
};

export const snippetsDelete: MixmaxEndpoints['snippetsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['snippetsDelete']
	>(ctx, mixmaxPathParameter('/v1/snippets/{id}', 'id', input.id), {
		method: 'DELETE',
		query: { archive: input.archive },
	});

	await logEventFromContext(
		ctx,
		'mixmax.snippets.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const snippetsSend: MixmaxEndpoints['snippetsSend'] = async (
	ctx,
	input,
) => {
	// The id names the template in the path, so the send body carries the
	// recipients, variables, and options only.
	const { id, ...send } = input;
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['snippetsSend']>(
		ctx,
		mixmaxPathParameter('/v1/snippets/{id}/send', 'id', id),
		{
			method: 'POST',
			body: send,
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.snippets.send',
		{
			// Recipient addresses, variables, and the rendered body are
			// private; the event history records only their shape.
			id: input.id,
			recipients: input.to.length,
			scheduled: input.scheduledAt !== undefined,
		},
		'completed',
	);
	return result;
};

export const snippetTagsList: MixmaxEndpoints['snippetTagsList'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['snippetTagsList']
	>(ctx, '/v1/snippettags', {
		method: 'GET',
		query: {
			search: input.search,
			isInline: input.isInline,
			sort: input.sort,
			sortAscending: input.sortAscending,
			expand: input.expand,
			limit: input.limit,
			next: input.next,
			previous: input.previous,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.snippetTags.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const snippetTagsCreate: MixmaxEndpoints['snippetTagsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['snippetTagsCreate']
	>(ctx, '/v1/snippettags', {
		method: 'POST',
		// The provider reads the snippet-folder flag from the query string,
		// not the body.
		query: { isInline: input.isInline },
		body: {
			name: input.name,
			options: input.options,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.snippetTags.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const snippetTagsGet: MixmaxEndpoints['snippetTagsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['snippetTagsGet']
	>(ctx, mixmaxPathParameter('/v1/snippettags/{id}', 'id', input.id), {
		method: 'GET',
		query: { expand: input.expand },
	});

	await logEventFromContext(
		ctx,
		'mixmax.snippetTags.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const snippetTagsUpdate: MixmaxEndpoints['snippetTagsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['snippetTagsUpdate']
	>(ctx, mixmaxPathParameter('/v1/snippettags/{id}', 'id', input.id), {
		method: 'PATCH',
		body: {
			name: input.name,
			options: input.options,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.snippetTags.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const snippetTagsDelete: MixmaxEndpoints['snippetTagsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['snippetTagsDelete']
	>(ctx, mixmaxPathParameter('/v1/snippettags/{id}', 'id', input.id), {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'mixmax.snippetTags.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const snippetTagsListSnippets: MixmaxEndpoints['snippetTagsListSnippets'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['snippetTagsListSnippets']
		>(
			ctx,
			mixmaxPathParameter('/v1/snippettags/{id}/snippets', 'id', input.id),
			{
				method: 'GET',
				query: {
					search: input.search,
					sort: input.sort,
					sortAscending: input.sortAscending,
					expand: input.expand,
					limit: input.limit,
					next: input.next,
					previous: input.previous,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'mixmax.snippetTags.listSnippets',
			{ ...input },
			'completed',
		);
		return result;
	};

export const snippetTagsAddSnippets: MixmaxEndpoints['snippetTagsAddSnippets'] =
	async (ctx, input) => {
		// The path id names the folder; the body's optional `_id` names an
		// existing template to move, so only the path id is stripped.
		const { id, ...snippet } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['snippetTagsAddSnippets']
		>(ctx, mixmaxPathParameter('/v1/snippettags/{id}/snippets', 'id', id), {
			method: 'POST',
			body: snippet,
		});

		await logEventFromContext(
			ctx,
			'mixmax.snippetTags.addSnippets',
			{ ...input },
			'completed',
		);
		return result;
	};
