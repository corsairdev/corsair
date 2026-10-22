import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List application categories - GET /v1/application_categories
export const applicationCategoriesList: DnsfilterEndpoints['applicationCategoriesList'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.applicationCategoriesList.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['applicationCategoriesList']
		>('/v1/application_categories', ctx.key, {
			method: 'GET',
			query: {
				page: values.page,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.applicationCategoriesList.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.applicationCategories.list',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get an application category - GET /v1/application_categories/{id}
export const applicationCategoriesGet: DnsfilterEndpoints['applicationCategoriesGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.applicationCategoriesGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['applicationCategoriesGet']
		>('/v1/application_categories/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.applicationCategoriesGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.applicationCategories.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
