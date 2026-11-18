import type { AhrefsEndpoints } from '../index';
import { callAhrefs } from './request';

export const aiResponses: AhrefsEndpoints['brandRadarAiResponses'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'brandRadarAiResponses',
			method: 'GET',
			path: '/brand-radar/ai-responses',
			event: 'ahrefs.brandRadar.aiResponses',
			logKeys: ['report_id', 'country', 'date', 'data_source'],
		},
		input,
	);

export const aiResponsesEntities: AhrefsEndpoints['brandRadarAiResponsesEntities'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'brandRadarAiResponsesEntities',
				method: 'POST',
				path: '/brand-radar/ai-responses',
				event: 'ahrefs.brandRadar.aiResponsesEntities',
				bodyKeys: [
					'select',
					'where',
					'report_id',
					'brands',
					'competitors',
					'content_filter',
					'data_source',
					'country',
					'prompts',
					'limit',
					'date',
					'date_compared',
					'order_by',
					'tags_filter',
					'brand_filter',
					'volume_range',
					'changes',
					'sentiment_filter',
					'opinions_first',
					'output',
				],
				logKeys: ['report_id', 'country', 'date', 'data_source'],
			},
			input,
		);

export const citationsHistoryEntities: AhrefsEndpoints['brandRadarCitationsHistoryEntities'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'brandRadarCitationsHistoryEntities',
				method: 'POST',
				path: '/brand-radar/citations-history',
				event: 'ahrefs.brandRadar.citationsHistoryEntities',
				bodyKeys: [
					'where',
					'report_id',
					'brands',
					'content_filter',
					'data_source',
					'country',
					'prompts',
					'date_from',
					'date_to',
					'tags_filter',
					'output',
				],
				logKeys: [
					'report_id',
					'country',
					'date_from',
					'date_to',
					'data_source',
				],
			},
			input,
		);

export const citationsOverviewEntities: AhrefsEndpoints['brandRadarCitationsOverviewEntities'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'brandRadarCitationsOverviewEntities',
				method: 'POST',
				path: '/brand-radar/citations-overview',
				event: 'ahrefs.brandRadar.citationsOverviewEntities',
				bodyKeys: [
					'select',
					'where',
					'report_id',
					'brands',
					'competitors',
					'content_filter',
					'data_source',
					'country',
					'prompts',
					'tags_filter',
					'output',
				],
				logKeys: ['report_id', 'country', 'data_source'],
			},
			input,
		);

export const citedDomains: AhrefsEndpoints['brandRadarCitedDomains'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'brandRadarCitedDomains',
			method: 'GET',
			path: '/brand-radar/cited-domains',
			event: 'ahrefs.brandRadar.citedDomains',
			logKeys: ['report_id', 'country', 'date', 'data_source'],
		},
		input,
	);

export const citedDomainsEntities: AhrefsEndpoints['brandRadarCitedDomainsEntities'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'brandRadarCitedDomainsEntities',
				method: 'POST',
				path: '/brand-radar/cited-domains',
				event: 'ahrefs.brandRadar.citedDomainsEntities',
				bodyKeys: [
					'select',
					'where',
					'report_id',
					'brands',
					'competitors',
					'content_filter',
					'data_source',
					'country',
					'prompts',
					'limit',
					'date',
					'tags_filter',
					'brand_filter',
					'volume_range',
					'output',
				],
				logKeys: ['report_id', 'country', 'date', 'data_source'],
			},
			input,
		);

export const citedPages: AhrefsEndpoints['brandRadarCitedPages'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'brandRadarCitedPages',
			method: 'GET',
			path: '/brand-radar/cited-pages',
			event: 'ahrefs.brandRadar.citedPages',
			logKeys: ['report_id', 'country', 'date', 'data_source'],
		},
		input,
	);

export const citedPagesEntities: AhrefsEndpoints['brandRadarCitedPagesEntities'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'brandRadarCitedPagesEntities',
				method: 'POST',
				path: '/brand-radar/cited-pages',
				event: 'ahrefs.brandRadar.citedPagesEntities',
				bodyKeys: [
					'select',
					'where',
					'report_id',
					'brands',
					'competitors',
					'content_filter',
					'data_source',
					'country',
					'prompts',
					'limit',
					'date',
					'tracked_urls',
					'tags_filter',
					'brand_filter',
					'volume_range',
					'output',
				],
				logKeys: ['report_id', 'country', 'date', 'data_source'],
			},
			input,
		);

export const impressionsHistory: AhrefsEndpoints['brandRadarImpressionsHistory'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'brandRadarImpressionsHistory',
				method: 'GET',
				path: '/brand-radar/impressions-history',
				event: 'ahrefs.brandRadar.impressionsHistory',
				logKeys: [
					'report_id',
					'country',
					'date_from',
					'date_to',
					'data_source',
				],
			},
			input,
		);

export const impressionsHistoryEntities: AhrefsEndpoints['brandRadarImpressionsHistoryEntities'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'brandRadarImpressionsHistoryEntities',
				method: 'POST',
				path: '/brand-radar/impressions-history',
				event: 'ahrefs.brandRadar.impressionsHistoryEntities',
				bodyKeys: [
					'where',
					'report_id',
					'brands',
					'content_filter',
					'data_source',
					'country',
					'prompts',
					'date_from',
					'date_to',
					'tags_filter',
					'output',
				],
				logKeys: [
					'report_id',
					'country',
					'date_from',
					'date_to',
					'data_source',
				],
			},
			input,
		);

export const impressionsOverview: AhrefsEndpoints['brandRadarImpressionsOverview'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'brandRadarImpressionsOverview',
				method: 'GET',
				path: '/brand-radar/impressions-overview',
				event: 'ahrefs.brandRadar.impressionsOverview',
				logKeys: ['report_id', 'country', 'data_source'],
			},
			input,
		);

export const impressionsOverviewEntities: AhrefsEndpoints['brandRadarImpressionsOverviewEntities'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'brandRadarImpressionsOverviewEntities',
				method: 'POST',
				path: '/brand-radar/impressions-overview',
				event: 'ahrefs.brandRadar.impressionsOverviewEntities',
				bodyKeys: [
					'select',
					'where',
					'report_id',
					'brands',
					'competitors',
					'content_filter',
					'data_source',
					'country',
					'prompts',
					'tags_filter',
					'output',
				],
				logKeys: ['report_id', 'country', 'data_source'],
			},
			input,
		);

export const mentionsHistory: AhrefsEndpoints['brandRadarMentionsHistory'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'brandRadarMentionsHistory',
			method: 'GET',
			path: '/brand-radar/mentions-history',
			event: 'ahrefs.brandRadar.mentionsHistory',
			logKeys: ['report_id', 'country', 'date_from', 'date_to', 'data_source'],
		},
		input,
	);

export const mentionsHistoryEntities: AhrefsEndpoints['brandRadarMentionsHistoryEntities'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'brandRadarMentionsHistoryEntities',
				method: 'POST',
				path: '/brand-radar/mentions-history',
				event: 'ahrefs.brandRadar.mentionsHistoryEntities',
				bodyKeys: [
					'where',
					'report_id',
					'brands',
					'content_filter',
					'data_source',
					'country',
					'prompts',
					'date_from',
					'date_to',
					'tags_filter',
					'output',
				],
				logKeys: [
					'report_id',
					'country',
					'date_from',
					'date_to',
					'data_source',
				],
			},
			input,
		);

export const mentionsOverview: AhrefsEndpoints['brandRadarMentionsOverview'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'brandRadarMentionsOverview',
			method: 'GET',
			path: '/brand-radar/mentions-overview',
			event: 'ahrefs.brandRadar.mentionsOverview',
			logKeys: ['report_id', 'country', 'data_source'],
		},
		input,
	);

export const mentionsOverviewEntities: AhrefsEndpoints['brandRadarMentionsOverviewEntities'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'brandRadarMentionsOverviewEntities',
				method: 'POST',
				path: '/brand-radar/mentions-overview',
				event: 'ahrefs.brandRadar.mentionsOverviewEntities',
				bodyKeys: [
					'select',
					'where',
					'report_id',
					'brands',
					'competitors',
					'content_filter',
					'data_source',
					'country',
					'prompts',
					'tags_filter',
					'output',
				],
				logKeys: ['report_id', 'country', 'data_source'],
			},
			input,
		);

export const sovHistory: AhrefsEndpoints['brandRadarSovHistory'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'brandRadarSovHistory',
			method: 'GET',
			path: '/brand-radar/sov-history',
			event: 'ahrefs.brandRadar.sovHistory',
			logKeys: ['report_id', 'country', 'date_from', 'date_to', 'data_source'],
		},
		input,
	);

export const sovHistoryEntities: AhrefsEndpoints['brandRadarSovHistoryEntities'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'brandRadarSovHistoryEntities',
				method: 'POST',
				path: '/brand-radar/sov-history',
				event: 'ahrefs.brandRadar.sovHistoryEntities',
				bodyKeys: [
					'where',
					'report_id',
					'brands',
					'competitors',
					'content_filter',
					'data_source',
					'country',
					'prompts',
					'date_from',
					'date_to',
					'tags_filter',
					'output',
				],
				logKeys: [
					'report_id',
					'country',
					'date_from',
					'date_to',
					'data_source',
				],
			},
			input,
		);

export const sovOverview: AhrefsEndpoints['brandRadarSovOverview'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'brandRadarSovOverview',
			method: 'GET',
			path: '/brand-radar/sov-overview',
			event: 'ahrefs.brandRadar.sovOverview',
			logKeys: ['report_id', 'country', 'data_source'],
		},
		input,
	);

export const sovOverviewEntities: AhrefsEndpoints['brandRadarSovOverviewEntities'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'brandRadarSovOverviewEntities',
				method: 'POST',
				path: '/brand-radar/sov-overview',
				event: 'ahrefs.brandRadar.sovOverviewEntities',
				bodyKeys: [
					'where',
					'report_id',
					'brands',
					'competitors',
					'content_filter',
					'data_source',
					'country',
					'prompts',
					'tags_filter',
					'output',
				],
				logKeys: ['report_id', 'country', 'data_source'],
			},
			input,
		);
