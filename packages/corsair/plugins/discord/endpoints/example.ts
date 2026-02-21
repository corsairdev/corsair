import type { DiscordBoundEndpoints, DiscordEndpoints } from '..';
import type { DiscordEndpointOutputs } from './types';
import { logEventFromContext } from '../../utils/events';
import { makeDiscordRequest } from '../client';

export const get: DiscordEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeDiscordRequest<DiscordEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'discord.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
