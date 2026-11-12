import { logEventFromContext } from 'corsair/core';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpoints } from '../index';
import { callAhrefs, checkAhrefsOutput } from './request';
import { AhrefsEndpointInputSchemas } from './types';

export const getDomainRating: AhrefsEndpoints['getDomainRating'] = async (
	ctx,
	input,
) => {
	const response = checkAhrefsOutput(
		'getDomainRating',
		'ahrefs.siteExplorer.getDomainRating',
		await makeAhrefsRequest<unknown>('/site-explorer/domain-rating', ctx.key, {
			query: AhrefsEndpointInputSchemas.getDomainRating.parse(input),
		}),
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
	const response = checkAhrefsOutput(
		'backlinksStats',
		'ahrefs.siteExplorer.backlinksStats',
		await makeAhrefsRequest<unknown>(
			'/site-explorer/backlinks-stats',
			ctx.key,
			{ query: AhrefsEndpointInputSchemas.backlinksStats.parse(input) },
		),
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
	const response = checkAhrefsOutput(
		'organicKeywords',
		'ahrefs.siteExplorer.organicKeywords',
		await makeAhrefsRequest<unknown>(
			'/site-explorer/organic-keywords',
			ctx.key,
			{ query: AhrefsEndpointInputSchemas.organicKeywords.parse(input) },
		),
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
	const response = checkAhrefsOutput(
		'refdomains',
		'ahrefs.siteExplorer.refdomains',
		await makeAhrefsRequest<unknown>('/site-explorer/refdomains', ctx.key, {
			query: AhrefsEndpointInputSchemas.refdomains.parse(input),
		}),
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
	const response = checkAhrefsOutput(
		'topPages',
		'ahrefs.siteExplorer.topPages',
		await makeAhrefsRequest<unknown>('/site-explorer/top-pages', ctx.key, {
			query: AhrefsEndpointInputSchemas.topPages.parse(input),
		}),
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

export const metrics: AhrefsEndpoints['siteMetrics'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'siteMetrics',
			method: 'GET',
			path: '/site-explorer/metrics',
			event: 'ahrefs.siteExplorer.metrics',
			logKeys: ['portfolio_id', 'target', 'country', 'date', 'mode'],
		},
		input,
	);

export const metricsHistory: AhrefsEndpoints['metricsHistory'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'metricsHistory',
			method: 'GET',
			path: '/site-explorer/metrics-history',
			event: 'ahrefs.siteExplorer.metricsHistory',
			logKeys: [
				'portfolio_id',
				'target',
				'country',
				'date_from',
				'date_to',
				'mode',
			],
		},
		input,
	);

export const domainRatingHistory: AhrefsEndpoints['domainRatingHistory'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'domainRatingHistory',
			method: 'GET',
			path: '/site-explorer/domain-rating-history',
			event: 'ahrefs.siteExplorer.domainRatingHistory',
			logKeys: ['target', 'date_from', 'date_to'],
		},
		input,
	);

export const allBacklinks: AhrefsEndpoints['allBacklinks'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'allBacklinks',
			method: 'GET',
			path: '/site-explorer/all-backlinks',
			event: 'ahrefs.siteExplorer.allBacklinks',
			logKeys: ['portfolio_id', 'target', 'mode'],
		},
		input,
	);

export const brokenBacklinks: AhrefsEndpoints['brokenBacklinks'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'brokenBacklinks',
			method: 'GET',
			path: '/site-explorer/broken-backlinks',
			event: 'ahrefs.siteExplorer.brokenBacklinks',
			logKeys: ['portfolio_id', 'target', 'mode'],
		},
		input,
	);

export const anchors: AhrefsEndpoints['anchors'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'anchors',
			method: 'GET',
			path: '/site-explorer/anchors',
			event: 'ahrefs.siteExplorer.anchors',
			logKeys: ['portfolio_id', 'target', 'mode'],
		},
		input,
	);

export const organicCompetitors: AhrefsEndpoints['organicCompetitors'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'organicCompetitors',
			method: 'GET',
			path: '/site-explorer/organic-competitors',
			event: 'ahrefs.siteExplorer.organicCompetitors',
			logKeys: ['portfolio_id', 'target', 'country', 'date', 'mode'],
		},
		input,
	);

export const pagesByTraffic: AhrefsEndpoints['pagesByTraffic'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'pagesByTraffic',
			method: 'GET',
			path: '/site-explorer/pages-by-traffic',
			event: 'ahrefs.siteExplorer.pagesByTraffic',
			logKeys: ['portfolio_id', 'target', 'country', 'mode'],
		},
		input,
	);

export const refdomainsHistory: AhrefsEndpoints['refdomainsHistory'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'refdomainsHistory',
			method: 'GET',
			path: '/site-explorer/refdomains-history',
			event: 'ahrefs.siteExplorer.refdomainsHistory',
			logKeys: ['portfolio_id', 'target', 'date_from', 'date_to', 'mode'],
		},
		input,
	);

export const keywordsHistory: AhrefsEndpoints['keywordsHistory'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'keywordsHistory',
			method: 'GET',
			path: '/site-explorer/keywords-history',
			event: 'ahrefs.siteExplorer.keywordsHistory',
			logKeys: [
				'portfolio_id',
				'target',
				'country',
				'date_from',
				'date_to',
				'mode',
			],
		},
		input,
	);

export const linkedDomains: AhrefsEndpoints['linkedDomains'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'linkedDomains',
			method: 'GET',
			path: '/site-explorer/linkeddomains',
			event: 'ahrefs.siteExplorer.linkedDomains',
			logKeys: ['portfolio_id', 'target', 'mode'],
		},
		input,
	);

export const pagesByBacklinks: AhrefsEndpoints['pagesByBacklinks'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'pagesByBacklinks',
			method: 'GET',
			path: '/site-explorer/pages-by-backlinks',
			event: 'ahrefs.siteExplorer.pagesByBacklinks',
			logKeys: ['portfolio_id', 'target', 'mode'],
		},
		input,
	);

export const aiResponsesCount: AhrefsEndpoints['siteExplorerAiResponsesCount'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'siteExplorerAiResponsesCount',
				method: 'GET',
				path: '/site-explorer/ai-responses-count',
				event: 'ahrefs.siteExplorer.aiResponsesCount',
				logKeys: ['target', 'country', 'date'],
			},
			input,
		);

export const crawledPages: AhrefsEndpoints['siteExplorerCrawledPages'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'siteExplorerCrawledPages',
			method: 'GET',
			path: '/site-explorer/crawled-pages',
			event: 'ahrefs.siteExplorer.crawledPages',
			logKeys: ['target'],
		},
		input,
	);

export const linkedAnchorsExternal: AhrefsEndpoints['siteExplorerLinkedAnchorsExternal'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'siteExplorerLinkedAnchorsExternal',
				method: 'GET',
				path: '/site-explorer/linked-anchors-external',
				event: 'ahrefs.siteExplorer.linkedAnchorsExternal',
				logKeys: ['portfolio_id', 'target'],
			},
			input,
		);

export const linkedAnchorsInternal: AhrefsEndpoints['siteExplorerLinkedAnchorsInternal'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'siteExplorerLinkedAnchorsInternal',
				method: 'GET',
				path: '/site-explorer/linked-anchors-internal',
				event: 'ahrefs.siteExplorer.linkedAnchorsInternal',
				logKeys: ['portfolio_id', 'target'],
			},
			input,
		);

export const metricsByCountry: AhrefsEndpoints['siteExplorerMetricsByCountry'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'siteExplorerMetricsByCountry',
				method: 'GET',
				path: '/site-explorer/metrics-by-country',
				event: 'ahrefs.siteExplorer.metricsByCountry',
				logKeys: ['portfolio_id', 'target', 'date'],
			},
			input,
		);

export const outlinksStats: AhrefsEndpoints['siteExplorerOutlinksStats'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'siteExplorerOutlinksStats',
			method: 'GET',
			path: '/site-explorer/outlinks-stats',
			event: 'ahrefs.siteExplorer.outlinksStats',
			logKeys: ['target'],
		},
		input,
	);

export const pagesByInternalLinks: AhrefsEndpoints['siteExplorerPagesByInternalLinks'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'siteExplorerPagesByInternalLinks',
				method: 'GET',
				path: '/site-explorer/pages-by-internal-links',
				event: 'ahrefs.siteExplorer.pagesByInternalLinks',
				logKeys: ['portfolio_id', 'target'],
			},
			input,
		);

export const pagesHistory: AhrefsEndpoints['siteExplorerPagesHistory'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'siteExplorerPagesHistory',
			method: 'GET',
			path: '/site-explorer/pages-history',
			event: 'ahrefs.siteExplorer.pagesHistory',
			logKeys: ['portfolio_id', 'target', 'country', 'date_from', 'date_to'],
		},
		input,
	);

export const paidPages: AhrefsEndpoints['siteExplorerPaidPages'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'siteExplorerPaidPages',
			method: 'GET',
			path: '/site-explorer/paid-pages',
			event: 'ahrefs.siteExplorer.paidPages',
			logKeys: ['portfolio_id', 'target', 'country', 'date'],
		},
		input,
	);

export const totalSearchVolumeHistory: AhrefsEndpoints['siteExplorerTotalSearchVolumeHistory'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'siteExplorerTotalSearchVolumeHistory',
				method: 'GET',
				path: '/site-explorer/total-search-volume-history',
				event: 'ahrefs.siteExplorer.totalSearchVolumeHistory',
				logKeys: ['portfolio_id', 'target', 'country', 'date_from', 'date_to'],
			},
			input,
		);

export const urlRatingHistory: AhrefsEndpoints['siteExplorerUrlRatingHistory'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'siteExplorerUrlRatingHistory',
				method: 'GET',
				path: '/site-explorer/url-rating-history',
				event: 'ahrefs.siteExplorer.urlRatingHistory',
				logKeys: ['target', 'date_from', 'date_to'],
			},
			input,
		);
