import type { PointagramEndpoints } from '..';
import { call } from './call';
import {
	PointagramEndpointInputSchemas as Inputs,
	PointagramEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Answers `{ status: "Ok", data: { organization } }` for a working key and a
 * 404 `Invalid credentials` envelope for a wrong one. It is the only call that
 * confirms the pair without touching tenant data, so it is also what the live
 * suite runs first.
 */
export const credentials: PointagramEndpoints['testCredentials'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'test.credentials',
			input: Inputs.testCredentials,
			output: Outputs.testCredentials,
		},
		input,
		() => ({ method: 'POST', path: '/test' }),
		{
			log: (_, result) => ({ organization: result.organization ?? undefined }),
		},
	);
