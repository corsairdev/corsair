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
import {
	ArtifactConfigurations,
	AuditLog,
	Certificates,
	Organization,
	Projects,
	SigningPolicies,
	SigningRequests,
	Users,
} from './endpoints';
import type {
	SignpathEndpointInputs,
	SignpathEndpointOutputs,
} from './endpoints/types';
import {
	SignpathEndpointInputSchemas,
	SignpathEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { SignpathSchema } from './schema';

/**
 * A SignPath API token belongs to one user, and that user belongs to one
 * organization. Every route carries the organization id in its path, so it is
 * an account-level setting rather than a per-call argument.
 */
export const signpathAuthConfig = {
	api_key: {
		account: ['organization_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type SignpathPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The organization every call is scoped to. Read from the account when
	 * omitted, so a stored account needs this only once.
	 */
	organizationId?: string;
	hooks?: InternalSignpathPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof signpathEndpointsNested>;
};

export type SignpathContext = CorsairPluginContext<
	typeof SignpathSchema,
	SignpathPluginOptions,
	// The endpoints are not passed here: they reference this context through
	// SignpathEndpoint, and passing them back would make the type circular.
	undefined,
	typeof signpathAuthConfig
>;

export type SignpathKeyBuilderContext = KeyBuilderContext<
	SignpathPluginOptions,
	typeof signpathAuthConfig
>;

export type SignpathBoundEndpoints = BindEndpoints<
	typeof signpathEndpointsNested
>;

type SignpathEndpoint<K extends keyof SignpathEndpointOutputs> =
	CorsairEndpoint<
		SignpathContext,
		SignpathEndpointInputs[K],
		SignpathEndpointOutputs[K]
	>;

export type SignpathEndpoints = {
	organizationGet: SignpathEndpoint<'organizationGet'>;
	usersMe: SignpathEndpoint<'usersMe'>;
	projectsList: SignpathEndpoint<'projectsList'>;
	projectsGet: SignpathEndpoint<'projectsGet'>;
	projectsCreate: SignpathEndpoint<'projectsCreate'>;
	projectsUpdate: SignpathEndpoint<'projectsUpdate'>;
	projectsActivate: SignpathEndpoint<'projectsActivate'>;
	projectsDeactivate: SignpathEndpoint<'projectsDeactivate'>;
	projectsSetDefaultArtifactConfiguration: SignpathEndpoint<'projectsSetDefaultArtifactConfiguration'>;
	signingPoliciesGet: SignpathEndpoint<'signingPoliciesGet'>;
	signingPoliciesCreate: SignpathEndpoint<'signingPoliciesCreate'>;
	signingPoliciesUpdate: SignpathEndpoint<'signingPoliciesUpdate'>;
	signingPoliciesActivate: SignpathEndpoint<'signingPoliciesActivate'>;
	signingPoliciesDeactivate: SignpathEndpoint<'signingPoliciesDeactivate'>;
	artifactConfigurationsGetXml: SignpathEndpoint<'artifactConfigurationsGetXml'>;
	artifactConfigurationsUpdateXml: SignpathEndpoint<'artifactConfigurationsUpdateXml'>;
	artifactConfigurationsActivate: SignpathEndpoint<'artifactConfigurationsActivate'>;
	artifactConfigurationsDeactivate: SignpathEndpoint<'artifactConfigurationsDeactivate'>;
	certificatesList: SignpathEndpoint<'certificatesList'>;
	certificatesGet: SignpathEndpoint<'certificatesGet'>;
	signingRequestsList: SignpathEndpoint<'signingRequestsList'>;
	signingRequestsGet: SignpathEndpoint<'signingRequestsGet'>;
	signingRequestsGetStatus: SignpathEndpoint<'signingRequestsGetStatus'>;
	signingRequestsSubmitWithArtifact: SignpathEndpoint<'signingRequestsSubmitWithArtifact'>;
	signingRequestsSubmitWithArtifactRetrievalLink: SignpathEndpoint<'signingRequestsSubmitWithArtifactRetrievalLink'>;
	signingRequestsSubmitWithoutArtifact: SignpathEndpoint<'signingRequestsSubmitWithoutArtifact'>;
	signingRequestsSignHash: SignpathEndpoint<'signingRequestsSignHash'>;
	signingRequestsSignMessage: SignpathEndpoint<'signingRequestsSignMessage'>;
	signingRequestsResubmit: SignpathEndpoint<'signingRequestsResubmit'>;
	signingRequestsCancel: SignpathEndpoint<'signingRequestsCancel'>;
	signingRequestsApprove: SignpathEndpoint<'signingRequestsApprove'>;
	signingRequestsDeny: SignpathEndpoint<'signingRequestsDeny'>;
	auditLogListEvents: SignpathEndpoint<'auditLogListEvents'>;
	auditLogListSigningRequestEvents: SignpathEndpoint<'auditLogListSigningRequestEvents'>;
};

const signpathEndpointsNested = {
	organization: {
		get: Organization.get,
	},
	users: {
		me: Users.me,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		activate: Projects.activate,
		deactivate: Projects.deactivate,
		setDefaultArtifactConfiguration: Projects.setDefaultArtifactConfiguration,
	},
	signingPolicies: {
		get: SigningPolicies.get,
		create: SigningPolicies.create,
		update: SigningPolicies.update,
		activate: SigningPolicies.activate,
		deactivate: SigningPolicies.deactivate,
	},
	artifactConfigurations: {
		getXml: ArtifactConfigurations.getXml,
		updateXml: ArtifactConfigurations.updateXml,
		activate: ArtifactConfigurations.activate,
		deactivate: ArtifactConfigurations.deactivate,
	},
	certificates: {
		list: Certificates.list,
		get: Certificates.get,
	},
	signingRequests: {
		list: SigningRequests.list,
		get: SigningRequests.get,
		getStatus: SigningRequests.getStatus,
		submitWithArtifact: SigningRequests.submitWithArtifact,
		submitWithArtifactRetrievalLink:
			SigningRequests.submitWithArtifactRetrievalLink,
		submitWithoutArtifact: SigningRequests.submitWithoutArtifact,
		signHash: SigningRequests.signHash,
		signMessage: SigningRequests.signMessage,
		resubmit: SigningRequests.resubmit,
		cancel: SigningRequests.cancel,
		approve: SigningRequests.approve,
		deny: SigningRequests.deny,
	},
	auditLog: {
		listEvents: AuditLog.listEvents,
		listSigningRequestEvents: AuditLog.listSigningRequestEvents,
	},
} as const;

export const signpathEndpointSchemas = {
	'organization.get': {
		input: SignpathEndpointInputSchemas.organizationGet,
		output: SignpathEndpointOutputSchemas.organizationGet,
	},
	'users.me': {
		input: SignpathEndpointInputSchemas.usersMe,
		output: SignpathEndpointOutputSchemas.usersMe,
	},
	'projects.list': {
		input: SignpathEndpointInputSchemas.projectsList,
		output: SignpathEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: SignpathEndpointInputSchemas.projectsGet,
		output: SignpathEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: SignpathEndpointInputSchemas.projectsCreate,
		output: SignpathEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: SignpathEndpointInputSchemas.projectsUpdate,
		output: SignpathEndpointOutputSchemas.projectsUpdate,
	},
	'projects.activate': {
		input: SignpathEndpointInputSchemas.projectsActivate,
		output: SignpathEndpointOutputSchemas.projectsActivate,
	},
	'projects.deactivate': {
		input: SignpathEndpointInputSchemas.projectsDeactivate,
		output: SignpathEndpointOutputSchemas.projectsDeactivate,
	},
	'projects.setDefaultArtifactConfiguration': {
		input: SignpathEndpointInputSchemas.projectsSetDefaultArtifactConfiguration,
		output:
			SignpathEndpointOutputSchemas.projectsSetDefaultArtifactConfiguration,
	},
	'signingPolicies.get': {
		input: SignpathEndpointInputSchemas.signingPoliciesGet,
		output: SignpathEndpointOutputSchemas.signingPoliciesGet,
	},
	'signingPolicies.create': {
		input: SignpathEndpointInputSchemas.signingPoliciesCreate,
		output: SignpathEndpointOutputSchemas.signingPoliciesCreate,
	},
	'signingPolicies.update': {
		input: SignpathEndpointInputSchemas.signingPoliciesUpdate,
		output: SignpathEndpointOutputSchemas.signingPoliciesUpdate,
	},
	'signingPolicies.activate': {
		input: SignpathEndpointInputSchemas.signingPoliciesActivate,
		output: SignpathEndpointOutputSchemas.signingPoliciesActivate,
	},
	'signingPolicies.deactivate': {
		input: SignpathEndpointInputSchemas.signingPoliciesDeactivate,
		output: SignpathEndpointOutputSchemas.signingPoliciesDeactivate,
	},
	'artifactConfigurations.getXml': {
		input: SignpathEndpointInputSchemas.artifactConfigurationsGetXml,
		output: SignpathEndpointOutputSchemas.artifactConfigurationsGetXml,
	},
	'artifactConfigurations.updateXml': {
		input: SignpathEndpointInputSchemas.artifactConfigurationsUpdateXml,
		output: SignpathEndpointOutputSchemas.artifactConfigurationsUpdateXml,
	},
	'artifactConfigurations.activate': {
		input: SignpathEndpointInputSchemas.artifactConfigurationsActivate,
		output: SignpathEndpointOutputSchemas.artifactConfigurationsActivate,
	},
	'artifactConfigurations.deactivate': {
		input: SignpathEndpointInputSchemas.artifactConfigurationsDeactivate,
		output: SignpathEndpointOutputSchemas.artifactConfigurationsDeactivate,
	},
	'certificates.list': {
		input: SignpathEndpointInputSchemas.certificatesList,
		output: SignpathEndpointOutputSchemas.certificatesList,
	},
	'certificates.get': {
		input: SignpathEndpointInputSchemas.certificatesGet,
		output: SignpathEndpointOutputSchemas.certificatesGet,
	},
	'signingRequests.list': {
		input: SignpathEndpointInputSchemas.signingRequestsList,
		output: SignpathEndpointOutputSchemas.signingRequestsList,
	},
	'signingRequests.get': {
		input: SignpathEndpointInputSchemas.signingRequestsGet,
		output: SignpathEndpointOutputSchemas.signingRequestsGet,
	},
	'signingRequests.getStatus': {
		input: SignpathEndpointInputSchemas.signingRequestsGetStatus,
		output: SignpathEndpointOutputSchemas.signingRequestsGetStatus,
	},
	'signingRequests.submitWithArtifact': {
		input: SignpathEndpointInputSchemas.signingRequestsSubmitWithArtifact,
		output: SignpathEndpointOutputSchemas.signingRequestsSubmitWithArtifact,
	},
	'signingRequests.submitWithArtifactRetrievalLink': {
		input:
			SignpathEndpointInputSchemas.signingRequestsSubmitWithArtifactRetrievalLink,
		output:
			SignpathEndpointOutputSchemas.signingRequestsSubmitWithArtifactRetrievalLink,
	},
	'signingRequests.submitWithoutArtifact': {
		input: SignpathEndpointInputSchemas.signingRequestsSubmitWithoutArtifact,
		output: SignpathEndpointOutputSchemas.signingRequestsSubmitWithoutArtifact,
	},
	'signingRequests.signHash': {
		input: SignpathEndpointInputSchemas.signingRequestsSignHash,
		output: SignpathEndpointOutputSchemas.signingRequestsSignHash,
	},
	'signingRequests.signMessage': {
		input: SignpathEndpointInputSchemas.signingRequestsSignMessage,
		output: SignpathEndpointOutputSchemas.signingRequestsSignMessage,
	},
	'signingRequests.resubmit': {
		input: SignpathEndpointInputSchemas.signingRequestsResubmit,
		output: SignpathEndpointOutputSchemas.signingRequestsResubmit,
	},
	'signingRequests.cancel': {
		input: SignpathEndpointInputSchemas.signingRequestsCancel,
		output: SignpathEndpointOutputSchemas.signingRequestsCancel,
	},
	'signingRequests.approve': {
		input: SignpathEndpointInputSchemas.signingRequestsApprove,
		output: SignpathEndpointOutputSchemas.signingRequestsApprove,
	},
	'signingRequests.deny': {
		input: SignpathEndpointInputSchemas.signingRequestsDeny,
		output: SignpathEndpointOutputSchemas.signingRequestsDeny,
	},
	'auditLog.listEvents': {
		input: SignpathEndpointInputSchemas.auditLogListEvents,
		output: SignpathEndpointOutputSchemas.auditLogListEvents,
	},
	'auditLog.listSigningRequestEvents': {
		input: SignpathEndpointInputSchemas.auditLogListSigningRequestEvents,
		output: SignpathEndpointOutputSchemas.auditLogListSigningRequestEvents,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof signpathEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

/**
 * Signing requests are asynchronous, so the three submitters and the resubmit
 * declare a job: `signingRequests.getStatus` is what tells a caller when one
 * finished.
 */
const SIGNING_REQUEST_DONE = ['Completed'] as const;
const SIGNING_REQUEST_FAILED = ['Failed', 'Denied', 'Canceled'] as const;

export const signpathEndpointMeta = {
	'organization.get': {
		riskLevel: 'read',
		description:
			'Read the organization name, subscription type and quota usage: active users, active projects, certificates, yearly signatures and artifact bytes',
	},
	'users.me': {
		riskLevel: 'read',
		description:
			'Read the authenticated user: their id, role, status and whether they are a CI user or an interactive user',
	},
	'projects.list': {
		riskLevel: 'read',
		description:
			'List every project in the organization with its status and signing policies; this route does not page',
	},
	'projects.get': {
		riskLevel: 'read',
		description:
			'Read one project with its artifact configurations, signing policies, trusted build system links, readers and configurators',
	},
	'projects.create': {
		riskLevel: 'write',
		description:
			'Create a project with an artifact configuration; the project starts inactive, so activate it before submitting signing requests',
	},
	'projects.update': {
		riskLevel: 'write',
		description:
			"Change a project name, description, repository URLs, readers or configurators; the body requires the slug, so pass the project's own slug to keep it",
	},
	'projects.activate': {
		riskLevel: 'write',
		description:
			'Activate a project so it accepts signing requests; safe to repeat',
	},
	'projects.deactivate': {
		riskLevel: 'write',
		description:
			'Deactivate a project, which blocks new signing requests until it is activated again; safe to repeat',
	},
	'projects.setDefaultArtifactConfiguration': {
		riskLevel: 'write',
		description:
			'Choose which artifact configuration a signing request uses when it names none',
	},
	'signingPolicies.get': {
		riskLevel: 'read',
		description:
			'Read one signing policy: its certificate, submitters, approvers, required approval count and build system verification',
	},
	'signingPolicies.create': {
		riskLevel: 'write',
		description:
			'Add a signing policy to a project; it is created inactive, so activate it before it accepts submissions',
	},
	'signingPolicies.update': {
		riskLevel: 'write',
		description:
			"Replace a signing policy's certificate, submitters, approvals and verification settings; the body requires the slug, so pass the policy's own slug to keep it",
	},
	'signingPolicies.activate': {
		riskLevel: 'write',
		description:
			'Activate a signing policy so it accepts submissions; safe to repeat',
	},
	'signingPolicies.deactivate': {
		riskLevel: 'write',
		description:
			'Deactivate a signing policy, which blocks new submissions under it; safe to repeat',
	},
	'artifactConfigurations.getXml': {
		riskLevel: 'read',
		description:
			'Read an artifact configuration as XML, which is how SignPath stores and version-controls it',
	},
	'artifactConfigurations.updateXml': {
		riskLevel: 'write',
		description:
			"Replace an artifact configuration's XML; SignPath does not merge it, and existing signing requests keep the version they captured",
	},
	'artifactConfigurations.activate': {
		riskLevel: 'write',
		description: 'Activate an artifact configuration; safe to repeat',
	},
	'artifactConfigurations.deactivate': {
		riskLevel: 'write',
		description: 'Deactivate an artifact configuration; safe to repeat',
	},
	'certificates.list': {
		riskLevel: 'read',
		description:
			"List the organization's X509 and GPG certificates with status, algorithm and validity; this route does not page",
	},
	'certificates.get': {
		riskLevel: 'read',
		description:
			'Read one certificate: its status, key algorithm, subject and X509 validity or GPG fingerprint',
	},
	'signingRequests.list': {
		riskLevel: 'read',
		description:
			'List signing requests with filters for project, policy, configuration, certificate, status and submission time; follow pagination.nextLink for the next page',
	},
	'signingRequests.get': {
		riskLevel: 'read',
		description:
			'Read one signing request with its status, workflow status, artifact links and verified origin when the build system provided one',
	},
	'signingRequests.getStatus': {
		riskLevel: 'read',
		description:
			"Read only a signing request's status and workflow status, which is the cheap poll while it waits for approval or processing",
	},
	'signingRequests.submitWithArtifact': {
		riskLevel: 'write',
		description:
			'Submit an artifact for signing, uploading the bytes in the same call; the request then waits for approval and processing',
		job: {
			idPath: 'signingRequestId',
			status: {
				op: 'signingRequests.getStatus',
				idArg: 'signingRequestId',
				statusPath: 'status',
				done: SIGNING_REQUEST_DONE,
				failed: SIGNING_REQUEST_FAILED,
			},
			cancel: { op: 'signingRequests.cancel', idArg: 'signingRequestId' },
		},
	},
	'signingRequests.submitWithArtifactRetrievalLink': {
		riskLevel: 'write',
		description:
			'Submit a signing request that points at an artifact SignPath downloads itself, which is the route for artifacts too large to upload',
		job: {
			idPath: 'signingRequestId',
			status: {
				op: 'signingRequests.getStatus',
				idArg: 'signingRequestId',
				statusPath: 'status',
				done: SIGNING_REQUEST_DONE,
				failed: SIGNING_REQUEST_FAILED,
			},
			cancel: { op: 'signingRequests.cancel', idArg: 'signingRequestId' },
		},
	},
	'signingRequests.submitWithoutArtifact': {
		riskLevel: 'write',
		description:
			'Submit a signing request before the artifact exists, returning the upload link the artifact must be delivered to',
		job: {
			idPath: 'signingRequestId',
			status: {
				op: 'signingRequests.getStatus',
				idArg: 'signingRequestId',
				statusPath: 'status',
				done: SIGNING_REQUEST_DONE,
				failed: SIGNING_REQUEST_FAILED,
			},
			cancel: { op: 'signingRequests.cancel', idArg: 'signingRequestId' },
		},
	},
	'signingRequests.signHash': {
		riskLevel: 'write',
		description:
			"Sign a hash with the policy's key and return the signature in the response, without an artifact or a waiting period",
	},
	'signingRequests.signMessage': {
		riskLevel: 'write',
		description:
			'Sign a message with ML-DSA and return the signature in the response; PureMldsa is the only algorithm SignPath offers here',
	},
	'signingRequests.resubmit': {
		riskLevel: 'write',
		description:
			'Resubmit a completed signing request under another policy, which is how a test-signed artifact is promoted to release signing; the new request is found with signingRequests.list',
	},
	'signingRequests.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel a signing request that has not finished; a cancelled request cannot be resumed, so a new one has to be submitted',
	},
	'signingRequests.approve': {
		riskLevel: 'write',
		description:
			"Approve a signing request waiting for approval; SignPath accepts it once the policy's required approval count is reached",
	},
	'signingRequests.deny': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deny a signing request, which immediately marks it rejected; a denied request cannot be approved afterwards',
	},
	'auditLog.listEvents': {
		riskLevel: 'read',
		description:
			'Read organization audit log events from a cursor or a start time; this route is under the v1-pre preview path',
	},
	'auditLog.listSigningRequestEvents': {
		riskLevel: 'read',
		description:
			'Read only the signing request audit log events from a cursor or a start time; this route is under the v1-pre preview path',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof signpathEndpointsNested>;

export type BaseSignpathPlugin<T extends SignpathPluginOptions> = CorsairPlugin<
	'signpath',
	typeof SignpathSchema,
	typeof signpathEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof signpathAuthConfig
>;

export type InternalSignpathPlugin = BaseSignpathPlugin<SignpathPluginOptions>;

export type ExternalSignpathPlugin<T extends SignpathPluginOptions> =
	BaseSignpathPlugin<T>;

export function signpath<const T extends SignpathPluginOptions>(
	incomingOptions: SignpathPluginOptions & T = {} as SignpathPluginOptions & T,
): ExternalSignpathPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'signpath',
		authConfig: signpathAuthConfig,
		schema: SignpathSchema,
		options: options,
		hooks: options.hooks,
		endpoints: signpathEndpointsNested,
		webhooks: {},
		endpointMeta: signpathEndpointMeta,
		endpointSchemas: signpathEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: SignpathKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('signpath', ctx.authType ?? 'api_key');
		},
	} satisfies InternalSignpathPlugin;
}

export { SignpathAPIError } from './client';

export type {
	ArtifactConfigurationsGetXmlInput,
	ArtifactConfigurationsGetXmlResponse,
	ArtifactConfigurationsUpdateXmlInput,
	ArtifactConfigurationsUpdateXmlResponse,
	AuditLogEventsInput,
	AuditLogResponse,
	CertificatesGetInput,
	CertificatesGetResponse,
	CertificatesListInput,
	CertificatesListResponse,
	OrganizationGetInput,
	OrganizationGetResponse,
	ProjectsCreateInput,
	ProjectsCreateResponse,
	ProjectsGetInput,
	ProjectsGetResponse,
	ProjectsListInput,
	ProjectsListResponse,
	ProjectsSetDefaultArtifactConfigurationInput,
	ProjectsUpdateInput,
	SigningPoliciesCreateInput,
	SigningPoliciesGetInput,
	SigningPoliciesGetResponse,
	SigningPoliciesUpdateInput,
	SigningRequestsGetResponse,
	SigningRequestsGetStatusResponse,
	SigningRequestsListInput,
	SigningRequestsListResponse,
	SigningRequestsResubmitInput,
	SigningRequestsSignHashInput,
	SigningRequestsSignHashResponse,
	SigningRequestsSignMessageInput,
	SigningRequestsSignMessageResponse,
	SigningRequestsSubmitWithArtifactInput,
	SigningRequestsSubmitWithArtifactResponse,
	SigningRequestsSubmitWithArtifactRetrievalLinkInput,
	SigningRequestsSubmitWithoutArtifactInput,
	SignpathAuditLogEvent,
	SignpathCertificate,
	SignpathEndpointInputs,
	SignpathEndpointOutputs,
	SignpathParticipantReference,
	SignpathSigningRequest,
	UsersMeInput,
	UsersMeResponse,
} from './endpoints/types';
