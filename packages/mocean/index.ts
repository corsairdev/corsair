import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Account, Lookup, Sms, Verify, Voice, WhatsApp } from './endpoints';
import { moceanEndpointMeta as endpointMeta } from './endpoints/meta';
import type {
	MoceanEndpointInputs,
	MoceanEndpointOutputs,
} from './endpoints/types';
import {
	MoceanEndpointInputSchemas,
	MoceanEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { MoceanSchema } from './schema';

export type MoceanPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The Mocean API token from the dashboard, under API settings. */
	key?: string;
	hooks?: InternalMoceanPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof moceanEndpointsNested>;
};

export type MoceanContext = CorsairPluginContext<
	typeof MoceanSchema,
	MoceanPluginOptions
>;

export type MoceanKeyBuilderContext = KeyBuilderContext<MoceanPluginOptions>;

export type MoceanBoundEndpoints = BindEndpoints<typeof moceanEndpointsNested>;

type MoceanEndpoint<K extends keyof MoceanEndpointOutputs> = CorsairEndpoint<
	MoceanContext,
	MoceanEndpointInputs[K],
	MoceanEndpointOutputs[K]
>;

export type MoceanEndpoints = {
	[K in keyof MoceanEndpointOutputs]: MoceanEndpoint<K>;
};

const moceanEndpointsNested = {
	sms: {
		send: Sms.send,
		status: Sms.status,
		reportConversion: Sms.reportConversion,
	},
	account: {
		balance: Account.balance,
		pricing: Account.pricing,
	},
	verify: {
		request: Verify.request,
		requestTelegram: Verify.requestTelegram,
		resend: Verify.resend,
		check: Verify.check,
	},
	lookup: {
		request: Lookup.request,
	},
	voice: {
		dial: Voice.dial,
		hangup: Voice.hangup,
		recording: Voice.recording,
	},
	whatsapp: {
		send: WhatsApp.send,
		downloadMedia: WhatsApp.downloadMedia,
	},
	templates: {
		list: WhatsApp.listTemplates,
		get: WhatsApp.getTemplate,
		create: WhatsApp.createTemplate,
		edit: WhatsApp.editTemplate,
		delete: WhatsApp.deleteTemplate,
	},
} as const;

const schemas = <K extends keyof typeof MoceanEndpointInputSchemas>(key: K) =>
	({
		input: MoceanEndpointInputSchemas[key],
		output: MoceanEndpointOutputSchemas[key],
	}) as const;

export const moceanEndpointSchemas = {
	'sms.send': schemas('smsSend'),
	'sms.status': schemas('smsStatus'),
	'sms.reportConversion': schemas('smsReportConversion'),
	'account.balance': schemas('accountBalance'),
	'account.pricing': schemas('accountPricing'),
	'verify.request': schemas('verifyRequest'),
	'verify.requestTelegram': schemas('verifyRequestTelegram'),
	'verify.resend': schemas('verifyResend'),
	'verify.check': schemas('verifyCheck'),
	'lookup.request': schemas('lookupRequest'),
	'voice.dial': schemas('voiceDial'),
	'voice.hangup': schemas('voiceHangup'),
	'voice.recording': schemas('voiceRecording'),
	'whatsapp.send': schemas('whatsappSend'),
	'whatsapp.downloadMedia': schemas('whatsappDownloadMedia'),
	'templates.list': schemas('templatesList'),
	'templates.get': schemas('templatesGet'),
	'templates.create': schemas('templatesCreate'),
	'templates.edit': schemas('templatesEdit'),
	'templates.delete': schemas('templatesDelete'),
} as const satisfies RequiredPluginEndpointSchemas<
	typeof moceanEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const moceanEndpointMeta = endpointMeta satisfies RequiredPluginEndpointMeta<
	typeof moceanEndpointsNested
>;

export type BaseMoceanPlugin<T extends MoceanPluginOptions> = CorsairPlugin<
	'mocean',
	typeof MoceanSchema,
	typeof moceanEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalMoceanPlugin = BaseMoceanPlugin<MoceanPluginOptions>;

export type ExternalMoceanPlugin<T extends MoceanPluginOptions> =
	BaseMoceanPlugin<T>;

export function mocean<const T extends MoceanPluginOptions>(
	incomingOptions: MoceanPluginOptions & T = {} as MoceanPluginOptions & T,
): ExternalMoceanPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'mocean',
		schema: MoceanSchema,
		options: options,
		hooks: options.hooks,
		endpoints: moceanEndpointsNested,
		webhooks: {},
		endpointMeta: moceanEndpointMeta,
		endpointSchemas: moceanEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: MoceanKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('mocean', ctx.authType ?? 'api_key');
		},
	} satisfies InternalMoceanPlugin;
}

export type {
	AccountPricingInput,
	AccountPricingResponse,
	BalanceResponse,
	LookupRequestInput,
	LookupResponse,
	MoceanEndpointInputs,
	MoceanEndpointOutputs,
	SmsSendInput,
	SmsSendResponse,
	SmsStatusInput,
	SmsStatusResponse,
	VerifyCheckInput,
	VerifyCheckResponse,
	VerifyRequestInput,
	VerifyResendInput,
	VerifyResponse,
} from './endpoints/types';
