import { makeDeeplineRequest } from '../client';
import { defineEndpoint } from './common';
import {
	GetConnectLinkInputSchema,
	GetConnectLinkOutputSchema,
	GetIntegrationBalanceInputSchema,
	GetIntegrationBalanceOutputSchema,
	SetCredentialsInputSchema,
	SetCredentialsOutputSchema,
	StartOAuthInputSchema,
	StartOAuthOutputSchema,
} from './types-integrations';
// The workspace connection-management routes (/api/v2/integrations/connections)
// are an internal Deepline pilot and return 404 for other workspaces, so they
// are not exposed here.

/** Dashboard link where a workspace owner or admin connects a provider. */
export const connectLink = defineEndpoint({
	event: 'deepline.integrations.connectLink',
	input: GetConnectLinkInputSchema,
	output: GetConnectLinkOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/integrations/connect`, ctx.key, {
			method: 'GET',
			query: { provider: input.provider },
		}),
});
/** Saves provider credential fields. The values are never returned or logged. */
export const setCredentials = defineEndpoint({
	event: 'deepline.integrations.setCredentials',
	input: SetCredentialsInputSchema,
	output: SetCredentialsOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/integrations/connect`, ctx.key, {
			method: 'POST',
			body: {
				provider: input.provider,
				credentials: input.credentials,
				...(input.expectedConnectionId
					? { expected_connection_id: input.expectedConnectionId }
					: {}),
			},
		}),
});
/** Starts provider OAuth and returns the URL a person opens to consent. */
export const startOAuth = defineEndpoint({
	event: 'deepline.integrations.startOAuth',
	input: StartOAuthInputSchema,
	output: StartOAuthOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/integrations/connect`, ctx.key, {
			method: 'POST',
			body: {
				provider: input.provider,
				...(input.preset !== undefined ? { preset: input.preset } : {}),
				...(input.scopes !== undefined ? { scopes: input.scopes } : {}),
				...(input.optionalScopes !== undefined
					? { optional_scopes: input.optionalScopes }
					: {}),
			},
		}),
});
/** Fresh balance of the workspace's own provider credential (LeadMagic today). */
export const balance = defineEndpoint({
	event: 'deepline.integrations.balance',
	input: GetIntegrationBalanceInputSchema,
	output: GetIntegrationBalanceOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/integrations/balance`, ctx.key, {
			method: 'GET',
			query: { provider: input.provider },
		}),
});
