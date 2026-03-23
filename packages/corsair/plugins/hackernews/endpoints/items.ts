import type { HackerNewsEndpoints } from '..';
import type { HackerNewsEndpointOutputs } from './types';
import { logEventFromContext } from '../../utils/events';
import { makeHackerNewsFirebaseRequest, makeHackerNewsAlgoliaRequest } from '../client';

// Raw Algolia item shape returned by the /items/{id} endpoint
type AlgoliaRawItem = {
	id: number;
	type?: string;
	author?: string;
	title?: string | null;
	url?: string | null;
	text?: string | null;
	points?: number | null;
	parent_id?: number | null;
	story_id?: number | null;
	created_at?: string;
	created_at_i?: number;
	// children is typed as unknown[] because the structure is deeply recursive
	children?: unknown[];
};

function truncate(text: string | null | undefined, maxLen: number): string | null | undefined {
	if (!text || text.length <= maxLen) return text;
	return text.slice(0, maxLen) + '...';
}

function transformAlgoliaItem(
	// item is typed as unknown because it comes from a recursive Algolia response
	item: unknown,
	depth: number,
	maxDepth: number,
	maxChildren: number,
	truncateText: boolean,
// Record<string, unknown> because this function is called recursively and children share the same shape
): Record<string, unknown> {
	// Cast to AlgoliaRawItem after checking it's an object
	const raw = item as AlgoliaRawItem;
	const totalChildren = Array.isArray(raw.children) ? raw.children.length : 0;
	const childrenTruncated = totalChildren > maxChildren;
	const slicedChildren = Array.isArray(raw.children)
		? raw.children.slice(0, maxChildren)
		: [];

	// Record<string, unknown>[] because children are produced by this same recursive function
	let processedChildren: Record<string, unknown>[] = [];
	let maxDepthReached = false;

	if (depth >= maxDepth) {
		maxDepthReached = slicedChildren.length > 0;
		processedChildren = [];
	} else {
		processedChildren = slicedChildren.map((child) =>
			transformAlgoliaItem(child, depth + 1, maxDepth, maxChildren, truncateText),
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
	const raw = await makeHackerNewsFirebaseRequest<HackerNewsEndpointOutputs['itemsGet'] | null>(
		`item/${input.id}.json`,
	);

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

	await logEventFromContext(ctx, 'hackernews.items.get', { ...input }, 'completed');
	return raw;
};

export const getWithId: HackerNewsEndpoints['itemsGetWithId'] = async (ctx, input) => {
	const maxDepth = input.max_depth ?? 2;
	const maxChildren = input.max_children ?? 10;
	const truncateText = input.truncate_text ?? true;

	let raw: AlgoliaRawItem | null = null;
	try {
		// Algolia items endpoint returns nested item with children
		raw = await makeHackerNewsAlgoliaRequest<AlgoliaRawItem>(`items/${input.item_id}`);
	} catch (error) {
		await logEventFromContext(ctx, 'hackernews.items.getWithId', { ...input }, 'completed');
		return {
			found: false,
			error_message: error instanceof Error ? error.message : 'Unknown error',
		};
	}

	if (!raw || !raw.id) {
		await logEventFromContext(ctx, 'hackernews.items.getWithId', { ...input }, 'completed');
		return { found: false, error_message: 'Item not found' };
	}

	const transformed = transformAlgoliaItem(raw, 0, maxDepth, maxChildren, truncateText);

	if (ctx.db.items) {
		try {
			await ctx.db.items.upsertByEntityId(String(raw.id), {
				id: raw.id,
				// Algolia returns type as a plain string; cast to the Firebase enum union for DB storage
			type: raw.type as HackerNewsEndpointOutputs['itemsGet']['type'] | undefined,
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

	await logEventFromContext(ctx, 'hackernews.items.getWithId', { ...input }, 'completed');
	return {
		found: true,
		// transformed is Record<string, unknown> from the recursive helper; cast to the typed output shape
		item: transformed as HackerNewsEndpointOutputs['itemsGetWithId']['item'],
	};
};

export const getMaxId: HackerNewsEndpoints['itemsGetMaxId'] = async (ctx, input) => {
	// Firebase returns a plain integer for maxitem
	const maxId = await makeHackerNewsFirebaseRequest<number>('maxitem.json', {
		query: { print: input.print },
	});

	await logEventFromContext(ctx, 'hackernews.items.getMaxId', { ...input }, 'completed');
	return { max_item_id: maxId };
};
