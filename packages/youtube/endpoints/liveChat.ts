import { logEventFromContext } from 'corsair/core';
import type { YoutubeEndpoints } from '..';
import { makeYoutubeRequest } from '../client';
import type { YoutubeEndpointOutputs } from './types';

export const listMessages: YoutubeEndpoints['liveChatListMessages'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['liveChatListMessages']
	>('/liveChat/messages', ctx.key, {
		method: 'GET',
		query: {
			liveChatId: input.liveChatId,
			part: input.part ?? 'snippet,authorDetails',
			...(input.hl && { hl: input.hl }),
			...(input.pageToken && { pageToken: input.pageToken }),
			...(input.maxResults && { maxResults: input.maxResults }),
			...(input.profileImageSize && {
				profileImageSize: input.profileImageSize,
			}),
		},
	});

	await logEventFromContext(
		ctx,
		'youtube.liveChat.listMessages',
		{ liveChatId: input.liveChatId },
		'completed',
	);
	return response;
};

export const listSuperChatEvents: YoutubeEndpoints['liveChatListSuperChatEvents'] =
	async (ctx, input) => {
		const response = await makeYoutubeRequest<
			YoutubeEndpointOutputs['liveChatListSuperChatEvents']
		>('/superChatEvents', ctx.key, {
			method: 'GET',
			query: {
				part: input.part ?? 'snippet',
				...(input.hl && { hl: input.hl }),
				...(input.pageToken && { pageToken: input.pageToken }),
				...(input.maxResults && { maxResults: input.maxResults }),
			},
		});

		await logEventFromContext(
			ctx,
			'youtube.liveChat.listSuperChatEvents',
			{},
			'completed',
		);
		return response;
	};
