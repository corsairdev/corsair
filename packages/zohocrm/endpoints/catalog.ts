// Generated with endpoints/operation-types.ts from ZohoCrm's OpenAPI spec:
// one entry per operation in zohocrm-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { zohocrmSchemaEntry } from './openapi-schema';
import { createZohoCrmOperation as op } from './operations';

export const zohocrmEndpointsNested = {
	abTesting: {
		checkLaunchSuggestions: op('abTesting.checkLaunchSuggestions'),
		create: op('abTesting.create'),
		delete: op('abTesting.delete'),
		get: op('abTesting.get'),
		getPreview: op('abTesting.getPreview'),
		getSuggestions: op('abTesting.getSuggestions'),
		getVisitors: op('abTesting.getVisitors'),
		list: op('abTesting.list'),
		listVisitors: op('abTesting.listVisitors'),
		update: op('abTesting.update'),
	},
	apis: {
		list: op('apis.list'),
	},
	appointmentPreferences: {
		get: op('appointmentPreferences.get'),
		update: op('appointmentPreferences.update'),
	},
	appointments: {
		create: op('appointments.create'),
		delete: op('appointments.delete'),
		deleteMany: op('appointments.deleteMany'),
		get: op('appointments.get'),
		list: op('appointments.list'),
		update: op('appointments.update'),
		updateMany: op('appointments.updateMany'),
	},
	approvalProcesses: {
		clone: op('approvalProcesses.clone'),
		create: op('approvalProcesses.create'),
		delete: op('approvalProcesses.delete'),
		get: op('approvalProcesses.get'),
		getCount: op('approvalProcesses.getCount'),
		getProcessConfigurations: op('approvalProcesses.getProcessConfigurations'),
		getRule: op('approvalProcesses.getRule'),
		list: op('approvalProcesses.list'),
		listRules: op('approvalProcesses.listRules'),
		reorder: op('approvalProcesses.reorder'),
		reorderRules: op('approvalProcesses.reorderRules'),
		update: op('approvalProcesses.update'),
		updateMany: op('approvalProcesses.updateMany'),
	},
	assignmentRules: {
		clone: op('assignmentRules.clone'),
		cloneEntries: op('assignmentRules.cloneEntries'),
		create: op('assignmentRules.create'),
		delete: op('assignmentRules.delete'),
		get: op('assignmentRules.get'),
		getAssociations: op('assignmentRules.getAssociations'),
		getCount: op('assignmentRules.getCount'),
		list: op('assignmentRules.list'),
		reorderEntries: op('assignmentRules.reorderEntries'),
		update: op('assignmentRules.update'),
	},
	attachments: {
		delete: op('attachments.delete'),
		get: op('attachments.get'),
		list: op('attachments.list'),
		upload: op('attachments.upload'),
	},
	auditLogExports: {
		create: op('auditLogExports.create'),
		get: op('auditLogExports.get'),
		list: op('auditLogExports.list'),
	},
	automationFunctions: {
		create: op('automationFunctions.create'),
		delete: op('automationFunctions.delete'),
		deleteMany: op('automationFunctions.deleteMany'),
		get: op('automationFunctions.get'),
		getAssociatedModules: op('automationFunctions.getAssociatedModules'),
		list: op('automationFunctions.list'),
		update: op('automationFunctions.update'),
		updateMany: op('automationFunctions.updateMany'),
	},
	blueprints: {
		activate: op('blueprints.activate'),
		clone: op('blueprints.clone'),
		create: op('blueprints.create'),
		deactivate: op('blueprints.deactivate'),
		delete: op('blueprints.delete'),
		deleteMany: op('blueprints.deleteMany'),
		get: op('blueprints.get'),
		getForRecord: op('blueprints.getForRecord'),
		getProcessConfigurations: op('blueprints.getProcessConfigurations'),
		getRecordsCount: op('blueprints.getRecordsCount'),
		getUsageConfigurations: op('blueprints.getUsageConfigurations'),
		list: op('blueprints.list'),
		reorder: op('blueprints.reorder'),
		states: {
			create: op('blueprints.states.create'),
			delete: op('blueprints.states.delete'),
			deleteMany: op('blueprints.states.deleteMany'),
			get: op('blueprints.states.get'),
			list: op('blueprints.states.list'),
			update: op('blueprints.states.update'),
			updateMany: op('blueprints.states.updateMany'),
		},
		transitionRecord: op('blueprints.transitionRecord'),
		transitions: {
			create: op('blueprints.transitions.create'),
			delete: op('blueprints.transitions.delete'),
			deleteMany: op('blueprints.transitions.deleteMany'),
			get: op('blueprints.transitions.get'),
			list: op('blueprints.transitions.list'),
			update: op('blueprints.transitions.update'),
			updateMany: op('blueprints.transitions.updateMany'),
		},
		update: op('blueprints.update'),
		updateMany: op('blueprints.updateMany'),
	},
	bulkRead: {
		createJob: op('bulkRead.createJob'),
		downloadResult: op('bulkRead.downloadResult'),
		getJob: op('bulkRead.getJob'),
	},
	bulkWrite: {
		createJob: op('bulkWrite.createJob'),
		getJob: op('bulkWrite.getJob'),
		uploadFile: op('bulkWrite.uploadFile'),
	},
	businessHours: {
		create: op('businessHours.create'),
		get: op('businessHours.get'),
		update: op('businessHours.update'),
	},
	cadences: {
		activate: op('cadences.activate'),
		clone: op('cadences.clone'),
		create: op('cadences.create'),
		deactivate: op('cadences.deactivate'),
		delete: op('cadences.delete'),
		enrollRecords: op('cadences.enrollRecords'),
		get: op('cadences.get'),
		getAnalytics: op('cadences.getAnalytics'),
		getModuleActionsCount: op('cadences.getModuleActionsCount'),
		getRecordsCount: op('cadences.getRecordsCount'),
		list: op('cadences.list'),
		publish: op('cadences.publish'),
		unenrollRecords: op('cadences.unenrollRecords'),
		update: op('cadences.update'),
		updateMany: op('cadences.updateMany'),
	},
	callPreferences: {
		get: op('callPreferences.get'),
		update: op('callPreferences.update'),
	},
	compositeRequests: {
		execute: op('compositeRequests.execute'),
	},
	contactRoles: {
		create: op('contactRoles.create'),
		delete: op('contactRoles.delete'),
		deleteMany: op('contactRoles.deleteMany'),
		get: op('contactRoles.get'),
		list: op('contactRoles.list'),
		update: op('contactRoles.update'),
		updateMany: op('contactRoles.updateMany'),
	},
	coql: {
		query: op('coql.query'),
	},
	currencies: {
		create: op('currencies.create'),
		enableMultiCurrency: op('currencies.enableMultiCurrency'),
		get: op('currencies.get'),
		list: op('currencies.list'),
		update: op('currencies.update'),
		updateBase: op('currencies.updateBase'),
		updateMany: op('currencies.updateMany'),
	},
	customViews: {
		changeSort: op('customViews.changeSort'),
		changeSortMany: op('customViews.changeSortMany'),
		create: op('customViews.create'),
		deleteMany: op('customViews.deleteMany'),
		get: op('customViews.get'),
		list: op('customViews.list'),
		update: op('customViews.update'),
		updateMany: op('customViews.updateMany'),
	},
	dataSharing: {
		get: op('dataSharing.get'),
		update: op('dataSharing.update'),
	},
	dealContactRoles: {
		delete: op('dealContactRoles.delete'),
		deleteMany: op('dealContactRoles.deleteMany'),
		get: op('dealContactRoles.get'),
		list: op('dealContactRoles.list'),
		upsert: op('dealContactRoles.upsert'),
		upsertMany: op('dealContactRoles.upsertMany'),
	},
	duplicateCheckPreferences: {
		create: op('duplicateCheckPreferences.create'),
		delete: op('duplicateCheckPreferences.delete'),
		get: op('duplicateCheckPreferences.get'),
		update: op('duplicateCheckPreferences.update'),
	},
	emailDrafts: {
		create: op('emailDrafts.create'),
		delete: op('emailDrafts.delete'),
		get: op('emailDrafts.get'),
		list: op('emailDrafts.list'),
		update: op('emailDrafts.update'),
		updateMany: op('emailDrafts.updateMany'),
	},
	emailNotifications: {
		create: op('emailNotifications.create'),
		delete: op('emailNotifications.delete'),
		deleteMany: op('emailNotifications.deleteMany'),
		get: op('emailNotifications.get'),
		getUsageReports: op('emailNotifications.getUsageReports'),
		list: op('emailNotifications.list'),
		update: op('emailNotifications.update'),
	},
	emailTemplates: {
		list: op('emailTemplates.list'),
	},
	emails: {
		associate: op('emails.associate'),
		downloadAttachments: op('emails.downloadAttachments'),
		downloadInlineImages: op('emails.downloadInlineImages'),
		getSharingDetails: op('emails.getSharingDetails'),
		link: op('emails.link'),
		linkMany: op('emails.linkMany'),
		send: op('emails.send'),
		share: op('emails.share'),
		shareMany: op('emails.shareMany'),
		unblock: op('emails.unblock'),
		unblockMany: op('emails.unblockMany'),
		unlink: op('emails.unlink'),
		unlinkMany: op('emails.unlinkMany'),
		unshare: op('emails.unshare'),
		unshareMany: op('emails.unshareMany'),
	},
	features: {
		get: op('features.get'),
		getUserLicenses: op('features.getUserLicenses'),
		list: op('features.list'),
	},
	fieldUpdates: {
		create: op('fieldUpdates.create'),
		delete: op('fieldUpdates.delete'),
		deleteMany: op('fieldUpdates.deleteMany'),
		get: op('fieldUpdates.get'),
		list: op('fieldUpdates.list'),
		update: op('fieldUpdates.update'),
	},
	fields: {
		create: op('fields.create'),
		delete: op('fields.delete'),
		get: op('fields.get'),
		getScheduledJobs: op('fields.getScheduledJobs'),
		list: op('fields.list'),
		update: op('fields.update'),
		updateMany: op('fields.updateMany'),
	},
	files: {
		download: op('files.download'),
		upload: op('files.upload'),
	},
	fiscalYear: {
		get: op('fiscalYear.get'),
		update: op('fiscalYear.update'),
	},
	fromAddresses: {
		list: op('fromAddresses.list'),
	},
	functions: {
		create: op('functions.create'),
		delete: op('functions.delete'),
		get: op('functions.get'),
		getCategories: op('functions.getCategories'),
		getCode: op('functions.getCode'),
		getRuntimes: op('functions.getRuntimes'),
		list: op('functions.list'),
		publish: op('functions.publish'),
		update: op('functions.update'),
	},
	globalPicklists: {
		create: op('globalPicklists.create'),
		delete: op('globalPicklists.delete'),
		deleteMany: op('globalPicklists.deleteMany'),
		get: op('globalPicklists.get'),
		getFieldAssociations: op('globalPicklists.getFieldAssociations'),
		getReplacedValues: op('globalPicklists.getReplacedValues'),
		getValueAssociations: op('globalPicklists.getValueAssociations'),
		list: op('globalPicklists.list'),
		replaceValues: op('globalPicklists.replaceValues'),
		update: op('globalPicklists.update'),
		updateMany: op('globalPicklists.updateMany'),
	},
	holidays: {
		create: op('holidays.create'),
		delete: op('holidays.delete'),
		get: op('holidays.get'),
		list: op('holidays.list'),
		update: op('holidays.update'),
		updateMany: op('holidays.updateMany'),
	},
	inventory: {
		convert: op('inventory.convert'),
	},
	inventoryTemplates: {
		get: op('inventoryTemplates.get'),
		list: op('inventoryTemplates.list'),
	},
	kiosks: {
		activate: op('kiosks.activate'),
		clone: op('kiosks.clone'),
		create: op('kiosks.create'),
		deactivate: op('kiosks.deactivate'),
		delete: op('kiosks.delete'),
		deleteMany: op('kiosks.deleteMany'),
		execute: op('kiosks.execute'),
		executeState: op('kiosks.executeState'),
		get: op('kiosks.get'),
		getAssociations: op('kiosks.getAssociations'),
		getCurrentRecordAssociations: op('kiosks.getCurrentRecordAssociations'),
		getExecution: op('kiosks.getExecution'),
		getRecordSteps: {
			create: op('kiosks.getRecordSteps.create'),
			delete: op('kiosks.getRecordSteps.delete'),
			get: op('kiosks.getRecordSteps.get'),
			getAssociations: op('kiosks.getRecordSteps.getAssociations'),
			list: op('kiosks.getRecordSteps.list'),
			update: op('kiosks.getRecordSteps.update'),
		},
		list: op('kiosks.list'),
		listAssociations: op('kiosks.listAssociations'),
		listExecutions: op('kiosks.listExecutions'),
		preview: op('kiosks.preview'),
		states: {
			create: op('kiosks.states.create'),
			delete: op('kiosks.states.delete'),
			get: op('kiosks.states.get'),
			list: op('kiosks.states.list'),
			update: op('kiosks.states.update'),
		},
		testRun: op('kiosks.testRun'),
		update: op('kiosks.update'),
		updateAssociations: op('kiosks.updateAssociations'),
	},
	layouts: {
		activate: op('layouts.activate'),
		deactivate: op('layouts.deactivate'),
		delete: op('layouts.delete'),
		get: op('layouts.get'),
		list: op('layouts.list'),
		update: op('layouts.update'),
	},
	leads: {
		convert: op('leads.convert'),
		getConversionOptions: op('leads.getConversionOptions'),
	},
	mailMerge: {
		download: op('mailMerge.download'),
		send: op('mailMerge.send'),
		sign: op('mailMerge.sign'),
	},
	mapDependencies: {
		create: op('mapDependencies.create'),
		delete: op('mapDependencies.delete'),
		get: op('mapDependencies.get'),
		list: op('mapDependencies.list'),
		update: op('mapDependencies.update'),
	},
	massActions: {
		changeOwner: op('massActions.changeOwner'),
		convertLeads: op('massActions.convertLeads'),
		deleteRecords: op('massActions.deleteRecords'),
		deleteTags: op('massActions.deleteTags'),
		getChangeOwnerStatus: op('massActions.getChangeOwnerStatus'),
		getConvertLeadsStatus: op('massActions.getConvertLeadsStatus'),
		getDeleteRecordsStatus: op('massActions.getDeleteRecordsStatus'),
		getDeleteTagsStatus: op('massActions.getDeleteTagsStatus'),
		getUpdateRecordsStatus: op('massActions.getUpdateRecordsStatus'),
		updateRecords: op('massActions.updateRecords'),
	},
	meetings: {
		cancel: op('meetings.cancel'),
	},
	modules: {
		create: op('modules.create'),
		generateLink: op('modules.generateLink'),
		get: op('modules.get'),
		list: op('modules.list'),
		update: op('modules.update'),
		updateMany: op('modules.updateMany'),
	},
	notes: {
		create: op('notes.create'),
		createForRecord: op('notes.createForRecord'),
		delete: op('notes.delete'),
		deleteForRecord: op('notes.deleteForRecord'),
		deleteMany: op('notes.deleteMany'),
		deleteManyForRecord: op('notes.deleteManyForRecord'),
		get: op('notes.get'),
		getForRecord: op('notes.getForRecord'),
		list: op('notes.list'),
		listForRecord: op('notes.listForRecord'),
		update: op('notes.update'),
		updateForRecord: op('notes.updateForRecord'),
		updateMany: op('notes.updateMany'),
		updateManyForRecord: op('notes.updateManyForRecord'),
	},
	notifications: {
		disable: op('notifications.disable'),
		enable: op('notifications.enable'),
		list: op('notifications.list'),
		update: op('notifications.update'),
		updateInfo: op('notifications.updateInfo'),
	},
	org: {
		deletePhoto: op('org.deletePhoto'),
		get: op('org.get'),
		getPhoto: op('org.getPhoto'),
		uploadPhoto: op('org.uploadPhoto'),
	},
	picklistValues: {
		delete: op('picklistValues.delete'),
		get: op('picklistValues.get'),
		list: op('picklistValues.list'),
		replace: op('picklistValues.replace'),
	},
	pipelines: {
		create: op('pipelines.create'),
		get: op('pipelines.get'),
		list: op('pipelines.list'),
		replace: op('pipelines.replace'),
		replaceMany: op('pipelines.replaceMany'),
		transferAndDelete: op('pipelines.transferAndDelete'),
		update: op('pipelines.update'),
		updateMany: op('pipelines.updateMany'),
	},
	portals: {
		create: op('portals.create'),
		get: op('portals.get'),
		list: op('portals.list'),
		update: op('portals.update'),
		userTypes: {
			create: op('portals.userTypes.create'),
			delete: op('portals.userTypes.delete'),
			get: op('portals.userTypes.get'),
			list: op('portals.userTypes.list'),
			update: op('portals.userTypes.update'),
		},
		users: {
			changeStatus: op('portals.users.changeStatus'),
			changeStatusMany: op('portals.users.changeStatusMany'),
			deleteMany: op('portals.users.deleteMany'),
			getScheduledInviteInfo: op('portals.users.getScheduledInviteInfo'),
			invite: op('portals.users.invite'),
			inviteMany: op('portals.users.inviteMany'),
			list: op('portals.users.list'),
			transfer: op('portals.users.transfer'),
		},
	},
	profiles: {
		clone: op('profiles.clone'),
		delete: op('profiles.delete'),
		get: op('profiles.get'),
		list: op('profiles.list'),
		patch: op('profiles.patch'),
		update: op('profiles.update'),
	},
	recordLocking: {
		configurations: {
			create: op('recordLocking.configurations.create'),
			delete: op('recordLocking.configurations.delete'),
			deleteMany: op('recordLocking.configurations.deleteMany'),
			get: op('recordLocking.configurations.get'),
			list: op('recordLocking.configurations.list'),
			update: op('recordLocking.configurations.update'),
			updateMany: op('recordLocking.configurations.updateMany'),
		},
		getLock: op('recordLocking.getLock'),
		listLocks: op('recordLocking.listLocks'),
		lock: op('recordLocking.lock'),
		unlock: op('recordLocking.unlock'),
		updateLock: op('recordLocking.updateLock'),
	},
	recordSharing: {
		list: op('recordSharing.list'),
		revokeAll: op('recordSharing.revokeAll'),
		share: op('recordSharing.share'),
		update: op('recordSharing.update'),
	},
	records: {
		changeOwner: op('records.changeOwner'),
		changeOwnerMany: op('records.changeOwnerMany'),
		clone: op('records.clone'),
		count: op('records.count'),
		create: op('records.create'),
		delete: op('records.delete'),
		deleteMany: op('records.deleteMany'),
		deletePhoto: op('records.deletePhoto'),
		get: op('records.get'),
		getFullData: op('records.getFullData'),
		getFullDataMany: op('records.getFullDataMany'),
		getMergeStatus: op('records.getMergeStatus'),
		getPhoto: op('records.getPhoto'),
		list: op('records.list'),
		listDeleted: op('records.listDeleted'),
		merge: op('records.merge'),
		search: op('records.search'),
		searchMany: op('records.searchMany'),
		update: op('records.update'),
		updateMany: op('records.updateMany'),
		uploadPhoto: op('records.uploadPhoto'),
		upsert: op('records.upsert'),
	},
	recycleBin: {
		count: op('recycleBin.count'),
		delete: op('recycleBin.delete'),
		deleteMany: op('recycleBin.deleteMany'),
		empty: op('recycleBin.empty'),
		get: op('recycleBin.get'),
		list: op('recycleBin.list'),
		restore: op('recycleBin.restore'),
		restoreMany: op('recycleBin.restoreMany'),
	},
	relatedLists: {
		list: op('relatedLists.list'),
	},
	relatedRecords: {
		count: op('relatedRecords.count'),
		delink: op('relatedRecords.delink'),
		delinkMany: op('relatedRecords.delinkMany'),
		get: op('relatedRecords.get'),
		list: op('relatedRecords.list'),
		listDeleted: op('relatedRecords.listDeleted'),
		update: op('relatedRecords.update'),
		updateMany: op('relatedRecords.updateMany'),
	},
	roles: {
		create: op('roles.create'),
		delete: op('roles.delete'),
		get: op('roles.get'),
		list: op('roles.list'),
		update: op('roles.update'),
		updateMany: op('roles.updateMany'),
	},
	scoringRules: {
		activate: op('scoringRules.activate'),
		clone: op('scoringRules.clone'),
		create: op('scoringRules.create'),
		deactivate: op('scoringRules.deactivate'),
		delete: op('scoringRules.delete'),
		deleteMany: op('scoringRules.deleteMany'),
		get: op('scoringRules.get'),
		list: op('scoringRules.list'),
		update: op('scoringRules.update'),
		updateMany: op('scoringRules.updateMany'),
	},
	servicePreferences: {
		get: op('servicePreferences.get'),
		update: op('servicePreferences.update'),
	},
	services: {
		create: op('services.create'),
		delete: op('services.delete'),
		deleteMany: op('services.deleteMany'),
		get: op('services.get'),
		list: op('services.list'),
		update: op('services.update'),
		updateMany: op('services.updateMany'),
	},
	shiftHours: {
		create: op('shiftHours.create'),
		delete: op('shiftHours.delete'),
		get: op('shiftHours.get'),
		list: op('shiftHours.list'),
		update: op('shiftHours.update'),
		updateMany: op('shiftHours.updateMany'),
	},
	tags: {
		addToRecord: op('tags.addToRecord'),
		addToRecords: op('tags.addToRecords'),
		create: op('tags.create'),
		delete: op('tags.delete'),
		getRecordsCount: op('tags.getRecordsCount'),
		list: op('tags.list'),
		merge: op('tags.merge'),
		removeFromRecord: op('tags.removeFromRecord'),
		removeFromRecords: op('tags.removeFromRecords'),
		update: op('tags.update'),
		updateMany: op('tags.updateMany'),
	},
	territories: {
		assignToRecord: op('territories.assignToRecord'),
		assignToRecords: op('territories.assignToRecords'),
		create: op('territories.create'),
		delete: op('territories.delete'),
		deleteMany: op('territories.deleteMany'),
		get: op('territories.get'),
		getAssociatedUsersCount: op('territories.getAssociatedUsersCount'),
		getScheduledRunRuleJobs: op('territories.getScheduledRunRuleJobs'),
		list: op('territories.list'),
		listChildren: op('territories.listChildren'),
		removeFromRecord: op('territories.removeFromRecord'),
		removeFromRecords: op('territories.removeFromRecords'),
		runRules: op('territories.runRules'),
		transferAndDelete: op('territories.transferAndDelete'),
		transferAndDeleteMany: op('territories.transferAndDeleteMany'),
		update: op('territories.update'),
		updateMany: op('territories.updateMany'),
		users: {
			associate: op('territories.users.associate'),
			associateMany: op('territories.users.associateMany'),
			deassociate: op('territories.users.deassociate'),
			deassociateMany: op('territories.users.deassociateMany'),
			get: op('territories.users.get'),
			list: op('territories.users.list'),
		},
	},
	timelines: {
		list: op('timelines.list'),
	},
	unsubscribeLinks: {
		create: op('unsubscribeLinks.create'),
		delete: op('unsubscribeLinks.delete'),
		get: op('unsubscribeLinks.get'),
		getAssociations: op('unsubscribeLinks.getAssociations'),
		list: op('unsubscribeLinks.list'),
		update: op('unsubscribeLinks.update'),
		updateMany: op('unsubscribeLinks.updateMany'),
	},
	userGroups: {
		create: op('userGroups.create'),
		delete: op('userGroups.delete'),
		get: op('userGroups.get'),
		getAssociatedUsersCount: op('userGroups.getAssociatedUsersCount'),
		getAssociations: op('userGroups.getAssociations'),
		getSources: op('userGroups.getSources'),
		getSourcesCount: op('userGroups.getSourcesCount'),
		list: op('userGroups.list'),
		listForUser: op('userGroups.listForUser'),
		update: op('userGroups.update'),
	},
	users: {
		create: op('users.create'),
		delete: op('users.delete'),
		get: op('users.get'),
		getTransferAndDeleteStatus: op('users.getTransferAndDeleteStatus'),
		getTransferStatus: op('users.getTransferStatus'),
		list: op('users.list'),
		territories: {
			associateMany: op('users.territories.associateMany'),
			get: op('users.territories.get'),
			list: op('users.territories.list'),
			remove: op('users.territories.remove'),
			removeMany: op('users.territories.removeMany'),
		},
		transfer: op('users.transfer'),
		transferAndDelete: op('users.transferAndDelete'),
		transferAndDeleteMany: op('users.transferAndDeleteMany'),
		update: op('users.update'),
		updateMany: op('users.updateMany'),
		validateBeforeTransfer: op('users.validateBeforeTransfer'),
	},
	variableGroups: {
		generateApiName: op('variableGroups.generateApiName'),
		get: op('variableGroups.get'),
		list: op('variableGroups.list'),
		update: op('variableGroups.update'),
		updateMany: op('variableGroups.updateMany'),
	},
	variables: {
		create: op('variables.create'),
		delete: op('variables.delete'),
		deleteMany: op('variables.deleteMany'),
		generateApiName: op('variables.generateApiName'),
		get: op('variables.get'),
		getAssociations: op('variables.getAssociations'),
		list: op('variables.list'),
		update: op('variables.update'),
		updateMany: op('variables.updateMany'),
	},
	webforms: {
		create: op('webforms.create'),
		delete: op('webforms.delete'),
		deleteMany: op('webforms.deleteMany'),
		get: op('webforms.get'),
		getAssociated: op('webforms.getAssociated'),
		getDiff: op('webforms.getDiff'),
		getPreview: op('webforms.getPreview'),
		getSuggestions: op('webforms.getSuggestions'),
		list: op('webforms.list'),
		update: op('webforms.update'),
		updateMany: op('webforms.updateMany'),
	},
	webhooks: {
		create: op('webhooks.create'),
		delete: op('webhooks.delete'),
		deleteMany: op('webhooks.deleteMany'),
		get: op('webhooks.get'),
		getAssociatedModules: op('webhooks.getAssociatedModules'),
		getFailures: op('webhooks.getFailures'),
		getUsageReports: op('webhooks.getUsageReports'),
		list: op('webhooks.list'),
		update: op('webhooks.update'),
		updateMany: op('webhooks.updateMany'),
	},
	wizards: {
		create: op('wizards.create'),
		delete: op('wizards.delete'),
		get: op('wizards.get'),
		list: op('wizards.list'),
		update: op('wizards.update'),
	},
	workflowRules: {
		create: op('workflowRules.create'),
		delete: op('workflowRules.delete'),
		deleteMany: op('workflowRules.deleteMany'),
		get: op('workflowRules.get'),
		getActionsCount: op('workflowRules.getActionsCount'),
		getConfigurations: op('workflowRules.getConfigurations'),
		getCount: op('workflowRules.getCount'),
		getModuleActionsCount: op('workflowRules.getModuleActionsCount'),
		getUsage: op('workflowRules.getUsage'),
		list: op('workflowRules.list'),
		reorder: op('workflowRules.reorder'),
		update: op('workflowRules.update'),
		updateMany: op('workflowRules.updateMany'),
	},
	workflowTasks: {
		create: op('workflowTasks.create'),
		delete: op('workflowTasks.delete'),
		deleteMany: op('workflowTasks.deleteMany'),
		get: op('workflowTasks.get'),
		list: op('workflowTasks.list'),
		update: op('workflowTasks.update'),
		updateMany: op('workflowTasks.updateMany'),
	},
	zia: {
		enrichment: {
			create: op('zia.enrichment.create'),
			delete: op('zia.enrichment.delete'),
			get: op('zia.enrichment.get'),
			list: op('zia.enrichment.list'),
			update: op('zia.enrichment.update'),
		},
		orgEnrichment: {
			create: op('zia.orgEnrichment.create'),
			get: op('zia.orgEnrichment.get'),
			list: op('zia.orgEnrichment.list'),
		},
	},
} as const;

export const zohocrmEndpointSchemas = {
	'abTesting.checkLaunchSuggestions': zohocrmSchemaEntry(
		'abTesting.checkLaunchSuggestions',
	),
	'abTesting.create': zohocrmSchemaEntry('abTesting.create'),
	'abTesting.delete': zohocrmSchemaEntry('abTesting.delete'),
	'abTesting.get': zohocrmSchemaEntry('abTesting.get'),
	'abTesting.getPreview': zohocrmSchemaEntry('abTesting.getPreview'),
	'abTesting.getSuggestions': zohocrmSchemaEntry('abTesting.getSuggestions'),
	'abTesting.getVisitors': zohocrmSchemaEntry('abTesting.getVisitors'),
	'abTesting.list': zohocrmSchemaEntry('abTesting.list'),
	'abTesting.listVisitors': zohocrmSchemaEntry('abTesting.listVisitors'),
	'abTesting.update': zohocrmSchemaEntry('abTesting.update'),
	'apis.list': zohocrmSchemaEntry('apis.list'),
	'appointmentPreferences.get': zohocrmSchemaEntry(
		'appointmentPreferences.get',
	),
	'appointmentPreferences.update': zohocrmSchemaEntry(
		'appointmentPreferences.update',
	),
	'appointments.create': zohocrmSchemaEntry('appointments.create'),
	'appointments.delete': zohocrmSchemaEntry('appointments.delete'),
	'appointments.deleteMany': zohocrmSchemaEntry('appointments.deleteMany'),
	'appointments.get': zohocrmSchemaEntry('appointments.get'),
	'appointments.list': zohocrmSchemaEntry('appointments.list'),
	'appointments.update': zohocrmSchemaEntry('appointments.update'),
	'appointments.updateMany': zohocrmSchemaEntry('appointments.updateMany'),
	'approvalProcesses.clone': zohocrmSchemaEntry('approvalProcesses.clone'),
	'approvalProcesses.create': zohocrmSchemaEntry('approvalProcesses.create'),
	'approvalProcesses.delete': zohocrmSchemaEntry('approvalProcesses.delete'),
	'approvalProcesses.get': zohocrmSchemaEntry('approvalProcesses.get'),
	'approvalProcesses.getCount': zohocrmSchemaEntry(
		'approvalProcesses.getCount',
	),
	'approvalProcesses.getProcessConfigurations': zohocrmSchemaEntry(
		'approvalProcesses.getProcessConfigurations',
	),
	'approvalProcesses.getRule': zohocrmSchemaEntry('approvalProcesses.getRule'),
	'approvalProcesses.list': zohocrmSchemaEntry('approvalProcesses.list'),
	'approvalProcesses.listRules': zohocrmSchemaEntry(
		'approvalProcesses.listRules',
	),
	'approvalProcesses.reorder': zohocrmSchemaEntry('approvalProcesses.reorder'),
	'approvalProcesses.reorderRules': zohocrmSchemaEntry(
		'approvalProcesses.reorderRules',
	),
	'approvalProcesses.update': zohocrmSchemaEntry('approvalProcesses.update'),
	'approvalProcesses.updateMany': zohocrmSchemaEntry(
		'approvalProcesses.updateMany',
	),
	'assignmentRules.clone': zohocrmSchemaEntry('assignmentRules.clone'),
	'assignmentRules.cloneEntries': zohocrmSchemaEntry(
		'assignmentRules.cloneEntries',
	),
	'assignmentRules.create': zohocrmSchemaEntry('assignmentRules.create'),
	'assignmentRules.delete': zohocrmSchemaEntry('assignmentRules.delete'),
	'assignmentRules.get': zohocrmSchemaEntry('assignmentRules.get'),
	'assignmentRules.getAssociations': zohocrmSchemaEntry(
		'assignmentRules.getAssociations',
	),
	'assignmentRules.getCount': zohocrmSchemaEntry('assignmentRules.getCount'),
	'assignmentRules.list': zohocrmSchemaEntry('assignmentRules.list'),
	'assignmentRules.reorderEntries': zohocrmSchemaEntry(
		'assignmentRules.reorderEntries',
	),
	'assignmentRules.update': zohocrmSchemaEntry('assignmentRules.update'),
	'attachments.delete': zohocrmSchemaEntry('attachments.delete'),
	'attachments.get': zohocrmSchemaEntry('attachments.get'),
	'attachments.list': zohocrmSchemaEntry('attachments.list'),
	'attachments.upload': zohocrmSchemaEntry('attachments.upload'),
	'auditLogExports.create': zohocrmSchemaEntry('auditLogExports.create'),
	'auditLogExports.get': zohocrmSchemaEntry('auditLogExports.get'),
	'auditLogExports.list': zohocrmSchemaEntry('auditLogExports.list'),
	'automationFunctions.create': zohocrmSchemaEntry(
		'automationFunctions.create',
	),
	'automationFunctions.delete': zohocrmSchemaEntry(
		'automationFunctions.delete',
	),
	'automationFunctions.deleteMany': zohocrmSchemaEntry(
		'automationFunctions.deleteMany',
	),
	'automationFunctions.get': zohocrmSchemaEntry('automationFunctions.get'),
	'automationFunctions.getAssociatedModules': zohocrmSchemaEntry(
		'automationFunctions.getAssociatedModules',
	),
	'automationFunctions.list': zohocrmSchemaEntry('automationFunctions.list'),
	'automationFunctions.update': zohocrmSchemaEntry(
		'automationFunctions.update',
	),
	'automationFunctions.updateMany': zohocrmSchemaEntry(
		'automationFunctions.updateMany',
	),
	'blueprints.activate': zohocrmSchemaEntry('blueprints.activate'),
	'blueprints.clone': zohocrmSchemaEntry('blueprints.clone'),
	'blueprints.create': zohocrmSchemaEntry('blueprints.create'),
	'blueprints.deactivate': zohocrmSchemaEntry('blueprints.deactivate'),
	'blueprints.delete': zohocrmSchemaEntry('blueprints.delete'),
	'blueprints.deleteMany': zohocrmSchemaEntry('blueprints.deleteMany'),
	'blueprints.get': zohocrmSchemaEntry('blueprints.get'),
	'blueprints.getForRecord': zohocrmSchemaEntry('blueprints.getForRecord'),
	'blueprints.getProcessConfigurations': zohocrmSchemaEntry(
		'blueprints.getProcessConfigurations',
	),
	'blueprints.getRecordsCount': zohocrmSchemaEntry(
		'blueprints.getRecordsCount',
	),
	'blueprints.getUsageConfigurations': zohocrmSchemaEntry(
		'blueprints.getUsageConfigurations',
	),
	'blueprints.list': zohocrmSchemaEntry('blueprints.list'),
	'blueprints.reorder': zohocrmSchemaEntry('blueprints.reorder'),
	'blueprints.states.create': zohocrmSchemaEntry('blueprints.states.create'),
	'blueprints.states.delete': zohocrmSchemaEntry('blueprints.states.delete'),
	'blueprints.states.deleteMany': zohocrmSchemaEntry(
		'blueprints.states.deleteMany',
	),
	'blueprints.states.get': zohocrmSchemaEntry('blueprints.states.get'),
	'blueprints.states.list': zohocrmSchemaEntry('blueprints.states.list'),
	'blueprints.states.update': zohocrmSchemaEntry('blueprints.states.update'),
	'blueprints.states.updateMany': zohocrmSchemaEntry(
		'blueprints.states.updateMany',
	),
	'blueprints.transitionRecord': zohocrmSchemaEntry(
		'blueprints.transitionRecord',
	),
	'blueprints.transitions.create': zohocrmSchemaEntry(
		'blueprints.transitions.create',
	),
	'blueprints.transitions.delete': zohocrmSchemaEntry(
		'blueprints.transitions.delete',
	),
	'blueprints.transitions.deleteMany': zohocrmSchemaEntry(
		'blueprints.transitions.deleteMany',
	),
	'blueprints.transitions.get': zohocrmSchemaEntry(
		'blueprints.transitions.get',
	),
	'blueprints.transitions.list': zohocrmSchemaEntry(
		'blueprints.transitions.list',
	),
	'blueprints.transitions.update': zohocrmSchemaEntry(
		'blueprints.transitions.update',
	),
	'blueprints.transitions.updateMany': zohocrmSchemaEntry(
		'blueprints.transitions.updateMany',
	),
	'blueprints.update': zohocrmSchemaEntry('blueprints.update'),
	'blueprints.updateMany': zohocrmSchemaEntry('blueprints.updateMany'),
	'bulkRead.createJob': zohocrmSchemaEntry('bulkRead.createJob'),
	'bulkRead.downloadResult': zohocrmSchemaEntry('bulkRead.downloadResult'),
	'bulkRead.getJob': zohocrmSchemaEntry('bulkRead.getJob'),
	'bulkWrite.createJob': zohocrmSchemaEntry('bulkWrite.createJob'),
	'bulkWrite.getJob': zohocrmSchemaEntry('bulkWrite.getJob'),
	'bulkWrite.uploadFile': zohocrmSchemaEntry('bulkWrite.uploadFile'),
	'businessHours.create': zohocrmSchemaEntry('businessHours.create'),
	'businessHours.get': zohocrmSchemaEntry('businessHours.get'),
	'businessHours.update': zohocrmSchemaEntry('businessHours.update'),
	'cadences.activate': zohocrmSchemaEntry('cadences.activate'),
	'cadences.clone': zohocrmSchemaEntry('cadences.clone'),
	'cadences.create': zohocrmSchemaEntry('cadences.create'),
	'cadences.deactivate': zohocrmSchemaEntry('cadences.deactivate'),
	'cadences.delete': zohocrmSchemaEntry('cadences.delete'),
	'cadences.enrollRecords': zohocrmSchemaEntry('cadences.enrollRecords'),
	'cadences.get': zohocrmSchemaEntry('cadences.get'),
	'cadences.getAnalytics': zohocrmSchemaEntry('cadences.getAnalytics'),
	'cadences.getModuleActionsCount': zohocrmSchemaEntry(
		'cadences.getModuleActionsCount',
	),
	'cadences.getRecordsCount': zohocrmSchemaEntry('cadences.getRecordsCount'),
	'cadences.list': zohocrmSchemaEntry('cadences.list'),
	'cadences.publish': zohocrmSchemaEntry('cadences.publish'),
	'cadences.unenrollRecords': zohocrmSchemaEntry('cadences.unenrollRecords'),
	'cadences.update': zohocrmSchemaEntry('cadences.update'),
	'cadences.updateMany': zohocrmSchemaEntry('cadences.updateMany'),
	'callPreferences.get': zohocrmSchemaEntry('callPreferences.get'),
	'callPreferences.update': zohocrmSchemaEntry('callPreferences.update'),
	'compositeRequests.execute': zohocrmSchemaEntry('compositeRequests.execute'),
	'contactRoles.create': zohocrmSchemaEntry('contactRoles.create'),
	'contactRoles.delete': zohocrmSchemaEntry('contactRoles.delete'),
	'contactRoles.deleteMany': zohocrmSchemaEntry('contactRoles.deleteMany'),
	'contactRoles.get': zohocrmSchemaEntry('contactRoles.get'),
	'contactRoles.list': zohocrmSchemaEntry('contactRoles.list'),
	'contactRoles.update': zohocrmSchemaEntry('contactRoles.update'),
	'contactRoles.updateMany': zohocrmSchemaEntry('contactRoles.updateMany'),
	'coql.query': zohocrmSchemaEntry('coql.query'),
	'currencies.create': zohocrmSchemaEntry('currencies.create'),
	'currencies.enableMultiCurrency': zohocrmSchemaEntry(
		'currencies.enableMultiCurrency',
	),
	'currencies.get': zohocrmSchemaEntry('currencies.get'),
	'currencies.list': zohocrmSchemaEntry('currencies.list'),
	'currencies.update': zohocrmSchemaEntry('currencies.update'),
	'currencies.updateBase': zohocrmSchemaEntry('currencies.updateBase'),
	'currencies.updateMany': zohocrmSchemaEntry('currencies.updateMany'),
	'customViews.changeSort': zohocrmSchemaEntry('customViews.changeSort'),
	'customViews.changeSortMany': zohocrmSchemaEntry(
		'customViews.changeSortMany',
	),
	'customViews.create': zohocrmSchemaEntry('customViews.create'),
	'customViews.deleteMany': zohocrmSchemaEntry('customViews.deleteMany'),
	'customViews.get': zohocrmSchemaEntry('customViews.get'),
	'customViews.list': zohocrmSchemaEntry('customViews.list'),
	'customViews.update': zohocrmSchemaEntry('customViews.update'),
	'customViews.updateMany': zohocrmSchemaEntry('customViews.updateMany'),
	'dataSharing.get': zohocrmSchemaEntry('dataSharing.get'),
	'dataSharing.update': zohocrmSchemaEntry('dataSharing.update'),
	'dealContactRoles.delete': zohocrmSchemaEntry('dealContactRoles.delete'),
	'dealContactRoles.deleteMany': zohocrmSchemaEntry(
		'dealContactRoles.deleteMany',
	),
	'dealContactRoles.get': zohocrmSchemaEntry('dealContactRoles.get'),
	'dealContactRoles.list': zohocrmSchemaEntry('dealContactRoles.list'),
	'dealContactRoles.upsert': zohocrmSchemaEntry('dealContactRoles.upsert'),
	'dealContactRoles.upsertMany': zohocrmSchemaEntry(
		'dealContactRoles.upsertMany',
	),
	'duplicateCheckPreferences.create': zohocrmSchemaEntry(
		'duplicateCheckPreferences.create',
	),
	'duplicateCheckPreferences.delete': zohocrmSchemaEntry(
		'duplicateCheckPreferences.delete',
	),
	'duplicateCheckPreferences.get': zohocrmSchemaEntry(
		'duplicateCheckPreferences.get',
	),
	'duplicateCheckPreferences.update': zohocrmSchemaEntry(
		'duplicateCheckPreferences.update',
	),
	'emailDrafts.create': zohocrmSchemaEntry('emailDrafts.create'),
	'emailDrafts.delete': zohocrmSchemaEntry('emailDrafts.delete'),
	'emailDrafts.get': zohocrmSchemaEntry('emailDrafts.get'),
	'emailDrafts.list': zohocrmSchemaEntry('emailDrafts.list'),
	'emailDrafts.update': zohocrmSchemaEntry('emailDrafts.update'),
	'emailDrafts.updateMany': zohocrmSchemaEntry('emailDrafts.updateMany'),
	'emailNotifications.create': zohocrmSchemaEntry('emailNotifications.create'),
	'emailNotifications.delete': zohocrmSchemaEntry('emailNotifications.delete'),
	'emailNotifications.deleteMany': zohocrmSchemaEntry(
		'emailNotifications.deleteMany',
	),
	'emailNotifications.get': zohocrmSchemaEntry('emailNotifications.get'),
	'emailNotifications.getUsageReports': zohocrmSchemaEntry(
		'emailNotifications.getUsageReports',
	),
	'emailNotifications.list': zohocrmSchemaEntry('emailNotifications.list'),
	'emailNotifications.update': zohocrmSchemaEntry('emailNotifications.update'),
	'emailTemplates.list': zohocrmSchemaEntry('emailTemplates.list'),
	'emails.associate': zohocrmSchemaEntry('emails.associate'),
	'emails.downloadAttachments': zohocrmSchemaEntry(
		'emails.downloadAttachments',
	),
	'emails.downloadInlineImages': zohocrmSchemaEntry(
		'emails.downloadInlineImages',
	),
	'emails.getSharingDetails': zohocrmSchemaEntry('emails.getSharingDetails'),
	'emails.link': zohocrmSchemaEntry('emails.link'),
	'emails.linkMany': zohocrmSchemaEntry('emails.linkMany'),
	'emails.send': zohocrmSchemaEntry('emails.send'),
	'emails.share': zohocrmSchemaEntry('emails.share'),
	'emails.shareMany': zohocrmSchemaEntry('emails.shareMany'),
	'emails.unblock': zohocrmSchemaEntry('emails.unblock'),
	'emails.unblockMany': zohocrmSchemaEntry('emails.unblockMany'),
	'emails.unlink': zohocrmSchemaEntry('emails.unlink'),
	'emails.unlinkMany': zohocrmSchemaEntry('emails.unlinkMany'),
	'emails.unshare': zohocrmSchemaEntry('emails.unshare'),
	'emails.unshareMany': zohocrmSchemaEntry('emails.unshareMany'),
	'features.get': zohocrmSchemaEntry('features.get'),
	'features.getUserLicenses': zohocrmSchemaEntry('features.getUserLicenses'),
	'features.list': zohocrmSchemaEntry('features.list'),
	'fieldUpdates.create': zohocrmSchemaEntry('fieldUpdates.create'),
	'fieldUpdates.delete': zohocrmSchemaEntry('fieldUpdates.delete'),
	'fieldUpdates.deleteMany': zohocrmSchemaEntry('fieldUpdates.deleteMany'),
	'fieldUpdates.get': zohocrmSchemaEntry('fieldUpdates.get'),
	'fieldUpdates.list': zohocrmSchemaEntry('fieldUpdates.list'),
	'fieldUpdates.update': zohocrmSchemaEntry('fieldUpdates.update'),
	'fields.create': zohocrmSchemaEntry('fields.create'),
	'fields.delete': zohocrmSchemaEntry('fields.delete'),
	'fields.get': zohocrmSchemaEntry('fields.get'),
	'fields.getScheduledJobs': zohocrmSchemaEntry('fields.getScheduledJobs'),
	'fields.list': zohocrmSchemaEntry('fields.list'),
	'fields.update': zohocrmSchemaEntry('fields.update'),
	'fields.updateMany': zohocrmSchemaEntry('fields.updateMany'),
	'files.download': zohocrmSchemaEntry('files.download'),
	'files.upload': zohocrmSchemaEntry('files.upload'),
	'fiscalYear.get': zohocrmSchemaEntry('fiscalYear.get'),
	'fiscalYear.update': zohocrmSchemaEntry('fiscalYear.update'),
	'fromAddresses.list': zohocrmSchemaEntry('fromAddresses.list'),
	'functions.create': zohocrmSchemaEntry('functions.create'),
	'functions.delete': zohocrmSchemaEntry('functions.delete'),
	'functions.get': zohocrmSchemaEntry('functions.get'),
	'functions.getCategories': zohocrmSchemaEntry('functions.getCategories'),
	'functions.getCode': zohocrmSchemaEntry('functions.getCode'),
	'functions.getRuntimes': zohocrmSchemaEntry('functions.getRuntimes'),
	'functions.list': zohocrmSchemaEntry('functions.list'),
	'functions.publish': zohocrmSchemaEntry('functions.publish'),
	'functions.update': zohocrmSchemaEntry('functions.update'),
	'globalPicklists.create': zohocrmSchemaEntry('globalPicklists.create'),
	'globalPicklists.delete': zohocrmSchemaEntry('globalPicklists.delete'),
	'globalPicklists.deleteMany': zohocrmSchemaEntry(
		'globalPicklists.deleteMany',
	),
	'globalPicklists.get': zohocrmSchemaEntry('globalPicklists.get'),
	'globalPicklists.getFieldAssociations': zohocrmSchemaEntry(
		'globalPicklists.getFieldAssociations',
	),
	'globalPicklists.getReplacedValues': zohocrmSchemaEntry(
		'globalPicklists.getReplacedValues',
	),
	'globalPicklists.getValueAssociations': zohocrmSchemaEntry(
		'globalPicklists.getValueAssociations',
	),
	'globalPicklists.list': zohocrmSchemaEntry('globalPicklists.list'),
	'globalPicklists.replaceValues': zohocrmSchemaEntry(
		'globalPicklists.replaceValues',
	),
	'globalPicklists.update': zohocrmSchemaEntry('globalPicklists.update'),
	'globalPicklists.updateMany': zohocrmSchemaEntry(
		'globalPicklists.updateMany',
	),
	'holidays.create': zohocrmSchemaEntry('holidays.create'),
	'holidays.delete': zohocrmSchemaEntry('holidays.delete'),
	'holidays.get': zohocrmSchemaEntry('holidays.get'),
	'holidays.list': zohocrmSchemaEntry('holidays.list'),
	'holidays.update': zohocrmSchemaEntry('holidays.update'),
	'holidays.updateMany': zohocrmSchemaEntry('holidays.updateMany'),
	'inventory.convert': zohocrmSchemaEntry('inventory.convert'),
	'inventoryTemplates.get': zohocrmSchemaEntry('inventoryTemplates.get'),
	'inventoryTemplates.list': zohocrmSchemaEntry('inventoryTemplates.list'),
	'kiosks.activate': zohocrmSchemaEntry('kiosks.activate'),
	'kiosks.clone': zohocrmSchemaEntry('kiosks.clone'),
	'kiosks.create': zohocrmSchemaEntry('kiosks.create'),
	'kiosks.deactivate': zohocrmSchemaEntry('kiosks.deactivate'),
	'kiosks.delete': zohocrmSchemaEntry('kiosks.delete'),
	'kiosks.deleteMany': zohocrmSchemaEntry('kiosks.deleteMany'),
	'kiosks.execute': zohocrmSchemaEntry('kiosks.execute'),
	'kiosks.executeState': zohocrmSchemaEntry('kiosks.executeState'),
	'kiosks.get': zohocrmSchemaEntry('kiosks.get'),
	'kiosks.getAssociations': zohocrmSchemaEntry('kiosks.getAssociations'),
	'kiosks.getCurrentRecordAssociations': zohocrmSchemaEntry(
		'kiosks.getCurrentRecordAssociations',
	),
	'kiosks.getExecution': zohocrmSchemaEntry('kiosks.getExecution'),
	'kiosks.getRecordSteps.create': zohocrmSchemaEntry(
		'kiosks.getRecordSteps.create',
	),
	'kiosks.getRecordSteps.delete': zohocrmSchemaEntry(
		'kiosks.getRecordSteps.delete',
	),
	'kiosks.getRecordSteps.get': zohocrmSchemaEntry('kiosks.getRecordSteps.get'),
	'kiosks.getRecordSteps.getAssociations': zohocrmSchemaEntry(
		'kiosks.getRecordSteps.getAssociations',
	),
	'kiosks.getRecordSteps.list': zohocrmSchemaEntry(
		'kiosks.getRecordSteps.list',
	),
	'kiosks.getRecordSteps.update': zohocrmSchemaEntry(
		'kiosks.getRecordSteps.update',
	),
	'kiosks.list': zohocrmSchemaEntry('kiosks.list'),
	'kiosks.listAssociations': zohocrmSchemaEntry('kiosks.listAssociations'),
	'kiosks.listExecutions': zohocrmSchemaEntry('kiosks.listExecutions'),
	'kiosks.preview': zohocrmSchemaEntry('kiosks.preview'),
	'kiosks.states.create': zohocrmSchemaEntry('kiosks.states.create'),
	'kiosks.states.delete': zohocrmSchemaEntry('kiosks.states.delete'),
	'kiosks.states.get': zohocrmSchemaEntry('kiosks.states.get'),
	'kiosks.states.list': zohocrmSchemaEntry('kiosks.states.list'),
	'kiosks.states.update': zohocrmSchemaEntry('kiosks.states.update'),
	'kiosks.testRun': zohocrmSchemaEntry('kiosks.testRun'),
	'kiosks.update': zohocrmSchemaEntry('kiosks.update'),
	'kiosks.updateAssociations': zohocrmSchemaEntry('kiosks.updateAssociations'),
	'layouts.activate': zohocrmSchemaEntry('layouts.activate'),
	'layouts.deactivate': zohocrmSchemaEntry('layouts.deactivate'),
	'layouts.delete': zohocrmSchemaEntry('layouts.delete'),
	'layouts.get': zohocrmSchemaEntry('layouts.get'),
	'layouts.list': zohocrmSchemaEntry('layouts.list'),
	'layouts.update': zohocrmSchemaEntry('layouts.update'),
	'leads.convert': zohocrmSchemaEntry('leads.convert'),
	'leads.getConversionOptions': zohocrmSchemaEntry(
		'leads.getConversionOptions',
	),
	'mailMerge.download': zohocrmSchemaEntry('mailMerge.download'),
	'mailMerge.send': zohocrmSchemaEntry('mailMerge.send'),
	'mailMerge.sign': zohocrmSchemaEntry('mailMerge.sign'),
	'mapDependencies.create': zohocrmSchemaEntry('mapDependencies.create'),
	'mapDependencies.delete': zohocrmSchemaEntry('mapDependencies.delete'),
	'mapDependencies.get': zohocrmSchemaEntry('mapDependencies.get'),
	'mapDependencies.list': zohocrmSchemaEntry('mapDependencies.list'),
	'mapDependencies.update': zohocrmSchemaEntry('mapDependencies.update'),
	'massActions.changeOwner': zohocrmSchemaEntry('massActions.changeOwner'),
	'massActions.convertLeads': zohocrmSchemaEntry('massActions.convertLeads'),
	'massActions.deleteRecords': zohocrmSchemaEntry('massActions.deleteRecords'),
	'massActions.deleteTags': zohocrmSchemaEntry('massActions.deleteTags'),
	'massActions.getChangeOwnerStatus': zohocrmSchemaEntry(
		'massActions.getChangeOwnerStatus',
	),
	'massActions.getConvertLeadsStatus': zohocrmSchemaEntry(
		'massActions.getConvertLeadsStatus',
	),
	'massActions.getDeleteRecordsStatus': zohocrmSchemaEntry(
		'massActions.getDeleteRecordsStatus',
	),
	'massActions.getDeleteTagsStatus': zohocrmSchemaEntry(
		'massActions.getDeleteTagsStatus',
	),
	'massActions.getUpdateRecordsStatus': zohocrmSchemaEntry(
		'massActions.getUpdateRecordsStatus',
	),
	'massActions.updateRecords': zohocrmSchemaEntry('massActions.updateRecords'),
	'meetings.cancel': zohocrmSchemaEntry('meetings.cancel'),
	'modules.create': zohocrmSchemaEntry('modules.create'),
	'modules.generateLink': zohocrmSchemaEntry('modules.generateLink'),
	'modules.get': zohocrmSchemaEntry('modules.get'),
	'modules.list': zohocrmSchemaEntry('modules.list'),
	'modules.update': zohocrmSchemaEntry('modules.update'),
	'modules.updateMany': zohocrmSchemaEntry('modules.updateMany'),
	'notes.create': zohocrmSchemaEntry('notes.create'),
	'notes.createForRecord': zohocrmSchemaEntry('notes.createForRecord'),
	'notes.delete': zohocrmSchemaEntry('notes.delete'),
	'notes.deleteForRecord': zohocrmSchemaEntry('notes.deleteForRecord'),
	'notes.deleteMany': zohocrmSchemaEntry('notes.deleteMany'),
	'notes.deleteManyForRecord': zohocrmSchemaEntry('notes.deleteManyForRecord'),
	'notes.get': zohocrmSchemaEntry('notes.get'),
	'notes.getForRecord': zohocrmSchemaEntry('notes.getForRecord'),
	'notes.list': zohocrmSchemaEntry('notes.list'),
	'notes.listForRecord': zohocrmSchemaEntry('notes.listForRecord'),
	'notes.update': zohocrmSchemaEntry('notes.update'),
	'notes.updateForRecord': zohocrmSchemaEntry('notes.updateForRecord'),
	'notes.updateMany': zohocrmSchemaEntry('notes.updateMany'),
	'notes.updateManyForRecord': zohocrmSchemaEntry('notes.updateManyForRecord'),
	'notifications.disable': zohocrmSchemaEntry('notifications.disable'),
	'notifications.enable': zohocrmSchemaEntry('notifications.enable'),
	'notifications.list': zohocrmSchemaEntry('notifications.list'),
	'notifications.update': zohocrmSchemaEntry('notifications.update'),
	'notifications.updateInfo': zohocrmSchemaEntry('notifications.updateInfo'),
	'org.deletePhoto': zohocrmSchemaEntry('org.deletePhoto'),
	'org.get': zohocrmSchemaEntry('org.get'),
	'org.getPhoto': zohocrmSchemaEntry('org.getPhoto'),
	'org.uploadPhoto': zohocrmSchemaEntry('org.uploadPhoto'),
	'picklistValues.delete': zohocrmSchemaEntry('picklistValues.delete'),
	'picklistValues.get': zohocrmSchemaEntry('picklistValues.get'),
	'picklistValues.list': zohocrmSchemaEntry('picklistValues.list'),
	'picklistValues.replace': zohocrmSchemaEntry('picklistValues.replace'),
	'pipelines.create': zohocrmSchemaEntry('pipelines.create'),
	'pipelines.get': zohocrmSchemaEntry('pipelines.get'),
	'pipelines.list': zohocrmSchemaEntry('pipelines.list'),
	'pipelines.replace': zohocrmSchemaEntry('pipelines.replace'),
	'pipelines.replaceMany': zohocrmSchemaEntry('pipelines.replaceMany'),
	'pipelines.transferAndDelete': zohocrmSchemaEntry(
		'pipelines.transferAndDelete',
	),
	'pipelines.update': zohocrmSchemaEntry('pipelines.update'),
	'pipelines.updateMany': zohocrmSchemaEntry('pipelines.updateMany'),
	'portals.create': zohocrmSchemaEntry('portals.create'),
	'portals.get': zohocrmSchemaEntry('portals.get'),
	'portals.list': zohocrmSchemaEntry('portals.list'),
	'portals.update': zohocrmSchemaEntry('portals.update'),
	'portals.userTypes.create': zohocrmSchemaEntry('portals.userTypes.create'),
	'portals.userTypes.delete': zohocrmSchemaEntry('portals.userTypes.delete'),
	'portals.userTypes.get': zohocrmSchemaEntry('portals.userTypes.get'),
	'portals.userTypes.list': zohocrmSchemaEntry('portals.userTypes.list'),
	'portals.userTypes.update': zohocrmSchemaEntry('portals.userTypes.update'),
	'portals.users.changeStatus': zohocrmSchemaEntry(
		'portals.users.changeStatus',
	),
	'portals.users.changeStatusMany': zohocrmSchemaEntry(
		'portals.users.changeStatusMany',
	),
	'portals.users.deleteMany': zohocrmSchemaEntry('portals.users.deleteMany'),
	'portals.users.getScheduledInviteInfo': zohocrmSchemaEntry(
		'portals.users.getScheduledInviteInfo',
	),
	'portals.users.invite': zohocrmSchemaEntry('portals.users.invite'),
	'portals.users.inviteMany': zohocrmSchemaEntry('portals.users.inviteMany'),
	'portals.users.list': zohocrmSchemaEntry('portals.users.list'),
	'portals.users.transfer': zohocrmSchemaEntry('portals.users.transfer'),
	'profiles.clone': zohocrmSchemaEntry('profiles.clone'),
	'profiles.delete': zohocrmSchemaEntry('profiles.delete'),
	'profiles.get': zohocrmSchemaEntry('profiles.get'),
	'profiles.list': zohocrmSchemaEntry('profiles.list'),
	'profiles.patch': zohocrmSchemaEntry('profiles.patch'),
	'profiles.update': zohocrmSchemaEntry('profiles.update'),
	'recordLocking.configurations.create': zohocrmSchemaEntry(
		'recordLocking.configurations.create',
	),
	'recordLocking.configurations.delete': zohocrmSchemaEntry(
		'recordLocking.configurations.delete',
	),
	'recordLocking.configurations.deleteMany': zohocrmSchemaEntry(
		'recordLocking.configurations.deleteMany',
	),
	'recordLocking.configurations.get': zohocrmSchemaEntry(
		'recordLocking.configurations.get',
	),
	'recordLocking.configurations.list': zohocrmSchemaEntry(
		'recordLocking.configurations.list',
	),
	'recordLocking.configurations.update': zohocrmSchemaEntry(
		'recordLocking.configurations.update',
	),
	'recordLocking.configurations.updateMany': zohocrmSchemaEntry(
		'recordLocking.configurations.updateMany',
	),
	'recordLocking.getLock': zohocrmSchemaEntry('recordLocking.getLock'),
	'recordLocking.listLocks': zohocrmSchemaEntry('recordLocking.listLocks'),
	'recordLocking.lock': zohocrmSchemaEntry('recordLocking.lock'),
	'recordLocking.unlock': zohocrmSchemaEntry('recordLocking.unlock'),
	'recordLocking.updateLock': zohocrmSchemaEntry('recordLocking.updateLock'),
	'recordSharing.list': zohocrmSchemaEntry('recordSharing.list'),
	'recordSharing.revokeAll': zohocrmSchemaEntry('recordSharing.revokeAll'),
	'recordSharing.share': zohocrmSchemaEntry('recordSharing.share'),
	'recordSharing.update': zohocrmSchemaEntry('recordSharing.update'),
	'records.changeOwner': zohocrmSchemaEntry('records.changeOwner'),
	'records.changeOwnerMany': zohocrmSchemaEntry('records.changeOwnerMany'),
	'records.clone': zohocrmSchemaEntry('records.clone'),
	'records.count': zohocrmSchemaEntry('records.count'),
	'records.create': zohocrmSchemaEntry('records.create'),
	'records.delete': zohocrmSchemaEntry('records.delete'),
	'records.deleteMany': zohocrmSchemaEntry('records.deleteMany'),
	'records.deletePhoto': zohocrmSchemaEntry('records.deletePhoto'),
	'records.get': zohocrmSchemaEntry('records.get'),
	'records.getFullData': zohocrmSchemaEntry('records.getFullData'),
	'records.getFullDataMany': zohocrmSchemaEntry('records.getFullDataMany'),
	'records.getMergeStatus': zohocrmSchemaEntry('records.getMergeStatus'),
	'records.getPhoto': zohocrmSchemaEntry('records.getPhoto'),
	'records.list': zohocrmSchemaEntry('records.list'),
	'records.listDeleted': zohocrmSchemaEntry('records.listDeleted'),
	'records.merge': zohocrmSchemaEntry('records.merge'),
	'records.search': zohocrmSchemaEntry('records.search'),
	'records.searchMany': zohocrmSchemaEntry('records.searchMany'),
	'records.update': zohocrmSchemaEntry('records.update'),
	'records.updateMany': zohocrmSchemaEntry('records.updateMany'),
	'records.uploadPhoto': zohocrmSchemaEntry('records.uploadPhoto'),
	'records.upsert': zohocrmSchemaEntry('records.upsert'),
	'recycleBin.count': zohocrmSchemaEntry('recycleBin.count'),
	'recycleBin.delete': zohocrmSchemaEntry('recycleBin.delete'),
	'recycleBin.deleteMany': zohocrmSchemaEntry('recycleBin.deleteMany'),
	'recycleBin.empty': zohocrmSchemaEntry('recycleBin.empty'),
	'recycleBin.get': zohocrmSchemaEntry('recycleBin.get'),
	'recycleBin.list': zohocrmSchemaEntry('recycleBin.list'),
	'recycleBin.restore': zohocrmSchemaEntry('recycleBin.restore'),
	'recycleBin.restoreMany': zohocrmSchemaEntry('recycleBin.restoreMany'),
	'relatedLists.list': zohocrmSchemaEntry('relatedLists.list'),
	'relatedRecords.count': zohocrmSchemaEntry('relatedRecords.count'),
	'relatedRecords.delink': zohocrmSchemaEntry('relatedRecords.delink'),
	'relatedRecords.delinkMany': zohocrmSchemaEntry('relatedRecords.delinkMany'),
	'relatedRecords.get': zohocrmSchemaEntry('relatedRecords.get'),
	'relatedRecords.list': zohocrmSchemaEntry('relatedRecords.list'),
	'relatedRecords.listDeleted': zohocrmSchemaEntry(
		'relatedRecords.listDeleted',
	),
	'relatedRecords.update': zohocrmSchemaEntry('relatedRecords.update'),
	'relatedRecords.updateMany': zohocrmSchemaEntry('relatedRecords.updateMany'),
	'roles.create': zohocrmSchemaEntry('roles.create'),
	'roles.delete': zohocrmSchemaEntry('roles.delete'),
	'roles.get': zohocrmSchemaEntry('roles.get'),
	'roles.list': zohocrmSchemaEntry('roles.list'),
	'roles.update': zohocrmSchemaEntry('roles.update'),
	'roles.updateMany': zohocrmSchemaEntry('roles.updateMany'),
	'scoringRules.activate': zohocrmSchemaEntry('scoringRules.activate'),
	'scoringRules.clone': zohocrmSchemaEntry('scoringRules.clone'),
	'scoringRules.create': zohocrmSchemaEntry('scoringRules.create'),
	'scoringRules.deactivate': zohocrmSchemaEntry('scoringRules.deactivate'),
	'scoringRules.delete': zohocrmSchemaEntry('scoringRules.delete'),
	'scoringRules.deleteMany': zohocrmSchemaEntry('scoringRules.deleteMany'),
	'scoringRules.get': zohocrmSchemaEntry('scoringRules.get'),
	'scoringRules.list': zohocrmSchemaEntry('scoringRules.list'),
	'scoringRules.update': zohocrmSchemaEntry('scoringRules.update'),
	'scoringRules.updateMany': zohocrmSchemaEntry('scoringRules.updateMany'),
	'servicePreferences.get': zohocrmSchemaEntry('servicePreferences.get'),
	'servicePreferences.update': zohocrmSchemaEntry('servicePreferences.update'),
	'services.create': zohocrmSchemaEntry('services.create'),
	'services.delete': zohocrmSchemaEntry('services.delete'),
	'services.deleteMany': zohocrmSchemaEntry('services.deleteMany'),
	'services.get': zohocrmSchemaEntry('services.get'),
	'services.list': zohocrmSchemaEntry('services.list'),
	'services.update': zohocrmSchemaEntry('services.update'),
	'services.updateMany': zohocrmSchemaEntry('services.updateMany'),
	'shiftHours.create': zohocrmSchemaEntry('shiftHours.create'),
	'shiftHours.delete': zohocrmSchemaEntry('shiftHours.delete'),
	'shiftHours.get': zohocrmSchemaEntry('shiftHours.get'),
	'shiftHours.list': zohocrmSchemaEntry('shiftHours.list'),
	'shiftHours.update': zohocrmSchemaEntry('shiftHours.update'),
	'shiftHours.updateMany': zohocrmSchemaEntry('shiftHours.updateMany'),
	'tags.addToRecord': zohocrmSchemaEntry('tags.addToRecord'),
	'tags.addToRecords': zohocrmSchemaEntry('tags.addToRecords'),
	'tags.create': zohocrmSchemaEntry('tags.create'),
	'tags.delete': zohocrmSchemaEntry('tags.delete'),
	'tags.getRecordsCount': zohocrmSchemaEntry('tags.getRecordsCount'),
	'tags.list': zohocrmSchemaEntry('tags.list'),
	'tags.merge': zohocrmSchemaEntry('tags.merge'),
	'tags.removeFromRecord': zohocrmSchemaEntry('tags.removeFromRecord'),
	'tags.removeFromRecords': zohocrmSchemaEntry('tags.removeFromRecords'),
	'tags.update': zohocrmSchemaEntry('tags.update'),
	'tags.updateMany': zohocrmSchemaEntry('tags.updateMany'),
	'territories.assignToRecord': zohocrmSchemaEntry(
		'territories.assignToRecord',
	),
	'territories.assignToRecords': zohocrmSchemaEntry(
		'territories.assignToRecords',
	),
	'territories.create': zohocrmSchemaEntry('territories.create'),
	'territories.delete': zohocrmSchemaEntry('territories.delete'),
	'territories.deleteMany': zohocrmSchemaEntry('territories.deleteMany'),
	'territories.get': zohocrmSchemaEntry('territories.get'),
	'territories.getAssociatedUsersCount': zohocrmSchemaEntry(
		'territories.getAssociatedUsersCount',
	),
	'territories.getScheduledRunRuleJobs': zohocrmSchemaEntry(
		'territories.getScheduledRunRuleJobs',
	),
	'territories.list': zohocrmSchemaEntry('territories.list'),
	'territories.listChildren': zohocrmSchemaEntry('territories.listChildren'),
	'territories.removeFromRecord': zohocrmSchemaEntry(
		'territories.removeFromRecord',
	),
	'territories.removeFromRecords': zohocrmSchemaEntry(
		'territories.removeFromRecords',
	),
	'territories.runRules': zohocrmSchemaEntry('territories.runRules'),
	'territories.transferAndDelete': zohocrmSchemaEntry(
		'territories.transferAndDelete',
	),
	'territories.transferAndDeleteMany': zohocrmSchemaEntry(
		'territories.transferAndDeleteMany',
	),
	'territories.update': zohocrmSchemaEntry('territories.update'),
	'territories.updateMany': zohocrmSchemaEntry('territories.updateMany'),
	'territories.users.associate': zohocrmSchemaEntry(
		'territories.users.associate',
	),
	'territories.users.associateMany': zohocrmSchemaEntry(
		'territories.users.associateMany',
	),
	'territories.users.deassociate': zohocrmSchemaEntry(
		'territories.users.deassociate',
	),
	'territories.users.deassociateMany': zohocrmSchemaEntry(
		'territories.users.deassociateMany',
	),
	'territories.users.get': zohocrmSchemaEntry('territories.users.get'),
	'territories.users.list': zohocrmSchemaEntry('territories.users.list'),
	'timelines.list': zohocrmSchemaEntry('timelines.list'),
	'unsubscribeLinks.create': zohocrmSchemaEntry('unsubscribeLinks.create'),
	'unsubscribeLinks.delete': zohocrmSchemaEntry('unsubscribeLinks.delete'),
	'unsubscribeLinks.get': zohocrmSchemaEntry('unsubscribeLinks.get'),
	'unsubscribeLinks.getAssociations': zohocrmSchemaEntry(
		'unsubscribeLinks.getAssociations',
	),
	'unsubscribeLinks.list': zohocrmSchemaEntry('unsubscribeLinks.list'),
	'unsubscribeLinks.update': zohocrmSchemaEntry('unsubscribeLinks.update'),
	'unsubscribeLinks.updateMany': zohocrmSchemaEntry(
		'unsubscribeLinks.updateMany',
	),
	'userGroups.create': zohocrmSchemaEntry('userGroups.create'),
	'userGroups.delete': zohocrmSchemaEntry('userGroups.delete'),
	'userGroups.get': zohocrmSchemaEntry('userGroups.get'),
	'userGroups.getAssociatedUsersCount': zohocrmSchemaEntry(
		'userGroups.getAssociatedUsersCount',
	),
	'userGroups.getAssociations': zohocrmSchemaEntry(
		'userGroups.getAssociations',
	),
	'userGroups.getSources': zohocrmSchemaEntry('userGroups.getSources'),
	'userGroups.getSourcesCount': zohocrmSchemaEntry(
		'userGroups.getSourcesCount',
	),
	'userGroups.list': zohocrmSchemaEntry('userGroups.list'),
	'userGroups.listForUser': zohocrmSchemaEntry('userGroups.listForUser'),
	'userGroups.update': zohocrmSchemaEntry('userGroups.update'),
	'users.create': zohocrmSchemaEntry('users.create'),
	'users.delete': zohocrmSchemaEntry('users.delete'),
	'users.get': zohocrmSchemaEntry('users.get'),
	'users.getTransferAndDeleteStatus': zohocrmSchemaEntry(
		'users.getTransferAndDeleteStatus',
	),
	'users.getTransferStatus': zohocrmSchemaEntry('users.getTransferStatus'),
	'users.list': zohocrmSchemaEntry('users.list'),
	'users.territories.associateMany': zohocrmSchemaEntry(
		'users.territories.associateMany',
	),
	'users.territories.get': zohocrmSchemaEntry('users.territories.get'),
	'users.territories.list': zohocrmSchemaEntry('users.territories.list'),
	'users.territories.remove': zohocrmSchemaEntry('users.territories.remove'),
	'users.territories.removeMany': zohocrmSchemaEntry(
		'users.territories.removeMany',
	),
	'users.transfer': zohocrmSchemaEntry('users.transfer'),
	'users.transferAndDelete': zohocrmSchemaEntry('users.transferAndDelete'),
	'users.transferAndDeleteMany': zohocrmSchemaEntry(
		'users.transferAndDeleteMany',
	),
	'users.update': zohocrmSchemaEntry('users.update'),
	'users.updateMany': zohocrmSchemaEntry('users.updateMany'),
	'users.validateBeforeTransfer': zohocrmSchemaEntry(
		'users.validateBeforeTransfer',
	),
	'variableGroups.generateApiName': zohocrmSchemaEntry(
		'variableGroups.generateApiName',
	),
	'variableGroups.get': zohocrmSchemaEntry('variableGroups.get'),
	'variableGroups.list': zohocrmSchemaEntry('variableGroups.list'),
	'variableGroups.update': zohocrmSchemaEntry('variableGroups.update'),
	'variableGroups.updateMany': zohocrmSchemaEntry('variableGroups.updateMany'),
	'variables.create': zohocrmSchemaEntry('variables.create'),
	'variables.delete': zohocrmSchemaEntry('variables.delete'),
	'variables.deleteMany': zohocrmSchemaEntry('variables.deleteMany'),
	'variables.generateApiName': zohocrmSchemaEntry('variables.generateApiName'),
	'variables.get': zohocrmSchemaEntry('variables.get'),
	'variables.getAssociations': zohocrmSchemaEntry('variables.getAssociations'),
	'variables.list': zohocrmSchemaEntry('variables.list'),
	'variables.update': zohocrmSchemaEntry('variables.update'),
	'variables.updateMany': zohocrmSchemaEntry('variables.updateMany'),
	'webforms.create': zohocrmSchemaEntry('webforms.create'),
	'webforms.delete': zohocrmSchemaEntry('webforms.delete'),
	'webforms.deleteMany': zohocrmSchemaEntry('webforms.deleteMany'),
	'webforms.get': zohocrmSchemaEntry('webforms.get'),
	'webforms.getAssociated': zohocrmSchemaEntry('webforms.getAssociated'),
	'webforms.getDiff': zohocrmSchemaEntry('webforms.getDiff'),
	'webforms.getPreview': zohocrmSchemaEntry('webforms.getPreview'),
	'webforms.getSuggestions': zohocrmSchemaEntry('webforms.getSuggestions'),
	'webforms.list': zohocrmSchemaEntry('webforms.list'),
	'webforms.update': zohocrmSchemaEntry('webforms.update'),
	'webforms.updateMany': zohocrmSchemaEntry('webforms.updateMany'),
	'webhooks.create': zohocrmSchemaEntry('webhooks.create'),
	'webhooks.delete': zohocrmSchemaEntry('webhooks.delete'),
	'webhooks.deleteMany': zohocrmSchemaEntry('webhooks.deleteMany'),
	'webhooks.get': zohocrmSchemaEntry('webhooks.get'),
	'webhooks.getAssociatedModules': zohocrmSchemaEntry(
		'webhooks.getAssociatedModules',
	),
	'webhooks.getFailures': zohocrmSchemaEntry('webhooks.getFailures'),
	'webhooks.getUsageReports': zohocrmSchemaEntry('webhooks.getUsageReports'),
	'webhooks.list': zohocrmSchemaEntry('webhooks.list'),
	'webhooks.update': zohocrmSchemaEntry('webhooks.update'),
	'webhooks.updateMany': zohocrmSchemaEntry('webhooks.updateMany'),
	'wizards.create': zohocrmSchemaEntry('wizards.create'),
	'wizards.delete': zohocrmSchemaEntry('wizards.delete'),
	'wizards.get': zohocrmSchemaEntry('wizards.get'),
	'wizards.list': zohocrmSchemaEntry('wizards.list'),
	'wizards.update': zohocrmSchemaEntry('wizards.update'),
	'workflowRules.create': zohocrmSchemaEntry('workflowRules.create'),
	'workflowRules.delete': zohocrmSchemaEntry('workflowRules.delete'),
	'workflowRules.deleteMany': zohocrmSchemaEntry('workflowRules.deleteMany'),
	'workflowRules.get': zohocrmSchemaEntry('workflowRules.get'),
	'workflowRules.getActionsCount': zohocrmSchemaEntry(
		'workflowRules.getActionsCount',
	),
	'workflowRules.getConfigurations': zohocrmSchemaEntry(
		'workflowRules.getConfigurations',
	),
	'workflowRules.getCount': zohocrmSchemaEntry('workflowRules.getCount'),
	'workflowRules.getModuleActionsCount': zohocrmSchemaEntry(
		'workflowRules.getModuleActionsCount',
	),
	'workflowRules.getUsage': zohocrmSchemaEntry('workflowRules.getUsage'),
	'workflowRules.list': zohocrmSchemaEntry('workflowRules.list'),
	'workflowRules.reorder': zohocrmSchemaEntry('workflowRules.reorder'),
	'workflowRules.update': zohocrmSchemaEntry('workflowRules.update'),
	'workflowRules.updateMany': zohocrmSchemaEntry('workflowRules.updateMany'),
	'workflowTasks.create': zohocrmSchemaEntry('workflowTasks.create'),
	'workflowTasks.delete': zohocrmSchemaEntry('workflowTasks.delete'),
	'workflowTasks.deleteMany': zohocrmSchemaEntry('workflowTasks.deleteMany'),
	'workflowTasks.get': zohocrmSchemaEntry('workflowTasks.get'),
	'workflowTasks.list': zohocrmSchemaEntry('workflowTasks.list'),
	'workflowTasks.update': zohocrmSchemaEntry('workflowTasks.update'),
	'workflowTasks.updateMany': zohocrmSchemaEntry('workflowTasks.updateMany'),
	'zia.enrichment.create': zohocrmSchemaEntry('zia.enrichment.create'),
	'zia.enrichment.delete': zohocrmSchemaEntry('zia.enrichment.delete'),
	'zia.enrichment.get': zohocrmSchemaEntry('zia.enrichment.get'),
	'zia.enrichment.list': zohocrmSchemaEntry('zia.enrichment.list'),
	'zia.enrichment.update': zohocrmSchemaEntry('zia.enrichment.update'),
	'zia.orgEnrichment.create': zohocrmSchemaEntry('zia.orgEnrichment.create'),
	'zia.orgEnrichment.get': zohocrmSchemaEntry('zia.orgEnrichment.get'),
	'zia.orgEnrichment.list': zohocrmSchemaEntry('zia.orgEnrichment.list'),
} satisfies RequiredPluginEndpointSchemas<typeof zohocrmEndpointsNested>;

export const zohocrmEndpointMeta = {
	'abTesting.checkLaunchSuggestions': {
		riskLevel: 'read',
		description:
			'Retrieve launch suggestions for an AB Testing configuration. To retrieve Zia AI launch suggestions for a Webform A/B Testing configuration in your Zoho CRM organization, indicating whether the test is ready to launch based on conversion rate analysis.',
	},
	'abTesting.create': {
		riskLevel: 'write',
		description:
			'Create AB testing configuration. To create a Webform A/B Test in your Zoho CRM organization. Webform A/B testing lets you run an experiment where two or more variations of a webform are shown to different segments of your website visitors, so you can compare their performance and identify the version that delivers the best…',
	},
	'abTesting.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an A/B Testing configuration by ID. To delete a Webform A/B Testing configuration by its unique ID from your Zoho CRM organization. Notes: - Deleting an A/B test is permanent. The test configuration and all metrics collected for it are removed and cannot be recovered. Cannot be undone.',
	},
	'abTesting.get': {
		riskLevel: 'read',
		description:
			'Get AB Testing configuration by ID. To retrieve the details of a specific AB Testing configuration by ID in your Zoho CRM organization.',
	},
	'abTesting.getPreview': {
		riskLevel: 'read',
		description:
			'Get AB Testing form preview. To retrieve the HTML preview details of the base form and variant forms configured for a specific Webform A/B Testing in your Zoho CRM organization.',
	},
	'abTesting.getSuggestions': {
		riskLevel: 'read',
		description:
			'Get AB testing optimization suggestions. To retrieve optimization suggestions for a specific AB test configuration in your Zoho CRM organization, based on the current performance of the base form and variant forms.',
	},
	'abTesting.getVisitors': {
		riskLevel: 'read',
		description:
			'Get visitor metrics for a specific Webform A/B Testing. To retrieve the visitor metrics of a specific Webform A/B Testing configuration in your Zoho CRM organization, including the total visitor count, test start time, and number of days elapsed.',
	},
	'abTesting.list': {
		riskLevel: 'read',
		description:
			'List Webform A/B Testing configurations. To retrieve all Webform A/B Testing configurations created in your Zoho CRM organization. You can optionally filter the results by module or by the ID of a base webform.',
	},
	'abTesting.listVisitors': {
		riskLevel: 'read',
		description:
			'Get A/B testing visitor counts. To retrieve the visitor count of Webform A/B Testing configurations in your Zoho CRM organization, including all tests that are currently running as well as completed ones.',
	},
	'abTesting.update': {
		riskLevel: 'write',
		description:
			'Update AB testing configuration by ID. To update the configuration of an existing Webform A/B testing in your Zoho CRM organization.',
	},
	'apis.list': {
		riskLevel: 'read',
		description:
			'List available REST APIs. To retrieve the list of available REST API endpoints in your Zoho CRM organization for a specific API version. You can filter the results by module, OAuth scope, or request method using the filters parameter.',
	},
	'appointmentPreferences.get': {
		riskLevel: 'read',
		description:
			'Get Appointment Preferences. Fetches the existing configuration for appointment preferences, including rules for deal creation, job sheet visibility, and mark as complete configurations.',
	},
	'appointmentPreferences.update': {
		riskLevel: 'write',
		description:
			'Update Appointment Preferences. To update the appointment preference settings in your Zoho CRM organization, including booking constraints, job sheet requirements, deal creation configuration, and record-sharing settings.',
	},
	'appointments.create': {
		riskLevel: 'write',
		description:
			'Create Appointment records. To create one or more appointment records in your Zoho CRM organization.',
	},
	'appointments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an Appointment by ID. To delete a single appointment record from your Zoho CRM organization by its unique ID. Note that this operation will not delete any deals created upon completion of the appointment. Cannot be undone.',
	},
	'appointments.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete one or more appointment records. To delete one or more appointment records in your Zoho CRM organization. Note that this API will not delete any deals created on the completion of the deleted appointments. Cannot be undone.',
	},
	'appointments.get': {
		riskLevel: 'read',
		description:
			'Get an Appointment Record by ID. To retrieve the details of a single appointment record from your Zoho CRM organization.',
	},
	'appointments.list': {
		riskLevel: 'read',
		description:
			'Get Appointment Records. To retrieve appointment records from your Zoho CRM organization. Use the page and per_page parameters to paginate up to 2,000 records, or use the page_token received in a prior response to paginate beyond 2,000 records up to a maximum of 100,000. Each request returns a maximum of 200 records.',
	},
	'appointments.update': {
		riskLevel: 'write',
		description:
			'Update an Appointment Record by ID. To update a single appointment record by its ID in your Zoho CRM organization.',
	},
	'appointments.updateMany': {
		riskLevel: 'write',
		description:
			'Update appointment records. To update one or more appointment records in your Zoho CRM organization. You can update a maximum of 100 appointments per API call.',
	},
	'approvalProcesses.clone': {
		riskLevel: 'write',
		description:
			'Clone Approval Process. To clone an existing Approval Process in your Zoho CRM organization, use this endpoint to create a new Approval Process that inherits the same configuration as the original.',
	},
	'approvalProcesses.create': {
		riskLevel: 'write',
		description:
			'Create Approval Process. To create an Approval Process in your Zoho CRM organization.',
	},
	'approvalProcesses.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an Approval Process. To delete a single Approval Process from your Zoho CRM organization using its unique ID. Cannot be undone.',
	},
	'approvalProcesses.get': {
		riskLevel: 'read',
		description:
			'Get a single Approval Process. To retrieve the full configuration details of a single Approval Process in your Zoho CRM organization by its unique identifier. The response includes the process name, associated module, active status, execution trigger, and the complete list of approval rules defined for the Approval Process.',
	},
	'approvalProcesses.getCount': {
		riskLevel: 'read',
		description:
			'Retrieve the count of approval processes for a module. To retrieve the total, active, and inactive counts of approval processes configured for a specific module in your Zoho CRM organization.',
	},
	'approvalProcesses.getProcessConfigurations': {
		riskLevel: 'read',
		description:
			'Retrieve the Approval Process configuration limits. To retrieve the configuration limits for approval processes in your Zoho CRM organization.',
	},
	'approvalProcesses.getRule': {
		riskLevel: 'read',
		description:
			'Retrieve an Approval Process Rule. To retrieve the configuration of a specific rule within an Approval Process. The response includes the rule name, sequence number, overall approval type, entry criteria, approver stages, process admin configuration, and the actions defined for final approval and rejection.',
	},
	'approvalProcesses.list': {
		riskLevel: 'read',
		description:
			"Get Approval Processes. To get the list of Approval Processes configured in your Zoho CRM organization, including each process's details such as name, module, execution trigger, approval type, active status, and rules with stages and approver configuration, along with pagination info.",
	},
	'approvalProcesses.listRules': {
		riskLevel: 'read',
		description:
			'Get rules for an Approval Process. To retrieve the rules associated with a specific Approval Process in your Zoho CRM organization.',
	},
	'approvalProcesses.reorder': {
		riskLevel: 'write',
		description:
			'Reorder the execution sequence of approval processes. To reorder the execution sequence of approval processes for a specific module in Zoho CRM. Specify the approval process IDs in the desired sequence. The system updates the execution order of the approval processes for that module.',
	},
	'approvalProcesses.reorderRules': {
		riskLevel: 'write',
		description:
			'Reorder the rules of an Approval Process. To update the sequence of rules within one Approval Process, reorder the rules by assigning new sequence numbers to each rule ID in your Zoho CRM organization.',
	},
	'approvalProcesses.update': {
		riskLevel: 'write',
		description:
			'Update Approval Process. To update the configuration of a single Approval Process in your Zoho CRM organization.',
	},
	'approvalProcesses.updateMany': {
		riskLevel: 'write',
		description:
			'Update Approval Process. To update the configuration of an existing approval process in your Zoho CRM organization.',
	},
	'assignmentRules.clone': {
		riskLevel: 'write',
		description:
			'Clone Assignment Rule. To clone a single Assignment Rule in your Zoho CRM organization.',
	},
	'assignmentRules.cloneEntries': {
		riskLevel: 'write',
		description:
			'Clone Assignment Rule Entries. To clone rule entries for a single Assignment Rule in your Zoho CRM organization.',
	},
	'assignmentRules.create': {
		riskLevel: 'write',
		description:
			'Create an Assignment Rule. To create a single Assignment Rule in your Zoho CRM organization.',
	},
	'assignmentRules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an Assignment Rule. To delete a single Assignment Rule from your Zoho CRM organization. Cannot be undone.',
	},
	'assignmentRules.get': {
		riskLevel: 'read',
		description:
			'Specific Assignment Rule details. To retrieve the details of a single Assignment Rule in your Zoho CRM organization.',
	},
	'assignmentRules.getAssociations': {
		riskLevel: 'read',
		description:
			'Assignment Rule Associations. To retrieve the CRM features associated with a single Assignment Rule in your Zoho CRM organization.',
	},
	'assignmentRules.getCount': {
		riskLevel: 'read',
		description:
			'Assignment Rules Count. To retrieve the count of Assignment Rules configured for a module in your Zoho CRM organization.',
	},
	'assignmentRules.list': {
		riskLevel: 'read',
		description:
			'Assignment Rules. To retrieve all Assignment Rules configured in your Zoho CRM organization.',
	},
	'assignmentRules.reorderEntries': {
		riskLevel: 'write',
		description:
			'Reorder Assignment Rule entries. To reorder rule entries for a single Assignment Rule in your Zoho CRM organization.',
	},
	'assignmentRules.update': {
		riskLevel: 'write',
		description:
			'Update a Specific Assignment Rule. To update a single Assignment Rule in your Zoho CRM organization.',
	},
	'attachments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Link Attachment. Deletes a link attachment associated with a specific record in a module. Note that only link attachments can be deleted using this endpoint; file attachments cannot be deleted through this API. Cannot be undone.',
	},
	'attachments.get': {
		riskLevel: 'read',
		description:
			'Download a specific attachment file. Download the file content of a specific attachment by its ID. This endpoint returns the actual file (image, PDF, document, etc.). Returns an error for link attachments, as they cannot be downloaded.',
	},
	'attachments.list': {
		riskLevel: 'read',
		description:
			'Retrieve All Attachments. Retrieves all attachments associated with a specific record in a module.',
	},
	'attachments.upload': {
		riskLevel: 'write',
		description:
			'Upload an Attachment. Uploads an attachment by providing either a file or a valid URL. Maximum request body size: 100MB.',
	},
	'auditLogExports.create': {
		riskLevel: 'write',
		description:
			'Create an audit log export job. To create an asynchronous audit log export job in your Zoho CRM organization. The system schedules the job and returns a unique job ID with a SCHEDULED status code. Use theGet Audit Log Export API to poll for completion and retrieve the download links.',
	},
	'auditLogExports.get': {
		riskLevel: 'read',
		description:
			'Get the Status of the Export Audit Log Job. Retrieves the details of a specific audit log export job in your Zoho CRM organization by its ID, including its status, filter criteria, and download link(s).',
	},
	'auditLogExports.list': {
		riskLevel: 'read',
		description:
			'Get audit log export jobs. To retrieve the list of all audit log export jobs in your Zoho CRM organization, along with their status, filter criteria, and download links.',
	},
	'automationFunctions.create': {
		riskLevel: 'write',
		description:
			'Create Automation Function. To create a custom automation function in your Zoho CRM organization.',
	},
	'automationFunctions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Automation Function. To delete an automation function from your Zoho CRM organization. Cannot be undone.',
	},
	'automationFunctions.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Functions. To delete one or more automation functions from your Zoho CRM organization. Cannot be undone.',
	},
	'automationFunctions.get': {
		riskLevel: 'read',
		description:
			'Get Automation Function. To retrieve the details of a specific automation function in your Zoho CRM organization.',
	},
	'automationFunctions.getAssociatedModules': {
		riskLevel: 'read',
		description:
			'Get Associated Modules for Automation Functions. To retrieve the list of modules associated with automation functions in your Zoho CRM organization.',
	},
	'automationFunctions.list': {
		riskLevel: 'read',
		description:
			'Get Automation Functions. To retrieve all automation functions configured in your Zoho CRM organization.',
	},
	'automationFunctions.update': {
		riskLevel: 'write',
		description:
			'Update Automation Function. To update an automation function configuration in your Zoho CRM organization.',
	},
	'automationFunctions.updateMany': {
		riskLevel: 'write',
		description:
			'Update Automation Function. To update an automation function in your Zoho CRM organization.',
	},
	'blueprints.activate': {
		riskLevel: 'write',
		description:
			'Activate Blueprint. To publish a blueprint draft, republish a blueprint draft, or activate a previously deactivated blueprint in your Zoho CRM organization.',
	},
	'blueprints.clone': {
		riskLevel: 'write',
		description:
			'Clone Blueprint. To clone a Blueprint in your Zoho CRM organization.',
	},
	'blueprints.create': {
		riskLevel: 'write',
		description:
			'Create a Blueprint. To create a Blueprint with states and transitions for a module in your Zoho CRM organization. After creating the Blueprint, you must update each transition to set its modified time, which the user interface requires.',
	},
	'blueprints.deactivate': {
		riskLevel: 'write',
		description:
			'Deactivate Blueprint. To deactivate a published blueprint in your Zoho CRM organization.',
	},
	'blueprints.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Blueprint. Delete a specific blueprint by its blueprintId. Cannot be undone.',
	},
	'blueprints.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete one or more Blueprints. To delete one or more Blueprints from your Zoho CRM organization. When multiple Blueprint IDs are passed, if some deletions succeed and others fail, the API responds with 207 Multi-Status. Check the status key in each response item to see the result of each deletion. Cannot be undone.',
	},
	'blueprints.get': {
		riskLevel: 'read',
		description:
			'Get details of a Blueprint by ID. To get the details of a single Blueprint by its unique identifier in your Zoho CRM organization, send a GET request with the target Blueprint ID.',
	},
	'blueprints.getForRecord': {
		riskLevel: 'read',
		description:
			'Get Blueprint transitions of a record. To get the next available Blueprint transitions for a record in Zoho CRM, along with the fields available for each transition, the current value of each field, and their validations, if any.',
	},
	'blueprints.getProcessConfigurations': {
		riskLevel: 'read',
		description:
			'Blueprints Process Configurations. To retrieve the metadata of the Blueprint process configuration in your Zoho CRM organization, such as the number of configured Blueprints, the supported features and their limits, and the supported owner models.',
	},
	'blueprints.getRecordsCount': {
		riskLevel: 'read',
		description:
			'Retrieve Blueprint stage record counts. To retrieve the number of records at each Blueprint stage for a specific Blueprint in your Zoho CRM organization.',
	},
	'blueprints.getUsageConfigurations': {
		riskLevel: 'read',
		description:
			'Get blueprint usage configurations. To retrieve the configuration details required to configure a blueprint for a specific module in your Zoho CRM organization.',
	},
	'blueprints.list': {
		riskLevel: 'read',
		description:
			'Get blueprints. To retrieve the list of blueprints configured in your Zoho CRM organization.',
	},
	'blueprints.reorder': {
		riskLevel: 'write',
		description:
			'Reorder Blueprints within a module. To update the display order of Blueprints within a Zoho CRM module, submit a list of Blueprint entries each specifying an ID and the desired sequence_number.',
	},
	'blueprints.states.create': {
		riskLevel: 'write',
		description:
			'Create Blueprint States. To create one or more states for a Blueprint in your Zoho CRM organization.',
	},
	'blueprints.states.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a Blueprint state. To delete a single state from a Blueprint in your Zoho CRM organization. Cannot be undone.',
	},
	'blueprints.states.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Blueprint States. To delete one or more states from a Blueprint in your Zoho CRM organization. Cannot be undone.',
	},
	'blueprints.states.get': {
		riskLevel: 'read',
		description:
			'Get a Blueprint state by ID. To retrieve the details of a single Blueprint state in your Zoho CRM organization.',
	},
	'blueprints.states.list': {
		riskLevel: 'read',
		description:
			'Get Blueprint States. To retrieve the states associated with a specific Blueprint in your Zoho CRM organization.',
	},
	'blueprints.states.update': {
		riskLevel: 'write',
		description:
			'Update a Blueprint state by ID. To update a single state within a Blueprint in your Zoho CRM organization.',
	},
	'blueprints.states.updateMany': {
		riskLevel: 'write',
		description:
			'Update Blueprint States. To update Blueprint states within a specified Blueprint in your Zoho CRM organization. Actions used in state escalations must be created with feature_type set to blueprint_state; actions created with feature_type set to blueprint_transition cannot be used in state escalation contexts.',
	},
	'blueprints.transitionRecord': {
		riskLevel: 'write',
		description:
			'Update a single Blueprint transition for a record. To update a single Blueprint transition for a record in your Zoho CRM organization.',
	},
	'blueprints.transitions.create': {
		riskLevel: 'write',
		description:
			'Create Blueprint transitions. To create one or more Blueprint transitions for an existing Blueprint in your Zoho CRM organization.',
	},
	'blueprints.transitions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Blueprint Transition. This is a new API to delete single transitions in a single API. Cannot be undone.',
	},
	'blueprints.transitions.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Blueprint Transitions. Delete multiple blueprint transitions by IDs in the request body. Cannot be undone.',
	},
	'blueprints.transitions.get': {
		riskLevel: 'read',
		description:
			'Get Blueprint transition. To retrieve the configuration details of a single Blueprint transition by its transition ID in your Zoho CRM organization. The response contains a transitions array with one Blueprint Transition Record, including its process ID, during inputs, owners, criteria, and actions.',
	},
	'blueprints.transitions.list': {
		riskLevel: 'read',
		description:
			'Retrieve Blueprint transitions by their IDs. To retrieve the details of the Blueprint transitions that match the specified transition IDs in your Zoho CRM organization.',
	},
	'blueprints.transitions.update': {
		riskLevel: 'write',
		description:
			'Update a Blueprint transition. To update a single Blueprint transition in Zoho CRM. Prerequisite: Call this API for every transition after Blueprint creation to set the modified_time, which the UI requires to render transitions correctly.',
	},
	'blueprints.transitions.updateMany': {
		riskLevel: 'write',
		description:
			"Blueprint Transitions. Update multiple blueprint transitions in bulk. CRITICAL BEHAVIORS: (1) 'layout' is REQUIRED in each transition entry whenever 'during_inputs' are included. omitting it causes INVALID_DATA: Invalid field details with a misleading reference to during_inputs[0]. (2) 'during_inputs' are ADDITIVE.",
	},
	'blueprints.update': {
		riskLevel: 'write',
		description:
			'Update a single Blueprint by ID. Updates a specific Blueprint configuration in your Zoho CRM organization by specifying its unique Blueprint ID in the request URL. This operation applies only to blueprints that have never been activated. If the Blueprint has been activated, the operation returns a NOT_ALLOWED error.',
	},
	'blueprints.updateMany': {
		riskLevel: 'write',
		description:
			'Update Blueprints. To update bulk Blueprint configurations. Each Blueprint in the blueprints array is replaced with the submitted definition. Use the Get Blueprint by ID API to retrieve the Blueprint ID. If the ID is not included in the URL, then it is mandatory to specify the ID in the request body.',
	},
	'bulkRead.createJob': {
		riskLevel: 'write',
		description:
			'Create a bulk read job. To create a bulk read job in Zoho CRM. A bulk read job exports records from a specified CRM module to a CSV or ICS file.',
	},
	'bulkRead.downloadResult': {
		riskLevel: 'read',
		description:
			"Download bulk read result. To download the exported records from a completed bulk read job in Zoho CRM. This API returns a ZIP archive containing the CSV or ICS file with the exported records. The bulk read job must have a COMPLETED state before you can download the result. Returns the job's zip of CSV files.",
	},
	'bulkRead.getJob': {
		riskLevel: 'read',
		description:
			'Get bulk read job details. To retrieve the details of a bulk read job in Zoho CRM. Use this API to check the current state of a bulk read job and obtain the download URL once the job is complete. Specify the unique job ID that Zoho CRM returned when you created the job.',
	},
	'bulkWrite.createJob': {
		riskLevel: 'write',
		description:
			'Create a bulk write job. To create a bulk write job in your Zoho CRM organization that creates, updates, or upserts records in a target module from a previously uploaded file.',
	},
	'bulkWrite.getJob': {
		riskLevel: 'read',
		description:
			'Get bulk write job details. To retrieve the details of a previously created bulk write job in your Zoho CRM organization, including its current status, per-resource and per-file processing counts, the creator, and the download URL of the result archive once the job completes.',
	},
	'bulkWrite.uploadFile': {
		riskLevel: 'write',
		description:
			'Upload a file to CRM. To upload a CSV file in ZIP format for bulk write API. The response contains the file_id. Use this ID while making the bulk write request. Goes to Zoho\'s upload host (upload.zoho.<dc>). Needs the org id (crmOrgId, from org.get: zgid) and feature "bulk-write". The file is a CSV, or a zip of one.',
	},
	'businessHours.create': {
		riskLevel: 'write',
		description:
			'Business Hours Configuration. Creates a new business hours configuration for the organization, defining working days, operating hours, and timezone settings.',
	},
	'businessHours.get': {
		riskLevel: 'read',
		description:
			'Business Hours Configuration. Retrieves the current business hours configuration, including working days, operating hours, and timezone details.',
	},
	'businessHours.update': {
		riskLevel: 'write',
		description:
			'Business Hours Configuration. Updates the existing business hours configuration with revised working days, operating hours, or timezone settings.',
	},
	'cadences.activate': {
		riskLevel: 'write',
		description:
			'Activate Cadence. Activates a published cadence so it begins enrolling records. The cadence must currently be inactive; otherwise, the ALREADY_ACTIVATED error is returned. Edition limits are enforced, including the maximum number of active cadences per module and the total number of active cadences.',
	},
	'cadences.clone': {
		riskLevel: 'write',
		description:
			'Clone a Cadence. Creates a new cadence with the same follow-up tree as the source cadence (identified by path id) but with the name / description / custom_view supplied in the body. Every follow-up action is copied into a new action record - the clone has no shared rows with the source.',
	},
	'cadences.create': {
		riskLevel: 'write',
		description:
			'Create cadence. Creates a new cadence (initially in draft status) with its follow-up tree and optional un-enrollment rules in a single call. custom_view cadences require a custom_view.id; manual_enrollment cadences must omit custom_view.',
	},
	'cadences.deactivate': {
		riskLevel: 'write',
		description:
			'Deactivate a Cadence. To deactivate a Cadence in your Zoho CRM organization. The Cadence must currently be active; attempting to deactivate an already inactive Cadence returns the ALREADY_DEACTIVATED error.',
	},
	'cadences.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a Cadence. To delete a Cadence and its associated records from your Zoho CRM organization. Deleting a Cadence removes all related action records, including workflow tasks, email notifications, and WhatsApp notifications, as well as process states and flow transitions. Cannot be undone.',
	},
	'cadences.enrollRecords': {
		riskLevel: 'destructive',
		description:
			"Enroll Records to Cadences. Enrolls CRM records into one or more cadences. Notes - Only Manual Enrollment cadences can be enrolled through this API. - Available only in Enterprise edition and above. - Supports Leads, Contacts, Deals, Vendors, and custom modules. - A request may contain up to 5 cadence IDs. Enrolled records start receiving the cadence's follow-up emails and tasks.",
	},
	'cadences.get': {
		riskLevel: 'read',
		description:
			'Get a Cadence. To retrieve the configuration and details of a specific Cadence from your Zoho CRM organization. The response includes the follow-up action tree with server-resolved parent follow-up IDs, unenroll properties, Custom View configuration, and the current Cadence status.',
	},
	'cadences.getAnalytics': {
		riskLevel: 'read',
		description:
			'Get Cadence analytics. To retrieve per-follow-up execution statistics for the specified Cadence in your Zoho CRM organization.',
	},
	'cadences.getModuleActionsCount': {
		riskLevel: 'read',
		description:
			'Get Cadence module actions count. To retrieve the total number of follow-up actions configured for the specified CRM module across all Cadences in your Zoho CRM organization. The count includes tasks, emails, calls, and WhatsApp messages, and is used to enforce the edition-level per-module action count limit.',
	},
	'cadences.getRecordsCount': {
		riskLevel: 'read',
		description:
			'Get Cadence records count. To retrieve the record counts for the specified Cadences from your Zoho CRM organization. For each Cadence ID supplied in the ids query parameter, the response returns the number of records currently associated with that Cadence. A maximum of 100 Cadence IDs can be supplied per request.',
	},
	'cadences.list': {
		riskLevel: 'read',
		description:
			'List Cadences. To retrieve the list of Cadences in your Zoho CRM organization.',
	},
	'cadences.publish': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Publish a Cadence. Publishes a draft cadence by merging its follow-up tree, transitions, and triggers into the live cadence, and then clears the draft. If the cadence is being published for the first time, it is promoted from a draft to an inactive published cadence.',
	},
	'cadences.unenrollRecords': {
		riskLevel: 'write',
		description:
			'Un-enroll Records from Cadences. To manually unenroll records of a supported module from one or more Cadences in your Zoho CRM organization.',
	},
	'cadences.update': {
		riskLevel: 'write',
		description:
			'Cadence. Partial-update form that takes the cadence id from the URL path. Same body shape and semantics as the bulk PUT variant (see PUT /settings/automation/cadences). module / type / custom_view cannot be changed after creation.',
	},
	'cadences.updateMany': {
		riskLevel: 'write',
		description:
			'Update multiple Cadences (bulk form). Partial-update form that takes the cadence id inside the request body (cadences[0].id). Updates only the provided fields; module / type / custom_view cannot be changed after creation. Editing a currently-published cadence creates a draft on the first save.',
	},
	'callPreferences.get': {
		riskLevel: 'read',
		description:
			'Call Preferences. To retrieve the current Call Preferences configuration for your Zoho CRM organization. The response reports whether the From Number and To Number fields are currently enabled on records in the Calls module.',
	},
	'callPreferences.update': {
		riskLevel: 'write',
		description:
			'Call Preferences. To update the Call Preferences configuration for your Zoho CRM organization by enabling or disabling the From Number and To Number fields on records in the Calls module.',
	},
	'compositeRequests.execute': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Process multiple API requests in a single call. To bundle multiple Zoho CRM API requests into a single HTTP call, reducing network round-trips and enabling request chaining. You can reference the output of one sub-request in another using the format @{sub_request_id:JSONPath} to build dependent workflows. Runs up to five API calls in one request, writes and deletes included.',
	},
	'contactRoles.create': {
		riskLevel: 'write',
		description:
			'Create Contact Roles. Creates one or more contact roles in your Zoho CRM organization.',
	},
	'contactRoles.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a Contact Role. Deletes a specific contact role by its unique identifier in your Zoho CRM organization. Cannot be undone.',
	},
	'contactRoles.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Contact Roles. Deletes one or more contact roles by their unique identifiers in your Zoho CRM organization. Cannot be undone.',
	},
	'contactRoles.get': {
		riskLevel: 'read',
		description:
			'Get a Contact Role. Retrieves the details of a specific contact role by its unique identifier in your Zoho CRM organization.',
	},
	'contactRoles.list': {
		riskLevel: 'read',
		description:
			'List Contact Roles. Retrieves the list of contact roles available in your Zoho CRM organization.',
	},
	'contactRoles.update': {
		riskLevel: 'write',
		description:
			'Update a Contact Role. Updates a specific contact role by its unique identifier in your Zoho CRM organization.',
	},
	'contactRoles.updateMany': {
		riskLevel: 'write',
		description:
			'Update Contact Roles. Updates the properties of one or more existing contact roles in your Zoho CRM organization.',
	},
	'coql.query': {
		riskLevel: 'read',
		description:
			'Retrieve records using a COQL query. To retrieve records from one or more Zoho CRM modules using a COQL SELECT query, with support for cross-module joins, aggregate functions, and flexible filtering. select_query is a COQL statement such as "select Last_Name from Leads where Last_Name is not null limit 10". Every WHERE clause needs at least one condition.',
	},
	'currencies.create': {
		riskLevel: 'write',
		description:
			'Create currencies. Creates one or more new currencies for the organization.',
	},
	'currencies.enableMultiCurrency': {
		riskLevel: 'write',
		description:
			'Enable multi-currency. for the organization and set the base currency.',
	},
	'currencies.get': {
		riskLevel: 'read',
		description:
			'Specific Currency. Retrieves details of a specific currency via its unique currency ID.',
	},
	'currencies.list': {
		riskLevel: 'read',
		description:
			'List currencies. Retrieves all added currencies in the organization.',
	},
	'currencies.update': {
		riskLevel: 'write',
		description: 'Currency. Update a specific currency by its unique ID.',
	},
	'currencies.updateBase': {
		riskLevel: 'write',
		description: 'Update base currency. Update existing base currency details.',
	},
	'currencies.updateMany': {
		riskLevel: 'write',
		description:
			'Update currencies. Updates one or more currencies other than the base currency.',
	},
	'customViews.changeSort': {
		riskLevel: 'write',
		description:
			'Sort Order by ID. To change the sort field and sort order for a specific Custom View in the specified module of your Zoho CRM organization. Use the Get Custom Views Metadata API to retrieve the custom view IDs.".',
	},
	'customViews.changeSortMany': {
		riskLevel: 'write',
		description:
			'Sort Order. To change the sort field and sort order for one or more Custom Views in the specified module of your Zoho CRM organization.',
	},
	'customViews.create': {
		riskLevel: 'write',
		description:
			'CustomView creation. To create one or more Custom Views for a specified module in your Zoho CRM organization.',
	},
	'customViews.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Custom Views. To delete one or more Custom Views from a specified module in your Zoho CRM organization. Cannot be undone.',
	},
	'customViews.get': {
		riskLevel: 'read',
		description:
			'Get Custom View By Id. To retrieve the details of a specific Custom View for a module in your Zoho CRM organization, using the Custom View ID.',
	},
	'customViews.list': {
		riskLevel: 'read',
		description:
			'Get All Custom Views. To retrieve the list of all Custom Views configured for a specified module in your Zoho CRM organization.',
	},
	'customViews.update': {
		riskLevel: 'write',
		description:
			'CustomView update. To update the configuration of a specific Custom View in a module of your Zoho CRM organization, using the Custom View ID. Use the Get Custom Views API to retrieve the custom view IDs.',
	},
	'customViews.updateMany': {
		riskLevel: 'write',
		description:
			'Custom Views. To update the configuration of one or more Custom Views in bulk for a specified module in your Zoho CRM organization.',
	},
	'dataSharing.get': {
		riskLevel: 'read',
		description:
			"Data Sharing Settings. To retrieve your organization's default data-sharing permissions for modules.",
	},
	'dataSharing.update': {
		riskLevel: 'write',
		description:
			"Data Sharing Settings. To update your organization's default data-sharing permissions for modules. You can modify data-sharing access for both system-defined and custom modules.",
	},
	'dealContactRoles.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deal Contact Roles. Remove a specific contact-deal relation using the contact identifier in the path. Cannot be undone.',
	},
	'dealContactRoles.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deal Contact Roles. Remove one or more contact role associations from a deal using their relation IDs. Cannot be undone.',
	},
	'dealContactRoles.get': {
		riskLevel: 'read',
		description:
			'Deal Contact Roles. Retrieves the contact role relation for a specific contact associated with a deal.',
	},
	'dealContactRoles.list': {
		riskLevel: 'read',
		description:
			'Deal Contact Roles. Retrieve contact roles associated with a deal.',
	},
	'dealContactRoles.upsert': {
		riskLevel: 'write',
		description:
			'Deal Contact Roles. Assign or update a contact role for a specific contact on a deal.',
	},
	'dealContactRoles.upsertMany': {
		riskLevel: 'write',
		description:
			'Deal Contact Roles. Add contact roles to a deal or update existing contact role relations in bulk.',
	},
	'duplicateCheckPreferences.create': {
		riskLevel: 'write',
		description:
			'Create Duplicate Check Preference. To enable duplicate check preference for the Leads module in your Zoho CRM organization.',
	},
	'duplicateCheckPreferences.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Duplicate Check Preference. To delete the duplicate check preference configured for the Leads module in your Zoho CRM organization. Cannot be undone.',
	},
	'duplicateCheckPreferences.get': {
		riskLevel: 'read',
		description:
			'Get Duplicate Check Preference. To retrieve the duplicate check preference configured for the Leads module in your Zoho CRM organization.',
	},
	'duplicateCheckPreferences.update': {
		riskLevel: 'write',
		description:
			'Update Duplicate Check Preference. API is used to update duplicate check settings for a specific module in the CRM system. It allows users to define how duplicate records are identified and managed based on field mappings between the current module and a mapped module, such as Contacts.',
	},
	'emailDrafts.create': {
		riskLevel: 'write',
		description:
			'Create Email Drafts for a Record. Creates one or more email drafts associated with the specified record in the given module.',
	},
	'emailDrafts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an Email Draft. Deletes the specified email draft for the given record. Cannot be undone.',
	},
	'emailDrafts.get': {
		riskLevel: 'read',
		description:
			'Get an Email Draft. Retrieves the specified email draft for the given record in the module.',
	},
	'emailDrafts.list': {
		riskLevel: 'read',
		description:
			'List Email Drafts for a Record. Retrieves the list of email drafts associated with the specified record in the given module.',
	},
	'emailDrafts.update': {
		riskLevel: 'write',
		description:
			'Update an Email Draft. Updates the specified email draft for the given record in the module.',
	},
	'emailDrafts.updateMany': {
		riskLevel: 'write',
		description:
			'Update Email Drafts for a Record. Updates one or more email drafts associated with the specified record in the given module.',
	},
	'emailNotifications.create': {
		riskLevel: 'write',
		description:
			'Create Email Notifications. Creates an email notification action in your Zoho CRM organization by defining its name, associated module, email template, sender details, and recipients. The email notification can be linked to automation rules so that emails are automatically triggered when the specified conditions are met.',
	},
	'emailNotifications.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an Email Notification by ID. Deletes a single email notification configured in your Zoho CRM organization. Email notifications associated with an Approval Process, Workflow Rules, or Blueprint cannot be deleted until they are disassociated from the corresponding automation. Cannot be undone.',
	},
	'emailNotifications.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Email Notifications. To delete one or more email notifications configured in your Zoho CRM organization. Email notifications associated with an Approval Process, Workflow Rule, Blueprint, or CommandCenter automation cannot be deleted until they are disassociated from the corresponding automation. Cannot be undone.',
	},
	'emailNotifications.get': {
		riskLevel: 'read',
		description:
			'Get an Email Notification by ID. Retrieves the details of a specific email notification configured in your Zoho CRM organization.',
	},
	'emailNotifications.getUsageReports': {
		riskLevel: 'read',
		description:
			'Get Email Notification Action Usage Reports. Retrieves usage statistics for email notification actions executed in your Zoho CRM organization over a specified date range, grouped by date, resource, or type according to the group_by parameter.',
	},
	'emailNotifications.list': {
		riskLevel: 'read',
		description:
			'List Email Notifications. Retrieves the list of email notifications configured in your Zoho CRM organization.',
	},
	'emailNotifications.update': {
		riskLevel: 'write',
		description:
			'Update an Email Notification by ID. Updates an existing email notification in your Zoho CRM organization.',
	},
	'emailTemplates.list': {
		riskLevel: 'read',
		description:
			'Email Templates. To retrieve a paginated list of email templates accessible to the authenticated user in your Zoho CRM organization.',
	},
	'emails.associate': {
		riskLevel: 'write',
		description:
			'Associate Email. Associates an email with a specific record in a module, creating a link between the email and the CRM record.',
	},
	'emails.downloadAttachments': {
		riskLevel: 'read',
		description:
			'Download an email attachment. To download the binary content of an attachment that belongs to an email associated with a record in your Zoho CRM organization.',
	},
	'emails.downloadInlineImages': {
		riskLevel: 'read',
		description:
			'Download an inline image from an email. To download an inline image embedded in an email associated with a record in your Zoho CRM organization.',
	},
	'emails.getSharingDetails': {
		riskLevel: 'read',
		description:
			"Get email sharing details for a record. To retrieve the email sharing details for a specific record in your Zoho CRM organization, including the users whose email accounts are accessible and the available email filter options for the record's email view.",
	},
	'emails.link': {
		riskLevel: 'write',
		description:
			'Link Deal Email. Links an email to a specified record in CRM.',
	},
	'emails.linkMany': {
		riskLevel: 'write',
		description:
			"Link Emails to Deals. To link a deal with one or more of a contact's emails. An email can only be linked to a single deal at a time. Zoho CRM automatically links a contact's incoming emails to the deals using the Deal Prediction Mechanism.",
	},
	'emails.send': {
		riskLevel: 'destructive',
		description:
			'Send an email to a record. To send an email to a specific record in your Zoho CRM organization using a template or custom email content. Sends the email from Zoho CRM to the recipients.',
	},
	'emails.share': {
		riskLevel: 'destructive',
		description:
			'Share Record Emails. To share email threads linked to a specific CRM record with colleagues in the same organization. Requires custom email sharing to be enabled in the organization and a valid email configuration for the user.',
	},
	'emails.shareMany': {
		riskLevel: 'destructive',
		description:
			'Share Record Emails. To share email threads linked to multiple CRM records with colleagues in the same organization. Accepts up to 100 record IDs per request. Supports partial success - each record in the response is processed independently, and individual results indicate success or failure.',
	},
	'emails.unblock': {
		riskLevel: 'write',
		description:
			'Unblock email for a single record. To unblock a soft-bounced email address for a single record in your Zoho CRM organization. When an email sent from CRM bounces temporarily, the Email field on the affected record is blocked. This operation removes that block so email communication with the record can resume.',
	},
	'emails.unblockMany': {
		riskLevel: 'write',
		description:
			'Unblock emails for multiple records in a module. To unblock soft-bounced email addresses for multiple records in your Zoho CRM organization. When emails sent from CRM bounce temporarily, the Email field on the affected records is blocked. This operation removes those blocks in bulk so email communication with the records can resume.',
	},
	'emails.unlink': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Unlink Deal Email. Unlinks an email from a specified record in CRM. Cannot be undone.',
	},
	'emails.unlinkMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Unlink Emails from Deals. To unlink deals from one or more of a contact\'s emails. An email will only be linked to a single deal at a time. When you call this API, the specified email(s) will be unlinked from them. The user\'s profile requires "View" permission for Deals and Contacts modules to use this API. Cannot be undone.',
	},
	'emails.unshare': {
		riskLevel: 'write',
		description:
			'Unshare Record Emails. To revoke email sharing for a specific CRM record, making the linked email threads no longer visible to colleagues. Requires custom email sharing to be enabled in the organization and a valid email configuration for the user.',
	},
	'emails.unshareMany': {
		riskLevel: 'write',
		description:
			'Unshare emails in bulk. To revoke email sharing for multiple CRM records in a single request. Accepts up to 100 record IDs per request. The data array in the 207 response contains an item for each record, indicating success or failure.',
	},
	'features.get': {
		riskLevel: 'read',
		description:
			'Specific Feature. To retrieve the detailed information for a specific feature in your Zoho CRM organization, including its usage limits, consumption details, and sub-feature components.',
	},
	'features.getUserLicenses': {
		riskLevel: 'read',
		description:
			'User Licenses Feature. To get the user licenses feature details for the current edition.',
	},
	'features.list': {
		riskLevel: 'read',
		description:
			'Features. To retrieve the list of all features available in your Zoho CRM organization for the current subscription edition, along with their usage limits and component details.',
	},
	'fieldUpdates.create': {
		riskLevel: 'write',
		description:
			"Create Field Update. Creates a field update action that assigns a static value to a field, triggered by a workflow rule. For single-value fields, use a string for value. For multi-select and multi-user field types, use an array for value (for example, ['Call', 'Advertisement']).",
	},
	'fieldUpdates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Field Update. Deletes a single field update action identified by the path ID. Use the Get Field Updates API to retrieve the field update ID. Actions associated with active automation rules return a NOT_ALLOWED error, and read-only actions cannot be deleted. Cannot be undone.',
	},
	'fieldUpdates.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'To delete multiple field update actions. Deletes multiple Field Update actions specified by their IDs. Specify the action IDs as a comma-separated list using the ids query parameter. You can delete a maximum of 10 actions in a single request. Cannot be undone.',
	},
	'fieldUpdates.get': {
		riskLevel: 'read',
		description:
			'Get Field Update By Id. Retrieves the details of the specified Field Update action, including its field configuration, module details, configured value, dependent fields, and audit information. Specify the Field Update ID in the path parameter.',
	},
	'fieldUpdates.list': {
		riskLevel: 'read',
		description:
			"Get Field Updates. Retrieves a paginated list of field update actions. OPTIONAL FILTERS: module (string — filter by module API name), related_module (string — filter by related module API name), feature_type ('workflow'), sort_by, sort_order, page, per_page.",
	},
	'fieldUpdates.update': {
		riskLevel: 'write',
		description:
			'Update Field Update. Updates an existing field update action identified by the path ID. Use the Get Field Updates API to find the field update ID. Locked actions require the appropriate privilege, and read-only actions cannot be modified. For single-value fields, use a string for value.',
	},
	'fields.create': {
		riskLevel: 'write',
		description:
			'Create custom fields in a module. To create custom fields in a module in your Zoho CRM organization, where supported modules include Leads, Contacts, Accounts, Campaigns, Cases, Invoices, Deals, Price Books, Products, Purchase Orders, Quotes, Sales Orders, Solutions, Vendors, Calls, Tasks, Events, Users, and Custom modules.',
	},
	'fields.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a custom field. To delete a custom field from a module in your Zoho CRM account. The field must not be used in workflows, approvals, scoring rules, or other configurations before deletion. Cannot be undone.',
	},
	'fields.get': {
		riskLevel: 'read',
		description:
			'Get field metadata by ID. To retrieve the metadata of a specific custom field in a module in your Zoho CRM account by its field ID.',
	},
	'fields.getScheduledJobs': {
		riskLevel: 'read',
		description:
			'Get scheduled jobs for a field. To retrieve the status of scheduled jobs for picklist field operations in your Zoho CRM account, such as replace or delete picklist option jobs.',
	},
	'fields.list': {
		riskLevel: 'read',
		description:
			'List fields metadata. To retrieve the field metadata for the specified module in your Zoho CRM account, including standard, custom, subform, and linking module fields. The response includes fields from all layouts but does not contain layout-specific configurations such as mandatory flags or picklist values.',
	},
	'fields.update': {
		riskLevel: 'write',
		description:
			'Update a custom field. To update a specific custom field in a module in your Zoho CRM account by its unique field ID.',
	},
	'fields.updateMany': {
		riskLevel: 'write',
		description:
			'Update custom fields. To update one or more custom fields in a module in your Zoho CRM account.',
	},
	'files.download': {
		riskLevel: 'read',
		description:
			"Retrieve a file from ZFS. To retrieve the binary content of a file stored in Zoho File System (ZFS) using its unique file ID. The file ID is provided as a required query parameter 'id'.",
	},
	'files.upload': {
		riskLevel: 'write',
		description:
			'Upload files to ZFS. To upload one or more files to the Zoho File System (ZFS) in your Zoho CRM account. The API returns an encrypted file ID for each uploaded file, which you can use to attach the file to a file upload field, image upload field, or record image field through the Create or Update Records API.',
	},
	'fiscalYear.get': {
		riskLevel: 'read',
		description:
			'Get Fiscal Year Settings. To retrieve the fiscal year settings configured for your Zoho CRM organization.',
	},
	'fiscalYear.update': {
		riskLevel: 'write',
		description:
			'Update Fiscal Year Settings. Updates the fiscal year configuration for the organization. Only administrators can update fiscal year settings.',
	},
	'fromAddresses.list': {
		riskLevel: 'read',
		description:
			'Get from addresses. To retrieve the list of email addresses configured as sender addresses for a user in your Zoho CRM organization.',
	},
	'functions.create': {
		riskLevel: 'write',
		description:
			'Function. Use this API to create a function in your Zoho CRM account. Create Deluge, Java, Node.js, or Python functions with metadata and code. Deluge code can be JSON-embedded (_code) or uploaded as a .ds file; others require a ZIP package. Note: - Up to 20,000 functions per organization.',
	},
	'functions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Function. To delete a function identified by its unique ID or API name from your Zoho CRM organization. The function can't be deleted if it has active references or associations, such as workflow rules, buttons, or schedules, references from other functions, or REST API exposure. Cannot be undone.",
	},
	'functions.get': {
		riskLevel: 'read',
		description:
			"Function. Use this API to retrieve the details of a specific function in your Zoho CRM account by specifying its unique ID or API name. The response contains information such as the function's runtime, category, state, arguments, tags, REST API mode, and creation and modification details.",
	},
	'functions.getCategories': {
		riskLevel: 'read',
		description:
			'Function Categories. To retrieve all the Function categories supported by the current Zoho CRM account and indicate whether each category is available for use. Different Zoho CRM editions and enabled features support different Function categories.',
	},
	'functions.getCode': {
		riskLevel: 'read',
		description:
			'Download Function Code. This API downloads the source code of the specified function. - Deluge Functions: A Deluge function consists of a single source file containing the function logic. When downloaded, the API returns the function as a .ds file with a maximum file size of 2 MB.',
	},
	'functions.getRuntimes': {
		riskLevel: 'read',
		description:
			'List Function Runtime. To retrieve the list of all supported function runtimes available in your Zoho CRM organization, including the programming language, runtime version identifier, and deprecation status for each entry.',
	},
	'functions.list': {
		riskLevel: 'read',
		description:
			'Functions. To retrieve a paginated list of all functions in your Zoho CRM account. The response contains metadata about each function, including its name, API name, runtime, category, state, arguments, tags, and timestamps.',
	},
	'functions.publish': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Publish a function. This API is applicable only to Java, Node.js, and Python functions. The function must have an unpublished draft version before it can be published. Deluge functions are automatically published when they are created or updated and cannot be published using this API.',
	},
	'functions.update': {
		riskLevel: 'write',
		description:
			"Update a function by identifier. Use this API to update an existing function in your Zoho CRM account. You can update the function name, description, code, and publish configuration. For Deluge functions, you can also update arguments by modifying the script's function declaration.",
	},
	'globalPicklists.create': {
		riskLevel: 'write',
		description:
			'Create a Global Picklist. Creates a new global picklist with the specified display label, API name, description, and picklist values. The actual_label, customizable, modified_by, created_by, and presence properties are generated by the backend. In pick_list_values, only display_value and type are considered.',
	},
	'globalPicklists.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a Global Picklist by ID. Deletes a single global picklist identified by the path parameter \\{id\\}. This request is asynchronous: a 202 Accepted indicates deletion has been scheduled and the response contains a job_id in details. There is no status-check endpoint. Cannot be undone.',
	},
	'globalPicklists.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a Global Picklist. Deletes a single global picklist by numeric id. This request is asynchronous: a 202 Accepted indicates deletion has been scheduled and the response includes a job_id in details. There is no status-check endpoint currently. Cannot be undone.',
	},
	'globalPicklists.get': {
		riskLevel: 'read',
		description:
			"Get a Single Global Picklist by ID. Fetches the global picklist for given id along with their pick_list_values. used_in_modules, and associated_fields_count can be included in the response based on the 'include' query parameter.",
	},
	'globalPicklists.getFieldAssociations': {
		riskLevel: 'read',
		description:
			'Get Field Associations. Retrieves associations of picklist values with modules, fields, and layouts for a given global picklist ID.',
	},
	'globalPicklists.getReplacedValues': {
		riskLevel: 'read',
		description:
			'Get Replaced Picklist Values. Retrieves picklist values that are currently being replaced through a replace scheduler for the given global picklist ID.',
	},
	'globalPicklists.getValueAssociations': {
		riskLevel: 'read',
		description:
			'Get Picklist Value Associations. To the list of features like blueprints, workflows create, workflow convert, workflow task, ABM, etc in which a particular picklist value is used.',
	},
	'globalPicklists.list': {
		riskLevel: 'read',
		description:
			'Get All Global Picklists. Fetches the list of global picklists available in the organization along with their details. pick_list_values, used_in_modules, and associated_fields_count can be included in the response based on the "include" query parameter.',
	},
	'globalPicklists.replaceValues': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Replace Picklist Values. Schedules or executes replacement of picklist values for the specified global picklist. You can specify either id, display_value, or both for old_value and new_value. If both are provided, the system validates them for consistency.',
	},
	'globalPicklists.update': {
		riskLevel: 'write',
		description:
			'Update a Global Picklist by ID. Updates an existing global picklist identified by the path parameter \\{id\\}. You can update display_label, api_name, description, pick_list_values_sorted_lexically, and pick_list_values. Backend-generated properties (actual_label, customizable, modified_by, created_by, presence) cannot be updated.',
	},
	'globalPicklists.updateMany': {
		riskLevel: 'write',
		description:
			'Update a Global Picklist. Updates an existing global picklist. You can update display_label, api_name, description, pick_list_values_sorted_lexically, and pick_list_values. Backend-generated properties (actual_label, customizable, modified_by, created_by, presence) cannot be updated.',
	},
	'holidays.create': {
		riskLevel: 'write',
		description:
			'Holidays. To create one or more business or shift holidays in Zoho CRM. Business holidays apply to all users, while shift holidays must specify a valid shift_hour identifier.',
	},
	'holidays.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Holiday. To permanently delete a holiday from Zoho CRM using its unique identifier. The deletion cannot be undone. Cannot be undone.',
	},
	'holidays.get': {
		riskLevel: 'read',
		description:
			'A specific holiday. To retrieve the complete details of a specific holiday record from Zoho CRM using its unique identifier.',
	},
	'holidays.list': {
		riskLevel: 'read',
		description:
			'Holidays. To retrieve the list of holidays configured in Zoho CRM. Business holidays apply to all users, while shift holidays are specific to configured shift schedules. Returns paginated results.',
	},
	'holidays.update': {
		riskLevel: 'write',
		description:
			'A specific holiday. To update the name or date of a specific holiday record in Zoho CRM using its unique identifier.',
	},
	'holidays.updateMany': {
		riskLevel: 'write',
		description:
			'Multiple Holidays. To update one or more existing holiday records in Zoho CRM by providing each holiday ID with the updated field values.',
	},
	'inventory.convert': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Convert Inventory Record. To convert an inventory record in your Zoho CRM organization from one module to another. Supported conversion paths are: Quotes to Sales Orders or Invoices, and Sales Orders to Invoices.',
	},
	'inventoryTemplates.get': {
		riskLevel: 'read',
		description:
			'Inventory Template. Retrieves a single inventory template by its ID with complete details including content and all metadata.',
	},
	'inventoryTemplates.list': {
		riskLevel: 'read',
		description:
			'Inventory templates. To retrieve a paginated list of inventory templates configured in your Zoho CRM organization, with optional filtering by module, category, and field criteria, and sorting by name or usage and modification timestamps.',
	},
	'kiosks.activate': {
		riskLevel: 'write',
		description:
			'Activate Kiosk. To activate a Kiosk that is in draft or inactive state in Zoho CRM. The Kiosk must contain at least one screen before it can be activated. Once activated, the Kiosk becomes active and can be used for data collection.',
	},
	'kiosks.clone': {
		riskLevel: 'write',
		description:
			'Clone a Kiosk. To clone an existing kiosk in Zoho CRM and create a new one from it. Cloning lets you reuse the full structure and configuration of a kiosk — including all its states, transitions, screens, actions, and decisions — without rebuilding it from scratch.',
	},
	'kiosks.create': {
		riskLevel: 'write',
		description:
			'Create a Kiosk. To create a new Kiosk in the draft state in your Zoho CRM organization. After creating the Kiosk, use the Create a Kiosk State API to configure screens and then use the Activate Kiosk API to publish it. Available in the Standard, Professional, Enterprise, and Ultimate editions.',
	},
	'kiosks.deactivate': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deactivate a Kiosk. To deactivate an active Kiosk in your Zoho CRM account. Once deactivated, the Kiosk will no longer be accessible for users. Use the Get All Kiosks API to retrieve the Kiosk ID. Note - A Kiosk must be in the Active (Published) state before it can be deactivated. Cannot be undone.',
	},
	'kiosks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a kiosk. To delete an existing Kiosk from your Zoho CRM organization. The deletion removes the entire Kiosk entry, including all states created within it, along with any related data. Cannot be undone.',
	},
	'kiosks.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Kiosk Deletion. To delete one or more Kiosks from your Zoho CRM account. Use the Get Kiosks API to retrieve Kiosk IDs. Note: You can delete: - Draft Kiosks. - Deactivated Kiosks. Cannot be undone.',
	},
	'kiosks.execute': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Execute a Kiosk. The execute Kiosk API is used to trigger the execution of a published Kiosk in Zoho CRM. This API returns only the first executable state of the Kiosk. To continue the execution through the remaining states, call the Update a Kiosk Execution API until the execution is complete.',
	},
	'kiosks.executeState': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Update a Kiosk Execution. To execute a transition in an ongoing Kiosk execution by submitting the required transition and runtime data, and proceed to the next step of the Kiosk in your Zoho CRM. The Kiosk must be in the published status and have an active execution to update its execution state.',
	},
	'kiosks.get': {
		riskLevel: 'read',
		description:
			'Get a Specific Kiosk. To retrieve the details of a specific kiosk in your Zoho CRM organization, identified by its unique kiosk ID. Use the Get Kiosks API to retrieve Kiosk ID.',
	},
	'kiosks.getAssociations': {
		riskLevel: 'read',
		description:
			'Get Kiosk Associations. Retrieves all associations configured for a specific Kiosk in Zoho CRM, including the associated resources and, their additional details. Use the Get All Kiosks API to retrieve the Kiosk ID. Note: - The structure of each resource object is mostly consistent, but _details can vary.',
	},
	'kiosks.getCurrentRecordAssociations': {
		riskLevel: 'read',
		description:
			'Kiosk CurrentRecords Associations. To retrieve all associations configured for the current record of the specified kiosk in your Zoho CRM organization. Use this API to retrieve all the associations configured for the CurrentRecord lookup field in a specific Kiosk.',
	},
	'kiosks.getExecution': {
		riskLevel: 'read',
		description:
			'Retrieve a kiosk execution record. To retrieve the details of a specific kiosk execution in your Zoho CRM organization.',
	},
	'kiosks.getRecordSteps.create': {
		riskLevel: 'write',
		description:
			'Kiosk GetRecord. To create a GetRecords configuration associated with a Kiosk. It defines how records should be fetched from a module, including criteria, selection behavior, and sorting. Use the Get All Kiosks API to retrieve the Kiosk ID. Note: - You can configure GetRecords only for Kiosks in the draft state.',
	},
	'kiosks.getRecordSteps.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Kiosk GetRecord. To delete a specific GetRecords configuration associated with a Kiosk. Use the GetRecords Associations API to identify all associations of the GetRecords configuration. Remove the associations from the respective Kiosk components, and then delete the GetRecords configuration. Cannot be undone.',
	},
	'kiosks.getRecordSteps.get': {
		riskLevel: 'read',
		description:
			'Retrieve a specific get_record component from a Kiosk. To retrieve the details of a specific GetRecords configuration associated with a Kiosk using its GetRecords ID. Use the Get All Kiosks API to retrieve the Kiosk ID and the Kiosk GetRecords API to retrieve the GetRecords ID.',
	},
	'kiosks.getRecordSteps.getAssociations': {
		riskLevel: 'read',
		description:
			'GetRecords Associations. This API returns all the associations of a specific GetRecords configuration.',
	},
	'kiosks.getRecordSteps.list': {
		riskLevel: 'read',
		description:
			'Kiosk GetRecords. To retrieve all GetRecords configurations associated with a Kiosk. The response includes details such as criteria, selection configuration, selected fields, module information, and sorting preferences. Use the Get All Kiosks API to retrieve the Kiosk ID.',
	},
	'kiosks.getRecordSteps.update': {
		riskLevel: 'write',
		description:
			'Kiosk GetRecord. To update an existing GetRecords configuration associated with a Kiosk. This API supports only draft Kiosks.',
	},
	'kiosks.list': {
		riskLevel: 'read',
		description:
			'Get All Kiosks. To retrieve all the available Kiosks in your Zoho CRM organization. The response includes metadata for each Kiosk, such as version information, associated module, current status, creator and modifier details, and record context, if configured.',
	},
	'kiosks.listAssociations': {
		riskLevel: 'read',
		description:
			'Kiosk Associations. To retrieve association information for all kiosks in your Zoho CRM organization, including detail view page associations with linked layout and module details. Use the Get All Kiosks API to retrieve the Kiosk ID.',
	},
	'kiosks.listExecutions': {
		riskLevel: 'read',
		description:
			'List kiosk executions. To retrieve all active executions for a specific kiosk in your Zoho CRM organization. For each execution, the response includes the user who ran the kiosk, the execution start and end times, the current or most recently visited state, and the transition available to execute next.',
	},
	'kiosks.preview': {
		riskLevel: 'read',
		description:
			'Retrieve the Preview of a Specified Kiosk. Retrieves the configuration and details of the first screen state for a specified Kiosk in Zoho CRM. This API returns only the first screen data required to render the Kiosk and does not trigger any actions or require user interaction.',
	},
	'kiosks.states.create': {
		riskLevel: 'write',
		description:
			'Create a kiosk state. Creates a state (screen, action, decision, or GetRecords) in a Kiosk identified by Kiosk ID. Only one state can be created per request. The Kiosk must be in draft status; use the Clone a Kiosk API if it is published or inactive.',
	},
	'kiosks.states.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a kiosk state. To delete a specific state from a kiosk configuration in your Zoho CRM account. Removing a state eliminates all its associated configurations, transitions, and connected elements. Cannot be undone.',
	},
	'kiosks.states.get': {
		riskLevel: 'read',
		description:
			'Get a specific kiosk state by ID. To retrieve the complete configuration of one specific state within a kiosk in Zoho CRM, including its transitions, associated fields, and configured properties. Use the include_inner_details query parameter to expand nested type information.',
	},
	'kiosks.states.list': {
		riskLevel: 'read',
		description:
			'Get all states of a kiosk. To retrieve all the states configured in a kiosk in your Zoho CRM organization, along with their transition details and basic metadata such as name, type, and associated fields. Each state represents a screen, action, decision, or GetRecords.',
	},
	'kiosks.states.update': {
		riskLevel: 'write',
		description:
			'Kiosk State. To update a particular state in a specific Kiosk in Zoho CRM using the Kiosk ID and state ID. Each state represents a screen, action, decision, or GetRecords. A Kiosk must be in the draft status to update a state.',
	},
	'kiosks.testRun': {
		riskLevel: 'read',
		description:
			'Initiate a Test Run for a Kiosk. To initiate a test run for a kiosk before publishing it in your Zoho CRM organization. This operation executes all configured kiosk states and actions on live CRM data in real time.',
	},
	'kiosks.update': {
		riskLevel: 'write',
		description:
			"Update a Kiosk. To update an existing draft Kiosk in Zoho CRM. This API allows you to update the Kiosk's name, description, group API name, and current record module. Use the Get All Kiosks API to retrieve the Kiosk ID.",
	},
	'kiosks.updateAssociations': {
		riskLevel: 'write',
		description:
			"Kiosk Associations. This API allows you to associate an active Kiosk with the Record Detail View Page of a module. Once associated, the Kiosk will be available within the selected module's Record Detail View Page based on the specified layout. Use the Get All Kiosks API to retrieve the Kiosk ID.",
	},
	'layouts.activate': {
		riskLevel: 'write',
		description:
			'Activate Layout. Activates a single deactivated layout, making it available for use within the specified module. Optionally allows adding or removing profile associations during activation. Only one layout can be activated per request.',
	},
	'layouts.deactivate': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deactivate Layout. Deactivates an active layout and transfers its configuration (profile associations, permissions, field mappings) to another active layout within the same module. At least one active layout must remain in the module. Cannot be undone.',
	},
	'layouts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a custom layout. To delete a custom layout from a module in your Zoho CRM organization. When the layout being deleted has associated records, a target layout must be specified to receive the transferred records and profile associations. Cannot be undone.',
	},
	'layouts.get': {
		riskLevel: 'read',
		description:
			'Get layout by ID. To retrieve the details of a specific layout by its layout ID for a specified module in your Zoho CRM account. Important Notes: - The profiles array is null when the user does not have "Module Customization" permission in their profile.',
	},
	'layouts.list': {
		riskLevel: 'read',
		description:
			'Get layouts metadata. To retrieve the layout configurations for a specified module in your Zoho CRM organization. Note: - The profiles array is null if the user does not have the Module Customization permission in their profile.',
	},
	'layouts.update': {
		riskLevel: 'write',
		description:
			'Update a custom layout. To update a custom layout in your Zoho CRM organization, including renaming it, modifying profile permissions, enabling or disabling the business card display, and creating, updating, or deleting sections and fields within sections.',
	},
	'leads.convert': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Convert a Lead. Converts a Lead record into Contact, Account, and/or Deal records. Allows configuration of conversion behavior including overwrite settings, notifications, owner assignment, and tag carryover. The lead becomes a contact (and optionally an account and a deal) and is removed from Leads.',
	},
	'leads.getConversionOptions': {
		riskLevel: 'read',
		description:
			'Lead Conversion Options. Retrieves available conversion options for a lead including matching contacts, accounts, field mappings, and layout preferences. This endpoint helps determine what conversion paths are available before performing the actual lead conversion.',
	},
	'mailMerge.download': {
		riskLevel: 'read',
		description:
			'Download mail merge document. To download the merged document created from a mail merge template for a specific record in your Zoho CRM organization. You can choose the output format as pdf, html, or docx, and optionally set a password for PDF documents.',
	},
	'mailMerge.send': {
		riskLevel: 'destructive',
		description:
			'Send mail merge email. To send a personalized email to one or more recipients using a mail merge template associated with a specific record in your Zoho CRM organization. You can include recipients in the To, CC, and BCC fields, and optionally attach the merged document either as an inline image or a separate file. Sends the merged document by email.',
	},
	'mailMerge.sign': {
		riskLevel: 'destructive',
		description:
			'Send mail merge document for signing. To send a merged document to one or more recipients for signing or approval using a mail merge template associated with a specific record in your Zoho CRM organization. Before using this operation for the first time, you must access the Merge and Sign dialog in the Zoho Writer UI once. Sends the merged document for signature with Zoho Sign.',
	},
	'mapDependencies.create': {
		riskLevel: 'write',
		description:
			'Create a field dependency for a layout. To create a field dependency between a parent picklist field and a child picklist field for a specific layout in your Zoho CRM organization. Prerequisites - The selected layout must contain at least two option-based fields.',
	},
	'mapDependencies.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a field dependency. To delete a specific field dependency from a layout in your Zoho CRM organization. Cannot be undone.',
	},
	'mapDependencies.get': {
		riskLevel: 'read',
		description:
			'Get a field dependency by ID. To retrieve the complete details of a specific field dependency from a layout in your Zoho CRM organization, including all picklist value mappings.',
	},
	'mapDependencies.list': {
		riskLevel: 'read',
		description:
			'Get field dependencies for a layout. To retrieve the list of field dependencies configured for a specific layout in your Zoho CRM organization.',
	},
	'mapDependencies.update': {
		riskLevel: 'write',
		description:
			'Update an existing field dependency. Updates the picklist value mappings for an existing field dependency. Use \\"_delete\\": null to remove specific mappings.',
	},
	'massActions.changeOwner': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Submit mass change owner job. To bulk update the ownership of records in a specified module based on a Custom View, territory, or field-based criteria in your Zoho CRM organization. You cannot change the owner of related records using this API. You can change the owner of up to 50,000 records in a custom view.',
	},
	'massActions.convertLeads': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Submit mass convert job for leads. To submit a mass convert job that converts lead records into Contacts, Accounts, or Deals in your Zoho CRM organization. The job runs asynchronously and returns a job identifier for status tracking.',
	},
	'massActions.deleteRecords': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete records in bulk by record IDs or Custom View. To delete records in bulk from a specified module in your Zoho CRM organization, either by providing record IDs for synchronous deletion or a Custom View ID for asynchronous batch deletion.',
	},
	'massActions.deleteTags': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Mass delete tags. To schedule a background job that deletes multiple tags in bulk from a single module in your Zoho CRM organization. You can delete tags in bulk from one module per API call.',
	},
	'massActions.getChangeOwnerStatus': {
		riskLevel: 'read',
		description:
			'Get mass change owner job status. To retrieve the status of a previously scheduled mass change owner job in your Zoho CRM organization. The OAuth scope enforced is specific to the target module (for example, ZohoCRM.change_owner.leads.READ for Leads); modules without a dedicated scope fall back to a generic custom-module scope.',
	},
	'massActions.getConvertLeadsStatus': {
		riskLevel: 'read',
		description:
			'Get mass convert job status. To retrieve the current status and conversion counts of a previously scheduled mass convert job in your Zoho CRM organization.',
	},
	'massActions.getDeleteRecordsStatus': {
		riskLevel: 'read',
		description:
			'Retrieve mass delete job status. To retrieve the status and record counts of a previously scheduled mass delete job in your Zoho CRM organization.',
	},
	'massActions.getDeleteTagsStatus': {
		riskLevel: 'read',
		description:
			'Mass Delete Tags Status. To retrieve the current status, the scheduled time, and the success and failure counts for a previously scheduled mass delete tag job in your Zoho CRM organization, using the job ID returned by the Mass Delete Tags POST operation.',
	},
	'massActions.getUpdateRecordsStatus': {
		riskLevel: 'read',
		description:
			'Get mass update job status. To retrieve the current status and record-processing counts of an asynchronous mass update job that was previously scheduled in your Zoho CRM organization. The job is identified by the job_id returned in the response of the scheduler-type mass update request.',
	},
	'massActions.updateRecords': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Mass update records. To update a specific field value across multiple records of a module in your Zoho CRM organization in a single API call. The operation supports two modes.',
	},
	'meetings.cancel': {
		riskLevel: 'write',
		description:
			'Cancel a Meeting. To cancel a meeting and send an email regarding the meeting cancellation to the participants. A meeting can only be cancelled if attendees have already been invited and the meeting has not passed its scheduled end time.',
	},
	'modules.create': {
		riskLevel: 'write',
		description:
			'Create a custom module. To create a custom module in your Zoho CRM organization. Only one module can be created per request. The required permission depends on the access type: Crm_Implied_Customize_Zoho_CRM for org-based modules and Crm_Implied_Create_Team_Module for team-based modules.',
	},
	'modules.generateLink': {
		riskLevel: 'read',
		description:
			"Generate web-tab link for a module. To generate the configured web-tab link for a specific module in your Zoho CRM organization. The moduleid path parameter must be the module's API name (e.g., Leads, Contacts, Custom_Module_1).",
	},
	'modules.get': {
		riskLevel: 'read',
		description:
			'Get module metadata by API name. Retrieves complete metadata for a specific CRM module identified by its API name, including fields, layouts, profiles, related lists, and feature capabilities. Returns 204 when the module is not available through this endpoint, or 400 when the identifier is invalid or the module is unsupported.',
	},
	'modules.list': {
		riskLevel: 'read',
		description:
			'Retrieve modules. Retrieves the list of all modules available in the Zoho CRM account, including standard, custom, subform, and linking (MxN) modules. Supports optional filtering by status, feature_name, and include to control the scope and depth of the response.',
	},
	'modules.update': {
		riskLevel: 'write',
		description:
			'Update Module Labels and Profiles. Updates the singular label, plural label, and profile assignments for the module identified by {moduleIdentifier}. Immutable fields such as access_type and api_name cannot be changed; attempting to include them returns a NOT_ALLOWED error.',
	},
	'modules.updateMany': {
		riskLevel: 'write',
		description:
			'Update CRM modules. Updates existing modules in the CRM. Allows modification of module labels (singular_label, plural_label) and profile assignments. Supports batch updates of up to 100 modules per request. Returns 200 when all modules update successfully, or 207 Multi-Status when some succeed and others fail.',
	},
	'notes.create': {
		riskLevel: 'write',
		description: 'Create Notes. Creates one or more note records.',
	},
	'notes.createForRecord': {
		riskLevel: 'write',
		description:
			'Related Notes. Creates one or more notes associated with a specific parent record. Either note content or note title must be provided (at least one is mandatory).',
	},
	'notes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a Specific Note. Permanently deletes a specific note by its ID. Cannot be undone.',
	},
	'notes.deleteForRecord': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Related Note. Deletes a specific note record associated with a parent record using the note ID in the path. Cannot be undone.',
	},
	'notes.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Notes. Permanently deletes one or more notes using comma-separated note IDs. Cannot be undone.',
	},
	'notes.deleteManyForRecord': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Related Notes. Deletes one or more notes associated with a specific parent record using comma-separated note IDs in the query parameter. Cannot be undone.',
	},
	'notes.get': {
		riskLevel: 'read',
		description:
			'Get a Specific Note. Retrieves details of a specific note by its ID.',
	},
	'notes.getForRecord': {
		riskLevel: 'read',
		description:
			'Specific Related Note. Retrieves details of a specific note record associated with a CRM record in your Zoho CRM organization.',
	},
	'notes.list': {
		riskLevel: 'read',
		description: 'Notes. Retrieves a list of notes. (GET /crm/v8/Notes)',
	},
	'notes.listForRecord': {
		riskLevel: 'read',
		description:
			'Related Notes. Retrieves a paginated list of notes associated with a specific parent record in a CRM module.',
	},
	'notes.update': {
		riskLevel: 'write',
		description:
			'Update a Specific Note. Updates a specific note by its ID. Either note content or note title must be provided (at least one is mandatory).',
	},
	'notes.updateForRecord': {
		riskLevel: 'write',
		description:
			'Related Note. Updates an existing note associated with a specific parent record. Either note content or note title must be provided (at least one is mandatory).',
	},
	'notes.updateMany': {
		riskLevel: 'write',
		description:
			'Update Notes. Updates one or more existing note records. Either note content or note title must be provided (at least one is mandatory) for each note.',
	},
	'notes.updateManyForRecord': {
		riskLevel: 'write',
		description:
			'Related Notes. Updates one or more notes associated with a specific CRM record in your Zoho CRM organization. Either note content or note title must be provided (at least one is mandatory) for each note.',
	},
	'notifications.disable': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Disable notification channels. To disable one or more notification channels in your Zoho CRM organization. Cannot be undone.',
	},
	'notifications.enable': {
		riskLevel: 'write',
		description:
			'Create notification channels. To create one or more notification channels in your Zoho CRM organization. Zoho posts change events to notify_url until channel_expiry (at most one day ahead; one week for some modules).',
	},
	'notifications.list': {
		riskLevel: 'read',
		description:
			'List active notification channels. To retrieve the list of active notification channels configured for your Zoho CRM organization.',
	},
	'notifications.update': {
		riskLevel: 'write',
		description:
			'Update full notification details. To replace all properties of an existing notification channel in your Zoho CRM organization.',
	},
	'notifications.updateInfo': {
		riskLevel: 'write',
		description:
			'Update notification channel information. To partially update the properties of a notification channel in your Zoho CRM organization.',
	},
	'org.deletePhoto': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete the organization photo. To delete the organization photo from your Zoho CRM organization. Cannot be undone.',
	},
	'org.get': {
		riskLevel: 'read',
		description:
			'Get organization details. To retrieve the organization details associated with your Zoho CRM account.',
	},
	'org.getPhoto': {
		riskLevel: 'read',
		description:
			'Organization photo. To retrieve the organization photo for your Zoho CRM organization.',
	},
	'org.uploadPhoto': {
		riskLevel: 'write',
		description:
			'Upload Organization Photo. To upload a photo for your Zoho CRM organization.',
	},
	'picklistValues.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a picklist field option. Delete picklist field option. Cannot be undone.',
	},
	'picklistValues.get': {
		riskLevel: 'read',
		description: 'get a picklist field option. Picklist field option GET.',
	},
	'picklistValues.list': {
		riskLevel: 'read',
		description:
			'Picklist Values for a Field. Returns the available pick list values for a specified field in a module, including display values (with translations if enabled), reference values, layout associations, and metadata. Returns 204 if the field exists but is not a pick list type. Does not support pagination.',
	},
	'picklistValues.replace': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Replace Pick list values. Replace picklist value.',
	},
	'pipelines.create': {
		riskLevel: 'write',
		description:
			'Pipeline. Create a new pipeline for the specified Deals layout by providing a pipeline display label and one or more mapped stages.',
	},
	'pipelines.get': {
		riskLevel: 'read',
		description:
			'Specific Pipeline. Retrieve a specific pipeline by pipeline ID for the specified Deals layout.',
	},
	'pipelines.list': {
		riskLevel: 'read',
		description:
			'Pipelines. Retrieve all pipelines available for the specified Deals layout. Use the required layout_id query parameter to identify the layout.',
	},
	'pipelines.replace': {
		riskLevel: 'write',
		description:
			'Pipeline. Update or replace a specific pipeline identified by the path ID for the specified layout.',
	},
	'pipelines.replaceMany': {
		riskLevel: 'write',
		description:
			'Pipeline. Update, or delete a pipeline for the specified layout using the supplied pipeline configuration in the request body.',
	},
	'pipelines.transferAndDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Transfer Pipeline. Transfer records and stage mappings from one pipeline to another in the specified layout, and delete the source pipeline after the transfer is scheduled.',
	},
	'pipelines.update': {
		riskLevel: 'write',
		description:
			'Pipeline. Update or delete a specific pipeline identified by the path ID within the specified layout.',
	},
	'pipelines.updateMany': {
		riskLevel: 'write',
		description:
			'Pipeline. Update or delete a pipeline for the specified layout using a request body that identifies the pipeline and its stage mappings.',
	},
	'portals.create': {
		riskLevel: 'write',
		description:
			'Portal. To create a Client Portal for the Zoho CRM organization. Only one portal can be created per organization. The portal name must be unique across Zoho, between 6 and 30 characters.',
	},
	'portals.get': {
		riskLevel: 'read',
		description:
			'Specific Portal. To retrieve the complete configuration of a specific portal in the Zoho CRM organization, including its SAML authentication settings, active status, and creation metadata.',
	},
	'portals.list': {
		riskLevel: 'read',
		description:
			'Portals. To retrieve the list of all portals configured for the Zoho CRM organization. A 204 response indicates no portal has been created yet.',
	},
	'portals.update': {
		riskLevel: 'write',
		description:
			'Portal. To update the configuration of an existing portal in the Zoho CRM organization, including the portal name and SAML single sign-on settings.',
	},
	'portals.userTypes.create': {
		riskLevel: 'write',
		description:
			"Portal User Type. Creates a new portal user type for the specified portal. A portal user type defines the personality module, invitation field, and per-module access permissions for portal users. The portal must already exist in the organization's Zoho CRM account.",
	},
	'portals.userTypes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete user type. Deletes the specified portal user type from the portal. If portal users are assigned to this user type, provide transfer_To with the ID of another user type to transfer them before deletion. Cannot be undone.',
	},
	'portals.userTypes.get': {
		riskLevel: 'read',
		description:
			'Portal User Type. Retrieves the full configuration of a single portal user type, including identity fields, active status, user counts, audit metadata, personality module, invitation field, and per-module access permissions.',
	},
	'portals.userTypes.list': {
		riskLevel: 'read',
		description:
			'Portal User Types. Retrieves a list of all portal user types configured for the specified portal, with their summary configuration including name, status, user counts, and last modification time.',
	},
	'portals.userTypes.update': {
		riskLevel: 'write',
		description:
			'Portal User Type. Updates the configuration of an existing portal user type. You can modify module-level access settings, including shared type, allowed layouts, filter fields, and field-level permissions.',
	},
	'portals.users.changeStatus': {
		riskLevel: 'write',
		description: 'Change status of portal users. Changing portal users status.',
	},
	'portals.users.changeStatusMany': {
		riskLevel: 'write',
		description:
			'Portal User Status. To activate or deactivate multiple portal users in bulk in your Zoho CRM organization for the specified portal and user type.',
	},
	'portals.users.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'delete portal users. To delete one or more portal users from your Zoho CRM organization for the specified portal and user type. Cannot be undone.',
	},
	'portals.users.getScheduledInviteInfo': {
		riskLevel: 'read',
		description:
			'Invite portal users. To retrieve the status of a scheduled portal invitation job in your Zoho CRM organization using the job identifier returned when invitations were scheduled.',
	},
	'portals.users.invite': {
		riskLevel: 'destructive',
		description:
			'Invite portal users. To send a portal invitation to a single CRM record in your Zoho CRM organization, inviting or re-inviting the record as a portal user for the specified user type. Emails a portal invitation.',
	},
	'portals.users.inviteMany': {
		riskLevel: 'destructive',
		description:
			'Invite portal users. To send portal invitations in bulk to CRM records in your Zoho CRM organization for the specified module, scheduling them as asynchronous invitation jobs. Emails portal invitations.',
	},
	'portals.users.list': {
		riskLevel: 'read',
		description:
			'List portal users. To retrieve the list of portal users in your Zoho CRM organization for the specified portal and user type, with optional filtering by source.',
	},
	'portals.users.transfer': {
		riskLevel: 'write',
		description:
			'Transfer portal users from one user group to another. To transfer one or more portal users from one user type group to another within the same portal in your Zoho CRM organization.',
	},
	'profiles.clone': {
		riskLevel: 'write',
		description:
			"Clone a CRM profile. Creates a new profile by cloning the existing profile identified by {id}. The request body must include the new profile's name, which must be unique within the organization and must not exceed 50 characters. See Create a Profile.",
	},
	'profiles.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Profile. Transfers all users of the profile identified by {id} to the profile specified by the transfer_to query parameter, then permanently deletes the source profile. System profiles (Administrator, Standard) cannot be deleted. See Transfer Users and Delete a Profile. Cannot be undone.',
	},
	'profiles.get': {
		riskLevel: 'read',
		description:
			'Profile. Retrieves the full details of the CRM profile identified by {id}, including its complete permission tree organized by sections and categories. See Get Profiles.',
	},
	'profiles.list': {
		riskLevel: 'read',
		description:
			"Profiles. Retrieves the paginated list of all profiles in the organization, including each profile's name, type, permission details, and section groupings. Use the type query parameter to filter by profile type, and include_types to include Lite or Support profiles alongside the default set.",
	},
	'profiles.patch': {
		riskLevel: 'write',
		description:
			'Profile. Partially updates the name, description, and permission enablement for the profile identified by {id}. System profiles (Administrator, Standard) cannot be updated. See Update Profile Permission.',
	},
	'profiles.update': {
		riskLevel: 'write',
		description:
			'Specific Profile. Replaces the name, description, and permission enablement for the profile identified by {id}. System profiles (Administrator, Standard) cannot be updated. See Update Profile Permission.',
	},
	'recordLocking.configurations.create': {
		riskLevel: 'write',
		description:
			'Create record locking configuration. Creates a new record locking configuration for the specified module. You can define locking rules, restricted actions, excluded fields, and other settings.',
	},
	'recordLocking.configurations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete specific record locking configuration. Deletes a specific record locking configuration using the configuration ID provided in the URL path. Cannot be undone.',
	},
	'recordLocking.configurations.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete record locking configuration. Deletes the record locking configuration(s) for the specified module using the provided configuration IDs. Cannot be undone.',
	},
	'recordLocking.configurations.get': {
		riskLevel: 'read',
		description:
			'Get specific record locking configuration. Retrieves a specific record locking configuration using the configuration ID provided in the URL path.',
	},
	'recordLocking.configurations.list': {
		riskLevel: 'read',
		description:
			'Get record locking configuration. Retrieves the existing record locking configuration for the specified module.',
	},
	'recordLocking.configurations.update': {
		riskLevel: 'write',
		description:
			'Update specific record locking configuration. Updates an existing record locking configuration for the specified module using the configuration ID provided in the URL path.',
	},
	'recordLocking.configurations.updateMany': {
		riskLevel: 'write',
		description:
			'Update record locking configuration. Updates an existing record locking configuration for the specified module. You can modify any of the configuration settings.',
	},
	'recordLocking.getLock': {
		riskLevel: 'read',
		description:
			'Get record locking information by ID. To retrieve the locking information details of a specific locked record in your Zoho CRM account using its locking information ID, including the user who locked the record, the lock source, reason, and timestamp.',
	},
	'recordLocking.listLocks': {
		riskLevel: 'read',
		description:
			'Get record locking information. To retrieve the locking information details of a locked record in your Zoho CRM account, including the user who locked the record, the lock source, reason, and timestamp.',
	},
	'recordLocking.lock': {
		riskLevel: 'write',
		description:
			'Lock a record. To lock a record in the specified module of your Zoho CRM account with a reason for locking.',
	},
	'recordLocking.unlock': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove lock from a locked record. To remove the lock from a locked record in the specified module of your Zoho CRM account. Cannot be undone.',
	},
	'recordLocking.updateLock': {
		riskLevel: 'write',
		description:
			'Update locking reason of a locked record. To update the locking reason of a locked record in the specified module of your Zoho CRM account.',
	},
	'recordSharing.list': {
		riskLevel: 'read',
		description:
			'Share Records. To retrieve the share details of a specific record in a module of your Zoho CRM organization. The response lists each entry with the recipient, the access level, and the sharing metadata.',
	},
	'recordSharing.revokeAll': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revoke sharing on a record. To revoke all sharing on a specific record in a module of your Zoho CRM organization. Use this operation to remove access that was previously granted to users, roles, or groups through record-level sharing. Cannot be undone.',
	},
	'recordSharing.share': {
		riskLevel: 'write',
		description:
			'Share a record. To share a specific record in a module with one or more users, roles, or groups. A record can be shared with up to 10 users, 5 roles, and 5 groups. > Note: > - The records can be shared to other users in the organization only if certain conditions are met.',
	},
	'recordSharing.update': {
		riskLevel: 'write',
		description:
			'Update share permissions. To update the sharing permissions of a specific record in a module of your Zoho CRM organization. The update can change the access level, change the visibility between private and public, or alter whether related records are shared along with the record.',
	},
	'records.changeOwner': {
		riskLevel: 'write',
		description:
			'Change Owner. To change the owner of a specific record in the specified CRM module in your Zoho CRM organization. Note: The module name Deals is accepted and internally resolved to Potentials. Meetings is internally resolved to Events.',
	},
	'records.changeOwnerMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Change Owner. Updates the owner of multiple records in the module. Note: The module name Deals is accepted and internally resolved to Potentials. Meetings is internally resolved to Events.',
	},
	'records.clone': {
		riskLevel: 'write',
		description:
			'Record Clone. Clones a record in the specified module. Use the Get Modules API to retrieve the module ID and API name. Use the Get Fields Metadata API to retrieve the field IDs and API names. By default, the field values of the parent record are copied to the cloned record.',
	},
	'records.count': {
		riskLevel: 'read',
		description:
			'Module Record Count. To retrieve the total number of records in a specified Zoho CRM module, optionally filtered by a Custom View or search criteria. The count can be filtered using cvid (Custom View ID) or search parameters (criteria, email, phone, or word).',
	},
	'records.create': {
		riskLevel: 'write',
		description:
			'Create records in a specified module. Creates one or more records in the specified module in your Zoho CRM organization. Use the Get Modules API to retrieve the module API name. Use the Get Fields Metadata API to retrieve the available field API names and data types. You can create up to 100 records in a single API call.',
	},
	'records.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a specific record by ID. To permanently delete a specific record by its unique ID from the specified module in your Zoho CRM organization. Use the Get Records API to retrieve the record IDs. Cannot be undone.',
	},
	'records.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete records from a specified module. To permanently delete more records from the specified module in your Zoho CRM organization, use the Get Records API to retrieve the record IDs. A maximum of 100 records can be deleted per API call. By default, all workflows related to this API are executed. Cannot be undone.',
	},
	'records.deletePhoto': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a record photo. To delete the photo associated with a specific record in your Zoho CRM organization. Cannot be undone.',
	},
	'records.get': {
		riskLevel: 'read',
		description:
			'Get a record by ID from a specified module. To retrieve the details of a specific record by its unique ID from the specified module in your Zoho CRM organization. Use the Get Modules API to retrieve the module ID and API name. Use the Get Records API to retrieve the record IDs.',
	},
	'records.getFullData': {
		riskLevel: 'read',
		description:
			"Rich text field content for a specific record. Retrieves the full content of rich text multi-line fields for a specific record identified by its record ID in the path. The 'fields' query parameter is optional for this endpoint - if omitted, all rich text fields of the record are returned.",
	},
	'records.getFullDataMany': {
		riskLevel: 'read',
		description:
			"Rich text field content for multiple records. Retrieves the full content of rich text multi-line fields for multiple records in a single request. Both the 'ids' and 'fields' query parameters are mandatory. You can specify up to 200 record IDs in the 'ids' parameter and up to 8 rich text field API names in the 'fields' parameter.",
	},
	'records.getMergeStatus': {
		riskLevel: 'read',
		description:
			'Get Merge Job Status. To retrieve the status of a scheduled merge job in your Zoho CRM organization. Use the optional job_id query parameter to filter results to a specific job.',
	},
	'records.getPhoto': {
		riskLevel: 'read',
		description:
			'Get a record photo. To retrieve the photo associated with a specific record in your Zoho CRM organization.',
	},
	'records.list': {
		riskLevel: 'read',
		description:
			'Get records from a specified module. Retrieves records from the specified module in your Zoho CRM organization. Use the Get Modules API to retrieve the module ID and API name. Use "sort_by" and "sort_order" to control the sorting of records. To fetch up to 2000 records, use "page" (1-10) and "per_page" (maximum 200). Pass fields (comma-separated API names, at most 50): Zoho requires it. Up to 200 records a page; page 1-10, then page_token from info.next_page_token for later pages. An empty module answers 204: { success: true }.',
	},
	'records.listDeleted': {
		riskLevel: 'read',
		description:
			'Get deleted records from a specified module. To retrieve the list of deleted records from the specified module in your Zoho CRM organization, including records in the recycle bin and permanently deleted records. Use the Get Modules API to retrieve the module ID and API name.',
	},
	'records.merge': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Merge Records. To merge duplicate records in your Zoho CRM organization into a single master record. Supports field-level value selection from child records and file attachment management. The other records are merged into the master and deleted.',
	},
	'records.search': {
		riskLevel: 'read',
		description:
			'Search Records by Criteria, Word, Email, or Phone. To search for records within a specified module in your Zoho CRM organization using criteria-based conditions, full-text word search, or lookup by email or phone number. Give one of criteria, email, phone or word. No match answers 204: { success: true }.',
	},
	'records.searchMany': {
		riskLevel: 'read',
		description:
			'Bulk Search Records by Criteria, Word, Email, or Phone. Searches for records in the specified module that match the given search criteria. This API accepts the same search parameters as the GET /{module}/search API, but they are provided in the request body instead of query parameters.',
	},
	'records.update': {
		riskLevel: 'write',
		description:
			'Update a specific record by ID. To update the field values of a specific record in the specified module in your Zoho CRM organization. Use the Get Modules API to retrieve the module ID and API name. Use the Get Fields Metadata API to retrieve the field IDs and API names.',
	},
	'records.updateMany': {
		riskLevel: 'write',
		description:
			'Update records in a specified module. Updates one or more existing records in the specified module in your Zoho CRM organization. Use the Get Modules API to retrieve the module API name and the Get Fields Metadata API to retrieve the field API names. A maximum of 100 records can be updated per API call.',
	},
	'records.uploadPhoto': {
		riskLevel: 'write',
		description:
			'Upload a record photo. To upload a photo for a specific record in your Zoho CRM organization.',
	},
	'records.upsert': {
		riskLevel: 'write',
		description:
			'Create or update records in a specified module. The Upsert API inserts a new record or updates an existing record based on duplicate check field values. If a matching record is found, it is updated; otherwise, a new record is inserted. When using the Upsert API, the system checks for duplicate records based on the duplicate check fields.',
	},
	'recycleBin.count': {
		riskLevel: 'read',
		description:
			'Get recycle-bin record count. To retrieve the total count of records currently present in the Recycle Bin in your Zoho CRM account. The count reflects every entry across all modules.',
	},
	'recycleBin.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a recycle-bin record permanently. To permanently delete a single record from the Recycle Bin in your Zoho CRM account using its unique ID. Deleting a parent record also removes all its associated child records from the Recycle Bin, such as Notes and Attachments.',
	},
	'recycleBin.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete recycle-bin records. To permanently delete one or more records from the Recycle Bin in your Zoho CRM account. When deleting a parent record, Zoho CRM also removes all its associated child records from the Recycle Bin, such as Notes and Attachments.',
	},
	'recycleBin.empty': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Empty the Recycle Bin. To permanently delete every record from the Recycle Bin in your Zoho CRM account. This action is irreversible - the records cannot be restored after this operation completes. Deletes every record in the recycle bin for good.',
	},
	'recycleBin.get': {
		riskLevel: 'read',
		description:
			'Get a recycle-bin record. To retrieve metadata for a single record from the Recycle Bin in your Zoho CRM account using its unique ID. The response includes the display name, source module, deletion timestamp, original owner, and the user who deleted the record.',
	},
	'recycleBin.list': {
		riskLevel: 'read',
		description:
			'Get recycle-bin records. To retrieve a paginated list of records currently present in the Recycle Bin in your Zoho CRM account. The response contains up to 200 records per page, along with pagination metadata.',
	},
	'recycleBin.restore': {
		riskLevel: 'write',
		description:
			'Restore a Recycle Bin record. To restore a single deleted record from the Recycle Bin in your Zoho CRM account. The record is moved back to its original module along with all its associated child records, such as Notes and Attachments.',
	},
	'recycleBin.restoreMany': {
		riskLevel: 'write',
		description:
			'Restore multiple Recycle Bin records. To restore one or more deleted records from the Recycle Bin in your Zoho CRM account.',
	},
	'relatedLists.list': {
		riskLevel: 'read',
		description:
			'Related Lists. To retrieve the configuration of related list panels for a specific module in your Zoho CRM organization, including display metadata, available record operations, and layout-specific settings.',
	},
	'relatedRecords.count': {
		riskLevel: 'read',
		description:
			'Get related records count. To retrieve the count of related records for a specified parent record in your Zoho CRM organization. Supports optional filtering by approval status, conversion status, category type, and field-level equality criteria. A single request can include up to 20 related list count specifications.',
	},
	'relatedRecords.delink': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delink a related record. To delink a specific related record from a parent record in your Zoho CRM organization. This operation removes only the relationship link - the related record itself remains intact in its module. Cannot be undone.',
	},
	'relatedRecords.delinkMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delink related records. To delink multiple records from a parent record's related list in your Zoho CRM organization. This operation removes only the relationship links - the related records themselves remain intact in their respective modules. Cannot be undone.",
	},
	'relatedRecords.get': {
		riskLevel: 'read',
		description:
			'Get a related record. To retrieve the details of a specific related record from a specified related list of a parent record in your Zoho CRM organization.',
	},
	'relatedRecords.list': {
		riskLevel: 'read',
		description:
			'Related Records. To retrieve the list of records associated with a parent record from a specified related list in your Zoho CRM organization.',
	},
	'relatedRecords.listDeleted': {
		riskLevel: 'read',
		description:
			'List deleted related records. To retrieve the list of records that were previously associated with a parent record but have since been deleted from the related list in your Zoho CRM organization.',
	},
	'relatedRecords.update': {
		riskLevel: 'write',
		description:
			'Update a related record. To update the properties of a specific record associated with a parent record in your Zoho CRM organization.',
	},
	'relatedRecords.updateMany': {
		riskLevel: 'write',
		description:
			'Update related records. To update multiple records associated with a parent record in a specified related list in your Zoho CRM organization.',
	},
	'roles.create': {
		riskLevel: 'write',
		description:
			'Create a role. Creates a new role in your Zoho CRM organization.',
	},
	'roles.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a role. Deletes a role in your Zoho CRM organization and moves its users to another role. Cannot be undone.',
	},
	'roles.get': {
		riskLevel: 'read',
		description:
			'Get a role. Returns the details of a single role, specified by its ID in the URL.',
	},
	'roles.list': {
		riskLevel: 'read',
		description:
			'Get all roles. Returns the list of all roles configured in your Zoho CRM organization.',
	},
	'roles.update': {
		riskLevel: 'write',
		description:
			'Update a role. Updates a single role, specified by its ID in the URL.',
	},
	'roles.updateMany': {
		riskLevel: 'write',
		description:
			'Update a role. Updates an existing role in your Zoho CRM organization.',
	},
	'scoringRules.activate': {
		riskLevel: 'write',
		description:
			'Activate a scoring rule. Activates an inactive scoring rule identified by ruleId, enabling it to start evaluating and scoring CRM records based on its configured criteria.',
	},
	'scoringRules.clone': {
		riskLevel: 'write',
		description:
			'Clone a scoring rule. To clone a Scoring Rule in your Zoho CRM organization.',
	},
	'scoringRules.create': {
		riskLevel: 'write',
		description:
			'Scoring Rules. Creates one or more scoring rules for specified modules and layouts. Only Leads and Contacts modules support signal rules. Deals, Accounts and Custom Modules do not support signal rules.',
	},
	'scoringRules.deactivate': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deactivate a scoring rule. Deactivates an active scoring rule identified by ruleId, suspending its scoring evaluation without deleting it. Cannot be undone.',
	},
	'scoringRules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a scoring rules by ID. Permanently deletes a single scoring rule identified by ruleId. Cannot be undone.',
	},
	'scoringRules.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Scoring Rules. Permanently deletes multiple scoring rules. Cannot be undone.',
	},
	'scoringRules.get': {
		riskLevel: 'read',
		description:
			'Get scoring rule by ID. To retrieve the details of a specific Scoring Rule by its ID in your Zoho CRM organization.',
	},
	'scoringRules.list': {
		riskLevel: 'read',
		description:
			'Scoring Rules. To retrieve a list of Scoring Rules configured in your Zoho CRM organization.',
	},
	'scoringRules.update': {
		riskLevel: 'write',
		description:
			'Update a scoring rules by ID. To update a specific Scoring Rule by its ID in your Zoho CRM organization.',
	},
	'scoringRules.updateMany': {
		riskLevel: 'write',
		description:
			'Scoring Rules. Updates one or more scoring rules. Returns 200 (all success) or 207 (partial success).',
	},
	'servicePreferences.get': {
		riskLevel: 'read',
		description:
			'Get service preferences. Retrieves the service preference settings of the organization, including whether the job sheet is enabled for service appointments. Use this API to check whether a job sheet can be generated once a service appointment is marked complete.',
	},
	'servicePreferences.update': {
		riskLevel: 'write',
		description:
			'Update service preferences. Updates the service preference settings of the organization. Use this API to enable or disable the job sheet, which controls whether a job sheet can be generated for a service appointment once the appointment is marked complete.',
	},
	'services.create': {
		riskLevel: 'write',
		description:
			'Create service records in Zoho CRM. To create one or more service records in your Zoho CRM organization, submitting up to 100 service objects per request, each configurable with a name, duration, price, location, members, availability type, and availability window.',
	},
	'services.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a service record by ID. To delete a service record from your Zoho CRM organization by its unique ID. When a service record is removed, all appointments associated with that service are also removed; however, deals created upon completion of an appointment under the service are not affected. Cannot be undone.',
	},
	'services.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete one or more service records. To delete one or more service records from your Zoho CRM organization. All appointments associated with the deleted services are also deleted; however, deals created upon completion of those appointments are not deleted. Cannot be undone.',
	},
	'services.get': {
		riskLevel: 'read',
		description:
			'Retrieve a specific service record by ID. To retrieve the full details of a single service record from your Zoho CRM organization using its unique ID, including its availability configuration, members, pricing, tax details, and subform data.',
	},
	'services.list': {
		riskLevel: 'read',
		description:
			'Get services. To retrieve the list of service records in your Zoho CRM organization that match the specified filter criteria. Supports pagination using either the page or page_token parameter and can return up to 100,000 services across paginated requests.',
	},
	'services.update': {
		riskLevel: 'write',
		description:
			'Update a specific service record by ID. To update a single service record in your Zoho CRM organization, identified by its unique ID. Only the fields supplied in the request payload are modified on the targeted service.',
	},
	'services.updateMany': {
		riskLevel: 'write',
		description:
			'Update service records. To update one or more existing service records in your Zoho CRM organization. Each request can include up to 100 service objects identified by their record IDs; only the fields supplied in the payload are modified.',
	},
	'shiftHours.create': {
		riskLevel: 'write',
		description:
			'Add shift hours. Creates one or more shift hour configurations for the organization. Each shift hour specifies the name, time zone, active days, timing, optional break windows, optional holidays, and optional user assignments.',
	},
	'shiftHours.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a shift hour. Deletes the shift hour identified by the shift path parameter. Once deleted, the shift hour configuration and all of its user assignments are removed. Cannot be undone.',
	},
	'shiftHours.get': {
		riskLevel: 'read',
		description:
			'Get a shift hour. Retrieves the configuration of the shift hour identified by the shift path parameter, including its timing, break hours, holidays, time zone, and the users assigned to it.',
	},
	'shiftHours.list': {
		riskLevel: 'read',
		description:
			'Get shift hours. Retrieves every shift hour configured for the organization, along with the timing, break hours, holidays, time zone, and assigned users of each shift, and an aggregate count of shifts that have at least one user assigned.',
	},
	'shiftHours.update': {
		riskLevel: 'write',
		description:
			'Update a shift hour. Updates the configuration of the shift hour identified by the shift path parameter. The request body specifies the fields to change, such as the time zone, active days, timing, break windows, holidays, or user assignments. The updated timing must fall within the configured business hours.',
	},
	'shiftHours.updateMany': {
		riskLevel: 'write',
		description:
			'Update shift hours. Updates one or more shift hour configurations for the organization. Each entry in shift_hours identifies the shift hour to update and the fields to change, such as the time zone, active days, timing, break windows, holidays, or user assignments.',
	},
	'tags.addToRecord': {
		riskLevel: 'write',
		description:
			'Add Tags to a Record. Adds tags to a specific record in the specified module.',
	},
	'tags.addToRecords': {
		riskLevel: 'write',
		description:
			'Add Tags to Records. Associates tags to one or more records in the specified module.',
	},
	'tags.create': {
		riskLevel: 'write',
		description:
			'Tags. To create tags for a module in your Zoho CRM organization.',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete tag by ID. To delete a tag by its ID from your Zoho CRM organization. Cannot be undone.',
	},
	'tags.getRecordsCount': {
		riskLevel: 'read',
		description:
			'Get Tag Records Count. Retrieves the number of records associated with a specific tag, including workflow, blueprint, and orchestration usage details.',
	},
	'tags.list': {
		riskLevel: 'read',
		description:
			'Tags. To retrieve all tags associated with a module in your Zoho CRM organization.',
	},
	'tags.merge': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Merge Tags. Merges two tags into one, combining their associated records and metadata. The tag specified in the path parameter (id) is the master tag that will remain after the merge. The conflict_id in the request body specifies the tag to be merged into the master tag.',
	},
	'tags.removeFromRecord': {
		riskLevel: 'write',
		description:
			'Remove Tags from a Record. Removes tags from a specific record in the specified module.',
	},
	'tags.removeFromRecords': {
		riskLevel: 'write',
		description:
			'Remove Tags from Records. Removes tags from one or more records in the specified module.',
	},
	'tags.update': {
		riskLevel: 'write',
		description:
			'Update tag by ID. To update the details of a specific tag by its ID in your Zoho CRM organization.',
	},
	'tags.updateMany': {
		riskLevel: 'write',
		description:
			'Tags. To update an existing tag in your Zoho CRM organization.',
	},
	'territories.assignToRecord': {
		riskLevel: 'write',
		description:
			'Assign territories to a record. To assign one or more territories to a single record in your Zoho CRM organization.',
	},
	'territories.assignToRecords': {
		riskLevel: 'write',
		description:
			'Assign territories to multiple records. To assign one or more territories to multiple records in your Zoho CRM organization.',
	},
	'territories.create': {
		riskLevel: 'write',
		description:
			'Create Territories. To create one or more territories in your Zoho CRM organization.',
	},
	'territories.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a territory by ID. To delete a specific territory from your Zoho CRM organization using its unique ID. Cannot be undone.',
	},
	'territories.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete territories. To delete one or more territories from your Zoho CRM organization. The territories to delete are specified using the ids query parameter. Deleting a territory is irreversible; child territories must be transferred before a parent territory can be deleted. Cannot be undone.',
	},
	'territories.get': {
		riskLevel: 'read',
		description:
			'Get territory by ID. To retrieve the details of a specific territory in your Zoho CRM organization using its unique ID.',
	},
	'territories.getAssociatedUsersCount': {
		riskLevel: 'read',
		description:
			'Get territory-associated user counts. To retrieve the number of users associated with each territory in your Zoho CRM organization.',
	},
	'territories.getScheduledRunRuleJobs': {
		riskLevel: 'read',
		description:
			'Get scheduled territory run rule job status. To retrieve the status of a scheduled territory rule execution job in your Zoho CRM organization by specifying the job_id parameter.',
	},
	'territories.list': {
		riskLevel: 'read',
		description:
			'Get all territories. To retrieve the list of territories enabled for your Zoho CRM organization.',
	},
	'territories.listChildren': {
		riskLevel: 'read',
		description:
			'Get child territories by parent territory ID. To retrieve the list of child territories for a specific parent territory in your Zoho CRM organization.',
	},
	'territories.removeFromRecord': {
		riskLevel: 'write',
		description:
			'Remove territories from a record. To remove one or more territories from a single record in your Zoho CRM organization. This operation is supported for records in the Leads, Accounts, Contacts, and Deals modules.',
	},
	'territories.removeFromRecords': {
		riskLevel: 'write',
		description:
			'Remove territories from multiple records. To remove one or more territories from multiple records in your Zoho CRM organization. Supported modules are Leads, Accounts, Contacts, and Deals. The removal can be processed synchronously or scheduled as a background job, depending on the number of records.',
	},
	'territories.runRules': {
		riskLevel: 'write',
		description:
			'Run territory assignment rules. To schedule territory assignment rules to run against records in a specified module in your Zoho CRM organization. The rules can be applied based on filter criteria, a Custom View, or specific territories, and the execution is queued as a background job.',
	},
	'territories.transferAndDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Transfer and delete a specific territory by ID. To transfer child territories to a target parent territory and then delete a specific territory from your Zoho CRM organization. This operation is required for territories that have child territories, as they cannot be directly deleted using the Delete Territories API.',
	},
	'territories.transferAndDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Transfer and delete territories. To transfer records from one or more territories to a target territory and then delete those territories in your Zoho CRM organization.',
	},
	'territories.update': {
		riskLevel: 'write',
		description:
			'Update a specific territory by its ID. To update the details of a specific territory by its unique ID in your Zoho CRM organization.',
	},
	'territories.updateMany': {
		riskLevel: 'write',
		description:
			'Update territories. To update the details of one or more territories in your Zoho CRM organization.',
	},
	'territories.users.associate': {
		riskLevel: 'write',
		description:
			'Territory User. To associate a specific user with a territory in your Zoho CRM organization.',
	},
	'territories.users.associateMany': {
		riskLevel: 'write',
		description:
			'Territory Users. To associate one or more users with a territory in your Zoho CRM organization.',
	},
	'territories.users.deassociate': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Territory User. To disassociate a specific user from a territory in your Zoho CRM organization. Cannot be undone.',
	},
	'territories.users.deassociateMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Territory Users. To disassociate one or more users from a territory in your Zoho CRM organization. Cannot be undone.',
	},
	'territories.users.get': {
		riskLevel: 'read',
		description:
			'Specific Territory User. To retrieve the details of a specific user associated with a territory in your Zoho CRM organization.',
	},
	'territories.users.list': {
		riskLevel: 'read',
		description:
			'Territory Users. To retrieve the list of users associated with a territory in your Zoho CRM organization.',
	},
	'timelines.list': {
		riskLevel: 'read',
		description:
			'Get Timelines. To retrieve a paginated list of timeline entries for a specific record in your Zoho CRM organization. Each timeline entry captures an audited event such as field changes, ownership transfers, workflow actions, Approval Process progressions, Scoring Rule updates, and signal events from extensions.',
	},
	'unsubscribeLinks.create': {
		riskLevel: 'write',
		description:
			'Create Unsubscribe Link. To create an unsubscribe link that can be used in email templates or email footers. You can configure the link to display a standard Zoho CRM unsubscribe page or redirect to a custom webpage.',
	},
	'unsubscribeLinks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Unsubscribe Link by ID. To delete a specific unsubscribe link. Note that the default unsubscribe link cannot be deleted. Cannot be undone.',
	},
	'unsubscribeLinks.get': {
		riskLevel: 'read',
		description:
			'Get Unsubscribe Link by ID. To retrieve the complete configuration details of a specific unsubscribe link using its ID. This includes page settings, submission behavior, timestamps, and creator information.',
	},
	'unsubscribeLinks.getAssociations': {
		riskLevel: 'read',
		description:
			'Get Unsubscribe Link Associations. To retrieve information about where unsubscribe links are being used (associated places) in your CRM account, such as in email templates.',
	},
	'unsubscribeLinks.list': {
		riskLevel: 'read',
		description:
			'Get Unsubscribe Links. To retrieve the details of all unsubscribe links configured in your CRM account. This API returns a list of unsubscribe links with their complete configuration, including page type, submission behavior, timestamps, and creator information.',
	},
	'unsubscribeLinks.update': {
		riskLevel: 'write',
		description:
			"Update Unsubscribe Link by ID. To update a specific unsubscribe link. You can modify the link's name, page type, custom URL, standard page message, submission action type, redirect URL, or submission message.",
	},
	'unsubscribeLinks.updateMany': {
		riskLevel: 'write',
		description:
			"Update Unsubscribe Links. To update one or more unsubscribe links in bulk. You can modify the link's name, page type, custom URL, standard page message, submission action type, redirect URL, or submission message.",
	},
	'userGroups.create': {
		riskLevel: 'write',
		description:
			'Create a user group. To create a new user group in your Zoho CRM organization with a specified name, optional description, and member sources (users, roles, or territories).',
	},
	'userGroups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a user group. To delete an existing user group from your Zoho CRM organization. The deletion may be immediate or scheduled for background processing, depending on group size and active references. Cannot be undone.',
	},
	'userGroups.get': {
		riskLevel: 'read',
		description:
			'Get a user group. To retrieve the details of a specific user group in your Zoho CRM organization by its unique ID, with optional inclusion of member source counts.',
	},
	'userGroups.getAssociatedUsersCount': {
		riskLevel: 'read',
		description:
			'Get associated users count per user group. To retrieve the count of users associated with user groups in your Zoho CRM organization, optionally filtered by group criteria.',
	},
	'userGroups.getAssociations': {
		riskLevel: 'read',
		description:
			'Get associations for a user group. To retrieve the list of CRM resources, such as sharing rules, workflows, assignment rules, and approval processes, that are associated with a specific user group in your Zoho CRM organization.',
	},
	'userGroups.getSources': {
		riskLevel: 'read',
		description:
			'Get sources for a user group. To retrieve the paginated list of member sources configured for a specific user group in your Zoho CRM organization.',
	},
	'userGroups.getSourcesCount': {
		riskLevel: 'read',
		description:
			'Get source counts for a user group. To retrieve the count of member sources by type (users, roles, territories, and groups) for a specific user group in your Zoho CRM organization.',
	},
	'userGroups.list': {
		riskLevel: 'read',
		description:
			'Get user groups. To retrieve a paginated list of user groups configured in your Zoho CRM organization, with optional filtering by name or criteria, and optional inclusion of member source counts.',
	},
	'userGroups.listForUser': {
		riskLevel: 'read',
		description:
			'Get associated groups for a user. To retrieve the paginated list of user groups associated with a specific user in your Zoho CRM organization, with optional inclusion of member sources and source counts.',
	},
	'userGroups.update': {
		riskLevel: 'write',
		description:
			'Update a user group. To update the name, description, and member sources of an existing user group in your Zoho CRM organization.',
	},
	'users.create': {
		riskLevel: 'destructive',
		description:
			"Create User. To create a new user record in your Zoho CRM organization. The request body must contain a users array with one user object including the required fields such as email, role, profile, and first name. Each active user takes one of the org's user licences (the Free edition has 3).",
	},
	'users.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a user from the organization. To delete a specific user from your Zoho CRM organization, submit a DELETE request with the target user ID. Only one user can be removed per request, and certain protected user types — including support, system, Digital Employee, and primary contact users — cannot be deleted. Cannot be undone.',
	},
	'users.get': {
		riskLevel: 'read',
		description:
			'Get a specific user. To retrieve the details of a specific user in Zoho CRM, use the unique user ID as the path parameter.',
	},
	'users.getTransferAndDeleteStatus': {
		riskLevel: 'read',
		description:
			'Get transfer and delete status. Retrieves the current status of a transfer and delete operation using the job ID returned by the POST request. The response indicates whether the job is scheduled, in progress, completed, or failed.',
	},
	'users.getTransferStatus': {
		riskLevel: 'read',
		description:
			'Get user transfer status. Retrieves the current status of a user transfer operation using the job ID returned by the transfer request. The response indicates whether the transfer job is scheduled, in progress, completed, or failed.',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'Get users. To retrieve all users in your Zoho CRM organization based on the specified filter parameters, including type, role, query criteria, and field selection.',
	},
	'users.territories.associateMany': {
		riskLevel: 'write',
		description:
			'Add territories to a user. To associate one or more territories with a specific user in your Zoho CRM organization.',
	},
	'users.territories.get': {
		riskLevel: 'read',
		description:
			'Specific territory of a user. To retrieve a specific territory assigned to a user in your Zoho CRM organization.',
	},
	'users.territories.list': {
		riskLevel: 'read',
		description:
			'Get territories of a user. To retrieve all territories assigned to a specific user in your Zoho CRM organization.',
	},
	'users.territories.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove territory from a user. To remove a specific territory from a user in your Zoho CRM organization. Cannot be undone.',
	},
	'users.territories.removeMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove territories from a user. To remove one or more territories from a user in your Zoho CRM organization. Cannot be undone.',
	},
	'users.transfer': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Transfer a user. Transfer user records, assignments, and criteria to another user.',
	},
	'users.transferAndDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Transfer and delete a user. Transfer user records, assignments, and criteria to another user.',
	},
	'users.transferAndDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Transfer and delete a user. Transfer user records, assignments, and criteria to another user.',
	},
	'users.update': {
		riskLevel: 'write',
		description:
			'Update a single user by user ID. To update the details of a specific user in your Zoho CRM organization by user ID.',
	},
	'users.updateMany': {
		riskLevel: 'write',
		description:
			'Update users. To update the details of one or more users in your Zoho CRM organization. The request must include a users array with up to 10 user records, each identified by a unique user ID. You can update user profile settings, role assignments, locale preferences, and other account details.',
	},
	'users.validateBeforeTransfer': {
		riskLevel: 'read',
		description:
			"Validate user before transfer. Validates whether the specified user has open records, assignments, criteria configurations, subordinates, or alerts before transferring the user's data. Use this operation to check the user's dependencies before initiating a transfer.",
	},
	'variableGroups.generateApiName': {
		riskLevel: 'write',
		description:
			'Generate API Name. To generate an available API name for a new variable group in your Zoho CRM organization. Submit the proposed display name in the request, and the API returns a suggested api_name that complies with the naming requirements.',
	},
	'variableGroups.get': {
		riskLevel: 'read',
		description:
			'Get variable group by ID. To retrieve the details of a specific variable group by its ID in your Zoho CRM organization.',
	},
	'variableGroups.list': {
		riskLevel: 'read',
		description:
			'Variable Groups. To retrieve a list of all variable groups in your Zoho CRM organization.',
	},
	'variableGroups.update': {
		riskLevel: 'write',
		description:
			'Update variable group by ID. To update the details of a specific variable group by its ID in your Zoho CRM organization.',
	},
	'variableGroups.updateMany': {
		riskLevel: 'write',
		description:
			'Variable Groups. To update the details of one or more variable groups in your Zoho CRM organization. The request accepts a maximum of 10 variable group items. When individual items succeed or fail independently, the API returns a 207 multi-status response with per-item results.',
	},
	'variables.create': {
		riskLevel: 'write',
		description:
			'Create variables. Creates one or more CRM variables. The name, api_name, and variable_group keys are mandatory. The type key specifies the data type of the variable. Possible types: integer, text, percent, decimal, currency, date, datetime, email, phone, url, checkbox, textarea, long.',
	},
	'variables.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Specific variable. Deletes a specific CRM variable identified by its ID. A variable that is associated with other features such as email templates, webhooks, or functions cannot be deleted until the association is removed. Requires the ZohoCRM.settings.variables.DELETE scope. Cannot be undone.',
	},
	'variables.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete variables. Deletes one or more CRM variables by their IDs. Pass variable IDs as a comma-separated list in the ids query parameter, or pass rids in the rids query parameter. Cannot be undone.',
	},
	'variables.generateApiName': {
		riskLevel: 'write',
		description:
			'Generate API Name. generates api name. (POST /crm/v8/settings/variables/actions/generate_api_name)',
	},
	'variables.get': {
		riskLevel: 'read',
		description:
			'specific variable. Retrieves the details of a specific CRM variable by its ID. The group query parameter, specifying the variable group ID or API name, is mandatory when retrieving a specific variable. Requires the ZohoCRM.settings.variables.READ scope.',
	},
	'variables.getAssociations': {
		riskLevel: 'read',
		description: 'Variable Associations. Get associated variables.',
	},
	'variables.list': {
		riskLevel: 'read',
		description:
			'Retrieve all variables. Retrieves all available CRM variables. Returns the API name, display name, description, type, value, and variable group for each variable. Requires the ZohoCRM.settings.variables.READ scope.',
	},
	'variables.update': {
		riskLevel: 'write',
		description:
			'Specific variable. Updates a specific CRM variable identified by its ID or API name. You cannot update the type or variable group of the variable. For the list of updatable input keys, refer to the Create Variables operation. Requires the ZohoCRM.settings.variables.UPDATE scope.',
	},
	'variables.updateMany': {
		riskLevel: 'write',
		description:
			'Update variables. Updates one or more CRM variables in a single request. The id key is mandatory in the request body to identify each variable. You cannot update the type or variable group of a variable. Requires the ZohoCRM.settings.variables.UPDATE scope.',
	},
	'webforms.create': {
		riskLevel: 'write',
		description:
			'Create a new webform in Zoho CRM. To create a new webform in Zoho CRM with full configuration, including module assignment, layout, form fields, button attributes, analytics settings, double opt-in, spam control, visitor tracking, and portal form support. A single webform may be submitted per request.',
	},
	'webforms.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a webform by ID. To delete a specific webform from your Zoho CRM organization, send a DELETE request with the webform ID. The webform is permanently removed and the operation cannot be undone. Cannot be undone.',
	},
	'webforms.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete webforms by IDs. To delete multiple webforms from Zoho CRM, specify the IDs of the webforms to be removed. Note: - When multiple Webform IDs are passed, if some deletions succeed and others fail, the API responds with 207 Multi-Status. Check the status key in each response item to see the result of each deletion. Cannot be undone.',
	},
	'webforms.get': {
		riskLevel: 'read',
		description:
			'Retrieve a webform by ID. To retrieve a specific webform by its ID, use this endpoint in Zoho CRM. The operation returns the configuration and details of a single webform record identified by the required path parameter.',
	},
	'webforms.getAssociated': {
		riskLevel: 'read',
		description:
			'Get webform associations. To retrieve association details for a specific webform in Zoho CRM, including linked records, orchestration entries, and transition rules tied to the webform.',
	},
	'webforms.getDiff': {
		riskLevel: 'read',
		description:
			'Get webform diff. Retrieves the field-level differences between two webforms in the CRM organization. The base_form and variant_form query parameters identify the two forms to compare. The response lists all fields that differ between the two forms, including added, removed, and modified fields.',
	},
	'webforms.getPreview': {
		riskLevel: 'read',
		description:
			'Retrieve webform source code and embed options. To retrieve the HTML source code and embed options for a specific webform configured in your Zoho CRM organization.',
	},
	'webforms.getSuggestions': {
		riskLevel: 'read',
		description:
			'Get optimization suggestions for a webform. To retrieve AI-powered optimization suggestions for a specific webform in Zoho CRM, including recommended fields, format improvements, and variant configurations based on the webform performance data.',
	},
	'webforms.list': {
		riskLevel: 'read',
		description:
			'Get webforms. To retrieve all webforms from your Zoho CRM organization.',
	},
	'webforms.update': {
		riskLevel: 'write',
		description:
			'Update a specific webform by ID. To update a specific webform in Zoho CRM by its ID, send a PUT request with a webforms array containing one webform object and the required module query parameter (for example, Leads).',
	},
	'webforms.updateMany': {
		riskLevel: 'write',
		description:
			'Update webforms in Zoho CRM. To update the settings of a webform in Zoho CRM, including its name, module, layout, form fields, double opt-in configuration, analytics settings, visitor tracking, spam control, and action on submit.',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Webhooks. To create a webhook action that fires an HTTP request to an external URL in your Zoho CRM organization when an automation trigger fires. The http_method value controls which optional request fields are accepted.',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a webhook by ID. To delete a specific webhook configured in your Zoho CRM organization using its unique ID. Read-only webhooks created by Marketplace extensions cannot be deleted. Webhooks associated with active Workflow Rules, Approval Processes, Blueprints, or Command Center also cannot be deleted. Cannot be undone.',
	},
	'webhooks.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete one or more webhooks. To delete one or more webhook actions configured in your Zoho CRM account. Up to 10 webhooks can be deleted in a single API call using the ids query parameter. Read-only webhooks created by Zoho extensions cannot be deleted. Cannot be undone.',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description:
			'Get webhook by ID. To retrieve the configuration of a specific webhook in your Zoho CRM organization using its ID. Use the Get Webhooks API first to discover webhook IDs.',
	},
	'webhooks.getAssociatedModules': {
		riskLevel: 'read',
		description:
			"Get webhook-associated modules. To retrieve the list of CRM modules that have at least one webhook currently associated in your Zoho CRM organization. Results are filtered based on the requesting user's module access permissions. Use these module API names as valid values for the module filter when querying webhook failures.",
	},
	'webhooks.getFailures': {
		riskLevel: 'read',
		description:
			'Get webhook execution failure records. To retrieve detailed information about webhook execution failures in your Zoho CRM organization. Optionally filter results by module, webhook ID, and date range. If the from and to parameters are not specified, the API returns webhook failures from the last 30 days by default.',
	},
	'webhooks.getUsageReports': {
		riskLevel: 'read',
		description:
			'Get webhook action usage reports. To retrieve usage statistics for webhook actions executed in your Zoho CRM organization. Specify the group_by parameter to control the granularity of results; optionally filter by automation feature type and date range.',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'Get webhooks. To retrieve the list of all webhook action configurations available in your Zoho CRM organization. The response contains summary-level data for each webhook, including the module, URL, HTTP method, feature type, and audit metadata.',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description:
			'Update webhook by ID. To update the configuration of a specific webhook in your Zoho CRM organization using its ID. The module field cannot be changed after webhook creation. Read-only webhooks created by Marketplace extensions cannot be updated.',
	},
	'webhooks.updateMany': {
		riskLevel: 'write',
		description:
			'Update webhooks. To update the configuration of an existing webhook in your Zoho CRM organization. The module field cannot be changed after creation. The request body must contain a webhooks array with exactly one webhook object. To retrieve valid module API names, refer to the Get Modules resource.',
	},
	'wizards.create': {
		riskLevel: 'write',
		description:
			'Wizards. Creates a wizard configuration for a specified module.',
	},
	'wizards.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Wizard. Deletes the specified wizard configuration. Cannot be undone.',
	},
	'wizards.get': {
		riskLevel: 'read',
		description:
			'Get wizard details. To retrieve the complete configuration of a single wizard in your Zoho CRM organization, including its containers, screens, segments, buttons, and conditional rules.',
	},
	'wizards.list': {
		riskLevel: 'read',
		description:
			'Get all wizard configurations. To retrieve the wizard configurations available in your Zoho CRM organization. The response can be filtered by module using the module query parameter.',
	},
	'wizards.update': {
		riskLevel: 'write',
		description:
			'Wizard. Updates the specified wizard including screens, containers, field configurations, and rules - based on the data provided in the request.',
	},
	'workflowRules.create': {
		riskLevel: 'write',
		description:
			'Create a workflow rule for a module. To create a workflow rule for a specified module in your Zoho CRM organization. Each request accepts exactly one rule, defined within the workflow_rules array.',
	},
	'workflowRules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a workflow rule by ID. To delete a workflow rule from your Zoho CRM organization by its unique ID. Locked workflow rules cannot be deleted. Cannot be undone.',
	},
	'workflowRules.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One or More Workflow Rules. To delete one or more workflow rules from your Zoho CRM organization. You can delete up to ten workflow rules in a single API call; when some deletions succeed and others fail, the API responds with a 207 Multi-Status. Cannot be undone.',
	},
	'workflowRules.get': {
		riskLevel: 'read',
		description:
			'Retrieve Workflow Rule by ID. To retrieve the complete configuration of a specific workflow rule in your Zoho CRM organization, including its trigger type, execution criteria, conditions, instant actions, scheduled actions, and lock status.',
	},
	'workflowRules.getActionsCount': {
		riskLevel: 'read',
		description:
			'Get Workflow Rule Action Counts. To retrieve the total number of actions configured in the specified workflow rules in your Zoho CRM organization, including counts categorized by action type across both instant and scheduled actions.',
	},
	'workflowRules.getConfigurations': {
		riskLevel: 'read',
		description:
			'Workflow Configuration. Retrieves the available triggers, actions, and related trigger details for a specific module. Use this endpoint before creating or updating workflow rules to discover which triggers and actions are supported, their per-type limits, scheduling compatibility, and related module triggers.',
	},
	'workflowRules.getCount': {
		riskLevel: 'read',
		description:
			'Get Workflow Rule Quota and Usage Counts. To retrieve the organization-level quota and current usage counts for workflow rules and actions in your Zoho CRM organization.',
	},
	'workflowRules.getModuleActionsCount': {
		riskLevel: 'read',
		description:
			'Get Active and Total Workflow Rule Counts by Module. To retrieve the count of active and total workflow rules configured for each module in your Zoho CRM organization.',
	},
	'workflowRules.getUsage': {
		riskLevel: 'read',
		description:
			'Retrieve Action Usage for a Workflow Rule. To retrieve the action usage report for a specific workflow rule in your Zoho CRM organization, including trigger count and per-action success, failure, and queue metrics, as well as email engagement statistics. Results are scoped to a configurable date range.',
	},
	'workflowRules.list': {
		riskLevel: 'read',
		description:
			'List Workflow Rules in your Zoho CRM Organization. To retrieve the list of workflow rules configured in your Zoho CRM organization, including their trigger conditions, module associations, and action configurations.',
	},
	'workflowRules.reorder': {
		riskLevel: 'write',
		description:
			'Update Workflow Rule Execution Order for Module. To update the execution order of workflow rules for a specific module in your Zoho CRM organization. By default, rules execute in the order in which they were created. If any of the specified rule IDs are invalid, the entire request fails and no partial updates are applied.',
	},
	'workflowRules.update': {
		riskLevel: 'write',
		description:
			"Update Workflow Rule by ID. To update an existing workflow rule in your Zoho CRM organization, use this operation with the rule's unique ID. You can modify the rule's name, description, triggers, criteria, conditions, and actions, or activate and deactivate the rule.",
	},
	'workflowRules.updateMany': {
		riskLevel: 'write',
		description:
			"Update workflow rules by ID in the request body. To update one or more existing workflow rules in your Zoho CRM organization, submit a workflow_rules array in the request body with each entry containing the rule's id. You can modify a rule's name, description, criteria, conditions, actions, and active status.",
	},
	'workflowTasks.create': {
		riskLevel: 'write',
		description:
			'Create an Automation Task. PURPOSE: Creates an automation task definition used by workflow rules, approval processes, blueprints, kiosks, scoring rules, and case escalation rules. PREREQUISITES: (1) Call GET /settings/automation/tasks to check existing task definitions and avoid duplicates.',
	},
	'workflowTasks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Automation Task. PURPOSE: Deletes a single automation task definition by its ID. MANDATORY: id path parameter (string - automation task definition ID, not a Task record ID). KEY CONSTRAINTS: Tasks associated with active workflow rules, approval processes, or blueprints cannot be deleted (returns NOT_ALLOWED). Cannot be undone.',
	},
	'workflowTasks.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete automation task definitions by IDs (bulk). PURPOSE: Deletes one or more automation task definitions by their IDs. MANDATORY: ids query parameter (comma-separated task IDs, max 10). KEY CONSTRAINTS: Tasks associated with active workflow rules, approval processes, or blueprints cannot be deleted (returns NOT_ALLOWED error). Cannot be undone.',
	},
	'workflowTasks.get': {
		riskLevel: 'read',
		description:
			'Automation Task. PURPOSE: Retrieves the full details of a specific automation task definition including field mappings, module association, lock status, and metadata. MANDATORY: id path parameter (string - automation task definition ID, not a Task record ID). Returns 204 if the task does not exist.',
	},
	'workflowTasks.list': {
		riskLevel: 'read',
		description:
			'List automation task definitions with optional filters. PURPOSE: Retrieves a paginated list of automation task definitions. Supports filtering by module, feature_type, and name (via filter param). PAGINATION: page (default 1), per_page (default 200, max 200). Use info.more_records to determine if additional pages exist.',
	},
	'workflowTasks.update': {
		riskLevel: 'write',
		description:
			'Automation Task. PURPOSE: Updates an existing automation task definition identified by the path parameter ID. PREREQUISITES: (1) Call GET /settings/automation/tasks/{id} to obtain the current task structure.',
	},
	'workflowTasks.updateMany': {
		riskLevel: 'write',
		description:
			'Update an automation task definition by ID (full replacement). PURPOSE: Updates an existing automation task definition identified by the path parameter ID. PREREQUISITES: (1) Call GET /settings/automation/tasks/{id} to obtain the current task structure.',
	},
	'zia.enrichment.create': {
		riskLevel: 'write',
		description:
			'Zia Data Enrichment Configuration. Creates Zia Enrichment Configurations for a specific module. Use the Get Fields Metadata API to get CRM field IDs and API names, and the Get Modules API to get module IDs and API names.',
	},
	'zia.enrichment.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Zia Enrichment Configuration for a specific module. Deletes a Zia Enrichment Configuration for a specific module by ID. Use the Get Modules API to retrieve module ID. Cannot be undone.',
	},
	'zia.enrichment.get': {
		riskLevel: 'read',
		description:
			'Get Zia Enrichment Configuration for a specific module. Retrieves a specific Zia Enrichment Configuration by ID. Use the Get Fields Metadata API to get CRM field IDs and API names, and the Get Modules API to get module IDs and API names for reference.',
	},
	'zia.enrichment.list': {
		riskLevel: 'read',
		description:
			'Data Enrichment. Use this API to get the details of configuration for data enrichment. This API gives you the mapping of the enrich fields with their corresponding CRM fields for enriching data. Use the Get Modules API to get module IDs and API names for filtering or reference.',
	},
	'zia.enrichment.update': {
		riskLevel: 'write',
		description:
			'Update Zia Enrichment Configurations for a specific module. Updates Zia Enrichment Configurations for a specific module by ID. Use the Get Fields Metadata API to get CRM field IDs and API names, and the Get Modules API to get module IDs and API names.',
	},
	'zia.orgEnrichment.create': {
		riskLevel: 'destructive',
		description:
			'Trigger organization-level enrichment for a CRM record. To submit a request that schedules a Zia organization enrichment job in your Zoho CRM organization.',
	},
	'zia.orgEnrichment.get': {
		riskLevel: 'read',
		description:
			'Org Enrichment Details. Fetches the enrichment status and enriched organization data for a specific enrichment job using its unique ID. Returns completed, scheduled, or failed enrichment information along with enriched fields such as name, website, email, address, CEO, revenue, employees, social media, and industries.',
	},
	'zia.orgEnrichment.list': {
		riskLevel: 'read',
		description:
			'Get Zia Org Enrichment. To retrieve the paginated list of Zia organization enrichment jobs that have been scheduled in your Zoho CRM organization. Each entry includes the job identifier, current status, creation timestamp, and the user who triggered the job.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof zohocrmEndpointsNested>;
