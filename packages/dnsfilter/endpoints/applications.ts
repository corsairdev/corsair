import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// List applications - GET /v1/applications
export const applicationsList: DnsfilterEndpoints['applicationsList'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['applicationsList']
	>('/v1/applications', ctx.key, {
		method: 'GET',
		query: {
			category_ids: input.category_ids,
			page: input.page,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.applications.list',
		input ?? {},
		'completed',
	);
	return response;
};

// List all applications - GET /v1/applications/all
export const applicationsListAll: DnsfilterEndpoints['applicationsListAll'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['applicationsListAll']
		>('/v1/applications/all', ctx.key, {
			method: 'GET',
			query: {
				category_ids: input.category_ids,
				page: input.page,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.applications.listAll',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get an application - GET /v1/applications/{id}
export const applicationsGet: DnsfilterEndpoints['applicationsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['applicationsGet']
	>('/v1/applications/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: input.id,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.applications.get',
		input ?? {},
		'completed',
	);
	return response;
};
