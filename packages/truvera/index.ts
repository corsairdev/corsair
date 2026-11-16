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
import {
	CredentialsEndpoints,
	DidsEndpoints,
	JobsEndpoints,
	ProfilesEndpoints,
	RegistriesEndpoints,
	SchemasEndpoints,
	VerifyEndpoints,
} from './endpoints';
import type {
	TruveraEndpointInputs,
	TruveraEndpointOutputs,
} from './endpoints/types';
import {
	TruveraEndpointInputSchemas,
	TruveraEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { TruveraSchema } from './schema';

export type TruveraPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTruveraPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof truveraEndpointsNested>;
	/**
	 * Send requests to the sandbox host, https://api-testnet.truvera.io, which
	 * uses test data. Test-mode API keys only work there.
	 */
	sandbox?: boolean;
};

export type TruveraContext = CorsairPluginContext<
	typeof TruveraSchema,
	TruveraPluginOptions
>;

export type TruveraKeyBuilderContext = KeyBuilderContext<TruveraPluginOptions>;

export type TruveraBoundEndpoints = BindEndpoints<
	typeof truveraEndpointsNested
>;

type TruveraEndpoint<K extends keyof TruveraEndpointOutputs> = CorsairEndpoint<
	TruveraContext,
	TruveraEndpointInputs[K],
	TruveraEndpointOutputs[K]
>;

export type TruveraEndpoints = {
	didsList: TruveraEndpoint<'listDids'>;
	didsCreate: TruveraEndpoint<'createDid'>;
	didsGet: TruveraEndpoint<'getDid'>;
	didsMetadata: TruveraEndpoint<'getDidMetadata'>;
	didsDelete: TruveraEndpoint<'deleteDid'>;
	profilesList: TruveraEndpoint<'listProfiles'>;
	profilesCreate: TruveraEndpoint<'createProfile'>;
	profilesGet: TruveraEndpoint<'getProfile'>;
	profilesUpdate: TruveraEndpoint<'updateProfile'>;
	profilesDelete: TruveraEndpoint<'deleteProfile'>;
	credentialsIssue: TruveraEndpoint<'issueCredential'>;
	credentialsList: TruveraEndpoint<'listCredentials'>;
	credentialsGet: TruveraEndpoint<'getCredential'>;
	credentialsDelete: TruveraEndpoint<'deleteCredential'>;
	credentialsRevoke: TruveraEndpoint<'revokeCredential'>;
	credentialsUnrevoke: TruveraEndpoint<'unrevokeCredential'>;
	schemasCreate: TruveraEndpoint<'createSchema'>;
	schemasList: TruveraEndpoint<'listSchemas'>;
	schemasGet: TruveraEndpoint<'getSchema'>;
	schemasDelete: TruveraEndpoint<'deleteSchema'>;
	registriesCreate: TruveraEndpoint<'createRegistry'>;
	registriesList: TruveraEndpoint<'listRegistries'>;
	registriesGet: TruveraEndpoint<'getRegistry'>;
	registriesDelete: TruveraEndpoint<'deleteRegistry'>;
	registriesRevoke: TruveraEndpoint<'revokeInRegistry'>;
	registriesRevocationStatus: TruveraEndpoint<'getRevocationStatus'>;
	verify: TruveraEndpoint<'verify'>;
	jobsGet: TruveraEndpoint<'getJob'>;
};

const truveraEndpointsNested = {
	dids: {
		list: DidsEndpoints.list,
		create: DidsEndpoints.create,
		get: DidsEndpoints.get,
		getMetadata: DidsEndpoints.getMetadata,
		delete: DidsEndpoints.delete,
	},
	profiles: {
		list: ProfilesEndpoints.list,
		create: ProfilesEndpoints.create,
		get: ProfilesEndpoints.get,
		update: ProfilesEndpoints.update,
		delete: ProfilesEndpoints.delete,
	},
	credentials: {
		issue: CredentialsEndpoints.issue,
		list: CredentialsEndpoints.list,
		get: CredentialsEndpoints.get,
		delete: CredentialsEndpoints.delete,
		revoke: CredentialsEndpoints.revoke,
		unrevoke: CredentialsEndpoints.unrevoke,
	},
	schemas: {
		create: SchemasEndpoints.create,
		list: SchemasEndpoints.list,
		get: SchemasEndpoints.get,
		delete: SchemasEndpoints.delete,
	},
	registries: {
		create: RegistriesEndpoints.create,
		list: RegistriesEndpoints.list,
		get: RegistriesEndpoints.get,
		delete: RegistriesEndpoints.delete,
		revoke: RegistriesEndpoints.revoke,
		revocationStatus: RegistriesEndpoints.revocationStatus,
	},
	verify: {
		verify: VerifyEndpoints.verify,
	},
	jobs: {
		get: JobsEndpoints.get,
	},
} as const;

export const truveraEndpointSchemas = {
	'dids.list': {
		input: TruveraEndpointInputSchemas.listDids,
		output: TruveraEndpointOutputSchemas.listDids,
	},
	'dids.create': {
		input: TruveraEndpointInputSchemas.createDid,
		output: TruveraEndpointOutputSchemas.createDid,
	},
	'dids.get': {
		input: TruveraEndpointInputSchemas.getDid,
		output: TruveraEndpointOutputSchemas.getDid,
	},
	'dids.getMetadata': {
		input: TruveraEndpointInputSchemas.getDidMetadata,
		output: TruveraEndpointOutputSchemas.getDidMetadata,
	},
	'dids.delete': {
		input: TruveraEndpointInputSchemas.deleteDid,
		output: TruveraEndpointOutputSchemas.deleteDid,
	},
	'profiles.list': {
		input: TruveraEndpointInputSchemas.listProfiles,
		output: TruveraEndpointOutputSchemas.listProfiles,
	},
	'profiles.create': {
		input: TruveraEndpointInputSchemas.createProfile,
		output: TruveraEndpointOutputSchemas.createProfile,
	},
	'profiles.get': {
		input: TruveraEndpointInputSchemas.getProfile,
		output: TruveraEndpointOutputSchemas.getProfile,
	},
	'profiles.update': {
		input: TruveraEndpointInputSchemas.updateProfile,
		output: TruveraEndpointOutputSchemas.updateProfile,
	},
	'profiles.delete': {
		input: TruveraEndpointInputSchemas.deleteProfile,
		output: TruveraEndpointOutputSchemas.deleteProfile,
	},
	'credentials.issue': {
		input: TruveraEndpointInputSchemas.issueCredential,
		output: TruveraEndpointOutputSchemas.issueCredential,
	},
	'credentials.list': {
		input: TruveraEndpointInputSchemas.listCredentials,
		output: TruveraEndpointOutputSchemas.listCredentials,
	},
	'credentials.get': {
		input: TruveraEndpointInputSchemas.getCredential,
		output: TruveraEndpointOutputSchemas.getCredential,
	},
	'credentials.delete': {
		input: TruveraEndpointInputSchemas.deleteCredential,
		output: TruveraEndpointOutputSchemas.deleteCredential,
	},
	'credentials.revoke': {
		input: TruveraEndpointInputSchemas.revokeCredential,
		output: TruveraEndpointOutputSchemas.revokeCredential,
	},
	'credentials.unrevoke': {
		input: TruveraEndpointInputSchemas.unrevokeCredential,
		output: TruveraEndpointOutputSchemas.unrevokeCredential,
	},
	'schemas.create': {
		input: TruveraEndpointInputSchemas.createSchema,
		output: TruveraEndpointOutputSchemas.createSchema,
	},
	'schemas.list': {
		input: TruveraEndpointInputSchemas.listSchemas,
		output: TruveraEndpointOutputSchemas.listSchemas,
	},
	'schemas.get': {
		input: TruveraEndpointInputSchemas.getSchema,
		output: TruveraEndpointOutputSchemas.getSchema,
	},
	'schemas.delete': {
		input: TruveraEndpointInputSchemas.deleteSchema,
		output: TruveraEndpointOutputSchemas.deleteSchema,
	},
	'registries.create': {
		input: TruveraEndpointInputSchemas.createRegistry,
		output: TruveraEndpointOutputSchemas.createRegistry,
	},
	'registries.list': {
		input: TruveraEndpointInputSchemas.listRegistries,
		output: TruveraEndpointOutputSchemas.listRegistries,
	},
	'registries.get': {
		input: TruveraEndpointInputSchemas.getRegistry,
		output: TruveraEndpointOutputSchemas.getRegistry,
	},
	'registries.delete': {
		input: TruveraEndpointInputSchemas.deleteRegistry,
		output: TruveraEndpointOutputSchemas.deleteRegistry,
	},
	'registries.revoke': {
		input: TruveraEndpointInputSchemas.revokeInRegistry,
		output: TruveraEndpointOutputSchemas.revokeInRegistry,
	},
	'registries.revocationStatus': {
		input: TruveraEndpointInputSchemas.getRevocationStatus,
		output: TruveraEndpointOutputSchemas.getRevocationStatus,
	},
	'verify.verify': {
		input: TruveraEndpointInputSchemas.verify,
		output: TruveraEndpointOutputSchemas.verify,
	},
	'jobs.get': {
		input: TruveraEndpointInputSchemas.getJob,
		output: TruveraEndpointOutputSchemas.getJob,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof truveraEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const truveraEndpointMeta = {
	'dids.list': {
		riskLevel: 'read',
		description: 'List the DIDs the account controls',
	},
	'dids.create': {
		riskLevel: 'write',
		description:
			'Create a DID with its keys, optionally with a DIDComm service endpoint',
	},
	'dids.get': {
		riskLevel: 'read',
		description: 'Resolve one DID and read its document',
	},
	'dids.getMetadata': {
		riskLevel: 'read',
		description:
			'Read one DID resolution metadata: controller, versions and deactivation',
	},
	'dids.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a DID and its keys; credentials signed with it can no longer be verified against it',
	},
	'profiles.list': {
		riskLevel: 'read',
		description: 'List the issuer profiles on the account',
	},
	'profiles.create': {
		riskLevel: 'write',
		description: 'Create a profile for a DID the account controls',
	},
	'profiles.get': {
		riskLevel: 'read',
		description: 'Read one profile by its DID',
	},
	'profiles.update': {
		riskLevel: 'write',
		description:
			"Change a profile's name, description, logo or contact details",
	},
	'profiles.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a profile; the DID itself remains',
	},
	'credentials.issue': {
		riskLevel: 'destructive',
		description:
			'Issue and sign a verifiable credential, optionally distributing it to a holder, persisting it, or making it revocable',
	},
	'credentials.list': {
		riskLevel: 'read',
		description:
			'List the credential metadata on the account, with offset paging',
	},
	'credentials.get': {
		riskLevel: 'read',
		description:
			'Read one credential metadata, and its contents when it was persisted',
	},
	'credentials.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a credential metadata record; this does not revoke the credential',
	},
	'credentials.revoke': {
		riskLevel: 'destructive',
		description:
			'Revoke a credential, which makes every verification of it fail',
	},
	'credentials.unrevoke': {
		riskLevel: 'destructive',
		description: 'Unrevoke a credential, which restores it as valid',
	},
	'schemas.create': {
		riskLevel: 'write',
		description:
			'Create a JSON credential schema that a credential type and subject follow',
	},
	'schemas.list': {
		riskLevel: 'read',
		description: 'List the credential schemas on the account',
	},
	'schemas.get': {
		riskLevel: 'read',
		description: 'Read one schema by its id',
	},
	'schemas.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a schema; credentials already issued against it stay valid',
	},
	'registries.create': {
		riskLevel: 'write',
		description: 'Create a revocation registry',
	},
	'registries.list': {
		riskLevel: 'read',
		description: 'List the revocation registries on the account',
	},
	'registries.get': {
		riskLevel: 'read',
		description: 'Read one revocation registry',
	},
	'registries.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a revocation registry, which removes every credential status it held',
	},
	'registries.revoke': {
		riskLevel: 'destructive',
		description:
			'Revoke or unrevoke several credentials in one registry in one call',
	},
	'registries.revocationStatus': {
		riskLevel: 'read',
		description: 'Read whether one credential in a registry is revoked',
	},
	'verify.verify': {
		riskLevel: 'read',
		description:
			'Verify a credential or presentation and read the reasons when it fails',
	},
	'jobs.get': {
		riskLevel: 'read',
		description:
			'Read an async job that issuance or a registry write returned instead of a finished resource',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof truveraEndpointsNested>;

export type BaseTruveraPlugin<T extends TruveraPluginOptions> = CorsairPlugin<
	'truvera',
	typeof TruveraSchema,
	typeof truveraEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalTruveraPlugin = BaseTruveraPlugin<TruveraPluginOptions>;

export type ExternalTruveraPlugin<T extends TruveraPluginOptions> =
	BaseTruveraPlugin<T>;

export function truvera<const T extends TruveraPluginOptions>(
	incomingOptions: TruveraPluginOptions & T = {} as TruveraPluginOptions & T,
): ExternalTruveraPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'truvera',
		schema: TruveraSchema,
		options: options,
		hooks: options.hooks,
		endpoints: truveraEndpointsNested,
		webhooks: {},
		endpointMeta: truveraEndpointMeta,
		endpointSchemas: truveraEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TruveraKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('truvera', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTruveraPlugin;
}

export type { TruveraErrorDetails } from './client';
export {
	describeTruveraError,
	TRUVERA_API_BASE,
	TRUVERA_SANDBOX_API_BASE,
	truveraErrorDetails,
} from './client';
export type {
	CreateDidInput,
	CreateRegistryInput,
	CreateSchemaInput,
	CredentialMetadataOutput,
	DidDocumentOutput,
	IssueCredentialInput,
	JobOutput,
	ProfileOutput,
	RegistryOutput,
	RevocationStatusOutput,
	SchemaOutput,
	TruveraEndpointInputs,
	TruveraEndpointOutputs,
	VerifiableCredentialOutput,
	VerificationResultOutput,
} from './endpoints/types';
export { TruveraOperationError } from './error-handlers';
