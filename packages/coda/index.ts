import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import {
	Account,
	Analytics,
	Automations,
	Categories,
	Columns,
	Controls,
	Docs,
	Domains,
	Folders,
	Formulas,
	PackAssets,
	PackCategories,
	PackConnections,
	PackFeaturedDocs,
	PackInvitations,
	PackListings,
	PackLogs,
	PackMakers,
	PackPermissions,
	PackReleases,
	Packs,
	PackVersions,
	Pages,
	Permissions,
	Rows,
	Tables,
	Workspaces,
} from './endpoints';
import type {
	CodaEndpointInputs,
	CodaEndpointOutputs,
} from './endpoints/types';
import {
	CodaEndpointInputSchemas,
	CodaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CodaSchema } from './schema';
import { DocWebhooks, PageWebhooks } from './webhooks';
import type { CodaAuditBatch, CodaWebhookOutputs } from './webhooks/types';
import {
	CodaAuditBatchSchema,
	CodaDocEventsSchema,
	CodaPageEventsSchema,
	isCodaWebhook,
} from './webhooks/types';

export type CodaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** Signature key of the Coda Admin API webhook, used to verify X-Webhook-Signature. */
	webhookSecret?: string;
	hooks?: InternalCodaPlugin['hooks'];
	webhookHooks?: InternalCodaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof codaEndpointsNested>;
};

export type CodaContext = CorsairPluginContext<
	typeof CodaSchema,
	CodaPluginOptions
>;

export type CodaKeyBuilderContext = KeyBuilderContext<CodaPluginOptions>;

export type CodaBoundEndpoints = BindEndpoints<typeof codaEndpointsNested>;

type CodaEndpoint<K extends keyof CodaEndpointOutputs> = CorsairEndpoint<
	CodaContext,
	CodaEndpointInputs[K],
	CodaEndpointOutputs[K]
>;

export type CodaEndpoints = {
	accountWhoami: CodaEndpoint<'accountWhoami'>;
	accountResolveBrowserLink: CodaEndpoint<'accountResolveBrowserLink'>;
	accountGetMutationStatus: CodaEndpoint<'accountGetMutationStatus'>;
	categoriesList: CodaEndpoint<'categoriesList'>;
	docsList: CodaEndpoint<'docsList'>;
	docsGet: CodaEndpoint<'docsGet'>;
	docsCreate: CodaEndpoint<'docsCreate'>;
	docsCopy: CodaEndpoint<'docsCopy'>;
	docsUpdate: CodaEndpoint<'docsUpdate'>;
	docsDelete: CodaEndpoint<'docsDelete'>;
	docsPublish: CodaEndpoint<'docsPublish'>;
	docsUnpublish: CodaEndpoint<'docsUnpublish'>;
	permissionsList: CodaEndpoint<'permissionsList'>;
	permissionsAdd: CodaEndpoint<'permissionsAdd'>;
	permissionsDelete: CodaEndpoint<'permissionsDelete'>;
	permissionsSearchPrincipals: CodaEndpoint<'permissionsSearchPrincipals'>;
	permissionsGetSharingMetadata: CodaEndpoint<'permissionsGetSharingMetadata'>;
	permissionsGetAclSettings: CodaEndpoint<'permissionsGetAclSettings'>;
	permissionsUpdateAclSettings: CodaEndpoint<'permissionsUpdateAclSettings'>;
	pagesList: CodaEndpoint<'pagesList'>;
	pagesGet: CodaEndpoint<'pagesGet'>;
	pagesCreate: CodaEndpoint<'pagesCreate'>;
	pagesUpdate: CodaEndpoint<'pagesUpdate'>;
	pagesDelete: CodaEndpoint<'pagesDelete'>;
	pagesListContent: CodaEndpoint<'pagesListContent'>;
	pagesDeleteContent: CodaEndpoint<'pagesDeleteContent'>;
	pagesBeginExport: CodaEndpoint<'pagesBeginExport'>;
	pagesGetExportStatus: CodaEndpoint<'pagesGetExportStatus'>;
	tablesList: CodaEndpoint<'tablesList'>;
	tablesGet: CodaEndpoint<'tablesGet'>;
	columnsList: CodaEndpoint<'columnsList'>;
	columnsGet: CodaEndpoint<'columnsGet'>;
	rowsList: CodaEndpoint<'rowsList'>;
	rowsGet: CodaEndpoint<'rowsGet'>;
	rowsUpsert: CodaEndpoint<'rowsUpsert'>;
	rowsUpdate: CodaEndpoint<'rowsUpdate'>;
	rowsDelete: CodaEndpoint<'rowsDelete'>;
	rowsDeleteMany: CodaEndpoint<'rowsDeleteMany'>;
	rowsPushButton: CodaEndpoint<'rowsPushButton'>;
	formulasList: CodaEndpoint<'formulasList'>;
	formulasGet: CodaEndpoint<'formulasGet'>;
	controlsList: CodaEndpoint<'controlsList'>;
	controlsGet: CodaEndpoint<'controlsGet'>;
	domainsList: CodaEndpoint<'domainsList'>;
	domainsAdd: CodaEndpoint<'domainsAdd'>;
	domainsUpdate: CodaEndpoint<'domainsUpdate'>;
	domainsDelete: CodaEndpoint<'domainsDelete'>;
	domainsGetProvider: CodaEndpoint<'domainsGetProvider'>;
	foldersList: CodaEndpoint<'foldersList'>;
	foldersGet: CodaEndpoint<'foldersGet'>;
	foldersCreate: CodaEndpoint<'foldersCreate'>;
	foldersUpdate: CodaEndpoint<'foldersUpdate'>;
	foldersDelete: CodaEndpoint<'foldersDelete'>;
	automationsTrigger: CodaEndpoint<'automationsTrigger'>;
	analyticsListDocs: CodaEndpoint<'analyticsListDocs'>;
	analyticsListPages: CodaEndpoint<'analyticsListPages'>;
	analyticsGetDocsSummary: CodaEndpoint<'analyticsGetDocsSummary'>;
	analyticsListPacks: CodaEndpoint<'analyticsListPacks'>;
	analyticsGetPacksSummary: CodaEndpoint<'analyticsGetPacksSummary'>;
	analyticsListPackFormulas: CodaEndpoint<'analyticsListPackFormulas'>;
	analyticsGetLastUpdated: CodaEndpoint<'analyticsGetLastUpdated'>;
	workspacesListUsers: CodaEndpoint<'workspacesListUsers'>;
	workspacesListRoles: CodaEndpoint<'workspacesListRoles'>;
	workspacesChangeUserRole: CodaEndpoint<'workspacesChangeUserRole'>;
	packsList: CodaEndpoint<'packsList'>;
	packsGet: CodaEndpoint<'packsGet'>;
	packsCreate: CodaEndpoint<'packsCreate'>;
	packsUpdate: CodaEndpoint<'packsUpdate'>;
	packsDelete: CodaEndpoint<'packsDelete'>;
	packsGetConfigurationSchema: CodaEndpoint<'packsGetConfigurationSchema'>;
	packVersionsList: CodaEndpoint<'packVersionsList'>;
	packVersionsGetNext: CodaEndpoint<'packVersionsGetNext'>;
	packVersionsGetDiff: CodaEndpoint<'packVersionsGetDiff'>;
	packVersionsRegister: CodaEndpoint<'packVersionsRegister'>;
	packVersionsUploadComplete: CodaEndpoint<'packVersionsUploadComplete'>;
	packVersionsUploadSourceCode: CodaEndpoint<'packVersionsUploadSourceCode'>;
	packVersionsSourceCodeUploadComplete: CodaEndpoint<'packVersionsSourceCodeUploadComplete'>;
	packVersionsGetSourceCode: CodaEndpoint<'packVersionsGetSourceCode'>;
	packReleasesList: CodaEndpoint<'packReleasesList'>;
	packReleasesCreate: CodaEndpoint<'packReleasesCreate'>;
	packReleasesUpdate: CodaEndpoint<'packReleasesUpdate'>;
	packAssetsUpload: CodaEndpoint<'packAssetsUpload'>;
	packAssetsUploadComplete: CodaEndpoint<'packAssetsUploadComplete'>;
	packListingsList: CodaEndpoint<'packListingsList'>;
	packListingsGet: CodaEndpoint<'packListingsGet'>;
	packListingsDeleteDraft: CodaEndpoint<'packListingsDeleteDraft'>;
	packPermissionsList: CodaEndpoint<'packPermissionsList'>;
	packPermissionsAdd: CodaEndpoint<'packPermissionsAdd'>;
	packPermissionsDelete: CodaEndpoint<'packPermissionsDelete'>;
	packInvitationsListForUser: CodaEndpoint<'packInvitationsListForUser'>;
	packInvitationsCreate: CodaEndpoint<'packInvitationsCreate'>;
	packMakersList: CodaEndpoint<'packMakersList'>;
	packMakersAdd: CodaEndpoint<'packMakersAdd'>;
	packMakersDelete: CodaEndpoint<'packMakersDelete'>;
	packCategoriesList: CodaEndpoint<'packCategoriesList'>;
	packCategoriesAdd: CodaEndpoint<'packCategoriesAdd'>;
	packCategoriesDelete: CodaEndpoint<'packCategoriesDelete'>;
	packFeaturedDocsList: CodaEndpoint<'packFeaturedDocsList'>;
	packFeaturedDocsUpdate: CodaEndpoint<'packFeaturedDocsUpdate'>;
	packConnectionsGetOauthConfig: CodaEndpoint<'packConnectionsGetOauthConfig'>;
	packConnectionsSetOauthConfig: CodaEndpoint<'packConnectionsSetOauthConfig'>;
	packConnectionsGetSystemConnection: CodaEndpoint<'packConnectionsGetSystemConnection'>;
	packConnectionsSetSystemConnection: CodaEndpoint<'packConnectionsSetSystemConnection'>;
	packConnectionsPatchSystemConnection: CodaEndpoint<'packConnectionsPatchSystemConnection'>;
	packLogsList: CodaEndpoint<'packLogsList'>;
	packLogsListGrouped: CodaEndpoint<'packLogsListGrouped'>;
	packLogsListIngestion: CodaEndpoint<'packLogsListIngestion'>;
	packLogsListGroupedIngestion: CodaEndpoint<'packLogsListGroupedIngestion'>;
	packLogsListIngestionExecutions: CodaEndpoint<'packLogsListIngestionExecutions'>;
	packLogsGetDetails: CodaEndpoint<'packLogsGetDetails'>;
};

type CodaWebhook<K extends keyof CodaWebhookOutputs> = CorsairWebhook<
	CodaContext,
	CodaAuditBatch,
	CodaWebhookOutputs[K]
>;

export type CodaWebhooks = {
	docsCreated: CodaWebhook<'docsCreated'>;
	docsDeleted: CodaWebhook<'docsDeleted'>;
	pagesCreated: CodaWebhook<'pagesCreated'>;
	pagesUpdated: CodaWebhook<'pagesUpdated'>;
};

export type CodaBoundWebhooks = BindWebhooks<CodaWebhooks>;

const codaEndpointsNested = {
	account: {
		whoami: Account.whoami,
		resolveBrowserLink: Account.resolveBrowserLink,
		getMutationStatus: Account.getMutationStatus,
	},
	categories: {
		list: Categories.list,
	},
	docs: {
		list: Docs.list,
		get: Docs.get,
		create: Docs.create,
		copy: Docs.copy,
		update: Docs.update,
		delete: Docs.delete,
		publish: Docs.publish,
		unpublish: Docs.unpublish,
	},
	permissions: {
		list: Permissions.list,
		add: Permissions.add,
		delete: Permissions.delete,
		searchPrincipals: Permissions.searchPrincipals,
		getSharingMetadata: Permissions.getSharingMetadata,
		getAclSettings: Permissions.getAclSettings,
		updateAclSettings: Permissions.updateAclSettings,
	},
	pages: {
		list: Pages.list,
		get: Pages.get,
		create: Pages.create,
		update: Pages.update,
		delete: Pages.delete,
		listContent: Pages.listContent,
		deleteContent: Pages.deleteContent,
		beginExport: Pages.beginExport,
		getExportStatus: Pages.getExportStatus,
	},
	tables: {
		list: Tables.list,
		get: Tables.get,
	},
	columns: {
		list: Columns.list,
		get: Columns.get,
	},
	rows: {
		list: Rows.list,
		get: Rows.get,
		upsert: Rows.upsert,
		update: Rows.update,
		delete: Rows.delete,
		deleteMany: Rows.deleteMany,
		pushButton: Rows.pushButton,
	},
	formulas: {
		list: Formulas.list,
		get: Formulas.get,
	},
	controls: {
		list: Controls.list,
		get: Controls.get,
	},
	domains: {
		list: Domains.list,
		add: Domains.add,
		update: Domains.update,
		delete: Domains.delete,
		getProvider: Domains.getProvider,
	},
	folders: {
		list: Folders.list,
		get: Folders.get,
		create: Folders.create,
		update: Folders.update,
		delete: Folders.delete,
	},
	automations: {
		trigger: Automations.trigger,
	},
	analytics: {
		listDocs: Analytics.listDocs,
		listPages: Analytics.listPages,
		getDocsSummary: Analytics.getDocsSummary,
		listPacks: Analytics.listPacks,
		getPacksSummary: Analytics.getPacksSummary,
		listPackFormulas: Analytics.listPackFormulas,
		getLastUpdated: Analytics.getLastUpdated,
	},
	workspaces: {
		listUsers: Workspaces.listUsers,
		listRoles: Workspaces.listRoles,
		changeUserRole: Workspaces.changeUserRole,
	},
	packs: {
		list: Packs.list,
		get: Packs.get,
		create: Packs.create,
		update: Packs.update,
		delete: Packs.delete,
		getConfigurationSchema: Packs.getConfigurationSchema,
	},
	packVersions: {
		list: PackVersions.list,
		getNext: PackVersions.getNext,
		getDiff: PackVersions.getDiff,
		register: PackVersions.register,
		uploadComplete: PackVersions.uploadComplete,
		uploadSourceCode: PackVersions.uploadSourceCode,
		sourceCodeUploadComplete: PackVersions.sourceCodeUploadComplete,
		getSourceCode: PackVersions.getSourceCode,
	},
	packReleases: {
		list: PackReleases.list,
		create: PackReleases.create,
		update: PackReleases.update,
	},
	packAssets: {
		upload: PackAssets.upload,
		uploadComplete: PackAssets.uploadComplete,
	},
	packListings: {
		list: PackListings.list,
		get: PackListings.get,
		deleteDraft: PackListings.deleteDraft,
	},
	packPermissions: {
		list: PackPermissions.list,
		add: PackPermissions.add,
		delete: PackPermissions.delete,
	},
	packInvitations: {
		listForUser: PackInvitations.listForUser,
		create: PackInvitations.create,
	},
	packMakers: {
		list: PackMakers.list,
		add: PackMakers.add,
		delete: PackMakers.delete,
	},
	packCategories: {
		list: PackCategories.list,
		add: PackCategories.add,
		delete: PackCategories.delete,
	},
	packFeaturedDocs: {
		list: PackFeaturedDocs.list,
		update: PackFeaturedDocs.update,
	},
	packConnections: {
		getOauthConfig: PackConnections.getOauthConfig,
		setOauthConfig: PackConnections.setOauthConfig,
		getSystemConnection: PackConnections.getSystemConnection,
		setSystemConnection: PackConnections.setSystemConnection,
		patchSystemConnection: PackConnections.patchSystemConnection,
	},
	packLogs: {
		list: PackLogs.list,
		listGrouped: PackLogs.listGrouped,
		listIngestion: PackLogs.listIngestion,
		listGroupedIngestion: PackLogs.listGroupedIngestion,
		listIngestionExecutions: PackLogs.listIngestionExecutions,
		getDetails: PackLogs.getDetails,
	},
} as const;

const codaWebhooksNested = {
	docs: {
		created: DocWebhooks.created,
		deleted: DocWebhooks.deleted,
	},
	pages: {
		created: PageWebhooks.created,
		updated: PageWebhooks.updated,
	},
} as const;

export const codaEndpointSchemas = {
	'account.whoami': {
		input: CodaEndpointInputSchemas.accountWhoami,
		output: CodaEndpointOutputSchemas.accountWhoami,
	},
	'account.resolveBrowserLink': {
		input: CodaEndpointInputSchemas.accountResolveBrowserLink,
		output: CodaEndpointOutputSchemas.accountResolveBrowserLink,
	},
	'account.getMutationStatus': {
		input: CodaEndpointInputSchemas.accountGetMutationStatus,
		output: CodaEndpointOutputSchemas.accountGetMutationStatus,
	},
	'categories.list': {
		input: CodaEndpointInputSchemas.categoriesList,
		output: CodaEndpointOutputSchemas.categoriesList,
	},
	'docs.list': {
		input: CodaEndpointInputSchemas.docsList,
		output: CodaEndpointOutputSchemas.docsList,
	},
	'docs.get': {
		input: CodaEndpointInputSchemas.docsGet,
		output: CodaEndpointOutputSchemas.docsGet,
	},
	'docs.create': {
		input: CodaEndpointInputSchemas.docsCreate,
		output: CodaEndpointOutputSchemas.docsCreate,
	},
	'docs.copy': {
		input: CodaEndpointInputSchemas.docsCopy,
		output: CodaEndpointOutputSchemas.docsCopy,
	},
	'docs.update': {
		input: CodaEndpointInputSchemas.docsUpdate,
		output: CodaEndpointOutputSchemas.docsUpdate,
	},
	'docs.delete': {
		input: CodaEndpointInputSchemas.docsDelete,
		output: CodaEndpointOutputSchemas.docsDelete,
	},
	'docs.publish': {
		input: CodaEndpointInputSchemas.docsPublish,
		output: CodaEndpointOutputSchemas.docsPublish,
	},
	'docs.unpublish': {
		input: CodaEndpointInputSchemas.docsUnpublish,
		output: CodaEndpointOutputSchemas.docsUnpublish,
	},
	'permissions.list': {
		input: CodaEndpointInputSchemas.permissionsList,
		output: CodaEndpointOutputSchemas.permissionsList,
	},
	'permissions.add': {
		input: CodaEndpointInputSchemas.permissionsAdd,
		output: CodaEndpointOutputSchemas.permissionsAdd,
	},
	'permissions.delete': {
		input: CodaEndpointInputSchemas.permissionsDelete,
		output: CodaEndpointOutputSchemas.permissionsDelete,
	},
	'permissions.searchPrincipals': {
		input: CodaEndpointInputSchemas.permissionsSearchPrincipals,
		output: CodaEndpointOutputSchemas.permissionsSearchPrincipals,
	},
	'permissions.getSharingMetadata': {
		input: CodaEndpointInputSchemas.permissionsGetSharingMetadata,
		output: CodaEndpointOutputSchemas.permissionsGetSharingMetadata,
	},
	'permissions.getAclSettings': {
		input: CodaEndpointInputSchemas.permissionsGetAclSettings,
		output: CodaEndpointOutputSchemas.permissionsGetAclSettings,
	},
	'permissions.updateAclSettings': {
		input: CodaEndpointInputSchemas.permissionsUpdateAclSettings,
		output: CodaEndpointOutputSchemas.permissionsUpdateAclSettings,
	},
	'pages.list': {
		input: CodaEndpointInputSchemas.pagesList,
		output: CodaEndpointOutputSchemas.pagesList,
	},
	'pages.get': {
		input: CodaEndpointInputSchemas.pagesGet,
		output: CodaEndpointOutputSchemas.pagesGet,
	},
	'pages.create': {
		input: CodaEndpointInputSchemas.pagesCreate,
		output: CodaEndpointOutputSchemas.pagesCreate,
	},
	'pages.update': {
		input: CodaEndpointInputSchemas.pagesUpdate,
		output: CodaEndpointOutputSchemas.pagesUpdate,
	},
	'pages.delete': {
		input: CodaEndpointInputSchemas.pagesDelete,
		output: CodaEndpointOutputSchemas.pagesDelete,
	},
	'pages.listContent': {
		input: CodaEndpointInputSchemas.pagesListContent,
		output: CodaEndpointOutputSchemas.pagesListContent,
	},
	'pages.deleteContent': {
		input: CodaEndpointInputSchemas.pagesDeleteContent,
		output: CodaEndpointOutputSchemas.pagesDeleteContent,
	},
	'pages.beginExport': {
		input: CodaEndpointInputSchemas.pagesBeginExport,
		output: CodaEndpointOutputSchemas.pagesBeginExport,
	},
	'pages.getExportStatus': {
		input: CodaEndpointInputSchemas.pagesGetExportStatus,
		output: CodaEndpointOutputSchemas.pagesGetExportStatus,
	},
	'tables.list': {
		input: CodaEndpointInputSchemas.tablesList,
		output: CodaEndpointOutputSchemas.tablesList,
	},
	'tables.get': {
		input: CodaEndpointInputSchemas.tablesGet,
		output: CodaEndpointOutputSchemas.tablesGet,
	},
	'columns.list': {
		input: CodaEndpointInputSchemas.columnsList,
		output: CodaEndpointOutputSchemas.columnsList,
	},
	'columns.get': {
		input: CodaEndpointInputSchemas.columnsGet,
		output: CodaEndpointOutputSchemas.columnsGet,
	},
	'rows.list': {
		input: CodaEndpointInputSchemas.rowsList,
		output: CodaEndpointOutputSchemas.rowsList,
	},
	'rows.get': {
		input: CodaEndpointInputSchemas.rowsGet,
		output: CodaEndpointOutputSchemas.rowsGet,
	},
	'rows.upsert': {
		input: CodaEndpointInputSchemas.rowsUpsert,
		output: CodaEndpointOutputSchemas.rowsUpsert,
	},
	'rows.update': {
		input: CodaEndpointInputSchemas.rowsUpdate,
		output: CodaEndpointOutputSchemas.rowsUpdate,
	},
	'rows.delete': {
		input: CodaEndpointInputSchemas.rowsDelete,
		output: CodaEndpointOutputSchemas.rowsDelete,
	},
	'rows.deleteMany': {
		input: CodaEndpointInputSchemas.rowsDeleteMany,
		output: CodaEndpointOutputSchemas.rowsDeleteMany,
	},
	'rows.pushButton': {
		input: CodaEndpointInputSchemas.rowsPushButton,
		output: CodaEndpointOutputSchemas.rowsPushButton,
	},
	'formulas.list': {
		input: CodaEndpointInputSchemas.formulasList,
		output: CodaEndpointOutputSchemas.formulasList,
	},
	'formulas.get': {
		input: CodaEndpointInputSchemas.formulasGet,
		output: CodaEndpointOutputSchemas.formulasGet,
	},
	'controls.list': {
		input: CodaEndpointInputSchemas.controlsList,
		output: CodaEndpointOutputSchemas.controlsList,
	},
	'controls.get': {
		input: CodaEndpointInputSchemas.controlsGet,
		output: CodaEndpointOutputSchemas.controlsGet,
	},
	'domains.list': {
		input: CodaEndpointInputSchemas.domainsList,
		output: CodaEndpointOutputSchemas.domainsList,
	},
	'domains.add': {
		input: CodaEndpointInputSchemas.domainsAdd,
		output: CodaEndpointOutputSchemas.domainsAdd,
	},
	'domains.update': {
		input: CodaEndpointInputSchemas.domainsUpdate,
		output: CodaEndpointOutputSchemas.domainsUpdate,
	},
	'domains.delete': {
		input: CodaEndpointInputSchemas.domainsDelete,
		output: CodaEndpointOutputSchemas.domainsDelete,
	},
	'domains.getProvider': {
		input: CodaEndpointInputSchemas.domainsGetProvider,
		output: CodaEndpointOutputSchemas.domainsGetProvider,
	},
	'folders.list': {
		input: CodaEndpointInputSchemas.foldersList,
		output: CodaEndpointOutputSchemas.foldersList,
	},
	'folders.get': {
		input: CodaEndpointInputSchemas.foldersGet,
		output: CodaEndpointOutputSchemas.foldersGet,
	},
	'folders.create': {
		input: CodaEndpointInputSchemas.foldersCreate,
		output: CodaEndpointOutputSchemas.foldersCreate,
	},
	'folders.update': {
		input: CodaEndpointInputSchemas.foldersUpdate,
		output: CodaEndpointOutputSchemas.foldersUpdate,
	},
	'folders.delete': {
		input: CodaEndpointInputSchemas.foldersDelete,
		output: CodaEndpointOutputSchemas.foldersDelete,
	},
	'automations.trigger': {
		input: CodaEndpointInputSchemas.automationsTrigger,
		output: CodaEndpointOutputSchemas.automationsTrigger,
	},
	'analytics.listDocs': {
		input: CodaEndpointInputSchemas.analyticsListDocs,
		output: CodaEndpointOutputSchemas.analyticsListDocs,
	},
	'analytics.listPages': {
		input: CodaEndpointInputSchemas.analyticsListPages,
		output: CodaEndpointOutputSchemas.analyticsListPages,
	},
	'analytics.getDocsSummary': {
		input: CodaEndpointInputSchemas.analyticsGetDocsSummary,
		output: CodaEndpointOutputSchemas.analyticsGetDocsSummary,
	},
	'analytics.listPacks': {
		input: CodaEndpointInputSchemas.analyticsListPacks,
		output: CodaEndpointOutputSchemas.analyticsListPacks,
	},
	'analytics.getPacksSummary': {
		input: CodaEndpointInputSchemas.analyticsGetPacksSummary,
		output: CodaEndpointOutputSchemas.analyticsGetPacksSummary,
	},
	'analytics.listPackFormulas': {
		input: CodaEndpointInputSchemas.analyticsListPackFormulas,
		output: CodaEndpointOutputSchemas.analyticsListPackFormulas,
	},
	'analytics.getLastUpdated': {
		input: CodaEndpointInputSchemas.analyticsGetLastUpdated,
		output: CodaEndpointOutputSchemas.analyticsGetLastUpdated,
	},
	'workspaces.listUsers': {
		input: CodaEndpointInputSchemas.workspacesListUsers,
		output: CodaEndpointOutputSchemas.workspacesListUsers,
	},
	'workspaces.listRoles': {
		input: CodaEndpointInputSchemas.workspacesListRoles,
		output: CodaEndpointOutputSchemas.workspacesListRoles,
	},
	'workspaces.changeUserRole': {
		input: CodaEndpointInputSchemas.workspacesChangeUserRole,
		output: CodaEndpointOutputSchemas.workspacesChangeUserRole,
	},
	'packs.list': {
		input: CodaEndpointInputSchemas.packsList,
		output: CodaEndpointOutputSchemas.packsList,
	},
	'packs.get': {
		input: CodaEndpointInputSchemas.packsGet,
		output: CodaEndpointOutputSchemas.packsGet,
	},
	'packs.create': {
		input: CodaEndpointInputSchemas.packsCreate,
		output: CodaEndpointOutputSchemas.packsCreate,
	},
	'packs.update': {
		input: CodaEndpointInputSchemas.packsUpdate,
		output: CodaEndpointOutputSchemas.packsUpdate,
	},
	'packs.delete': {
		input: CodaEndpointInputSchemas.packsDelete,
		output: CodaEndpointOutputSchemas.packsDelete,
	},
	'packs.getConfigurationSchema': {
		input: CodaEndpointInputSchemas.packsGetConfigurationSchema,
		output: CodaEndpointOutputSchemas.packsGetConfigurationSchema,
	},
	'packVersions.list': {
		input: CodaEndpointInputSchemas.packVersionsList,
		output: CodaEndpointOutputSchemas.packVersionsList,
	},
	'packVersions.getNext': {
		input: CodaEndpointInputSchemas.packVersionsGetNext,
		output: CodaEndpointOutputSchemas.packVersionsGetNext,
	},
	'packVersions.getDiff': {
		input: CodaEndpointInputSchemas.packVersionsGetDiff,
		output: CodaEndpointOutputSchemas.packVersionsGetDiff,
	},
	'packVersions.register': {
		input: CodaEndpointInputSchemas.packVersionsRegister,
		output: CodaEndpointOutputSchemas.packVersionsRegister,
	},
	'packVersions.uploadComplete': {
		input: CodaEndpointInputSchemas.packVersionsUploadComplete,
		output: CodaEndpointOutputSchemas.packVersionsUploadComplete,
	},
	'packVersions.uploadSourceCode': {
		input: CodaEndpointInputSchemas.packVersionsUploadSourceCode,
		output: CodaEndpointOutputSchemas.packVersionsUploadSourceCode,
	},
	'packVersions.sourceCodeUploadComplete': {
		input: CodaEndpointInputSchemas.packVersionsSourceCodeUploadComplete,
		output: CodaEndpointOutputSchemas.packVersionsSourceCodeUploadComplete,
	},
	'packVersions.getSourceCode': {
		input: CodaEndpointInputSchemas.packVersionsGetSourceCode,
		output: CodaEndpointOutputSchemas.packVersionsGetSourceCode,
	},
	'packReleases.list': {
		input: CodaEndpointInputSchemas.packReleasesList,
		output: CodaEndpointOutputSchemas.packReleasesList,
	},
	'packReleases.create': {
		input: CodaEndpointInputSchemas.packReleasesCreate,
		output: CodaEndpointOutputSchemas.packReleasesCreate,
	},
	'packReleases.update': {
		input: CodaEndpointInputSchemas.packReleasesUpdate,
		output: CodaEndpointOutputSchemas.packReleasesUpdate,
	},
	'packAssets.upload': {
		input: CodaEndpointInputSchemas.packAssetsUpload,
		output: CodaEndpointOutputSchemas.packAssetsUpload,
	},
	'packAssets.uploadComplete': {
		input: CodaEndpointInputSchemas.packAssetsUploadComplete,
		output: CodaEndpointOutputSchemas.packAssetsUploadComplete,
	},
	'packListings.list': {
		input: CodaEndpointInputSchemas.packListingsList,
		output: CodaEndpointOutputSchemas.packListingsList,
	},
	'packListings.get': {
		input: CodaEndpointInputSchemas.packListingsGet,
		output: CodaEndpointOutputSchemas.packListingsGet,
	},
	'packListings.deleteDraft': {
		input: CodaEndpointInputSchemas.packListingsDeleteDraft,
		output: CodaEndpointOutputSchemas.packListingsDeleteDraft,
	},
	'packPermissions.list': {
		input: CodaEndpointInputSchemas.packPermissionsList,
		output: CodaEndpointOutputSchemas.packPermissionsList,
	},
	'packPermissions.add': {
		input: CodaEndpointInputSchemas.packPermissionsAdd,
		output: CodaEndpointOutputSchemas.packPermissionsAdd,
	},
	'packPermissions.delete': {
		input: CodaEndpointInputSchemas.packPermissionsDelete,
		output: CodaEndpointOutputSchemas.packPermissionsDelete,
	},
	'packInvitations.listForUser': {
		input: CodaEndpointInputSchemas.packInvitationsListForUser,
		output: CodaEndpointOutputSchemas.packInvitationsListForUser,
	},
	'packInvitations.create': {
		input: CodaEndpointInputSchemas.packInvitationsCreate,
		output: CodaEndpointOutputSchemas.packInvitationsCreate,
	},
	'packMakers.list': {
		input: CodaEndpointInputSchemas.packMakersList,
		output: CodaEndpointOutputSchemas.packMakersList,
	},
	'packMakers.add': {
		input: CodaEndpointInputSchemas.packMakersAdd,
		output: CodaEndpointOutputSchemas.packMakersAdd,
	},
	'packMakers.delete': {
		input: CodaEndpointInputSchemas.packMakersDelete,
		output: CodaEndpointOutputSchemas.packMakersDelete,
	},
	'packCategories.list': {
		input: CodaEndpointInputSchemas.packCategoriesList,
		output: CodaEndpointOutputSchemas.packCategoriesList,
	},
	'packCategories.add': {
		input: CodaEndpointInputSchemas.packCategoriesAdd,
		output: CodaEndpointOutputSchemas.packCategoriesAdd,
	},
	'packCategories.delete': {
		input: CodaEndpointInputSchemas.packCategoriesDelete,
		output: CodaEndpointOutputSchemas.packCategoriesDelete,
	},
	'packFeaturedDocs.list': {
		input: CodaEndpointInputSchemas.packFeaturedDocsList,
		output: CodaEndpointOutputSchemas.packFeaturedDocsList,
	},
	'packFeaturedDocs.update': {
		input: CodaEndpointInputSchemas.packFeaturedDocsUpdate,
		output: CodaEndpointOutputSchemas.packFeaturedDocsUpdate,
	},
	'packConnections.getOauthConfig': {
		input: CodaEndpointInputSchemas.packConnectionsGetOauthConfig,
		output: CodaEndpointOutputSchemas.packConnectionsGetOauthConfig,
	},
	'packConnections.setOauthConfig': {
		input: CodaEndpointInputSchemas.packConnectionsSetOauthConfig,
		output: CodaEndpointOutputSchemas.packConnectionsSetOauthConfig,
	},
	'packConnections.getSystemConnection': {
		input: CodaEndpointInputSchemas.packConnectionsGetSystemConnection,
		output: CodaEndpointOutputSchemas.packConnectionsGetSystemConnection,
	},
	'packConnections.setSystemConnection': {
		input: CodaEndpointInputSchemas.packConnectionsSetSystemConnection,
		output: CodaEndpointOutputSchemas.packConnectionsSetSystemConnection,
	},
	'packConnections.patchSystemConnection': {
		input: CodaEndpointInputSchemas.packConnectionsPatchSystemConnection,
		output: CodaEndpointOutputSchemas.packConnectionsPatchSystemConnection,
	},
	'packLogs.list': {
		input: CodaEndpointInputSchemas.packLogsList,
		output: CodaEndpointOutputSchemas.packLogsList,
	},
	'packLogs.listGrouped': {
		input: CodaEndpointInputSchemas.packLogsListGrouped,
		output: CodaEndpointOutputSchemas.packLogsListGrouped,
	},
	'packLogs.listIngestion': {
		input: CodaEndpointInputSchemas.packLogsListIngestion,
		output: CodaEndpointOutputSchemas.packLogsListIngestion,
	},
	'packLogs.listGroupedIngestion': {
		input: CodaEndpointInputSchemas.packLogsListGroupedIngestion,
		output: CodaEndpointOutputSchemas.packLogsListGroupedIngestion,
	},
	'packLogs.listIngestionExecutions': {
		input: CodaEndpointInputSchemas.packLogsListIngestionExecutions,
		output: CodaEndpointOutputSchemas.packLogsListIngestionExecutions,
	},
	'packLogs.getDetails': {
		input: CodaEndpointInputSchemas.packLogsGetDetails,
		output: CodaEndpointOutputSchemas.packLogsGetDetails,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof codaEndpointsNested>;

const codaWebhookSchemas = {
	'docs.created': {
		description: 'A doc was created or copied in the organization',
		payload: CodaAuditBatchSchema,
		response: CodaDocEventsSchema,
	},
	'docs.deleted': {
		description: 'A doc was deleted in the organization',
		payload: CodaAuditBatchSchema,
		response: CodaDocEventsSchema,
	},
	'pages.created': {
		description: 'A page was added to a doc',
		payload: CodaAuditBatchSchema,
		response: CodaPageEventsSchema,
	},
	'pages.updated': {
		description: 'A page in a doc was edited, renamed or moved',
		payload: CodaAuditBatchSchema,
		response: CodaPageEventsSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof codaWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const codaEndpointMeta = {
	'account.whoami': {
		riskLevel: 'read',
		description: 'Get info about the user that owns the API token',
	},
	'account.resolveBrowserLink': {
		riskLevel: 'read',
		description: 'Resolve a Coda browser URL to the API object it points at',
	},
	'account.getMutationStatus': {
		riskLevel: 'read',
		description: 'Check whether an asynchronous mutation has been applied',
	},
	'categories.list': {
		riskLevel: 'read',
		description: 'List the categories available for docs',
	},
	'docs.list': {
		riskLevel: 'read',
		description: 'List docs the user can access',
	},
	'docs.get': {
		riskLevel: 'read',
		description: 'Get metadata for a doc',
	},
	'docs.create': {
		riskLevel: 'write',
		description: 'Create a new doc',
	},
	'docs.copy': {
		riskLevel: 'write',
		description: 'Create a copy of an existing doc',
	},
	'docs.update': {
		riskLevel: 'write',
		description: 'Update the title or icon of a doc',
	},
	'docs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a doc',
	},
	'docs.publish': {
		riskLevel: 'write',
		description: 'Publish a doc or update its publish settings',
	},
	'docs.unpublish': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Unpublish a doc',
	},
	'permissions.list': {
		riskLevel: 'read',
		description: 'List the sharing permissions of a doc',
	},
	'permissions.add': {
		riskLevel: 'write',
		description: 'Share a doc with a user, domain or anyone',
	},
	'permissions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a sharing permission from a doc',
	},
	'permissions.searchPrincipals': {
		riskLevel: 'read',
		description: 'Search users and groups a doc can be shared with',
	},
	'permissions.getSharingMetadata': {
		riskLevel: 'read',
		description: 'Get sharing capabilities of the user for a doc',
	},
	'permissions.getAclSettings': {
		riskLevel: 'read',
		description: 'Get the access control settings of a doc',
	},
	'permissions.updateAclSettings': {
		riskLevel: 'write',
		description: 'Update the access control settings of a doc',
	},
	'pages.list': {
		riskLevel: 'read',
		description: 'List pages in a doc',
	},
	'pages.get': {
		riskLevel: 'read',
		description: 'Get details about a page',
	},
	'pages.create': {
		riskLevel: 'write',
		description: 'Create a new page in a doc',
	},
	'pages.update': {
		riskLevel: 'write',
		description: 'Update the properties or content of a page',
	},
	'pages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a page',
	},
	'pages.listContent': {
		riskLevel: 'read',
		description: 'List the content elements of a page',
	},
	'pages.deleteContent': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete content elements from a page',
	},
	'pages.beginExport': {
		riskLevel: 'write',
		description: 'Start an asynchronous export of page content',
	},
	'pages.getExportStatus': {
		riskLevel: 'read',
		description: 'Check the status of a page content export',
	},
	'tables.list': {
		riskLevel: 'read',
		description: 'List tables and views in a doc',
	},
	'tables.get': {
		riskLevel: 'read',
		description: 'Get details about a table or view',
	},
	'columns.list': {
		riskLevel: 'read',
		description: 'List columns in a table',
	},
	'columns.get': {
		riskLevel: 'read',
		description: 'Get details about a column',
	},
	'rows.list': {
		riskLevel: 'read',
		description: 'List rows in a table',
	},
	'rows.get': {
		riskLevel: 'read',
		description: 'Get a row in a table',
	},
	'rows.upsert': {
		riskLevel: 'write',
		description:
			'Insert rows into a table, or update them when key columns match',
	},
	'rows.update': {
		riskLevel: 'write',
		description: 'Update a row in a table',
	},
	'rows.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a row from a table',
	},
	'rows.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete several rows from a table',
	},
	'rows.pushButton': {
		riskLevel: 'write',
		description: 'Push a button column in a row',
	},
	'formulas.list': {
		riskLevel: 'read',
		description: 'List named formulas in a doc',
	},
	'formulas.get': {
		riskLevel: 'read',
		description: 'Get a named formula and its value',
	},
	'controls.list': {
		riskLevel: 'read',
		description: 'List controls in a doc',
	},
	'controls.get': {
		riskLevel: 'read',
		description: 'Get a control and its value',
	},
	'domains.list': {
		riskLevel: 'read',
		description: 'List custom domains of a published doc',
	},
	'domains.add': {
		riskLevel: 'write',
		description: 'Add a custom domain to a published doc',
	},
	'domains.update': {
		riskLevel: 'write',
		description: 'Update a custom domain of a published doc',
	},
	'domains.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a custom domain from a published doc',
	},
	'domains.getProvider': {
		riskLevel: 'read',
		description: 'Identify the registrar of a custom domain',
	},
	'folders.list': {
		riskLevel: 'read',
		description: 'List folders the user can access',
	},
	'folders.get': {
		riskLevel: 'read',
		description: 'Get metadata about a folder',
	},
	'folders.create': {
		riskLevel: 'write',
		description: 'Create a folder in a workspace',
	},
	'folders.update': {
		riskLevel: 'write',
		description: 'Update the name or description of a folder',
	},
	'folders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a folder',
	},
	'automations.trigger': {
		riskLevel: 'write',
		description: 'Trigger a webhook-invoked automation in a doc',
	},
	'analytics.listDocs': {
		riskLevel: 'read',
		description: 'List analytics for docs',
	},
	'analytics.listPages': {
		riskLevel: 'read',
		description: 'List page-level analytics for a doc',
	},
	'analytics.getDocsSummary': {
		riskLevel: 'read',
		description: 'Get a summary of doc analytics',
	},
	'analytics.listPacks': {
		riskLevel: 'read',
		description: 'List analytics for Packs the user can edit',
	},
	'analytics.getPacksSummary': {
		riskLevel: 'read',
		description: 'Get a summary of Pack analytics',
	},
	'analytics.listPackFormulas': {
		riskLevel: 'read',
		description: 'List analytics for the formulas of a Pack',
	},
	'analytics.getLastUpdated': {
		riskLevel: 'read',
		description: 'Get the days analytics were last updated',
	},
	'workspaces.listUsers': {
		riskLevel: 'read',
		description: 'List members of a workspace',
	},
	'workspaces.listRoles': {
		riskLevel: 'read',
		description: 'List user counts by role over time for a workspace',
	},
	'workspaces.changeUserRole': {
		riskLevel: 'write',
		description: 'Change the role of a workspace member',
	},
	'packs.list': {
		riskLevel: 'read',
		description: 'List Packs the user can access',
	},
	'packs.get': {
		riskLevel: 'read',
		description: 'Get a Pack',
	},
	'packs.create': {
		riskLevel: 'write',
		description: 'Create a Pack',
	},
	'packs.update': {
		riskLevel: 'write',
		description: 'Update the metadata of a Pack',
	},
	'packs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Pack',
	},
	'packs.getConfigurationSchema': {
		riskLevel: 'read',
		description: 'Get the JSON Schema of the configuration of a Pack',
	},
	'packVersions.list': {
		riskLevel: 'read',
		description: 'List the versions of a Pack',
	},
	'packVersions.getNext': {
		riskLevel: 'write',
		description: 'Get the next valid version number for a Pack',
	},
	'packVersions.getDiff': {
		riskLevel: 'read',
		description: 'Get the differences between two Pack versions',
	},
	'packVersions.register': {
		riskLevel: 'write',
		description:
			'Register a new Pack version and get an upload URL for its bundle',
	},
	'packVersions.uploadComplete': {
		riskLevel: 'write',
		description: 'Mark the upload of a Pack version bundle as complete',
	},
	'packVersions.uploadSourceCode': {
		riskLevel: 'write',
		description: 'Get a signed URL to upload the source code of a Pack version',
	},
	'packVersions.sourceCodeUploadComplete': {
		riskLevel: 'write',
		description: 'Mark the upload of Pack source code as complete',
	},
	'packVersions.getSourceCode': {
		riskLevel: 'read',
		description: 'Get download URLs for the source code of a Pack version',
	},
	'packReleases.list': {
		riskLevel: 'read',
		description: 'List the releases of a Pack',
	},
	'packReleases.create': {
		riskLevel: 'write',
		description: 'Release a Pack version',
	},
	'packReleases.update': {
		riskLevel: 'write',
		description: 'Update the release notes of a Pack release',
	},
	'packAssets.upload': {
		riskLevel: 'write',
		description: 'Get a signed URL to upload a Pack asset',
	},
	'packAssets.uploadComplete': {
		riskLevel: 'write',
		description: 'Mark the upload of a Pack asset as complete',
	},
	'packListings.list': {
		riskLevel: 'read',
		description: 'List the Pack listings the user can access',
	},
	'packListings.get': {
		riskLevel: 'read',
		description: 'Get the public listing of a Pack',
	},
	'packListings.deleteDraft': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete the listing draft of a Pack',
	},
	'packPermissions.list': {
		riskLevel: 'read',
		description: 'List the permissions of a Pack',
	},
	'packPermissions.add': {
		riskLevel: 'write',
		description: 'Grant a principal access to a Pack',
	},
	'packPermissions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a permission from a Pack',
	},
	'packInvitations.listForUser': {
		riskLevel: 'read',
		description: 'List pending Pack invitations for the user',
	},
	'packInvitations.create': {
		riskLevel: 'write',
		description: 'Invite a user to collaborate on a Pack',
	},
	'packMakers.list': {
		riskLevel: 'read',
		description: 'List the makers of a Pack',
	},
	'packMakers.add': {
		riskLevel: 'write',
		description: 'Add a maker to a Pack',
	},
	'packMakers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a maker from a Pack',
	},
	'packCategories.list': {
		riskLevel: 'read',
		description: 'List the publishing categories of a Pack',
	},
	'packCategories.add': {
		riskLevel: 'write',
		description: 'Add a publishing category to a Pack',
	},
	'packCategories.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a publishing category from a Pack',
	},
	'packFeaturedDocs.list': {
		riskLevel: 'read',
		description: 'List the featured docs of a Pack',
	},
	'packFeaturedDocs.update': {
		riskLevel: 'write',
		description: 'Replace the featured docs of a Pack',
	},
	'packConnections.getOauthConfig': {
		riskLevel: 'read',
		description: 'Get the OAuth configuration of a Pack',
	},
	'packConnections.setOauthConfig': {
		riskLevel: 'write',
		description: 'Set the OAuth client credentials of a Pack',
	},
	'packConnections.getSystemConnection': {
		riskLevel: 'read',
		description: 'Get the system connection metadata of a Pack',
	},
	'packConnections.setSystemConnection': {
		riskLevel: 'write',
		description: 'Set the system connection credentials of a Pack',
	},
	'packConnections.patchSystemConnection': {
		riskLevel: 'write',
		description: 'Patch the system connection credentials of a Pack',
	},
	'packLogs.list': {
		riskLevel: 'read',
		description: 'List the execution logs of a Pack in a doc',
	},
	'packLogs.listGrouped': {
		riskLevel: 'read',
		description:
			'List the execution logs of a Pack in a doc grouped by invocation',
	},
	'packLogs.listIngestion': {
		riskLevel: 'read',
		description: 'List the logs of a Pack ingestion',
	},
	'packLogs.listGroupedIngestion': {
		riskLevel: 'read',
		description: 'List the logs of a Pack ingestion grouped by invocation',
	},
	'packLogs.listIngestionExecutions': {
		riskLevel: 'read',
		description: 'List the batch executions of a Pack ingestion',
	},
	'packLogs.getDetails': {
		riskLevel: 'read',
		description: 'Get the details of a Pack ingestion log entry',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof codaEndpointsNested>;

export const codaAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCodaPlugin<T extends CodaPluginOptions> = CorsairPlugin<
	'coda',
	typeof CodaSchema,
	typeof codaEndpointsNested,
	typeof codaWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCodaPlugin = BaseCodaPlugin<CodaPluginOptions>;

export type ExternalCodaPlugin<T extends CodaPluginOptions> = BaseCodaPlugin<T>;

export function coda<const T extends CodaPluginOptions>(
	// Safe: every field of CodaPluginOptions is optional, so an empty object is a valid value for any T the caller omits.
	// A narrower type is not practical because T is the caller's literal options type, which `{}` cannot be inferred as.
	incomingOptions: CodaPluginOptions & T = {} as CodaPluginOptions & T,
): ExternalCodaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'coda',
		authConfig: codaAuthConfig,
		schema: CodaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: codaEndpointsNested,
		webhooks: codaWebhooksNested,
		endpointMeta: codaEndpointMeta,
		endpointSchemas: codaEndpointSchemas,
		webhookSchemas: codaWebhookSchemas,
		pluginWebhookMatcher: isCodaWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CodaKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalCodaPlugin;
}

export type * from './endpoints/types';
export type {
	CodaAuditBatch,
	CodaDocAuditEvent,
	CodaDocEvents,
	CodaPageAuditEvent,
	CodaPageEvents,
	CodaWebhookOutputs,
} from './webhooks/types';
