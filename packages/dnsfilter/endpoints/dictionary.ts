import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// QP methods for dictionary - GET /v1/dictionary/qp_methods
export const dictionaryQpMethods: DnsfilterEndpoints['dictionaryQpMethods'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.dictionaryQpMethods.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['dictionaryQpMethods']
		>('/v1/dictionary/qp_methods', ctx.key, {
			method: 'GET',
		});
		const result =
			DnsfilterEndpointOutputSchemas.dictionaryQpMethods.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.dictionary.qpMethods',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
