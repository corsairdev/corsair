import { logEventFromContext } from 'corsair/core';
import { makePushbulletRequest } from '../client';
import type { PushbulletEndpoints } from '../index';
import type { PushbulletEndpointOutputs } from './types';
import {
	PushbulletEndpointInputSchemas,
	PushbulletEndpointOutputSchemas,
} from './types';

export const create: PushbulletEndpoints['chatsCreate'] = async (
	ctx,
	input,
) => {
	const parsed = PushbulletEndpointInputSchemas.chatsCreate.parse(input);
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['chatsCreate']
	>('chats', ctx.key, {
		method: 'POST',
		body: { ...parsed },
		schema: PushbulletEndpointOutputSchemas.chatsCreate,
	});

	// The event log keeps identifiers, not content: the chat target's email
	// is personal data and does not belong in events.
	await logEventFromContext(
		ctx,
		'pushbullet.chats.create',
		{ iden: result.iden },
		'completed',
	);
	return result;
};

export const list: PushbulletEndpoints['chatsList'] = async (ctx, input) => {
	const parsed = PushbulletEndpointInputSchemas.chatsList.parse(input);
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['chatsList']
	>('chats', ctx.key, {
		method: 'GET',
		query: parsed,
		schema: PushbulletEndpointOutputSchemas.chatsList,
	});

	await logEventFromContext(
		ctx,
		'pushbullet.chats.list',
		{ ...parsed },
		'completed',
	);
	return result;
};

export const setMuted: PushbulletEndpoints['chatsSetMuted'] = async (
	ctx,
	input,
) => {
	const parsed = PushbulletEndpointInputSchemas.chatsSetMuted.parse(input);
	const { iden, ...body } = parsed;
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['chatsSetMuted']
	>(`chats/${encodeURIComponent(iden)}`, ctx.key, {
		method: 'POST',
		body,
		schema: PushbulletEndpointOutputSchemas.chatsSetMuted,
	});

	await logEventFromContext(
		ctx,
		'pushbullet.chats.setMuted',
		{ ...parsed },
		'completed',
	);
	return result;
};

export const remove: PushbulletEndpoints['chatsDelete'] = async (
	ctx,
	input,
) => {
	const parsed = PushbulletEndpointInputSchemas.chatsDelete.parse(input);
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['chatsDelete']
	>(`chats/${encodeURIComponent(parsed.iden)}`, ctx.key, {
		method: 'DELETE',
		schema: PushbulletEndpointOutputSchemas.chatsDelete,
	});

	await logEventFromContext(
		ctx,
		'pushbullet.chats.delete',
		{ ...parsed },
		'completed',
	);
	return result;
};
