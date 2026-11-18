import { asRecord } from 'corsair/core';
import type { DataboxEndpoints } from '..';
import { call } from './call';
import {
	DataboxEndpointInputSchemas as Inputs,
	DataboxEndpointOutputSchemas as Outputs,
} from './types';

export const validateKey: DataboxEndpoints['authValidateKey'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'auth.validateKey',
			input: Inputs.validateKey,
			output: Outputs.validateKey,
		},
		input,
		() => ({
			method: 'GET',
			path: '/v2/auth/validate-key',
			replaySafe: true,
		}),
		{
			// A 200 whose body does not say success must fail, not read as valid.
			shape: (raw) => ({ valid: asRecord(raw)?.status === 'success' }),
		},
	);
