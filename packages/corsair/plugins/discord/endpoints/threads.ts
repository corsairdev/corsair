import { logEventFromContext } from '../../utils/events';
import type { DiscordEndpoints } from '..';
import { makeDiscordRequest } from '../client';
import type { DiscordEndpointOutputs } from './types';

export const create: DiscordEndpoints['threadsCreate'] = async (ctx, input) => {
	const { channel_id, ...body } = input;

	const result = await makeDiscordRequest<
		DiscordEndpointOutputs['threadsCreate']
	>(`channels/${channel_id}/threads`, ctx.key, { method: 'POST', body });

	if (ctx.db.channels) {
		try {
			await ctx.db.channels.upsertByEntityId(result.id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save thread to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'discord.threads.create',
		{ channel_id, name: input.name },
		'completed',
	);
	return result;
};

export const createFromMessage: DiscordEndpoints['threadsCreateFromMessage'] =
	async (ctx, input) => {
		const { channel_id, message_id, ...body } = input;

		const result = await makeDiscordRequest<
			DiscordEndpointOutputs['threadsCreateFromMessage']
		>(`channels/${channel_id}/messages/${message_id}/threads`, ctx.key, {
			method: 'POST',
			body,
		});

		if (ctx.db.channels) {
			try {
				await ctx.db.channels.upsertByEntityId(result.id, {
					...result,
				});
			} catch (error) {
				console.warn('Failed to save thread to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'discord.threads.createFromMessage',
			{ channel_id, message_id, name: input.name },
			'completed',
		);
		return result;
	};
