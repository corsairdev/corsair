import type { BunnycdnContext } from '../index';
import { api } from './helpers';
import type {
	ApiKeysListInput,
	BunnycdnEndpointOutputs,
	EdgeScriptsListInput,
	GlobalSearchInput,
	OembedInput,
	StatisticsInput,
	UserAuditLogInput,
	VideoLibrariesListInput,
} from './types';

// Docs: https://bunny.net/docs/api-reference/core/billing/get-billing-summary
export async function billingSummary(
	ctx: BunnycdnContext,
): Promise<BunnycdnEndpointOutputs['billingSummary']> {
	return api(ctx, 'core', 'GET', '/billing/summary');
}

export async function statistics(
	ctx: BunnycdnContext,
	input: StatisticsInput = {},
): Promise<BunnycdnEndpointOutputs['statistics']> {
	const { dateFrom, dateTo, pullZone, serverZoneId, hourly, ...rest } = input;
	return api(ctx, 'core', 'GET', '/statistics', {
		query: {
			dateFrom,
			dateTo,
			pullZone,
			serverZoneId,
			hourly,
			...rest,
		},
	});
}

export async function countries(
	ctx: BunnycdnContext,
): Promise<BunnycdnEndpointOutputs['countryList']> {
	return api(ctx, 'core', 'GET', '/country');
}

export async function regions(
	ctx: BunnycdnContext,
): Promise<BunnycdnEndpointOutputs['regionList']> {
	return api(ctx, 'core', 'GET', '/region');
}

export async function globalSearch(
	ctx: BunnycdnContext,
	input: GlobalSearchInput = {},
): Promise<BunnycdnEndpointOutputs['globalSearch']> {
	return api(ctx, 'core', 'GET', '/search', {
		query: {
			search: input.search,
			from: input.from,
			size: input.size,
		},
	});
}

export async function apiKeysList(
	ctx: BunnycdnContext,
	input: ApiKeysListInput = {},
): Promise<BunnycdnEndpointOutputs['apiKeysList']> {
	return api(ctx, 'core', 'GET', '/apikey', {
		query: { page: input.page, perPage: input.perPage },
	});
}

export async function userAuditLog(
	ctx: BunnycdnContext,
	input: UserAuditLogInput,
): Promise<BunnycdnEndpointOutputs['userAuditLog']> {
	const date = encodeURIComponent(input.date);
	return api(ctx, 'core', 'GET', `/user/audit/${date}`, {
		query: {
			Product: input.product,
			ResourceType: input.resourceType,
			ResourceId: input.resourceId,
			ActorId: input.actorId,
			Order: input.order,
			ContinuationToken: input.continuationToken,
			Limit: input.limit,
		},
	});
}

export async function videoLibrariesList(
	ctx: BunnycdnContext,
	input: VideoLibrariesListInput = {},
): Promise<BunnycdnEndpointOutputs['videoLibrariesList']> {
	return api(ctx, 'core', 'GET', '/videolibrary', {
		query: {
			page: input.page,
			perPage: input.perPage,
			search: input.search,
		},
	});
}

export async function languages(
	ctx: BunnycdnContext,
): Promise<BunnycdnEndpointOutputs['languages']> {
	return api(ctx, 'core', 'GET', '/videolibrary/languages');
}

export async function edgeScriptsList(
	ctx: BunnycdnContext,
	input: EdgeScriptsListInput = {},
): Promise<BunnycdnEndpointOutputs['edgeScriptsList']> {
	return api(ctx, 'compute', 'GET', '/script', {
		query: {
			page: input.page,
			perPage: input.perPage,
			search: input.search,
			includeLinkedPullzones: input.includeLinkedPullzones,
			integrationId: input.integrationId,
		},
	});
}

// Docs: Stream API, base https://video.bunnycdn.com
export async function oembed(
	ctx: BunnycdnContext,
	input: OembedInput,
): Promise<BunnycdnEndpointOutputs['oembed']> {
	return api(ctx, 'stream', 'GET', '/OEmbed', {
		query: {
			url: input.url,
			maxWidth: input.maxWidth,
			maxHeight: input.maxHeight,
			token: input.token,
			expires: input.expires,
		},
	});
}
