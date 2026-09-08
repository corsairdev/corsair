import { logEventFromContext } from 'corsair/core';
import { makeSlackbotRequest } from '../client';
import type { SlackbotEndpoints } from '../index';
import type { SlackbotEndpointOutputs } from './types';

/**
 * Creates a standalone canvas, or a channel canvas when `channel_id` is given.
 * Slack routes those through two different methods.
 */
export const create: SlackbotEndpoints['canvasesCreate'] = async (
	ctx,
	input,
) => {
	const { channel_id, ...rest } = input;
	const method = channel_id
		? 'conversations.canvases.create'
		: 'canvases.create';
	const body = channel_id ? { channel_id, ...rest } : rest;

	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['canvasesCreate']
	>(method, ctx.key, { method: 'POST', body });
	await logEventFromContext(
		ctx,
		'slackbot.canvases.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const edit: SlackbotEndpoints['canvasesEdit'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['canvasesEdit']
	>('canvases.edit', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.canvases.edit',
		{ ...input },
		'completed',
	);
	return result;
};

export const remove: SlackbotEndpoints['canvasesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['canvasesDelete']
	>('canvases.delete', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.canvases.delete',
		{ ...input },
		'completed',
	);
	return result;
};

/**
 * Slack exposes no `canvases.info`. A canvas is backed by a file record, so its
 * content and metadata are read through `files.info` using the canvas id.
 */
export const get: SlackbotEndpoints['canvasesGet'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['canvasesGet']
	>('files.info', ctx.key, { method: 'GET', query: { file: input.canvas_id } });
	await logEventFromContext(
		ctx,
		'slackbot.canvases.get',
		{ ...input },
		'completed',
	);
	return result;
};

/**
 * Likewise there is no `canvases.list`; canvases are listed by filtering the
 * file index to the `canvas` type.
 */
export const list: SlackbotEndpoints['canvasesList'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['canvasesList']
	>('files.list', ctx.key, {
		method: 'GET',
		query: { ...input, types: 'canvas' },
	});
	await logEventFromContext(
		ctx,
		'slackbot.canvases.list',
		{ ...input },
		'completed',
	);
	return result;
};

/**
 * Resolves section ids for a canvas, which `canvases.edit` needs to target an
 * insert or replace at a specific heading.
 */
export const sectionsLookup: SlackbotEndpoints['canvasesSectionsLookup'] =
	async (ctx, input) => {
		const result = await makeSlackbotRequest<
			SlackbotEndpointOutputs['canvasesSectionsLookup']
		>('canvases.sections.lookup', ctx.key, { method: 'POST', body: input });
		await logEventFromContext(
			ctx,
			'slackbot.canvases.sectionsLookup',
			{ ...input },
			'completed',
		);
		return result;
	};
