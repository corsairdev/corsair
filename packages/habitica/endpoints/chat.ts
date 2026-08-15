import { logEventFromContext } from 'corsair/core';
import type { HabiticaEndpoints } from '../index';
import { auditPayload } from './logging';
import { compactQuery, habiticaCall, pathSegment } from './shared';
import type { HabiticaEndpointOutputs } from './types';

/**
 * Group chat.
 *
 * Nothing in this file is mirrored and no message text is ever logged. Chat
 * messages are other people's words attached to their identities; the plugin
 * passes them to the caller and keeps no copy.
 */

/** The default group when the caller names none. */
const PARTY_ALIAS = 'party';

/**
 * Reads a group's recent chat messages. Defaults to the caller's party.
 *
 * Public groups, including the Tavern, answer 400 "This feature is no longer supported."
 */
export const list: HabiticaEndpoints['chatList'] = async (ctx, input) => {
	const groupId = input.groupId ?? PARTY_ALIAS;
	const result = await habiticaCall<HabiticaEndpointOutputs['chatList']>(
		ctx,
		`groups/${pathSegment(groupId)}/chat`,
	);

	await logEventFromContext(
		ctx,
		'habitica.chat.list',
		{ groupId, returned: result.length },
		'completed',
	);
	return result;
};

/**
 * Deletes one chat message. The author or a group moderator only.
 *
 * `previousMsg` is Habitica's concurrency check: when supplied and the chat has
 * moved on, the API returns the updated message list instead of performing the
 * delete. It is passed through rather than defaulted, so a caller that does not
 * supply it gets an unconditional delete - which is Habitica's behaviour, not a
 * choice made here.
 */
export const deleteMessage: HabiticaEndpoints['chatDeleteMessage'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<
		HabiticaEndpointOutputs['chatDeleteMessage']
	>(
		ctx,
		`groups/${pathSegment(input.groupId)}/chat/${pathSegment(input.chatId)}`,
		{
			method: 'DELETE',
			query: compactQuery({ previousMsg: input.previousMsg }),
		},
	);

	await logEventFromContext(
		ctx,
		'habitica.chat.deleteMessage',
		auditPayload(input, ['groupId', 'chatId']),
		'completed',
	);
	return result;
};

/** Marks a group's chat as read, clearing the unread badge. */
export const markSeen: HabiticaEndpoints['chatMarkSeen'] = async (
	ctx,
	input,
) => {
	const result = await habiticaCall<HabiticaEndpointOutputs['chatMarkSeen']>(
		ctx,
		`groups/${pathSegment(input.groupId)}/chat/seen`,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'habitica.chat.markSeen',
		auditPayload(input, ['groupId']),
		'completed',
	);
	return result;
};
