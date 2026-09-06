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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';

import {
	Account,
	ApiApps,
	BulkSend,
	Drafts,
	Embedded,
	FaxAndReports,
	SignatureRequests,
	Teams,
	Templates,
} from './endpoints';

import type {
	DropboxSignEndpointInputs,
	DropboxSignEndpointOutputs,
} from './endpoints/types';

import {
	DropboxSignEndpointInputSchemas,
	DropboxSignEndpointOutputSchemas,
} from './endpoints/types';

import { errorHandlers } from './error-handlers';
import { DropboxSignSchema } from './schema';

export type DropboxSignPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalDropboxSignPlugin['hooks'];
	webhookHooks?: InternalDropboxSignPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dropboxSignEndpointsNested>;
};

export type DropboxSignContext = CorsairPluginContext<
	typeof DropboxSignSchema,
	DropboxSignPluginOptions
>;

export type DropboxSignKeyBuilderContext =
	KeyBuilderContext<DropboxSignPluginOptions>;

export type DropboxSignBoundEndpoints = BindEndpoints<
	typeof dropboxSignEndpointsNested
>;

type DropboxSignEndpoint<K extends keyof DropboxSignEndpointOutputs> =
	CorsairEndpoint<
		DropboxSignContext,
		DropboxSignEndpointInputs[K],
		DropboxSignEndpointOutputs[K]
	>;

export type DropboxSignEndpoints = {
	getAccount: DropboxSignEndpoint<'getAccount'>;
	createAccount: DropboxSignEndpoint<'createAccount'>;
	updateAccount: DropboxSignEndpoint<'updateAccount'>;
	verifyAccount: DropboxSignEndpoint<'verifyAccount'>;

	getSignatureRequest: DropboxSignEndpoint<'getSignatureRequest'>;
	listSignatureRequests: DropboxSignEndpoint<'listSignatureRequests'>;
	sendSignatureRequest: DropboxSignEndpoint<'sendSignatureRequest'>;
	createEmbeddedSignatureRequest: DropboxSignEndpoint<'createEmbeddedSignatureRequest'>;
	createEmbeddedSignatureRequestWithTemplate: DropboxSignEndpoint<'createEmbeddedSignatureRequestWithTemplate'>;
	cancelSignatureRequest: DropboxSignEndpoint<'cancelSignatureRequest'>;
	sendRequestReminder: DropboxSignEndpoint<'sendRequestReminder'>;
	updateSignatureRequest: DropboxSignEndpoint<'updateSignatureRequest'>;
	downloadSignatureRequestFiles: DropboxSignEndpoint<'downloadSignatureRequestFiles'>;
	getSignatureRequestFilesAsFileUrl: DropboxSignEndpoint<'getSignatureRequestFilesAsFileUrl'>;
	getSignatureRequestFilesAsDataUri: DropboxSignEndpoint<'getSignatureRequestFilesAsDataUri'>;
	releaseSignatureRequestHold: DropboxSignEndpoint<'releaseSignatureRequestHold'>;
	editAndResendSignatureRequest: DropboxSignEndpoint<'editAndResendSignatureRequest'>;
	editAndResendEmbeddedSignatureRequest: DropboxSignEndpoint<'editAndResendEmbeddedSignatureRequest'>;
	editAndResendEmbeddedSignatureRequestTemplate: DropboxSignEndpoint<'editAndResendEmbeddedSignatureRequestTemplate'>;

	getTemplate: DropboxSignEndpoint<'getTemplate'>;
	listTemplates: DropboxSignEndpoint<'listTemplates'>;
	createTemplate: DropboxSignEndpoint<'createTemplate'>;
	createEmbeddedTemplateDraft: DropboxSignEndpoint<'createEmbeddedTemplateDraft'>;
	deleteTemplate: DropboxSignEndpoint<'deleteTemplate'>;
	addUserToTemplate: DropboxSignEndpoint<'addUserToTemplate'>;
	removeUserFromTemplate: DropboxSignEndpoint<'removeUserFromTemplate'>;
	getTemplateFiles: DropboxSignEndpoint<'getTemplateFiles'>;
	getTemplateFilesAsFileUrl: DropboxSignEndpoint<'getTemplateFilesAsFileUrl'>;
	getTemplateFilesAsDataUri: DropboxSignEndpoint<'getTemplateFilesAsDataUri'>;
	updateTemplateFiles: DropboxSignEndpoint<'updateTemplateFiles'>;

	createUnclaimedDraft: DropboxSignEndpoint<'createUnclaimedDraft'>;
	createEmbeddedUnclaimedDraftWithTemplate: DropboxSignEndpoint<'createEmbeddedUnclaimedDraftWithTemplate'>;
	editAndResendUnclaimedDraft: DropboxSignEndpoint<'editAndResendUnclaimedDraft'>;

	getEmbeddedSignUrl: DropboxSignEndpoint<'getEmbeddedSignUrl'>;
	getEmbeddedTemplateEditUrl: DropboxSignEndpoint<'getEmbeddedTemplateEditUrl'>;

	bulkSendWithTemplate: DropboxSignEndpoint<'bulkSendWithTemplate'>;
	bulkCreateEmbeddedSigReqWithTemplate: DropboxSignEndpoint<'bulkCreateEmbeddedSigReqWithTemplate'>;
	getBulkSendJob: DropboxSignEndpoint<'getBulkSendJob'>;
	listBulkSendJobs: DropboxSignEndpoint<'listBulkSendJobs'>;

	getTeamInfo: DropboxSignEndpoint<'getTeamInfo'>;
	getCurrentTeam: DropboxSignEndpoint<'getCurrentTeam'>;
	listTeams: DropboxSignEndpoint<'listTeams'>;
	listSubTeams: DropboxSignEndpoint<'listSubTeams'>;
	listTeamMembers: DropboxSignEndpoint<'listTeamMembers'>;
	addUserToTeam: DropboxSignEndpoint<'addUserToTeam'>;

	getApiApp: DropboxSignEndpoint<'getApiApp'>;
	listApiApps: DropboxSignEndpoint<'listApiApps'>;
	createApiApp: DropboxSignEndpoint<'createApiApp'>;
	updateApiApp: DropboxSignEndpoint<'updateApiApp'>;
	deleteApiApp: DropboxSignEndpoint<'deleteApiApp'>;
	oAuthAuthorize: DropboxSignEndpoint<'oAuthAuthorize'>;

	listFaxes: DropboxSignEndpoint<'listFaxes'>;
	deleteFax: DropboxSignEndpoint<'deleteFax'>;
	listFaxLines: DropboxSignEndpoint<'listFaxLines'>;
	getFaxLineAreaCodes: DropboxSignEndpoint<'getFaxLineAreaCodes'>;
	createReport: DropboxSignEndpoint<'createReport'>;
};

export type DropboxSignWebhooks = Record<string, never>;
export type DropboxSignBoundWebhooks = Record<string, never>;

const dropboxSignEndpointsNested = {
	account: {
		get: Account.getAccount,
		create: Account.createAccount,
		update: Account.updateAccount,
		verify: Account.verifyAccount,
	},
	signatureRequests: {
		get: SignatureRequests.getSignatureRequest,
		list: SignatureRequests.listSignatureRequests,
		send: SignatureRequests.sendSignatureRequest,
		createEmbedded: SignatureRequests.createEmbeddedSignatureRequest,
		createEmbeddedWithTemplate:
			SignatureRequests.createEmbeddedSignatureRequestWithTemplate,
		cancel: SignatureRequests.cancelSignatureRequest,
		remind: SignatureRequests.sendRequestReminder,
		update: SignatureRequests.updateSignatureRequest,
		downloadFiles: SignatureRequests.downloadSignatureRequestFiles,
		getFilesAsFileUrl: SignatureRequests.getSignatureRequestFilesAsFileUrl,
		getFilesAsDataUri: SignatureRequests.getSignatureRequestFilesAsDataUri,
		releaseHold: SignatureRequests.releaseSignatureRequestHold,
		editAndResend: SignatureRequests.editAndResendSignatureRequest,
		editAndResendEmbedded:
			SignatureRequests.editAndResendEmbeddedSignatureRequest,
		editAndResendEmbeddedTemplate:
			SignatureRequests.editAndResendEmbeddedSignatureRequestTemplate,
	},
	templates: {
		get: Templates.getTemplate,
		list: Templates.listTemplates,
		create: Templates.createTemplate,
		createEmbeddedDraft: Templates.createEmbeddedTemplateDraft,
		delete: Templates.deleteTemplate,
		addUser: Templates.addUserToTemplate,
		removeUser: Templates.removeUserFromTemplate,
		getFiles: Templates.getTemplateFiles,
		getFilesAsFileUrl: Templates.getTemplateFilesAsFileUrl,
		getFilesAsDataUri: Templates.getTemplateFilesAsDataUri,
		updateFiles: Templates.updateTemplateFiles,
	},
	drafts: {
		createUnclaimed: Drafts.createUnclaimedDraft,
		createEmbeddedUnclaimedWithTemplate:
			Drafts.createEmbeddedUnclaimedDraftWithTemplate,
		editAndResendUnclaimed: Drafts.editAndResendUnclaimedDraft,
	},
	embedded: {
		getSignUrl: Embedded.getEmbeddedSignUrl,
		getTemplateEditUrl: Embedded.getEmbeddedTemplateEditUrl,
	},
	bulkSend: {
		sendWithTemplate: BulkSend.bulkSendWithTemplate,
		createEmbeddedWithTemplate: BulkSend.bulkCreateEmbeddedSigReqWithTemplate,
		getJob: BulkSend.getBulkSendJob,
		listJobs: BulkSend.listBulkSendJobs,
	},
	teams: {
		getInfo: Teams.getTeamInfo,
		getCurrent: Teams.getCurrentTeam,
		list: Teams.listTeams,
		listSubTeams: Teams.listSubTeams,
		listMembers: Teams.listTeamMembers,
		addMember: Teams.addUserToTeam,
	},
	apiApps: {
		get: ApiApps.getApiApp,
		list: ApiApps.listApiApps,
		create: ApiApps.createApiApp,
		update: ApiApps.updateApiApp,
		delete: ApiApps.deleteApiApp,
		authorize: ApiApps.oAuthAuthorize,
	},
	faxAndReports: {
		listFaxes: FaxAndReports.listFaxes,
		deleteFax: FaxAndReports.deleteFax,
		listFaxLines: FaxAndReports.listFaxLines,
		getAreaCodes: FaxAndReports.getFaxLineAreaCodes,
		createReport: FaxAndReports.createReport,
	},
} as const;

const dropboxSignWebhooksNested = {} as const;

export const dropboxSignEndpointSchemas = {
	'account.get': {
		input: DropboxSignEndpointInputSchemas.getAccount,
		output: DropboxSignEndpointOutputSchemas.getAccount,
	},
	'account.create': {
		input: DropboxSignEndpointInputSchemas.createAccount,
		output: DropboxSignEndpointOutputSchemas.createAccount,
	},
	'account.update': {
		input: DropboxSignEndpointInputSchemas.updateAccount,
		output: DropboxSignEndpointOutputSchemas.updateAccount,
	},
	'account.verify': {
		input: DropboxSignEndpointInputSchemas.verifyAccount,
		output: DropboxSignEndpointOutputSchemas.verifyAccount,
	},

	'signatureRequests.get': {
		input: DropboxSignEndpointInputSchemas.getSignatureRequest,
		output: DropboxSignEndpointOutputSchemas.getSignatureRequest,
	},
	'signatureRequests.list': {
		input: DropboxSignEndpointInputSchemas.listSignatureRequests,
		output: DropboxSignEndpointOutputSchemas.listSignatureRequests,
	},
	'signatureRequests.send': {
		input: DropboxSignEndpointInputSchemas.sendSignatureRequest,
		output: DropboxSignEndpointOutputSchemas.sendSignatureRequest,
	},
	'signatureRequests.createEmbedded': {
		input: DropboxSignEndpointInputSchemas.createEmbeddedSignatureRequest,
		output: DropboxSignEndpointOutputSchemas.createEmbeddedSignatureRequest,
	},
	'signatureRequests.createEmbeddedWithTemplate': {
		input:
			DropboxSignEndpointInputSchemas.createEmbeddedSignatureRequestWithTemplate,
		output:
			DropboxSignEndpointOutputSchemas.createEmbeddedSignatureRequestWithTemplate,
	},
	'signatureRequests.cancel': {
		input: DropboxSignEndpointInputSchemas.cancelSignatureRequest,
		output: DropboxSignEndpointOutputSchemas.cancelSignatureRequest,
	},
	'signatureRequests.remind': {
		input: DropboxSignEndpointInputSchemas.sendRequestReminder,
		output: DropboxSignEndpointOutputSchemas.sendRequestReminder,
	},
	'signatureRequests.update': {
		input: DropboxSignEndpointInputSchemas.updateSignatureRequest,
		output: DropboxSignEndpointOutputSchemas.updateSignatureRequest,
	},
	'signatureRequests.downloadFiles': {
		input: DropboxSignEndpointInputSchemas.downloadSignatureRequestFiles,
		output: DropboxSignEndpointOutputSchemas.downloadSignatureRequestFiles,
	},
	'signatureRequests.getFilesAsFileUrl': {
		input: DropboxSignEndpointInputSchemas.getSignatureRequestFilesAsFileUrl,
		output: DropboxSignEndpointOutputSchemas.getSignatureRequestFilesAsFileUrl,
	},
	'signatureRequests.getFilesAsDataUri': {
		input: DropboxSignEndpointInputSchemas.getSignatureRequestFilesAsDataUri,
		output: DropboxSignEndpointOutputSchemas.getSignatureRequestFilesAsDataUri,
	},
	'signatureRequests.releaseHold': {
		input: DropboxSignEndpointInputSchemas.releaseSignatureRequestHold,
		output: DropboxSignEndpointOutputSchemas.releaseSignatureRequestHold,
	},
	'signatureRequests.editAndResend': {
		input: DropboxSignEndpointInputSchemas.editAndResendSignatureRequest,
		output: DropboxSignEndpointOutputSchemas.editAndResendSignatureRequest,
	},
	'signatureRequests.editAndResendEmbedded': {
		input:
			DropboxSignEndpointInputSchemas.editAndResendEmbeddedSignatureRequest,
		output:
			DropboxSignEndpointOutputSchemas.editAndResendEmbeddedSignatureRequest,
	},
	'signatureRequests.editAndResendEmbeddedTemplate': {
		input:
			DropboxSignEndpointInputSchemas.editAndResendEmbeddedSignatureRequestTemplate,
		output:
			DropboxSignEndpointOutputSchemas.editAndResendEmbeddedSignatureRequestTemplate,
	},

	'templates.get': {
		input: DropboxSignEndpointInputSchemas.getTemplate,
		output: DropboxSignEndpointOutputSchemas.getTemplate,
	},
	'templates.list': {
		input: DropboxSignEndpointInputSchemas.listTemplates,
		output: DropboxSignEndpointOutputSchemas.listTemplates,
	},
	'templates.create': {
		input: DropboxSignEndpointInputSchemas.createTemplate,
		output: DropboxSignEndpointOutputSchemas.createTemplate,
	},
	'templates.createEmbeddedDraft': {
		input: DropboxSignEndpointInputSchemas.createEmbeddedTemplateDraft,
		output: DropboxSignEndpointOutputSchemas.createEmbeddedTemplateDraft,
	},
	'templates.delete': {
		input: DropboxSignEndpointInputSchemas.deleteTemplate,
		output: DropboxSignEndpointOutputSchemas.deleteTemplate,
	},
	'templates.addUser': {
		input: DropboxSignEndpointInputSchemas.addUserToTemplate,
		output: DropboxSignEndpointOutputSchemas.addUserToTemplate,
	},
	'templates.removeUser': {
		input: DropboxSignEndpointInputSchemas.removeUserFromTemplate,
		output: DropboxSignEndpointOutputSchemas.removeUserFromTemplate,
	},
	'templates.getFiles': {
		input: DropboxSignEndpointInputSchemas.getTemplateFiles,
		output: DropboxSignEndpointOutputSchemas.getTemplateFiles,
	},
	'templates.getFilesAsFileUrl': {
		input: DropboxSignEndpointInputSchemas.getTemplateFilesAsFileUrl,
		output: DropboxSignEndpointOutputSchemas.getTemplateFilesAsFileUrl,
	},
	'templates.getFilesAsDataUri': {
		input: DropboxSignEndpointInputSchemas.getTemplateFilesAsDataUri,
		output: DropboxSignEndpointOutputSchemas.getTemplateFilesAsDataUri,
	},
	'templates.updateFiles': {
		input: DropboxSignEndpointInputSchemas.updateTemplateFiles,
		output: DropboxSignEndpointOutputSchemas.updateTemplateFiles,
	},

	'drafts.createUnclaimed': {
		input: DropboxSignEndpointInputSchemas.createUnclaimedDraft,
		output: DropboxSignEndpointOutputSchemas.createUnclaimedDraft,
	},
	'drafts.createEmbeddedUnclaimedWithTemplate': {
		input:
			DropboxSignEndpointInputSchemas.createEmbeddedUnclaimedDraftWithTemplate,
		output:
			DropboxSignEndpointOutputSchemas.createEmbeddedUnclaimedDraftWithTemplate,
	},
	'drafts.editAndResendUnclaimed': {
		input: DropboxSignEndpointInputSchemas.editAndResendUnclaimedDraft,
		output: DropboxSignEndpointOutputSchemas.editAndResendUnclaimedDraft,
	},

	'embedded.getSignUrl': {
		input: DropboxSignEndpointInputSchemas.getEmbeddedSignUrl,
		output: DropboxSignEndpointOutputSchemas.getEmbeddedSignUrl,
	},
	'embedded.getTemplateEditUrl': {
		input: DropboxSignEndpointInputSchemas.getEmbeddedTemplateEditUrl,
		output: DropboxSignEndpointOutputSchemas.getEmbeddedTemplateEditUrl,
	},

	'bulkSend.sendWithTemplate': {
		input: DropboxSignEndpointInputSchemas.bulkSendWithTemplate,
		output: DropboxSignEndpointOutputSchemas.bulkSendWithTemplate,
	},
	'bulkSend.createEmbeddedWithTemplate': {
		input: DropboxSignEndpointInputSchemas.bulkCreateEmbeddedSigReqWithTemplate,
		output:
			DropboxSignEndpointOutputSchemas.bulkCreateEmbeddedSigReqWithTemplate,
	},
	'bulkSend.getJob': {
		input: DropboxSignEndpointInputSchemas.getBulkSendJob,
		output: DropboxSignEndpointOutputSchemas.getBulkSendJob,
	},
	'bulkSend.listJobs': {
		input: DropboxSignEndpointInputSchemas.listBulkSendJobs,
		output: DropboxSignEndpointOutputSchemas.listBulkSendJobs,
	},

	'teams.getInfo': {
		input: DropboxSignEndpointInputSchemas.getTeamInfo,
		output: DropboxSignEndpointOutputSchemas.getTeamInfo,
	},
	'teams.getCurrent': {
		input: DropboxSignEndpointInputSchemas.getCurrentTeam,
		output: DropboxSignEndpointOutputSchemas.getCurrentTeam,
	},
	'teams.list': {
		input: DropboxSignEndpointInputSchemas.listTeams,
		output: DropboxSignEndpointOutputSchemas.listTeams,
	},
	'teams.listSubTeams': {
		input: DropboxSignEndpointInputSchemas.listSubTeams,
		output: DropboxSignEndpointOutputSchemas.listSubTeams,
	},
	'teams.listMembers': {
		input: DropboxSignEndpointInputSchemas.listTeamMembers,
		output: DropboxSignEndpointOutputSchemas.listTeamMembers,
	},
	'teams.addMember': {
		input: DropboxSignEndpointInputSchemas.addUserToTeam,
		output: DropboxSignEndpointOutputSchemas.addUserToTeam,
	},

	'apiApps.get': {
		input: DropboxSignEndpointInputSchemas.getApiApp,
		output: DropboxSignEndpointOutputSchemas.getApiApp,
	},
	'apiApps.list': {
		input: DropboxSignEndpointInputSchemas.listApiApps,
		output: DropboxSignEndpointOutputSchemas.listApiApps,
	},
	'apiApps.create': {
		input: DropboxSignEndpointInputSchemas.createApiApp,
		output: DropboxSignEndpointOutputSchemas.createApiApp,
	},
	'apiApps.update': {
		input: DropboxSignEndpointInputSchemas.updateApiApp,
		output: DropboxSignEndpointOutputSchemas.updateApiApp,
	},
	'apiApps.delete': {
		input: DropboxSignEndpointInputSchemas.deleteApiApp,
		output: DropboxSignEndpointOutputSchemas.deleteApiApp,
	},
	'apiApps.authorize': {
		input: DropboxSignEndpointInputSchemas.oAuthAuthorize,
		output: DropboxSignEndpointOutputSchemas.oAuthAuthorize,
	},

	'faxAndReports.listFaxes': {
		input: DropboxSignEndpointInputSchemas.listFaxes,
		output: DropboxSignEndpointOutputSchemas.listFaxes,
	},
	'faxAndReports.deleteFax': {
		input: DropboxSignEndpointInputSchemas.deleteFax,
		output: DropboxSignEndpointOutputSchemas.deleteFax,
	},
	'faxAndReports.listFaxLines': {
		input: DropboxSignEndpointInputSchemas.listFaxLines,
		output: DropboxSignEndpointOutputSchemas.listFaxLines,
	},
	'faxAndReports.getAreaCodes': {
		input: DropboxSignEndpointInputSchemas.getFaxLineAreaCodes,
		output: DropboxSignEndpointOutputSchemas.getFaxLineAreaCodes,
	},
	'faxAndReports.createReport': {
		input: DropboxSignEndpointInputSchemas.createReport,
		output: DropboxSignEndpointOutputSchemas.createReport,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof dropboxSignEndpointsNested
>;

const dropboxSignWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof dropboxSignWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const dropboxSignEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description: 'Retrieves detailed information about a Dropbox Sign account',
	},
	'account.create': {
		riskLevel: 'write',
		description: 'Creates a new Dropbox Sign account',
	},
	'account.update': {
		riskLevel: 'write',
		description: 'Updates Dropbox Sign account settings',
	},
	'account.verify': {
		riskLevel: 'read',
		description: 'Verifies whether a Dropbox Sign account exists',
	},

	'signatureRequests.get': {
		riskLevel: 'read',
		description: 'Retrieves details of a signature request',
	},
	'signatureRequests.list': {
		riskLevel: 'read',
		description: 'Lists signature requests',
	},
	'signatureRequests.send': {
		riskLevel: 'write',
		description: 'Sends a signature request',
	},
	'signatureRequests.createEmbedded': {
		riskLevel: 'write',
		description: 'Creates an embedded signature request',
	},
	'signatureRequests.createEmbeddedWithTemplate': {
		riskLevel: 'write',
		description: 'Creates an embedded signature request with template',
	},
	'signatureRequests.cancel': {
		riskLevel: 'write',
		description: 'Cancels an incomplete signature request',
	},
	'signatureRequests.remind': {
		riskLevel: 'write',
		description: 'Sends a reminder to a signer',
	},
	'signatureRequests.update': {
		riskLevel: 'write',
		description: 'Updates signer contact information on signature request',
	},
	'signatureRequests.downloadFiles': {
		riskLevel: 'read',
		description: 'Downloads signature request files',
	},
	'signatureRequests.getFilesAsFileUrl': {
		riskLevel: 'read',
		description: 'Gets temporary file URL for signature request',
	},
	'signatureRequests.getFilesAsDataUri': {
		riskLevel: 'read',
		description: 'Gets signature request files as Data URI',
	},
	'signatureRequests.releaseHold': {
		riskLevel: 'write',
		description: 'Releases a held signature request',
	},
	'signatureRequests.editAndResend': {
		riskLevel: 'write',
		description: 'Edits and resends a signature request',
	},
	'signatureRequests.editAndResendEmbedded': {
		riskLevel: 'write',
		description: 'Edits and resends an embedded signature request',
	},
	'signatureRequests.editAndResendEmbeddedTemplate': {
		riskLevel: 'write',
		description:
			'Edits and resends an embedded signature request with template',
	},

	'templates.get': {
		riskLevel: 'read',
		description: 'Retrieves a template by ID',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'Lists templates',
	},
	'templates.create': {
		riskLevel: 'write',
		description: 'Creates a reusable template',
	},
	'templates.createEmbeddedDraft': {
		riskLevel: 'write',
		description: 'Creates an embedded template draft',
	},
	'templates.delete': {
		riskLevel: 'write',
		description: 'Deletes a template',
	},
	'templates.addUser': {
		riskLevel: 'write',
		description: 'Adds user access to template',
	},
	'templates.removeUser': {
		riskLevel: 'write',
		description: 'Removes user access from template',
	},
	'templates.getFiles': {
		riskLevel: 'read',
		description: 'Downloads template documents',
	},
	'templates.getFilesAsFileUrl': {
		riskLevel: 'read',
		description: 'Gets template files as URL',
	},
	'templates.getFilesAsDataUri': {
		riskLevel: 'read',
		description: 'Gets template files as Data URI',
	},
	'templates.updateFiles': {
		riskLevel: 'write',
		description: 'Updates files for a template',
	},

	'drafts.createUnclaimed': {
		riskLevel: 'write',
		description: 'Creates an unclaimed draft',
	},
	'drafts.createEmbeddedUnclaimedWithTemplate': {
		riskLevel: 'write',
		description: 'Creates embedded unclaimed draft with template',
	},
	'drafts.editAndResendUnclaimed': {
		riskLevel: 'write',
		description: 'Edits and resends an unclaimed draft',
	},

	'embedded.getSignUrl': {
		riskLevel: 'read',
		description: 'Gets embedded signing URL',
	},
	'embedded.getTemplateEditUrl': {
		riskLevel: 'read',
		description: 'Gets embedded template edit URL',
	},

	'bulkSend.sendWithTemplate': {
		riskLevel: 'write',
		description: 'Bulk sends signature requests with template',
	},
	'bulkSend.createEmbeddedWithTemplate': {
		riskLevel: 'write',
		description: 'Bulk creates embedded signature requests with template',
	},
	'bulkSend.getJob': {
		riskLevel: 'read',
		description: 'Gets bulk send job status',
	},
	'bulkSend.listJobs': {
		riskLevel: 'read',
		description: 'Lists bulk send jobs',
	},

	'teams.getInfo': {
		riskLevel: 'read',
		description: 'Retrieves team details',
	},
	'teams.getCurrent': {
		riskLevel: 'read',
		description: 'Gets current team membership',
	},
	'teams.list': {
		riskLevel: 'read',
		description: 'Lists all accessible teams',
	},
	'teams.listSubTeams': {
		riskLevel: 'read',
		description: 'Lists sub-teams for a team',
	},
	'teams.listMembers': {
		riskLevel: 'read',
		description: 'Lists team members',
	},
	'teams.addMember': {
		riskLevel: 'write',
		description: 'Invites or adds a user to team',
	},

	'apiApps.get': {
		riskLevel: 'read',
		description: 'Retrieves API App details',
	},
	'apiApps.list': {
		riskLevel: 'read',
		description: 'Lists API Apps',
	},
	'apiApps.create': {
		riskLevel: 'write',
		description: 'Creates a new API App',
	},
	'apiApps.update': {
		riskLevel: 'write',
		description: 'Updates an existing API App',
	},
	'apiApps.delete': {
		riskLevel: 'write',
		description: 'Deletes an API App',
	},
	'apiApps.authorize': {
		riskLevel: 'read',
		description: 'Generates OAuth authorization URL',
	},

	'faxAndReports.listFaxes': {
		riskLevel: 'read',
		description: 'Lists faxes',
	},
	'faxAndReports.deleteFax': {
		riskLevel: 'write',
		description: 'Deletes a fax',
	},
	'faxAndReports.listFaxLines': {
		riskLevel: 'read',
		description: 'Lists fax lines',
	},
	'faxAndReports.getAreaCodes': {
		riskLevel: 'read',
		description: 'Gets available fax line area codes',
	},
	'faxAndReports.createReport': {
		riskLevel: 'write',
		description: 'Requests CSV report generation',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof dropboxSignEndpointsNested
>;

const dropboxSignAuthConfig = {
	api_key: {},
	oauth_2: {},
} as const satisfies PluginAuthConfig;

export type BaseDropboxSignPlugin<T extends DropboxSignPluginOptions> =
	CorsairPlugin<
		'dropboxsign',
		typeof DropboxSignSchema,
		typeof dropboxSignEndpointsNested,
		typeof dropboxSignWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalDropboxSignPlugin =
	BaseDropboxSignPlugin<DropboxSignPluginOptions>;
export type ExternalDropboxSignPlugin<T extends DropboxSignPluginOptions> =
	BaseDropboxSignPlugin<T>;

/**
 * Dropbox Sign plugin factory for Corsair.
 * Provides electronic signature, template, team, and API app workflows.
 */
export function dropboxsign<const T extends DropboxSignPluginOptions>(
	incomingOptions: DropboxSignPluginOptions &
		T = {} as DropboxSignPluginOptions & T,
): ExternalDropboxSignPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dropboxsign',
		authConfig: dropboxSignAuthConfig,
		schema: DropboxSignSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: dropboxSignEndpointsNested,
		webhooks: dropboxSignWebhooksNested,
		endpointMeta: dropboxSignEndpointMeta,
		endpointSchemas: dropboxSignEndpointSchemas,
		webhookSchemas: dropboxSignWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DropboxSignKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}
			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}
			return '';
		},
	} satisfies InternalDropboxSignPlugin;
}

export type {
	DropboxSignEndpointInputs,
	DropboxSignEndpointOutputs,
} from './endpoints/types';
export { DropboxSignSchema };
