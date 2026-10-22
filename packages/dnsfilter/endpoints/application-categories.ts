import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// List application categories - GET /v1/application_categories
export const applicationCategoriesList: DnsfilterEndpoints['applicationCategoriesList'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['applicationCategoriesList']
		>('/v1/application_categories', ctx.key, {
			method: 'GET',
			query: {
				page: input.page,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.applicationCategories.list',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get an application category - GET /v1/application_categories/{id}
export const applicationCategoriesGet: DnsfilterEndpoints['applicationCategoriesGet'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['applicationCategoriesGet']
		>('/v1/application_categories/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.applicationCategories.get',
			input ?? {},
			'completed',
		);
		return response;
	};
