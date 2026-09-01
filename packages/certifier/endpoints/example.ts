import { logEventFromContext } from 'corsair/core';
import type { CertifierEndpoints } from '..';
import type { CertifierEndpointOutputs } from './types';
import { makeCertifierRequest } from '../client';

export const get: CertifierEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeCertifierRequest<CertifierEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'certifier.example.get', { ...input }, 'completed');
	return response;
};
