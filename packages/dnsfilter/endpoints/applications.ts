// DNSFilter applications and application categories endpoints.
// One file per resource family; each endpoint keeps its own group name.
import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List applications - GET /v1/applications
export const applicationsList: DnsfilterEndpoints['applicationsList'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.applicationsList.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['applicationsList']
	>('/v1/applications', ctx.key, {
		method: 'GET',
		query: {
			category_ids: values.category_ids,
			page: values.page,
		},
	});
	const result =
		DnsfilterEndpointOutputSchemas.applicationsList.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.applications.list',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// List all applications - GET /v1/applications/all
export const applicationsListAll: DnsfilterEndpoints['applicationsListAll'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.applicationsListAll.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['applicationsListAll']
		>('/v1/applications/all', ctx.key, {
			method: 'GET',
			query: {
				category_ids: values.category_ids,
				page: values.page,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.applicationsListAll.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.applications.listAll',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get an application - GET /v1/applications/{id}
export const applicationsGet: DnsfilterEndpoints['applicationsGet'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.applicationsGet.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['applicationsGet']
	>('/v1/applications/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: values.id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.applicationsGet.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.applications.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};

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
