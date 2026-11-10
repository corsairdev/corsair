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
import { Campaigns, ReceiptValidation, Simple, Verbose } from './endpoints';
import type {
	TaggunEndpointInputs,
	TaggunEndpointOutputs,
} from './endpoints/types';
import {
	TaggunEndpointInputSchemas,
	TaggunEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { TaggunSchema } from './schema';

export type TaggunPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTaggunPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof taggunEndpointsNested>;
};

export type TaggunContext = CorsairPluginContext<
	typeof TaggunSchema,
	TaggunPluginOptions
>;

export type TaggunKeyBuilderContext = KeyBuilderContext<TaggunPluginOptions>;

export type TaggunBoundEndpoints = BindEndpoints<typeof taggunEndpointsNested>;

type TaggunEndpoint<K extends keyof TaggunEndpointOutputs> = CorsairEndpoint<
	TaggunContext,
	TaggunEndpointInputs[K],
	TaggunEndpointOutputs[K]
>;

export type TaggunEndpoints = {
	simpleUrl: TaggunEndpoint<'simpleUrl'>;
	simpleEncoded: TaggunEndpoint<'simpleEncoded'>;
	simpleFile: TaggunEndpoint<'simpleFile'>;
	verboseUrl: TaggunEndpoint<'verboseUrl'>;
	verboseEncoded: TaggunEndpoint<'verboseEncoded'>;
	verboseFile: TaggunEndpoint<'verboseFile'>;
	campaignsList: TaggunEndpoint<'campaignsList'>;
	campaignsGet: TaggunEndpoint<'campaignsGet'>;
	campaignsCreate: TaggunEndpoint<'campaignsCreate'>;
	campaignsUpdate: TaggunEndpoint<'campaignsUpdate'>;
	campaignsDelete: TaggunEndpoint<'campaignsDelete'>;
	campaignsValidateFile: TaggunEndpoint<'campaignsValidateFile'>;
	campaignsValidateUrl: TaggunEndpoint<'campaignsValidateUrl'>;
	receiptValidateFile: TaggunEndpoint<'receiptValidateFile'>;
	receiptValidateUrl: TaggunEndpoint<'receiptValidateUrl'>;
};

const taggunEndpointsNested = {
	simple: {
		url: Simple.url,
		encoded: Simple.encoded,
		file: Simple.file,
	},
	verbose: {
		url: Verbose.url,
		encoded: Verbose.encoded,
		file: Verbose.file,
	},
	campaigns: {
		list: Campaigns.list,
		get: Campaigns.get,
		create: Campaigns.create,
		update: Campaigns.update,
		delete: Campaigns.remove,
		validateFile: Campaigns.validateFile,
		validateUrl: Campaigns.validateUrl,
	},
	receiptValidation: {
		file: ReceiptValidation.file,
		url: ReceiptValidation.url,
	},
} as const;

export const taggunEndpointSchemas = {
	'simple.url': {
		input: TaggunEndpointInputSchemas.simpleUrl,
		output: TaggunEndpointOutputSchemas.simpleUrl,
	},
	'simple.encoded': {
		input: TaggunEndpointInputSchemas.simpleEncoded,
		output: TaggunEndpointOutputSchemas.simpleEncoded,
	},
	'simple.file': {
		input: TaggunEndpointInputSchemas.simpleFile,
		output: TaggunEndpointOutputSchemas.simpleFile,
	},
	'verbose.url': {
		input: TaggunEndpointInputSchemas.verboseUrl,
		output: TaggunEndpointOutputSchemas.verboseUrl,
	},
	'verbose.encoded': {
		input: TaggunEndpointInputSchemas.verboseEncoded,
		output: TaggunEndpointOutputSchemas.verboseEncoded,
	},
	'verbose.file': {
		input: TaggunEndpointInputSchemas.verboseFile,
		output: TaggunEndpointOutputSchemas.verboseFile,
	},
	'campaigns.list': {
		input: TaggunEndpointInputSchemas.campaignsList,
		output: TaggunEndpointOutputSchemas.campaignsList,
	},
	'campaigns.get': {
		input: TaggunEndpointInputSchemas.campaignsGet,
		output: TaggunEndpointOutputSchemas.campaignsGet,
	},
	'campaigns.create': {
		input: TaggunEndpointInputSchemas.campaignsCreate,
		output: TaggunEndpointOutputSchemas.campaignsCreate,
	},
	'campaigns.update': {
		input: TaggunEndpointInputSchemas.campaignsUpdate,
		output: TaggunEndpointOutputSchemas.campaignsUpdate,
	},
	'campaigns.delete': {
		input: TaggunEndpointInputSchemas.campaignsDelete,
		output: TaggunEndpointOutputSchemas.campaignsDelete,
	},
	'campaigns.validateFile': {
		input: TaggunEndpointInputSchemas.campaignsValidateFile,
		output: TaggunEndpointOutputSchemas.campaignsValidateFile,
	},
	'campaigns.validateUrl': {
		input: TaggunEndpointInputSchemas.campaignsValidateUrl,
		output: TaggunEndpointOutputSchemas.campaignsValidateUrl,
	},
	'receiptValidation.file': {
		input: TaggunEndpointInputSchemas.receiptValidateFile,
		output: TaggunEndpointOutputSchemas.receiptValidateFile,
	},
	'receiptValidation.url': {
		input: TaggunEndpointInputSchemas.receiptValidateUrl,
		output: TaggunEndpointOutputSchemas.receiptValidateUrl,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof taggunEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const taggunEndpointMeta = {
	'simple.url': {
		riskLevel: 'write',
		description:
			'Scan a receipt at an HTTPS URL and return the four core fields with confidence levels; each call is one billable scan and the receipt is stored unless `incognito` is set',
	},
	'simple.encoded': {
		riskLevel: 'write',
		description:
			'Scan a base64-encoded receipt or invoice and return the four core fields; each call is one billable scan',
	},
	'simple.file': {
		riskLevel: 'write',
		description:
			'Scan an uploaded receipt or invoice file and return the four core fields; each call is one billable scan',
	},
	'verbose.url': {
		riskLevel: 'write',
		description:
			'Scan a receipt at an HTTPS URL and return the full extraction: line items, text, helper arrays, per-field confidence and enabled feature blocks',
	},
	'verbose.encoded': {
		riskLevel: 'write',
		description:
			'Scan a base64-encoded receipt or invoice and return the full extraction, including product line items unless `extractLineItems` is false',
	},
	'verbose.file': {
		riskLevel: 'write',
		description:
			'Scan an uploaded receipt or invoice file and return the full extraction, including product line items unless `extractLineItems` is false',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description:
			'List the campaign IDs that have validation settings stored on the account; needs the Campaign Validation feature',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description:
			"Read one campaign's stored validation rules; sections with no rules may be omitted from the answer",
	},
	'campaigns.create': {
		riskLevel: 'write',
		description:
			'Store a new set of validation rules under a campaign ID you choose; rejected if that ID already exists',
	},
	'campaigns.update': {
		// A replace-all: every section left out is removed, and Taggun keeps no
		// earlier version to restore from, as with other plugins' replace-all
		// calls. The description says how to keep the rules that should stay.
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Replace a campaign's stored validation rules wholesale: every section left out is removed, so re-send the response from `campaigns.get` with your changes",
	},
	'campaigns.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Remove a campaign's validation rules permanently; later submissions against that campaign cannot evaluate them",
	},
	'campaigns.validateFile': {
		riskLevel: 'write',
		description:
			"Check an uploaded receipt against a campaign's stored rules and return pass/fail per rule; a failed rule is a successful call reporting `successful: false`",
	},
	'campaigns.validateUrl': {
		riskLevel: 'write',
		description:
			"Check a receipt at an HTTPS URL against a campaign's stored rules; a failed rule is a successful call reporting `successful: false`",
	},
	'receiptValidation.file': {
		riskLevel: 'write',
		description:
			'Check an uploaded receipt against rules sent with this request, storing nothing; a failed rule is a successful call reporting `successful: false`',
	},
	'receiptValidation.url': {
		riskLevel: 'write',
		description:
			'Check a receipt at an HTTPS URL against rules sent with this request, storing nothing; a failed rule is a successful call reporting `successful: false`',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof taggunEndpointsNested>;

export type BaseTaggunPlugin<T extends TaggunPluginOptions> = CorsairPlugin<
	'taggun',
	typeof TaggunSchema,
	typeof taggunEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalTaggunPlugin = BaseTaggunPlugin<TaggunPluginOptions>;

export type ExternalTaggunPlugin<T extends TaggunPluginOptions> =
	BaseTaggunPlugin<T>;

export function taggun<const T extends TaggunPluginOptions>(
	incomingOptions: TaggunPluginOptions & T = {} as TaggunPluginOptions & T,
): ExternalTaggunPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'taggun',
		schema: TaggunSchema,
		options: options,
		hooks: options.hooks,
		endpoints: taggunEndpointsNested,
		// Taggun is synchronous by design: no webhooks, callbacks or jobs.
		webhooks: {},
		endpointMeta: taggunEndpointMeta,
		endpointSchemas: taggunEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TaggunKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('taggun', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTaggunPlugin;
}

export { TaggunAPIError } from './client';

export type {
	CampaignsCreateInput,
	CampaignsCreateResponse,
	CampaignsDeleteInput,
	CampaignsDeleteResponse,
	CampaignsGetInput,
	CampaignsGetResponse,
	CampaignsListInput,
	CampaignsListResponse,
	CampaignsUpdateInput,
	CampaignsUpdateResponse,
	CampaignValidateFileInput,
	CampaignValidateFileResponse,
	CampaignValidateUrlInput,
	CampaignValidateUrlResponse,
	InlineValidationRules,
	ReceiptValidateFileInput,
	ReceiptValidateFileResponse,
	ReceiptValidateUrlInput,
	ReceiptValidateUrlResponse,
	SimpleEncodedInput,
	SimpleEncodedResponse,
	SimpleFileInput,
	SimpleFileResponse,
	SimpleReceiptSchema,
	SimpleUrlInput,
	SimpleUrlResponse,
	TaggunEndpointInputs,
	TaggunEndpointOutputs,
	ValidationResult,
	VerboseEncodedInput,
	VerboseEncodedResponse,
	VerboseFileInput,
	VerboseFileResponse,
	VerboseReceiptSchema,
	VerboseUrlInput,
	VerboseUrlResponse,
} from './endpoints/types';
