import { logEventFromContext } from 'corsair/core';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpoints } from '../index';
import type {
	BacklinksStatsResponse,
	DomainRatingResponse,
	OrganicKeywordsResponse,
	RefdomainsResponse,
	TopPagesResponse,
} from './types';

export const getDomainRating: AhrefsEndpoints['getDomainRating'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<DomainRatingResponse>(
		'/site-explorer/domain-rating',
		ctx.key,
		{ query: input },
	);

	try {
		const entityId = [input.target, input.date].join(':');

		await ctx.db.domainMetrics.upsertByEntityId(entityId, {
			...response.domain_rating,
			target: input.target,
			date: input.date,
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn(
			`[ahrefs] Failed to save domain rating for ${input.target}:`,
			error,
		);
	}

	await logEventFromContext(
		ctx,
		'ahrefs.siteExplorer.getDomainRating',
		{ target: input.target, date: input.date },
		'completed',
	);

	return response;
};

export const backlinksStats: AhrefsEndpoints['backlinksStats'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<BacklinksStatsResponse>(
		'/site-explorer/backlinks-stats',
		ctx.key,
		{ query: input },
	);

	try {
		const entityId = [input.target, input.date].join(':');

		await ctx.db.domainMetrics.upsertByEntityId(entityId, {
			target: input.target,
			backlinks: response.metrics.live,
			referring_domains: response.metrics.live_refdomains,
			all_time_backlinks: response.metrics.all_time,
			all_time_referring_domains: response.metrics.all_time_refdomains,
			date: input.date,
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn(
			`[ahrefs] Failed to save backlink stats for ${input.target}:`,
			error,
		);
	}

	await logEventFromContext(
		ctx,
		'ahrefs.siteExplorer.backlinksStats',
		{ target: input.target, date: input.date, mode: input.mode },
		'completed',
	);

	return response;
};

export const organicKeywords: AhrefsEndpoints['organicKeywords'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<OrganicKeywordsResponse>(
		'/site-explorer/organic-keywords',
		ctx.key,
		{ query: input },
	);

	for (const keyword of response.keywords) {
		if (!keyword.keyword) continue;

		try {
			const entityId = [
				input.target,
				input.country,
				input.date,
				keyword.keyword,
			].join(':');

			await ctx.db.keywords.upsertByEntityId(entityId, {
				...keyword,
				target: input.target,
				country: input.country,
				date: input.date,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				`[ahrefs] Failed to save organic keyword ${keyword.keyword}:`,
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'ahrefs.siteExplorer.organicKeywords',
		{
			target: input.target,
			country: input.country,
			date: input.date,
			resultCount: response.keywords.length,
		},
		'completed',
	);

	return response;
};

export const refdomains: AhrefsEndpoints['refdomains'] = async (ctx, input) => {
	const response = await makeAhrefsRequest<RefdomainsResponse>(
		'/site-explorer/refdomains',
		ctx.key,
		{ query: input },
	);

	for (const refdomain of response.refdomains) {
		try {
			const entityId = [input.target, refdomain.domain].join(':');

			await ctx.db.refdomains.upsertByEntityId(entityId, {
				...refdomain,
				target: input.target,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				`[ahrefs] Failed to save refdomain ${refdomain.domain}:`,
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'ahrefs.siteExplorer.refdomains',
		{
			target: input.target,
			history: input.history,
			resultCount: response.refdomains.length,
		},
		'completed',
	);

	return response;
};

export const topPages: AhrefsEndpoints['topPages'] = async (ctx, input) => {
	const response = await makeAhrefsRequest<TopPagesResponse>(
		'/site-explorer/top-pages',
		ctx.key,
		{ query: input },
	);

	for (const page of response.pages) {
		try {
			const entityId = [
				input.target,
				input.country,
				input.date,
				page.raw_url,
			].join(':');

			await ctx.db.pages.upsertByEntityId(entityId, {
				...page,
				target: input.target,
				country: input.country,
				date: input.date,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn(`[ahrefs] Failed to save top page ${page.raw_url}:`, error);
		}
	}

	await logEventFromContext(
		ctx,
		'ahrefs.siteExplorer.topPages',
		{
			target: input.target,
			country: input.country,
			date: input.date,
			resultCount: response.pages.length,
		},
		'completed',
	);

	return response;
};
