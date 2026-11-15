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
import { ignisignEndpointsNested } from './endpoints';
export { ignisignEndpointsNested };

import type {
	IgnisignEndpointInputs,
	IgnisignEndpointOutputs,
} from './endpoints/types';
import {
	IgnisignEndpointInputSchemas,
	IgnisignEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { IgnisignSchema } from './schema';

export type IgnisignPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalIgnisignPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ignisignEndpointsNested>;
};

export type IgnisignContext = CorsairPluginContext<
	typeof IgnisignSchema,
	IgnisignPluginOptions
>;

export type IgnisignKeyBuilderContext =
	KeyBuilderContext<IgnisignPluginOptions>;

export type IgnisignBoundEndpoints = BindEndpoints<
	typeof ignisignEndpointsNested
>;

export type IgnisignEndpoint<K extends keyof IgnisignEndpointOutputs> =
	CorsairEndpoint<
		IgnisignContext,
		IgnisignEndpointInputs[K],
		IgnisignEndpointOutputs[K]
	>;

export const ignisignEndpointSchemas = {
	'signatureRequests.createInOneCall': {
		input: IgnisignEndpointInputSchemas['signatureRequests.createInOneCall'],
		output: IgnisignEndpointOutputSchemas['signatureRequests.createInOneCall'],
	},
	'signatureRequests.init': {
		input: IgnisignEndpointInputSchemas['signatureRequests.init'],
		output: IgnisignEndpointOutputSchemas['signatureRequests.init'],
	},
	'signatureRequests.initSignerSetup': {
		input: IgnisignEndpointInputSchemas['signatureRequests.initSignerSetup'],
		output: IgnisignEndpointOutputSchemas['signatureRequests.initSignerSetup'],
	},
	'signatureRequests.list': {
		input: IgnisignEndpointInputSchemas['signatureRequests.list'],
		output: IgnisignEndpointOutputSchemas['signatureRequests.list'],
	},
	'signatureRequests.getContext': {
		input: IgnisignEndpointInputSchemas['signatureRequests.getContext'],
		output: IgnisignEndpointOutputSchemas['signatureRequests.getContext'],
	},
	'signatureRequests.update': {
		input: IgnisignEndpointInputSchemas['signatureRequests.update'],
		output: IgnisignEndpointOutputSchemas['signatureRequests.update'],
	},
	'signatureRequests.publish': {
		input: IgnisignEndpointInputSchemas['signatureRequests.publish'],
		output: IgnisignEndpointOutputSchemas['signatureRequests.publish'],
	},
	'signatureRequests.close': {
		input: IgnisignEndpointInputSchemas['signatureRequests.close'],
		output: IgnisignEndpointOutputSchemas['signatureRequests.close'],
	},
	'signatureRequests.getStatus': {
		input: IgnisignEndpointInputSchemas['signatureRequests.getStatus'],
		output: IgnisignEndpointOutputSchemas['signatureRequests.getStatus'],
	},

	'signers.create': {
		input: IgnisignEndpointInputSchemas['signers.create'],
		output: IgnisignEndpointOutputSchemas['signers.create'],
	},
	'signers.getDetails': {
		input: IgnisignEndpointInputSchemas['signers.getDetails'],
		output: IgnisignEndpointOutputSchemas['signers.getDetails'],
	},
	'signers.getSummary': {
		input: IgnisignEndpointInputSchemas['signers.getSummary'],
		output: IgnisignEndpointOutputSchemas['signers.getSummary'],
	},
	'signers.update': {
		input: IgnisignEndpointInputSchemas['signers.update'],
		output: IgnisignEndpointOutputSchemas['signers.update'],
	},
	'signers.revoke': {
		input: IgnisignEndpointInputSchemas['signers.revoke'],
		output: IgnisignEndpointOutputSchemas['signers.revoke'],
	},
	'signers.regenerateAuthSecret': {
		input: IgnisignEndpointInputSchemas['signers.regenerateAuthSecret'],
		output: IgnisignEndpointOutputSchemas['signers.regenerateAuthSecret'],
	},
	'signers.search': {
		input: IgnisignEndpointInputSchemas['signers.search'],
		output: IgnisignEndpointOutputSchemas['signers.search'],
	},
	'signers.list': {
		input: IgnisignEndpointInputSchemas['signers.list'],
		output: IgnisignEndpointOutputSchemas['signers.list'],
	},

	'documents.initialize': {
		input: IgnisignEndpointInputSchemas['documents.initialize'],
		output: IgnisignEndpointOutputSchemas['documents.initialize'],
	},
	'documents.get': {
		input: IgnisignEndpointInputSchemas['documents.get'],
		output: IgnisignEndpointOutputSchemas['documents.get'],
	},
	'documents.getContext': {
		input: IgnisignEndpointInputSchemas['documents.getContext'],
		output: IgnisignEndpointOutputSchemas['documents.getContext'],
	},
	'documents.update': {
		input: IgnisignEndpointInputSchemas['documents.update'],
		output: IgnisignEndpointOutputSchemas['documents.update'],
	},
	'documents.remove': {
		input: IgnisignEndpointInputSchemas['documents.remove'],
		output: IgnisignEndpointOutputSchemas['documents.remove'],
	},
	'documents.removeContent': {
		input: IgnisignEndpointInputSchemas['documents.removeContent'],
		output: IgnisignEndpointOutputSchemas['documents.removeContent'],
	},
	'documents.provideJsonContent': {
		input: IgnisignEndpointInputSchemas['documents.provideJsonContent'],
		output: IgnisignEndpointOutputSchemas['documents.provideJsonContent'],
	},
	'documents.providePrivateContent': {
		input: IgnisignEndpointInputSchemas['documents.providePrivateContent'],
		output: IgnisignEndpointOutputSchemas['documents.providePrivateContent'],
	},
	'documents.downloadOriginalDoc': {
		input: IgnisignEndpointInputSchemas['documents.downloadOriginalDoc'],
		output: IgnisignEndpointOutputSchemas['documents.downloadOriginalDoc'],
	},
	'documents.checkAuthenticity': {
		input: IgnisignEndpointInputSchemas['documents.checkAuthenticity'],
		output: IgnisignEndpointOutputSchemas['documents.checkAuthenticity'],
	},

	'signatures.list': {
		input: IgnisignEndpointInputSchemas['signatures.list'],
		output: IgnisignEndpointOutputSchemas['signatures.list'],
	},
	'signatures.get': {
		input: IgnisignEndpointInputSchemas['signatures.get'],
		output: IgnisignEndpointOutputSchemas['signatures.get'],
	},
	'signatures.getImages': {
		input: IgnisignEndpointInputSchemas['signatures.getImages'],
		output: IgnisignEndpointOutputSchemas['signatures.getImages'],
	},

	'proofs.downloadSignatureByType': {
		input: IgnisignEndpointInputSchemas['proofs.downloadSignatureByType'],
		output: IgnisignEndpointOutputSchemas['proofs.downloadSignatureByType'],
	},
	'proofs.downloadLowLevelSignatureProof': {
		input:
			IgnisignEndpointInputSchemas['proofs.downloadLowLevelSignatureProof'],
		output:
			IgnisignEndpointOutputSchemas['proofs.downloadLowLevelSignatureProof'],
	},

	'signerProfiles.list': {
		input: IgnisignEndpointInputSchemas['signerProfiles.list'],
		output: IgnisignEndpointOutputSchemas['signerProfiles.list'],
	},
	'signerProfiles.get': {
		input: IgnisignEndpointInputSchemas['signerProfiles.get'],
		output: IgnisignEndpointOutputSchemas['signerProfiles.get'],
	},
	'signerProfiles.getInputsNeeded': {
		input: IgnisignEndpointInputSchemas['signerProfiles.getInputsNeeded'],
		output: IgnisignEndpointOutputSchemas['signerProfiles.getInputsNeeded'],
	},

	'applications.getContext': {
		input: IgnisignEndpointInputSchemas['applications.getContext'],
		output: IgnisignEndpointOutputSchemas['applications.getContext'],
	},

	'seal.signM2M': {
		input: IgnisignEndpointInputSchemas['seal.signM2M'],
		output: IgnisignEndpointOutputSchemas['seal.signM2M'],
	},

	'logCapsules.create': {
		input: IgnisignEndpointInputSchemas['logCapsules.create'],
		output: IgnisignEndpointOutputSchemas['logCapsules.create'],
	},

	'bareSignatures.getConfiguration': {
		input: IgnisignEndpointInputSchemas['bareSignatures.getConfiguration'],
		output: IgnisignEndpointOutputSchemas['bareSignatures.getConfiguration'],
	},
	'bareSignatures.getProofToken': {
		input: IgnisignEndpointInputSchemas['bareSignatures.getProofToken'],
		output: IgnisignEndpointOutputSchemas['bareSignatures.getProofToken'],
	},
	'bareSignatures.getProofs': {
		input: IgnisignEndpointInputSchemas['bareSignatures.getProofs'],
		output: IgnisignEndpointOutputSchemas['bareSignatures.getProofs'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof ignisignEndpointsNested
>;

export const ignisignEndpointMeta = {
	'signatureRequests.createInOneCall': {
		riskLevel: 'write',
		description:
			'Create, configure and publish a signature request in a single call',
	},
	'signatureRequests.init': {
		riskLevel: 'write',
		description: 'Initialize a new empty signature request draft',
	},
	'signatureRequests.initSignerSetup': {
		riskLevel: 'write',
		description: 'Initialize a signer setup session',
	},
	'signatureRequests.list': {
		riskLevel: 'read',
		description: 'List signature requests for an application and environment',
	},
	'signatureRequests.getContext': {
		riskLevel: 'read',
		description: 'Get full context and details for a signature request',
	},
	'signatureRequests.update': {
		riskLevel: 'write',
		description: 'Update signature request settings, signers, and documents',
	},
	'signatureRequests.publish': {
		riskLevel: 'write',
		description: 'Publish and launch a signature request to begin signing',
	},
	'signatureRequests.close': {
		riskLevel: 'write',
		description: 'Close an active or expired signature request',
	},
	'signatureRequests.getStatus': {
		riskLevel: 'read',
		description: 'Get current status for multiple signature requests',
	},

	'signers.create': {
		riskLevel: 'write',
		description: 'Create a new signer in an application environment',
	},
	'signers.getDetails': {
		riskLevel: 'read',
		description:
			'Get detailed signer profile including verified claims and signature requests',
	},
	'signers.getSummary': {
		riskLevel: 'read',
		description: 'Get signer summary information',
	},
	'signers.update': {
		riskLevel: 'write',
		description: 'Update signer profile inputs and attributes',
	},
	'signers.revoke': {
		riskLevel: 'destructive',
		description: 'Revoke a signer and their active signature sessions',
	},
	'signers.regenerateAuthSecret': {
		riskLevel: 'write',
		description: 'Regenerate authentication secret for a signer',
	},
	'signers.search': {
		riskLevel: 'read',
		description: 'Search signers by name, email or external ID',
	},
	'signers.list': {
		riskLevel: 'read',
		description: 'List signers with pagination',
	},

	'documents.initialize': {
		riskLevel: 'write',
		description: 'Initialize a document descriptor for a signature request',
	},
	'documents.get': {
		riskLevel: 'read',
		description: 'Get document record and metadata by ID',
	},
	'documents.getContext': {
		riskLevel: 'read',
		description:
			'Get document context including signature summaries and statements',
	},
	'documents.update': {
		riskLevel: 'write',
		description: 'Update document metadata and display template settings',
	},
	'documents.remove': {
		riskLevel: 'destructive',
		description: 'Delete a document and its associated records',
	},
	'documents.removeContent': {
		riskLevel: 'destructive',
		description:
			'Remove document content while preserving the document descriptor',
	},
	'documents.provideJsonContent': {
		riskLevel: 'write',
		description: 'Provide structured JSON data content for a document',
	},
	'documents.providePrivateContent': {
		riskLevel: 'write',
		description:
			'Provide SHA-256 document hash for private client-side managed documents',
	},
	'documents.downloadOriginalDoc': {
		riskLevel: 'read',
		description: 'Download original document file as binary data',
	},
	'documents.checkAuthenticity': {
		riskLevel: 'read',
		description: 'Verify document authenticity and hash integrity',
	},

	'signatures.list': {
		riskLevel: 'read',
		description: 'List all signatures recorded on a document',
	},
	'signatures.get': {
		riskLevel: 'read',
		description: 'Get details of a specific signature on a document',
	},
	'signatures.getImages': {
		riskLevel: 'read',
		description: 'Get visual signature images associated with document signers',
	},

	'proofs.downloadSignatureByType': {
		riskLevel: 'read',
		description:
			'Download signature proof bundle by proof type (e.g. signed PDF or legal kit)',
	},
	'proofs.downloadLowLevelSignatureProof': {
		riskLevel: 'read',
		description:
			'Download cryptographic low-level proof file for a specific signer',
	},

	'signerProfiles.list': {
		riskLevel: 'read',
		description:
			'List signer profiles configured for an application environment',
	},
	'signerProfiles.get': {
		riskLevel: 'read',
		description: 'Get signer profile configuration by ID',
	},
	'signerProfiles.getInputsNeeded': {
		riskLevel: 'read',
		description:
			'Get required and optional input constraints for a signer profile',
	},

	'applications.getContext': {
		riskLevel: 'read',
		description:
			'Get application configuration, environments, and settings context',
	},

	'seal.signM2M': {
		riskLevel: 'write',
		description: 'Perform automated machine-to-machine (M2M) document sealing',
	},

	'logCapsules.create': {
		riskLevel: 'write',
		description:
			'Create a timestamped log capsule for tamper-proof data verification',
	},

	'bareSignatures.getConfiguration': {
		riskLevel: 'read',
		description:
			'Get bare signature application configuration and authorized origins',
	},
	'bareSignatures.getProofToken': {
		riskLevel: 'read',
		description:
			'Exchange authorization code for proof access token in bare signature flow',
	},
	'bareSignatures.getProofs': {
		riskLevel: 'read',
		description:
			'Fetch cryptographic proofs and signer claims using proof access token',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ignisignEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const ignisignAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseIgnisignPlugin<T extends IgnisignPluginOptions> = CorsairPlugin<
	'ignisign',
	typeof IgnisignSchema,
	typeof ignisignEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalIgnisignPlugin = BaseIgnisignPlugin<IgnisignPluginOptions>;

export type ExternalIgnisignPlugin<T extends IgnisignPluginOptions> =
	BaseIgnisignPlugin<T>;

export function ignisign<const T extends IgnisignPluginOptions>(
	incomingOptions: IgnisignPluginOptions & T = {} as IgnisignPluginOptions & T,
): ExternalIgnisignPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	const orderedErrorHandlers = {
		...callers,
		...builtIns,
		...callers,
		DEFAULT: callerDefault ?? builtInDefault,
	};

	return {
		id: 'ignisign',
		authConfig: ignisignAuthConfig,
		schema: IgnisignSchema,
		options,
		hooks: options.hooks,
		endpoints: ignisignEndpointsNested,
		webhooks: {},
		endpointMeta: ignisignEndpointMeta,
		endpointSchemas: ignisignEndpointSchemas,
		errorHandlers: orderedErrorHandlers,
		keyBuilder: async (ctx: IgnisignKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('ignisign', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('ignisign', 'api_key');
			return apiKey;
		},
	} satisfies InternalIgnisignPlugin;
}

export type {
	AppEnv,
	ApplicationContext,
	BareSignatureProof,
	BinaryData,
	Document,
	DocumentContext,
	IgnisignEndpointInputs,
	IgnisignEndpointOutputs,
	PaginationData,
	Signature,
	SignatureImages,
	SignatureLowLevelProofType,
	SignatureProofType,
	SignatureRequest,
	SignatureRequestContext,
	SignatureRequestPublishResponse,
	SignatureRequestsPaginate,
	SignatureRequestsStatusContainer,
	SignerContext,
	SignerCreationResponse,
	SignerProfile,
	SignerSummary,
	SignersSearchResult,
} from './endpoints/types';
