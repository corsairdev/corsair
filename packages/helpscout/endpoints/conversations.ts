import { logEventFromContext } from 'corsair/core';
import { makeHelpscoutRequest } from '../client';
import type { HelpScoutEndpoints } from '../index';
import type { HelpScoutEndpointOutputs } from './types';
import {
	HelpScoutEndpointInputSchemas,
	HelpScoutEndpointOutputSchemas,
} from './types';

export const list: HelpScoutEndpoints['conversations.list'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['conversations.list'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['conversations.list']
	>('/conversations', ctx.key, {
		method: 'GET',
		query: {
			mailbox: parsedInput.mailbox,
			folder: parsedInput.folder,
			status: parsedInput.status,
			tag: parsedInput.tag,
			assigned_to: parsedInput.assigned_to,
			modifiedSince: parsedInput.modifiedSince,
			number: parsedInput.number,
			sortField: parsedInput.sortField,
			sortOrder: parsedInput.sortOrder,
			page: parsedInput.page,
			embed: parsedInput.embed,
			query: parsedInput.query,
		},
	});

	const parsed =
		HelpScoutEndpointOutputSchemas['conversations.list'].parse(response);

	await logEventFromContext(
		ctx,
		'helpscout.conversations.list',
		{ count: parsed._embedded.conversations.length },
		'completed',
	);

	return parsed;
};

export const get: HelpScoutEndpoints['conversations.get'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['conversations.get'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['conversations.get']
	>(
		`/conversations/${encodeURIComponent(String(parsedInput.conversationId))}`,
		ctx.key,
		{
			method: 'GET',
			query: {
				embed: parsedInput.embed,
			},
		},
	);

	const parsed =
		HelpScoutEndpointOutputSchemas['conversations.get'].parse(response);

	await logEventFromContext(
		ctx,
		'helpscout.conversations.get',
		{ conversationId: parsed.id },
		'completed',
	);

	return parsed;
};

export const create: HelpScoutEndpoints['conversations.create'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['conversations.create'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['conversations.create']
	>('/conversations', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});

	const parsed = HelpScoutEndpointOutputSchemas['conversations.create'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.conversations.create',
		{ mailboxId: parsedInput.mailboxId },
		'completed',
	);

	return parsed;
};

export const update: HelpScoutEndpoints['conversations.update'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['conversations.update'].parse(input);
	const { conversationId, ...patchBody } = parsedInput;

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['conversations.update']
	>(`/conversations/${encodeURIComponent(String(conversationId))}`, ctx.key, {
		method: 'PATCH',
		body: patchBody,
	});

	const parsed = HelpScoutEndpointOutputSchemas['conversations.update'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.conversations.update',
		{ conversationId: String(conversationId) },
		'completed',
	);

	return parsed;
};

export const remove: HelpScoutEndpoints['conversations.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['conversations.delete'].parse(input);

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['conversations.delete']
	>(
		`/conversations/${encodeURIComponent(String(parsedInput.conversationId))}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const parsed = HelpScoutEndpointOutputSchemas['conversations.delete'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.conversations.delete',
		{ conversationId: String(parsedInput.conversationId) },
		'completed',
	);

	return parsed;
};

export const updateFields: HelpScoutEndpoints['conversations.updateFields'] =
	async (ctx, input) => {
		const parsedInput =
			HelpScoutEndpointInputSchemas['conversations.updateFields'].parse(input);

		const response = await makeHelpscoutRequest<
			HelpScoutEndpointOutputs['conversations.updateFields']
		>(
			`/conversations/${encodeURIComponent(String(parsedInput.conversationId))}/fields`,
			ctx.key,
			{
				method: 'PUT',
				body: { fields: parsedInput.fields },
			},
		);

		const parsed = HelpScoutEndpointOutputSchemas[
			'conversations.updateFields'
		].parse(response ?? {});

		await logEventFromContext(
			ctx,
			'helpscout.conversations.updateFields',
			{ conversationId: String(parsedInput.conversationId) },
			'completed',
		);

		return parsed;
	};

export const updateTags: HelpScoutEndpoints['conversations.updateTags'] =
	async (ctx, input) => {
		const parsedInput =
			HelpScoutEndpointInputSchemas['conversations.updateTags'].parse(input);

		const response = await makeHelpscoutRequest<
			HelpScoutEndpointOutputs['conversations.updateTags']
		>(
			`/conversations/${encodeURIComponent(String(parsedInput.conversationId))}/tags`,
			ctx.key,
			{
				method: 'PUT',
				body: { tags: parsedInput.tags },
			},
		);

		const parsed = HelpScoutEndpointOutputSchemas[
			'conversations.updateTags'
		].parse(response ?? {});

		await logEventFromContext(
			ctx,
			'helpscout.conversations.updateTags',
			{ conversationId: String(parsedInput.conversationId) },
			'completed',
		);

		return parsed;
	};
