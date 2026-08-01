import { logEventFromContext } from 'corsair/core';
import type { DatabricksEndpoints } from '..';
import { makeDatabricksRequest } from '../client';
import { safeEncode } from '../utils';

export const batchGetMarketplaceConsumerListings: DatabricksEndpoints['batchGetMarketplaceConsumerListings'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{
			listings?: Array<Record<string, unknown>>;
		}>('marketplace/consumer/listings/batch-get', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.marketplace.batch_get_consumer_listings',
			input,
			'completed',
		);
		return { listings: response.listings ?? [] };
	};

export const batchGetMarketplaceConsumerProviders: DatabricksEndpoints['batchGetMarketplaceConsumerProviders'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{
			providers?: Array<Record<string, unknown>>;
		}>('marketplace/consumer/providers/batch-get', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'databricks.marketplace.batch_get_consumer_providers',
			input,
			'completed',
		);
		return { providers: response.providers ?? [] };
	};

export const createMarketplaceConsumerInstallation: DatabricksEndpoints['createMarketplaceConsumerInstallation'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ id: string }>(
			'marketplace/consumer/installations',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.marketplace.create_consumer_installation',
			input,
			'completed',
		);
		return response;
	};

export const createMarketplaceProviderListing: DatabricksEndpoints['createMarketplaceProviderListing'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ id: string }>(
			'marketplace/provider/listings',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.marketplace.create_provider_listing',
			input,
			'completed',
		);
		return response;
	};

export const createProviderAnalyticsDashboard: DatabricksEndpoints['createProviderAnalyticsDashboard'] =
	async (ctx, input) => {
		const response = await makeDatabricksRequest<{ dashboard_id?: string }>(
			'marketplace/provider/analytics-dashboards',
			ctx,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'databricks.marketplace.create_provider_analytics_dashboard',
			input,
			'completed',
		);
		return response;
	};

export const deleteListingFromExchange: DatabricksEndpoints['deleteListingFromExchange'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`marketplace/provider/exchanges/${safeEncode(input.exchange_id)}/listings/${safeEncode(input.listing_id)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.marketplace.delete_listing_from_exchange',
			input,
			'completed',
		);
		return { success: true };
	};

export const deleteMarketplaceConsumerInstallation: DatabricksEndpoints['deleteMarketplaceConsumerInstallation'] =
	async (ctx, input) => {
		await makeDatabricksRequest<void>(
			`marketplace/consumer/installations/${safeEncode(input.id)}`,
			ctx,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'databricks.marketplace.delete_consumer_installation',
			input,
			'completed',
		);
		return { success: true };
	};
