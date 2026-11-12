import { logEventFromContext } from 'corsair/core';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpoints } from '../index';
import type {
	GscAnonymousQueriesResponse,
	GscCtrByPositionResponse,
	GscKeywordHistoryResponse,
	GscKeywordsResponse,
	GscMetricsByCountryResponse,
	GscPageHistoryResponse,
	GscPagesHistoryResponse,
	GscPagesResponse,
	GscPerformanceByDeviceResponse,
	GscPerformanceByPositionResponse,
	GscPerformanceHistoryResponse,
	GscPositionsHistoryResponse,
} from './types';

export const keywords: AhrefsEndpoints['gscKeywords'] = async (ctx, input) => {
	const response = await makeAhrefsRequest<GscKeywordsResponse>(
		'/gsc/keywords',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.gsc.keywords',
		{
			project_id: input.project_id,
			portfolio_id: input.portfolio_id,
			country: input.country,
			date_from: input.date_from,
			date_to: input.date_to,
			keyword_list_id: input.keyword_list_id,
			resultCount: response.keywords.length,
		},
		'completed',
	);

	return response;
};

export const pages: AhrefsEndpoints['gscPages'] = async (ctx, input) => {
	const response = await makeAhrefsRequest<GscPagesResponse>(
		'/gsc/pages',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.gsc.pages',
		{
			project_id: input.project_id,
			portfolio_id: input.portfolio_id,
			country: input.country,
			date_from: input.date_from,
			date_to: input.date_to,
			resultCount: response.pages.length,
		},
		'completed',
	);

	return response;
};

export const performanceHistory: AhrefsEndpoints['gscPerformanceHistory'] =
	async (ctx, input) => {
		const response = await makeAhrefsRequest<GscPerformanceHistoryResponse>(
			'/gsc/performance-history',
			ctx.key,
			{
				query: input,
			},
		);

		await logEventFromContext(
			ctx,
			'ahrefs.gsc.performanceHistory',
			{
				project_id: input.project_id,
				portfolio_id: input.portfolio_id,
				country: input.country,
				date_from: input.date_from,
				date_to: input.date_to,
				resultCount: response.metrics.length,
			},
			'completed',
		);

		return response;
	};

export const keywordHistory: AhrefsEndpoints['gscKeywordHistory'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<GscKeywordHistoryResponse>(
		'/gsc/keyword-history',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.gsc.keywordHistory',
		{
			project_id: input.project_id,
			portfolio_id: input.portfolio_id,
			keywords: input.keywords,
			country: input.country,
			date_from: input.date_from,
			date_to: input.date_to,
			resultCount: response.metrics.length,
		},
		'completed',
	);

	return response;
};

export const pageHistory: AhrefsEndpoints['gscPageHistory'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<GscPageHistoryResponse>(
		'/gsc/page-history',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.gsc.pageHistory',
		{
			project_id: input.project_id,
			portfolio_id: input.portfolio_id,
			country: input.country,
			date_from: input.date_from,
			date_to: input.date_to,
			resultCount: response.metrics.length,
		},
		'completed',
	);

	return response;
};

export const pagesHistory: AhrefsEndpoints['gscPagesHistory'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<GscPagesHistoryResponse>(
		'/gsc/pages-history',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.gsc.pagesHistory',
		{
			project_id: input.project_id,
			portfolio_id: input.portfolio_id,
			country: input.country,
			date_from: input.date_from,
			date_to: input.date_to,
			resultCount: response.metrics.length,
		},
		'completed',
	);

	return response;
};

export const positionsHistory: AhrefsEndpoints['gscPositionsHistory'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<GscPositionsHistoryResponse>(
		'/gsc/positions-history',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.gsc.positionsHistory',
		{
			project_id: input.project_id,
			portfolio_id: input.portfolio_id,
			country: input.country,
			date_from: input.date_from,
			date_to: input.date_to,
			resultCount: response.metrics.length,
		},
		'completed',
	);

	return response;
};

export const ctrByPosition: AhrefsEndpoints['gscCtrByPosition'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<GscCtrByPositionResponse>(
		'/gsc/ctr-by-position',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.gsc.ctrByPosition',
		{
			project_id: input.project_id,
			portfolio_id: input.portfolio_id,
			country: input.country,
			date_from: input.date_from,
			date_to: input.date_to,
			resultCount: response.metrics.length,
		},
		'completed',
	);

	return response;
};

export const performanceByDevice: AhrefsEndpoints['gscPerformanceByDevice'] =
	async (ctx, input) => {
		const response = await makeAhrefsRequest<GscPerformanceByDeviceResponse>(
			'/gsc/performance-by-device',
			ctx.key,
			{
				query: input,
			},
		);

		await logEventFromContext(
			ctx,
			'ahrefs.gsc.performanceByDevice',
			{
				project_id: input.project_id,
				portfolio_id: input.portfolio_id,
				country: input.country,
				date_from: input.date_from,
				date_to: input.date_to,
				resultCount: response.metrics.length,
			},
			'completed',
		);

		return response;
	};

export const performanceByPosition: AhrefsEndpoints['gscPerformanceByPosition'] =
	async (ctx, input) => {
		const response = await makeAhrefsRequest<GscPerformanceByPositionResponse>(
			'/gsc/performance-by-position',
			ctx.key,
			{
				query: input,
			},
		);

		await logEventFromContext(
			ctx,
			'ahrefs.gsc.performanceByPosition',
			{
				project_id: input.project_id,
				portfolio_id: input.portfolio_id,
				country: input.country,
				date_from: input.date_from,
				date_to: input.date_to,
				resultCount: response.metrics.length,
			},
			'completed',
		);

		return response;
	};

export const metricsByCountry: AhrefsEndpoints['gscMetricsByCountry'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<GscMetricsByCountryResponse>(
		'/gsc/metrics-by-country',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.gsc.metricsByCountry',
		{
			project_id: input.project_id,
			portfolio_id: input.portfolio_id,
			date_from: input.date_from,
			date_to: input.date_to,
			resultCount: response.metrics.length,
		},
		'completed',
	);

	return response;
};

export const anonymousQueries: AhrefsEndpoints['gscAnonymousQueries'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<GscAnonymousQueriesResponse>(
		'/gsc/anonymous-queries',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.gsc.anonymousQueries',
		{
			project_id: input.project_id,
			country: input.country,
			date_from: input.date_from,
			resultCount: response.keywords.length,
		},
		'completed',
	);

	return response;
};
