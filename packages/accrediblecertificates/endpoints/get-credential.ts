import { logEventFromContext } from 'corsair/core';
import type { AccredibleCertificatesEndpoints } from '..';
import { makeAccredibleCertificatesRequest } from '../client';
import type { AccredibleCertificatesEndpointOutputs } from './types';

export const getCredential: AccredibleCertificatesEndpoints['getCredential'] =
	async (ctx, input) => {
		const response = await makeAccredibleCertificatesRequest<
			AccredibleCertificatesEndpointOutputs['getCredential']
		>(`credentials/${input.id}`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'accrediblecertificates.credentials.get',
			{ ...input },
			'completed',
		);

		return response;
	};
