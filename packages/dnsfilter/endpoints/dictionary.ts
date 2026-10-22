import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// QP methods for dictionary - GET /v1/dictionary/qp_methods
export const dictionaryQpMethods: DnsfilterEndpoints['dictionaryQpMethods'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['dictionaryQpMethods']
		>('/v1/dictionary/qp_methods', ctx.key, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.dictionary.qpMethods',
			input ?? {},
			'completed',
		);
		return response;
	};
