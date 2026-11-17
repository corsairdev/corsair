import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeDraftableRequest, pathPart, signViewerPolicy } from '../client';
import type { DraftableContext } from '../context';
import { DraftableComparisonEntity } from '../schema/database';
import { callDraftable, requireKey } from './shared';
import type {
	CreateComparisonInput,
	CreateComparisonResponse,
	DeleteComparisonInput,
	DeleteComparisonResponse,
	DraftableComparison,
	GetComparisonInput,
	GetComparisonResponse,
	GetViewerUrlInput,
	GetViewerUrlResponse,
	ListComparisonsInput,
	ListComparisonsResponse,
} from './types';
import {
	ComparisonSchema,
	CreateComparisonInputSchema,
	CreateComparisonResponseSchema,
	DeleteComparisonInputSchema,
	GetComparisonInputSchema,
	GetComparisonResponseSchema,
	GetViewerUrlInputSchema,
	ListComparisonsInputSchema,
	ListComparisonsResponseSchema,
} from './types';

const comparisonPath = (identifier: string) =>
	`/comparisons/${pathPart(identifier)}`;

export const listComparisons: CorsairEndpoint<
	DraftableContext,
	ListComparisonsInput,
	ListComparisonsResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = ListComparisonsInputSchema.parse(input ?? {});
	const result = await callDraftable(
		ctx,
		'comparisons.list',
		{
			path: '/comparisons',
			query: { limit: parsed.limit, offset: parsed.offset },
		},
		ListComparisonsResponseSchema,
		{ offset: parsed.offset ?? 0 },
	);
	await storeComparisons(ctx, result.results);
	return result;
};

export const getComparison: CorsairEndpoint<
	DraftableContext,
	GetComparisonInput,
	GetComparisonResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = GetComparisonInputSchema.parse(input);
	const result = await callDraftable(
		ctx,
		'comparisons.get',
		{ path: comparisonPath(parsed.identifier) },
		GetComparisonResponseSchema,
		{ identifier: parsed.identifier },
	);
	await storeComparisons(ctx, [result]);
	return result;
};

export const createComparison: CorsairEndpoint<
	DraftableContext,
	CreateComparisonInput,
	CreateComparisonResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = CreateComparisonInputSchema.parse(input);
	const result = await callDraftable(
		ctx,
		'comparisons.create',
		{ method: 'POST', path: '/comparisons', body: parsed },
		CreateComparisonResponseSchema,
		{},
	);
	await storeComparisons(ctx, [result]);
	return result;
};

export const deleteComparison: CorsairEndpoint<
	DraftableContext,
	DeleteComparisonInput,
	DeleteComparisonResponse
> = async (ctx, input) => {
	const key = requireKey(ctx);
	const parsed = DeleteComparisonInputSchema.parse(input);
	// Draftable answers a delete with an empty 204. Anything else is not a
	// confirmation, so it is not reported as one.
	// unknown: the raw reply is checked right below.
	const body = await makeDraftableRequest<unknown>(key, {
		method: 'DELETE',
		path: comparisonPath(parsed.identifier),
	});
	if (body !== undefined && body !== null && body !== '') {
		throw new Error('Draftable answered the delete with an unexpected body');
	}
	if (ctx.db?.comparisons) {
		try {
			await ctx.db.comparisons.deleteByEntityId(parsed.identifier);
		} catch {
			console.warn('Failed to remove the stored Draftable comparison');
		}
	}
	await logEventFromContext(
		ctx,
		'draftable.comparisons.delete',
		{ identifier: parsed.identifier },
		'completed',
	);
	return { identifier: parsed.identifier, deleted: true as const };
};

/**
 * Builds the viewer link for a comparison. Public comparisons get the plain
 * link; private ones get a link signed with the auth token, as Draftable's
 * client libraries make it. The account id comes from the comparison's own
 * `viewer_url`, so no extra setting is needed.
 */
export const getViewerUrl: CorsairEndpoint<
	DraftableContext,
	GetViewerUrlInput,
	GetViewerUrlResponse
> = async (ctx, input) => {
	const key = requireKey(ctx);
	const parsed = GetViewerUrlInputSchema.parse(input);
	// unknown: the raw reply is parsed right below.
	const raw = await makeDraftableRequest<unknown>(key, {
		path: comparisonPath(parsed.identifier),
	});
	const comparison = ComparisonSchema.parse(raw);
	const viewerUrl = comparison.viewer_url;
	const match = viewerUrl?.match(
		/^https:\/\/api\.draftable\.com\/v1\/comparisons\/viewer\/([^/?#]+)\/[^/?#]+$/,
	);
	if (!viewerUrl || !match?.[1]) {
		throw new Error(
			'Draftable did not return a viewer_url for this comparison',
		);
	}
	const accountId = decodeURIComponent(match[1]);
	let result: GetViewerUrlResponse;
	if (comparison.public) {
		result = {
			identifier: comparison.identifier,
			url: `${viewerUrl}${parsed.wait ? '?wait' : ''}`,
			signed: false,
			valid_until: null,
		};
	} else {
		const validUntil =
			Math.floor(Date.now() / 1000) + (parsed.valid_for_minutes ?? 30) * 60;
		const signature = await signViewerPolicy(key, {
			account_id: accountId,
			identifier: comparison.identifier,
			valid_until: validUntil,
		});
		result = {
			identifier: comparison.identifier,
			url: `${viewerUrl}?valid_until=${validUntil}&signature=${signature}${parsed.wait ? '&wait' : ''}`,
			signed: true,
			valid_until: new Date(validUntil * 1000).toISOString(),
		};
	}
	await logEventFromContext(
		ctx,
		'draftable.comparisons.getViewerUrl',
		{ identifier: parsed.identifier },
		'completed',
	);
	return result;
};

/**
 * Saves each comparison's state. Fields a reply leaves out keep their stored
 * values.
 */
async function storeComparisons(
	ctx: DraftableContext,
	comparisons: DraftableComparison[],
): Promise<void> {
	if (!ctx.db?.comparisons) return;
	for (const comparison of comparisons) {
		try {
			const existing = await ctx.db.comparisons.findByEntityId(
				comparison.identifier,
			);
			const row = DraftableComparisonEntity.safeParse({
				...existing?.data,
				identifier: comparison.identifier,
				...(comparison.ready != null ? { ready: comparison.ready } : {}),
				...(comparison.creation_time != null
					? { creation_time: comparison.creation_time }
					: {}),
				...(comparison.public != null ? { public: comparison.public } : {}),
			});
			if (!row.success) continue;
			await ctx.db.comparisons.upsertByEntityId(
				comparison.identifier,
				row.data,
			);
		} catch {
			console.warn('Failed to save Draftable comparison');
		}
	}
}

export const Comparisons = {
	list: listComparisons,
	get: getComparison,
	create: createComparison,
	delete: deleteComparison,
	getViewerUrl,
};
