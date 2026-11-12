import type { CustomjsEndpoints } from '..';
import { call } from './call';
import {
	CustomjsEndpointInputSchemas as Inputs,
	CustomjsEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The key is the path parameter, so the response also echoes it back. The
 * output schema drops `apiKey`, `apiKeyData` and `jwt`, because this operation is
 * a read and must not hand a credential to a read-only caller.
 */
export const check: CustomjsEndpoints['authCheck'] = (ctx, input) =>
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
