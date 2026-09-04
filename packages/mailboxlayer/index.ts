import type {
	AuthTypes,
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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { tryGetStoredKey } from './client';
import { Email } from './endpoints';
import type {
	MailboxLayerEndpointInputs,
	MailboxLayerEndpointOutputs,
} from './endpoints/types';
import {
	MailboxLayerEndpointInputSchemas,
	MailboxLayerEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MailboxLayerSchema } from './schema';

export type MailboxLayerPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMailboxLayerPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mailboxLayerEndpointsNested>;
};

export type MailboxLayerContext = CorsairPluginContext<
	typeof MailboxLayerSchema,
	MailboxLayerPluginOptions,
	undefined,
	typeof mailboxLayerAuthConfig
>;

export type MailboxLayerKeyBuilderContext = KeyBuilderContext<
	MailboxLayerPluginOptions,
	typeof mailboxLayerAuthConfig
>;

export type MailboxLayerBoundEndpoints = BindEndpoints<
	typeof mailboxLayerEndpointsNested
>;

type MailboxLayerEndpoint<K extends keyof MailboxLayerEndpointOutputs> =
	CorsairEndpoint<
		MailboxLayerContext,
		MailboxLayerEndpointInputs[K],
		MailboxLayerEndpointOutputs[K]
	>;

export type MailboxLayerEndpoints = {
	check: MailboxLayerEndpoint<'check'>;
};

const mailboxLayerEndpointsNested = {
	email: {
		check: Email.check,
	},
} as const;

const mailboxLayerWebhooksNested = {} as const;

export const mailboxLayerEndpointSchemas = {
	'email.check': {
		input: MailboxLayerEndpointInputSchemas.check,
		output: MailboxLayerEndpointOutputSchemas.check,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof mailboxLayerEndpointsNested
>;

const mailboxLayerEndpointMeta = {
	'email.check': {
		riskLevel: 'read',
		description:
			'Validate whether an email address is correctly formatted, has valid MX records, and is deliverable via SMTP',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof mailboxLayerEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const mailboxLayerAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseMailboxLayerPlugin<T extends MailboxLayerPluginOptions> =
	CorsairPlugin<
		'mailboxlayer',
		typeof MailboxLayerSchema,
		typeof mailboxLayerEndpointsNested,
		typeof mailboxLayerWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof mailboxLayerAuthConfig
	>;

export type InternalMailboxLayerPlugin =
	BaseMailboxLayerPlugin<MailboxLayerPluginOptions>;

export type ExternalMailboxLayerPlugin<T extends MailboxLayerPluginOptions> =
	BaseMailboxLayerPlugin<T>;

export function mailboxlayer<const T extends MailboxLayerPluginOptions>(
	incomingOptions: MailboxLayerPluginOptions &
		T = {} as MailboxLayerPluginOptions & T,
): ExternalMailboxLayerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
	return {
		id: 'mailboxlayer',
		authConfig: mailboxLayerAuthConfig,
		schema: MailboxLayerSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: mailboxLayerEndpointsNested,
		webhooks: mailboxLayerWebhooksNested,
		endpointMeta: mailboxLayerEndpointMeta,
		endpointSchemas: mailboxLayerEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...specificDefaults,
			...(options.errorHandlers || {}),
			DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
		},
		keyBuilder: async (ctx: MailboxLayerKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const res = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!res) {
					throw new AuthMissingError('mailboxlayer', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('mailboxlayer', 'api_key');
		},
	} satisfies InternalMailboxLayerPlugin;
}

export type {
	CheckInput,
	CheckResponse,
	MailboxLayerEndpointInputs,
	MailboxLayerEndpointOutputs,
} from './endpoints/types';

export { CheckInputSchema, CheckResponseSchema } from './endpoints/types';
