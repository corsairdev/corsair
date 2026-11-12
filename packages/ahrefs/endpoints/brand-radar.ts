import type { AhrefsEndpoints } from '../index';
import { callAhrefs } from './request';
import type {
	BrandRadarAiResponsesEntitiesResponse,
	BrandRadarAiResponsesResponse,
	BrandRadarCitationsHistoryEntitiesResponse,
	BrandRadarCitationsOverviewEntitiesResponse,
	BrandRadarCitedDomainsEntitiesResponse,
	BrandRadarCitedDomainsResponse,
	BrandRadarCitedPagesEntitiesResponse,
	BrandRadarCitedPagesResponse,
	BrandRadarImpressionsHistoryEntitiesResponse,
	BrandRadarImpressionsHistoryResponse,
	BrandRadarImpressionsOverviewEntitiesResponse,
	BrandRadarImpressionsOverviewResponse,
	BrandRadarMentionsHistoryEntitiesResponse,
	BrandRadarMentionsHistoryResponse,
	BrandRadarMentionsOverviewEntitiesResponse,
	BrandRadarMentionsOverviewResponse,
	BrandRadarSovHistoryEntitiesResponse,
	BrandRadarSovHistoryResponse,
	BrandRadarSovOverviewEntitiesResponse,
	BrandRadarSovOverviewResponse,
} from './types';

export const aiResponses: AhrefsEndpoints['brandRadarAiResponses'] = (
	ctx,
	input,
) =>
	callAhrefs<BrandRadarAiResponsesResponse>(
		ctx,
		{
			method: 'GET',
			path: '/brand-radar/ai-responses',
			event: 'ahrefs.brandRadar.aiResponses',
			logKeys: ['report_id', 'country', 'date', 'data_source'],
		},
		input,
	);

export const aiResponsesEntities: AhrefsEndpoints['brandRadarAiResponsesEntities'] =
	(ctx, input) =>
		callAhrefs<BrandRadarAiResponsesEntitiesResponse>(
			ctx,
			{
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
		callAhrefs<BrandRadarCitationsHistoryEntitiesResponse>(
			ctx,
			{
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
		callAhrefs<BrandRadarCitationsOverviewEntitiesResponse>(
			ctx,
			{
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
	callAhrefs<BrandRadarCitedDomainsResponse>(
		ctx,
		{
			method: 'GET',
			path: '/brand-radar/cited-domains',
			event: 'ahrefs.brandRadar.citedDomains',
			logKeys: ['report_id', 'country', 'date', 'data_source'],
		},
		input,
	);

export const citedDomainsEntities: AhrefsEndpoints['brandRadarCitedDomainsEntities'] =
	(ctx, input) =>
		callAhrefs<BrandRadarCitedDomainsEntitiesResponse>(
			ctx,
			{
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
	callAhrefs<BrandRadarCitedPagesResponse>(
		ctx,
		{
			method: 'GET',
			path: '/brand-radar/cited-pages',
			event: 'ahrefs.brandRadar.citedPages',
			logKeys: ['report_id', 'country', 'date', 'data_source'],
		},
		input,
	);

export const citedPagesEntities: AhrefsEndpoints['brandRadarCitedPagesEntities'] =
	(ctx, input) =>
		callAhrefs<BrandRadarCitedPagesEntitiesResponse>(
			ctx,
			{
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
		callAhrefs<BrandRadarImpressionsHistoryResponse>(
			ctx,
			{
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
		callAhrefs<BrandRadarImpressionsHistoryEntitiesResponse>(
			ctx,
			{
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
		callAhrefs<BrandRadarImpressionsOverviewResponse>(
			ctx,
			{
				method: 'GET',
				path: '/brand-radar/impressions-overview',
				event: 'ahrefs.brandRadar.impressionsOverview',
				logKeys: ['report_id', 'country', 'data_source'],
			},
			input,
		);

export const impressionsOverviewEntities: AhrefsEndpoints['brandRadarImpressionsOverviewEntities'] =
	(ctx, input) =>
		callAhrefs<BrandRadarImpressionsOverviewEntitiesResponse>(
			ctx,
			{
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
	callAhrefs<BrandRadarMentionsHistoryResponse>(
		ctx,
		{
			method: 'GET',
			path: '/brand-radar/mentions-history',
			event: 'ahrefs.brandRadar.mentionsHistory',
			logKeys: ['report_id', 'country', 'date_from', 'date_to', 'data_source'],
		},
		input,
	);

export const mentionsHistoryEntities: AhrefsEndpoints['brandRadarMentionsHistoryEntities'] =
	(ctx, input) =>
		callAhrefs<BrandRadarMentionsHistoryEntitiesResponse>(
			ctx,
			{
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
	callAhrefs<BrandRadarMentionsOverviewResponse>(
		ctx,
		{
			method: 'GET',
			path: '/brand-radar/mentions-overview',
			event: 'ahrefs.brandRadar.mentionsOverview',
			logKeys: ['report_id', 'country', 'data_source'],
		},
		input,
	);

export const mentionsOverviewEntities: AhrefsEndpoints['brandRadarMentionsOverviewEntities'] =
	(ctx, input) =>
		callAhrefs<BrandRadarMentionsOverviewEntitiesResponse>(
			ctx,
			{
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
	callAhrefs<BrandRadarSovHistoryResponse>(
		ctx,
		{
			method: 'GET',
			path: '/brand-radar/sov-history',
			event: 'ahrefs.brandRadar.sovHistory',
			logKeys: ['report_id', 'country', 'date_from', 'date_to', 'data_source'],
		},
		input,
	);

export const sovHistoryEntities: AhrefsEndpoints['brandRadarSovHistoryEntities'] =
	(ctx, input) =>
		callAhrefs<BrandRadarSovHistoryEntitiesResponse>(
			ctx,
			{
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
	callAhrefs<BrandRadarSovOverviewResponse>(
		ctx,
		{
			method: 'GET',
			path: '/brand-radar/sov-overview',
			event: 'ahrefs.brandRadar.sovOverview',
			logKeys: ['report_id', 'country', 'data_source'],
		},
		input,
	);

export const sovOverviewEntities: AhrefsEndpoints['brandRadarSovOverviewEntities'] =
	(ctx, input) =>
		callAhrefs<BrandRadarSovOverviewEntitiesResponse>(
			ctx,
			{
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
