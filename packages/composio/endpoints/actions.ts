import { logEventFromContext } from 'corsair/core';
import type { ComposioEndpoints } from '..';
import { makeComposioRequest, omitUndefined } from '../client';
import type { ComposioEndpointOutputs } from './types';

export const list: ComposioEndpoints['actionsList'] = async (ctx, input) => {
	const toolkitSlug = input.toolkit_slug ?? input.appName;
	const response = await makeComposioRequest<
		ComposioEndpointOutputs['actionsList']
	>('/v3/tools', ctx.key, {
		method: 'GET',
		query: omitUndefined({
			toolkit_slug: toolkitSlug,
			query: input.query,
			limit: input.limit,
			cursor: input.cursor,
			toolkit_versions: input.toolkit_versions ?? 'latest',
		}),
	});

	await logEventFromContext(
		ctx,
		'composio.actions.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: ComposioEndpoints['actionGet'] = async (ctx, input) => {
	const toolSlug = input.tool_slug ?? input.actionId;
	if (!toolSlug) {
		throw new Error('tool_slug is required');
	}

	const response = await makeComposioRequest<
		ComposioEndpointOutputs['actionGet']
	>(`/v3/tools/${encodeURIComponent(toolSlug)}`, ctx.key, {
		method: 'GET',
		query: { toolkit_versions: 'latest' },
	});

	await logEventFromContext(
		ctx,
		'composio.actions.get',
		{ tool_slug: toolSlug },
		'completed',
	);
	return response;
};

export const execute: ComposioEndpoints['actionExecute'] = async (
	ctx,
	input,
) => {
	const toolSlug = input.tool_slug ?? input.actionId;
	if (!toolSlug) {
		throw new Error('tool_slug is required');
	}

	const arguments_ = input.arguments ?? input.input;
	const connectedAccountId = input.connected_account_id ?? input.connectionId;

	const response = await makeComposioRequest<
		ComposioEndpointOutputs['actionExecute']
	>(`/v3/tools/execute/${encodeURIComponent(toolSlug)}`, ctx.key, {
		method: 'POST',
		// Manual execute requires an explicit toolkit version (Composio docs).
		query: {
			toolkit_versions: input.toolkit_versions ?? 'latest',
		},
		body: {
			...(arguments_ ? { arguments: arguments_ } : {}),
			...(input.text ? { text: input.text } : {}),
			...(connectedAccountId
				? { connected_account_id: connectedAccountId }
				: {}),
			...(input.user_id ? { user_id: input.user_id } : {}),
			...(input.version ? { version: input.version } : {}),
		},
	});

	await logEventFromContext(
		ctx,
		'composio.actions.execute',
		{ tool_slug: toolSlug },
		'completed',
	);
	return response;
};
