import { logEventFromContext } from 'corsair/core';
import { makeHelpscoutRequest } from '../client';
import type { HelpScoutEndpoints } from '../index';
import type { HelpScoutEndpointOutputs } from './types';
import {
	HelpScoutEndpointInputSchemas,
	HelpScoutEndpointOutputSchemas,
} from './types';

export const list: HelpScoutEndpoints['savedReplies.list'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['savedReplies.list'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['savedReplies.list']
	>(
		`/mailboxes/${encodeURIComponent(String(parsedInput.mailboxId))}/saved-replies`,
		ctx.key,
		{
			method: 'GET',
			query: {
				includeChatReplies: parsedInput.includeChatReplies,
				page: parsedInput.page,
			},
		},
	);

	const parsed =
		HelpScoutEndpointOutputSchemas['savedReplies.list'].parse(response);

	const count = Array.isArray(parsed)
		? parsed.length
		: parsed._embedded.savedReplies.length;

	await logEventFromContext(
		ctx,
		'helpscout.savedReplies.list',
		{
			mailboxId: parsedInput.mailboxId,
			count,
		},
		'completed',
	);

	return parsed;
};

export const get: HelpScoutEndpoints['savedReplies.get'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['savedReplies.get'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['savedReplies.get']
	>(
		`/mailboxes/${encodeURIComponent(String(parsedInput.mailboxId))}/saved-replies/${encodeURIComponent(String(parsedInput.savedReplyId))}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	const parsed =
		HelpScoutEndpointOutputSchemas['savedReplies.get'].parse(response);

	await logEventFromContext(
		ctx,
		'helpscout.savedReplies.get',
		{ savedReplyId: parsed.id },
		'completed',
	);

	return parsed;
};

export const create: HelpScoutEndpoints['savedReplies.create'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['savedReplies.create'].parse(input);
	const { mailboxId, ...body } = parsedInput;

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['savedReplies.create']
	>(
		`/mailboxes/${encodeURIComponent(String(mailboxId))}/saved-replies`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	const parsed = HelpScoutEndpointOutputSchemas['savedReplies.create'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.savedReplies.create',
		{ mailboxId: String(mailboxId) },
		'completed',
	);

	return parsed;
};

export const update: HelpScoutEndpoints['savedReplies.update'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['savedReplies.update'].parse(input);
	const { mailboxId, savedReplyId, ...body } = parsedInput;

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['savedReplies.update']
	>(
		`/mailboxes/${encodeURIComponent(String(mailboxId))}/saved-replies/${encodeURIComponent(String(savedReplyId))}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);

	const parsed = HelpScoutEndpointOutputSchemas['savedReplies.update'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.savedReplies.update',
		{
			mailboxId: String(mailboxId),
			savedReplyId: String(savedReplyId),
		},
		'completed',
	);

	return parsed;
};

export const remove: HelpScoutEndpoints['savedReplies.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['savedReplies.delete'].parse(input);

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['savedReplies.delete']
	>(
		`/mailboxes/${encodeURIComponent(String(parsedInput.mailboxId))}/saved-replies/${encodeURIComponent(String(parsedInput.savedReplyId))}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const parsed = HelpScoutEndpointOutputSchemas['savedReplies.delete'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.savedReplies.delete',
		{
			mailboxId: String(parsedInput.mailboxId),
			savedReplyId: String(parsedInput.savedReplyId),
		},
		'completed',
	);

	return parsed;
};
