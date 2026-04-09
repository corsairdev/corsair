import { logEventFromContext } from 'corsair/core';
import type { HackerNewsEndpoints } from '..';
import { makeHackerNewsFirebaseRequest } from '../client';

export const getTop: HackerNewsEndpoints['storiesGetTop'] = async (
	ctx,
	input,
) => {
	// Firebase returns a plain integer array for story feeds
	const ids = await makeHackerNewsFirebaseRequest<number[]>('topstories.json', {
		query: { print: input.print },
	});

	if (ctx.db.items) {
		try {
			for (const id of ids) {
				await ctx.db.items.upsertByEntityId(String(id), { id });
			}
		} catch (error) {
			console.warn('Failed to save top story IDs to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hackernews.stories.getTop',
		{ ...input },
		'completed',
	);
	return { story_ids: ids, count: ids.length };
};

export const getBest: HackerNewsEndpoints['storiesGetBest'] = async (
	ctx,
	input,
) => {
	const ids = await makeHackerNewsFirebaseRequest<number[]>(
		'beststories.json',
		{
			query: { print: input.print },
		},
	);

	if (ctx.db.items) {
		try {
			for (const id of ids) {
				await ctx.db.items.upsertByEntityId(String(id), { id });
			}
		} catch (error) {
			console.warn('Failed to save best story IDs to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hackernews.stories.getBest',
		{ ...input },
		'completed',
	);
	return { story_ids: ids, count: ids.length };
};

export const getNew: HackerNewsEndpoints['storiesGetNew'] = async (
	ctx,
	input,
) => {
	const ids = await makeHackerNewsFirebaseRequest<number[]>('newstories.json', {
		query: { print: input.print },
	});

	if (ctx.db.items) {
		try {
			for (const id of ids) {
				await ctx.db.items.upsertByEntityId(String(id), { id });
			}
		} catch (error) {
			console.warn('Failed to save new story IDs to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hackernews.stories.getNew',
		{ ...input },
		'completed',
	);
	return { story_ids: ids };
};

export const getAsk: HackerNewsEndpoints['storiesGetAsk'] = async (
	ctx,
	input,
) => {
	const ids = await makeHackerNewsFirebaseRequest<number[]>('askstories.json', {
		query: { print: input.print },
	});

	if (ctx.db.items) {
		try {
			for (const id of ids) {
				await ctx.db.items.upsertByEntityId(String(id), { id });
			}
		} catch (error) {
			console.warn('Failed to save ask story IDs to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hackernews.stories.getAsk',
		{ ...input },
		'completed',
	);
	return { story_ids: ids };
};

export const getShow: HackerNewsEndpoints['storiesGetShow'] = async (
	ctx,
	input,
) => {
	const ids = await makeHackerNewsFirebaseRequest<number[]>(
		'showstories.json',
		{
			query: { print: input.print },
		},
	);

	if (ctx.db.items) {
		try {
			for (const id of ids) {
				await ctx.db.items.upsertByEntityId(String(id), { id });
			}
		} catch (error) {
			console.warn('Failed to save show story IDs to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hackernews.stories.getShow',
		{ ...input },
		'completed',
	);
	return { story_ids: ids };
};

export const getJobs: HackerNewsEndpoints['storiesGetJobs'] = async (
	ctx,
	input,
) => {
	const ids = await makeHackerNewsFirebaseRequest<number[]>('jobstories.json', {
		query: { print: input.print },
	});

	if (ctx.db.items) {
		try {
			for (const id of ids) {
				await ctx.db.items.upsertByEntityId(String(id), { id });
			}
		} catch (error) {
			console.warn('Failed to save job story IDs to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hackernews.stories.getJobs',
		{ ...input },
		'completed',
	);
	return { job_story_ids: ids };
};
