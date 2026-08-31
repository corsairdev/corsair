import { logEventFromContext } from 'corsair/core';
import { makePushbulletRequest } from '../client';
import type { PushbulletEndpoints } from '../index';
import type { PushbulletEndpointOutputs } from './types';
import { PushbulletEndpointOutputSchemas } from './types';

export const create: PushbulletEndpoints['chatsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['chatsCreate']
	>('chats', ctx.key, {
		method: 'POST',
		body: input,
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
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['chatsList']
	>('chats', ctx.key, {
		method: 'GET',
		query: input,
		schema: PushbulletEndpointOutputSchemas.chatsList,
	});

	await logEventFromContext(
		ctx,
		'pushbullet.chats.list',
		{ ...input },
		'completed',
	);
	return result;
};

/** Mutes or unmutes a chat — the only mutable field Pushbullet exposes. */
export const setMuted: PushbulletEndpoints['chatsSetMuted'] = async (
	ctx,
	input,
) => {
	const { iden, ...body } = input;
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
		{ ...input },
		'completed',
	);
	return result;
};

export const remove: PushbulletEndpoints['chatsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['chatsDelete']
	>(`chats/${encodeURIComponent(input.iden)}`, ctx.key, {
		method: 'DELETE',
		schema: PushbulletEndpointOutputSchemas.chatsDelete,
	});

	await logEventFromContext(
		ctx,
		'pushbullet.chats.delete',
		{ ...input },
		'completed',
	);
	return result;
};
