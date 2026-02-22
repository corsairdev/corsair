import { logEventFromContext } from '../../utils/events';
import type { DiscordEndpoints } from '..';
import { makeDiscordRequest } from '../client';
import type { DiscordEndpointOutputs } from './types';

export const get: DiscordEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeDiscordRequest<
		DiscordEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'discord.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
