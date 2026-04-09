import { logEventFromContext } from 'corsair/core';
import type { HackerNewsEndpoints } from '..';
import {
	makeHackerNewsAlgoliaRequest,
	makeHackerNewsFirebaseRequest,
} from '../client';
import type { HackerNewsEndpointOutputs } from './types';

// Raw Algolia item shape returned by the /items/{id} endpoint
type AlgoliaRawItem = {
	id: number;
	type?: 'job' | 'story' | 'comment' | 'poll' | 'pollopt';
	author?: string;
	title?: string | null;
	url?: string | null;
	text?: string | null;
	points?: number | null;
	parent_id?: number | null;
	story_id?: number | null;
	created_at?: string;
	created_at_i?: number;
	children?: AlgoliaRawItem[];
};

function truncate(
	text: string | null | undefined,
	maxLen: number,
): string | null | undefined {
	if (!text || text.length <= maxLen) return text;
	return text.slice(0, maxLen) + '...';
}

type TransformedItem = NonNullable<
	HackerNewsEndpointOutputs['itemsGetWithId']['item']
>;

function transformAlgoliaItem(
	raw: AlgoliaRawItem,
	depth: number,
	maxDepth: number,
	maxChildren: number,
	truncateText: boolean,
): TransformedItem {
	const totalChildren = raw.children ? raw.children.length : 0;
	const childrenTruncated = totalChildren > maxChildren;
	const slicedChildren = raw.children ? raw.children.slice(0, maxChildren) : [];

	let processedChildren: TransformedItem[] = [];
	let maxDepthReached = false;

	if (depth >= maxDepth) {
		maxDepthReached = slicedChildren.length > 0;
		processedChildren = [];
	} else {
		processedChildren = slicedChildren.map((child) =>
			transformAlgoliaItem(
				child,
				depth + 1,
				maxDepth,
				maxChildren,
				truncateText,
			),
		);
	}

	return {
		id: raw.id,
		type: raw.type,
		author: raw.author,
		title: raw.title,
		url: raw.url,
		text: truncateText ? truncate(raw.text, 500) : raw.text,
		points: raw.points,
		parent_id: raw.parent_id,
		story_id: raw.story_id,
		created_at: raw.created_at,
		created_at_i: raw.created_at_i,
		children: processedChildren,
		children_shown: processedChildren.length,
		max_depth_reached: maxDepthReached,
		children_truncated: childrenTruncated,
		total_children_count: totalChildren,
	};
}

export const get: HackerNewsEndpoints['itemsGet'] = async (ctx, input) => {
	// Firebase returns the raw item object or null if deleted/not found
	const raw = await makeHackerNewsFirebaseRequest<
		HackerNewsEndpointOutputs['itemsGet'] | null
	>(`item/${input.id}.json`);

	if (!raw) {
		throw new Error(`Item ${input.id} not found`);
	}

	if (ctx.db.items) {
		try {
			await ctx.db.items.upsertByEntityId(String(raw.id), { ...raw });
		} catch (error) {
			console.warn('Failed to save item to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hackernews.items.get',
		{ ...input },
		'completed',
	);
	return raw;
};

export const getWithId: HackerNewsEndpoints['itemsGetWithId'] = async (
	ctx,
	input,
) => {
	const maxDepth = input.max_depth ?? 2;
	const maxChildren = input.max_children ?? 10;
	const truncateText = input.truncate_text ?? true;

	let raw: AlgoliaRawItem | null = null;
	try {
		// Algolia items endpoint returns nested item with children
		raw = await makeHackerNewsAlgoliaRequest<AlgoliaRawItem>(
			`items/${input.item_id}`,
		);
	} catch (error) {
		await logEventFromContext(
			ctx,
			'hackernews.items.getWithId',
			{ ...input },
			'completed',
		);
		return {
			found: false,
			error_message: error instanceof Error ? error.message : 'Unknown error',
		};
	}

	if (!raw || !raw.id) {
		await logEventFromContext(
			ctx,
			'hackernews.items.getWithId',
			{ ...input },
			'completed',
		);
		return { found: false, error_message: 'Item not found' };
	}

	const transformed = transformAlgoliaItem(
		raw,
		0,
		maxDepth,
		maxChildren,
		truncateText,
	);

	if (ctx.db.items) {
		try {
			await ctx.db.items.upsertByEntityId(String(raw.id), {
				id: raw.id,
				type: raw.type,
				by: raw.author,
				title: raw.title ?? undefined,
				url: raw.url ?? undefined,
				text: raw.text ?? undefined,
				time: raw.created_at_i,
			});
		} catch (error) {
			console.warn('Failed to save item to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hackernews.items.getWithId',
		{ ...input },
		'completed',
	);
	return {
		found: true,
		item: transformed,
	};
};

export const getMaxId: HackerNewsEndpoints['itemsGetMaxId'] = async (
	ctx,
	input,
) => {
	// Firebase returns a plain integer for maxitem
	const maxId = await makeHackerNewsFirebaseRequest<number>('maxitem.json', {
		query: { print: input.print },
	});

	await logEventFromContext(
		ctx,
		'hackernews.items.getMaxId',
		{ ...input },
		'completed',
	);
	return { max_item_id: maxId };
};
