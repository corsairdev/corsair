import type { ParadymEndpoints } from '..';
import { call } from './call';
import {
	ParadymEndpointInputSchemas as Inputs,
	ParadymEndpointOutputSchemas as Outputs,
} from './types';

export const batch: ParadymEndpoints['revocationBatch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'revocation.batch',
			input: Inputs.revocationBatch,
			output: Outputs.revocationBatch,
		},
		input,
		(body, walletId) => ({
			method: 'POST',
			path: `/v1/wallets/${encodeURIComponent(walletId)}/revocation/batch`,
			body,
		}),
		{ log: (_, result) => ({ count: result.revokedCredentials.length }) },
	);
