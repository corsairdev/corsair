import { logEventFromContext } from 'corsair/core';
import type { HackerNewsEndpoints } from '..';
import {
	makeHackerNewsAlgoliaRequest,
	makeHackerNewsFirebaseRequest,
} from '../client';

// Algolia users endpoint response shape
type AlgoliaUserRaw = {
	id?: string;
	username?: string;
	karma?: number;
	about?: string;
};

// Firebase user endpoint response shape
type FirebaseUserRaw = {
	id: string;
	karma: number;
	created: number;
	about?: string;
	submitted?: number[];
};

export const get: HackerNewsEndpoints['usersGet'] = async (ctx, input) => {
	// Algolia users endpoint returns { id, karma, about, ... }
	const raw = await makeHackerNewsAlgoliaRequest<AlgoliaUserRaw>(
		`users/${input.username}`,
	);

	const username = raw.id ?? raw.username ?? input.username;

	if (ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(username, {
				// spread raw to capture all Algolia user fields; override id with resolved username
				...raw,
				id: username,
				...(raw.karma !== undefined && { karma: raw.karma }),
			});
		} catch (error) {
			console.warn('Failed to save user to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hackernews.users.get',
		{ ...input },
		'completed',
	);
	return {
		username,
		about: raw.about,
		karma: raw.karma ?? 0,
	};
};

export const getByUsername: HackerNewsEndpoints['usersGetByUsername'] = async (
	ctx,
	input,
) => {
	// Firebase user endpoint returns the user object directly or null if not found
	const raw = await makeHackerNewsFirebaseRequest<FirebaseUserRaw | null>(
		`user/${input.username}.json`,
	);

	if (!raw) {
		throw new Error(`User '${input.username}' not found`);
	}

	if (ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(raw.id, { ...raw });
		} catch (error) {
			console.warn('Failed to save user to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hackernews.users.getByUsername',
		{ ...input },
		'completed',
	);
	return { ...raw };
};
