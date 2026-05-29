import { logEventFromContext } from 'corsair/core';
import { makeBlueskyRequest } from '../client';
import type { BlueskyEndpoints } from '../index';
import type { BlueskyEndpointOutputs } from './types';

export const create: BlueskyEndpoints['postsCreate'] = async (ctx, input) => {
	const { text } = input;

	// Resolve api key (app password) and handle
	const apiKey = ctx.key; // Stored in the key manager as the API key
	const handle = ctx.options.handle ?? (await ctx.keys.get_handle()) ?? '';

	const record = {
		$type: 'app.bsky.feed.post',
		text,
		createdAt: new Date().toISOString(),
	};

	const response = await makeBlueskyRequest<
		BlueskyEndpointOutputs['postsCreate']
	>('com.atproto.repo.createRecord', apiKey, handle, {
		method: 'POST',
		requiresDid: true,
		body: {
			collection: 'app.bsky.feed.post',
			record,
		},
	});

	if (response.uri && ctx.db.posts) {
		try {
			await ctx.db.posts.upsertByEntityId(response.uri, {
				uri: response.uri,
				cid: response.cid,
				text,
				createdAt: record.createdAt,
			});
		} catch (error) {
			console.warn('[bluesky] Failed to save post to database:', error);
		}
	}

	await logEventFromContext(ctx, 'bluesky.posts.create', { text }, 'completed');

	return response;
};

export const deleteRecord: BlueskyEndpoints['postsDelete'] = async (
	ctx,
	input,
) => {
	const { uri } = input;

	// Extract rkey from uri. A URI typically has the format "at://did:plc:xyz/app.bsky.feed.post/3kxxxxx"
	let rkey = uri;
	if (uri.startsWith('at://')) {
		const parts = uri.split('/');
		rkey = parts[parts.length - 1] ?? '';
	}

	const apiKey = ctx.key;
	const handle = ctx.options.handle ?? (await ctx.keys.get_handle()) ?? '';

	await makeBlueskyRequest<void>(
		'com.atproto.repo.deleteRecord',
		apiKey,
		handle,
		{
			method: 'POST',
			requiresDid: true,
			body: {
				collection: 'app.bsky.feed.post',
				rkey,
			},
		},
	);

	if (ctx.db.posts) {
		try {
			await ctx.db.posts.deleteByEntityId(uri);
		} catch (error) {
			console.warn('[bluesky] Failed to delete post from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bluesky.posts.delete',
		{ uri, rkey },
		'completed',
	);

	return { success: true };
};
