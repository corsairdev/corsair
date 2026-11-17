import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import * as verification from './endpoints';
import type {
	IdentityCheckEndpointInputs,
	IdentityCheckEndpointOutputs,
} from './endpoints/types';
import {
	IdentityCheckEndpointInputSchemas as inputs,
	IdentityCheckEndpointOutputSchemas as outputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { IdentityCheckSchema } from './schema';
import {
	decision,
	matchIdentityCheckWebhook,
	VerificationDecisionSchema,
} from './webhooks';

export type IdentityCheckPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalIdentityCheckPlugin['hooks'];
	webhookHooks?: InternalIdentityCheckPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endpoints>;
};
export type IdentityCheckContext = CorsairPluginContext<
	typeof IdentityCheckSchema,
	IdentityCheckPluginOptions
>;
export type IdentityCheckEndpoints = {
	[K in keyof IdentityCheckEndpointOutputs]: CorsairEndpoint<
		IdentityCheckContext,
		IdentityCheckEndpointInputs[K],
		IdentityCheckEndpointOutputs[K]
	>;
};
const endpoints = { verification } as const;
const webhooks = { verification: { decision } } as const;
export const identityCheckWebhookSchemas = {
	'verification.decision': {
		description: 'A verification has a decision',
		payload: VerificationDecisionSchema,
		response: VerificationDecisionSchema,
	},
} satisfies RequiredPluginWebhookSchemas<typeof webhooks>;
export type IdentityCheckBoundEndpoints = BindEndpoints<typeof endpoints>;
export const identityCheckEndpointSchemas = {
	'verification.create': { input: inputs.create, output: outputs.create },
	'verification.sms': { input: inputs.sms, output: outputs.sms },
	'verification.kyb': { input: inputs.kyb, output: outputs.kyb },
	'verification.tranche2': { input: inputs.tranche2, output: outputs.tranche2 },
	'verification.get': { input: inputs.get, output: outputs.get },
	'verification.image': { input: inputs.image, output: outputs.image },
} satisfies RequiredPluginEndpointSchemas<typeof endpoints>;
const meta = {
	'verification.create': {
		riskLevel: 'destructive',
		description:
			'Start an individual verification; it uses plan credit, and with emailUser "Yes" StackGo emails the person an invitation',
	},
	'verification.sms': {
		riskLevel: 'destructive',
		description:
			'Start a verification and invite the person by SMS; it uses plan credit',
	},
	'verification.kyb': {
		riskLevel: 'destructive',
		description: 'Start a business KYB check; it uses plan credit',
	},
	'verification.tranche2': {
		riskLevel: 'destructive',
		description: 'Start a Tranche 2 workflow; it uses plan credit',
	},
	'verification.get': {
		riskLevel: 'read',
		description: 'Retrieve a verification and result',
	},
	'verification.image': {
		riskLevel: 'read',
		description:
			'Download a document or selfie image captured during a verification (needs the verification.image key scope)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof endpoints>;
export const identityCheckAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;
type BaseIdentityCheckPlugin<T extends IdentityCheckPluginOptions> =
	CorsairPlugin<
		'identitycheck',
		typeof IdentityCheckSchema,
		typeof endpoints,
		typeof webhooks,
		T,
		'api_key'
	>;
export type InternalIdentityCheckPlugin =
	BaseIdentityCheckPlugin<IdentityCheckPluginOptions>;
export type ExternalIdentityCheckPlugin<T extends IdentityCheckPluginOptions> =
	BaseIdentityCheckPlugin<T>;

export function identitycheck<const T extends IdentityCheckPluginOptions>(
	incomingOptions: IdentityCheckPluginOptions &
		T = {} as IdentityCheckPluginOptions & T,
): ExternalIdentityCheckPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? ('api_key' as const),
	};
	return {
		id: 'identitycheck',
		authConfig: identityCheckAuthConfig,
		schema: IdentityCheckSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints,
		webhooks,
		webhookSchemas: identityCheckWebhookSchemas,
		pluginWebhookMatcher: matchIdentityCheckWebhook,
		endpointSchemas: identityCheckEndpointSchemas,
		endpointMeta: meta,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (
			ctx: KeyBuilderContext<IdentityCheckPluginOptions>,
			source,
		) => {
			if (source === 'webhook') {
				const secret =
					options.webhookSecret ?? (await ctx.keys.get_webhook_signature());
				if (!secret?.trim())
					throw new AuthMissingError('identitycheck', 'webhook_signature');
				return secret;
			}
			const key = options.key ?? (await ctx.keys.get_api_key());
			if (!key?.trim()) throw new AuthMissingError('identitycheck', 'api_key');
			return key;
		},
	} satisfies InternalIdentityCheckPlugin;
}
export type {
	IdentityCheckEndpointInputs,
	IdentityCheckEndpointOutputs,
} from './endpoints/types';
export type { VerificationDecision } from './webhooks';
