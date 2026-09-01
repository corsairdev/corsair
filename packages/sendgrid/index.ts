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
import { SENDGRID_OPS } from './endpoints/catalog';
import {
	apiKeys,
	asm,
	contacts,
	fields,
	lists,
	mail,
	segments,
	senders,
	stats,
	suppressions,
	templates,
	user,
} from './endpoints/handlers';
import type {
	SendGridEndpointInputs,
	SendGridEndpointOutputs,
} from './endpoints/types';
import {
	SendGridEndpointInputSchemas,
	SendGridEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SendGridSchema } from './schema';

export type SendGridPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSendGridPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof sendGridEndpointsNested>;
};

export type SendGridContext = CorsairPluginContext<
	typeof SendGridSchema,
	SendGridPluginOptions
>;

export type SendGridKeyBuilderContext =
	KeyBuilderContext<SendGridPluginOptions>;

export type SendGridBoundEndpoints = BindEndpoints<
	typeof sendGridEndpointsNested
>;

type SendGridEndpoint<K extends keyof SendGridEndpointOutputs> =
	CorsairEndpoint<
		SendGridContext,
		SendGridEndpointInputs[K],
		SendGridEndpointOutputs[K]
	>;

export type SendGridEndpoints = {
	[K in keyof SendGridEndpointInputs]: SendGridEndpoint<K>;
};

const sendGridEndpointsNested = {
	mail,
	contacts,
	lists,
	segments,
	fields,
	senders,
	templates,
	suppressions,
	asm,
	stats,
	user,
	apiKeys,
} as const;

export const sendGridEndpointSchemas = Object.fromEntries(
	SENDGRID_OPS.map((op) => [
		op.nested,
		{
			input:
				SendGridEndpointInputSchemas[
					op.key as keyof typeof SendGridEndpointInputSchemas
				],
			output:
				SendGridEndpointOutputSchemas[
					op.key as keyof typeof SendGridEndpointOutputSchemas
				],
		},
	]),
) as unknown as RequiredPluginEndpointSchemas<typeof sendGridEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const sendGridEndpointMeta = Object.fromEntries(
	SENDGRID_OPS.map((op) => [
		op.nested,
		{ riskLevel: op.risk, description: op.description },
	]),
) as unknown as RequiredPluginEndpointMeta<typeof sendGridEndpointsNested>;

export const sendGridAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSendGridPlugin<T extends SendGridPluginOptions> = CorsairPlugin<
	'sendgrid',
	typeof SendGridSchema,
	typeof sendGridEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalSendGridPlugin = BaseSendGridPlugin<SendGridPluginOptions>;

export type ExternalSendGridPlugin<T extends SendGridPluginOptions> =
	BaseSendGridPlugin<T>;

export function sendgrid<const T extends SendGridPluginOptions>(
	incomingOptions: SendGridPluginOptions & T = {} as SendGridPluginOptions & T,
): ExternalSendGridPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'sendgrid',
		authConfig: sendGridAuthConfig,
		schema: SendGridSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: sendGridEndpointsNested,
		webhooks: {},
		endpointMeta: sendGridEndpointMeta,
		endpointSchemas: sendGridEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SendGridKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('sendgrid', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('sendgrid', 'api_key');
		},
	} satisfies InternalSendGridPlugin;
}

export type {
	ContactsAddOrUpdateInput,
	ContactsAddOrUpdateOutput,
	ListsCreateInput,
	ListsCreateOutput,
	ListsGetAllInput,
	ListsGetAllOutput,
	MailSendInput,
	MailSendOutput,
	SendersGetAllInput,
	SendersGetAllOutput,
	SendGridEndpointInputs,
	SendGridEndpointOutputs,
	SuppressionsGetBouncesInput,
	SuppressionsGetBouncesOutput,
} from './endpoints/types';
