import { logEventFromContext } from 'corsair/core';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpoints } from '../index';
import type {
	AllBacklinksResponse,
	AnchorsResponse,
	BacklinksStatsResponse,
	BrokenBacklinksResponse,
	DomainRatingHistoryResponse,
	DomainRatingResponse,
	KeywordsHistoryResponse,
	LinkedDomainsResponse,
	MetricsHistoryResponse,
	OrganicCompetitorsResponse,
	OrganicKeywordsResponse,
	PagesByBacklinksResponse,
	PagesByTrafficResponse,
	RefdomainsHistoryResponse,
	RefdomainsResponse,
	SiteMetricsResponse,
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

export const metrics: AhrefsEndpoints['siteMetrics'] = async (ctx, input) => {
	const response = await makeAhrefsRequest<SiteMetricsResponse>(
		'/site-explorer/metrics',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.siteExplorer.metrics',
		{
			portfolio_id: input.portfolio_id,
			target: input.target,
			country: input.country,
			date: input.date,
			mode: input.mode,
		},
		'completed',
	);

	return response;
};

export const metricsHistory: AhrefsEndpoints['metricsHistory'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<MetricsHistoryResponse>(
		'/site-explorer/metrics-history',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.siteExplorer.metricsHistory',
		{
			portfolio_id: input.portfolio_id,
			target: input.target,
			country: input.country,
			date_from: input.date_from,
			date_to: input.date_to,
			mode: input.mode,
			resultCount: response.metrics.length,
		},
		'completed',
	);

	return response;
};

export const domainRatingHistory: AhrefsEndpoints['domainRatingHistory'] =
	async (ctx, input) => {
		const response = await makeAhrefsRequest<DomainRatingHistoryResponse>(
			'/site-explorer/domain-rating-history',
			ctx.key,
			{
				query: input,
			},
		);

		await logEventFromContext(
			ctx,
			'ahrefs.siteExplorer.domainRatingHistory',
			{
				target: input.target,
				date_from: input.date_from,
				date_to: input.date_to,
				resultCount: response.domain_ratings.length,
			},
			'completed',
		);

		return response;
	};

export const allBacklinks: AhrefsEndpoints['allBacklinks'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<AllBacklinksResponse>(
		'/site-explorer/all-backlinks',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.siteExplorer.allBacklinks',
		{
			portfolio_id: input.portfolio_id,
			target: input.target,
			mode: input.mode,
			resultCount: response.backlinks.length,
		},
		'completed',
	);

	return response;
};

export const brokenBacklinks: AhrefsEndpoints['brokenBacklinks'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<BrokenBacklinksResponse>(
		'/site-explorer/broken-backlinks',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.siteExplorer.brokenBacklinks',
		{
			portfolio_id: input.portfolio_id,
			target: input.target,
			mode: input.mode,
			resultCount: response.backlinks.length,
		},
		'completed',
	);

	return response;
};

export const anchors: AhrefsEndpoints['anchors'] = async (ctx, input) => {
	const response = await makeAhrefsRequest<AnchorsResponse>(
		'/site-explorer/anchors',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.siteExplorer.anchors',
		{
			portfolio_id: input.portfolio_id,
			target: input.target,
			mode: input.mode,
			resultCount: response.anchors.length,
		},
		'completed',
	);

	return response;
};

export const organicCompetitors: AhrefsEndpoints['organicCompetitors'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<OrganicCompetitorsResponse>(
		'/site-explorer/organic-competitors',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.siteExplorer.organicCompetitors',
		{
			portfolio_id: input.portfolio_id,
			target: input.target,
			country: input.country,
			date: input.date,
			mode: input.mode,
			resultCount: response.competitors.length,
		},
		'completed',
	);

	return response;
};

export const pagesByTraffic: AhrefsEndpoints['pagesByTraffic'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<PagesByTrafficResponse>(
		'/site-explorer/pages-by-traffic',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.siteExplorer.pagesByTraffic',
		{
			portfolio_id: input.portfolio_id,
			target: input.target,
			country: input.country,
			mode: input.mode,
		},
		'completed',
	);

	return response;
};

export const refdomainsHistory: AhrefsEndpoints['refdomainsHistory'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<RefdomainsHistoryResponse>(
		'/site-explorer/refdomains-history',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.siteExplorer.refdomainsHistory',
		{
			portfolio_id: input.portfolio_id,
			target: input.target,
			date_from: input.date_from,
			date_to: input.date_to,
			mode: input.mode,
			resultCount: response.refdomains.length,
		},
		'completed',
	);

	return response;
};

export const keywordsHistory: AhrefsEndpoints['keywordsHistory'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<KeywordsHistoryResponse>(
		'/site-explorer/keywords-history',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.siteExplorer.keywordsHistory',
		{
			portfolio_id: input.portfolio_id,
			target: input.target,
			country: input.country,
			date_from: input.date_from,
			date_to: input.date_to,
			mode: input.mode,
			resultCount: response.keywords.length,
		},
		'completed',
	);

	return response;
};

export const linkedDomains: AhrefsEndpoints['linkedDomains'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<LinkedDomainsResponse>(
		'/site-explorer/linkeddomains',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.siteExplorer.linkedDomains',
		{
			portfolio_id: input.portfolio_id,
			target: input.target,
			mode: input.mode,
			resultCount: response.linkeddomains.length,
		},
		'completed',
	);

	return response;
};

export const pagesByBacklinks: AhrefsEndpoints['pagesByBacklinks'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<PagesByBacklinksResponse>(
		'/site-explorer/pages-by-backlinks',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.siteExplorer.pagesByBacklinks',
		{
			portfolio_id: input.portfolio_id,
			target: input.target,
			mode: input.mode,
			resultCount: response.pages.length,
		},
		'completed',
	);

	return response;
};
