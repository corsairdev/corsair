import { z } from 'zod';
import { PathSegmentSchema } from './types';

// Group C: provider catalog, integration credentials, play secrets and
// workspace reads. Shapes follow the official Deepline SDK (client-core.ts,
// types.ts) and live GET responses observed on 2026-11-17.
//
// Credential-bearing operations use z.object (unknown keys stripped) instead
// of z.looseObject, so a server that echoed a stored value could never pass it
// back to the caller through this plugin.

const ProviderIdSchema = z
	.string()
	.trim()
	.min(1)
	.max(100)
	.regex(/^[A-Za-z0-9._-]+$/, {
		message: 'Provider ids use letters, numbers, dot, dash and underscore',
	});

// ---------------------------------------------------------------- tools.*

export const ListProvidersInputSchema = z.strictObject({
	changed: z
		.boolean()
		.optional()
		.describe(
			'Set true to list only recently added providers, with their catalog version and release date.',
		),
});
export const ProviderSummarySchema = z.looseObject({
	provider: z.string(),
	displayName: z.string(),
	toolCount: z.number(),
	categories: z.array(z.string()),
	version: z.string().nullish(),
	releasedAt: z.string().nullish(),
});
export const ListProvidersOutputSchema = z.looseObject({
	providers: z.array(ProviderSummarySchema),
	total: z.number().optional(),
});

export const QuoteInferenceToolInputSchema = z.strictObject({
	toolId: z
		.enum(['ai_inference', 'deeplineagent', 'ai_evaluate'])
		.describe(
			'Inference tool to price. Dynamic quotes exist only for ai_inference, deeplineagent and ai_evaluate.',
		),
	payload: z
		.record(z.string(), z.unknown())
		.describe(
			'The exact tool payload you plan to execute (for example model, prompt or messages, maxOutputTokens). Nothing runs; only the price is computed.',
		),
});
const InferenceQualitySchema = z.enum([
	'bounded_max',
	'estimate_only',
	'unavailable',
]);
const InferenceQuoteAssumptionsSchema = z.looseObject({
	modelCallCount: z.number(),
	estimatedInputTokens: z.number(),
	estimatedOutputTokens: z.number(),
});
export const QuoteInferenceToolOutputSchema = z.looseObject({
	quality: InferenceQualitySchema,
	estimate: z.looseObject({
		quality: InferenceQualitySchema,
		credits: z.number().optional(),
		assumptions: InferenceQuoteAssumptionsSchema,
	}),
	authorization: z.looseObject({
		quality: InferenceQualitySchema,
		maximumCredits: z.number().optional(),
		assumptions: InferenceQuoteAssumptionsSchema,
	}),
	settlement: z.string(),
});

export const DescribeModelInputSchema = z.strictObject({
	model: z
		.string()
		.trim()
		.min(1)
		.describe(
			'Exact lowercase AI Gateway model id, for example openai/gpt-4o-mini.',
		),
});
export const DescribeModelOutputSchema = z.looseObject({
	schemaVersion: z.literal(1),
	model: z.string(),
	provider: z.string(),
	// null when the id is not in the live AI Gateway catalog.
	modelMetadata: z.record(z.string(), z.unknown()).nullable(),
	providerOptions: z.looseObject({
		gateway: z.record(z.string(), z.unknown()),
		selectedProvider: z.record(z.string(), z.unknown()).nullish(),
	}),
	exampleInput: z.looseObject({
		model: z.string(),
		providerOptions: z.record(z.string(), z.unknown()),
	}),
	caveats: z.array(z.string()),
	sources: z.array(z.string()),
	inferencePricing: z.record(z.string(), z.unknown()),
});

// --------------------------------------------------------- integrations.*

export const GetConnectLinkInputSchema = z.strictObject({
	provider: ProviderIdSchema.describe(
		'Provider id from tools.providers, for example hubspot.',
	),
});
export const GetConnectLinkOutputSchema = z.looseObject({
	provider: z.string(),
	connect_url: z.string(),
});

export const SetCredentialsInputSchema = z.strictObject({
	provider: ProviderIdSchema.describe(
		'Provider id from tools.providers, for example leadmagic.',
	),
	credentials: z
		.record(z.string().min(1), z.string().min(1))
		.refine((value) => Object.keys(value).length > 0, {
			message: 'credentials needs at least one field',
		})
		.describe(
			'Provider-owned credential fields, for example { "api_key": "..." }. Values are stored by Deepline and never returned.',
		),
	expectedConnectionId: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Replace only this existing connection; the save is refused if the current connection differs.',
		),
});
// Stripped object: only these two non-secret flags are ever returned.
export const SetCredentialsOutputSchema = z.object({
	ok: z.boolean(),
	credential_saved: z.boolean().optional(),
});

export const StartOAuthInputSchema = z.strictObject({
	provider: ProviderIdSchema.describe(
		'Provider id from tools.providers that connects through OAuth.',
	),
	preset: z
		.string()
		.min(1)
		.optional()
		.describe('Named scope preset defined by the provider integration.'),
	scopes: z
		.array(z.string().trim().min(1))
		.min(1)
		.optional()
		.describe('Explicit OAuth scopes to request. Omit to use the defaults.'),
	optionalScopes: z
		.array(z.string().trim().min(1))
		.optional()
		.describe('Scopes to request when the user is allowed to grant them.'),
});
export const StartOAuthOutputSchema = z.looseObject({
	ok: z.boolean(),
	redirect_url: z.string(),
});

export const GetIntegrationBalanceInputSchema = z.strictObject({
	provider: ProviderIdSchema.describe(
		'Provider whose own workspace credential to read the balance of. Only leadmagic is supported today.',
	),
});
export const GetIntegrationBalanceOutputSchema = z.looseObject({
	provider: z.string(),
	credentialScope: z.string(),
	unit: z.string(),
	observedAt: z.string(),
	balance: z.looseObject({
		value: z.number(),
		status: z.string(),
		source: z.string(),
	}),
});

// -------------------------------------------------------------- secrets.*

const SecretNameSchema = z
	.string()
	.trim()
	.transform((value) => value.toUpperCase())
	.pipe(
		z.string().regex(/^[A-Z][A-Z0-9_]{1,63}$/, {
			message:
				'Secret names are 2-64 characters of uppercase letters, numbers and underscores',
		}),
	);
const BarePlayNameSchema = z
	.string()
	.trim()
	.min(1)
	.refine((value) => !value.includes('/'), {
		message: 'Use the bare Play name, not an org-qualified name',
	});

// Stripped object: metadata only. A value field could never pass through.
export const SecretMetadataSchema = z.object({
	_id: z.string(),
	orgId: z.string(),
	scope: z.enum(['org', 'play']),
	playName: z.string().nullish(),
	name: z.string(),
	note: z.string().nullish(),
	status: z.string(),
	hasValue: z.boolean(),
	createdAt: z.number(),
	updatedAt: z.number(),
	lastUsedAt: z.number().nullish(),
});

export const ListSecretsInputSchema = z.strictObject({});
export const ListSecretsOutputSchema = z.object({
	secrets: z.array(SecretMetadataSchema),
});

export const InspectSecretInputSchema = z.strictObject({
	name: SecretNameSchema.describe(
		'Secret name; normalized to uppercase, for example HUBSPOT_TOKEN.',
	),
	playName: BarePlayNameSchema.optional().describe(
		'Bare Play name. An active Play secret takes precedence over the org secret; omit to check the org secret only.',
	),
});
export const InspectSecretOutputSchema = z.object({
	ok: z.boolean(),
	name: z.string(),
	playName: z.string().nullable(),
	reason: z.enum(['active', 'missing', 'disabled', 'empty', 'invalid_version']),
	secret: SecretMetadataSchema.nullable(),
});

export const SetSecretInputSchema = z
	.strictObject({
		name: SecretNameSchema.describe(
			'Secret name; normalized to uppercase, for example HUBSPOT_TOKEN.',
		),
		value: z
			.string()
			.min(1)
			.describe(
				'The secret value. Stored encrypted by Deepline; never returned or logged.',
			),
		scope: z
			.enum(['org', 'play'])
			.optional()
			.describe(
				'org for the whole workspace, play for one Play. Defaults to play when playName is set, otherwise org.',
			),
		playName: BarePlayNameSchema.optional().describe(
			'Bare Play name; required for scope play and not allowed for scope org.',
		),
		note: z
			.string()
			.optional()
			.describe('Optional non-sensitive note shown with the secret metadata.'),
	})
	.superRefine((input, ctx) => {
		const scope = input.scope ?? (input.playName ? 'play' : 'org');
		if (scope === 'play' && !input.playName)
			ctx.addIssue({
				code: 'custom',
				path: ['playName'],
				message: 'playName is required when scope is play',
			});
		if (scope === 'org' && input.playName)
			ctx.addIssue({
				code: 'custom',
				path: ['playName'],
				message: 'playName can only be used with scope play',
			});
	})
	.transform((input) => ({
		...input,
		scope: input.scope ?? (input.playName ? 'play' : 'org'),
	}));
export const SetSecretOutputSchema = z.object({
	secret: SecretMetadataSchema,
});

export const UpdateSecretNoteInputSchema = z.strictObject({
	secretId: PathSegmentSchema.describe(
		'The _id of the secret from secrets.list.',
	),
	note: z
		.string()
		.describe(
			'Non-sensitive note to store on the secret; an empty string clears it.',
		),
});
export const UpdateSecretNoteOutputSchema = z.object({
	secret: SecretMetadataSchema,
});

// ------------------------------------------------------ workspace / auth

export const ListWorkspaceMembersInputSchema = z.strictObject({
	cursor: z
		.string()
		.min(1)
		.optional()
		.describe('Continuation cursor from the previous page.'),
});
export const ListWorkspaceMembersOutputSchema = z.looseObject({
	members: z.array(
		z.looseObject({
			id: z.string(),
			userId: z.string(),
			role: z.string(),
			grants: z.array(z.string()),
		}),
	),
	cursor: z.string().nullable(),
});

export const ListServiceAccountsInputSchema = z.strictObject({});
const ServiceAccountKeySchema = z.looseObject({
	id: z.string(),
	keyPrefix: z.string(),
	keyLast4: z.string(),
	status: z.string(),
	createdAt: z.number(),
	lastUsedAt: z.number().nullish(),
});
export const ListServiceAccountsOutputSchema = z.looseObject({
	serviceAccounts: z.array(
		z.looseObject({
			id: z.string(),
			userId: z.string(),
			memberId: z.string().nullish(),
			name: z.string(),
			role: z.string().nullish(),
			createdAt: z.number(),
			createdByUserId: z.string(),
			activeKeyCount: z.number(),
			lastUsedAt: z.number().nullish(),
			// Present for admins; null for other members. Prefix and last 4 only.
			keys: z.array(ServiceAccountKeySchema).nullish(),
		}),
	),
});

export const AuthStatusInputSchema = z.strictObject({});
export const AuthStatusOutputSchema = z.looseObject({
	status: z.string(),
	api_key_id: z.string().nullish(),
	user_id: z.string().nullish(),
	org_id: z.string().nullish(),
	org_name: z.string().nullish(),
	org_slug: z.string().nullish(),
	rate_limit_tier: z.string().nullish(),
	features: z.array(z.string()).nullish(),
});
