// Generated with endpoints/operation-types.ts from Baserow's OpenAPI spec:
// one entry per operation in baserow-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { baserowSchemaEntry } from './openapi-schema';
import { createBaserowOperation as op } from './operations';

export const baserowEndpointsNested = {
	abuseReports: {
		create: op('abuseReports.create'),
	},
	admin: {
		addUserToLicense: op('admin.addUserToLicense'),
		approveUserTemplate: op('admin.approveUserTemplate'),
		blockUserTemplate: op('admin.blockUserTemplate'),
		checkLicense: op('admin.checkLicense'),
		countUserTemplates: op('admin.countUserTemplates'),
		createUser: op('admin.createUser'),
		dataScanner: {
			createScan: op('admin.dataScanner.createScan'),
			deleteResult: op('admin.dataScanner.deleteResult'),
			deleteScan: op('admin.dataScanner.deleteScan'),
			exportResults: op('admin.dataScanner.exportResults'),
			getScan: op('admin.dataScanner.getScan'),
			getWorkspaceStructure: op('admin.dataScanner.getWorkspaceStructure'),
			listResults: op('admin.dataScanner.listResults'),
			listScans: op('admin.dataScanner.listScans'),
			triggerScan: op('admin.dataScanner.triggerScan'),
			updateScan: op('admin.dataScanner.updateScan'),
		},
		deleteAllUsersFromLicense: op('admin.deleteAllUsersFromLicense'),
		deleteLicense: op('admin.deleteLicense'),
		deleteUser: op('admin.deleteUser'),
		deleteUserFromLicense: op('admin.deleteUserFromLicense'),
		deleteWorkspace: op('admin.deleteWorkspace'),
		disableUserTwoFactorAuth: op('admin.disableUserTwoFactorAuth'),
		fillLicenseSeats: op('admin.fillLicenseSeats'),
		getDashboard: op('admin.getDashboard'),
		getLicense: op('admin.getLicense'),
		impersonateUser: op('admin.impersonateUser'),
		listLicenses: op('admin.listLicenses'),
		listUserTemplates: op('admin.listUserTemplates'),
		listUsers: op('admin.listUsers'),
		listViews: op('admin.listViews'),
		listWorkspaces: op('admin.listWorkspaces'),
		listWorkspacesAsOptions: op('admin.listWorkspacesAsOptions'),
		lookupLicenseUsers: op('admin.lookupLicenseUsers'),
		registerLicense: op('admin.registerLicense'),
		rejectUserTemplate: op('admin.rejectUserTemplate'),
		rotateViewSlug: op('admin.rotateViewSlug'),
		unblockUserTemplate: op('admin.unblockUserTemplate'),
		updateUser: op('admin.updateUser'),
		updateView: op('admin.updateView'),
	},
	agents: {
		createAction: op('agents.createAction'),
		createConversation: op('agents.createConversation'),
		createMessage: op('agents.createMessage'),
		createTrigger: op('agents.createTrigger'),
		decideToolApprovals: op('agents.decideToolApprovals'),
		deleteAction: op('agents.deleteAction'),
		deleteConversation: op('agents.deleteConversation'),
		deleteTrigger: op('agents.deleteTrigger'),
		get: op('agents.get'),
		getAction: op('agents.getAction'),
		getConfiguration: op('agents.getConfiguration'),
		listActions: op('agents.listActions'),
		listConversations: op('agents.listConversations'),
		listMessages: op('agents.listMessages'),
		listRunAsIdentities: op('agents.listRunAsIdentities'),
		listTriggerTypes: op('agents.listTriggerTypes'),
		listTriggers: op('agents.listTriggers'),
		load: op('agents.load'),
		updateAction: op('agents.updateAction'),
		updateConfiguration: op('agents.updateConfiguration'),
		updateConversation: op('agents.updateConversation'),
		updateTrigger: op('agents.updateTrigger'),
	},
	aiProviders: {
		create: op('aiProviders.create'),
		createModel: op('aiProviders.createModel'),
		delete: op('aiProviders.delete'),
		deleteModel: op('aiProviders.deleteModel'),
		discoverModels: op('aiProviders.discoverModels'),
		getModelUsage: op('aiProviders.getModelUsage'),
		list: op('aiProviders.list'),
		listFeatureSettings: op('aiProviders.listFeatureSettings'),
		listTypes: op('aiProviders.listTypes'),
		testModels: op('aiProviders.testModels'),
		update: op('aiProviders.update'),
		updateFeatureSetting: op('aiProviders.updateFeatureSetting'),
		updateModel: op('aiProviders.updateModel'),
	},
	applications: {
		create: op('applications.create'),
		delete: op('applications.delete'),
		duplicateAsync: op('applications.duplicateAsync'),
		get: op('applications.get'),
		list: op('applications.list'),
		listAll: op('applications.listAll'),
		order: op('applications.order'),
		update: op('applications.update'),
	},
	assistant: {
		cancelMessage: op('assistant.cancelMessage'),
		getOnboardingPromptSuggestions: op(
			'assistant.getOnboardingPromptSuggestions',
		),
		listChatMessages: op('assistant.listChatMessages'),
		listChats: op('assistant.listChats'),
		sendMessage: op('assistant.sendMessage'),
		submitMessageFeedback: op('assistant.submitMessageFeedback'),
	},
	auditLog: {
		adminExport: op('auditLog.adminExport'),
		adminList: op('auditLog.adminList'),
		adminListActionTypes: op('auditLog.adminListActionTypes'),
		adminListActors: op('auditLog.adminListActors'),
		export: op('auditLog.export'),
		list: op('auditLog.list'),
		listActionTypes: op('auditLog.listActionTypes'),
		listActors: op('auditLog.listActors'),
	},
	auth: {
		configureTwoFactor: op('auth.configureTwoFactor'),
		createProvider: op('auth.createProvider'),
		deleteProvider: op('auth.deleteProvider'),
		disableTwoFactor: op('auth.disableTwoFactor'),
		getProvider: op('auth.getProvider'),
		listProviders: op('auth.listProviders'),
		listProvidersLoginOptions: op('auth.listProvidersLoginOptions'),
		providerLoginUrl: op('auth.providerLoginUrl'),
		twoFactorConfiguration: op('auth.twoFactorConfiguration'),
		updateProvider: op('auth.updateProvider'),
		verifyTotp: op('auth.verifyTotp'),
	},
	automations: {
		history: {
			cancelWorkflow: op('automations.history.cancelWorkflow'),
			getNodeResult: op('automations.history.getNodeResult'),
			listNodeHistories: op('automations.history.listNodeHistories'),
		},
		nodes: {
			create: op('automations.nodes.create'),
			delete: op('automations.nodes.delete'),
			duplicate: op('automations.nodes.duplicate'),
			list: op('automations.nodes.list'),
			move: op('automations.nodes.move'),
			replace: op('automations.nodes.replace'),
			simulateDispatch: op('automations.nodes.simulateDispatch'),
			update: op('automations.nodes.update'),
		},
		workflows: {
			create: op('automations.workflows.create'),
			delete: op('automations.workflows.delete'),
			duplicateAsync: op('automations.workflows.duplicateAsync'),
			get: op('automations.workflows.get'),
			getHistory: op('automations.workflows.getHistory'),
			order: op('automations.workflows.order'),
			publish: op('automations.workflows.publish'),
			test: op('automations.workflows.test'),
			update: op('automations.workflows.update'),
		},
	},
	builder: {
		dataSources: {
			create: op('builder.dataSources.create'),
			delete: op('builder.dataSources.delete'),
			dispatch: op('builder.dataSources.dispatch'),
			dispatchAll: op('builder.dataSources.dispatchAll'),
			dispatchAllPublic: op('builder.dataSources.dispatchAllPublic'),
			dispatchPublic: op('builder.dataSources.dispatchPublic'),
			getRecordNames: op('builder.dataSources.getRecordNames'),
			list: op('builder.dataSources.list'),
			listPublic: op('builder.dataSources.listPublic'),
			move: op('builder.dataSources.move'),
			simulateDispatch: op('builder.dataSources.simulateDispatch'),
			update: op('builder.dataSources.update'),
		},
		domains: {
			askPublicExists: op('builder.domains.askPublicExists'),
			create: op('builder.domains.create'),
			delete: op('builder.domains.delete'),
			list: op('builder.domains.list'),
			order: op('builder.domains.order'),
			publish: op('builder.domains.publish'),
			update: op('builder.domains.update'),
		},
		elements: {
			create: op('builder.elements.create'),
			delete: op('builder.elements.delete'),
			duplicate: op('builder.elements.duplicate'),
			list: op('builder.elements.list'),
			listPublic: op('builder.elements.listPublic'),
			move: op('builder.elements.move'),
			update: op('builder.elements.update'),
		},
		pages: {
			create: op('builder.pages.create'),
			delete: op('builder.pages.delete'),
			duplicateAsync: op('builder.pages.duplicateAsync'),
			order: op('builder.pages.order'),
			update: op('builder.pages.update'),
		},
		preview: {
			createGrant: op('builder.preview.createGrant'),
			exchangeGrant: op('builder.preview.exchangeGrant'),
			exchangeHandoff: op('builder.preview.exchangeHandoff'),
		},
		public: {
			getByDomainName: op('builder.public.getByDomainName'),
			getById: op('builder.public.getById'),
			getCustomCss: op('builder.public.getCustomCss'),
			getCustomHtml: op('builder.public.getCustomHtml'),
			getCustomJs: op('builder.public.getCustomJs'),
			getPreviewCustomCss: op('builder.public.getPreviewCustomCss'),
			getPreviewCustomHtml: op('builder.public.getPreviewCustomHtml'),
			getPreviewCustomJs: op('builder.public.getPreviewCustomJs'),
		},
		theme: {
			update: op('builder.theme.update'),
		},
		workflowActions: {
			create: op('builder.workflowActions.create'),
			delete: op('builder.workflowActions.delete'),
			dispatch: op('builder.workflowActions.dispatch'),
			list: op('builder.workflowActions.list'),
			listPublic: op('builder.workflowActions.listPublic'),
			order: op('builder.workflowActions.order'),
			update: op('builder.workflowActions.update'),
		},
	},
	chatRuns: {
		cancel: op('chatRuns.cancel'),
		get: op('chatRuns.get'),
		stream: op('chatRuns.stream'),
	},
	dashboards: {
		dataSources: {
			dispatch: op('dashboards.dataSources.dispatch'),
			list: op('dashboards.dataSources.list'),
			update: op('dashboards.dataSources.update'),
		},
		public: {
			dispatchDataSource: op('dashboards.public.dispatchDataSource'),
			getAuthInfo: op('dashboards.public.getAuthInfo'),
			getInfo: op('dashboards.public.getInfo'),
			tokenAuth: op('dashboards.public.tokenAuth'),
		},
		rotateSlug: op('dashboards.rotateSlug'),
		updatePremiumAttributes: op('dashboards.updatePremiumAttributes'),
		updateSharing: op('dashboards.updateSharing'),
		widgets: {
			create: op('dashboards.widgets.create'),
			delete: op('dashboards.widgets.delete'),
			list: op('dashboards.widgets.list'),
			update: op('dashboards.widgets.update'),
			updateLayout: op('dashboards.widgets.updateLayout'),
		},
	},
	databaseTokens: {
		check: op('databaseTokens.check'),
		create: op('databaseTokens.create'),
		delete: op('databaseTokens.delete'),
		get: op('databaseTokens.get'),
		list: op('databaseTokens.list'),
		update: op('databaseTokens.update'),
	},
	fields: {
		changePrimary: op('fields.changePrimary'),
		create: op('fields.create'),
		createWorkflowAction: op('fields.createWorkflowAction'),
		delete: op('fields.delete'),
		deleteWorkflowAction: op('fields.deleteWorkflowAction'),
		dispatchWorkflowActions: op('fields.dispatchWorkflowActions'),
		duplicate: op('fields.duplicate'),
		generateAiValue: op('fields.generateAiValue'),
		generateFormulaWithAi: op('fields.generateFormulaWithAi'),
		get: op('fields.get'),
		getUniqueRowValues: op('fields.getUniqueRowValues'),
		list: op('fields.list'),
		listWorkflowActions: op('fields.listWorkflowActions'),
		orderWorkflowActions: op('fields.orderWorkflowActions'),
		passwordAuthentication: op('fields.passwordAuthentication'),
		permissions: {
			get: op('fields.permissions.get'),
			listSubjectOptions: op('fields.permissions.listSubjectOptions'),
			update: op('fields.permissions.update'),
		},
		rules: {
			create: op('fields.rules.create'),
			delete: op('fields.rules.delete'),
			get: op('fields.rules.get'),
			getInvalidRows: op('fields.rules.getInvalidRows'),
			update: op('fields.rules.update'),
		},
		typeFormula: op('fields.typeFormula'),
		update: op('fields.update'),
		updateWorkflowAction: op('fields.updateWorkflowAction'),
	},
	health: {
		check: op('health.check'),
		checkCeleryQueueSize: op('health.checkCeleryQueueSize'),
		testEmail: op('health.testEmail'),
	},
	identities: {
		create: op('identities.create'),
		delete: op('identities.delete'),
		list: op('identities.list'),
		update: op('identities.update'),
	},
	incomingWebhooks: {
		callDelete: op('incomingWebhooks.callDelete'),
		callGet: op('incomingWebhooks.callGet'),
		callPatch: op('incomingWebhooks.callPatch'),
		callPost: op('incomingWebhooks.callPost'),
		callPut: op('incomingWebhooks.callPut'),
	},
	integrations: {
		completeMcpServerOauth: op('integrations.completeMcpServerOauth'),
		create: op('integrations.create'),
		delete: op('integrations.delete'),
		disconnectMcpServerOauth: op('integrations.disconnectMcpServerOauth'),
		list: op('integrations.list'),
		move: op('integrations.move'),
		refreshMcpServerTools: op('integrations.refreshMcpServerTools'),
		startMcpServerOauth: op('integrations.startMcpServerOauth'),
		update: op('integrations.update'),
		updateMcpServerTools: op('integrations.updateMcpServerTools'),
	},
	jobs: {
		cancel: op('jobs.cancel'),
		create: op('jobs.create'),
		get: op('jobs.get'),
		list: op('jobs.list'),
	},
	lastViewed: {
		listItems: op('lastViewed.listItems'),
	},
	mcpEndpoints: {
		create: op('mcpEndpoints.create'),
		delete: op('mcpEndpoints.delete'),
		get: op('mcpEndpoints.get'),
		list: op('mcpEndpoints.list'),
		update: op('mcpEndpoints.update'),
	},
	mcpOauthConnections: {
		delete: op('mcpOauthConnections.delete'),
		get: op('mcpOauthConnections.get'),
		update: op('mcpOauthConnections.update'),
	},
	notifications: {
		clear: op('notifications.clear'),
		list: op('notifications.list'),
		markAllAsRead: op('notifications.markAllAsRead'),
		markAsRead: op('notifications.markAsRead'),
	},
	roleAssignments: {
		assign: op('roleAssignments.assign'),
		batchAssign: op('roleAssignments.batchAssign'),
		createScopedInvitation: op('roleAssignments.createScopedInvitation'),
		createScopedInvitationLink: op(
			'roleAssignments.createScopedInvitationLink',
		),
		deleteScopedInvitation: op('roleAssignments.deleteScopedInvitation'),
		deleteScopedInvitationLink: op(
			'roleAssignments.deleteScopedInvitationLink',
		),
		list: op('roleAssignments.list'),
		listEffectiveAccess: op('roleAssignments.listEffectiveAccess'),
		listScopedInvitationLinks: op('roleAssignments.listScopedInvitationLinks'),
		listScopedInvitations: op('roleAssignments.listScopedInvitations'),
		listSubject: op('roleAssignments.listSubject'),
		updateScopedInvitation: op('roleAssignments.updateScopedInvitation'),
		updateScopedInvitationLink: op(
			'roleAssignments.updateScopedInvitationLink',
		),
	},
	rows: {
		batchCreate: op('rows.batchCreate'),
		batchDelete: op('rows.batchDelete'),
		batchUpdate: op('rows.batchUpdate'),
		create: op('rows.create'),
		createComment: op('rows.createComment'),
		delete: op('rows.delete'),
		deleteComment: op('rows.deleteComment'),
		get: op('rows.get'),
		getAdjacent: op('rows.getAdjacent'),
		getComments: op('rows.getComments'),
		getHistory: op('rows.getHistory'),
		list: op('rows.list'),
		listNames: op('rows.listNames'),
		move: op('rows.move'),
		update: op('rows.update'),
		updateComment: op('rows.updateComment'),
		updateCommentNotificationMode: op('rows.updateCommentNotificationMode'),
	},
	search: {
		workspace: op('search.workspace'),
	},
	secureFiles: {
		download: op('secureFiles.download'),
	},
	settings: {
		get: op('settings.get'),
		getInstanceId: op('settings.getInstanceId'),
		update: op('settings.update'),
	},
	snapshots: {
		create: op('snapshots.create'),
		delete: op('snapshots.delete'),
		list: op('snapshots.list'),
		restore: op('snapshots.restore'),
	},
	tables: {
		create: op('tables.create'),
		createAsync: op('tables.createAsync'),
		dataSync: {
			create: op('tables.dataSync.create'),
			get: op('tables.dataSync.get'),
			getPeriodicInterval: op('tables.dataSync.getPeriodicInterval'),
			getProperties: op('tables.dataSync.getProperties'),
			getTypeProperties: op('tables.dataSync.getTypeProperties'),
			syncAsync: op('tables.dataSync.syncAsync'),
			update: op('tables.dataSync.update'),
			updatePeriodicInterval: op('tables.dataSync.updatePeriodicInterval'),
		},
		delete: op('tables.delete'),
		duplicateAsync: op('tables.duplicateAsync'),
		export: {
			getJob: op('tables.export.getJob'),
			start: op('tables.export.start'),
		},
		get: op('tables.get'),
		importDataAsync: op('tables.importDataAsync'),
		list: op('tables.list'),
		listForToken: op('tables.listForToken'),
		order: op('tables.order'),
		update: op('tables.update'),
	},
	teams: {
		create: op('teams.create'),
		createInvitation: op('teams.createInvitation'),
		createInvitationLink: op('teams.createInvitationLink'),
		createSubject: op('teams.createSubject'),
		delete: op('teams.delete'),
		deleteInvitation: op('teams.deleteInvitation'),
		deleteInvitationLink: op('teams.deleteInvitationLink'),
		deleteSubject: op('teams.deleteSubject'),
		get: op('teams.get'),
		getSubject: op('teams.getSubject'),
		list: op('teams.list'),
		listInvitationLinks: op('teams.listInvitationLinks'),
		listInvitations: op('teams.listInvitations'),
		listSubjects: op('teams.listSubjects'),
		update: op('teams.update'),
		updateInvitationLink: op('teams.updateInvitationLink'),
	},
	templates: {
		delete: op('templates.delete'),
		download: op('templates.download'),
		install: op('templates.install'),
		installAsync: op('templates.installAsync'),
		list: op('templates.list'),
		rotatePrivateLinkToken: op('templates.rotatePrivateLinkToken'),
		update: op('templates.update'),
	},
	trash: {
		emptyContents: op('trash.emptyContents'),
		getContents: op('trash.getContents'),
		getStructure: op('trash.getStructure'),
		restore: op('trash.restore'),
	},
	user: {
		changeEmail: op('user.changeEmail'),
		changePassword: op('user.changePassword'),
		getDashboard: op('user.getDashboard'),
		redo: op('user.redo'),
		resetPassword: op('user.resetPassword'),
		scheduleAccountDeletion: op('user.scheduleAccountDeletion'),
		sendChangeEmailConfirmation: op('user.sendChangeEmailConfirmation'),
		sendPasswordResetEmail: op('user.sendPasswordResetEmail'),
		sendVerifyEmail: op('user.sendVerifyEmail'),
		signUp: op('user.signUp'),
		tokenAuth: op('user.tokenAuth'),
		tokenBlacklist: op('user.tokenBlacklist'),
		tokenRefresh: op('user.tokenRefresh'),
		tokenVerify: op('user.tokenVerify'),
		undo: op('user.undo'),
		updateAccount: op('user.updateAccount'),
		updatePreferences: op('user.updatePreferences'),
		verifyEmail: op('user.verifyEmail'),
	},
	userFiles: {
		upload: op('userFiles.upload'),
		uploadViaUrl: op('userFiles.uploadViaUrl'),
	},
	userSources: {
		create: op('userSources.create'),
		delete: op('userSources.delete'),
		forceTokenAuth: op('userSources.forceTokenAuth'),
		list: op('userSources.list'),
		listUsers: op('userSources.listUsers'),
		move: op('userSources.move'),
		roles: {
			list: op('userSources.roles.list'),
		},
		tokenAuth: op('userSources.tokenAuth'),
		tokenBlacklist: op('userSources.tokenBlacklist'),
		tokenRefresh: op('userSources.tokenRefresh'),
		update: op('userSources.update'),
	},
	views: {
		calendar: {
			getIcalFeed: op('views.calendar.getIcalFeed'),
			listRows: op('views.calendar.listRows'),
			publicListRows: op('views.calendar.publicListRows'),
			rotateIcalFeedSlug: op('views.calendar.rotateIcalFeedSlug'),
		},
		copyConfiguration: op('views.copyConfiguration'),
		create: op('views.create'),
		decorations: {
			create: op('views.decorations.create'),
			delete: op('views.decorations.delete'),
			get: op('views.decorations.get'),
			list: op('views.decorations.list'),
			update: op('views.decorations.update'),
		},
		delete: op('views.delete'),
		duplicate: op('views.duplicate'),
		export: {
			getPublicJob: op('views.export.getPublicJob'),
			startPublic: op('views.export.startPublic'),
		},
		filters: {
			create: op('views.filters.create'),
			createGroup: op('views.filters.createGroup'),
			delete: op('views.filters.delete'),
			deleteGroup: op('views.filters.deleteGroup'),
			get: op('views.filters.get'),
			getGroup: op('views.filters.getGroup'),
			list: op('views.filters.list'),
			update: op('views.filters.update'),
			updateGroup: op('views.filters.updateGroup'),
		},
		form: {
			getEditRow: op('views.form.getEditRow'),
			getMeta: op('views.form.getMeta'),
			submit: op('views.form.submit'),
			updateEditRow: op('views.form.updateEditRow'),
			uploadFile: op('views.form.uploadFile'),
		},
		gallery: {
			listRows: op('views.gallery.listRows'),
			publicListRows: op('views.gallery.publicListRows'),
		},
		get: op('views.get'),
		getFieldOptions: op('views.getFieldOptions'),
		getPublicInfo: op('views.getPublicInfo'),
		getPublicRow: op('views.getPublicRow'),
		grid: {
			filterRows: op('views.grid.filterRows'),
			getFieldAggregation: op('views.grid.getFieldAggregation'),
			getFieldAggregations: op('views.grid.getFieldAggregations'),
			getGroupData: op('views.grid.getGroupData'),
			getPublicFieldAggregations: op('views.grid.getPublicFieldAggregations'),
			getPublicGroupData: op('views.grid.getPublicGroupData'),
			listRows: op('views.grid.listRows'),
			publicListRows: op('views.grid.publicListRows'),
		},
		groupBys: {
			create: op('views.groupBys.create'),
			delete: op('views.groupBys.delete'),
			get: op('views.groupBys.get'),
			list: op('views.groupBys.list'),
			prioritize: op('views.groupBys.prioritize'),
			update: op('views.groupBys.update'),
		},
		kanban: {
			listRows: op('views.kanban.listRows'),
			publicListRows: op('views.kanban.publicListRows'),
		},
		list: op('views.list'),
		order: op('views.order'),
		publicLinkRowFieldLookup: op('views.publicLinkRowFieldLookup'),
		publicTokenAuth: op('views.publicTokenAuth'),
		rotateSlug: op('views.rotateSlug'),
		sortings: {
			create: op('views.sortings.create'),
			delete: op('views.sortings.delete'),
			get: op('views.sortings.get'),
			list: op('views.sortings.list'),
			prioritize: op('views.sortings.prioritize'),
			update: op('views.sortings.update'),
		},
		timeline: {
			listRows: op('views.timeline.listRows'),
			publicListRows: op('views.timeline.publicListRows'),
		},
		update: op('views.update'),
		updateDefaultValues: op('views.updateDefaultValues'),
		updateFieldOptions: op('views.updateFieldOptions'),
		updatePremiumAttributes: op('views.updatePremiumAttributes'),
	},
	webhooks: {
		create: op('webhooks.create'),
		delete: op('webhooks.delete'),
		get: op('webhooks.get'),
		list: op('webhooks.list'),
		testCall: op('webhooks.testCall'),
		update: op('webhooks.update'),
	},
	workspaces: {
		create: op('workspaces.create'),
		createInitial: op('workspaces.createInitial'),
		delete: op('workspaces.delete'),
		deleteUser: op('workspaces.deleteUser'),
		exportApplicationsAsync: op('workspaces.exportApplicationsAsync'),
		getPermissions: op('workspaces.getPermissions'),
		importApplicationsAsync: op('workspaces.importApplicationsAsync'),
		importExportResource: op('workspaces.importExportResource'),
		importResourceUploadFile: op('workspaces.importResourceUploadFile'),
		invitationLinks: {
			create: op('workspaces.invitationLinks.create'),
			delete: op('workspaces.invitationLinks.delete'),
			getPublic: op('workspaces.invitationLinks.getPublic'),
			join: op('workspaces.invitationLinks.join'),
			list: op('workspaces.invitationLinks.list'),
			tokenAuth: op('workspaces.invitationLinks.tokenAuth'),
			update: op('workspaces.invitationLinks.update'),
		},
		invitations: {
			accept: op('workspaces.invitations.accept'),
			create: op('workspaces.invitations.create'),
			delete: op('workspaces.invitations.delete'),
			get: op('workspaces.invitations.get'),
			getToken: op('workspaces.invitations.getToken'),
			list: op('workspaces.invitations.list'),
			reject: op('workspaces.invitations.reject'),
			update: op('workspaces.invitations.update'),
		},
		leave: op('workspaces.leave'),
		list: op('workspaces.list'),
		listExports: op('workspaces.listExports'),
		listUsers: op('workspaces.listUsers'),
		order: op('workspaces.order'),
		update: op('workspaces.update'),
		updateUser: op('workspaces.updateUser'),
	},
} as const;

export const baserowEndpointSchemas = {
	'abuseReports.create': baserowSchemaEntry('abuseReports.create'),
	'admin.addUserToLicense': baserowSchemaEntry('admin.addUserToLicense'),
	'admin.approveUserTemplate': baserowSchemaEntry('admin.approveUserTemplate'),
	'admin.blockUserTemplate': baserowSchemaEntry('admin.blockUserTemplate'),
	'admin.checkLicense': baserowSchemaEntry('admin.checkLicense'),
	'admin.countUserTemplates': baserowSchemaEntry('admin.countUserTemplates'),
	'admin.createUser': baserowSchemaEntry('admin.createUser'),
	'admin.dataScanner.createScan': baserowSchemaEntry(
		'admin.dataScanner.createScan',
	),
	'admin.dataScanner.deleteResult': baserowSchemaEntry(
		'admin.dataScanner.deleteResult',
	),
	'admin.dataScanner.deleteScan': baserowSchemaEntry(
		'admin.dataScanner.deleteScan',
	),
	'admin.dataScanner.exportResults': baserowSchemaEntry(
		'admin.dataScanner.exportResults',
	),
	'admin.dataScanner.getScan': baserowSchemaEntry('admin.dataScanner.getScan'),
	'admin.dataScanner.getWorkspaceStructure': baserowSchemaEntry(
		'admin.dataScanner.getWorkspaceStructure',
	),
	'admin.dataScanner.listResults': baserowSchemaEntry(
		'admin.dataScanner.listResults',
	),
	'admin.dataScanner.listScans': baserowSchemaEntry(
		'admin.dataScanner.listScans',
	),
	'admin.dataScanner.triggerScan': baserowSchemaEntry(
		'admin.dataScanner.triggerScan',
	),
	'admin.dataScanner.updateScan': baserowSchemaEntry(
		'admin.dataScanner.updateScan',
	),
	'admin.deleteAllUsersFromLicense': baserowSchemaEntry(
		'admin.deleteAllUsersFromLicense',
	),
	'admin.deleteLicense': baserowSchemaEntry('admin.deleteLicense'),
	'admin.deleteUser': baserowSchemaEntry('admin.deleteUser'),
	'admin.deleteUserFromLicense': baserowSchemaEntry(
		'admin.deleteUserFromLicense',
	),
	'admin.deleteWorkspace': baserowSchemaEntry('admin.deleteWorkspace'),
	'admin.disableUserTwoFactorAuth': baserowSchemaEntry(
		'admin.disableUserTwoFactorAuth',
	),
	'admin.fillLicenseSeats': baserowSchemaEntry('admin.fillLicenseSeats'),
	'admin.getDashboard': baserowSchemaEntry('admin.getDashboard'),
	'admin.getLicense': baserowSchemaEntry('admin.getLicense'),
	'admin.impersonateUser': baserowSchemaEntry('admin.impersonateUser'),
	'admin.listLicenses': baserowSchemaEntry('admin.listLicenses'),
	'admin.listUserTemplates': baserowSchemaEntry('admin.listUserTemplates'),
	'admin.listUsers': baserowSchemaEntry('admin.listUsers'),
	'admin.listViews': baserowSchemaEntry('admin.listViews'),
	'admin.listWorkspaces': baserowSchemaEntry('admin.listWorkspaces'),
	'admin.listWorkspacesAsOptions': baserowSchemaEntry(
		'admin.listWorkspacesAsOptions',
	),
	'admin.lookupLicenseUsers': baserowSchemaEntry('admin.lookupLicenseUsers'),
	'admin.registerLicense': baserowSchemaEntry('admin.registerLicense'),
	'admin.rejectUserTemplate': baserowSchemaEntry('admin.rejectUserTemplate'),
	'admin.rotateViewSlug': baserowSchemaEntry('admin.rotateViewSlug'),
	'admin.unblockUserTemplate': baserowSchemaEntry('admin.unblockUserTemplate'),
	'admin.updateUser': baserowSchemaEntry('admin.updateUser'),
	'admin.updateView': baserowSchemaEntry('admin.updateView'),
	'agents.createAction': baserowSchemaEntry('agents.createAction'),
	'agents.createConversation': baserowSchemaEntry('agents.createConversation'),
	'agents.createMessage': baserowSchemaEntry('agents.createMessage'),
	'agents.createTrigger': baserowSchemaEntry('agents.createTrigger'),
	'agents.decideToolApprovals': baserowSchemaEntry(
		'agents.decideToolApprovals',
	),
	'agents.deleteAction': baserowSchemaEntry('agents.deleteAction'),
	'agents.deleteConversation': baserowSchemaEntry('agents.deleteConversation'),
	'agents.deleteTrigger': baserowSchemaEntry('agents.deleteTrigger'),
	'agents.get': baserowSchemaEntry('agents.get'),
	'agents.getAction': baserowSchemaEntry('agents.getAction'),
	'agents.getConfiguration': baserowSchemaEntry('agents.getConfiguration'),
	'agents.listActions': baserowSchemaEntry('agents.listActions'),
	'agents.listConversations': baserowSchemaEntry('agents.listConversations'),
	'agents.listMessages': baserowSchemaEntry('agents.listMessages'),
	'agents.listRunAsIdentities': baserowSchemaEntry(
		'agents.listRunAsIdentities',
	),
	'agents.listTriggerTypes': baserowSchemaEntry('agents.listTriggerTypes'),
	'agents.listTriggers': baserowSchemaEntry('agents.listTriggers'),
	'agents.load': baserowSchemaEntry('agents.load'),
	'agents.updateAction': baserowSchemaEntry('agents.updateAction'),
	'agents.updateConfiguration': baserowSchemaEntry(
		'agents.updateConfiguration',
	),
	'agents.updateConversation': baserowSchemaEntry('agents.updateConversation'),
	'agents.updateTrigger': baserowSchemaEntry('agents.updateTrigger'),
	'aiProviders.create': baserowSchemaEntry('aiProviders.create'),
	'aiProviders.createModel': baserowSchemaEntry('aiProviders.createModel'),
	'aiProviders.delete': baserowSchemaEntry('aiProviders.delete'),
	'aiProviders.deleteModel': baserowSchemaEntry('aiProviders.deleteModel'),
	'aiProviders.discoverModels': baserowSchemaEntry(
		'aiProviders.discoverModels',
	),
	'aiProviders.getModelUsage': baserowSchemaEntry('aiProviders.getModelUsage'),
	'aiProviders.list': baserowSchemaEntry('aiProviders.list'),
	'aiProviders.listFeatureSettings': baserowSchemaEntry(
		'aiProviders.listFeatureSettings',
	),
	'aiProviders.listTypes': baserowSchemaEntry('aiProviders.listTypes'),
	'aiProviders.testModels': baserowSchemaEntry('aiProviders.testModels'),
	'aiProviders.update': baserowSchemaEntry('aiProviders.update'),
	'aiProviders.updateFeatureSetting': baserowSchemaEntry(
		'aiProviders.updateFeatureSetting',
	),
	'aiProviders.updateModel': baserowSchemaEntry('aiProviders.updateModel'),
	'applications.create': baserowSchemaEntry('applications.create'),
	'applications.delete': baserowSchemaEntry('applications.delete'),
	'applications.duplicateAsync': baserowSchemaEntry(
		'applications.duplicateAsync',
	),
	'applications.get': baserowSchemaEntry('applications.get'),
	'applications.list': baserowSchemaEntry('applications.list'),
	'applications.listAll': baserowSchemaEntry('applications.listAll'),
	'applications.order': baserowSchemaEntry('applications.order'),
	'applications.update': baserowSchemaEntry('applications.update'),
	'assistant.cancelMessage': baserowSchemaEntry('assistant.cancelMessage'),
	'assistant.getOnboardingPromptSuggestions': baserowSchemaEntry(
		'assistant.getOnboardingPromptSuggestions',
	),
	'assistant.listChatMessages': baserowSchemaEntry(
		'assistant.listChatMessages',
	),
	'assistant.listChats': baserowSchemaEntry('assistant.listChats'),
	'assistant.sendMessage': baserowSchemaEntry('assistant.sendMessage'),
	'assistant.submitMessageFeedback': baserowSchemaEntry(
		'assistant.submitMessageFeedback',
	),
	'auditLog.adminExport': baserowSchemaEntry('auditLog.adminExport'),
	'auditLog.adminList': baserowSchemaEntry('auditLog.adminList'),
	'auditLog.adminListActionTypes': baserowSchemaEntry(
		'auditLog.adminListActionTypes',
	),
	'auditLog.adminListActors': baserowSchemaEntry('auditLog.adminListActors'),
	'auditLog.export': baserowSchemaEntry('auditLog.export'),
	'auditLog.list': baserowSchemaEntry('auditLog.list'),
	'auditLog.listActionTypes': baserowSchemaEntry('auditLog.listActionTypes'),
	'auditLog.listActors': baserowSchemaEntry('auditLog.listActors'),
	'auth.configureTwoFactor': baserowSchemaEntry('auth.configureTwoFactor'),
	'auth.createProvider': baserowSchemaEntry('auth.createProvider'),
	'auth.deleteProvider': baserowSchemaEntry('auth.deleteProvider'),
	'auth.disableTwoFactor': baserowSchemaEntry('auth.disableTwoFactor'),
	'auth.getProvider': baserowSchemaEntry('auth.getProvider'),
	'auth.listProviders': baserowSchemaEntry('auth.listProviders'),
	'auth.listProvidersLoginOptions': baserowSchemaEntry(
		'auth.listProvidersLoginOptions',
	),
	'auth.providerLoginUrl': baserowSchemaEntry('auth.providerLoginUrl'),
	'auth.twoFactorConfiguration': baserowSchemaEntry(
		'auth.twoFactorConfiguration',
	),
	'auth.updateProvider': baserowSchemaEntry('auth.updateProvider'),
	'auth.verifyTotp': baserowSchemaEntry('auth.verifyTotp'),
	'automations.history.cancelWorkflow': baserowSchemaEntry(
		'automations.history.cancelWorkflow',
	),
	'automations.history.getNodeResult': baserowSchemaEntry(
		'automations.history.getNodeResult',
	),
	'automations.history.listNodeHistories': baserowSchemaEntry(
		'automations.history.listNodeHistories',
	),
	'automations.nodes.create': baserowSchemaEntry('automations.nodes.create'),
	'automations.nodes.delete': baserowSchemaEntry('automations.nodes.delete'),
	'automations.nodes.duplicate': baserowSchemaEntry(
		'automations.nodes.duplicate',
	),
	'automations.nodes.list': baserowSchemaEntry('automations.nodes.list'),
	'automations.nodes.move': baserowSchemaEntry('automations.nodes.move'),
	'automations.nodes.replace': baserowSchemaEntry('automations.nodes.replace'),
	'automations.nodes.simulateDispatch': baserowSchemaEntry(
		'automations.nodes.simulateDispatch',
	),
	'automations.nodes.update': baserowSchemaEntry('automations.nodes.update'),
	'automations.workflows.create': baserowSchemaEntry(
		'automations.workflows.create',
	),
	'automations.workflows.delete': baserowSchemaEntry(
		'automations.workflows.delete',
	),
	'automations.workflows.duplicateAsync': baserowSchemaEntry(
		'automations.workflows.duplicateAsync',
	),
	'automations.workflows.get': baserowSchemaEntry('automations.workflows.get'),
	'automations.workflows.getHistory': baserowSchemaEntry(
		'automations.workflows.getHistory',
	),
	'automations.workflows.order': baserowSchemaEntry(
		'automations.workflows.order',
	),
	'automations.workflows.publish': baserowSchemaEntry(
		'automations.workflows.publish',
	),
	'automations.workflows.test': baserowSchemaEntry(
		'automations.workflows.test',
	),
	'automations.workflows.update': baserowSchemaEntry(
		'automations.workflows.update',
	),
	'builder.dataSources.create': baserowSchemaEntry(
		'builder.dataSources.create',
	),
	'builder.dataSources.delete': baserowSchemaEntry(
		'builder.dataSources.delete',
	),
	'builder.dataSources.dispatch': baserowSchemaEntry(
		'builder.dataSources.dispatch',
	),
	'builder.dataSources.dispatchAll': baserowSchemaEntry(
		'builder.dataSources.dispatchAll',
	),
	'builder.dataSources.dispatchAllPublic': baserowSchemaEntry(
		'builder.dataSources.dispatchAllPublic',
	),
	'builder.dataSources.dispatchPublic': baserowSchemaEntry(
		'builder.dataSources.dispatchPublic',
	),
	'builder.dataSources.getRecordNames': baserowSchemaEntry(
		'builder.dataSources.getRecordNames',
	),
	'builder.dataSources.list': baserowSchemaEntry('builder.dataSources.list'),
	'builder.dataSources.listPublic': baserowSchemaEntry(
		'builder.dataSources.listPublic',
	),
	'builder.dataSources.move': baserowSchemaEntry('builder.dataSources.move'),
	'builder.dataSources.simulateDispatch': baserowSchemaEntry(
		'builder.dataSources.simulateDispatch',
	),
	'builder.dataSources.update': baserowSchemaEntry(
		'builder.dataSources.update',
	),
	'builder.domains.askPublicExists': baserowSchemaEntry(
		'builder.domains.askPublicExists',
	),
	'builder.domains.create': baserowSchemaEntry('builder.domains.create'),
	'builder.domains.delete': baserowSchemaEntry('builder.domains.delete'),
	'builder.domains.list': baserowSchemaEntry('builder.domains.list'),
	'builder.domains.order': baserowSchemaEntry('builder.domains.order'),
	'builder.domains.publish': baserowSchemaEntry('builder.domains.publish'),
	'builder.domains.update': baserowSchemaEntry('builder.domains.update'),
	'builder.elements.create': baserowSchemaEntry('builder.elements.create'),
	'builder.elements.delete': baserowSchemaEntry('builder.elements.delete'),
	'builder.elements.duplicate': baserowSchemaEntry(
		'builder.elements.duplicate',
	),
	'builder.elements.list': baserowSchemaEntry('builder.elements.list'),
	'builder.elements.listPublic': baserowSchemaEntry(
		'builder.elements.listPublic',
	),
	'builder.elements.move': baserowSchemaEntry('builder.elements.move'),
	'builder.elements.update': baserowSchemaEntry('builder.elements.update'),
	'builder.pages.create': baserowSchemaEntry('builder.pages.create'),
	'builder.pages.delete': baserowSchemaEntry('builder.pages.delete'),
	'builder.pages.duplicateAsync': baserowSchemaEntry(
		'builder.pages.duplicateAsync',
	),
	'builder.pages.order': baserowSchemaEntry('builder.pages.order'),
	'builder.pages.update': baserowSchemaEntry('builder.pages.update'),
	'builder.preview.createGrant': baserowSchemaEntry(
		'builder.preview.createGrant',
	),
	'builder.preview.exchangeGrant': baserowSchemaEntry(
		'builder.preview.exchangeGrant',
	),
	'builder.preview.exchangeHandoff': baserowSchemaEntry(
		'builder.preview.exchangeHandoff',
	),
	'builder.public.getByDomainName': baserowSchemaEntry(
		'builder.public.getByDomainName',
	),
	'builder.public.getById': baserowSchemaEntry('builder.public.getById'),
	'builder.public.getCustomCss': baserowSchemaEntry(
		'builder.public.getCustomCss',
	),
	'builder.public.getCustomHtml': baserowSchemaEntry(
		'builder.public.getCustomHtml',
	),
	'builder.public.getCustomJs': baserowSchemaEntry(
		'builder.public.getCustomJs',
	),
	'builder.public.getPreviewCustomCss': baserowSchemaEntry(
		'builder.public.getPreviewCustomCss',
	),
	'builder.public.getPreviewCustomHtml': baserowSchemaEntry(
		'builder.public.getPreviewCustomHtml',
	),
	'builder.public.getPreviewCustomJs': baserowSchemaEntry(
		'builder.public.getPreviewCustomJs',
	),
	'builder.theme.update': baserowSchemaEntry('builder.theme.update'),
	'builder.workflowActions.create': baserowSchemaEntry(
		'builder.workflowActions.create',
	),
	'builder.workflowActions.delete': baserowSchemaEntry(
		'builder.workflowActions.delete',
	),
	'builder.workflowActions.dispatch': baserowSchemaEntry(
		'builder.workflowActions.dispatch',
	),
	'builder.workflowActions.list': baserowSchemaEntry(
		'builder.workflowActions.list',
	),
	'builder.workflowActions.listPublic': baserowSchemaEntry(
		'builder.workflowActions.listPublic',
	),
	'builder.workflowActions.order': baserowSchemaEntry(
		'builder.workflowActions.order',
	),
	'builder.workflowActions.update': baserowSchemaEntry(
		'builder.workflowActions.update',
	),
	'chatRuns.cancel': baserowSchemaEntry('chatRuns.cancel'),
	'chatRuns.get': baserowSchemaEntry('chatRuns.get'),
	'chatRuns.stream': baserowSchemaEntry('chatRuns.stream'),
	'dashboards.dataSources.dispatch': baserowSchemaEntry(
		'dashboards.dataSources.dispatch',
	),
	'dashboards.dataSources.list': baserowSchemaEntry(
		'dashboards.dataSources.list',
	),
	'dashboards.dataSources.update': baserowSchemaEntry(
		'dashboards.dataSources.update',
	),
	'dashboards.public.dispatchDataSource': baserowSchemaEntry(
		'dashboards.public.dispatchDataSource',
	),
	'dashboards.public.getAuthInfo': baserowSchemaEntry(
		'dashboards.public.getAuthInfo',
	),
	'dashboards.public.getInfo': baserowSchemaEntry('dashboards.public.getInfo'),
	'dashboards.public.tokenAuth': baserowSchemaEntry(
		'dashboards.public.tokenAuth',
	),
	'dashboards.rotateSlug': baserowSchemaEntry('dashboards.rotateSlug'),
	'dashboards.updatePremiumAttributes': baserowSchemaEntry(
		'dashboards.updatePremiumAttributes',
	),
	'dashboards.updateSharing': baserowSchemaEntry('dashboards.updateSharing'),
	'dashboards.widgets.create': baserowSchemaEntry('dashboards.widgets.create'),
	'dashboards.widgets.delete': baserowSchemaEntry('dashboards.widgets.delete'),
	'dashboards.widgets.list': baserowSchemaEntry('dashboards.widgets.list'),
	'dashboards.widgets.update': baserowSchemaEntry('dashboards.widgets.update'),
	'dashboards.widgets.updateLayout': baserowSchemaEntry(
		'dashboards.widgets.updateLayout',
	),
	'databaseTokens.check': baserowSchemaEntry('databaseTokens.check'),
	'databaseTokens.create': baserowSchemaEntry('databaseTokens.create'),
	'databaseTokens.delete': baserowSchemaEntry('databaseTokens.delete'),
	'databaseTokens.get': baserowSchemaEntry('databaseTokens.get'),
	'databaseTokens.list': baserowSchemaEntry('databaseTokens.list'),
	'databaseTokens.update': baserowSchemaEntry('databaseTokens.update'),
	'fields.changePrimary': baserowSchemaEntry('fields.changePrimary'),
	'fields.create': baserowSchemaEntry('fields.create'),
	'fields.createWorkflowAction': baserowSchemaEntry(
		'fields.createWorkflowAction',
	),
	'fields.delete': baserowSchemaEntry('fields.delete'),
	'fields.deleteWorkflowAction': baserowSchemaEntry(
		'fields.deleteWorkflowAction',
	),
	'fields.dispatchWorkflowActions': baserowSchemaEntry(
		'fields.dispatchWorkflowActions',
	),
	'fields.duplicate': baserowSchemaEntry('fields.duplicate'),
	'fields.generateAiValue': baserowSchemaEntry('fields.generateAiValue'),
	'fields.generateFormulaWithAi': baserowSchemaEntry(
		'fields.generateFormulaWithAi',
	),
	'fields.get': baserowSchemaEntry('fields.get'),
	'fields.getUniqueRowValues': baserowSchemaEntry('fields.getUniqueRowValues'),
	'fields.list': baserowSchemaEntry('fields.list'),
	'fields.listWorkflowActions': baserowSchemaEntry(
		'fields.listWorkflowActions',
	),
	'fields.orderWorkflowActions': baserowSchemaEntry(
		'fields.orderWorkflowActions',
	),
	'fields.passwordAuthentication': baserowSchemaEntry(
		'fields.passwordAuthentication',
	),
	'fields.permissions.get': baserowSchemaEntry('fields.permissions.get'),
	'fields.permissions.listSubjectOptions': baserowSchemaEntry(
		'fields.permissions.listSubjectOptions',
	),
	'fields.permissions.update': baserowSchemaEntry('fields.permissions.update'),
	'fields.rules.create': baserowSchemaEntry('fields.rules.create'),
	'fields.rules.delete': baserowSchemaEntry('fields.rules.delete'),
	'fields.rules.get': baserowSchemaEntry('fields.rules.get'),
	'fields.rules.getInvalidRows': baserowSchemaEntry(
		'fields.rules.getInvalidRows',
	),
	'fields.rules.update': baserowSchemaEntry('fields.rules.update'),
	'fields.typeFormula': baserowSchemaEntry('fields.typeFormula'),
	'fields.update': baserowSchemaEntry('fields.update'),
	'fields.updateWorkflowAction': baserowSchemaEntry(
		'fields.updateWorkflowAction',
	),
	'health.check': baserowSchemaEntry('health.check'),
	'health.checkCeleryQueueSize': baserowSchemaEntry(
		'health.checkCeleryQueueSize',
	),
	'health.testEmail': baserowSchemaEntry('health.testEmail'),
	'identities.create': baserowSchemaEntry('identities.create'),
	'identities.delete': baserowSchemaEntry('identities.delete'),
	'identities.list': baserowSchemaEntry('identities.list'),
	'identities.update': baserowSchemaEntry('identities.update'),
	'incomingWebhooks.callDelete': baserowSchemaEntry(
		'incomingWebhooks.callDelete',
	),
	'incomingWebhooks.callGet': baserowSchemaEntry('incomingWebhooks.callGet'),
	'incomingWebhooks.callPatch': baserowSchemaEntry(
		'incomingWebhooks.callPatch',
	),
	'incomingWebhooks.callPost': baserowSchemaEntry('incomingWebhooks.callPost'),
	'incomingWebhooks.callPut': baserowSchemaEntry('incomingWebhooks.callPut'),
	'integrations.completeMcpServerOauth': baserowSchemaEntry(
		'integrations.completeMcpServerOauth',
	),
	'integrations.create': baserowSchemaEntry('integrations.create'),
	'integrations.delete': baserowSchemaEntry('integrations.delete'),
	'integrations.disconnectMcpServerOauth': baserowSchemaEntry(
		'integrations.disconnectMcpServerOauth',
	),
	'integrations.list': baserowSchemaEntry('integrations.list'),
	'integrations.move': baserowSchemaEntry('integrations.move'),
	'integrations.refreshMcpServerTools': baserowSchemaEntry(
		'integrations.refreshMcpServerTools',
	),
	'integrations.startMcpServerOauth': baserowSchemaEntry(
		'integrations.startMcpServerOauth',
	),
	'integrations.update': baserowSchemaEntry('integrations.update'),
	'integrations.updateMcpServerTools': baserowSchemaEntry(
		'integrations.updateMcpServerTools',
	),
	'jobs.cancel': baserowSchemaEntry('jobs.cancel'),
	'jobs.create': baserowSchemaEntry('jobs.create'),
	'jobs.get': baserowSchemaEntry('jobs.get'),
	'jobs.list': baserowSchemaEntry('jobs.list'),
	'lastViewed.listItems': baserowSchemaEntry('lastViewed.listItems'),
	'mcpEndpoints.create': baserowSchemaEntry('mcpEndpoints.create'),
	'mcpEndpoints.delete': baserowSchemaEntry('mcpEndpoints.delete'),
	'mcpEndpoints.get': baserowSchemaEntry('mcpEndpoints.get'),
	'mcpEndpoints.list': baserowSchemaEntry('mcpEndpoints.list'),
	'mcpEndpoints.update': baserowSchemaEntry('mcpEndpoints.update'),
	'mcpOauthConnections.delete': baserowSchemaEntry(
		'mcpOauthConnections.delete',
	),
	'mcpOauthConnections.get': baserowSchemaEntry('mcpOauthConnections.get'),
	'mcpOauthConnections.update': baserowSchemaEntry(
		'mcpOauthConnections.update',
	),
	'notifications.clear': baserowSchemaEntry('notifications.clear'),
	'notifications.list': baserowSchemaEntry('notifications.list'),
	'notifications.markAllAsRead': baserowSchemaEntry(
		'notifications.markAllAsRead',
	),
	'notifications.markAsRead': baserowSchemaEntry('notifications.markAsRead'),
	'roleAssignments.assign': baserowSchemaEntry('roleAssignments.assign'),
	'roleAssignments.batchAssign': baserowSchemaEntry(
		'roleAssignments.batchAssign',
	),
	'roleAssignments.createScopedInvitation': baserowSchemaEntry(
		'roleAssignments.createScopedInvitation',
	),
	'roleAssignments.createScopedInvitationLink': baserowSchemaEntry(
		'roleAssignments.createScopedInvitationLink',
	),
	'roleAssignments.deleteScopedInvitation': baserowSchemaEntry(
		'roleAssignments.deleteScopedInvitation',
	),
	'roleAssignments.deleteScopedInvitationLink': baserowSchemaEntry(
		'roleAssignments.deleteScopedInvitationLink',
	),
	'roleAssignments.list': baserowSchemaEntry('roleAssignments.list'),
	'roleAssignments.listEffectiveAccess': baserowSchemaEntry(
		'roleAssignments.listEffectiveAccess',
	),
	'roleAssignments.listScopedInvitationLinks': baserowSchemaEntry(
		'roleAssignments.listScopedInvitationLinks',
	),
	'roleAssignments.listScopedInvitations': baserowSchemaEntry(
		'roleAssignments.listScopedInvitations',
	),
	'roleAssignments.listSubject': baserowSchemaEntry(
		'roleAssignments.listSubject',
	),
	'roleAssignments.updateScopedInvitation': baserowSchemaEntry(
		'roleAssignments.updateScopedInvitation',
	),
	'roleAssignments.updateScopedInvitationLink': baserowSchemaEntry(
		'roleAssignments.updateScopedInvitationLink',
	),
	'rows.batchCreate': baserowSchemaEntry('rows.batchCreate'),
	'rows.batchDelete': baserowSchemaEntry('rows.batchDelete'),
	'rows.batchUpdate': baserowSchemaEntry('rows.batchUpdate'),
	'rows.create': baserowSchemaEntry('rows.create'),
	'rows.createComment': baserowSchemaEntry('rows.createComment'),
	'rows.delete': baserowSchemaEntry('rows.delete'),
	'rows.deleteComment': baserowSchemaEntry('rows.deleteComment'),
	'rows.get': baserowSchemaEntry('rows.get'),
	'rows.getAdjacent': baserowSchemaEntry('rows.getAdjacent'),
	'rows.getComments': baserowSchemaEntry('rows.getComments'),
	'rows.getHistory': baserowSchemaEntry('rows.getHistory'),
	'rows.list': baserowSchemaEntry('rows.list'),
	'rows.listNames': baserowSchemaEntry('rows.listNames'),
	'rows.move': baserowSchemaEntry('rows.move'),
	'rows.update': baserowSchemaEntry('rows.update'),
	'rows.updateComment': baserowSchemaEntry('rows.updateComment'),
	'rows.updateCommentNotificationMode': baserowSchemaEntry(
		'rows.updateCommentNotificationMode',
	),
	'search.workspace': baserowSchemaEntry('search.workspace'),
	'secureFiles.download': baserowSchemaEntry('secureFiles.download'),
	'settings.get': baserowSchemaEntry('settings.get'),
	'settings.getInstanceId': baserowSchemaEntry('settings.getInstanceId'),
	'settings.update': baserowSchemaEntry('settings.update'),
	'snapshots.create': baserowSchemaEntry('snapshots.create'),
	'snapshots.delete': baserowSchemaEntry('snapshots.delete'),
	'snapshots.list': baserowSchemaEntry('snapshots.list'),
	'snapshots.restore': baserowSchemaEntry('snapshots.restore'),
	'tables.create': baserowSchemaEntry('tables.create'),
	'tables.createAsync': baserowSchemaEntry('tables.createAsync'),
	'tables.dataSync.create': baserowSchemaEntry('tables.dataSync.create'),
	'tables.dataSync.get': baserowSchemaEntry('tables.dataSync.get'),
	'tables.dataSync.getPeriodicInterval': baserowSchemaEntry(
		'tables.dataSync.getPeriodicInterval',
	),
	'tables.dataSync.getProperties': baserowSchemaEntry(
		'tables.dataSync.getProperties',
	),
	'tables.dataSync.getTypeProperties': baserowSchemaEntry(
		'tables.dataSync.getTypeProperties',
	),
	'tables.dataSync.syncAsync': baserowSchemaEntry('tables.dataSync.syncAsync'),
	'tables.dataSync.update': baserowSchemaEntry('tables.dataSync.update'),
	'tables.dataSync.updatePeriodicInterval': baserowSchemaEntry(
		'tables.dataSync.updatePeriodicInterval',
	),
	'tables.delete': baserowSchemaEntry('tables.delete'),
	'tables.duplicateAsync': baserowSchemaEntry('tables.duplicateAsync'),
	'tables.export.getJob': baserowSchemaEntry('tables.export.getJob'),
	'tables.export.start': baserowSchemaEntry('tables.export.start'),
	'tables.get': baserowSchemaEntry('tables.get'),
	'tables.importDataAsync': baserowSchemaEntry('tables.importDataAsync'),
	'tables.list': baserowSchemaEntry('tables.list'),
	'tables.listForToken': baserowSchemaEntry('tables.listForToken'),
	'tables.order': baserowSchemaEntry('tables.order'),
	'tables.update': baserowSchemaEntry('tables.update'),
	'teams.create': baserowSchemaEntry('teams.create'),
	'teams.createInvitation': baserowSchemaEntry('teams.createInvitation'),
	'teams.createInvitationLink': baserowSchemaEntry(
		'teams.createInvitationLink',
	),
	'teams.createSubject': baserowSchemaEntry('teams.createSubject'),
	'teams.delete': baserowSchemaEntry('teams.delete'),
	'teams.deleteInvitation': baserowSchemaEntry('teams.deleteInvitation'),
	'teams.deleteInvitationLink': baserowSchemaEntry(
		'teams.deleteInvitationLink',
	),
	'teams.deleteSubject': baserowSchemaEntry('teams.deleteSubject'),
	'teams.get': baserowSchemaEntry('teams.get'),
	'teams.getSubject': baserowSchemaEntry('teams.getSubject'),
	'teams.list': baserowSchemaEntry('teams.list'),
	'teams.listInvitationLinks': baserowSchemaEntry('teams.listInvitationLinks'),
	'teams.listInvitations': baserowSchemaEntry('teams.listInvitations'),
	'teams.listSubjects': baserowSchemaEntry('teams.listSubjects'),
	'teams.update': baserowSchemaEntry('teams.update'),
	'teams.updateInvitationLink': baserowSchemaEntry(
		'teams.updateInvitationLink',
	),
	'templates.delete': baserowSchemaEntry('templates.delete'),
	'templates.download': baserowSchemaEntry('templates.download'),
	'templates.install': baserowSchemaEntry('templates.install'),
	'templates.installAsync': baserowSchemaEntry('templates.installAsync'),
	'templates.list': baserowSchemaEntry('templates.list'),
	'templates.rotatePrivateLinkToken': baserowSchemaEntry(
		'templates.rotatePrivateLinkToken',
	),
	'templates.update': baserowSchemaEntry('templates.update'),
	'trash.emptyContents': baserowSchemaEntry('trash.emptyContents'),
	'trash.getContents': baserowSchemaEntry('trash.getContents'),
	'trash.getStructure': baserowSchemaEntry('trash.getStructure'),
	'trash.restore': baserowSchemaEntry('trash.restore'),
	'user.changeEmail': baserowSchemaEntry('user.changeEmail'),
	'user.changePassword': baserowSchemaEntry('user.changePassword'),
	'user.getDashboard': baserowSchemaEntry('user.getDashboard'),
	'user.redo': baserowSchemaEntry('user.redo'),
	'user.resetPassword': baserowSchemaEntry('user.resetPassword'),
	'user.scheduleAccountDeletion': baserowSchemaEntry(
		'user.scheduleAccountDeletion',
	),
	'user.sendChangeEmailConfirmation': baserowSchemaEntry(
		'user.sendChangeEmailConfirmation',
	),
	'user.sendPasswordResetEmail': baserowSchemaEntry(
		'user.sendPasswordResetEmail',
	),
	'user.sendVerifyEmail': baserowSchemaEntry('user.sendVerifyEmail'),
	'user.signUp': baserowSchemaEntry('user.signUp'),
	'user.tokenAuth': baserowSchemaEntry('user.tokenAuth'),
	'user.tokenBlacklist': baserowSchemaEntry('user.tokenBlacklist'),
	'user.tokenRefresh': baserowSchemaEntry('user.tokenRefresh'),
	'user.tokenVerify': baserowSchemaEntry('user.tokenVerify'),
	'user.undo': baserowSchemaEntry('user.undo'),
	'user.updateAccount': baserowSchemaEntry('user.updateAccount'),
	'user.updatePreferences': baserowSchemaEntry('user.updatePreferences'),
	'user.verifyEmail': baserowSchemaEntry('user.verifyEmail'),
	'userFiles.upload': baserowSchemaEntry('userFiles.upload'),
	'userFiles.uploadViaUrl': baserowSchemaEntry('userFiles.uploadViaUrl'),
	'userSources.create': baserowSchemaEntry('userSources.create'),
	'userSources.delete': baserowSchemaEntry('userSources.delete'),
	'userSources.forceTokenAuth': baserowSchemaEntry(
		'userSources.forceTokenAuth',
	),
	'userSources.list': baserowSchemaEntry('userSources.list'),
	'userSources.listUsers': baserowSchemaEntry('userSources.listUsers'),
	'userSources.move': baserowSchemaEntry('userSources.move'),
	'userSources.roles.list': baserowSchemaEntry('userSources.roles.list'),
	'userSources.tokenAuth': baserowSchemaEntry('userSources.tokenAuth'),
	'userSources.tokenBlacklist': baserowSchemaEntry(
		'userSources.tokenBlacklist',
	),
	'userSources.tokenRefresh': baserowSchemaEntry('userSources.tokenRefresh'),
	'userSources.update': baserowSchemaEntry('userSources.update'),
	'views.calendar.getIcalFeed': baserowSchemaEntry(
		'views.calendar.getIcalFeed',
	),
	'views.calendar.listRows': baserowSchemaEntry('views.calendar.listRows'),
	'views.calendar.publicListRows': baserowSchemaEntry(
		'views.calendar.publicListRows',
	),
	'views.calendar.rotateIcalFeedSlug': baserowSchemaEntry(
		'views.calendar.rotateIcalFeedSlug',
	),
	'views.copyConfiguration': baserowSchemaEntry('views.copyConfiguration'),
	'views.create': baserowSchemaEntry('views.create'),
	'views.decorations.create': baserowSchemaEntry('views.decorations.create'),
	'views.decorations.delete': baserowSchemaEntry('views.decorations.delete'),
	'views.decorations.get': baserowSchemaEntry('views.decorations.get'),
	'views.decorations.list': baserowSchemaEntry('views.decorations.list'),
	'views.decorations.update': baserowSchemaEntry('views.decorations.update'),
	'views.delete': baserowSchemaEntry('views.delete'),
	'views.duplicate': baserowSchemaEntry('views.duplicate'),
	'views.export.getPublicJob': baserowSchemaEntry('views.export.getPublicJob'),
	'views.export.startPublic': baserowSchemaEntry('views.export.startPublic'),
	'views.filters.create': baserowSchemaEntry('views.filters.create'),
	'views.filters.createGroup': baserowSchemaEntry('views.filters.createGroup'),
	'views.filters.delete': baserowSchemaEntry('views.filters.delete'),
	'views.filters.deleteGroup': baserowSchemaEntry('views.filters.deleteGroup'),
	'views.filters.get': baserowSchemaEntry('views.filters.get'),
	'views.filters.getGroup': baserowSchemaEntry('views.filters.getGroup'),
	'views.filters.list': baserowSchemaEntry('views.filters.list'),
	'views.filters.update': baserowSchemaEntry('views.filters.update'),
	'views.filters.updateGroup': baserowSchemaEntry('views.filters.updateGroup'),
	'views.form.getEditRow': baserowSchemaEntry('views.form.getEditRow'),
	'views.form.getMeta': baserowSchemaEntry('views.form.getMeta'),
	'views.form.submit': baserowSchemaEntry('views.form.submit'),
	'views.form.updateEditRow': baserowSchemaEntry('views.form.updateEditRow'),
	'views.form.uploadFile': baserowSchemaEntry('views.form.uploadFile'),
	'views.gallery.listRows': baserowSchemaEntry('views.gallery.listRows'),
	'views.gallery.publicListRows': baserowSchemaEntry(
		'views.gallery.publicListRows',
	),
	'views.get': baserowSchemaEntry('views.get'),
	'views.getFieldOptions': baserowSchemaEntry('views.getFieldOptions'),
	'views.getPublicInfo': baserowSchemaEntry('views.getPublicInfo'),
	'views.getPublicRow': baserowSchemaEntry('views.getPublicRow'),
	'views.grid.filterRows': baserowSchemaEntry('views.grid.filterRows'),
	'views.grid.getFieldAggregation': baserowSchemaEntry(
		'views.grid.getFieldAggregation',
	),
	'views.grid.getFieldAggregations': baserowSchemaEntry(
		'views.grid.getFieldAggregations',
	),
	'views.grid.getGroupData': baserowSchemaEntry('views.grid.getGroupData'),
	'views.grid.getPublicFieldAggregations': baserowSchemaEntry(
		'views.grid.getPublicFieldAggregations',
	),
	'views.grid.getPublicGroupData': baserowSchemaEntry(
		'views.grid.getPublicGroupData',
	),
	'views.grid.listRows': baserowSchemaEntry('views.grid.listRows'),
	'views.grid.publicListRows': baserowSchemaEntry('views.grid.publicListRows'),
	'views.groupBys.create': baserowSchemaEntry('views.groupBys.create'),
	'views.groupBys.delete': baserowSchemaEntry('views.groupBys.delete'),
	'views.groupBys.get': baserowSchemaEntry('views.groupBys.get'),
	'views.groupBys.list': baserowSchemaEntry('views.groupBys.list'),
	'views.groupBys.prioritize': baserowSchemaEntry('views.groupBys.prioritize'),
	'views.groupBys.update': baserowSchemaEntry('views.groupBys.update'),
	'views.kanban.listRows': baserowSchemaEntry('views.kanban.listRows'),
	'views.kanban.publicListRows': baserowSchemaEntry(
		'views.kanban.publicListRows',
	),
	'views.list': baserowSchemaEntry('views.list'),
	'views.order': baserowSchemaEntry('views.order'),
	'views.publicLinkRowFieldLookup': baserowSchemaEntry(
		'views.publicLinkRowFieldLookup',
	),
	'views.publicTokenAuth': baserowSchemaEntry('views.publicTokenAuth'),
	'views.rotateSlug': baserowSchemaEntry('views.rotateSlug'),
	'views.sortings.create': baserowSchemaEntry('views.sortings.create'),
	'views.sortings.delete': baserowSchemaEntry('views.sortings.delete'),
	'views.sortings.get': baserowSchemaEntry('views.sortings.get'),
	'views.sortings.list': baserowSchemaEntry('views.sortings.list'),
	'views.sortings.prioritize': baserowSchemaEntry('views.sortings.prioritize'),
	'views.sortings.update': baserowSchemaEntry('views.sortings.update'),
	'views.timeline.listRows': baserowSchemaEntry('views.timeline.listRows'),
	'views.timeline.publicListRows': baserowSchemaEntry(
		'views.timeline.publicListRows',
	),
	'views.update': baserowSchemaEntry('views.update'),
	'views.updateDefaultValues': baserowSchemaEntry('views.updateDefaultValues'),
	'views.updateFieldOptions': baserowSchemaEntry('views.updateFieldOptions'),
	'views.updatePremiumAttributes': baserowSchemaEntry(
		'views.updatePremiumAttributes',
	),
	'webhooks.create': baserowSchemaEntry('webhooks.create'),
	'webhooks.delete': baserowSchemaEntry('webhooks.delete'),
	'webhooks.get': baserowSchemaEntry('webhooks.get'),
	'webhooks.list': baserowSchemaEntry('webhooks.list'),
	'webhooks.testCall': baserowSchemaEntry('webhooks.testCall'),
	'webhooks.update': baserowSchemaEntry('webhooks.update'),
	'workspaces.create': baserowSchemaEntry('workspaces.create'),
	'workspaces.createInitial': baserowSchemaEntry('workspaces.createInitial'),
	'workspaces.delete': baserowSchemaEntry('workspaces.delete'),
	'workspaces.deleteUser': baserowSchemaEntry('workspaces.deleteUser'),
	'workspaces.exportApplicationsAsync': baserowSchemaEntry(
		'workspaces.exportApplicationsAsync',
	),
	'workspaces.getPermissions': baserowSchemaEntry('workspaces.getPermissions'),
	'workspaces.importApplicationsAsync': baserowSchemaEntry(
		'workspaces.importApplicationsAsync',
	),
	'workspaces.importExportResource': baserowSchemaEntry(
		'workspaces.importExportResource',
	),
	'workspaces.importResourceUploadFile': baserowSchemaEntry(
		'workspaces.importResourceUploadFile',
	),
	'workspaces.invitationLinks.create': baserowSchemaEntry(
		'workspaces.invitationLinks.create',
	),
	'workspaces.invitationLinks.delete': baserowSchemaEntry(
		'workspaces.invitationLinks.delete',
	),
	'workspaces.invitationLinks.getPublic': baserowSchemaEntry(
		'workspaces.invitationLinks.getPublic',
	),
	'workspaces.invitationLinks.join': baserowSchemaEntry(
		'workspaces.invitationLinks.join',
	),
	'workspaces.invitationLinks.list': baserowSchemaEntry(
		'workspaces.invitationLinks.list',
	),
	'workspaces.invitationLinks.tokenAuth': baserowSchemaEntry(
		'workspaces.invitationLinks.tokenAuth',
	),
	'workspaces.invitationLinks.update': baserowSchemaEntry(
		'workspaces.invitationLinks.update',
	),
	'workspaces.invitations.accept': baserowSchemaEntry(
		'workspaces.invitations.accept',
	),
	'workspaces.invitations.create': baserowSchemaEntry(
		'workspaces.invitations.create',
	),
	'workspaces.invitations.delete': baserowSchemaEntry(
		'workspaces.invitations.delete',
	),
	'workspaces.invitations.get': baserowSchemaEntry(
		'workspaces.invitations.get',
	),
	'workspaces.invitations.getToken': baserowSchemaEntry(
		'workspaces.invitations.getToken',
	),
	'workspaces.invitations.list': baserowSchemaEntry(
		'workspaces.invitations.list',
	),
	'workspaces.invitations.reject': baserowSchemaEntry(
		'workspaces.invitations.reject',
	),
	'workspaces.invitations.update': baserowSchemaEntry(
		'workspaces.invitations.update',
	),
	'workspaces.leave': baserowSchemaEntry('workspaces.leave'),
	'workspaces.list': baserowSchemaEntry('workspaces.list'),
	'workspaces.listExports': baserowSchemaEntry('workspaces.listExports'),
	'workspaces.listUsers': baserowSchemaEntry('workspaces.listUsers'),
	'workspaces.order': baserowSchemaEntry('workspaces.order'),
	'workspaces.update': baserowSchemaEntry('workspaces.update'),
	'workspaces.updateUser': baserowSchemaEntry('workspaces.updateUser'),
} satisfies RequiredPluginEndpointSchemas<typeof baserowEndpointsNested>;

export const baserowEndpointMeta = {
	'abuseReports.create': {
		riskLevel: 'destructive',
		description:
			'Reports a publicly shared resource, like a shared view or form, for abuse. This endpoint can be called by anonymous visitors.',
	},
	'admin.addUserToLicense': {
		riskLevel: 'write',
		description:
			'Adds the user related to the provided parameter and to the license related to the parameter. This only happens if there are enough seats left on the license and if the user is not already on the license.',
	},
	'admin.approveUserTemplate': {
		riskLevel: 'write',
		description:
			'Approves a user template in review or rejected, if the requesting user is staff: the revision they reviewed is listed for everybody on this instance in place of the one listed until then. It must still be the revision under review, not reviewed since, have content, and not be edited since it was….',
	},
	'admin.blockUserTemplate': {
		riskLevel: 'write',
		description:
			"Blocks a user template in any state, if the requesting user is staff. Only its author and instance admins can open it, only instance admins can install or download it, its private link stops working, and its author sees the reason and can't change its visibility or private link. Nothing else….",
	},
	'admin.checkLicense': {
		riskLevel: 'read',
		description:
			"This endpoint checks with the authority if the license needs to be updated. It also checks if the license is operating within its limits and might take action on that. It could also happen that the license has been deleted because there is an instance id mismatch or because it's invalid. In that….",
	},
	'admin.countUserTemplates': {
		riskLevel: 'read',
		description:
			'Returns how many user templates are in review, public, rejected, blocked and private, if the requesting user is staff.',
	},
	'admin.createUser': {
		riskLevel: 'write',
		description:
			'Creates and returns a new user if the requesting user is staff. This works even if new signups are disabled.',
	},
	'admin.dataScanner.createScan': {
		riskLevel: 'write',
		description:
			'Creates a new data scan. A data scan searches the Baserow instance for sensitive data matching a pattern (e.g. credit card numbers), a list of uploaded values, or values sourced from another Baserow table. Enterprise feature.',
	},
	'admin.dataScanner.deleteResult': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes (resolves) a single data scan result, marking it as reviewed. Enterprise feature.',
	},
	'admin.dataScanner.deleteScan': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a data scan and all of its results. Enterprise feature.',
	},
	'admin.dataScanner.exportResults': {
		riskLevel: 'write',
		description:
			'Creates a job to export data scan results to CSV. The exported file includes scan name, workspace, database, table, field, row ID, matched value, and timestamps for each result. Enterprise feature.',
	},
	'admin.dataScanner.getScan': {
		riskLevel: 'read',
		description:
			'Returns a single data scan configuration. Enterprise feature.',
	},
	'admin.dataScanner.getWorkspaceStructure': {
		riskLevel: 'read',
		description:
			'Returns the database/table/field structure of a workspace for use in data scan configuration. Only text-compatible fields are included. Enterprise feature.',
	},
	'admin.dataScanner.listResults': {
		riskLevel: 'read',
		description:
			'Lists all data scan results across all scans. Results represent individual matches found in database fields during scan execution. Can be filtered by scan_id and searched by matched value. Enterprise feature.',
	},
	'admin.dataScanner.listScans': {
		riskLevel: 'read',
		description:
			'Lists all data scans configured for this Baserow instance. Data scans allow administrators to search the entire instance for sensitive data matching a pattern, a list of uploaded values, or values from another Baserow table. Enterprise feature.',
	},
	'admin.dataScanner.triggerScan': {
		riskLevel: 'write',
		description:
			'Triggers an immediate run of the given data scan. The scan executes asynchronously and searches the configured workspaces for matches. Enterprise feature.',
	},
	'admin.dataScanner.updateScan': {
		riskLevel: 'write',
		description:
			'Updates a data scan configuration. When the scan type, pattern, or list items change, stale results are automatically cleaned up. Enterprise feature.',
	},
	'admin.deleteAllUsersFromLicense': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes all the users that are on the license. This will empty all the seats.',
	},
	'admin.deleteLicense': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes the existing license related to the provided parameter. If the license is active, then all the users that are using the license will lose access to the features granted by that license.',
	},
	'admin.deleteUser': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes the specified user, if the requesting user has admin permissions. You cannot delete yourself.',
	},
	'admin.deleteUserFromLicense': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes the user related to the provided parameter and to the license related to the parameter. This only happens if the user is on the license, otherwise nothing will happen.',
	},
	'admin.deleteWorkspace': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes the specified workspace and the applications inside that workspace, if the requesting user is staff.',
	},
	'admin.disableUserTwoFactorAuth': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes the configured two-factor authentication of the specified user, if the requesting user is staff. This can be used to restore access for users that lost their two-factor device and backup codes. The user will be able to log in with just their password and can configure two-factor….',
	},
	'admin.fillLicenseSeats': {
		riskLevel: 'write',
		description:
			'Fills the remaining empty seats of the license with the first users that are found.',
	},
	'admin.getDashboard': {
		riskLevel: 'read',
		description:
			'Returns the new and active users for the last 24 hours, 7 days and 30 days. The previous_ values are the values of the period before, so for example previous_new_users_last_24_hours are the new users that signed up from 48 to 24 hours ago. It can be used to calculate an increase or decrease in….',
	},
	'admin.getLicense': {
		riskLevel: 'read',
		description:
			'Responds with detailed information about the license related to the provided parameter.',
	},
	'admin.impersonateUser': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"This endpoint allows staff to impersonate another user by requesting a JWT token and user object. The requesting user must have staff access in order to do this. It's not possible to impersonate a superuser, staff or deactivated user. Returns a token that acts as another user (self-hosted admins).",
	},
	'admin.listLicenses': {
		riskLevel: 'read',
		description:
			'Lists all the valid licenses that are registered to this instance. A premium license can be used to unlock the premium features for a fixed amount of users. An enterprise license can similarly be used to unlock enterprise features. More information about self hosted licenses can be found on our….',
	},
	'admin.listUserTemplates': {
		riskLevel: 'read',
		description:
			'Returns the user templates in review, public, rejected, blocked or private, if the requesting user is staff: the revision under review of a template in review or rejected, the public revision of a public one, otherwise its latest revision. The templates can be searched by name and by the name or….',
	},
	'admin.listUsers': {
		riskLevel: 'read',
		description:
			'Returns all users with detailed information on each user, if the requesting user is staff.',
	},
	'admin.listViews': {
		riskLevel: 'read',
		description:
			'Returns all database views in the instance with information about the table, database and workspace they belong to, if the requesting user is staff. This can for example be used to find and intervene with publicly shared views that are being abused.',
	},
	'admin.listWorkspaces': {
		riskLevel: 'read',
		description:
			'Returns all workspaces with detailed information on each workspace, if the requesting user is staff.',
	},
	'admin.listWorkspacesAsOptions': {
		riskLevel: 'read',
		description:
			'Lists all workspaces. This endpoint is intended for admin-level features that need a workspace dropdown.',
	},
	'admin.lookupLicenseUsers': {
		riskLevel: 'read',
		description:
			'This endpoint can be used to lookup users that can be added to a license. Users that are already in the license are not returned here. Optionally a search query parameter can be provided to filter the results.',
	},
	'admin.registerLicense': {
		riskLevel: 'write',
		description:
			"Registers a new license. After registering you can assign users to the license that will be able to use the license's features while the license is active. If an existing license with the same license_id already exists and the provided license has been issued later than that one, the existing….",
	},
	'admin.rejectUserTemplate': {
		riskLevel: 'write',
		description:
			"Rejects a user template in review, or a listed one, if the requesting user is staff. A listed template is taken out of the listing, unless only its edit is in review: then only the edit is rejected. The revision they reviewed must still be the template's row, not reviewed since, and the state….",
	},
	'admin.rotateViewSlug': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Rotates the slug of the specified view, permanently invalidating the current public URL, if the requesting user is staff. This works even if the requesting user is not a member of the workspace the view belongs to.',
	},
	'admin.unblockUserTemplate': {
		riskLevel: 'write',
		description:
			"Lifts the block of a user template, if the requesting user is staff, which restores the state it had before the block, its private link included. When it was listed, its latest revision is listed, approved by the admin, unless an admin rejected it. When approval isn't required, a pending….",
	},
	'admin.updateUser': {
		riskLevel: 'write',
		description:
			'Updates specified user attributes and returns the updated user if the requesting user is staff. You cannot update yourself to no longer be an admin or active.',
	},
	'admin.updateView': {
		riskLevel: 'write',
		description:
			"Updates whether the specified view is publicly shared, if the requesting user is staff. This works even if the requesting user is not a member of the workspace the view belongs to, and can for example be used to unshare a publicly shared view that's being abused.",
	},
	'agents.createAction': {
		riskLevel: 'write',
		description:
			'Pins authenticated realtime recovery reads to the primary database. Realtime refresh markers are emitted after a primary-database snapshot. Reading their replacement data from a lagging replica could otherwise restore stale state in the client. Authentication is deliberately completed before….',
	},
	'agents.createConversation': {
		riskLevel: 'write',
		description:
			'Starts a private conversation with its first message. The conversation and message uuids identify the request, so a retry returns the already accepted message, and reusing a uuid with different content is rejected.',
	},
	'agents.createMessage': {
		riskLevel: 'destructive',
		description:
			"Adds a message to one of the authenticated user's conversations. The message uuid identifies the request, so a retry returns the already accepted message, and reusing it with different content is rejected.",
	},
	'agents.createTrigger': {
		riskLevel: 'write',
		description:
			"Adds a trigger of one of the configuration's available_trigger_types to the agent, with initial values for its service. A configured service starts receiving events right away. Requires permission to update the agent and read its configuration.",
	},
	'agents.decideToolApprovals': {
		riskLevel: 'write',
		description:
			"Approves or rejects tool calls that the waiting reply of one of the authenticated user's conversations, or of a shared conversation a trigger started, holds for approval. Once none are left to decide, a run continues the reply and the response names it. With always_allow, the tools of the….",
	},
	'agents.deleteAction': {
		riskLevel: 'destructive',
		irreversible: true,
		description: ' (DELETE /api/agent/{agent_id}/actions/{action_id}/)',
	},
	'agents.deleteConversation': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Moves one of the authenticated user's conversations to the trash and stops the reply being written in it. Only the owner sees and restores it there.",
	},
	'agents.deleteTrigger': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Moves the trigger to the trash, where it can be restored. Requires permission to update the agent and read its configuration.',
	},
	'agents.get': {
		riskLevel: 'read',
		description:
			'Returns the agent, including its readiness, and records that the user opened it.',
	},
	'agents.getAction': {
		riskLevel: 'read',
		description: ' (GET /api/agent/{agent_id}/actions/{action_id}/)',
	},
	'agents.getConfiguration': {
		riskLevel: 'read',
		description:
			'Returns the instructions, provider, model, reasoning effort and run-as identity of the agent, with its readiness and the fields that are missing or no longer available.',
	},
	'agents.listActions': {
		riskLevel: 'read',
		description:
			'Pins authenticated realtime recovery reads to the primary database. Realtime refresh markers are emitted after a primary-database snapshot. Reading their replacement data from a lagging replica could otherwise restore stale state in the client. Authentication is deliberately completed before….',
	},
	'agents.listConversations': {
		riskLevel: 'read',
		description:
			"Lists the authenticated user's own conversations with the agent and the shared ones its triggers started, pinned first, then most recently active within each group. Each includes its number of tool calls waiting for the user's approval.",
	},
	'agents.listMessages': {
		riskLevel: 'read',
		description:
			"Lists the messages of one of the authenticated user's conversations, newest page first, each page in chronological order.",
	},
	'agents.listRunAsIdentities': {
		riskLevel: 'read',
		description:
			'Lists active workspace identities selectable for this Agent. Requires permission to read and update its configuration.',
	},
	'agents.listTriggerTypes': {
		riskLevel: 'read',
		description:
			"Lists the trigger types the agent may use, each with what its form may choose from for the agent's run identity, such as the tables it can read, and the overlap rule a new trigger of it gets. Requires permission to read the agent's configuration.",
	},
	'agents.listTriggers': {
		riskLevel: 'read',
		description:
			"Lists the triggers of the agent with their service, message and the schema of the payload each event provides. Requires permission to read the agent's configuration.",
	},
	'agents.load': {
		riskLevel: 'write',
		description:
			'Records that the user opened the agent. (POST /api/agent/{agent_id}/)',
	},
	'agents.updateAction': {
		riskLevel: 'write',
		description: ' (PATCH /api/agent/{agent_id}/actions/{action_id}/)',
	},
	'agents.updateConfiguration': {
		riskLevel: 'write',
		description:
			'Updates the provided fields of the agent configuration and returns the result. An incomplete configuration can be saved and finished later.',
	},
	'agents.updateConversation': {
		riskLevel: 'write',
		description:
			"Updates the title or pinned state of one of the authenticated user's conversations, without changing its last activity time.",
	},
	'agents.updateTrigger': {
		riskLevel: 'write',
		description:
			'Updates the provided fields of the trigger: its name, its switch, its message, its overlap rule, its batch size, its type and the values of its service. Another type replaces the service with a new one of that type. Switching it off cancels its queued replies. Requires permission to update the….',
	},
	'aiProviders.create': {
		riskLevel: 'write',
		description:
			'Pins authenticated realtime recovery reads to the primary database. Realtime refresh markers are emitted after a primary-database snapshot. Reading their replacement data from a lagging replica could otherwise restore stale state in the client. Authentication is deliberately completed before….',
	},
	'aiProviders.createModel': {
		riskLevel: 'write',
		description: ' (POST /api/ai-providers/{provider_id}/models/)',
	},
	'aiProviders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: ' (DELETE /api/ai-providers/{provider_id}/)',
	},
	'aiProviders.deleteModel': {
		riskLevel: 'destructive',
		irreversible: true,
		description: ' (DELETE /api/ai-providers/models/{model_id}/)',
	},
	'aiProviders.discoverModels': {
		riskLevel: 'read',
		description: ' (GET /api/ai-providers/models/discover/)',
	},
	'aiProviders.getModelUsage': {
		riskLevel: 'read',
		description: ' (GET /api/ai-providers/models/{model_id}/usage/)',
	},
	'aiProviders.list': {
		riskLevel: 'read',
		description:
			'Pins authenticated realtime recovery reads to the primary database. Realtime refresh markers are emitted after a primary-database snapshot. Reading their replacement data from a lagging replica could otherwise restore stale state in the client. Authentication is deliberately completed before….',
	},
	'aiProviders.listFeatureSettings': {
		riskLevel: 'read',
		description:
			'Pins authenticated realtime recovery reads to the primary database. Realtime refresh markers are emitted after a primary-database snapshot. Reading their replacement data from a lagging replica could otherwise restore stale state in the client. Authentication is deliberately completed before….',
	},
	'aiProviders.listTypes': {
		riskLevel: 'read',
		description: ' (GET /api/ai-providers/types/)',
	},
	'aiProviders.testModels': {
		riskLevel: 'destructive',
		description: ' (POST /api/ai-providers/models/test/)',
	},
	'aiProviders.update': {
		riskLevel: 'write',
		description: ' (PATCH /api/ai-providers/{provider_id}/)',
	},
	'aiProviders.updateFeatureSetting': {
		riskLevel: 'write',
		description: ' (PUT /api/ai-providers/features/{feature_type}/)',
	},
	'aiProviders.updateModel': {
		riskLevel: 'write',
		description: ' (PATCH /api/ai-providers/models/{model_id}/)',
	},
	'applications.create': {
		riskLevel: 'write',
		description:
			'Creates a new application based on the provided type. The newly created application is going to be added to the workspace related to the provided workspace_id parameter. If the authorized user does not belong to the workspace an error will be returned.',
	},
	'applications.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes an application if the authorized user is in the application's workspace. All the related children are also going to be deleted. For example in case of a database application all the underlying tables, fields, views and rows are going to be deleted.",
	},
	'applications.duplicateAsync': {
		riskLevel: 'write',
		description:
			"Duplicate an application if the authorized user is in the application's workspace. All the related children are also going to be duplicated. For example in case of a database application all the underlying tables, fields, views and rows are going to be duplicated.",
	},
	'applications.get': {
		riskLevel: 'read',
		description:
			"Returns the requested application if the authorized user is in the application's workspace. The properties that belong to the application can differ per type.",
	},
	'applications.list': {
		riskLevel: 'read',
		description:
			'Lists all the applications of the workspace related to the provided workspace_id parameter if the authorized user is in that workspace. If theworkspace is related to a template, then this endpoint will be publicly accessible. The properties that belong to the application can differ per type. An….',
	},
	'applications.listAll': {
		riskLevel: 'read',
		description:
			'Lists all the applications that the user has access to. The properties that belong to the application can differ per type. An application always belongs to a single workspace. All the applications of the workspaces that the user has access to are going to be listed here.',
	},
	'applications.order': {
		riskLevel: 'write',
		description:
			'Changes the order of the provided application ids to the matching position that the id has in the list. If the authorized user does not belong to the workspace it will be ignored. The order of the not provided tables will be set to 0.',
	},
	'applications.update': {
		riskLevel: 'write',
		description:
			"Updates the existing application related to the provided application_id param if the authorized user is in the application's workspace. It is not possible to change the type, but properties like the name can be changed.",
	},
	'assistant.cancelMessage': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel an ongoing assistant message generation in the specified chat.',
	},
	'assistant.getOnboardingPromptSuggestions': {
		riskLevel: 'read',
		description:
			'Suggests databases the user could create during the onboarding, based on the industry and team they provided. The first suggestion is the most relevant one.',
	},
	'assistant.listChatMessages': {
		riskLevel: 'read',
		description:
			'List all messages in the specified AI assistant chat, with the run answering its latest message while Kuma works on it.',
	},
	'assistant.listChats': {
		riskLevel: 'read',
		description:
			'List all AI assistant chats for the current user in the specified workspace.',
	},
	'assistant.sendMessage': {
		riskLevel: 'destructive',
		description:
			'Send a message to the specified AI assistant chat and stream back the response. Reconnect through the core chat-run stream endpoint.',
	},
	'assistant.submitMessageFeedback': {
		riskLevel: 'write',
		description:
			'Provide sentiment and feedback for the given AI assistant chat message.',
	},
	'auditLog.adminExport': {
		riskLevel: 'write',
		description:
			'Creates a job to export the filtered audit log to a CSV file. This is a enterprise feature.',
	},
	'auditLog.adminList': {
		riskLevel: 'read',
		description:
			'Lists all audit log entries for the given workspace id. This is a enterprise feature.',
	},
	'auditLog.adminListActionTypes': {
		riskLevel: 'read',
		description:
			'List all distinct action types related to an audit log entry. This is a enterprise feature.',
	},
	'auditLog.adminListActors': {
		riskLevel: 'read',
		description:
			'List users and identities available as audit log actor filters. This is an enterprise feature.',
	},
	'auditLog.export': {
		riskLevel: 'write',
		description:
			'Creates a job to export the filtered audit log to a CSV file. This is a enterprise feature.',
	},
	'auditLog.list': {
		riskLevel: 'read',
		description:
			'Lists all audit log entries for the given workspace id. This is a enterprise feature.',
	},
	'auditLog.listActionTypes': {
		riskLevel: 'read',
		description:
			'List all distinct action types related to an audit log entry. This is a enterprise feature.',
	},
	'auditLog.listActors': {
		riskLevel: 'read',
		description:
			'List users and identities available as audit log actor filters. This is an enterprise feature.',
	},
	'auth.configureTwoFactor': {
		riskLevel: 'write',
		description:
			'Configures two-factor authentication for the authenticated user.',
	},
	'auth.createProvider': {
		riskLevel: 'write',
		description:
			'Creates a new authentication provider. This can be used to enable authentication with a third party service like Google or Facebook.',
	},
	'auth.deleteProvider': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an authentication provider. (DELETE /api/admin/auth-provider/{auth_provider_id}/)',
	},
	'auth.disableTwoFactor': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Disables two-factor authentication for the authenticated user.',
	},
	'auth.getProvider': {
		riskLevel: 'read',
		description:
			'Get an authentication provider. (GET /api/admin/auth-provider/{auth_provider_id}/)',
	},
	'auth.listProviders': {
		riskLevel: 'read',
		description: 'List all the available authentication providers.',
	},
	'auth.listProvidersLoginOptions': {
		riskLevel: 'read',
		description:
			'Lists the available login options for the configured authentication providers.',
	},
	'auth.providerLoginUrl': {
		riskLevel: 'read',
		description:
			'Return the correct redirect_url to initiate the SSO SAML login. It needs an email address if multiple SAML providers are configured otherwise the only configured SAML provider signup URL will be returned. Public: no sign-in.',
	},
	'auth.twoFactorConfiguration': {
		riskLevel: 'read',
		description:
			'Returns two-factor auth configuration for the authenticated user.',
	},
	'auth.updateProvider': {
		riskLevel: 'write',
		description:
			'Updates a new authentication provider. This can be used to enable authentication with a third party service like Google or Facebook.',
	},
	'auth.verifyTotp': {
		riskLevel: 'write',
		description: 'Verifies TOTP two-factor authentication. Public: no sign-in.',
	},
	'automations.history.cancelWorkflow': {
		riskLevel: 'write',
		description:
			'Requests the cancellation of a running workflow. The run stops before the next node is dispatched; the node currently running is not interrupted. If the run completes before the cancellation takes effect, it resolves as completed. Only the first request is recorded: a later one is refused so….',
	},
	'automations.history.getNodeResult': {
		riskLevel: 'read',
		description:
			"Returns the node history's result JSON. (GET /api/automation/node_histories/{node_history_id}/result/)",
	},
	'automations.history.listNodeHistories': {
		riskLevel: 'read',
		description: 'Returns all node histories for the given workflow history.',
	},
	'automations.nodes.create': {
		riskLevel: 'write',
		description:
			'Creates a new automation workflow node. (POST /api/automation/workflow/{workflow_id}/nodes/)',
	},
	'automations.nodes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes an existing automation node. (DELETE /api/automation/node/{node_id}/)',
	},
	'automations.nodes.duplicate': {
		riskLevel: 'write',
		description:
			'Duplicate a node of a workflow. (POST /api/automation/node/{node_id}/duplicate/)',
	},
	'automations.nodes.list': {
		riskLevel: 'read',
		description:
			"Lists all the nodes of the workflow related to the provided parameter if the user has access to the related automation's workspace. If the workspace is related to a template, then this endpoint will be publicly accessible.",
	},
	'automations.nodes.move': {
		riskLevel: 'write',
		description: 'Move a node in a workflow to a new position.',
	},
	'automations.nodes.replace': {
		riskLevel: 'write',
		description: 'Replace a node in a workflow with one of a new type.',
	},
	'automations.nodes.simulateDispatch': {
		riskLevel: 'destructive',
		description:
			'Simulate a dispatch for a node. (POST /api/automation/node/{node_id}/simulate-dispatch/)',
	},
	'automations.nodes.update': {
		riskLevel: 'write',
		description:
			'Updates an existing automation node. (PATCH /api/automation/node/{node_id}/)',
	},
	'automations.workflows.create': {
		riskLevel: 'write',
		description:
			'Creates a new Automation Workflow. (POST /api/automation/{automation_id}/workflows/)',
	},
	'automations.workflows.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes an existing workflow of an automation.',
	},
	'automations.workflows.duplicateAsync': {
		riskLevel: 'write',
		description:
			"Start a job to duplicate the workflow with the provided workflow_id parameter if the authorized user has access to the automation's workspace.",
	},
	'automations.workflows.get': {
		riskLevel: 'read',
		description: 'Retrieve a single workflow of an automation.',
	},
	'automations.workflows.getHistory': {
		riskLevel: 'read',
		description:
			'Retrieve the history for a workflow. (GET /api/automation/workflows/{workflow_id}/history/)',
	},
	'automations.workflows.order': {
		riskLevel: 'write',
		description: 'Apply a new order to the workflows of an automation.',
	},
	'automations.workflows.publish': {
		riskLevel: 'write',
		description:
			'This endpoint starts an asynchronous job to publish the automation workflow. The job clones the current version of the given automation and publishes it for the given workflow.',
	},
	'automations.workflows.test': {
		riskLevel: 'destructive',
		description:
			'This endpoint plan the execution of a test run for this workflow.',
	},
	'automations.workflows.update': {
		riskLevel: 'write',
		description: 'Updates an existing workflow of an automation.',
	},
	'builder.dataSources.create': {
		riskLevel: 'write',
		description:
			'Creates a new builder data_source. (POST /api/builder/page/{page_id}/data-sources/)',
	},
	'builder.dataSources.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes the data_source related by the given id.',
	},
	'builder.dataSources.dispatch': {
		riskLevel: 'read',
		description:
			'Dispatches the service of the related data_source and returns the result.',
	},
	'builder.dataSources.dispatchAll': {
		riskLevel: 'read',
		description: 'Dispatches the service of the related page data_sources.',
	},
	'builder.dataSources.dispatchAllPublic': {
		riskLevel: 'read',
		description:
			"Dispatches the service of the related page data_sources. Takes the token of a published application's user (userSources.tokenAuth), not a Baserow account.",
	},
	'builder.dataSources.dispatchPublic': {
		riskLevel: 'read',
		description:
			"Dispatches the service of the related data_source and returns the result. Takes the token of a published application's user (userSources.tokenAuth), not a Baserow account.",
	},
	'builder.dataSources.getRecordNames': {
		riskLevel: 'read',
		description:
			"Find the record names associated with a given list of record ids. Takes a signed-in user or a published application's user.",
	},
	'builder.dataSources.list': {
		riskLevel: 'read',
		description:
			"Lists all the data_sources of the page related to the provided parameter if the user has access to the related builder's workspace. If the workspace is related to a template, then this endpoint will be publicly accessible.",
	},
	'builder.dataSources.listPublic': {
		riskLevel: 'read',
		description:
			"Lists all the data_sources of the page related to the provided parameter if the builder is public. Takes the token of a published application's user (userSources.tokenAuth), not a Baserow account.",
	},
	'builder.dataSources.move': {
		riskLevel: 'write',
		description:
			'Moves the data_source in the page before another data_source or at the end of the page if no before data_source is given. The data_sources must belong to the same page.',
	},
	'builder.dataSources.simulateDispatch': {
		riskLevel: 'write',
		description:
			"Dispatches the service of the related data_source and stores the result as the service's sample data. Returns the updated data_source.",
	},
	'builder.dataSources.update': {
		riskLevel: 'write',
		description: 'Updates an existing builder data_source.',
	},
	'builder.domains.askPublicExists': {
		riskLevel: 'read',
		description:
			"This endpoint can be used to check whether a domain exists for SSL certificate purposes. It's compatible with the Caddy on_demand TLS as described here: https://caddyserver.com/docs/json/apps/tls/automation/on_demand/ask/. It will respond with a 200 status code if it exists or a 404 if it….",
	},
	'builder.domains.create': {
		riskLevel: 'write',
		description: 'Creates a new domain for an application builder.',
	},
	'builder.domains.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes an existing domain of an application builder.',
	},
	'builder.domains.list': {
		riskLevel: 'read',
		description:
			'Gets all the domains of a builder. (GET /api/builder/{builder_id}/domains/)',
	},
	'builder.domains.order': {
		riskLevel: 'write',
		description: 'Apply a new order to the domains of a builder.',
	},
	'builder.domains.publish': {
		riskLevel: 'write',
		description:
			'This endpoint starts an asynchronous job to publish the builder. The job clones the current version of the given builder and publish it for the given domain.',
	},
	'builder.domains.update': {
		riskLevel: 'write',
		description: 'Updates an existing domain of an application builder.',
	},
	'builder.elements.create': {
		riskLevel: 'write',
		description:
			'Creates a new builder element. (POST /api/builder/page/{page_id}/elements/)',
	},
	'builder.elements.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes the element related by the given id.',
	},
	'builder.elements.duplicate': {
		riskLevel: 'write',
		description:
			'Duplicates an element and all of the elements children and the associated workflow actions as well.',
	},
	'builder.elements.list': {
		riskLevel: 'read',
		description:
			"Lists all the elements of the page related to the provided parameter if the user has access to the related builder's workspace. If the workspace is related to a template, then this endpoint will be publicly accessible.",
	},
	'builder.elements.listPublic': {
		riskLevel: 'read',
		description:
			"Lists all the elements of the page related to the provided parameter. If the user is Anonymous, the page must belong to a published builder instance to being accessible. Takes the token of a published application's user (userSources.tokenAuth), not a Baserow account.",
	},
	'builder.elements.move': {
		riskLevel: 'write',
		description:
			'Moves the element in the page before another element or at the end of the page if no before element is given. The elements must belong to the same page.',
	},
	'builder.elements.update': {
		riskLevel: 'write',
		description:
			'Updates an existing builder element. (PATCH /api/builder/element/{element_id}/)',
	},
	'builder.pages.create': {
		riskLevel: 'write',
		description: 'Creates a new page for an application builder.',
	},
	'builder.pages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes an existing page of an application builder.',
	},
	'builder.pages.duplicateAsync': {
		riskLevel: 'write',
		description:
			"Start a job to duplicate the page with the provided page_id parameter if the authorized user has access to the builder's workspace.",
	},
	'builder.pages.order': {
		riskLevel: 'write',
		description: 'Apply a new order to the pages of a builder.',
	},
	'builder.pages.update': {
		riskLevel: 'write',
		description: 'Updates an existing page of an application builder.',
	},
	'builder.preview.createGrant': {
		riskLevel: 'write',
		description:
			"Start the preview process for a logged-in editor. This is the only step that uses the editor's normal account login. It makes sure the editor may read the requested builder before issuing a temporary preview pass. The returned URL is then opened by the browser to continue with….",
	},
	'builder.preview.exchangeGrant': {
		riskLevel: 'read',
		description:
			'Consume the preview pass, set a session cookie, and redirect the browser. Invalid or expired tokens return 404 without creating a cookie. The requested redirect is accepted only when it points to the configured preview website; otherwise a safe preview root URL is used. Cookie security flags are…. Public: no sign-in.',
	},
	'builder.preview.exchangeHandoff': {
		riskLevel: 'write',
		description:
			'Let the preview Nuxt server consume an opaque one-time handoff code. Public: no sign-in.',
	},
	'builder.public.getByDomainName': {
		riskLevel: 'read',
		description:
			"Returns the public serialized version of the builder for the given domain name and its pages . Takes the token of a published application's user (userSources.tokenAuth), not a Baserow account.",
	},
	'builder.public.getById': {
		riskLevel: 'read',
		description:
			"Returns the public serialized version of the builder and its pages for the given builder id. Takes the token of a published application's user (userSources.tokenAuth), not a Baserow account.",
	},
	'builder.public.getCustomCss': {
		riskLevel: 'read',
		description: 'Returns the custom code for the given builder.',
	},
	'builder.public.getCustomHtml': {
		riskLevel: 'read',
		description: 'Returns the custom code for the given builder.',
	},
	'builder.public.getCustomJs': {
		riskLevel: 'read',
		description: 'Returns the custom code for the given builder.',
	},
	'builder.public.getPreviewCustomCss': {
		riskLevel: 'read',
		description:
			'Returns the custom code for the given builder. Public: no sign-in.',
	},
	'builder.public.getPreviewCustomHtml': {
		riskLevel: 'read',
		description:
			'Returns the custom code for the given builder. Public: no sign-in.',
	},
	'builder.public.getPreviewCustomJs': {
		riskLevel: 'read',
		description:
			'Returns the custom code for the given builder. Public: no sign-in.',
	},
	'builder.theme.update': {
		riskLevel: 'write',
		description: 'Updates the theme properties for the provided id.',
	},
	'builder.workflowActions.create': {
		riskLevel: 'write',
		description:
			'Creates a new builder workflow action. (POST /api/builder/page/{page_id}/workflow_actions/)',
	},
	'builder.workflowActions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes the workflow action related by the given id.',
	},
	'builder.workflowActions.dispatch': {
		riskLevel: 'destructive',
		description:
			"Dispatches the service of the related workflow_action and returns the result. Takes a signed-in user or a published application's user.",
	},
	'builder.workflowActions.list': {
		riskLevel: 'read',
		description:
			"Lists all the workflow actions of the page related to the provided parameter if the user has access to the related builder's workspace. If the workspace is related to a template, then this endpoint will be publicly accessible.",
	},
	'builder.workflowActions.listPublic': {
		riskLevel: 'read',
		description:
			"Lists all the workflow actions with their public accessible data. Some configuration might be omitted for security reasons such as passwords or PII. Takes the token of a published application's user (userSources.tokenAuth), not a Baserow account.",
	},
	'builder.workflowActions.order': {
		riskLevel: 'write',
		description: 'Apply a new order to the workflow actions of a page.',
	},
	'builder.workflowActions.update': {
		riskLevel: 'write',
		description: 'Updates an existing builder workflow action.',
	},
	'chatRuns.cancel': {
		riskLevel: 'write',
		description:
			'Request Stop for this run. Active tools drain before it ends.',
	},
	'chatRuns.get': {
		riskLevel: 'read',
		description:
			'Read durable run status and its saved outcome, including after replay expires.',
	},
	'chatRuns.stream': {
		riskLevel: 'read',
		description:
			"Follow a run's output as JSON records separated by blank lines, ending with run.finished. While no output arrives, a run.heartbeat record is sent every few seconds. Pass the last received cursor to resume.",
	},
	'dashboards.dataSources.dispatch': {
		riskLevel: 'read',
		description:
			'Dispatches the service of the related data source and returns the result.',
	},
	'dashboards.dataSources.list': {
		riskLevel: 'read',
		description:
			"Lists all the data sources of the dashboard if the user has access to the related dashboard's workspace.",
	},
	'dashboards.dataSources.update': {
		riskLevel: 'write',
		description: 'Updates an existing dashboard data source.',
	},
	'dashboards.public.dispatchDataSource': {
		riskLevel: 'read',
		description:
			'Dispatches the service of the related data source of the publicly shared dashboard and returns the result.',
	},
	'dashboards.public.getAuthInfo': {
		riskLevel: 'read',
		description:
			'Returns what the password page of a publicly shared dashboard needs before the password is entered, currently whether the Baserow logo must be shown. Nothing about the dashboard itself is revealed.',
	},
	'dashboards.public.getInfo': {
		riskLevel: 'read',
		description:
			'Returns the dashboard, its widgets and its data sources of a publicly shared dashboard. Only the information needed to render the dashboard is included, never the configuration of the data sources.',
	},
	'dashboards.public.tokenAuth': {
		riskLevel: 'write',
		description:
			"Returns a valid never-expiring JWT token for this publicly shared dashboard if the password provided matches with the one saved by the dashboard's owner.",
	},
	'dashboards.rotateSlug': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Rotates the unique slug of the dashboard by replacing it with a new value. This changes the publicly shared URL of the dashboard, so anyone with the old URL won't be able to access the dashboard anymore.",
	},
	'dashboards.updatePremiumAttributes': {
		riskLevel: 'write',
		description: 'Sets dashboard attributes only available for premium users.',
	},
	'dashboards.updateSharing': {
		riskLevel: 'write',
		description:
			'Makes the dashboard publicly accessible via its shared URL, or private again, and sets or removes the password that visitors must enter. Changing public removes any previously set password.',
	},
	'dashboards.widgets.create': {
		riskLevel: 'write',
		description:
			'Creates a new dashboard widget. (POST /api/dashboard/{dashboard_id}/widgets/)',
	},
	'dashboards.widgets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes the widget related to the given id.',
	},
	'dashboards.widgets.list': {
		riskLevel: 'read',
		description:
			'Lists all the widgets of the dashboard related to the provided parameter if the user has access to the related workspace.',
	},
	'dashboards.widgets.update': {
		riskLevel: 'write',
		description:
			'Updates an existing dashboard widget. (PATCH /api/dashboard/widgets/{widget_id}/)',
	},
	'dashboards.widgets.updateLayout': {
		riskLevel: 'write',
		description:
			'Atomically updates and vertically compacts the layout of every dashboard widget visible to the current user.',
	},
	'databaseTokens.check': {
		riskLevel: 'read',
		description:
			'This endpoint check be used to check if the provided personal API token is valid. If returns a 200 response if so and a 403 is not. This can be used by integrations like Zapier or n8n to test if a token is valid. Takes a database token.',
	},
	'databaseTokens.create': {
		riskLevel: 'write',
		description:
			'Creates a new database token for a given workspace and for the authorized user.',
	},
	'databaseTokens.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes the existing database token if it is owned by the authorized user and ifthe user has access to the related workspace.',
	},
	'databaseTokens.get': {
		riskLevel: 'read',
		description:
			'Returns the requested database token if it is owned by the authorized user andif the user has access to the related workspace.',
	},
	'databaseTokens.list': {
		riskLevel: 'read',
		description:
			"Lists all the database tokens that belong to the authorized user. A token can be used to create, read, update and delete rows in the tables of the token's workspace. It only works on the tables if the token has the correct permissions. The Database table rows endpoints can be used for these….",
	},
	'databaseTokens.update': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Updates the existing database token if it is owned by the authorized user and ifthe user has access to the related workspace.',
	},
	'fields.changePrimary': {
		riskLevel: 'write',
		description:
			'Changes the primary field of a table to the one provided in the body payload.',
	},
	'fields.create': {
		riskLevel: 'write',
		description:
			"Creates a new field for the table related to the provided table_id parameter if the authorized user has access to the related database's workspace. Depending on the type, different properties can optionally be set.If creating the field causes other fields to change then the specificinstances of…. Takes a database token or a signed-in user.",
	},
	'fields.createWorkflowAction': {
		riskLevel: 'write',
		description:
			'Creates a new database workflow action. (POST /api/database/field/{field_id}/workflow_actions/)',
	},
	'fields.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes the existing field if the authorized user has access to the related database's workspace. Note that all the related data to that field is also deleted. Primary fields cannot be deleted because their value represents the row. If deleting the field causes other fields to change then the….",
	},
	'fields.deleteWorkflowAction': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes the workflow action related by the given id.',
	},
	'fields.dispatchWorkflowActions': {
		riskLevel: 'write',
		description:
			'Runs every workflow action of a button field, in order, for the given row, and returns one result per action. When any action reaches outside Baserow, the click runs in a job instead and the response is a 202 with that job.',
	},
	'fields.duplicate': {
		riskLevel: 'write',
		description:
			"Duplicates the table with the provided table_id parameter if the authorized user has access to the database's workspace.",
	},
	'fields.generateAiValue': {
		riskLevel: 'destructive',
		description:
			"Endpoint that's used by the AI field to start an sync task that will update the cell value of the provided row IDs based on the dynamically constructed prompt configured in the field settings. This is a premium feature. Uses the AI field's model and its credits.",
	},
	'fields.generateFormulaWithAi': {
		riskLevel: 'destructive',
		description:
			'This endpoint generates a Baserow formula for the table related to the provided id, based on the human readable input provided in the request body. This is a premium feature.',
	},
	'fields.get': {
		riskLevel: 'read',
		description:
			"Returns the existing field if the authorized user has access to the related database's workspace. Depending on the type different properties could be returned.",
	},
	'fields.getUniqueRowValues': {
		riskLevel: 'read',
		description:
			'Returns a list of all the unique row values for an existing field, sorted in order of frequency.',
	},
	'fields.list': {
		riskLevel: 'read',
		description:
			"Lists all the fields of the table related to the provided parameter if the user has access to the related database's workspace. If the workspace is related to a template, then this endpoint will be publicly accessible. A table consists of fields and each field can have a different type. Each…. Takes a database token or a signed-in user.",
	},
	'fields.listWorkflowActions': {
		riskLevel: 'read',
		description:
			"Lists all the workflow actions of the button field related to the provided parameter if the user has access to the related database's workspace.",
	},
	'fields.orderWorkflowActions': {
		riskLevel: 'write',
		description: 'Apply a new order to the workflow actions of a button field.',
	},
	'fields.passwordAuthentication': {
		riskLevel: 'write',
		description:
			'Checks if the provided password and row matches what is stored in the cell. The field must have allow_endpoint_authentication set to true in order to work. Takes a database token or a signed-in user.',
	},
	'fields.permissions.get': {
		riskLevel: 'read',
		description:
			'Retrieve the permissions for writing field values and form visibility of a specific field. This is a enterprise feature.',
	},
	'fields.permissions.listSubjectOptions': {
		riskLevel: 'read',
		description:
			'Searches users, identities, and teams that can be selected for a field-specific permission. Results are paginated and exclude the requested subjects. This is an enterprise feature.',
	},
	'fields.permissions.update': {
		riskLevel: 'write',
		description:
			'Update permissions for writing field values and form visibility for a specific field. This endpoint is used to restrict the ability to modify field values to the roles defined. It also makes it possible to decide if the field can be exposed in forms or not. This is a enterprise feature.',
	},
	'fields.rules.create': {
		riskLevel: 'write',
		description:
			'Create a field rule for a table. (POST /api/database/field-rules/{table_id}/)',
	},
	'fields.rules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a field rule. (DELETE /api/database/field-rules/{table_id}/rule/{rule_id}/)',
	},
	'fields.rules.get': {
		riskLevel: 'read',
		description: 'Get a list of field rules for the table.',
	},
	'fields.rules.getInvalidRows': {
		riskLevel: 'read',
		description:
			'Get a list of invalid rows. (GET /api/database/field-rules/{table_id}/invalid-rows/)',
	},
	'fields.rules.update': {
		riskLevel: 'write',
		description:
			'Update a specific field rule. (PUT /api/database/field-rules/{table_id}/rule/{rule_id}/)',
	},
	'fields.typeFormula': {
		riskLevel: 'read',
		description:
			'Calculates and returns the type of the specified formula value. Does not change the state of the field in any way.',
	},
	'fields.update': {
		riskLevel: 'write',
		description:
			"Updates the existing field if the authorized user has access to the related database's workspace. The type can also be changed and depending on that type, different additional properties can optionally be set. If you change the field type it could happen that the data conversion fails, in that….",
	},
	'fields.updateWorkflowAction': {
		riskLevel: 'write',
		description: 'Updates an existing database workflow action.',
	},
	'health.check': {
		riskLevel: 'read',
		description:
			'Runs a full health check testing as many services and systems as possible. These health checks can be expensive operations such as writing files to storage etc.',
	},
	'health.checkCeleryQueueSize': {
		riskLevel: 'read',
		description:
			'Health check endpoint to check if the celery, export and/or chat_run queue has exceeded the maximum healthy size. Responds with 200 if there there are less than 10 in all queues provided. Otherwise responds with a 503.',
	},
	'health.testEmail': {
		riskLevel: 'destructive',
		description:
			"Sends a test email to the provided email address. Useful for testing Baserow's email configuration as errors are clearly returned.",
	},
	'identities.create': {
		riskLevel: 'write',
		description:
			'Creates a new identity in a workspace. (POST /api/identities/workspace/{workspace_id}/)',
	},
	'identities.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes an existing identity. (DELETE /api/identities/{identity_id}/)',
	},
	'identities.list': {
		riskLevel: 'read',
		description:
			'Lists the identities in a workspace. (GET /api/identities/workspace/{workspace_id}/)',
	},
	'identities.update': {
		riskLevel: 'write',
		description:
			'Updates an existing identity. (PATCH /api/identities/{identity_id}/)',
	},
	'incomingWebhooks.callDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Receives and handles a webhook request. (DELETE /api/webhooks/{webhook_uid}/)',
	},
	'incomingWebhooks.callGet': {
		riskLevel: 'read',
		description:
			'Receives and handles a webhook request. (GET /api/webhooks/{webhook_uid}/)',
	},
	'incomingWebhooks.callPatch': {
		riskLevel: 'write',
		description:
			'Receives and handles a webhook request. (PATCH /api/webhooks/{webhook_uid}/)',
	},
	'incomingWebhooks.callPost': {
		riskLevel: 'write',
		description:
			'Receives and handles a webhook request. (POST /api/webhooks/{webhook_uid}/)',
	},
	'incomingWebhooks.callPut': {
		riskLevel: 'write',
		description:
			'Receives and handles a webhook request. (PUT /api/webhooks/{webhook_uid}/)',
	},
	'integrations.completeMcpServerOauth': {
		riskLevel: 'write',
		description:
			'Finishes connecting an account to an MCP server with the code the provider redirected back with. Only the user who started the sign-in can finish it.',
	},
	'integrations.create': {
		riskLevel: 'write',
		description:
			'Creates a new integration. (POST /api/application/{application_id}/integrations/)',
	},
	'integrations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes the integration related by the given id.',
	},
	'integrations.disconnectMcpServerOauth': {
		riskLevel: 'write',
		description: 'Forgets the account connected to an MCP server.',
	},
	'integrations.list': {
		riskLevel: 'read',
		description:
			"Lists all the integrations of the application related to the provided parameter if the user has access to the related application's workspace. If the workspace is related to a template, then this endpoint will be publicly accessible.",
	},
	'integrations.move': {
		riskLevel: 'write',
		description:
			'Moves the integration in the application before another integration or at the end of the application if no before integration is given. The integrations must belong to the same application.',
	},
	'integrations.refreshMcpServerTools': {
		riskLevel: 'write',
		description:
			"Lists the MCP server's tools and stores them. New tools start off. A tool that is on and changed is turned off until it is reviewed.",
	},
	'integrations.startMcpServerOauth': {
		riskLevel: 'write',
		description:
			'Starts connecting an account to an MCP server that uses OAuth. Open the returned URL in a popup: the provider redirects back to a Baserow page, which finishes the sign-in with the complete endpoint.',
	},
	'integrations.update': {
		riskLevel: 'write',
		description:
			'Updates an existing integration. (PATCH /api/integration/{integration_id}/)',
	},
	'integrations.updateMcpServerTools': {
		riskLevel: 'write',
		description:
			'Turns the given tools on or off and sets whether they change data. Saving a tool marks its current definition as reviewed.',
	},
	'jobs.cancel': {
		riskLevel: 'write',
		description:
			'Cancels a job. Note: you can cancel only a scheduled or a job that is already running. The user requesting must be the owner of the job to cancel.',
	},
	'jobs.create': {
		riskLevel: 'write',
		description:
			'Creates a new job. This job runs asynchronously in the background and execute the task specific to the provided typeparameters. The get_job can be used to get the current state of the job.',
	},
	'jobs.get': {
		riskLevel: 'read',
		description:
			'Returns the information related to the provided job id. This endpoint can for example be polled to get the state and progress of the job in real time.',
	},
	'jobs.list': {
		riskLevel: 'read',
		description:
			'List all existing jobs. Jobs are task executed asynchronously in the background. You can use the get_job endpoint to read the current progress of the job. The available query parameters depend on the job type selected via the type parameter. Each job type may support additional type-specific….',
	},
	'lastViewed.listItems': {
		riskLevel: 'read',
		description:
			'Lists the views, application pages, dashboards, automation workflows and agents the authenticated user opened most recently, newest first. Only items the user can still access are returned.',
	},
	'mcpEndpoints.create': {
		riskLevel: 'write',
		description:
			'Creates a new MCP endpoint for a given workspace. The endpoint can be used for an MCP integration.',
	},
	'mcpEndpoints.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes an MCP endpoint if the authorized user has access to it.',
	},
	'mcpEndpoints.get': {
		riskLevel: 'read',
		description:
			'Returns the requested MCP endpoint if the authorized user has access to it.',
	},
	'mcpEndpoints.list': {
		riskLevel: 'read',
		description:
			'Lists all the MCP (Model Context Protocol) endpoints of a user. These canbe used to directly integrate with an LLM like Claude, and let the LLM perform actions directly in Baserow. Treat your MCP URL like a password,as it has the ability to modify data in Baserow.',
	},
	'mcpEndpoints.update': {
		riskLevel: 'write',
		description:
			'Updates the name or the tools of the MCP endpoint if the authorized user has access to it.',
	},
	'mcpOauthConnections.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: ' (DELETE /api/mcp/oauth/connections/{connection_id}/)',
	},
	'mcpOauthConnections.get': {
		riskLevel: 'read',
		description:
			'Lists the OAuth clients the user granted access to, one per grant endpoint, with the URL MCP clients connect to.',
	},
	'mcpOauthConnections.update': {
		riskLevel: 'write',
		description: ' (PATCH /api/mcp/oauth/connections/{connection_id}/)',
	},
	'notifications.clear': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Clear all the notifications for the given workspace and user.',
	},
	'notifications.list': {
		riskLevel: 'read',
		description:
			'Lists the notifications for the given workspace and the current user. The response is paginated and the limit and offset parameters can be controlled using the query parameters.',
	},
	'notifications.markAllAsRead': {
		riskLevel: 'write',
		description:
			'Mark as read all the notifications for the given workspace and user.',
	},
	'notifications.markAsRead': {
		riskLevel: 'write',
		description:
			'Marks a notification as read. (PATCH /api/notifications/{workspace_id}/{notification_id}/)',
	},
	'roleAssignments.assign': {
		riskLevel: 'write',
		description:
			'You can assign a role to a subject into the given workspace for the given scope with this endpoint. If you want to remove the role you can omit the role property.',
	},
	'roleAssignments.batchAssign': {
		riskLevel: 'write',
		description:
			'You can assign a role to a multiple subjects into the given workspace for the given scopes with this endpoint. If you want to remove the role you can omit the role property.',
	},
	'roleAssignments.createScopedInvitation': {
		riskLevel: 'destructive',
		description:
			'Invites an email address to one scope of the workspace. The person joins the workspace without a workspace role and gets the given role on the scope once they accept. If a pending invitation already exists for the address, the scope is added to it. The invitation email is sent out immediately.',
	},
	'roleAssignments.createScopedInvitationLink': {
		riskLevel: 'write',
		description:
			"Creates a permanent invitation link that gives the chosen role on one scope of the workspace. People who aren't a member yet join the workspace without a workspace role. Admins of the workspace and admins of the scope can create them. Links can't be created while both new signups and signups via….",
	},
	'roleAssignments.deleteScopedInvitation': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revokes the role a pending invitation grants on its scope. The invitation itself and its other scopes are kept.',
	},
	'roleAssignments.deleteScopedInvitationLink': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes a permanent invitation link to a scope, after which it can't be used anymore. People who joined through it keep their role.",
	},
	'roleAssignments.list': {
		riskLevel: 'read',
		description:
			"You can list the role assignments within a workspace, optionally filtered downto a specific scope inside of that workspace. If the scope isn't specified,the workspace will be considered the scope.",
	},
	'roleAssignments.listEffectiveAccess': {
		riskLevel: 'read',
		description:
			'Lists the role every user and identity of the workspace effectively holds on the given scope, and the scope it comes from: the given scope itself or one above it, held by the subject themselves or through their teams. Subjects without access to the scope are left out.',
	},
	'roleAssignments.listScopedInvitationLinks': {
		riskLevel: 'read',
		description:
			'Lists the permanent invitation links that give a role on the given scope to everyone who joins through them.',
	},
	'roleAssignments.listScopedInvitations': {
		riskLevel: 'read',
		description:
			'Lists the pending invitations that grant a role on the given scope once they are accepted.',
	},
	'roleAssignments.listSubject': {
		riskLevel: 'read',
		description:
			'Lists the roles a user, identity or team holds on databases, tables and restricted views of the workspace, limited to the objects whose roles the requesting user may read. A role is locked when the subject is an admin of the workspace, or of a database or table the object is in, which makes the….',
	},
	'roleAssignments.updateScopedInvitation': {
		riskLevel: 'write',
		description: 'Changes the role a pending invitation grants on its scope.',
	},
	'roleAssignments.updateScopedInvitationLink': {
		riskLevel: 'write',
		description:
			'Changes the name of a permanent invitation link to a scope, or the role people get on the scope when they join through it. People who already joined keep their role.',
	},
	'rows.batchCreate': {
		riskLevel: 'write',
		description:
			"Creates new rows in the table if the user has access to the related table's workspace. The accepted body fields are depending on the fields that the table has. For a complete overview of fields use the list_database_table_fields to list them all. None of the fields are required, if they are not…. Takes a database token or a signed-in user.",
	},
	'rows.batchDelete': {
		riskLevel: 'write',
		description:
			"Deletes existing rows in the table if the user has access to the table's workspace. WARNING: This endpoint doesn't yet work with row deleted webhooks. Takes a database token or a signed-in user.",
	},
	'rows.batchUpdate': {
		riskLevel: 'write',
		description:
			"Updates existing rows in the table if the user has access to the related table's workspace. The accepted body fields are depending on the fields that the table has. For a complete overview of fields use the list_database_table_fields endpoint to list them all. None of the fields are required, if…. Takes a database token or a signed-in user.",
	},
	'rows.create': {
		riskLevel: 'write',
		description:
			'Creates a new row in the table if the user has access to the related table\'s workspace. The accepted body fields are depending on the fields that the table has. For a complete overview of fields use the list_database_table_fields to list them all. None of the fields are required, if they are not…. Takes a database token or a signed-in user. Pass the row\'s field values next to table_id, keyed field_<id> or (with user_field_names: true) by name, e.g. { table_id, user_field_names: true, Name: "Ada" }.',
	},
	'rows.createComment': {
		riskLevel: 'write',
		description:
			'Creates a comment on the specified row. This is a premium feature.',
	},
	'rows.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes an existing row in the table if the user has access to the table's workspace. Takes a database token or a signed-in user.",
	},
	'rows.deleteComment': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a row comment. This is a premium feature.',
	},
	'rows.get': {
		riskLevel: 'read',
		description:
			"Fetches an existing row from the table if the user has access to the related table's workspace. The properties of the returned row depend on which fields the table has. For a complete overview of fields use the list_database_table_fields endpoint to list them all. In the example all field types…. Takes a database token or a signed-in user.",
	},
	'rows.getAdjacent': {
		riskLevel: 'read',
		description:
			'Fetches the adjacent row to a given row_id in the table with the given table_id. If the previous flag is set it will return the previous row, otherwise it will return the next row. You can specifya view_id and it will apply the filters and sorts of the provided view.',
	},
	'rows.getComments': {
		riskLevel: 'read',
		description:
			'Returns all row comments for the specified table and row. This is a premium feature.',
	},
	'rows.getHistory': {
		riskLevel: 'read',
		description:
			'Fetches the row change history of a given row_id in the table with the given table_id. The row change history is paginated and can be limited with the limit and offset query parameters.',
	},
	'rows.list': {
		riskLevel: 'read',
		description:
			"Lists all the rows of the table related to the provided parameter if the user has access to the related database's workspace. The response is paginated by a page/size style. It is also possible to provide an optional search query, only rows where the data matches the search query are going to be…. Takes a database token or a signed-in user. Set user_field_names to true to read and write fields by name instead of field_<id>.",
	},
	'rows.listNames': {
		riskLevel: 'read',
		description:
			'Returns the names of the given row of the given tables. The nameof a row is the primary field value for this row. The result can be usedfor example, when you want to display the name of a linked row from another table. Takes a database token or a signed-in user.',
	},
	'rows.move': {
		riskLevel: 'write',
		description:
			'Moves the row related to given row_id parameter to another position. It is only possible to move the row before another existing row or to the end. If the before_id is provided then the row related to the row_id parameter is moved before that row. If the before_id parameter is not provided, then…. Takes a database token or a signed-in user.',
	},
	'rows.update': {
		riskLevel: 'write',
		description:
			"Updates an existing row in the table if the user has access to the related table's workspace. The accepted body fields are depending on the fields that the table has. For a complete overview of fields use the list_database_table_fields endpoint to list them all. None of the fields are required,…. Takes a database token or a signed-in user. Pass the changed field values next to table_id and row_id, keyed field_<id> or (with user_field_names: true) by name.",
	},
	'rows.updateComment': {
		riskLevel: 'write',
		description: 'Update a row comment. This is a premium feature.',
	},
	'rows.updateCommentNotificationMode': {
		riskLevel: 'write',
		description:
			"Updates the user's notification preferences for comments made on a specified table row. This is a premium feature.",
	},
	'search.workspace': {
		riskLevel: 'read',
		description: 'Search across all searchable content within a workspace.',
	},
	'secureFiles.download': {
		riskLevel: 'read',
		description:
			'Downloads a file using the backend and the secure file serve feature. The signed data is extracted from the URL and used to verify if the user has access to the file. If the permissions check passes and the file exists, the file is served to the user. This is a enterprise feature. Public: no sign-in.',
	},
	'settings.get': {
		riskLevel: 'read',
		description:
			'Responds with all the admin configured settings. Public: no sign-in.',
	},
	'settings.getInstanceId': {
		riskLevel: 'read',
		description:
			'Responds with the self hosted instance id. Only a user with staff permissions can request it.',
	},
	'settings.update': {
		riskLevel: 'write',
		description:
			'Updates the admin configured settings if the user has admin permissions.',
	},
	'snapshots.create': {
		riskLevel: 'write',
		description:
			'Creates a new application snapshot. Snapshots represent a state of an application at a specific point in time and can be restored later, making it easy to create backups of entire applications.',
	},
	'snapshots.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes a snapshot. Deleting a snapshot doesn't affect the application that the snapshot is made from and doesn't affect any applications that were created by restoring it. Snapshot deletion is permanent and can't be undone.",
	},
	'snapshots.list': {
		riskLevel: 'read',
		description: 'Lists snapshots that were created for a given application.',
	},
	'snapshots.restore': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Restores a snapshot. When an application snapshot is restored, a new application will be created in the same workspace that the original application was placed in with the name of the snapshot and data that were in the original application at the time the snapshot was taken. The original….',
	},
	'tables.create': {
		riskLevel: 'write',
		description:
			"Creates synchronously a new table for the database related to the provided database_id parameter if the authorized user has access to the database's workspace. As an alternative you can use the create_async_database_table for better performances and importing bigger files.",
	},
	'tables.createAsync': {
		riskLevel: 'write',
		description:
			"Creates a job that creates a new table for the database related to the provided database_id parameter if the authorized user has access to the database's workspace. This endpoint is asynchronous and return the created job to track the progress of the task.",
	},
	'tables.dataSync.create': {
		riskLevel: 'write',
		description:
			"Creates a new data sync table with the given data sync type. This will technically create a table, but it's synchronized with the provided data sync information. This means that some fields related to it will automatically be created and will be read-only.",
	},
	'tables.dataSync.get': {
		riskLevel: 'read',
		description:
			'Responds with the data sync, including the data sync type specific properties, if the user has the right permissions.',
	},
	'tables.dataSync.getPeriodicInterval': {
		riskLevel: 'read',
		description:
			'Responds with the periodic data sync interval data, if the user has the right permissions. This is an enterprise feature.',
	},
	'tables.dataSync.getProperties': {
		riskLevel: 'read',
		description:
			'Lists all the available properties of the provided data sync.',
	},
	'tables.dataSync.getTypeProperties': {
		riskLevel: 'write',
		description:
			"Lists all the properties of the provided data sync type given the request data. This can be used to choose which properties should be included when creating the data sync. The user must have create table permissions in the database's workspace.",
	},
	'tables.dataSync.syncAsync': {
		riskLevel: 'write',
		description:
			"Start a job to sync the data sync table with the provided data_sync_id parameter if the authorized user has access to the database's workspace.",
	},
	'tables.dataSync.update': {
		riskLevel: 'write',
		description:
			'Updates the properties of the provided data sync, if the user has the right permissions. Note that if the synced_properties is not provided, the available properties change, then the unavailable ones will automatically be removed.',
	},
	'tables.dataSync.updatePeriodicInterval': {
		riskLevel: 'write',
		description:
			'Updates the periodic data sync interval, if the user has the right permissions. This is an enterprise feature.',
	},
	'tables.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes the existing table if the authorized user has access to the related database's workspace.",
	},
	'tables.duplicateAsync': {
		riskLevel: 'write',
		description:
			"Start a job to duplicate the table with the provided table_id parameter if the authorized user has access to the database's workspace.",
	},
	'tables.export.getJob': {
		riskLevel: 'read',
		description:
			'Returns information such as export progress and state or the url of the exported file for the specified export job, only if the requesting user has access.',
	},
	'tables.export.start': {
		riskLevel: 'write',
		description:
			'Creates and starts a new export job for a table given some exporter options. Returns an error if the requesting user does not have permissionsto view the table.',
	},
	'tables.get': {
		riskLevel: 'read',
		description:
			"Returns the requested table if the authorized user has access to the related database's workspace.",
	},
	'tables.importDataAsync': {
		riskLevel: 'write',
		description:
			"Import data in the specified table if the authorized user has access to the related database's workspace. This endpoint is asynchronous and return the created job to track the progress of the task.",
	},
	'tables.list': {
		riskLevel: 'read',
		description:
			"Lists all the tables that are in the database related to the database_id parameter if the user has access to the database's workspace. A table is exactly as the name suggests. It can hold multiple fields, each having their own type and multiple rows. They can be added via the….",
	},
	'tables.listForToken': {
		riskLevel: 'read',
		description:
			'This endpoint only works in combination with the token authentication. It lists all the tables that the token has either create, read, update or delete access to. Takes a database token.',
	},
	'tables.order': {
		riskLevel: 'write',
		description:
			'Changes the order of the provided table ids to the matching position that the id has in the list. If the authorized user does not belong to the workspace it will be ignored. The order of the not provided tables will be set to 0.',
	},
	'tables.update': {
		riskLevel: 'write',
		description:
			"Updates the existing table if the authorized user has access to the related database's workspace.",
	},
	'teams.create': {
		riskLevel: 'write',
		description:
			'Creates a new team. (POST /api/teams/workspace/{workspace_id}/)',
	},
	'teams.createInvitation': {
		riskLevel: 'destructive',
		description:
			'Invites an email address to the team. The person joins the workspace without a workspace role, so that the role of the team applies, and is added to the team once they accept. If a pending invitation already exists for the address, the team is added to it. The invitation email is sent out….',
	},
	'teams.createInvitationLink': {
		riskLevel: 'write',
		description:
			"Creates a permanent link that anyone can use to join the team. People who aren't a member of the workspace yet join it without a workspace role, so that the role of the team applies, and members of the workspace are added to the team. The link has no role of its own.",
	},
	'teams.createSubject': {
		riskLevel: 'write',
		description:
			'Creates a new team subject. (POST /api/teams/{team_id}/subjects/)',
	},
	'teams.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes a team if the authorized user is in the team's workspace. All the related children (e.g. subjects) are also going to be deleted.",
	},
	'teams.deleteInvitation': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revokes the invitation of a person to the team. The workspace invitation itself is kept.',
	},
	'teams.deleteInvitationLink': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes an invitation link to the team, after which it can't be used anymore. People who joined through it stay in the team.",
	},
	'teams.deleteSubject': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes a subject if the authorized user is in the team's workspace.",
	},
	'teams.get': {
		riskLevel: 'read',
		description: 'Returns the information related to the provided team id.',
	},
	'teams.getSubject': {
		riskLevel: 'read',
		description: 'Returns the information related to the provided subject id.',
	},
	'teams.list': {
		riskLevel: 'read',
		description:
			'Lists all teams in a given workspace. (GET /api/teams/workspace/{workspace_id}/)',
	},
	'teams.listInvitationLinks': {
		riskLevel: 'read',
		description:
			'Lists the permanent invitation links that anyone can use to join the team.',
	},
	'teams.listInvitations': {
		riskLevel: 'read',
		description:
			'Lists the pending invitations that add a person to the team once they are accepted.',
	},
	'teams.listSubjects': {
		riskLevel: 'read',
		description: 'Lists all team subjects in a given team.',
	},
	'teams.update': {
		riskLevel: 'write',
		description: 'Updates an existing team with a new name.',
	},
	'teams.updateInvitationLink': {
		riskLevel: 'write',
		description:
			'Changes the name of an invitation link to the team or its password.',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes a user template. Its owner can delete it in any state, and an instance admin can delete any user template. It's gone for everybody right away, and its revisions and content are removed later. The applications installed from it are kept. This can't be undone.",
	},
	'templates.download': {
		riskLevel: 'write',
		description:
			'Responds with the URL of the archive of a user template, which imports like a workspace export. The archive is built on the first download: while there is none, a job that builds it is started instead, or the one of the user that builds it already is responded with. Once the job is finished, the….',
	},
	'templates.install': {
		riskLevel: 'write',
		description:
			'(Deprecated) Installs the applications of the given template into the given workspace if the user has access to that workspace. The response contains those newly created applications.',
	},
	'templates.installAsync': {
		riskLevel: 'write',
		description:
			"Start an async job to install the applications of the given template into the given workspace if the user has access to that workspace. The response contains those newly created applications. A user template can be installed by its owner, by the instance admins, by anyone signed in while it's….",
	},
	'templates.list': {
		riskLevel: 'read',
		description:
			"Lists the templates. The template's workspace_id can be used for previewing purposes because that workspace contains the applications that are in the template. All the get and list endpoints related to that workspace are accessible to whoever can list the template. The view query parameter….",
	},
	'templates.rotatePrivateLinkToken': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Replaces the token of the private link of a user template owned by the user, which takes the access away from everybody who has the old link. The new token is in private_link_token. A template without a private link keeps having none. The private link of a blocked template can't be changed.",
	},
	'templates.update': {
		riskLevel: 'write',
		description:
			"Updates a user template owned by the user. With visibility public, its latest revision goes to review, and once an instance admin approves it, it's listed, with the name of its author, for everybody on this instance, who can open it. Signed-in users can install it. It's listed right away only….",
	},
	'trash.emptyContents': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Empties the specified workspace and/or application of trash, including the workspace and application themselves if they are trashed also. Deletes the trashed items for good.',
	},
	'trash.getContents': {
		riskLevel: 'read',
		description:
			'Responds with trash contents for a workspace optionally filtered to a specific application.',
	},
	'trash.getStructure': {
		riskLevel: 'read',
		description:
			'Responds with the workspaces and applications available for the requesting user to inspect the trash contents of.',
	},
	'trash.restore': {
		riskLevel: 'write',
		description: 'Restores the specified trashed item back into baserow.',
	},
	'user.changeEmail': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Changes the email address of a user if the confirmation token is valid. The send_change_email_confirmation endpoint sends an email to the new address containing the token. That token can be used to change the email address here. Public: no sign-in.',
	},
	'user.changePassword': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Changes the password of an authenticated user, but only if the old password matches.',
	},
	'user.getDashboard': {
		riskLevel: 'read',
		description:
			'Lists all the relevant user information that for example could be shown on a dashboard. It will contain all the pending workspace invitations for that user.',
	},
	'user.redo': {
		riskLevel: 'write',
		description:
			'Redoes the latest redoable action performed by the user making the request. a ClientSessionId header must be provided and only actions which were performed the same user with the same ClientSessionId value set on the api request that performed the action will be redone.Additionally the….',
	},
	'user.resetPassword': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Changes the password of a user if the reset token is valid. The send_password_reset_email endpoint sends an email to the user containing the token. That token can be used to change the password here without providing the old password. Public: no sign-in.',
	},
	'user.scheduleAccountDeletion': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Schedules the account deletion of the authenticated user. The user will be permanently deleted after the grace delay defined by the instance administrator. Deletes the signed-in Baserow account after the grace period.',
	},
	'user.sendChangeEmailConfirmation': {
		riskLevel: 'destructive',
		description:
			'Sends an email to the new email address containing a confirmation link. The user must provide their current password to initiate this request. The link is going to be valid for 12 hours.',
	},
	'user.sendPasswordResetEmail': {
		riskLevel: 'destructive',
		description:
			'Sends an email containing the password reset link to the email address of the user. This will only be done if a user is found with the given email address. The endpoint will not fail if the email address is not found. The link is going to the valid for 2 hours. Public: no sign-in.',
	},
	'user.sendVerifyEmail': {
		riskLevel: 'destructive',
		description:
			"Sends an email to the user with an email verification link if the user's email is not verified yet.",
	},
	'user.signUp': {
		riskLevel: 'write',
		description:
			'Creates a new user based on the provided values. If desired an authentication JWT can be generated right away. After creating an account the initial workspace containing a database is created. Public: no sign-in.',
	},
	'user.tokenAuth': {
		riskLevel: 'write',
		description:
			'Authenticates an existing user based on their email and their password. If successful, an access token and a refresh token will be returned. If the account is protected with two-factor authentication, temporary token is returned to finish the verification. Public: no sign-in.',
	},
	'user.tokenBlacklist': {
		riskLevel: 'write',
		description:
			'Blacklists the provided token. This can be used the sign the user off. Public: no sign-in.',
	},
	'user.tokenRefresh': {
		riskLevel: 'write',
		description:
			'Generate a new access_token that can be used to continue operating on Baserow starting from a valid refresh token. Unless refresh token rotation is disabled, the response also contains a new refresh_token that must be used for the next refresh. The provided refresh token stops working after 30…. Public: no sign-in.',
	},
	'user.tokenVerify': {
		riskLevel: 'read',
		description:
			'Verifies if the refresh token is valid and can be used to generate a new access_token. Public: no sign-in.',
	},
	'user.undo': {
		riskLevel: 'write',
		description:
			'undoes the latest undoable action performed by the user making the request. a ClientSessionId header must be provided and only actions which were performed the same user with the same ClientSessionId value set on the api request that performed the action will be undone.Additionally the….',
	},
	'user.updateAccount': {
		riskLevel: 'write',
		description: 'Updates the account information of the authenticated user.',
	},
	'user.updatePreferences': {
		riskLevel: 'write',
		description:
			'Changes one or more preferences of the authenticated user, such as the default sort order of a listing page. Preferences that are not provided keep their value. Responds with all preferences.',
	},
	'user.verifyEmail': {
		riskLevel: 'write',
		description:
			"Passing the correct verification token will confirm that the user's email address belongs to the user. This endpoint also optionally returns user information, access token and the refresh token for automatically signing user in the system if the request is performed by unauthenticated user.",
	},
	'userFiles.upload': {
		riskLevel: 'write',
		description:
			'Uploads a file to Baserow by uploading the file contents directly. A file multipart is expected containing the file contents. Takes a database token or a signed-in user.',
	},
	'userFiles.uploadViaUrl': {
		riskLevel: 'write',
		description:
			'Uploads a file to Baserow by downloading it from the provided URL. Takes a database token or a signed-in user.',
	},
	'userSources.create': {
		riskLevel: 'write',
		description:
			'Creates a new user_source. (POST /api/application/{application_id}/user-sources/)',
	},
	'userSources.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes the user_source related by the given id.',
	},
	'userSources.forceTokenAuth': {
		riskLevel: 'write',
		description:
			'Force authenticates an existing user based on their ID. If successful, an access token and a refresh token will be returned.',
	},
	'userSources.list': {
		riskLevel: 'read',
		description:
			"Lists all the user_sources of the application related to the provided parameter if the user has access to the related application's workspace. If the workspace is related to a template, then this endpoint will be publicly accessible.",
	},
	'userSources.listUsers': {
		riskLevel: 'read',
		description: 'List per user sources the first 5 users available.',
	},
	'userSources.move': {
		riskLevel: 'write',
		description:
			'Moves the user_source in the application before another user_source or at the end of the application if no before user_source is given. The user_sources must belong to the same application.',
	},
	'userSources.roles.list': {
		riskLevel: 'read',
		description:
			"Lists all the roles of the application related to the provided parameter if the user has access to the related application's workspace. If the workspace is related to a template, then this endpoint will be publicly accessible.",
	},
	'userSources.tokenAuth': {
		riskLevel: 'write',
		description:
			'Authenticates an existing user against a user source based on their credentials. If successful, an access token and a refresh token will be returned.',
	},
	'userSources.tokenBlacklist': {
		riskLevel: 'write',
		description:
			'Blacklists the provided user source token. This can be used the sign the user off. Public: no sign-in.',
	},
	'userSources.tokenRefresh': {
		riskLevel: 'write',
		description:
			'Generate a new access_token that can be used to continue operating on Baserow with a user source user starting from a valid refresh token.',
	},
	'userSources.update': {
		riskLevel: 'write',
		description:
			'Updates an existing user_source. (PATCH /api/user-source/{user_source_id}/)',
	},
	'views.calendar.getIcalFeed': {
		riskLevel: 'read',
		description:
			'Returns ICal feed for a specific Calendar view identified by ical_slug value. Calendar View resource contains full url in .ical_feed_url field.',
	},
	'views.calendar.listRows': {
		riskLevel: 'read',
		description:
			"Responds with serialized rows grouped by date regarding view's date fieldif the user is authenticated and has access to the related workspace. This is a premium feature.",
	},
	'views.calendar.publicListRows': {
		riskLevel: 'read',
		description:
			"Responds with serialized rows grouped by the view's date field options related to the slug if the calendar view is publicly shared. Additional query parameters can be provided to control the limit and offset per select option. This is a premium feature.",
	},
	'views.calendar.rotateIcalFeedSlug': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Rotates the unique slug of the calendar view's ical feed by replacing it with a new value. This would mean that the publicly shared URL of the view will change. Anyone with the old URL won't be able to access the view anymore.",
	},
	'views.copyConfiguration': {
		riskLevel: 'write',
		description:
			"Copies the requested configuration categories, the filters or sorts for example, of another view in the same table into this view, replacing this view's existing configuration of those categories. Only categories supported by both view types can be copied. The whole copy can be reverted with a….",
	},
	'views.create': {
		riskLevel: 'write',
		description:
			'Creates a new view for the table related to the provided table_id parameter. Depending on the type, different properties can optionally be set.',
	},
	'views.decorations.create': {
		riskLevel: 'write',
		description:
			"Creates a new decoration for the view related to the provided view_id parameter if the authorized user has access to the related database's workspace.",
	},
	'views.decorations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes the existing decoration if the authorized user has access to the related database's workspace.",
	},
	'views.decorations.get': {
		riskLevel: 'read',
		description:
			"Returns the existing view decoration if the current user has access to the related database's workspace.",
	},
	'views.decorations.list': {
		riskLevel: 'read',
		description:
			"Lists all decorations of the view related to the provided view_id if the user has access to the related database's workspace. A view can have multiple decorations. View decorators can be used to decorate rows. This can, for example, be used to change the border or background color of a row if it….",
	},
	'views.decorations.update': {
		riskLevel: 'write',
		description:
			"Updates the existing decoration if the authorized user has access to the related database's workspace.",
	},
	'views.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes the existing view. Note that all the related settings of the view are going to be deleted also. The data stays intact after deleting the view because this is related to the table and not the view.',
	},
	'views.duplicate': {
		riskLevel: 'write',
		description:
			'Duplicates an existing view if the user has access to it. When a view is duplicated everything is copied except: - The name is appended with the copy number. Ex: ViewName->ViewName(2) and View(2)->View(3) - If the original view is publicly shared, the new view will not be shared anymore.',
	},
	'views.export.getPublicJob': {
		riskLevel: 'read',
		description:
			'Returns information such as export progress and state or the url of the exported file for the specified export job, only if the requesting user has access. This is a premium feature.',
	},
	'views.export.startPublic': {
		riskLevel: 'write',
		description:
			"Creates and starts a new export job for a publicly shared view given some exporter options. Returns an error if the view doesn't support exporting. This is a premium feature.",
	},
	'views.filters.create': {
		riskLevel: 'write',
		description:
			'Creates a new filter for the view related to the provided view_id parameter. When the rows of a view are requested, for example via the list_database_table_grid_view_rows endpoint, then only the rows that apply to all the filters are going to be returned. A filter compares the value of a field….',
	},
	'views.filters.createGroup': {
		riskLevel: 'write',
		description:
			'Creates a new filter group for the view related to the provided view_id parameter.',
	},
	'views.filters.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes the existing filter if the authorized user has access to the related database's workspace.",
	},
	'views.filters.deleteGroup': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes the existing filter group with the given view_filter_group_id.',
	},
	'views.filters.get': {
		riskLevel: 'read',
		description:
			'Returns the existing view filter. (GET /api/database/views/filter/{view_filter_id}/)',
	},
	'views.filters.getGroup': {
		riskLevel: 'read',
		description:
			'Returns the existing view filter group with the given view_filter_group_id.',
	},
	'views.filters.list': {
		riskLevel: 'read',
		description:
			'Lists all filters of the view related to the provided view_id. A view can have multiple filters. When all the rows are requested for the view only those that apply to the filters are returned.',
	},
	'views.filters.update': {
		riskLevel: 'write',
		description:
			'Updates the existing filter. (PATCH /api/database/views/filter/{view_filter_id}/)',
	},
	'views.filters.updateGroup': {
		riskLevel: 'write',
		description:
			'Updates the existing filter group with the given view_filter_group_id.',
	},
	'views.form.getEditRow': {
		riskLevel: 'read',
		description:
			'Returns the current field values of the row identified by the edit token. Only fields visible in the form view are returned. The token must be a valid signed token generated by a form_view_edit_row field.',
	},
	'views.form.getMeta': {
		riskLevel: 'read',
		description:
			'Returns the metadata related to the form view if the form is publicly shared or if the user has access to the related workspace. This data can be used to construct a form with the right fields.',
	},
	'views.form.submit': {
		riskLevel: 'write',
		description:
			'Submits the form if the form is publicly shared or if the user has access to the related workspace. The provided data will be validated based on the fields that are in the form and the rules per field. If valid, a new row will be created in the table.',
	},
	'views.form.updateEditRow': {
		riskLevel: 'write',
		description:
			'Updates the row identified by the edit token using the submitted field values. Only fields that are visible in the form view can be changed. The row_token must be a valid signed token generated by a form_view_edit_row field.',
	},
	'views.form.uploadFile': {
		riskLevel: 'write',
		description:
			'Uploads a file anonymously to Baserow by uploading the file contents directly. A file multipart is expected containing the file contents.',
	},
	'views.gallery.listRows': {
		riskLevel: 'read',
		description:
			"Lists the requested rows of the view's table related to the provided view_id if the authorized user has access to the database's workspace. The response is paginated by a limit/offset style.",
	},
	'views.gallery.publicListRows': {
		riskLevel: 'read',
		description:
			"Lists the requested rows of the view's table related to the provided slug if the gallery view is public.The response is paginated either by a limit/offset or page/size style. The style depends on the provided GET parameters. The properties of the returned rows depends on which fields the table….",
	},
	'views.get': {
		riskLevel: 'read',
		description:
			'Returns the existing view. Depending on the type different properties could be returned.',
	},
	'views.getFieldOptions': {
		riskLevel: 'read',
		description:
			'Responds with the fields options of the provided view if the authenticated user has access to the related workspace.',
	},
	'views.getPublicInfo': {
		riskLevel: 'read',
		description:
			'Returns the required public information to display a single shared view.',
	},
	'views.getPublicRow': {
		riskLevel: 'read',
		description:
			'Returns the data for a specific row in a publicly shared view, identified by the view’s slug and the row’s ID.',
	},
	'views.grid.filterRows': {
		riskLevel: 'read',
		description:
			'Lists only the rows and fields that match the request. Only the rows with the ids that are in the row_ids list are going to be returned. Same goes for the fields, only the fields with the ids in the field_ids are going to be returned. This endpoint could be used to refresh data after changes….',
	},
	'views.grid.getFieldAggregation': {
		riskLevel: 'read',
		description:
			'Computes the aggregation of all the values for a specified field from the selected grid view. You must select the aggregation type by setting the type GET parameter. If filters are configured for the selected view, the aggregation is calculated only on filtered rows. You need to have read….',
	},
	'views.grid.getFieldAggregations': {
		riskLevel: 'read',
		description:
			'Returns all field aggregations values previously defined for this grid view. If filters exist for this view, the aggregations are computed only on filtered rows.You need to have read permissions on the view to request aggregations.',
	},
	'views.grid.getGroupData': {
		riskLevel: 'read',
		description: ' (GET /api/database/views/grid/{view_id}/group-by-data/)',
	},
	'views.grid.getPublicFieldAggregations': {
		riskLevel: 'read',
		description:
			'Returns all field aggregations values previously defined for this grid view. If filters exist for this view, the aggregations are computed only on filtered rows.',
	},
	'views.grid.getPublicGroupData': {
		riskLevel: 'read',
		description: ' (GET /api/database/views/grid/{slug}/public/group-by-data/)',
	},
	'views.grid.listRows': {
		riskLevel: 'read',
		description:
			"Lists the requested rows of the view's table related to the provided view_id if the authorized user has access to the database's workspace. The response is paginated either by a limit/offset or page/size style. The style depends on the provided GET parameters. The properties of the returned rows….",
	},
	'views.grid.publicListRows': {
		riskLevel: 'read',
		description:
			"Lists the requested rows of the view's table related to the provided slug if the grid view is public.The response is paginated either by a limit/offset or page/size style. The style depends on the provided GET parameters. The properties of the returned rows depends on which fields the table has.….",
	},
	'views.groupBys.create': {
		riskLevel: 'write',
		description:
			"Creates a new group by for the view related to the provided view_id parameter if the authorized user has access to the related database's workspace.",
	},
	'views.groupBys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes the existing group by if the authorized user has access to the related database's workspace.",
	},
	'views.groupBys.get': {
		riskLevel: 'read',
		description:
			"Returns the existing view group by if the authorized user has access to the related database's workspace.",
	},
	'views.groupBys.list': {
		riskLevel: 'read',
		description:
			"Lists all groupings of the view related to the provided view_id if the user has access to the related database's workspace. A view can have multiple groupings.",
	},
	'views.groupBys.prioritize': {
		riskLevel: 'write',
		description:
			'Updates the priority of the provided view group by ids to the matching position that the id has in the list. The group by with the lowest position in the list is applied first when ordering rows.',
	},
	'views.groupBys.update': {
		riskLevel: 'write',
		description:
			"Updates the existing group by if the authorized user has access to the related database's workspace.",
	},
	'views.kanban.listRows': {
		riskLevel: 'read',
		description:
			"Responds with serialized rows grouped by the view's single select field options if the user is authenticated and has access to the related workspace. Additional query parameters can be provided to control the limit and offset per select option. This is a premium feature.",
	},
	'views.kanban.publicListRows': {
		riskLevel: 'read',
		description:
			"Responds with serialized rows grouped by the view's single select field options related to the slug if the kanban view is publicly shared. Additional query parameters can be provided to control the limit and offset per select option. This is a premium feature.",
	},
	'views.list': {
		riskLevel: 'read',
		description:
			'Lists all views of the table related to the provided table_id. If the workspace is related to a template, then this endpoint will be publicly accessible. A table can have multiple views. Each view can display the data in a different way. For example the grid view shows the in a spreadsheet like….',
	},
	'views.order': {
		riskLevel: 'write',
		description:
			'Changes the order of the provided view ids to the matching position that the id has in the list. The order of the not provided views will be set to 0.',
	},
	'views.publicLinkRowFieldLookup': {
		riskLevel: 'read',
		description:
			'If the view is publicly shared or if an authenticated user has access to the related workspace, then this endpoint can be used to do a value lookup of the link row fields that are included in the view. Normally it is not possible for a not authenticated visitor to fetch the rows of a table. This….',
	},
	'views.publicTokenAuth': {
		riskLevel: 'write',
		description:
			"Returns a valid never-expiring JWT token for this public shared view if the password provided matches with the one saved by the view's owner.",
	},
	'views.rotateSlug': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Rotates the unique slug of the view by replacing it with a new value. This would mean that the publicly shared URL of the view will change. Anyone with the old URL won't be able to access the viewanymore. Only view types which are sharable can have their slugs rotated.",
	},
	'views.sortings.create': {
		riskLevel: 'write',
		description:
			"Creates a new sort for the view related to the provided view_id parameter if the authorized user has access to the related database's workspace. When the rows of a view are requested, for example via the list_database_table_grid_view_rows endpoint, they will be returned in the respected order….",
	},
	'views.sortings.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes the existing sort if the authorized user has access to the related database's workspace.",
	},
	'views.sortings.get': {
		riskLevel: 'read',
		description:
			"Returns the existing view sort if the authorized user has access to the related database's workspace.",
	},
	'views.sortings.list': {
		riskLevel: 'read',
		description:
			"Lists all sortings of the view related to the provided view_id if the user has access to the related database's workspace. A view can have multiple sortings. When all the rows are requested they will be in the desired order.",
	},
	'views.sortings.prioritize': {
		riskLevel: 'write',
		description:
			'Updates the priority of the sorts to match the order of the given IDs. Sorts earlier in the list are applied first.',
	},
	'views.sortings.update': {
		riskLevel: 'write',
		description:
			"Updates the existing sort if the authorized user has access to the related database's workspace.",
	},
	'views.timeline.listRows': {
		riskLevel: 'read',
		description:
			"Lists the requested rows of the view's table related to the provided view_id if the authorized user has access to the database's workspace. The response is paginated either by a limit/offset or page/size style. The style depends on the provided GET parameters. The properties of the returned rows….",
	},
	'views.timeline.publicListRows': {
		riskLevel: 'read',
		description:
			"Lists the requested rows of the view's table related to the provided slug if the timeline view is public.The response is paginated either by a limit/offset or page/size style. The style depends on the provided GET parameters. The properties of the returned rows depends on which fields the table….",
	},
	'views.update': {
		riskLevel: 'write',
		description:
			'Updates the existing view. The type cannot be changed. It depends on the existing type which properties can be changed.',
	},
	'views.updateDefaultValues': {
		riskLevel: 'write',
		description:
			"Updates the default row values for the specified view. Accepts a list of default value objects, each specifying the field, whether the default is enabled, an optional raw value, and an optional function name (e.g. 'now') for dynamic defaults.",
	},
	'views.updateFieldOptions': {
		riskLevel: 'write',
		description:
			'Updates the field options of a view. The field options differ per field type This could for example be used to update the field width of a grid view if the user changes it.',
	},
	'views.updatePremiumAttributes': {
		riskLevel: 'write',
		description: 'Sets view attributes only available for premium users.',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Creates a new webhook for the table related to the provided table_id parameter if the authorized user has access to the related database workspace.',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes the existing webhook if the authorized user has access to the related database's workspace.",
	},
	'webhooks.get': {
		riskLevel: 'read',
		description:
			'Returns the existing webhook if the authorized user has access to the related database workspace.',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'Lists all webhooks of the table related to the provided table_id if the user has access to the related database workspace.',
	},
	'webhooks.testCall': {
		riskLevel: 'write',
		description:
			'This endpoint triggers a test call based on the provided data if the user has access to the workspace related to the table. The test call will be made immediately and a copy of the request, response and status will be included in the response.',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description:
			'Updates the existing view if the authorized user has access to the related database workspace.',
	},
	'workspaces.create': {
		riskLevel: 'write',
		description:
			'Creates a new workspace where only the authorized user has access to. No initial data like database applications are added, they have to be created via other endpoints.',
	},
	'workspaces.createInitial': {
		riskLevel: 'write',
		description:
			'Creates an initial workspace. This is typically called after the user signs up and skips the onboarding in the frontend. It contains some example data.',
	},
	'workspaces.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes an existing workspace if the authorized user belongs to the workspace. All the applications, databases, tables etc that were in the workspace are going to be deleted also.',
	},
	'workspaces.deleteUser': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a workspace user if the authorized user has admin rights to the related workspace.',
	},
	'workspaces.exportApplicationsAsync': {
		riskLevel: 'write',
		description:
			"Export workspace or set of applications application if the authorized user is in the application's workspace. All the related children are also going to be exported. For example in case of a database application all the underlying tables, fields, views and rows are going to be exported.Roles are….",
	},
	'workspaces.getPermissions': {
		riskLevel: 'read',
		description:
			'Returns a the permission data necessary to determine the permissions of a specific user over a specific workspace. See core.handler.CoreHandler.get_permissions() for more details.',
	},
	'workspaces.importApplicationsAsync': {
		riskLevel: 'write',
		description:
			'Import a set of applications included in a given resource if the authorized user is in the specified workspace. This endpoint requires a valid resource_id of the uploaded file.',
	},
	'workspaces.importExportResource': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a resource. This endpoint mark as ready for deletion the specified resource. This operation is not undoable. The user must be the owner of the resource to perform this action.',
	},
	'workspaces.importResourceUploadFile': {
		riskLevel: 'write',
		description:
			"Uploads an exported workspace or a set of applications if the authorized user is in the workspace. The uploaded file must be a valid ZIP file containing the applications' data for future import.",
	},
	'workspaces.invitationLinks.create': {
		riskLevel: 'write',
		description:
			"Creates a new permanent invitation link if the authorized user has admin rights to the related workspace. Anyone with the link can join the workspace with the permissions of the link until the link is deleted. Links can't be created while both new signups and signups via workspace invitations….",
	},
	'workspaces.invitationLinks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes an invitation link if the authorized user has admin rights to the related workspace. The link can't be used anymore afterwards.",
	},
	'workspaces.invitationLinks.getPublic': {
		riskLevel: 'read',
		description:
			'Responds with the workspace and the inviter of the invitation link with the provided slug, so that someone who opens the link knows what they join. For a member whose role the link would raise, it also responds with their current role and the role of the link. A password protected link requires….',
	},
	'workspaces.invitationLinks.join': {
		riskLevel: 'write',
		description:
			'Adds the authorized user to the workspace of the invitation link with the permissions of the link. Someone who is already a member gets the permissions of the link when they are higher than their own, and otherwise keeps their current permissions. A link that adds members to an object, like a….',
	},
	'workspaces.invitationLinks.list': {
		riskLevel: 'read',
		description:
			'Lists all the invitation links of the workspace related to the provided workspace_id parameter if the authorized user has admin rights to that workspace.',
	},
	'workspaces.invitationLinks.tokenAuth': {
		riskLevel: 'write',
		description:
			'Returns a never-expiring token for the password protected invitation link if the password matches the one set by the admins. The token must be sent in the Baserow-Invitation-Link-Authorization header, as JWT <token>, to see or join the link, and as workspace_invitation_link_token to sign up….',
	},
	'workspaces.invitationLinks.update': {
		riskLevel: 'write',
		description:
			'Updates the name of the invitation link, the permissions people get when joining through it or its password if the authorized user has admin rights to the related workspace. People who already joined keep their permissions. Changing the password invalidates the access tokens handed out for the….',
	},
	'workspaces.invitations.accept': {
		riskLevel: 'write',
		description:
			'Accepts a workspace invitation with the given id if the email address of the user matches that of the invitation. The token from the invitation email must be provided unless the email address of the user is verified.',
	},
	'workspaces.invitations.create': {
		riskLevel: 'destructive',
		description:
			'Creates a new workspace invitations for an email address if the authorized user has admin rights to the related workspace. An email containing a sign up link will be send to the user.',
	},
	'workspaces.invitations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a workspace invitation if the authorized user has admin rights to the related workspace.',
	},
	'workspaces.invitations.get': {
		riskLevel: 'read',
		description:
			'Returns the requested workspace invitation if the authorized user has admin right to the related workspace.',
	},
	'workspaces.invitations.getToken': {
		riskLevel: 'read',
		description:
			'Responds with the serialized workspace invitation if an invitation with the provided token is found.',
	},
	'workspaces.invitations.list': {
		riskLevel: 'read',
		description:
			'Lists all the workspace invitations of the workspace related to the provided workspace_id parameter if the authorized user has admin rights to that workspace.',
	},
	'workspaces.invitations.reject': {
		riskLevel: 'write',
		description:
			'Rejects a workspace invitation with the given id if the email address of the user matches that of the invitation.',
	},
	'workspaces.invitations.update': {
		riskLevel: 'write',
		description:
			'Updates the existing workspace invitation related to the provided workspace_invitation_id param if the authorized user has admin rights to the related workspace.',
	},
	'workspaces.leave': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Makes the authenticated user leave the workspace related to the provided workspace_id if the user is in that workspace. If the user is the last admin in the workspace, they will not be able to leave it. There must always be one admin in the workspace, otherwise it will be left without control.….',
	},
	'workspaces.list': {
		riskLevel: 'read',
		description:
			'Lists all the workspaces of the authorized user. A workspace can contain multiple applications like a database. Multiple users can have access to a workspace. For example each company could have their own workspace containing databases related to that company. The order of the workspaces are….',
	},
	'workspaces.listExports': {
		riskLevel: 'read',
		description: 'Lists exports that were created for given workspace.',
	},
	'workspaces.listUsers': {
		riskLevel: 'read',
		description:
			'Lists all the users that are in a workspace if the authorized user has admin permissions to the related workspace. To add a user to a workspace an invitation must be sent first.',
	},
	'workspaces.order': {
		riskLevel: 'write',
		description:
			'Changes the order of the provided workspace ids to the matching position that the id has in the list. If the authorized user does not belong to the workspace it will be ignored. The order will be custom for each user.',
	},
	'workspaces.update': {
		riskLevel: 'write',
		description:
			'Updates the existing workspace related to the provided workspace_id parameter if the authorized user belongs to the workspace. It is not yet possible to add additional users to a workspace.',
	},
	'workspaces.updateUser': {
		riskLevel: 'write',
		description:
			'Updates the existing workspace user related to the provided workspace_user_id param if the authorized user has admin rights to the related workspace.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof baserowEndpointsNested>;
