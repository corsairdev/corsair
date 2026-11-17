import { makeDeeplineRequest } from '../client';
import { defineEndpoint } from './common';
import {
	AuthStatusInputSchema,
	AuthStatusOutputSchema,
} from './types-integrations';

/**
 * Who the API key belongs to: key id, user, workspace and rate-limit tier.
 * The SDK posts the key in the body too; the server reads the Bearer header,
 * so the body stays empty and the key travels only in Authorization.
 */
export const status = defineEndpoint({
	event: 'deepline.auth.status',
	input: AuthStatusInputSchema,
	output: AuthStatusOutputSchema,
	run: (ctx) =>
		makeDeeplineRequest(`/api/v2/auth/cli/status`, ctx.key, {
			method: 'POST',
			body: {},
		}),
});
