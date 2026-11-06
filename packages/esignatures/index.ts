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
import { Contracts, Templates } from './endpoints';
import type {
	ESignaturesEndpointInputs,
	ESignaturesEndpointOutputs,
} from './endpoints/types';
import {
	ESignaturesEndpointInputSchemas,
	ESignaturesEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { ESignaturesSchema } from './schema';

export type ESignaturesPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalESignaturesPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof eSignaturesEndpointsNested>;
};

export type ESignaturesContext = CorsairPluginContext<
	typeof ESignaturesSchema,
	ESignaturesPluginOptions
>;

export type ESignaturesKeyBuilderContext =
	KeyBuilderContext<ESignaturesPluginOptions>;

export type ESignaturesBoundEndpoints = BindEndpoints<
	typeof eSignaturesEndpointsNested
>;

type ESignaturesEndpoint<K extends keyof ESignaturesEndpointOutputs> =
	CorsairEndpoint<
		ESignaturesContext,
		ESignaturesEndpointInputs[K],
		ESignaturesEndpointOutputs[K]
	>;

export type ESignaturesEndpoints = {
	contractsCreate: ESignaturesEndpoint<'contractsCreate'>;
	contractsGet: ESignaturesEndpoint<'contractsGet'>;
	contractsWithdraw: ESignaturesEndpoint<'contractsWithdraw'>;
	contractsSendDraft: ESignaturesEndpoint<'contractsSendDraft'>;
	contractsAddSigner: ESignaturesEndpoint<'contractsAddSigner'>;
	contractsUpdateSigner: ESignaturesEndpoint<'contractsUpdateSigner'>;
	contractsResendToSigner: ESignaturesEndpoint<'contractsResendToSigner'>;
	contractsDeleteSigner: ESignaturesEndpoint<'contractsDeleteSigner'>;
	templatesList: ESignaturesEndpoint<'templatesList'>;
	templatesGet: ESignaturesEndpoint<'templatesGet'>;
	templatesCreate: ESignaturesEndpoint<'templatesCreate'>;
	templatesDelete: ESignaturesEndpoint<'templatesDelete'>;
};

const eSignaturesEndpointsNested = {
	contracts: {
		create: Contracts.create,
		get: Contracts.get,
		withdraw: Contracts.withdraw,
		sendDraft: Contracts.sendDraft,
		addSigner: Contracts.addSigner,
		updateSigner: Contracts.updateSigner,
		resendToSigner: Contracts.resendToSigner,
		deleteSigner: Contracts.deleteSigner,
	},
	templates: {
		list: Templates.list,
		get: Templates.get,
		create: Templates.create,
		delete: Templates.deleteTemplate,
	},
} as const;

export const eSignaturesEndpointSchemas = {
	'contracts.create': {
		input: ESignaturesEndpointInputSchemas.contractsCreate,
		output: ESignaturesEndpointOutputSchemas.contractsCreate,
	},
	'contracts.get': {
		input: ESignaturesEndpointInputSchemas.contractsGet,
		output: ESignaturesEndpointOutputSchemas.contractsGet,
	},
	'contracts.withdraw': {
		input: ESignaturesEndpointInputSchemas.contractsWithdraw,
		output: ESignaturesEndpointOutputSchemas.contractsWithdraw,
	},
	'contracts.sendDraft': {
		input: ESignaturesEndpointInputSchemas.contractsSendDraft,
		output: ESignaturesEndpointOutputSchemas.contractsSendDraft,
	},
	'contracts.addSigner': {
		input: ESignaturesEndpointInputSchemas.contractsAddSigner,
		output: ESignaturesEndpointOutputSchemas.contractsAddSigner,
	},
	'contracts.updateSigner': {
		input: ESignaturesEndpointInputSchemas.contractsUpdateSigner,
		output: ESignaturesEndpointOutputSchemas.contractsUpdateSigner,
	},
	'contracts.resendToSigner': {
		input: ESignaturesEndpointInputSchemas.contractsResendToSigner,
		output: ESignaturesEndpointOutputSchemas.contractsResendToSigner,
	},
	'contracts.deleteSigner': {
		input: ESignaturesEndpointInputSchemas.contractsDeleteSigner,
		output: ESignaturesEndpointOutputSchemas.contractsDeleteSigner,
	},
	'templates.list': {
		input: ESignaturesEndpointInputSchemas.templatesList,
		output: ESignaturesEndpointOutputSchemas.templatesList,
	},
	'templates.get': {
		input: ESignaturesEndpointInputSchemas.templatesGet,
		output: ESignaturesEndpointOutputSchemas.templatesGet,
	},
	'templates.create': {
		input: ESignaturesEndpointInputSchemas.templatesCreate,
		output: ESignaturesEndpointOutputSchemas.templatesCreate,
	},
	'templates.delete': {
		input: ESignaturesEndpointInputSchemas.templatesDelete,
		output: ESignaturesEndpointOutputSchemas.templatesDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof eSignaturesEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const eSignaturesEndpointMeta = {
	'contracts.create': {
		riskLevel: 'write',
		description:
			'Create and send a contract from a template, filling placeholder fields; set save_as_draft to create without sending',
	},
	'contracts.get': {
		riskLevel: 'read',
		description:
			"Read a contract's status, signers, labels and, once signed, an expiring PDF URL; contracts older than two weeks may return incomplete data",
	},
	'contracts.withdraw': {
		riskLevel: 'destructive',
		description:
			'Withdraw a sent contract so it can no longer be signed; signed contracts cannot be withdrawn',
	},
	'contracts.sendDraft': {
		riskLevel: 'write',
		description: 'Send a draft contract to its signers',
	},
	'contracts.addSigner': {
		riskLevel: 'write',
		description:
			'Add a signer to a contract without sending a sign request; use contracts.resendToSigner to send one',
	},
	'contracts.updateSigner': {
		riskLevel: 'write',
		description: "Update a signer's contact details or signing settings",
	},
	'contracts.resendToSigner': {
		riskLevel: 'write',
		description: 'Send or resend the sign request to one signer',
	},
	'contracts.deleteSigner': {
		riskLevel: 'destructive',
		description: 'Remove a signer from a contract',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List the templates with their IDs and titles',
	},
	'templates.get': {
		riskLevel: 'read',
		description:
			"Read a template's title, creation time, placeholder fields and signer field IDs",
	},
	'templates.create': {
		riskLevel: 'write',
		description: 'Create a template from markdown with placeholder fields',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a template',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof eSignaturesEndpointsNested
>;

export type BaseESignaturesPlugin<T extends ESignaturesPluginOptions> =
	CorsairPlugin<
		'esignatures',
		typeof ESignaturesSchema,
		typeof eSignaturesEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalESignaturesPlugin =
	BaseESignaturesPlugin<ESignaturesPluginOptions>;

export type ExternalESignaturesPlugin<T extends ESignaturesPluginOptions> =
	BaseESignaturesPlugin<T>;

export function esignatures<const T extends ESignaturesPluginOptions>(
	incomingOptions: ESignaturesPluginOptions &
		T = {} as ESignaturesPluginOptions & T,
): ExternalESignaturesPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'esignatures',
		schema: ESignaturesSchema,
		options: options,
		hooks: options.hooks,
		endpoints: eSignaturesEndpointsNested,
		webhooks: {},
		endpointMeta: eSignaturesEndpointMeta,
		endpointSchemas: eSignaturesEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: ESignaturesKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('esignatures', ctx.authType ?? 'api_key');
		},
	} satisfies InternalESignaturesPlugin;
}

export { ESignaturesAPIError } from './client';

export type {
	ContractActionInput,
	ContractsAddSignerInput,
	ContractsAddSignerResponse,
	ContractsCreateInput,
	ContractsCreateResponse,
	ContractsGetInput,
	ContractsGetResponse,
	ContractsSendDraftResponse,
	ContractsUpdateSignerInput,
	ContractsUpdateSignerResponse,
	ContractsWithdrawResponse,
	ESignaturesContract,
	ESignaturesEndpointInputs,
	ESignaturesEndpointOutputs,
	SignerActionInput,
	SignerActionResponse,
	TemplatesCreateInput,
	TemplatesCreateResponse,
	TemplatesDeleteResponse,
	TemplatesGetInput,
	TemplatesGetResponse,
	TemplatesListResponse,
} from './endpoints/types';
