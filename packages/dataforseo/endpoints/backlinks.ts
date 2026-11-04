import type { DataForSeoEndpoints } from '..';
import { call, results } from './call';

export const summary: DataForSeoEndpoints['backlinksSummary'] = async (
	ctx,
	input,
) => {
	const response = await call(
		ctx,
		'backlinksSummary',
		'backlinks.summary',
		{
			method: 'POST',
			path: '/v3/backlinks/summary/live',
		},
		input,
	);
	if (ctx.db.backlinkTargets) {
		try {
			for (const row of results(response)) {
				if (!row.target) continue;
				await ctx.db.backlinkTargets.upsertByEntityId(row.target, {
					target: row.target,
					rank: row.rank ?? undefined,
					backlinks: row.backlinks ?? undefined,
					referringDomains: row.referring_domains ?? undefined,
					referringMainDomains: row.referring_main_domains ?? undefined,
					spamScore: row.backlinks_spam_score ?? undefined,
					firstSeen: row.first_seen ?? undefined,
					updatedAt: new Date(),
				});
			}
		} catch (error) {
			console.warn('Failed to save DataForSEO backlink summary:', error);
		}
	}
	return response;
};

export const list: DataForSeoEndpoints['backlinksList'] = (ctx, input) =>
	call(
		ctx,
		'backlinksList',
		'backlinks.list',
		{
			method: 'POST',
			path: '/v3/backlinks/backlinks/live',
		},
		input,
	);

export const referringDomains: DataForSeoEndpoints['backlinksReferringDomains'] =
	(ctx, input) =>
		call(
			ctx,
			'backlinksReferringDomains',
			'backlinks.referringDomains',
			{
				method: 'POST',
				path: '/v3/backlinks/referring_domains/live',
			},
			input,
		);

export const anchors: DataForSeoEndpoints['backlinksAnchors'] = (ctx, input) =>
	call(
		ctx,
		'backlinksAnchors',
		'backlinks.anchors',
		{
			method: 'POST',
			path: '/v3/backlinks/anchors/live',
		},
		input,
	);

export const competitors: DataForSeoEndpoints['backlinksCompetitors'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'backlinksCompetitors',
		'backlinks.competitors',
		{
			method: 'POST',
			path: '/v3/backlinks/competitors/live',
		},
		input,
	);

export const bulkRanks: DataForSeoEndpoints['backlinksBulkRanks'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'backlinksBulkRanks',
		'backlinks.bulkRanks',
		{
			method: 'POST',
			path: '/v3/backlinks/bulk_ranks/live',
		},
		input,
	);
