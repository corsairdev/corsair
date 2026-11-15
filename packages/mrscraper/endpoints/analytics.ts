import { logEventFromContext } from 'corsair/core';
import type { MrscraperEndpoints } from '..';
import { makeMrscraperRequest } from '../client';
import type { MrscraperEndpointOutputs } from './types';
import {
	MrscraperEndpointInputSchemas,
	MrscraperEndpointOutputSchemas,
} from './types';

export const statuses: MrscraperEndpoints['analyticsStatuses'] = async (
	ctx,
	input,
) => {
	const parsed = MrscraperEndpointInputSchemas.analyticsStatuses.parse(input);

	const response = await makeMrscraperRequest<
		MrscraperEndpointOutputs['analyticsStatuses']
	>('/analytic/statuses', ctx.key, { method: 'GET', query: parsed });

	const parsedResponse =
		MrscraperEndpointOutputSchemas.analyticsStatuses.parse(response);

	await logEventFromContext(
		ctx,
		'mrscraper.analytics.statuses',
		{ domain: parsed.domain },
		'completed',
	);

	return parsedResponse;
};

export const proxyBandwidth: MrscraperEndpoints['analyticsProxyBandwidth'] =
	async (ctx, input) => {
		const parsed =
			MrscraperEndpointInputSchemas.analyticsProxyBandwidth.parse(input);

		const response = await makeMrscraperRequest<
			MrscraperEndpointOutputs['analyticsProxyBandwidth']
		>('/proxies/user/requests-bandwidth', ctx.key, {
			method: 'GET',
			query: parsed,
		});

		const parsedResponse =
			MrscraperEndpointOutputSchemas.analyticsProxyBandwidth.parse(response);

		await logEventFromContext(
			ctx,
			'mrscraper.analytics.proxyBandwidth',
			{},
			'completed',
		);

		return parsedResponse;
	};
