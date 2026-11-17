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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Email, Geocode, Ip, Messaging, Phone, Text, Web } from './endpoints';
import type {
	NeutrinoEndpointInputs,
	NeutrinoEndpointOutputs,
} from './endpoints/types';
import {
	NeutrinoEndpointInputSchemas,
	NeutrinoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { NeutrinoSchema } from './schema';

export type NeutrinoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** An API key, the password half of the credential pair. */
	key?: string;
	/**
	 * The account's numeric user id, the username half. Neutrino needs both on
	 * every call, so this overrides the stored `user_id`.
	 */
	userId?: string;
	hooks?: InternalNeutrinoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof neutrinoEndpointsNested>;
};

export type NeutrinoContext = CorsairPluginContext<
	typeof NeutrinoSchema,
	NeutrinoPluginOptions,
	undefined,
	typeof neutrinoAuthConfig
>;

export type NeutrinoKeyBuilderContext = KeyBuilderContext<
	NeutrinoPluginOptions,
	typeof neutrinoAuthConfig
>;

export type NeutrinoBoundEndpoints = BindEndpoints<
	typeof neutrinoEndpointsNested
>;

type NeutrinoEndpoint<K extends keyof NeutrinoEndpointOutputs> =
	CorsairEndpoint<
		NeutrinoContext,
		NeutrinoEndpointInputs[K],
		NeutrinoEndpointOutputs[K]
	>;

export type NeutrinoEndpoints = {
	ipInfo: NeutrinoEndpoint<'ipInfo'>;
	ipBlocklist: NeutrinoEndpoint<'ipBlocklist'>;
	ipProbe: NeutrinoEndpoint<'ipProbe'>;
	emailValidate: NeutrinoEndpoint<'emailValidate'>;
	emailVerify: NeutrinoEndpoint<'emailVerify'>;
	phoneValidate: NeutrinoEndpoint<'phoneValidate'>;
	phoneHlrLookup: NeutrinoEndpoint<'phoneHlrLookup'>;
	uaLookup: NeutrinoEndpoint<'uaLookup'>;
	domainLookup: NeutrinoEndpoint<'domainLookup'>;
	hostReputation: NeutrinoEndpoint<'hostReputation'>;
	urlInfo: NeutrinoEndpoint<'urlInfo'>;
	geocodeAddress: NeutrinoEndpoint<'geocodeAddress'>;
	geocodeReverse: NeutrinoEndpoint<'geocodeReverse'>;
	binLookup: NeutrinoEndpoint<'binLookup'>;
	convert: NeutrinoEndpoint<'convert'>;
	smsVerify: NeutrinoEndpoint<'smsVerify'>;
	verifySecurityCode: NeutrinoEndpoint<'verifySecurityCode'>;
	phoneVerify: NeutrinoEndpoint<'phoneVerify'>;
	badWordFilter: NeutrinoEndpoint<'badWordFilter'>;
	browserBot: NeutrinoEndpoint<'browserBot'>;
};

export const neutrinoEndpointsNested = {
	ip: {
		info: Ip.info,
		blocklist: Ip.blocklist,
		probe: Ip.probe,
	},
	email: {
		validate: Email.validate,
		verify: Email.verify,
	},
	phone: {
		validate: Phone.validate,
		hlrLookup: Phone.hlrLookup,
	},
	web: {
		uaLookup: Web.uaLookup,
		domainLookup: Web.domainLookup,
		hostReputation: Web.hostReputation,
		urlInfo: Web.urlInfo,
		browserBot: Web.browserBot,
	},
	text: {
		badWordFilter: Text.badWordFilter,
	},
	geocode: {
		address: Geocode.address,
		reverse: Geocode.reverse,
	},
	commerce: {
		binLookup: Geocode.binLookup,
		convert: Geocode.convert,
	},
	messaging: {
		smsVerify: Messaging.smsVerify,
		phoneVerify: Messaging.phoneVerify,
		verifySecurityCode: Messaging.verifySecurityCode,
	},
} as const;

export const neutrinoEndpointSchemas = {
	'ip.info': {
		input: NeutrinoEndpointInputSchemas.ipInfo,
		output: NeutrinoEndpointOutputSchemas.ipInfo,
	},
	'ip.blocklist': {
		input: NeutrinoEndpointInputSchemas.ipBlocklist,
		output: NeutrinoEndpointOutputSchemas.ipBlocklist,
	},
	'ip.probe': {
		input: NeutrinoEndpointInputSchemas.ipProbe,
		output: NeutrinoEndpointOutputSchemas.ipProbe,
	},
	'email.validate': {
		input: NeutrinoEndpointInputSchemas.emailValidate,
		output: NeutrinoEndpointOutputSchemas.emailValidate,
	},
	'email.verify': {
		input: NeutrinoEndpointInputSchemas.emailVerify,
		output: NeutrinoEndpointOutputSchemas.emailVerify,
	},
	'phone.validate': {
		input: NeutrinoEndpointInputSchemas.phoneValidate,
		output: NeutrinoEndpointOutputSchemas.phoneValidate,
	},
	'phone.hlrLookup': {
		input: NeutrinoEndpointInputSchemas.phoneHlrLookup,
		output: NeutrinoEndpointOutputSchemas.phoneHlrLookup,
	},
	'web.uaLookup': {
		input: NeutrinoEndpointInputSchemas.uaLookup,
		output: NeutrinoEndpointOutputSchemas.uaLookup,
	},
	'web.domainLookup': {
		input: NeutrinoEndpointInputSchemas.domainLookup,
		output: NeutrinoEndpointOutputSchemas.domainLookup,
	},
	'web.hostReputation': {
		input: NeutrinoEndpointInputSchemas.hostReputation,
		output: NeutrinoEndpointOutputSchemas.hostReputation,
	},
	'web.urlInfo': {
		input: NeutrinoEndpointInputSchemas.urlInfo,
		output: NeutrinoEndpointOutputSchemas.urlInfo,
	},
	'geocode.address': {
		input: NeutrinoEndpointInputSchemas.geocodeAddress,
		output: NeutrinoEndpointOutputSchemas.geocodeAddress,
	},
	'geocode.reverse': {
		input: NeutrinoEndpointInputSchemas.geocodeReverse,
		output: NeutrinoEndpointOutputSchemas.geocodeReverse,
	},
	'commerce.binLookup': {
		input: NeutrinoEndpointInputSchemas.binLookup,
		output: NeutrinoEndpointOutputSchemas.binLookup,
	},
	'commerce.convert': {
		input: NeutrinoEndpointInputSchemas.convert,
		output: NeutrinoEndpointOutputSchemas.convert,
	},
	'messaging.smsVerify': {
		input: NeutrinoEndpointInputSchemas.smsVerify,
		output: NeutrinoEndpointOutputSchemas.smsVerify,
	},
	'messaging.phoneVerify': {
		input: NeutrinoEndpointInputSchemas.phoneVerify,
		output: NeutrinoEndpointOutputSchemas.phoneVerify,
	},
	'messaging.verifySecurityCode': {
		input: NeutrinoEndpointInputSchemas.verifySecurityCode,
		output: NeutrinoEndpointOutputSchemas.verifySecurityCode,
	},
	'text.badWordFilter': {
		input: NeutrinoEndpointInputSchemas.badWordFilter,
		output: NeutrinoEndpointOutputSchemas.badWordFilter,
	},
	'web.browserBot': {
		input: NeutrinoEndpointInputSchemas.browserBot,
		output: NeutrinoEndpointOutputSchemas.browserBot,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof neutrinoEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

/**
 * Neutrino needs a user id and an API key on every call, and its own docs allow
 * combining them in one header. Both live on the account, because `keyBuilder`
 * only generates accessors for account-level fields on an `api_key` account.
 */
export const neutrinoAuthConfig = {
	api_key: {
		account: ['user_id'] as const,
	},
} as const satisfies PluginAuthConfig;

const neutrinoEndpointMeta = {
	'ip.info': {
		riskLevel: 'read',
		description:
			'Geolocate one IPv4 or IPv6 address: country, city, region, time zone and currency',
	},
	'ip.blocklist': {
		riskLevel: 'read',
		description:
			'Check an address against the blocklists Neutrino tracks, with a flag per threat type and the sensors that matched',
	},
	'ip.probe': {
		riskLevel: 'read',
		description:
			'Identify the network and hosting provider behind an address and whether it is hosting rather than a consumer line',
	},
	'email.validate': {
		riskLevel: 'read',
		description:
			'Validate an address without contacting it: syntax, domain, MX, and flags for disposable, free and personal',
	},
	'email.verify': {
		riskLevel: 'read',
		description:
			'Validate an address and probe its mailbox over SMTP, reporting verified separately from valid',
	},
	'phone.validate': {
		riskLevel: 'read',
		description:
			'Parse a number into international and local forms with its location, carrier prefix and mobile flag',
	},
	'phone.hlrLookup': {
		riskLevel: 'read',
		description:
			'Query the home location register for whether a number is live, which network it is on now and whether it was ported',
	},
	'web.uaLookup': {
		riskLevel: 'read',
		description:
			'Parse a User-Agent string into browser, engine, OS and device fields',
	},
	'web.domainLookup': {
		riskLevel: 'read',
		description:
			'Read domain facts: subdomain and TLD, rank, and whether the blocklists know it for phishing, malware or spam',
	},
	'web.hostReputation': {
		riskLevel: 'read',
		description:
			'Check a host or IP against many DNSBLs, with one entry per list showing whether it listed the host',
	},
	'web.urlInfo': {
		riskLevel: 'read',
		description:
			'Inspect a URL: HTTP status, server location and host, load time, and the page body when asked',
	},
	'geocode.address': {
		riskLevel: 'read',
		description:
			'Forward geocode a full address or its parts, returning every location that matched',
	},
	'geocode.reverse': {
		riskLevel: 'read',
		description:
			'Reverse geocode a coordinate into a local address and a structured one with the same fields everywhere',
	},
	'commerce.binLookup': {
		riskLevel: 'read',
		description:
			'Read card facts from a BIN: brand, category, type, issuing country, and whether the calling IP matches that country',
	},
	'commerce.convert': {
		riskLevel: 'read',
		description:
			'Convert between currencies, units and number bases using the unit codes Neutrino publishes',
	},
	'messaging.smsVerify': {
		// Sends a real SMS and spends a credit, so it needs the approval a
		// destructive call gets (R8).
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Generate a security code and text it to a number, which sends a real SMS and costs a credit; check the code the person types with verifySecurityCode',
	},
	'messaging.phoneVerify': {
		// Places a real phone call and spends credits (R8).
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Call a number and read out a generated security code, which reaches a real person and costs credits; check the code with verifySecurityCode',
	},
	'messaging.verifySecurityCode': {
		riskLevel: 'read',
		description:
			'Check a code a person typed against the codes smsVerify and phoneVerify sent, optionally capping failed attempts per user',
	},
	'text.badWordFilter': {
		riskLevel: 'read',
		description:
			'Scan text or a page for profanity and return the words found and a censored copy',
	},
	'web.browserBot': {
		// Fetching a page is a read, but `exec` runs JavaScript on a third-party
		// site (clicks, form submits), which can change things there.
		riskLevel: 'write',
		description:
			'Load a page in a real browser, optionally run JavaScript on it (click, fill, submit), and return the rendered content and selected elements',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof neutrinoEndpointsNested>;

export type BaseNeutrinoPlugin<T extends NeutrinoPluginOptions> = CorsairPlugin<
	'neutrino',
	typeof NeutrinoSchema,
	typeof neutrinoEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof neutrinoAuthConfig
>;

export type InternalNeutrinoPlugin = BaseNeutrinoPlugin<NeutrinoPluginOptions>;

export type ExternalNeutrinoPlugin<T extends NeutrinoPluginOptions> =
	BaseNeutrinoPlugin<T>;

export function neutrino<const T extends NeutrinoPluginOptions>(
	incomingOptions: NeutrinoPluginOptions & T = {} as NeutrinoPluginOptions & T,
): ExternalNeutrinoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'neutrino',
		authConfig: neutrinoAuthConfig,
		schema: NeutrinoSchema,
		options: options,
		hooks: options.hooks,
		endpoints: neutrinoEndpointsNested,
		webhooks: {},
		endpointMeta: neutrinoEndpointMeta,
		endpointSchemas: neutrinoEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		// Neutrino needs the user id and the key together, so the key builder
		// returns them as the one `user-id:api-key` value the API-Key header
		// takes. Endpoints never read either half from options.
		keyBuilder: async (ctx: NeutrinoKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('neutrino', ctx.authType ?? 'api_key');
			}
			const apiKey =
				options.key ??
				(ctx.authType === 'api_key' ? await ctx.keys.get_api_key() : null);
			const userId =
				options.userId ??
				(ctx.authType === 'api_key' ? await ctx.keys.get_user_id() : null);
			if (!apiKey || !userId) {
				throw new AuthMissingError('neutrino', ctx.authType ?? 'api_key');
			}
			return `${userId}:${apiKey}`;
		},
	} satisfies InternalNeutrinoPlugin;
}

export { NeutrinoAPIError } from './client';

export type {
	BadWordFilterInput,
	BadWordFilterResponse,
	BinLookupInput,
	BinLookupResponse,
	BrowserBotInput,
	BrowserBotResponse,
	ConvertInput,
	ConvertResponse,
	DomainLookupInput,
	DomainLookupResponse,
	EmailInput,
	EmailValidateResponse,
	EmailVerifyResponse,
	GeocodeAddressInput,
	GeocodeAddressResponse,
	GeocodeReverseInput,
	GeocodeReverseResponse,
	HlrLookupResponse,
	HostReputationInput,
	HostReputationResponse,
	IpBlocklistInput,
	IpBlocklistResponse,
	IpInfoInput,
	IpInfoResponse,
	IpProbeInput,
	IpProbeResponse,
	NeutrinoEndpointInputs,
	NeutrinoEndpointOutputs,
	PhoneInput,
	PhoneValidateResponse,
	PhoneVerifyInput,
	PhoneVerifyResponse,
	SmsVerifyInput,
	SmsVerifyResponse,
	UaLookupInput,
	UaLookupResponse,
	UrlInfoInput,
	UrlInfoResponse,
	VerifySecurityCodeInput,
	VerifySecurityCodeResponse,
} from './endpoints/types';
