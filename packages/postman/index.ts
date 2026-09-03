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
import { tryGetStoredKey } from './client';
import {
	AccessKeys,
	Account,
	Apis,
	Billing,
	Collections,
	Comments,
	Environments,
	Groups,
	Mocks,
	Monitors,
	PullRequests,
	Scim,
	Specs,
	Tools,
	Users,
	Workspaces,
} from './endpoints';
import type {
	PostmanEndpointInputs,
	PostmanEndpointOutputs,
} from './endpoints/types';
import {
	PostmanEndpointInputSchemas,
	PostmanEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PostmanSchema } from './schema';

export type PostmanPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPostmanPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof postmanEndpointsNested>;
};

export type PostmanContext = CorsairPluginContext<
	typeof PostmanSchema,
	PostmanPluginOptions,
	undefined,
	typeof postmanAuthConfig
>;

export type PostmanKeyBuilderContext = KeyBuilderContext<
	PostmanPluginOptions,
	typeof postmanAuthConfig
>;

export type PostmanBoundEndpoints = BindEndpoints<
	typeof postmanEndpointsNested
>;

type PostmanEndpoint<K extends keyof PostmanEndpointOutputs> = CorsairEndpoint<
	PostmanContext,
	PostmanEndpointInputs[K],
	PostmanEndpointOutputs[K]
>;

export type PostmanEndpoints = {
	apisCreateSchema: PostmanEndpoint<'apisCreateSchema'>;
	apisCreateCollectionFromSchema: PostmanEndpoint<'apisCreateCollectionFromSchema'>;
	apisGetComments: PostmanEndpoint<'apisGetComments'>;
	apisGet: PostmanEndpoint<'apisGet'>;
	apisGetSchema: PostmanEndpoint<'apisGetSchema'>;
	specsGet: PostmanEndpoint<'specsGet'>;
	apisGetVersion: PostmanEndpoint<'apisGetVersion'>;
	specsList: PostmanEndpoint<'specsList'>;
	apisListVersions: PostmanEndpoint<'apisListVersions'>;
	apisList: PostmanEndpoint<'apisList'>;
	collectionsList: PostmanEndpoint<'collectionsList'>;
	collectionsListForked: PostmanEndpoint<'collectionsListForked'>;
	groupsList: PostmanEndpoint<'groupsList'>;
	mocksList: PostmanEndpoint<'mocksList'>;
	monitorsList: PostmanEndpoint<'monitorsList'>;
	usersList: PostmanEndpoint<'usersList'>;
	workspacesList: PostmanEndpoint<'workspacesList'>;
	collectionsGetUpdateStatus: PostmanEndpoint<'collectionsGetUpdateStatus'>;
	accountMe: PostmanEndpoint<'accountMe'>;
	billingGetAccount: PostmanEndpoint<'billingGetAccount'>;
	accessKeysList: PostmanEndpoint<'accessKeysList'>;
	collectionsGetComments: PostmanEndpoint<'collectionsGetComments'>;
	collectionsGetPullRequests: PostmanEndpoint<'collectionsGetPullRequests'>;
	collectionsGetRoles: PostmanEndpoint<'collectionsGetRoles'>;
	collectionsGetForks: PostmanEndpoint<'collectionsGetForks'>;
	collectionsGetDuplicationStatus: PostmanEndpoint<'collectionsGetDuplicationStatus'>;
	environmentsGetForks: PostmanEndpoint<'environmentsGetForks'>;
	collectionsGetFolderComments: PostmanEndpoint<'collectionsGetFolderComments'>;
	collectionsGetFolder: PostmanEndpoint<'collectionsGetFolder'>;
	collectionsGetGeneratedSpecs: PostmanEndpoint<'collectionsGetGeneratedSpecs'>;
	monitorsGet: PostmanEndpoint<'monitorsGet'>;
	collectionsGetRequestComments: PostmanEndpoint<'collectionsGetRequestComments'>;
	collectionsGetRequest: PostmanEndpoint<'collectionsGetRequest'>;
	scimGetResourceTypes: PostmanEndpoint<'scimGetResourceTypes'>;
	collectionsGetResponseComments: PostmanEndpoint<'collectionsGetResponseComments'>;
	collectionsGetResponse: PostmanEndpoint<'collectionsGetResponse'>;
	apisGetSchemaFileContents: PostmanEndpoint<'apisGetSchemaFileContents'>;
	apisGetSchemaFiles: PostmanEndpoint<'apisGetSchemaFiles'>;
	scimGetServiceConfig: PostmanEndpoint<'scimGetServiceConfig'>;
	collectionsGetSourceStatus: PostmanEndpoint<'collectionsGetSourceStatus'>;
	specsGetDefinition: PostmanEndpoint<'specsGetDefinition'>;
	specsGetFile: PostmanEndpoint<'specsGetFile'>;
	specsGetGeneratedCollections: PostmanEndpoint<'specsGetGeneratedCollections'>;
	specsGetFiles: PostmanEndpoint<'specsGetFiles'>;
	usersGet: PostmanEndpoint<'usersGet'>;
	workspacesGetActivity: PostmanEndpoint<'workspacesGetActivity'>;
	workspacesGet: PostmanEndpoint<'workspacesGet'>;
	workspacesGetGlobalVariables: PostmanEndpoint<'workspacesGetGlobalVariables'>;
	workspacesGetRoles: PostmanEndpoint<'workspacesGetRoles'>;
	environmentsGet: PostmanEndpoint<'environmentsGet'>;
	collectionsCreate: PostmanEndpoint<'collectionsCreate'>;
	collectionsCreateComment: PostmanEndpoint<'collectionsCreateComment'>;
	collectionsCreateFolder: PostmanEndpoint<'collectionsCreateFolder'>;
	collectionsCreateFolderComment: PostmanEndpoint<'collectionsCreateFolderComment'>;
	mocksCreate: PostmanEndpoint<'mocksCreate'>;
	monitorsCreate: PostmanEndpoint<'monitorsCreate'>;
	collectionsCreatePullRequest: PostmanEndpoint<'collectionsCreatePullRequest'>;
	collectionsCreateRequestComment: PostmanEndpoint<'collectionsCreateRequestComment'>;
	collectionsCreateResponse: PostmanEndpoint<'collectionsCreateResponse'>;
	collectionsCreateResponseComment: PostmanEndpoint<'collectionsCreateResponseComment'>;
	specsCreate: PostmanEndpoint<'specsCreate'>;
	workspacesCreate: PostmanEndpoint<'workspacesCreate'>;
	apisCreate: PostmanEndpoint<'apisCreate'>;
	environmentsCreate: PostmanEndpoint<'environmentsCreate'>;
	apisCreateOrUpdateSchemaFile: PostmanEndpoint<'apisCreateOrUpdateSchemaFile'>;
	mocksDeleteServerResponse: PostmanEndpoint<'mocksDeleteServerResponse'>;
	monitorsRemove: PostmanEndpoint<'monitorsRemove'>;
	specsDeleteFile: PostmanEndpoint<'specsDeleteFile'>;
	collectionsRemove: PostmanEndpoint<'collectionsRemove'>;
	collectionsDeleteFolder: PostmanEndpoint<'collectionsDeleteFolder'>;
	collectionsDeleteFolderComment: PostmanEndpoint<'collectionsDeleteFolderComment'>;
	collectionsDeleteRequestComment: PostmanEndpoint<'collectionsDeleteRequestComment'>;
	collectionsDeleteResponse: PostmanEndpoint<'collectionsDeleteResponse'>;
	collectionsDeleteResponseComment: PostmanEndpoint<'collectionsDeleteResponseComment'>;
	apisDeleteSchemaFile: PostmanEndpoint<'apisDeleteSchemaFile'>;
	specsRemove: PostmanEndpoint<'specsRemove'>;
	workspacesRemove: PostmanEndpoint<'workspacesRemove'>;
	collectionsDeleteComment: PostmanEndpoint<'collectionsDeleteComment'>;
	apisRemove: PostmanEndpoint<'apisRemove'>;
	apisDeleteComment: PostmanEndpoint<'apisDeleteComment'>;
	environmentsRemove: PostmanEndpoint<'environmentsRemove'>;
	collectionsDuplicate: PostmanEndpoint<'collectionsDuplicate'>;
	collectionsFork: PostmanEndpoint<'collectionsFork'>;
	specsGenerateCollection: PostmanEndpoint<'specsGenerateCollection'>;
	collectionsGenerateSpec: PostmanEndpoint<'collectionsGenerateSpec'>;
	collectionsCreateRequest: PostmanEndpoint<'collectionsCreateRequest'>;
	specsCreateFile: PostmanEndpoint<'specsCreateFile'>;
	environmentsFork: PostmanEndpoint<'environmentsFork'>;
	mocksCreateServerResponse: PostmanEndpoint<'mocksCreateServerResponse'>;
	toolsImportOpenapi: PostmanEndpoint<'toolsImportOpenapi'>;
	billingListInvoices: PostmanEndpoint<'billingListInvoices'>;
	collectionsMergeFork: PostmanEndpoint<'collectionsMergeFork'>;
	environmentsMergeFork: PostmanEndpoint<'environmentsMergeFork'>;
	mocksPublish: PostmanEndpoint<'mocksPublish'>;
	collectionsPullChanges: PostmanEndpoint<'collectionsPullChanges'>;
	collectionsReplace: PostmanEndpoint<'collectionsReplace'>;
	environmentsReplace: PostmanEndpoint<'environmentsReplace'>;
	commentsResolve: PostmanEndpoint<'commentsResolve'>;
	pullRequestsReview: PostmanEndpoint<'pullRequestsReview'>;
	monitorsRun: PostmanEndpoint<'monitorsRun'>;
	collectionsSyncWithSchema: PostmanEndpoint<'collectionsSyncWithSchema'>;
	collectionsSyncWithSpec: PostmanEndpoint<'collectionsSyncWithSpec'>;
	specsSyncWithCollection: PostmanEndpoint<'specsSyncWithCollection'>;
	collectionsTransferFolders: PostmanEndpoint<'collectionsTransferFolders'>;
	collectionsTransformToOpenapi: PostmanEndpoint<'collectionsTransformToOpenapi'>;
	collectionsUpdate: PostmanEndpoint<'collectionsUpdate'>;
	collectionsUpdateRequest: PostmanEndpoint<'collectionsUpdateRequest'>;
	specsUpdateFile: PostmanEndpoint<'specsUpdateFile'>;
	specsUpdate: PostmanEndpoint<'specsUpdate'>;
	workspacesUpdateGlobalVariables: PostmanEndpoint<'workspacesUpdateGlobalVariables'>;
	collectionsUpdateFolder: PostmanEndpoint<'collectionsUpdateFolder'>;
	collectionsUpdateFolderComment: PostmanEndpoint<'collectionsUpdateFolderComment'>;
	mocksUpdate: PostmanEndpoint<'mocksUpdate'>;
	monitorsUpdate: PostmanEndpoint<'monitorsUpdate'>;
	pullRequestsUpdate: PostmanEndpoint<'pullRequestsUpdate'>;
	collectionsUpdateRequestComment: PostmanEndpoint<'collectionsUpdateRequestComment'>;
	collectionsUpdateResponse: PostmanEndpoint<'collectionsUpdateResponse'>;
	collectionsUpdateResponseComment: PostmanEndpoint<'collectionsUpdateResponseComment'>;
	mocksUpdateServerResponse: PostmanEndpoint<'mocksUpdateServerResponse'>;
	workspacesUpdate: PostmanEndpoint<'workspacesUpdate'>;
	apisUpdate: PostmanEndpoint<'apisUpdate'>;
	apisUpdateComment: PostmanEndpoint<'apisUpdateComment'>;
	environmentsUpdate: PostmanEndpoint<'environmentsUpdate'>;
	environmentsList: PostmanEndpoint<'environmentsList'>;
	apisCreateRelations: PostmanEndpoint<'apisCreateRelations'>;
	apisGetLinkedRelations: PostmanEndpoint<'apisGetLinkedRelations'>;
	apisGetTestRelations: PostmanEndpoint<'apisGetTestRelations'>;
	apisGetContractTestRelations: PostmanEndpoint<'apisGetContractTestRelations'>;
	apisGetIntegrationTestRelations: PostmanEndpoint<'apisGetIntegrationTestRelations'>;
	apisGetTestSuiteRelations: PostmanEndpoint<'apisGetTestSuiteRelations'>;
	apisGetDocumentationRelations: PostmanEndpoint<'apisGetDocumentationRelations'>;
	apisGetEnvironmentRelations: PostmanEndpoint<'apisGetEnvironmentRelations'>;
	apisListReleases: PostmanEndpoint<'apisListReleases'>;
	apisGetUnclassifiedRelations: PostmanEndpoint<'apisGetUnclassifiedRelations'>;
};

const postmanEndpointsNested = {
	apis: {
		createSchema: Apis.createSchema,
		createCollectionFromSchema: Apis.createCollectionFromSchema,
		getComments: Apis.getComments,
		get: Apis.get,
		getSchema: Apis.getSchema,
		getVersion: Apis.getVersion,
		listVersions: Apis.listVersions,
		list: Apis.list,
		getSchemaFileContents: Apis.getSchemaFileContents,
		getSchemaFiles: Apis.getSchemaFiles,
		create: Apis.create,
		createOrUpdateSchemaFile: Apis.createOrUpdateSchemaFile,
		deleteSchemaFile: Apis.deleteSchemaFile,
		remove: Apis.remove,
		deleteComment: Apis.deleteComment,
		update: Apis.update,
		updateComment: Apis.updateComment,
		createRelations: Apis.createRelations,
		getLinkedRelations: Apis.getLinkedRelations,
		getTestRelations: Apis.getTestRelations,
		getContractTestRelations: Apis.getContractTestRelations,
		getIntegrationTestRelations: Apis.getIntegrationTestRelations,
		getTestSuiteRelations: Apis.getTestSuiteRelations,
		getDocumentationRelations: Apis.getDocumentationRelations,
		getEnvironmentRelations: Apis.getEnvironmentRelations,
		listReleases: Apis.listReleases,
		getUnclassifiedRelations: Apis.getUnclassifiedRelations,
	},
	specs: {
		get: Specs.get,
		list: Specs.list,
		getDefinition: Specs.getDefinition,
		getFile: Specs.getFile,
		getGeneratedCollections: Specs.getGeneratedCollections,
		getFiles: Specs.getFiles,
		create: Specs.create,
		deleteFile: Specs.deleteFile,
		remove: Specs.remove,
		generateCollection: Specs.generateCollection,
		createFile: Specs.createFile,
		syncWithCollection: Specs.syncWithCollection,
		updateFile: Specs.updateFile,
		update: Specs.update,
	},
	collections: {
		list: Collections.list,
		listForked: Collections.listForked,
		getUpdateStatus: Collections.getUpdateStatus,
		getComments: Collections.getComments,
		getPullRequests: Collections.getPullRequests,
		getRoles: Collections.getRoles,
		getForks: Collections.getForks,
		getDuplicationStatus: Collections.getDuplicationStatus,
		getFolderComments: Collections.getFolderComments,
		getFolder: Collections.getFolder,
		getGeneratedSpecs: Collections.getGeneratedSpecs,
		getRequestComments: Collections.getRequestComments,
		getRequest: Collections.getRequest,
		getResponseComments: Collections.getResponseComments,
		getResponse: Collections.getResponse,
		getSourceStatus: Collections.getSourceStatus,
		create: Collections.create,
		createComment: Collections.createComment,
		createFolder: Collections.createFolder,
		createFolderComment: Collections.createFolderComment,
		createPullRequest: Collections.createPullRequest,
		createRequestComment: Collections.createRequestComment,
		createResponse: Collections.createResponse,
		createResponseComment: Collections.createResponseComment,
		remove: Collections.remove,
		deleteFolder: Collections.deleteFolder,
		deleteFolderComment: Collections.deleteFolderComment,
		deleteRequestComment: Collections.deleteRequestComment,
		deleteResponse: Collections.deleteResponse,
		deleteResponseComment: Collections.deleteResponseComment,
		deleteComment: Collections.deleteComment,
		duplicate: Collections.duplicate,
		fork: Collections.fork,
		generateSpec: Collections.generateSpec,
		createRequest: Collections.createRequest,
		mergeFork: Collections.mergeFork,
		pullChanges: Collections.pullChanges,
		replace: Collections.replace,
		syncWithSchema: Collections.syncWithSchema,
		syncWithSpec: Collections.syncWithSpec,
		transferFolders: Collections.transferFolders,
		transformToOpenapi: Collections.transformToOpenapi,
		update: Collections.update,
		updateRequest: Collections.updateRequest,
		updateFolder: Collections.updateFolder,
		updateFolderComment: Collections.updateFolderComment,
		updateRequestComment: Collections.updateRequestComment,
		updateResponse: Collections.updateResponse,
		updateResponseComment: Collections.updateResponseComment,
	},
	groups: {
		list: Groups.list,
	},
	mocks: {
		list: Mocks.list,
		create: Mocks.create,
		deleteServerResponse: Mocks.deleteServerResponse,
		createServerResponse: Mocks.createServerResponse,
		publish: Mocks.publish,
		update: Mocks.update,
		updateServerResponse: Mocks.updateServerResponse,
	},
	monitors: {
		list: Monitors.list,
		get: Monitors.get,
		create: Monitors.create,
		remove: Monitors.remove,
		run: Monitors.run,
		update: Monitors.update,
	},
	users: {
		list: Users.list,
		get: Users.get,
	},
	workspaces: {
		list: Workspaces.list,
		getActivity: Workspaces.getActivity,
		get: Workspaces.get,
		getGlobalVariables: Workspaces.getGlobalVariables,
		getRoles: Workspaces.getRoles,
		create: Workspaces.create,
		remove: Workspaces.remove,
		updateGlobalVariables: Workspaces.updateGlobalVariables,
		update: Workspaces.update,
	},
	account: {
		me: Account.me,
	},
	billing: {
		getAccount: Billing.getAccount,
		listInvoices: Billing.listInvoices,
	},
	accessKeys: {
		list: AccessKeys.list,
	},
	environments: {
		getForks: Environments.getForks,
		get: Environments.get,
		create: Environments.create,
		remove: Environments.remove,
		fork: Environments.fork,
		mergeFork: Environments.mergeFork,
		replace: Environments.replace,
		update: Environments.update,
		list: Environments.list,
	},
	scim: {
		getResourceTypes: Scim.getResourceTypes,
		getServiceConfig: Scim.getServiceConfig,
	},
	tools: {
		importOpenapi: Tools.importOpenapi,
	},
	comments: {
		resolve: Comments.resolve,
	},
	pullRequests: {
		review: PullRequests.review,
		update: PullRequests.update,
	},
} as const;

export const postmanEndpointSchemas = {
	'apis.createSchema': {
		input: PostmanEndpointInputSchemas.apisCreateSchema,
		output: PostmanEndpointOutputSchemas.apisCreateSchema,
	},
	'apis.createCollectionFromSchema': {
		input: PostmanEndpointInputSchemas.apisCreateCollectionFromSchema,
		output: PostmanEndpointOutputSchemas.apisCreateCollectionFromSchema,
	},
	'apis.getComments': {
		input: PostmanEndpointInputSchemas.apisGetComments,
		output: PostmanEndpointOutputSchemas.apisGetComments,
	},
	'apis.get': {
		input: PostmanEndpointInputSchemas.apisGet,
		output: PostmanEndpointOutputSchemas.apisGet,
	},
	'apis.getSchema': {
		input: PostmanEndpointInputSchemas.apisGetSchema,
		output: PostmanEndpointOutputSchemas.apisGetSchema,
	},
	'specs.get': {
		input: PostmanEndpointInputSchemas.specsGet,
		output: PostmanEndpointOutputSchemas.specsGet,
	},
	'apis.getVersion': {
		input: PostmanEndpointInputSchemas.apisGetVersion,
		output: PostmanEndpointOutputSchemas.apisGetVersion,
	},
	'specs.list': {
		input: PostmanEndpointInputSchemas.specsList,
		output: PostmanEndpointOutputSchemas.specsList,
	},
	'apis.listVersions': {
		input: PostmanEndpointInputSchemas.apisListVersions,
		output: PostmanEndpointOutputSchemas.apisListVersions,
	},
	'apis.list': {
		input: PostmanEndpointInputSchemas.apisList,
		output: PostmanEndpointOutputSchemas.apisList,
	},
	'collections.list': {
		input: PostmanEndpointInputSchemas.collectionsList,
		output: PostmanEndpointOutputSchemas.collectionsList,
	},
	'collections.listForked': {
		input: PostmanEndpointInputSchemas.collectionsListForked,
		output: PostmanEndpointOutputSchemas.collectionsListForked,
	},
	'groups.list': {
		input: PostmanEndpointInputSchemas.groupsList,
		output: PostmanEndpointOutputSchemas.groupsList,
	},
	'mocks.list': {
		input: PostmanEndpointInputSchemas.mocksList,
		output: PostmanEndpointOutputSchemas.mocksList,
	},
	'monitors.list': {
		input: PostmanEndpointInputSchemas.monitorsList,
		output: PostmanEndpointOutputSchemas.monitorsList,
	},
	'users.list': {
		input: PostmanEndpointInputSchemas.usersList,
		output: PostmanEndpointOutputSchemas.usersList,
	},
	'workspaces.list': {
		input: PostmanEndpointInputSchemas.workspacesList,
		output: PostmanEndpointOutputSchemas.workspacesList,
	},
	'collections.getUpdateStatus': {
		input: PostmanEndpointInputSchemas.collectionsGetUpdateStatus,
		output: PostmanEndpointOutputSchemas.collectionsGetUpdateStatus,
	},
	'account.me': {
		input: PostmanEndpointInputSchemas.accountMe,
		output: PostmanEndpointOutputSchemas.accountMe,
	},
	'billing.getAccount': {
		input: PostmanEndpointInputSchemas.billingGetAccount,
		output: PostmanEndpointOutputSchemas.billingGetAccount,
	},
	'accessKeys.list': {
		input: PostmanEndpointInputSchemas.accessKeysList,
		output: PostmanEndpointOutputSchemas.accessKeysList,
	},
	'collections.getComments': {
		input: PostmanEndpointInputSchemas.collectionsGetComments,
		output: PostmanEndpointOutputSchemas.collectionsGetComments,
	},
	'collections.getPullRequests': {
		input: PostmanEndpointInputSchemas.collectionsGetPullRequests,
		output: PostmanEndpointOutputSchemas.collectionsGetPullRequests,
	},
	'collections.getRoles': {
		input: PostmanEndpointInputSchemas.collectionsGetRoles,
		output: PostmanEndpointOutputSchemas.collectionsGetRoles,
	},
	'collections.getForks': {
		input: PostmanEndpointInputSchemas.collectionsGetForks,
		output: PostmanEndpointOutputSchemas.collectionsGetForks,
	},
	'collections.getDuplicationStatus': {
		input: PostmanEndpointInputSchemas.collectionsGetDuplicationStatus,
		output: PostmanEndpointOutputSchemas.collectionsGetDuplicationStatus,
	},
	'environments.getForks': {
		input: PostmanEndpointInputSchemas.environmentsGetForks,
		output: PostmanEndpointOutputSchemas.environmentsGetForks,
	},
	'collections.getFolderComments': {
		input: PostmanEndpointInputSchemas.collectionsGetFolderComments,
		output: PostmanEndpointOutputSchemas.collectionsGetFolderComments,
	},
	'collections.getFolder': {
		input: PostmanEndpointInputSchemas.collectionsGetFolder,
		output: PostmanEndpointOutputSchemas.collectionsGetFolder,
	},
	'collections.getGeneratedSpecs': {
		input: PostmanEndpointInputSchemas.collectionsGetGeneratedSpecs,
		output: PostmanEndpointOutputSchemas.collectionsGetGeneratedSpecs,
	},
	'monitors.get': {
		input: PostmanEndpointInputSchemas.monitorsGet,
		output: PostmanEndpointOutputSchemas.monitorsGet,
	},
	'collections.getRequestComments': {
		input: PostmanEndpointInputSchemas.collectionsGetRequestComments,
		output: PostmanEndpointOutputSchemas.collectionsGetRequestComments,
	},
	'collections.getRequest': {
		input: PostmanEndpointInputSchemas.collectionsGetRequest,
		output: PostmanEndpointOutputSchemas.collectionsGetRequest,
	},
	'scim.getResourceTypes': {
		input: PostmanEndpointInputSchemas.scimGetResourceTypes,
		output: PostmanEndpointOutputSchemas.scimGetResourceTypes,
	},
	'collections.getResponseComments': {
		input: PostmanEndpointInputSchemas.collectionsGetResponseComments,
		output: PostmanEndpointOutputSchemas.collectionsGetResponseComments,
	},
	'collections.getResponse': {
		input: PostmanEndpointInputSchemas.collectionsGetResponse,
		output: PostmanEndpointOutputSchemas.collectionsGetResponse,
	},
	'apis.getSchemaFileContents': {
		input: PostmanEndpointInputSchemas.apisGetSchemaFileContents,
		output: PostmanEndpointOutputSchemas.apisGetSchemaFileContents,
	},
	'apis.getSchemaFiles': {
		input: PostmanEndpointInputSchemas.apisGetSchemaFiles,
		output: PostmanEndpointOutputSchemas.apisGetSchemaFiles,
	},
	'scim.getServiceConfig': {
		input: PostmanEndpointInputSchemas.scimGetServiceConfig,
		output: PostmanEndpointOutputSchemas.scimGetServiceConfig,
	},
	'collections.getSourceStatus': {
		input: PostmanEndpointInputSchemas.collectionsGetSourceStatus,
		output: PostmanEndpointOutputSchemas.collectionsGetSourceStatus,
	},
	'specs.getDefinition': {
		input: PostmanEndpointInputSchemas.specsGetDefinition,
		output: PostmanEndpointOutputSchemas.specsGetDefinition,
	},
	'specs.getFile': {
		input: PostmanEndpointInputSchemas.specsGetFile,
		output: PostmanEndpointOutputSchemas.specsGetFile,
	},
	'specs.getGeneratedCollections': {
		input: PostmanEndpointInputSchemas.specsGetGeneratedCollections,
		output: PostmanEndpointOutputSchemas.specsGetGeneratedCollections,
	},
	'specs.getFiles': {
		input: PostmanEndpointInputSchemas.specsGetFiles,
		output: PostmanEndpointOutputSchemas.specsGetFiles,
	},
	'users.get': {
		input: PostmanEndpointInputSchemas.usersGet,
		output: PostmanEndpointOutputSchemas.usersGet,
	},
	'workspaces.getActivity': {
		input: PostmanEndpointInputSchemas.workspacesGetActivity,
		output: PostmanEndpointOutputSchemas.workspacesGetActivity,
	},
	'workspaces.get': {
		input: PostmanEndpointInputSchemas.workspacesGet,
		output: PostmanEndpointOutputSchemas.workspacesGet,
	},
	'workspaces.getGlobalVariables': {
		input: PostmanEndpointInputSchemas.workspacesGetGlobalVariables,
		output: PostmanEndpointOutputSchemas.workspacesGetGlobalVariables,
	},
	'workspaces.getRoles': {
		input: PostmanEndpointInputSchemas.workspacesGetRoles,
		output: PostmanEndpointOutputSchemas.workspacesGetRoles,
	},
	'environments.get': {
		input: PostmanEndpointInputSchemas.environmentsGet,
		output: PostmanEndpointOutputSchemas.environmentsGet,
	},
	'collections.create': {
		input: PostmanEndpointInputSchemas.collectionsCreate,
		output: PostmanEndpointOutputSchemas.collectionsCreate,
	},
	'collections.createComment': {
		input: PostmanEndpointInputSchemas.collectionsCreateComment,
		output: PostmanEndpointOutputSchemas.collectionsCreateComment,
	},
	'collections.createFolder': {
		input: PostmanEndpointInputSchemas.collectionsCreateFolder,
		output: PostmanEndpointOutputSchemas.collectionsCreateFolder,
	},
	'collections.createFolderComment': {
		input: PostmanEndpointInputSchemas.collectionsCreateFolderComment,
		output: PostmanEndpointOutputSchemas.collectionsCreateFolderComment,
	},
	'mocks.create': {
		input: PostmanEndpointInputSchemas.mocksCreate,
		output: PostmanEndpointOutputSchemas.mocksCreate,
	},
	'monitors.create': {
		input: PostmanEndpointInputSchemas.monitorsCreate,
		output: PostmanEndpointOutputSchemas.monitorsCreate,
	},
	'collections.createPullRequest': {
		input: PostmanEndpointInputSchemas.collectionsCreatePullRequest,
		output: PostmanEndpointOutputSchemas.collectionsCreatePullRequest,
	},
	'collections.createRequestComment': {
		input: PostmanEndpointInputSchemas.collectionsCreateRequestComment,
		output: PostmanEndpointOutputSchemas.collectionsCreateRequestComment,
	},
	'collections.createResponse': {
		input: PostmanEndpointInputSchemas.collectionsCreateResponse,
		output: PostmanEndpointOutputSchemas.collectionsCreateResponse,
	},
	'collections.createResponseComment': {
		input: PostmanEndpointInputSchemas.collectionsCreateResponseComment,
		output: PostmanEndpointOutputSchemas.collectionsCreateResponseComment,
	},
	'specs.create': {
		input: PostmanEndpointInputSchemas.specsCreate,
		output: PostmanEndpointOutputSchemas.specsCreate,
	},
	'workspaces.create': {
		input: PostmanEndpointInputSchemas.workspacesCreate,
		output: PostmanEndpointOutputSchemas.workspacesCreate,
	},
	'apis.create': {
		input: PostmanEndpointInputSchemas.apisCreate,
		output: PostmanEndpointOutputSchemas.apisCreate,
	},
	'environments.create': {
		input: PostmanEndpointInputSchemas.environmentsCreate,
		output: PostmanEndpointOutputSchemas.environmentsCreate,
	},
	'apis.createOrUpdateSchemaFile': {
		input: PostmanEndpointInputSchemas.apisCreateOrUpdateSchemaFile,
		output: PostmanEndpointOutputSchemas.apisCreateOrUpdateSchemaFile,
	},
	'mocks.deleteServerResponse': {
		input: PostmanEndpointInputSchemas.mocksDeleteServerResponse,
		output: PostmanEndpointOutputSchemas.mocksDeleteServerResponse,
	},
	'monitors.remove': {
		input: PostmanEndpointInputSchemas.monitorsRemove,
		output: PostmanEndpointOutputSchemas.monitorsRemove,
	},
	'specs.deleteFile': {
		input: PostmanEndpointInputSchemas.specsDeleteFile,
		output: PostmanEndpointOutputSchemas.specsDeleteFile,
	},
	'collections.remove': {
		input: PostmanEndpointInputSchemas.collectionsRemove,
		output: PostmanEndpointOutputSchemas.collectionsRemove,
	},
	'collections.deleteFolder': {
		input: PostmanEndpointInputSchemas.collectionsDeleteFolder,
		output: PostmanEndpointOutputSchemas.collectionsDeleteFolder,
	},
	'collections.deleteFolderComment': {
		input: PostmanEndpointInputSchemas.collectionsDeleteFolderComment,
		output: PostmanEndpointOutputSchemas.collectionsDeleteFolderComment,
	},
	'collections.deleteRequestComment': {
		input: PostmanEndpointInputSchemas.collectionsDeleteRequestComment,
		output: PostmanEndpointOutputSchemas.collectionsDeleteRequestComment,
	},
	'collections.deleteResponse': {
		input: PostmanEndpointInputSchemas.collectionsDeleteResponse,
		output: PostmanEndpointOutputSchemas.collectionsDeleteResponse,
	},
	'collections.deleteResponseComment': {
		input: PostmanEndpointInputSchemas.collectionsDeleteResponseComment,
		output: PostmanEndpointOutputSchemas.collectionsDeleteResponseComment,
	},
	'apis.deleteSchemaFile': {
		input: PostmanEndpointInputSchemas.apisDeleteSchemaFile,
		output: PostmanEndpointOutputSchemas.apisDeleteSchemaFile,
	},
	'specs.remove': {
		input: PostmanEndpointInputSchemas.specsRemove,
		output: PostmanEndpointOutputSchemas.specsRemove,
	},
	'workspaces.remove': {
		input: PostmanEndpointInputSchemas.workspacesRemove,
		output: PostmanEndpointOutputSchemas.workspacesRemove,
	},
	'collections.deleteComment': {
		input: PostmanEndpointInputSchemas.collectionsDeleteComment,
		output: PostmanEndpointOutputSchemas.collectionsDeleteComment,
	},
	'apis.remove': {
		input: PostmanEndpointInputSchemas.apisRemove,
		output: PostmanEndpointOutputSchemas.apisRemove,
	},
	'apis.deleteComment': {
		input: PostmanEndpointInputSchemas.apisDeleteComment,
		output: PostmanEndpointOutputSchemas.apisDeleteComment,
	},
	'environments.remove': {
		input: PostmanEndpointInputSchemas.environmentsRemove,
		output: PostmanEndpointOutputSchemas.environmentsRemove,
	},
	'collections.duplicate': {
		input: PostmanEndpointInputSchemas.collectionsDuplicate,
		output: PostmanEndpointOutputSchemas.collectionsDuplicate,
	},
	'collections.fork': {
		input: PostmanEndpointInputSchemas.collectionsFork,
		output: PostmanEndpointOutputSchemas.collectionsFork,
	},
	'specs.generateCollection': {
		input: PostmanEndpointInputSchemas.specsGenerateCollection,
		output: PostmanEndpointOutputSchemas.specsGenerateCollection,
	},
	'collections.generateSpec': {
		input: PostmanEndpointInputSchemas.collectionsGenerateSpec,
		output: PostmanEndpointOutputSchemas.collectionsGenerateSpec,
	},
	'collections.createRequest': {
		input: PostmanEndpointInputSchemas.collectionsCreateRequest,
		output: PostmanEndpointOutputSchemas.collectionsCreateRequest,
	},
	'specs.createFile': {
		input: PostmanEndpointInputSchemas.specsCreateFile,
		output: PostmanEndpointOutputSchemas.specsCreateFile,
	},
	'environments.fork': {
		input: PostmanEndpointInputSchemas.environmentsFork,
		output: PostmanEndpointOutputSchemas.environmentsFork,
	},
	'mocks.createServerResponse': {
		input: PostmanEndpointInputSchemas.mocksCreateServerResponse,
		output: PostmanEndpointOutputSchemas.mocksCreateServerResponse,
	},
	'tools.importOpenapi': {
		input: PostmanEndpointInputSchemas.toolsImportOpenapi,
		output: PostmanEndpointOutputSchemas.toolsImportOpenapi,
	},
	'billing.listInvoices': {
		input: PostmanEndpointInputSchemas.billingListInvoices,
		output: PostmanEndpointOutputSchemas.billingListInvoices,
	},
	'collections.mergeFork': {
		input: PostmanEndpointInputSchemas.collectionsMergeFork,
		output: PostmanEndpointOutputSchemas.collectionsMergeFork,
	},
	'environments.mergeFork': {
		input: PostmanEndpointInputSchemas.environmentsMergeFork,
		output: PostmanEndpointOutputSchemas.environmentsMergeFork,
	},
	'mocks.publish': {
		input: PostmanEndpointInputSchemas.mocksPublish,
		output: PostmanEndpointOutputSchemas.mocksPublish,
	},
	'collections.pullChanges': {
		input: PostmanEndpointInputSchemas.collectionsPullChanges,
		output: PostmanEndpointOutputSchemas.collectionsPullChanges,
	},
	'collections.replace': {
		input: PostmanEndpointInputSchemas.collectionsReplace,
		output: PostmanEndpointOutputSchemas.collectionsReplace,
	},
	'environments.replace': {
		input: PostmanEndpointInputSchemas.environmentsReplace,
		output: PostmanEndpointOutputSchemas.environmentsReplace,
	},
	'comments.resolve': {
		input: PostmanEndpointInputSchemas.commentsResolve,
		output: PostmanEndpointOutputSchemas.commentsResolve,
	},
	'pullRequests.review': {
		input: PostmanEndpointInputSchemas.pullRequestsReview,
		output: PostmanEndpointOutputSchemas.pullRequestsReview,
	},
	'monitors.run': {
		input: PostmanEndpointInputSchemas.monitorsRun,
		output: PostmanEndpointOutputSchemas.monitorsRun,
	},
	'collections.syncWithSchema': {
		input: PostmanEndpointInputSchemas.collectionsSyncWithSchema,
		output: PostmanEndpointOutputSchemas.collectionsSyncWithSchema,
	},
	'collections.syncWithSpec': {
		input: PostmanEndpointInputSchemas.collectionsSyncWithSpec,
		output: PostmanEndpointOutputSchemas.collectionsSyncWithSpec,
	},
	'specs.syncWithCollection': {
		input: PostmanEndpointInputSchemas.specsSyncWithCollection,
		output: PostmanEndpointOutputSchemas.specsSyncWithCollection,
	},
	'collections.transferFolders': {
		input: PostmanEndpointInputSchemas.collectionsTransferFolders,
		output: PostmanEndpointOutputSchemas.collectionsTransferFolders,
	},
	'collections.transformToOpenapi': {
		input: PostmanEndpointInputSchemas.collectionsTransformToOpenapi,
		output: PostmanEndpointOutputSchemas.collectionsTransformToOpenapi,
	},
	'collections.update': {
		input: PostmanEndpointInputSchemas.collectionsUpdate,
		output: PostmanEndpointOutputSchemas.collectionsUpdate,
	},
	'collections.updateRequest': {
		input: PostmanEndpointInputSchemas.collectionsUpdateRequest,
		output: PostmanEndpointOutputSchemas.collectionsUpdateRequest,
	},
	'specs.updateFile': {
		input: PostmanEndpointInputSchemas.specsUpdateFile,
		output: PostmanEndpointOutputSchemas.specsUpdateFile,
	},
	'specs.update': {
		input: PostmanEndpointInputSchemas.specsUpdate,
		output: PostmanEndpointOutputSchemas.specsUpdate,
	},
	'workspaces.updateGlobalVariables': {
		input: PostmanEndpointInputSchemas.workspacesUpdateGlobalVariables,
		output: PostmanEndpointOutputSchemas.workspacesUpdateGlobalVariables,
	},
	'collections.updateFolder': {
		input: PostmanEndpointInputSchemas.collectionsUpdateFolder,
		output: PostmanEndpointOutputSchemas.collectionsUpdateFolder,
	},
	'collections.updateFolderComment': {
		input: PostmanEndpointInputSchemas.collectionsUpdateFolderComment,
		output: PostmanEndpointOutputSchemas.collectionsUpdateFolderComment,
	},
	'mocks.update': {
		input: PostmanEndpointInputSchemas.mocksUpdate,
		output: PostmanEndpointOutputSchemas.mocksUpdate,
	},
	'monitors.update': {
		input: PostmanEndpointInputSchemas.monitorsUpdate,
		output: PostmanEndpointOutputSchemas.monitorsUpdate,
	},
	'pullRequests.update': {
		input: PostmanEndpointInputSchemas.pullRequestsUpdate,
		output: PostmanEndpointOutputSchemas.pullRequestsUpdate,
	},
	'collections.updateRequestComment': {
		input: PostmanEndpointInputSchemas.collectionsUpdateRequestComment,
		output: PostmanEndpointOutputSchemas.collectionsUpdateRequestComment,
	},
	'collections.updateResponse': {
		input: PostmanEndpointInputSchemas.collectionsUpdateResponse,
		output: PostmanEndpointOutputSchemas.collectionsUpdateResponse,
	},
	'collections.updateResponseComment': {
		input: PostmanEndpointInputSchemas.collectionsUpdateResponseComment,
		output: PostmanEndpointOutputSchemas.collectionsUpdateResponseComment,
	},
	'mocks.updateServerResponse': {
		input: PostmanEndpointInputSchemas.mocksUpdateServerResponse,
		output: PostmanEndpointOutputSchemas.mocksUpdateServerResponse,
	},
	'workspaces.update': {
		input: PostmanEndpointInputSchemas.workspacesUpdate,
		output: PostmanEndpointOutputSchemas.workspacesUpdate,
	},
	'apis.update': {
		input: PostmanEndpointInputSchemas.apisUpdate,
		output: PostmanEndpointOutputSchemas.apisUpdate,
	},
	'apis.updateComment': {
		input: PostmanEndpointInputSchemas.apisUpdateComment,
		output: PostmanEndpointOutputSchemas.apisUpdateComment,
	},
	'environments.update': {
		input: PostmanEndpointInputSchemas.environmentsUpdate,
		output: PostmanEndpointOutputSchemas.environmentsUpdate,
	},
	'environments.list': {
		input: PostmanEndpointInputSchemas.environmentsList,
		output: PostmanEndpointOutputSchemas.environmentsList,
	},
	'apis.createRelations': {
		input: PostmanEndpointInputSchemas.apisCreateRelations,
		output: PostmanEndpointOutputSchemas.apisCreateRelations,
	},
	'apis.getLinkedRelations': {
		input: PostmanEndpointInputSchemas.apisGetLinkedRelations,
		output: PostmanEndpointOutputSchemas.apisGetLinkedRelations,
	},
	'apis.getTestRelations': {
		input: PostmanEndpointInputSchemas.apisGetTestRelations,
		output: PostmanEndpointOutputSchemas.apisGetTestRelations,
	},
	'apis.getContractTestRelations': {
		input: PostmanEndpointInputSchemas.apisGetContractTestRelations,
		output: PostmanEndpointOutputSchemas.apisGetContractTestRelations,
	},
	'apis.getIntegrationTestRelations': {
		input: PostmanEndpointInputSchemas.apisGetIntegrationTestRelations,
		output: PostmanEndpointOutputSchemas.apisGetIntegrationTestRelations,
	},
	'apis.getTestSuiteRelations': {
		input: PostmanEndpointInputSchemas.apisGetTestSuiteRelations,
		output: PostmanEndpointOutputSchemas.apisGetTestSuiteRelations,
	},
	'apis.getDocumentationRelations': {
		input: PostmanEndpointInputSchemas.apisGetDocumentationRelations,
		output: PostmanEndpointOutputSchemas.apisGetDocumentationRelations,
	},
	'apis.getEnvironmentRelations': {
		input: PostmanEndpointInputSchemas.apisGetEnvironmentRelations,
		output: PostmanEndpointOutputSchemas.apisGetEnvironmentRelations,
	},
	'apis.listReleases': {
		input: PostmanEndpointInputSchemas.apisListReleases,
		output: PostmanEndpointOutputSchemas.apisListReleases,
	},
	'apis.getUnclassifiedRelations': {
		input: PostmanEndpointInputSchemas.apisGetUnclassifiedRelations,
		output: PostmanEndpointOutputSchemas.apisGetUnclassifiedRelations,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof postmanEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const postmanEndpointMeta = {
	'apis.createSchema': {
		riskLevel: 'write',
		description: 'Create a schema (Deprecated by Postman.)',
	},
	'apis.createCollectionFromSchema': {
		riskLevel: 'write',
		description: 'Add a collection (Deprecated by Postman.)',
	},
	'apis.getComments': {
		riskLevel: 'read',
		description: "Get an API's comments (Deprecated by Postman.)",
	},
	'apis.get': {
		riskLevel: 'read',
		description: 'Get an API (Deprecated by Postman.)',
	},
	'apis.getSchema': {
		riskLevel: 'read',
		description: 'Get a schema (Deprecated by Postman.)',
	},
	'specs.get': {
		riskLevel: 'read',
		description: 'Get a spec',
	},
	'apis.getVersion': {
		riskLevel: 'read',
		description: 'Get a version (Deprecated by Postman.)',
	},
	'specs.list': {
		riskLevel: 'read',
		description: 'Get all specs',
	},
	'apis.listVersions': {
		riskLevel: 'read',
		description: 'Get all versions (Deprecated by Postman.)',
	},
	'apis.list': {
		riskLevel: 'read',
		description: 'Get all APIs (Deprecated by Postman.)',
	},
	'collections.list': {
		riskLevel: 'read',
		description: 'Get all collections',
	},
	'collections.listForked': {
		riskLevel: 'read',
		description: 'Get all forked collections',
	},
	'groups.list': {
		riskLevel: 'read',
		description: 'Get all groups',
	},
	'mocks.list': {
		riskLevel: 'read',
		description: 'Get all mock servers',
	},
	'monitors.list': {
		riskLevel: 'read',
		description: 'Get all monitors',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'Get all team users',
	},
	'workspaces.list': {
		riskLevel: 'read',
		description: 'Get all workspaces',
	},
	'collections.getUpdateStatus': {
		riskLevel: 'read',
		description: 'Get async collection update status',
	},
	'account.me': {
		riskLevel: 'read',
		description: 'Get authenticated user',
	},
	'billing.getAccount': {
		riskLevel: 'read',
		description: 'Get accounts',
	},
	'accessKeys.list': {
		riskLevel: 'read',
		description: 'Get collection access keys',
	},
	'collections.getComments': {
		riskLevel: 'read',
		description: "Get a collection's comments",
	},
	'collections.getPullRequests': {
		riskLevel: 'read',
		description: "Get a collection's pull requests",
	},
	'collections.getRoles': {
		riskLevel: 'read',
		description: "Get a collection's roles",
	},
	'collections.getForks': {
		riskLevel: 'read',
		description: "Get a collection's forks",
	},
	'collections.getDuplicationStatus': {
		riskLevel: 'read',
		description: 'Get duplication task status',
	},
	'environments.getForks': {
		riskLevel: 'read',
		description: "Get an environment's forks",
	},
	'collections.getFolderComments': {
		riskLevel: 'read',
		description: "Get a folder's comments",
	},
	'collections.getFolder': {
		riskLevel: 'read',
		description: 'Get a folder',
	},
	'collections.getGeneratedSpecs': {
		riskLevel: 'read',
		description: 'Get generated spec',
	},
	'monitors.get': {
		riskLevel: 'read',
		description: 'Get a monitor',
	},
	'collections.getRequestComments': {
		riskLevel: 'read',
		description: "Get a request's comments",
	},
	'collections.getRequest': {
		riskLevel: 'read',
		description: 'Get a request',
	},
	'scim.getResourceTypes': {
		riskLevel: 'read',
		description: 'Get resource types',
	},
	'collections.getResponseComments': {
		riskLevel: 'read',
		description: "Get a response's comments",
	},
	'collections.getResponse': {
		riskLevel: 'read',
		description: 'Get a response',
	},
	'apis.getSchemaFileContents': {
		riskLevel: 'read',
		description: 'Get schema file contents (Deprecated by Postman.)',
	},
	'apis.getSchemaFiles': {
		riskLevel: 'read',
		description: 'Get schema files (Deprecated by Postman.)',
	},
	'scim.getServiceConfig': {
		riskLevel: 'read',
		description: 'Get service provider configuration',
	},
	'collections.getSourceStatus': {
		riskLevel: 'read',
		description: "Get source collection's status",
	},
	'specs.getDefinition': {
		riskLevel: 'read',
		description: "Get a spec's definition",
	},
	'specs.getFile': {
		riskLevel: 'read',
		description: 'Get a spec file',
	},
	'specs.getGeneratedCollections': {
		riskLevel: 'read',
		description: "Get a spec's generated collections",
	},
	'specs.getFiles': {
		riskLevel: 'read',
		description: "Get a spec's files",
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Get a team user',
	},
	'workspaces.getActivity': {
		riskLevel: 'read',
		description: "Get a workspace's activity feed",
	},
	'workspaces.get': {
		riskLevel: 'read',
		description: 'Get a workspace',
	},
	'workspaces.getGlobalVariables': {
		riskLevel: 'read',
		description: 'Get global variables',
	},
	'workspaces.getRoles': {
		riskLevel: 'read',
		description: "Get a workspace's roles",
	},
	'environments.get': {
		riskLevel: 'read',
		description: 'Get an environment',
	},
	'collections.create': {
		riskLevel: 'write',
		description: 'Create a collection',
	},
	'collections.createComment': {
		riskLevel: 'write',
		description: 'Create a collection comment',
	},
	'collections.createFolder': {
		riskLevel: 'write',
		description: 'Create a folder',
	},
	'collections.createFolderComment': {
		riskLevel: 'write',
		description: 'Create a folder comment',
	},
	'mocks.create': {
		riskLevel: 'write',
		description: 'Create a mock server',
	},
	'monitors.create': {
		riskLevel: 'write',
		description: 'Create a monitor',
	},
	'collections.createPullRequest': {
		riskLevel: 'write',
		description: 'Create a pull request',
	},
	'collections.createRequestComment': {
		riskLevel: 'write',
		description: 'Create a request comment',
	},
	'collections.createResponse': {
		riskLevel: 'write',
		description: 'Create a response',
	},
	'collections.createResponseComment': {
		riskLevel: 'write',
		description: 'Create a response comment',
	},
	'specs.create': {
		riskLevel: 'write',
		description: 'Create a spec',
	},
	'workspaces.create': {
		riskLevel: 'write',
		description: 'Create a workspace',
	},
	'apis.create': {
		riskLevel: 'write',
		description: 'Create an API (Deprecated by Postman.)',
	},
	'environments.create': {
		riskLevel: 'write',
		description: 'Create an environment',
	},
	'apis.createOrUpdateSchemaFile': {
		riskLevel: 'write',
		description: 'Create or update a schema file (Deprecated by Postman.)',
	},
	'mocks.deleteServerResponse': {
		riskLevel: 'destructive',
		description: 'Delete a server response',
	},
	'monitors.remove': {
		riskLevel: 'destructive',
		description: 'Delete a monitor',
	},
	'specs.deleteFile': {
		riskLevel: 'destructive',
		description: 'Delete a spec file',
	},
	'collections.remove': {
		riskLevel: 'destructive',
		description: 'Delete a collection',
	},
	'collections.deleteFolder': {
		riskLevel: 'destructive',
		description: 'Delete a folder',
	},
	'collections.deleteFolderComment': {
		riskLevel: 'destructive',
		description: "Delete a folder's comment",
	},
	'collections.deleteRequestComment': {
		riskLevel: 'destructive',
		description: "Delete a request's comment",
	},
	'collections.deleteResponse': {
		riskLevel: 'destructive',
		description: 'Delete a response',
	},
	'collections.deleteResponseComment': {
		riskLevel: 'destructive',
		description: "Delete a response's comment",
	},
	'apis.deleteSchemaFile': {
		riskLevel: 'destructive',
		description: 'Delete a schema file (Deprecated by Postman.)',
	},
	'specs.remove': {
		riskLevel: 'destructive',
		description: 'Delete a spec',
	},
	'workspaces.remove': {
		riskLevel: 'destructive',
		description: 'Delete a workspace',
	},
	'collections.deleteComment': {
		riskLevel: 'destructive',
		description: "Delete a collection's comment",
	},
	'apis.remove': {
		riskLevel: 'destructive',
		description: 'Delete an API (Deprecated by Postman.)',
	},
	'apis.deleteComment': {
		riskLevel: 'destructive',
		description: "Delete an API's comment (Deprecated by Postman.)",
	},
	'environments.remove': {
		riskLevel: 'destructive',
		description: 'Delete an environment',
	},
	'collections.duplicate': {
		riskLevel: 'write',
		description: 'Duplicate a collection',
	},
	'collections.fork': {
		riskLevel: 'write',
		description: 'Create a fork',
	},
	'specs.generateCollection': {
		riskLevel: 'write',
		description: 'Generate a collection from spec',
	},
	'collections.generateSpec': {
		riskLevel: 'write',
		description: 'Generate spec from collection',
	},
	'collections.createRequest': {
		riskLevel: 'write',
		description: 'Create a request',
	},
	'specs.createFile': {
		riskLevel: 'write',
		description: 'Create a spec file',
	},
	'environments.fork': {
		riskLevel: 'write',
		description: 'Create a fork',
	},
	'mocks.createServerResponse': {
		riskLevel: 'write',
		description: 'Create a server response',
	},
	'tools.importOpenapi': {
		riskLevel: 'write',
		description: 'Import an OpenAPI definition',
	},
	'billing.listInvoices': {
		riskLevel: 'read',
		description: 'List account invoices',
	},
	'collections.mergeFork': {
		riskLevel: 'write',
		description: 'Merge a fork (Deprecated by Postman.)',
	},
	'environments.mergeFork': {
		riskLevel: 'write',
		description: 'Merge a fork',
	},
	'mocks.publish': {
		riskLevel: 'write',
		description: 'Publish a mock server',
	},
	'collections.pullChanges': {
		riskLevel: 'write',
		description: 'Pull source changes',
	},
	'collections.replace': {
		riskLevel: 'write',
		description: "Replace a collection's data",
	},
	'environments.replace': {
		riskLevel: 'write',
		description: "Replace an environment's data",
	},
	'comments.resolve': {
		riskLevel: 'write',
		description: 'Resolve a comment thread',
	},
	'pullRequests.review': {
		riskLevel: 'write',
		description: 'Review a pull request',
	},
	'monitors.run': {
		riskLevel: 'write',
		description: 'Run a monitor',
	},
	'collections.syncWithSchema': {
		riskLevel: 'write',
		description: 'Sync collection with schema (Deprecated by Postman.)',
	},
	'collections.syncWithSpec': {
		riskLevel: 'write',
		description: 'Sync collection with spec',
	},
	'specs.syncWithCollection': {
		riskLevel: 'write',
		description: 'Sync spec with collection',
	},
	'collections.transferFolders': {
		riskLevel: 'write',
		description: 'Transfer folders',
	},
	'collections.transformToOpenapi': {
		riskLevel: 'read',
		description: 'Transform collection to OpenAPI',
	},
	'collections.update': {
		riskLevel: 'write',
		description: 'Update part of a collection',
	},
	'collections.updateRequest': {
		riskLevel: 'write',
		description: 'Update a request',
	},
	'specs.updateFile': {
		riskLevel: 'write',
		description: 'Update a spec file',
	},
	'specs.update': {
		riskLevel: 'write',
		description: "Update a spec's properties",
	},
	'workspaces.updateGlobalVariables': {
		riskLevel: 'write',
		description: 'Update global variables',
	},
	'collections.updateFolder': {
		riskLevel: 'write',
		description: 'Update a folder',
	},
	'collections.updateFolderComment': {
		riskLevel: 'write',
		description: "Update a folder's comment",
	},
	'mocks.update': {
		riskLevel: 'write',
		description: 'Update a mock server',
	},
	'monitors.update': {
		riskLevel: 'write',
		description: 'Update a monitor',
	},
	'pullRequests.update': {
		riskLevel: 'write',
		description: 'Update a pull request',
	},
	'collections.updateRequestComment': {
		riskLevel: 'write',
		description: "Update a request's comment",
	},
	'collections.updateResponse': {
		riskLevel: 'write',
		description: 'Update a response',
	},
	'collections.updateResponseComment': {
		riskLevel: 'write',
		description: "Update a response's comment",
	},
	'mocks.updateServerResponse': {
		riskLevel: 'write',
		description: 'Update a server response',
	},
	'workspaces.update': {
		riskLevel: 'write',
		description: 'Update a workspace',
	},
	'apis.update': {
		riskLevel: 'write',
		description: 'Update an API (Deprecated by Postman.)',
	},
	'apis.updateComment': {
		riskLevel: 'write',
		description: "Update an API's comment (Deprecated by Postman.)",
	},
	'environments.update': {
		riskLevel: 'write',
		description: 'Update an environment',
	},
	'environments.list': {
		riskLevel: 'read',
		description: 'Get all environments',
	},
	'apis.createRelations': {
		riskLevel: 'write',
		description: 'Create new relations for an API version',
	},
	'apis.getLinkedRelations': {
		riskLevel: 'read',
		description: 'Retrieve all linked relations for a specific API version',
	},
	'apis.getTestRelations': {
		riskLevel: 'read',
		description:
			'Retrieve all test relations for a specific API version (deprecated in Postman v10 and higher) (Deprecated by Postman.)',
	},
	'apis.getContractTestRelations': {
		riskLevel: 'read',
		description:
			'Retrieve contract test relations for a specific API version (Deprecated by Postman.)',
	},
	'apis.getIntegrationTestRelations': {
		riskLevel: 'read',
		description:
			'Retrieve integration test relations for a specific API version (Deprecated by Postman.)',
	},
	'apis.getTestSuiteRelations': {
		riskLevel: 'read',
		description:
			'Retrieve the test suites associated with an API version (deprecated, legacy v9 APIs only) (Deprecated by Postman.)',
	},
	'apis.getDocumentationRelations': {
		riskLevel: 'read',
		description:
			'Get documentation relations for a specific API version (deprecated in Postman v10 and higher) (Deprecated by Postman.)',
	},
	'apis.getEnvironmentRelations': {
		riskLevel: 'read',
		description:
			'Get environment relations for a specific API version (deprecated in Postman v10 and higher) (Deprecated by Postman.)',
	},
	'apis.listReleases': {
		riskLevel: 'read',
		description:
			'List releases for an API version (deprecated in Postman v10 and higher) (Deprecated by Postman.)',
	},
	'apis.getUnclassifiedRelations': {
		riskLevel: 'read',
		description: 'Get unclassified relations for a specific API version',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof postmanEndpointsNested>;

export const postmanAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePostmanPlugin<T extends PostmanPluginOptions> = CorsairPlugin<
	'postman',
	typeof PostmanSchema,
	typeof postmanEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof postmanAuthConfig
>;

export type InternalPostmanPlugin = BasePostmanPlugin<PostmanPluginOptions>;

export type ExternalPostmanPlugin<T extends PostmanPluginOptions> =
	BasePostmanPlugin<T>;

export function postman<const T extends PostmanPluginOptions>(
	incomingOptions: PostmanPluginOptions & T = {} as PostmanPluginOptions & T,
): ExternalPostmanPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'postman',
		authConfig: postmanAuthConfig,
		schema: PostmanSchema,
		options: options,
		hooks: options.hooks,
		endpoints: postmanEndpointsNested,
		webhooks: {},
		endpointMeta: postmanEndpointMeta,
		endpointSchemas: postmanEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: PostmanKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const res = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!res) {
					throw new AuthMissingError('postman', 'api_key');
				}
				return res;
			}

			return '';
		},
	} satisfies InternalPostmanPlugin;
}
