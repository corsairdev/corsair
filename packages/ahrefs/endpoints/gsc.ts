import type { AhrefsEndpoints } from '../index';
import { callAhrefs } from './request';

export const keywords: AhrefsEndpoints['gscKeywords'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'gscKeywords',
			method: 'GET',
			path: '/gsc/keywords',
			event: 'ahrefs.gsc.keywords',
			logKeys: [
				'project_id',
				'portfolio_id',
				'country',
				'date_from',
				'date_to',
				'keyword_list_id',
			],
		},
		input,
	);

export const pages: AhrefsEndpoints['gscPages'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'gscPages',
			method: 'GET',
			path: '/gsc/pages',
			event: 'ahrefs.gsc.pages',
			logKeys: [
				'project_id',
				'portfolio_id',
				'country',
				'date_from',
				'date_to',
			],
		},
		input,
	);

export const performanceHistory: AhrefsEndpoints['gscPerformanceHistory'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'gscPerformanceHistory',
			method: 'GET',
			path: '/gsc/performance-history',
			event: 'ahrefs.gsc.performanceHistory',
			logKeys: [
				'project_id',
				'portfolio_id',
				'country',
				'date_from',
				'date_to',
			],
		},
		input,
	);

export const keywordHistory: AhrefsEndpoints['gscKeywordHistory'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'gscKeywordHistory',
			method: 'GET',
			path: '/gsc/keyword-history',
			event: 'ahrefs.gsc.keywordHistory',
			logKeys: [
				'project_id',
				'portfolio_id',
				'keywords',
				'country',
				'date_from',
				'date_to',
			],
		},
		input,
	);

export const pageHistory: AhrefsEndpoints['gscPageHistory'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'gscPageHistory',
			method: 'GET',
			path: '/gsc/page-history',
			event: 'ahrefs.gsc.pageHistory',
			logKeys: [
				'project_id',
				'portfolio_id',
				'country',
				'date_from',
				'date_to',
			],
		},
		input,
	);

export const pagesHistory: AhrefsEndpoints['gscPagesHistory'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'gscPagesHistory',
			method: 'GET',
			path: '/gsc/pages-history',
			event: 'ahrefs.gsc.pagesHistory',
			logKeys: [
				'project_id',
				'portfolio_id',
				'country',
				'date_from',
				'date_to',
			],
		},
		input,
	);

export const positionsHistory: AhrefsEndpoints['gscPositionsHistory'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'gscPositionsHistory',
			method: 'GET',
			path: '/gsc/positions-history',
			event: 'ahrefs.gsc.positionsHistory',
			logKeys: [
				'project_id',
				'portfolio_id',
				'country',
				'date_from',
				'date_to',
			],
		},
		input,
	);

export const ctrByPosition: AhrefsEndpoints['gscCtrByPosition'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'gscCtrByPosition',
			method: 'GET',
			path: '/gsc/ctr-by-position',
			event: 'ahrefs.gsc.ctrByPosition',
			logKeys: [
				'project_id',
				'portfolio_id',
				'country',
				'date_from',
				'date_to',
			],
		},
		input,
	);

export const performanceByDevice: AhrefsEndpoints['gscPerformanceByDevice'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'gscPerformanceByDevice',
			method: 'GET',
			path: '/gsc/performance-by-device',
			event: 'ahrefs.gsc.performanceByDevice',
			logKeys: [
				'project_id',
				'portfolio_id',
				'country',
				'date_from',
				'date_to',
			],
		},
		input,
	);

export const performanceByPosition: AhrefsEndpoints['gscPerformanceByPosition'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'gscPerformanceByPosition',
				method: 'GET',
				path: '/gsc/performance-by-position',
				event: 'ahrefs.gsc.performanceByPosition',
				logKeys: [
					'project_id',
					'portfolio_id',
					'country',
					'date_from',
					'date_to',
				],
			},
			input,
		);

export const metricsByCountry: AhrefsEndpoints['gscMetricsByCountry'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'gscMetricsByCountry',
			method: 'GET',
			path: '/gsc/metrics-by-country',
			event: 'ahrefs.gsc.metricsByCountry',
			logKeys: ['project_id', 'portfolio_id', 'date_from', 'date_to'],
		},
		input,
	);

export const anonymousQueries: AhrefsEndpoints['gscAnonymousQueries'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'gscAnonymousQueries',
			method: 'GET',
			path: '/gsc/anonymous-queries',
			event: 'ahrefs.gsc.anonymousQueries',
			logKeys: ['project_id', 'country', 'date_from'],
		},
		input,
	);
