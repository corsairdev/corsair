import type { CustomjsEndpoints } from '..';
import { CustomjsAPIError } from '../client';
import { call } from './call';
import {
	CustomjsEndpointInputSchemas as Inputs,
	CustomjsEndpointOutputSchemas as Outputs,
} from './types';

/** The key lookup itself; `check` adds the 404 mapping. */
const lookup: CustomjsEndpoints['authCheck'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'auth.check',
			input: Inputs.authCheck,
			output: Outputs.authCheck,
			reader: 'pages',
			replayable: true,
		},
		input,
		() => ({
			method: 'GET',
			path: `/core/api-key/${encodeURIComponent(ctx.key)}`,
		}),
		{
			log: (_, result) => ({
				workspaceId: result.workspaceId,
				maxRequestCount: result.maxRequestCount ?? undefined,
				inActive: result.inActive ?? undefined,
			}),
		},
	);

/**
 * The key is the path parameter, so the response also echoes it back. The
 * output schema drops `apiKey`, `apiKeyData` and `jwt`, because this operation is
 * a read and must not hand a credential to a read-only caller.
 *
 * An unknown key answers 404 with `{}` (checked against the live API on 11-14),
 * so a 404 here is reported as an auth failure rather than a missing route.
 */
export const check: CustomjsEndpoints['authCheck'] = (ctx, input) =>
	// unknown: a rejection carries no static type
	lookup(ctx, input).catch((error: unknown) => {
		if (error instanceof CustomjsAPIError && error.status === 404) {
			throw new CustomjsAPIError('CustomJS 404: the API key is not valid', {
				method: error.method,
				replayable: error.replayable,
				status: 404,
				authFailure: true,
				cause: error,
			});
		}
		throw error;
	});
