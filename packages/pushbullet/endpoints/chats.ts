import { logEventFromContext } from 'corsair/core';
import { makePushbulletRequest } from '../client';
import type { PushbulletEndpoints } from '../index';
import type { PushbulletEndpointOutputs } from './types';

export const create: PushbulletEndpoints['chatsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['chatsCreate']
	>('chats', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'pushbullet.chats.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: PushbulletEndpoints['chatsList'] = async (ctx, input) => {
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['chatsList']
	>('chats', ctx.key, { method: 'GET', query: input });

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
	>(`chats/${encodeURIComponent(iden)}`, ctx.key, { method: 'POST', body });

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
	>(`chats/${encodeURIComponent(input.iden)}`, ctx.key, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'pushbullet.chats.delete',
		{ ...input },
		'completed',
	);
	return result;
};
