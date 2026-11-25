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
import { lobEndpointsNested } from './endpoints';
import type { LobEndpointInputs, LobEndpointOutputs } from './endpoints/types';
import {
	LobEndpointInputSchemas,
	LobEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { LobSchema } from './schema';

export type LobPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLobPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof lobEndpointsNested>;
};

export type LobContext = CorsairPluginContext<
	typeof LobSchema,
	LobPluginOptions
>;

export type LobKeyBuilderContext = KeyBuilderContext<LobPluginOptions>;

export type LobBoundEndpoints = BindEndpoints<typeof lobEndpointsNested>;

type LobEndpoint<K extends keyof LobEndpointOutputs> = CorsairEndpoint<
	LobContext,
	LobEndpointInputs[K],
	LobEndpointOutputs[K]
>;

export type LobEndpoints = {
	usVerificationsVerify: LobEndpoint<'usVerificationsVerify'>;
	usVerificationsBulk: LobEndpoint<'usVerificationsBulk'>;
	intlVerificationsVerify: LobEndpoint<'intlVerificationsVerify'>;
	autocompleteUsAutocomplete: LobEndpoint<'autocompleteUsAutocomplete'>;
	zipUsZipLookup: LobEndpoint<'zipUsZipLookup'>;
	addressesCreate: LobEndpoint<'addressesCreate'>;
	addressesGet: LobEndpoint<'addressesGet'>;
	addressesList: LobEndpoint<'addressesList'>;
	addressesDelete: LobEndpoint<'addressesDelete'>;
	postcardsSend: LobEndpoint<'postcardsSend'>;
	postcardsGet: LobEndpoint<'postcardsGet'>;
	lettersSend: LobEndpoint<'lettersSend'>;
	lettersGet: LobEndpoint<'lettersGet'>;
	accountGetBalance: LobEndpoint<'accountGetBalance'>;
};

export const lobEndpointSchemas = {
	'usVerifications.verify': {
		input: LobEndpointInputSchemas.usVerificationsVerify,
		output: LobEndpointOutputSchemas.usVerificationsVerify,
	},
	'usVerifications.bulk': {
		input: LobEndpointInputSchemas.usVerificationsBulk,
		output: LobEndpointOutputSchemas.usVerificationsBulk,
	},
	'intlVerifications.verify': {
		input: LobEndpointInputSchemas.intlVerificationsVerify,
		output: LobEndpointOutputSchemas.intlVerificationsVerify,
	},
	'autocomplete.usAutocomplete': {
		input: LobEndpointInputSchemas.autocompleteUsAutocomplete,
		output: LobEndpointOutputSchemas.autocompleteUsAutocomplete,
	},
	'zip.usZipLookup': {
		input: LobEndpointInputSchemas.zipUsZipLookup,
		output: LobEndpointOutputSchemas.zipUsZipLookup,
	},
	'addresses.create': {
		input: LobEndpointInputSchemas.addressesCreate,
		output: LobEndpointOutputSchemas.addressesCreate,
	},
	'addresses.get': {
		input: LobEndpointInputSchemas.addressesGet,
		output: LobEndpointOutputSchemas.addressesGet,
	},
	'addresses.list': {
		input: LobEndpointInputSchemas.addressesList,
		output: LobEndpointOutputSchemas.addressesList,
	},
	'addresses.delete': {
		input: LobEndpointInputSchemas.addressesDelete,
		output: LobEndpointOutputSchemas.addressesDelete,
	},
	'postcards.send': {
		input: LobEndpointInputSchemas.postcardsSend,
		output: LobEndpointOutputSchemas.postcardsSend,
	},
	'postcards.get': {
		input: LobEndpointInputSchemas.postcardsGet,
		output: LobEndpointOutputSchemas.postcardsGet,
	},
	'letters.send': {
		input: LobEndpointInputSchemas.lettersSend,
		output: LobEndpointOutputSchemas.lettersSend,
	},
	'letters.get': {
		input: LobEndpointInputSchemas.lettersGet,
		output: LobEndpointOutputSchemas.lettersGet,
	},
	'account.getBalance': {
		input: LobEndpointInputSchemas.accountGetBalance,
		output: LobEndpointOutputSchemas.accountGetBalance,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof lobEndpointsNested>;

const defaultAuthType = 'api_key' as const;

export const lobEndpointMeta = {
	'usVerifications.verify': {
		riskLevel: 'read',
		description:
			'Verify one US address with USPS data and get its deliverability, standardized components and confidence score',
	},
	'usVerifications.bulk': {
		riskLevel: 'read',
		description:
			'Verify up to 20 US addresses in one synchronous call; each row comes back as a verification or a per-row error',
	},
	'intlVerifications.verify': {
		riskLevel: 'read',
		description:
			'Verify one international address and get its deliverability, coverage level and parsed components',
	},
	'autocomplete.usAutocomplete': {
		riskLevel: 'read',
		description:
			'Complete a partial US address into up to 10 suggestion lines, optionally restricted to deliverable addresses',
	},
	'zip.usZipLookup': {
		riskLevel: 'read',
		description:
			'Look up a 5-digit US ZIP code and get its cities, county, FIPS code and default city',
	},
	'addresses.create': {
		riskLevel: 'write',
		description:
			'Create a US or international address in the Lob address book for reuse as a mail to or from address',
	},
	'addresses.get': {
		riskLevel: 'read',
		description: 'Read one address book entry by its adr_ ID',
	},
	'addresses.list': {
		riskLevel: 'read',
		description:
			'Page through the address book with before/after cursors, optional metadata and date filters',
	},
	'addresses.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete an address book entry. Lob marks it deleted and does not restore it',
	},
	'postcards.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Send a real postcard that Lob prints and mails. Each piece is billed and cannot be recalled once in production; pass an idempotency_key so a replay returns the original instead of mailing twice',
	},
	'postcards.get': {
		riskLevel: 'read',
		description:
			'Read one postcard by its psc_ ID, including print status and the signed PDF preview URL',
	},
	'letters.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Send a real letter that Lob prints, stuffs and mails. Each piece is billed and cannot be recalled once in production; pass an idempotency_key so a replay returns the original instead of mailing twice',
	},
	'letters.get': {
		riskLevel: 'read',
		description:
			'Read one letter by its ltr_ ID, including tracking number and events on certified or registered mail',
	},
	'account.getBalance': {
		riskLevel: 'read',
		description: "Read the account's current Lob Credits balance",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof lobEndpointsNested>;

export type BaseLobPlugin<T extends LobPluginOptions> = CorsairPlugin<
	'lob',
	typeof LobSchema,
	typeof lobEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalLobPlugin = BaseLobPlugin<LobPluginOptions>;

export type ExternalLobPlugin<T extends LobPluginOptions> = BaseLobPlugin<T>;

export function lob<const T extends LobPluginOptions>(
	incomingOptions: LobPluginOptions & T = {} as LobPluginOptions & T,
): ExternalLobPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'lob',
		schema: LobSchema,
		options: options,
		hooks: options.hooks,
		endpoints: lobEndpointsNested,
		webhooks: {},
		endpointMeta: lobEndpointMeta,
		endpointSchemas: lobEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: LobKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('lob', ctx.authType ?? 'api_key');
		},
	} satisfies InternalLobPlugin;
}

export { LobAPIError } from './client';

export type {
	IntlVerification,
	LobAddress,
	LobEndpointInputs,
	LobEndpointOutputs,
	UsVerification,
} from './endpoints/types';
