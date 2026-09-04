import type {
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { DocusignAuthOptions } from './client';
import { DocusignClient } from './client';
import * as endpoints from './endpoints';
import * as errorHandlers from './error-handlers';
import * as schema from './schema';

export * from './client';
export * from './endpoints';
export * from './error-handlers';
export * from './schema';

export const docusignEndpointsNested = {
	createEnvelope: endpoints.createEnvelope,
	getEnvelope: endpoints.getEnvelope,
	sendEnvelope: endpoints.sendEnvelope,
	createRecipientViewUrl: endpoints.createRecipientViewUrl,
	listTemplates: endpoints.listTemplates,
	getTemplate: endpoints.getTemplate,
	listOAuthUserInfo: endpoints.listOAuthUserInfo,
	fetchRecipientNamesForEmail: endpoints.fetchRecipientNamesForEmail,
	...endpoints.generatedEndpointsNested,
};

export const docusignEndpointMeta = {
	createEnvelope: {
		description:
			'Creates a signing envelope from a pre-existing DocuSign template.',
		riskLevel: 'write',
	},
	getEnvelope: {
		description:
			'Gets the status and basic information about an envelope from DocuSign.',
		riskLevel: 'read',
	},
	sendEnvelope: {
		description: 'Sends a draft envelope by updating its status to sent.',
		riskLevel: 'write',
	},
	createRecipientViewUrl: {
		description:
			'Generates a recipient view URL for embedded signing or viewing.',
		riskLevel: 'write',
	},
	listTemplates: {
		description: 'Gets the definition of templates in the specified account.',
		riskLevel: 'read',
	},
	getTemplate: {
		description: 'Gets a template definition from the specified account.',
		riskLevel: 'read',
	},
	listOAuthUserInfo: {
		description:
			"Retrieves the authenticated user's account information from DocuSign OAuth, including user ID, name, email, accounts, base URIs, and account IDs.",
		riskLevel: 'read',
	},
	fetchRecipientNamesForEmail: {
		description:
			'Retrieves the names associated with an email address from all recipient types on an envelope.',
		riskLevel: 'read',
	},
	...endpoints.generatedEndpointMeta,
} satisfies RequiredPluginEndpointMeta<typeof docusignEndpointsNested>;

export const docusignAuthConfig = {
	oauth_2: {
		account: ['account_id', 'base_uri'] as const,
	},
} as const satisfies PluginAuthConfig;

export type DocusignPluginOptions = {
	accessToken: string;
	accountId: string;
	baseUri?: string;
	authType?: PickAuth<'oauth_2'>;
};

export type DocusignKeyBuilderContext = KeyBuilderContext<
	DocusignPluginOptions,
	typeof docusignAuthConfig
>;

export const endpointMeta = docusignEndpointMeta;
export const endpointSchemas = endpoints.docusignEndpointSchemas;

export const docusignPlugin = {
	id: 'docusign',
	name: 'DocuSign',
	description:
		'DocuSign eSignature REST API integration for agreements, envelopes, and templates.',
	auth: {
		type: 'oauth2' as const,
		fields: ['accessToken', 'accountId', 'baseUri'],
	},
	authConfig: docusignAuthConfig,
	createClient: (options: DocusignAuthOptions) => new DocusignClient(options),
	endpoints: docusignEndpointsNested,
	endpointMeta: docusignEndpointMeta,
	endpointSchemas: endpoints.docusignEndpointSchemas,
	errorHandlers: errorHandlers.docusignErrorHandlers,
	schema,
	keyBuilder: async (
		ctx: DocusignKeyBuilderContext,
		source: 'endpoint' | 'webhook',
	) => {
		if (source !== 'endpoint') {
			throw new AuthMissingError('docusign', 'oauth_2');
		}
		const factory = ctx.options as Partial<DocusignAuthOptions> | undefined;
		if (
			typeof factory?.accessToken === 'string' &&
			factory.accessToken.length > 0 &&
			typeof factory?.accountId === 'string' &&
			factory.accountId.length > 0
		) {
			return JSON.stringify({
				accessToken: factory.accessToken,
				accountId: factory.accountId,
				...(typeof factory.baseUri === 'string' && factory.baseUri.length > 0
					? { baseUri: factory.baseUri }
					: {}),
			});
		}
		const accessToken = await ctx.keys?.get_access_token?.();
		const accountId = await ctx.keys?.get_account_id?.();
		const baseUri = await ctx.keys?.get_base_uri?.();
		if (!accessToken || !accountId) {
			throw new AuthMissingError('docusign', 'oauth_2');
		}
		return JSON.stringify({
			accessToken,
			accountId,
			...(baseUri ? { baseUri } : {}),
		});
	},
};

export const docusign = (config?: Record<string, unknown>) => ({
	...docusignPlugin,
	// Core forwards `plugin.options` into the runtime context (`ctx.options`),
	// so credentials must live under `options` — not only `config` — for
	// bound endpoints to resolve their client at runtime.
	// `authType` makes the runtime provision the tenant key manager so the
	// keyBuilder can resolve per-tenant credentials.
	...(config && {
		config,
		options: { authType: 'oauth_2', ...config },
	}),
});

export default docusign;
