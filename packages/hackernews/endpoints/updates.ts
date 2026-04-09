import { logEventFromContext } from 'corsair/core';
import type { HackerNewsEndpoints } from '..';
import { makeHackerNewsFirebaseRequest } from '../client';
import type { HackerNewsEndpointOutputs } from './types';

export const get: HackerNewsEndpoints['updatesGet'] = async (ctx, input) => {
	// Firebase returns { items: number[], profiles: string[] } directly
	const result = await makeHackerNewsFirebaseRequest<
		HackerNewsEndpointOutputs['updatesGet']
	>('updates.json', {
		query: { print: input.print },
	});

	if (ctx.db.items) {
		try {
			for (const id of result.items) {
				await ctx.db.items.upsertByEntityId(String(id), { id });
			}
		} catch (error) {
			console.warn('Failed to save updated item IDs to database:', error);
		}
	}

	if (ctx.db.users) {
		try {
			for (const username of result.profiles) {
				await ctx.db.users.upsertByEntityId(username, { id: username });
			}
		} catch (error) {
			console.warn('Failed to save updated profile IDs to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hackernews.updates.get',
		{ ...input },
		'completed',
	);
	return { ...result };
};
