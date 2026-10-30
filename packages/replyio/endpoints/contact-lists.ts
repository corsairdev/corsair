import { logEventFromContext } from 'corsair/core';
import { makeReplyioRequest } from '../client';
import type { ReplyioEndpoint, ReplyioEndpointContext } from './context';
import type { ReplyioEndpointOutputs } from './types';

export const list: ReplyioEndpoint<'contactListsList'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input?.top !== undefined) query.top = input.top;
	if (input?.skip !== undefined) query.skip = input.skip;
	if (input?.search !== undefined) query.search = input.search;

	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['contactListsList']
	>('contact-lists', ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'replyio.contactLists.list',
		{ top: input?.top, skip: input?.skip },
		'completed',
	);
	return response;
};
