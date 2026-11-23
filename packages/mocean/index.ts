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
import { Account, Lookup, Sms, Verify } from './endpoints';
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
	smsSend: MoceanEndpoint<'smsSend'>;
	smsStatus: MoceanEndpoint<'smsStatus'>;
	accountBalance: MoceanEndpoint<'accountBalance'>;
	accountPricing: MoceanEndpoint<'accountPricing'>;
	verifyRequest: MoceanEndpoint<'verifyRequest'>;
	verifyResend: MoceanEndpoint<'verifyResend'>;
	verifyCheck: MoceanEndpoint<'verifyCheck'>;
	lookupRequest: MoceanEndpoint<'lookupRequest'>;
};

const moceanEndpointsNested = {
	sms: {
		send: Sms.send,
		status: Sms.status,
	},
	account: {
		balance: Account.balance,
		pricing: Account.pricing,
	},
	verify: {
		request: Verify.request,
		resend: Verify.resend,
		check: Verify.check,
	},
	lookup: {
		request: Lookup.request,
	},
} as const;

export const moceanEndpointSchemas = {
	'sms.send': {
		input: MoceanEndpointInputSchemas.smsSend,
		output: MoceanEndpointOutputSchemas.smsSend,
	},
	'sms.status': {
		input: MoceanEndpointInputSchemas.smsStatus,
		output: MoceanEndpointOutputSchemas.smsStatus,
	},
	'account.balance': {
		input: MoceanEndpointInputSchemas.accountBalance,
		output: MoceanEndpointOutputSchemas.accountBalance,
	},
	'account.pricing': {
		input: MoceanEndpointInputSchemas.accountPricing,
		output: MoceanEndpointOutputSchemas.accountPricing,
	},
	'verify.request': {
		input: MoceanEndpointInputSchemas.verifyRequest,
		output: MoceanEndpointOutputSchemas.verifyRequest,
	},
	'verify.resend': {
		input: MoceanEndpointInputSchemas.verifyResend,
		output: MoceanEndpointOutputSchemas.verifyResend,
	},
	'verify.check': {
		input: MoceanEndpointInputSchemas.verifyCheck,
		output: MoceanEndpointOutputSchemas.verifyCheck,
	},
	'lookup.request': {
		input: MoceanEndpointInputSchemas.lookupRequest,
		output: MoceanEndpointOutputSchemas.lookupRequest,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof moceanEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const moceanEndpointMeta = {
	'sms.send': {
		riskLevel: 'destructive',
		description:
			'Send an SMS to up to 500 receivers, charged per destination; the response carries a status and msgid per receiver',
	},
	'sms.status': {
		riskLevel: 'read',
		description:
			"Read one sent message's final status (success, failed, expired, pending or not found) and the credit it deducted",
	},
	'account.balance': {
		riskLevel: 'read',
		description: 'Read the account balance',
	},
	'account.pricing': {
		riskLevel: 'read',
		description:
			'List the account per-destination pricing, optionally filtered by MCC/MNC or service type',
	},
	'verify.request': {
		riskLevel: 'destructive',
		description:
			'Send a verification code over SMS, charged per attempt; keep the reqid for check and resend',
	},
	'verify.resend': {
		riskLevel: 'destructive',
		description:
			'Resend the code of an existing verify request over SMS, charged per attempt',
	},
	'verify.check': {
		riskLevel: 'write',
		description:
			'Check the PIN a user gave you against a verify request; Mocean allows three wrong attempts',
	},
	'lookup.request': {
		riskLevel: 'read',
		description:
			"Look up a number's original and current carrier and porting status, charged against prepaid credit; returns synchronously without a callback URL",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof moceanEndpointsNested>;

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

export { MoceanAPIError } from './client';

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
