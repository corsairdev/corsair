// Generated from the GMI Cloud OpenAPI spec: https://docs.gmicloud.ai/api-spec/ias-public-api.yaml
import { z } from 'zod';

// Information about the user who owns this API key
export const ApiKeyOwnerInfo = z.object({
	id: z.string().describe('The user ID.'),
});

// Information about the API key.
export const ApiKeyInfo = z.object({
	id: z.string().describe('The unique identifier for the API key.'),
	type: z
		.enum(['ie_model'])
		.optional()
		.describe(
			'The API key type. This field is deprecated and will be removed in a future version.',
		),
	scope: z.enum(['ie_model', 'ce_resource']).describe('The API key scope.'),
	owner: ApiKeyOwnerInfo,
});

// The organization associated with the API key
export const ApiKeyOrgInfo = z.object({
	id: z.string().describe('The organization ID.'),
});

export const VerifyAPIKeyResponse = z.object({
	key: ApiKeyInfo,
	organization: ApiKeyOrgInfo,
});
