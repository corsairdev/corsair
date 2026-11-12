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
import * as Phones from './endpoints';
import type {
	RealPhoneValidationEndpointInputs,
	RealPhoneValidationEndpointOutputs,
} from './endpoints/types';
import {
	RealPhoneValidationEndpointInputSchemas,
	RealPhoneValidationEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RealPhoneValidationSchema } from './schema';

export type RealPhoneValidationPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRealPhoneValidationPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<
		typeof realPhoneValidationEndpointsNested
	>;
};

export type RealPhoneValidationContext = CorsairPluginContext<
	typeof RealPhoneValidationSchema,
	RealPhoneValidationPluginOptions
>;

export type RealPhoneValidationKeyBuilderContext =
	KeyBuilderContext<RealPhoneValidationPluginOptions>;

export type RealPhoneValidationBoundEndpoints = BindEndpoints<
	typeof realPhoneValidationEndpointsNested
>;

type RealPhoneValidationEndpoint<
	K extends keyof RealPhoneValidationEndpointOutputs,
> = CorsairEndpoint<
	RealPhoneValidationContext,
	RealPhoneValidationEndpointInputs[K],
	RealPhoneValidationEndpointOutputs[K]
>;

export type RealPhoneValidationEndpoints = {
	turboV3: RealPhoneValidationEndpoint<'turboV3'>;
	turboStandard: RealPhoneValidationEndpoint<'turboStandard'>;
	turbo: RealPhoneValidationEndpoint<'turbo'>;
	scrub: RealPhoneValidationEndpoint<'scrub'>;
	scrubPlus: RealPhoneValidationEndpoint<'scrubPlus'>;
	active: RealPhoneValidationEndpoint<'active'>;
	wirelessId: RealPhoneValidationEndpoint<'wirelessId'>;
	dncLookup: RealPhoneValidationEndpoint<'dncLookup'>;
	dncPlus: RealPhoneValidationEndpoint<'dncPlus'>;
	fraudCheck: RealPhoneValidationEndpoint<'fraudCheck'>;
	reassigned: RealPhoneValidationEndpoint<'reassigned'>;
	emailVerify: RealPhoneValidationEndpoint<'emailVerify'>;
};

const realPhoneValidationEndpointsNested = {
	turboV3: Phones.turboV3,
	turboStandard: Phones.turboStandard,
	turbo: Phones.turbo,
	scrub: Phones.scrub,
	scrubPlus: Phones.scrubPlus,
	active: Phones.active,
	wirelessId: Phones.wirelessId,
	dncLookup: Phones.dncLookup,
	dncPlus: Phones.dncPlus,
	fraudCheck: Phones.fraudCheck,
	reassigned: Phones.reassigned,
	emailVerify: Phones.emailVerify,
} as const;

export const realPhoneValidationEndpointSchemas = {
	turboV3: {
		input: RealPhoneValidationEndpointInputSchemas.turboV3,
		output: RealPhoneValidationEndpointOutputSchemas.turboV3,
	},
	turboStandard: {
		input: RealPhoneValidationEndpointInputSchemas.turboStandard,
		output: RealPhoneValidationEndpointOutputSchemas.turboStandard,
	},
	turbo: {
		input: RealPhoneValidationEndpointInputSchemas.turbo,
		output: RealPhoneValidationEndpointOutputSchemas.turbo,
	},
	scrub: {
		input: RealPhoneValidationEndpointInputSchemas.scrub,
		output: RealPhoneValidationEndpointOutputSchemas.scrub,
	},
	scrubPlus: {
		input: RealPhoneValidationEndpointInputSchemas.scrubPlus,
		output: RealPhoneValidationEndpointOutputSchemas.scrubPlus,
	},
	active: {
		input: RealPhoneValidationEndpointInputSchemas.active,
		output: RealPhoneValidationEndpointOutputSchemas.active,
	},
	wirelessId: {
		input: RealPhoneValidationEndpointInputSchemas.wirelessId,
		output: RealPhoneValidationEndpointOutputSchemas.wirelessId,
	},
	dncLookup: {
		input: RealPhoneValidationEndpointInputSchemas.dncLookup,
		output: RealPhoneValidationEndpointOutputSchemas.dncLookup,
	},
	dncPlus: {
		input: RealPhoneValidationEndpointInputSchemas.dncPlus,
		output: RealPhoneValidationEndpointOutputSchemas.dncPlus,
	},
	fraudCheck: {
		input: RealPhoneValidationEndpointInputSchemas.fraudCheck,
		output: RealPhoneValidationEndpointOutputSchemas.fraudCheck,
	},
	reassigned: {
		input: RealPhoneValidationEndpointInputSchemas.reassigned,
		output: RealPhoneValidationEndpointOutputSchemas.reassigned,
	},
	emailVerify: {
		input: RealPhoneValidationEndpointInputSchemas.emailVerify,
		output: RealPhoneValidationEndpointOutputSchemas.emailVerify,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof realPhoneValidationEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const realPhoneValidationEndpointMeta = {
	turboV3: {
		riskLevel: 'read',
		description:
			'Validate a US phone number with the richest answer: connection status, phone type, caller name, carrier and caller type',
	},
	turboStandard: {
		riskLevel: 'read',
		description:
			'Validate a US phone number for connection status and phone type only',
	},
	turbo: {
		riskLevel: 'read',
		description:
			'Validate a US phone number with the older Turbo script: connection status, Iscell and carrier',
	},
	scrub: {
		riskLevel: 'read',
		description:
			'Validate a US phone number for connection status at list-processing prices; Iscell and carrier are extra-cost options. May return unknown for up to 5% of numbers',
	},
	scrubPlus: {
		riskLevel: 'read',
		description:
			'Validate a US phone number for connection status and phone type at list-processing prices',
	},
	active: {
		riskLevel: 'read',
		description:
			'Report whether a US phone number sits on a provider still in business, which is a different question from whether it is connected',
	},
	wirelessId: {
		riskLevel: 'read',
		description:
			'Report whether a US phone number is landline or cell, for TCPA compliance',
	},
	dncLookup: {
		riskLevel: 'read',
		description:
			'Check a US phone number against the national, state and DMA Do-Not-Call lists and the known-litigator list, and report its line type. Needs a SAN number from the national registry',
	},
	dncPlus: {
		riskLevel: 'read',
		description:
			'Check a US phone number against the three Do-Not-Call lists and the known-litigator list together with its connection status',
	},
	fraudCheck: {
		riskLevel: 'read',
		description:
			'Score a US phone number for fraudulent use from 0 to 1000, with a risk level, a recommended action, the carrier and the number location',
	},
	reassigned: {
		riskLevel: 'read',
		description:
			'Report whether a US phone number changed owner since the date consent to contact was given',
	},
	emailVerify: {
		riskLevel: 'read',
		description:
			'Verify an email address for validity, whether it is connected to an active online network, and whether it is disposable',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof realPhoneValidationEndpointsNested
>;

export type BaseRealPhoneValidationPlugin<
	T extends RealPhoneValidationPluginOptions,
> = CorsairPlugin<
	'realphonevalidation',
	typeof RealPhoneValidationSchema,
	typeof realPhoneValidationEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalRealPhoneValidationPlugin =
	BaseRealPhoneValidationPlugin<RealPhoneValidationPluginOptions>;

export type ExternalRealPhoneValidationPlugin<
	T extends RealPhoneValidationPluginOptions,
> = BaseRealPhoneValidationPlugin<T>;

export function realphonevalidation<
	const T extends RealPhoneValidationPluginOptions,
>(
	incomingOptions: RealPhoneValidationPluginOptions &
		T = {} as RealPhoneValidationPluginOptions & T,
): ExternalRealPhoneValidationPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'realphonevalidation',
		schema: RealPhoneValidationSchema,
		options: options,
		hooks: options.hooks,
		endpoints: realPhoneValidationEndpointsNested,
		webhooks: {},
		endpointMeta: realPhoneValidationEndpointMeta,
		endpointSchemas: realPhoneValidationEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RealPhoneValidationKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError(
				'realphonevalidation',
				ctx.authType ?? 'api_key',
			);
		},
	} satisfies InternalRealPhoneValidationPlugin;
}

export { RealPhoneValidationAPIError } from './client';

export type {
	ActiveInput,
	ActiveResponse,
	DncLookupInput,
	DncLookupResponse,
	DncPlusInput,
	DncPlusResponse,
	EmailVerifyInput,
	EmailVerifyResponse,
	FraudCheckInput,
	FraudCheckResponse,
	RealPhoneValidationEndpointInputs,
	RealPhoneValidationEndpointOutputs,
	ReassignedInput,
	ReassignedResponse,
	ScrubInput,
	ScrubPlusInput,
	ScrubPlusResponse,
	ScrubResponse,
	TurboInput,
	TurboResponse,
	TurboStandardInput,
	TurboStandardResponse,
	TurboV3Input,
	TurboV3Response,
	WirelessIdInput,
	WirelessIdResponse,
} from './endpoints/types';
