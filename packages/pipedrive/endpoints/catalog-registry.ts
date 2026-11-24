// Generated from Pipedrive's official v1/v2 OpenAPI contracts.
import { createPipedriveCatalogEndpoint } from './catalog-runtime';
import { PipedriveCatalog } from './catalog-schemas';

export const pipedriveCatalogEndpointFunctions = {
	'apiV1.activityFields.getActivityFields': createPipedriveCatalogEndpoint(
		'apiV1.activityFields.getActivityFields',
		PipedriveCatalog['apiV1.activityFields.getActivityFields'],
	),
	'apiV1.activityTypes.getActivityTypes': createPipedriveCatalogEndpoint(
		'apiV1.activityTypes.getActivityTypes',
		PipedriveCatalog['apiV1.activityTypes.getActivityTypes'],
	),
	'apiV1.activityTypes.addActivityType': createPipedriveCatalogEndpoint(
		'apiV1.activityTypes.addActivityType',
		PipedriveCatalog['apiV1.activityTypes.addActivityType'],
	),
	'apiV1.activityTypes.deleteActivityType': createPipedriveCatalogEndpoint(
		'apiV1.activityTypes.deleteActivityType',
		PipedriveCatalog['apiV1.activityTypes.deleteActivityType'],
	),
	'apiV1.activityTypes.updateActivityType': createPipedriveCatalogEndpoint(
		'apiV1.activityTypes.updateActivityType',
		PipedriveCatalog['apiV1.activityTypes.updateActivityType'],
	),
	'apiV1.billing.getCompanyAddons': createPipedriveCatalogEndpoint(
		'apiV1.billing.getCompanyAddons',
		PipedriveCatalog['apiV1.billing.getCompanyAddons'],
	),
	'apiV1.callLogs.addCallLog': createPipedriveCatalogEndpoint(
		'apiV1.callLogs.addCallLog',
		PipedriveCatalog['apiV1.callLogs.addCallLog'],
	),
	'apiV1.callLogs.getUserCallLogs': createPipedriveCatalogEndpoint(
		'apiV1.callLogs.getUserCallLogs',
		PipedriveCatalog['apiV1.callLogs.getUserCallLogs'],
	),
	'apiV1.callLogs.deleteCallLog': createPipedriveCatalogEndpoint(
		'apiV1.callLogs.deleteCallLog',
		PipedriveCatalog['apiV1.callLogs.deleteCallLog'],
	),
	'apiV1.callLogs.getCallLog': createPipedriveCatalogEndpoint(
		'apiV1.callLogs.getCallLog',
		PipedriveCatalog['apiV1.callLogs.getCallLog'],
	),
	'apiV1.callLogs.addCallLogAudioFile': createPipedriveCatalogEndpoint(
		'apiV1.callLogs.addCallLogAudioFile',
		PipedriveCatalog['apiV1.callLogs.addCallLogAudioFile'],
	),
	'apiV1.channels.addChannel': createPipedriveCatalogEndpoint(
		'apiV1.channels.addChannel',
		PipedriveCatalog['apiV1.channels.addChannel'],
	),
	'apiV1.channels.deleteChannel': createPipedriveCatalogEndpoint(
		'apiV1.channels.deleteChannel',
		PipedriveCatalog['apiV1.channels.deleteChannel'],
	),
	'apiV1.channels.receiveMessage': createPipedriveCatalogEndpoint(
		'apiV1.channels.receiveMessage',
		PipedriveCatalog['apiV1.channels.receiveMessage'],
	),
	'apiV1.channels.deleteConversation': createPipedriveCatalogEndpoint(
		'apiV1.channels.deleteConversation',
		PipedriveCatalog['apiV1.channels.deleteConversation'],
	),
	'apiV1.currencies.getCurrencies': createPipedriveCatalogEndpoint(
		'apiV1.currencies.getCurrencies',
		PipedriveCatalog['apiV1.currencies.getCurrencies'],
	),
	'apiV1.deals.getArchivedDeals': createPipedriveCatalogEndpoint(
		'apiV1.deals.getArchivedDeals',
		PipedriveCatalog['apiV1.deals.getArchivedDeals'],
	),
	'apiV1.deals.getDealsSummary': createPipedriveCatalogEndpoint(
		'apiV1.deals.getDealsSummary',
		PipedriveCatalog['apiV1.deals.getDealsSummary'],
	),
	'apiV1.deals.getArchivedDealsSummary': createPipedriveCatalogEndpoint(
		'apiV1.deals.getArchivedDealsSummary',
		PipedriveCatalog['apiV1.deals.getArchivedDealsSummary'],
	),
	'apiV1.deals.getDealsTimeline': createPipedriveCatalogEndpoint(
		'apiV1.deals.getDealsTimeline',
		PipedriveCatalog['apiV1.deals.getDealsTimeline'],
	),
	'apiV1.deals.getArchivedDealsTimeline': createPipedriveCatalogEndpoint(
		'apiV1.deals.getArchivedDealsTimeline',
		PipedriveCatalog['apiV1.deals.getArchivedDealsTimeline'],
	),
	'apiV1.deals.getDealChangelog': createPipedriveCatalogEndpoint(
		'apiV1.deals.getDealChangelog',
		PipedriveCatalog['apiV1.deals.getDealChangelog'],
	),
	'apiV1.deals.duplicateDeal': createPipedriveCatalogEndpoint(
		'apiV1.deals.duplicateDeal',
		PipedriveCatalog['apiV1.deals.duplicateDeal'],
	),
	'apiV1.deals.getDealFiles': createPipedriveCatalogEndpoint(
		'apiV1.deals.getDealFiles',
		PipedriveCatalog['apiV1.deals.getDealFiles'],
	),
	'apiV1.deals.getDealUpdates': createPipedriveCatalogEndpoint(
		'apiV1.deals.getDealUpdates',
		PipedriveCatalog['apiV1.deals.getDealUpdates'],
	),
	'apiV1.deals.getDealParticipantsChangelog': createPipedriveCatalogEndpoint(
		'apiV1.deals.getDealParticipantsChangelog',
		PipedriveCatalog['apiV1.deals.getDealParticipantsChangelog'],
	),
	'apiV1.deals.getDealFollowers': createPipedriveCatalogEndpoint(
		'apiV1.deals.getDealFollowers',
		PipedriveCatalog['apiV1.deals.getDealFollowers'],
	),
	'apiV1.deals.addDealFollower': createPipedriveCatalogEndpoint(
		'apiV1.deals.addDealFollower',
		PipedriveCatalog['apiV1.deals.addDealFollower'],
	),
	'apiV1.deals.deleteDealFollower': createPipedriveCatalogEndpoint(
		'apiV1.deals.deleteDealFollower',
		PipedriveCatalog['apiV1.deals.deleteDealFollower'],
	),
	'apiV1.deals.getDealMailMessages': createPipedriveCatalogEndpoint(
		'apiV1.deals.getDealMailMessages',
		PipedriveCatalog['apiV1.deals.getDealMailMessages'],
	),
	'apiV1.deals.mergeDeals': createPipedriveCatalogEndpoint(
		'apiV1.deals.mergeDeals',
		PipedriveCatalog['apiV1.deals.mergeDeals'],
	),
	'apiV1.deals.getDealParticipants': createPipedriveCatalogEndpoint(
		'apiV1.deals.getDealParticipants',
		PipedriveCatalog['apiV1.deals.getDealParticipants'],
	),
	'apiV1.deals.addDealParticipant': createPipedriveCatalogEndpoint(
		'apiV1.deals.addDealParticipant',
		PipedriveCatalog['apiV1.deals.addDealParticipant'],
	),
	'apiV1.deals.deleteDealParticipant': createPipedriveCatalogEndpoint(
		'apiV1.deals.deleteDealParticipant',
		PipedriveCatalog['apiV1.deals.deleteDealParticipant'],
	),
	'apiV1.deals.getDealUsers': createPipedriveCatalogEndpoint(
		'apiV1.deals.getDealUsers',
		PipedriveCatalog['apiV1.deals.getDealUsers'],
	),
	'apiV1.dealFields.getDealFields': createPipedriveCatalogEndpoint(
		'apiV1.dealFields.getDealFields',
		PipedriveCatalog['apiV1.dealFields.getDealFields'],
	),
	'apiV1.dealFields.addDealField': createPipedriveCatalogEndpoint(
		'apiV1.dealFields.addDealField',
		PipedriveCatalog['apiV1.dealFields.addDealField'],
	),
	'apiV1.dealFields.deleteDealFields': createPipedriveCatalogEndpoint(
		'apiV1.dealFields.deleteDealFields',
		PipedriveCatalog['apiV1.dealFields.deleteDealFields'],
	),
	'apiV1.dealFields.getDealField': createPipedriveCatalogEndpoint(
		'apiV1.dealFields.getDealField',
		PipedriveCatalog['apiV1.dealFields.getDealField'],
	),
	'apiV1.dealFields.deleteDealField': createPipedriveCatalogEndpoint(
		'apiV1.dealFields.deleteDealField',
		PipedriveCatalog['apiV1.dealFields.deleteDealField'],
	),
	'apiV1.dealFields.updateDealField': createPipedriveCatalogEndpoint(
		'apiV1.dealFields.updateDealField',
		PipedriveCatalog['apiV1.dealFields.updateDealField'],
	),
	'apiV1.files.getFiles': createPipedriveCatalogEndpoint(
		'apiV1.files.getFiles',
		PipedriveCatalog['apiV1.files.getFiles'],
	),
	'apiV1.files.addFile': createPipedriveCatalogEndpoint(
		'apiV1.files.addFile',
		PipedriveCatalog['apiV1.files.addFile'],
	),
	'apiV1.files.addFileAndLinkIt': createPipedriveCatalogEndpoint(
		'apiV1.files.addFileAndLinkIt',
		PipedriveCatalog['apiV1.files.addFileAndLinkIt'],
	),
	'apiV1.files.linkFileToItem': createPipedriveCatalogEndpoint(
		'apiV1.files.linkFileToItem',
		PipedriveCatalog['apiV1.files.linkFileToItem'],
	),
	'apiV1.files.deleteFile': createPipedriveCatalogEndpoint(
		'apiV1.files.deleteFile',
		PipedriveCatalog['apiV1.files.deleteFile'],
	),
	'apiV1.files.getFile': createPipedriveCatalogEndpoint(
		'apiV1.files.getFile',
		PipedriveCatalog['apiV1.files.getFile'],
	),
	'apiV1.files.updateFile': createPipedriveCatalogEndpoint(
		'apiV1.files.updateFile',
		PipedriveCatalog['apiV1.files.updateFile'],
	),
	'apiV1.files.downloadFile': createPipedriveCatalogEndpoint(
		'apiV1.files.downloadFile',
		PipedriveCatalog['apiV1.files.downloadFile'],
	),
	'apiV1.filters.deleteFilters': createPipedriveCatalogEndpoint(
		'apiV1.filters.deleteFilters',
		PipedriveCatalog['apiV1.filters.deleteFilters'],
	),
	'apiV1.filters.getFilters': createPipedriveCatalogEndpoint(
		'apiV1.filters.getFilters',
		PipedriveCatalog['apiV1.filters.getFilters'],
	),
	'apiV1.filters.addFilter': createPipedriveCatalogEndpoint(
		'apiV1.filters.addFilter',
		PipedriveCatalog['apiV1.filters.addFilter'],
	),
	'apiV1.filters.getFilterHelpers': createPipedriveCatalogEndpoint(
		'apiV1.filters.getFilterHelpers',
		PipedriveCatalog['apiV1.filters.getFilterHelpers'],
	),
	'apiV1.filters.deleteFilter': createPipedriveCatalogEndpoint(
		'apiV1.filters.deleteFilter',
		PipedriveCatalog['apiV1.filters.deleteFilter'],
	),
	'apiV1.filters.getFilter': createPipedriveCatalogEndpoint(
		'apiV1.filters.getFilter',
		PipedriveCatalog['apiV1.filters.getFilter'],
	),
	'apiV1.filters.updateFilter': createPipedriveCatalogEndpoint(
		'apiV1.filters.updateFilter',
		PipedriveCatalog['apiV1.filters.updateFilter'],
	),
	'apiV1.goals.addGoal': createPipedriveCatalogEndpoint(
		'apiV1.goals.addGoal',
		PipedriveCatalog['apiV1.goals.addGoal'],
	),
	'apiV1.goals.getGoals': createPipedriveCatalogEndpoint(
		'apiV1.goals.getGoals',
		PipedriveCatalog['apiV1.goals.getGoals'],
	),
	'apiV1.goals.updateGoal': createPipedriveCatalogEndpoint(
		'apiV1.goals.updateGoal',
		PipedriveCatalog['apiV1.goals.updateGoal'],
	),
	'apiV1.goals.deleteGoal': createPipedriveCatalogEndpoint(
		'apiV1.goals.deleteGoal',
		PipedriveCatalog['apiV1.goals.deleteGoal'],
	),
	'apiV1.goals.getGoalResult': createPipedriveCatalogEndpoint(
		'apiV1.goals.getGoalResult',
		PipedriveCatalog['apiV1.goals.getGoalResult'],
	),
	'apiV1.leads.getLeads': createPipedriveCatalogEndpoint(
		'apiV1.leads.getLeads',
		PipedriveCatalog['apiV1.leads.getLeads'],
	),
	'apiV1.leads.addLead': createPipedriveCatalogEndpoint(
		'apiV1.leads.addLead',
		PipedriveCatalog['apiV1.leads.addLead'],
	),
	'apiV1.leads.getArchivedLeads': createPipedriveCatalogEndpoint(
		'apiV1.leads.getArchivedLeads',
		PipedriveCatalog['apiV1.leads.getArchivedLeads'],
	),
	'apiV1.leads.getLead': createPipedriveCatalogEndpoint(
		'apiV1.leads.getLead',
		PipedriveCatalog['apiV1.leads.getLead'],
	),
	'apiV1.leads.updateLead': createPipedriveCatalogEndpoint(
		'apiV1.leads.updateLead',
		PipedriveCatalog['apiV1.leads.updateLead'],
	),
	'apiV1.leads.deleteLead': createPipedriveCatalogEndpoint(
		'apiV1.leads.deleteLead',
		PipedriveCatalog['apiV1.leads.deleteLead'],
	),
	'apiV1.leads.getLeadUsers': createPipedriveCatalogEndpoint(
		'apiV1.leads.getLeadUsers',
		PipedriveCatalog['apiV1.leads.getLeadUsers'],
	),
	'apiV1.leads.searchLeads': createPipedriveCatalogEndpoint(
		'apiV1.leads.searchLeads',
		PipedriveCatalog['apiV1.leads.searchLeads'],
	),
	'apiV1.leadFields.getLeadFields': createPipedriveCatalogEndpoint(
		'apiV1.leadFields.getLeadFields',
		PipedriveCatalog['apiV1.leadFields.getLeadFields'],
	),
	'apiV1.leadLabels.getLeadLabels': createPipedriveCatalogEndpoint(
		'apiV1.leadLabels.getLeadLabels',
		PipedriveCatalog['apiV1.leadLabels.getLeadLabels'],
	),
	'apiV1.leadLabels.addLeadLabel': createPipedriveCatalogEndpoint(
		'apiV1.leadLabels.addLeadLabel',
		PipedriveCatalog['apiV1.leadLabels.addLeadLabel'],
	),
	'apiV1.leadLabels.updateLeadLabel': createPipedriveCatalogEndpoint(
		'apiV1.leadLabels.updateLeadLabel',
		PipedriveCatalog['apiV1.leadLabels.updateLeadLabel'],
	),
	'apiV1.leadLabels.deleteLeadLabel': createPipedriveCatalogEndpoint(
		'apiV1.leadLabels.deleteLeadLabel',
		PipedriveCatalog['apiV1.leadLabels.deleteLeadLabel'],
	),
	'apiV1.leadSources.getLeadSources': createPipedriveCatalogEndpoint(
		'apiV1.leadSources.getLeadSources',
		PipedriveCatalog['apiV1.leadSources.getLeadSources'],
	),
	'apiV1.legacyTeams.getTeams': createPipedriveCatalogEndpoint(
		'apiV1.legacyTeams.getTeams',
		PipedriveCatalog['apiV1.legacyTeams.getTeams'],
	),
	'apiV1.legacyTeams.addTeam': createPipedriveCatalogEndpoint(
		'apiV1.legacyTeams.addTeam',
		PipedriveCatalog['apiV1.legacyTeams.addTeam'],
	),
	'apiV1.legacyTeams.getTeam': createPipedriveCatalogEndpoint(
		'apiV1.legacyTeams.getTeam',
		PipedriveCatalog['apiV1.legacyTeams.getTeam'],
	),
	'apiV1.legacyTeams.updateTeam': createPipedriveCatalogEndpoint(
		'apiV1.legacyTeams.updateTeam',
		PipedriveCatalog['apiV1.legacyTeams.updateTeam'],
	),
	'apiV1.legacyTeams.getTeamUsers': createPipedriveCatalogEndpoint(
		'apiV1.legacyTeams.getTeamUsers',
		PipedriveCatalog['apiV1.legacyTeams.getTeamUsers'],
	),
	'apiV1.legacyTeams.addTeamUser': createPipedriveCatalogEndpoint(
		'apiV1.legacyTeams.addTeamUser',
		PipedriveCatalog['apiV1.legacyTeams.addTeamUser'],
	),
	'apiV1.legacyTeams.deleteTeamUser': createPipedriveCatalogEndpoint(
		'apiV1.legacyTeams.deleteTeamUser',
		PipedriveCatalog['apiV1.legacyTeams.deleteTeamUser'],
	),
	'apiV1.legacyTeams.getUserTeams': createPipedriveCatalogEndpoint(
		'apiV1.legacyTeams.getUserTeams',
		PipedriveCatalog['apiV1.legacyTeams.getUserTeams'],
	),
	'apiV1.mailbox.getMailMessage': createPipedriveCatalogEndpoint(
		'apiV1.mailbox.getMailMessage',
		PipedriveCatalog['apiV1.mailbox.getMailMessage'],
	),
	'apiV1.mailbox.getMailThreads': createPipedriveCatalogEndpoint(
		'apiV1.mailbox.getMailThreads',
		PipedriveCatalog['apiV1.mailbox.getMailThreads'],
	),
	'apiV1.mailbox.deleteMailThread': createPipedriveCatalogEndpoint(
		'apiV1.mailbox.deleteMailThread',
		PipedriveCatalog['apiV1.mailbox.deleteMailThread'],
	),
	'apiV1.mailbox.getMailThread': createPipedriveCatalogEndpoint(
		'apiV1.mailbox.getMailThread',
		PipedriveCatalog['apiV1.mailbox.getMailThread'],
	),
	'apiV1.mailbox.updateMailThreadDetails': createPipedriveCatalogEndpoint(
		'apiV1.mailbox.updateMailThreadDetails',
		PipedriveCatalog['apiV1.mailbox.updateMailThreadDetails'],
	),
	'apiV1.mailbox.getMailThreadMessages': createPipedriveCatalogEndpoint(
		'apiV1.mailbox.getMailThreadMessages',
		PipedriveCatalog['apiV1.mailbox.getMailThreadMessages'],
	),
	'apiV1.meetings.saveUserProviderLink': createPipedriveCatalogEndpoint(
		'apiV1.meetings.saveUserProviderLink',
		PipedriveCatalog['apiV1.meetings.saveUserProviderLink'],
	),
	'apiV1.meetings.deleteUserProviderLink': createPipedriveCatalogEndpoint(
		'apiV1.meetings.deleteUserProviderLink',
		PipedriveCatalog['apiV1.meetings.deleteUserProviderLink'],
	),
	'apiV1.notes.getNotes': createPipedriveCatalogEndpoint(
		'apiV1.notes.getNotes',
		PipedriveCatalog['apiV1.notes.getNotes'],
	),
	'apiV1.notes.addNote': createPipedriveCatalogEndpoint(
		'apiV1.notes.addNote',
		PipedriveCatalog['apiV1.notes.addNote'],
	),
	'apiV1.notes.deleteNote': createPipedriveCatalogEndpoint(
		'apiV1.notes.deleteNote',
		PipedriveCatalog['apiV1.notes.deleteNote'],
	),
	'apiV1.notes.getNote': createPipedriveCatalogEndpoint(
		'apiV1.notes.getNote',
		PipedriveCatalog['apiV1.notes.getNote'],
	),
	'apiV1.notes.updateNote': createPipedriveCatalogEndpoint(
		'apiV1.notes.updateNote',
		PipedriveCatalog['apiV1.notes.updateNote'],
	),
	'apiV1.notes.getNoteComments': createPipedriveCatalogEndpoint(
		'apiV1.notes.getNoteComments',
		PipedriveCatalog['apiV1.notes.getNoteComments'],
	),
	'apiV1.notes.addNoteComment': createPipedriveCatalogEndpoint(
		'apiV1.notes.addNoteComment',
		PipedriveCatalog['apiV1.notes.addNoteComment'],
	),
	'apiV1.notes.getComment': createPipedriveCatalogEndpoint(
		'apiV1.notes.getComment',
		PipedriveCatalog['apiV1.notes.getComment'],
	),
	'apiV1.notes.updateCommentForNote': createPipedriveCatalogEndpoint(
		'apiV1.notes.updateCommentForNote',
		PipedriveCatalog['apiV1.notes.updateCommentForNote'],
	),
	'apiV1.notes.deleteComment': createPipedriveCatalogEndpoint(
		'apiV1.notes.deleteComment',
		PipedriveCatalog['apiV1.notes.deleteComment'],
	),
	'apiV1.noteFields.getNoteFields': createPipedriveCatalogEndpoint(
		'apiV1.noteFields.getNoteFields',
		PipedriveCatalog['apiV1.noteFields.getNoteFields'],
	),
	'apiV1.organizations.getOrganizationChangelog':
		createPipedriveCatalogEndpoint(
			'apiV1.organizations.getOrganizationChangelog',
			PipedriveCatalog['apiV1.organizations.getOrganizationChangelog'],
		),
	'apiV1.organizations.getOrganizationFiles': createPipedriveCatalogEndpoint(
		'apiV1.organizations.getOrganizationFiles',
		PipedriveCatalog['apiV1.organizations.getOrganizationFiles'],
	),
	'apiV1.organizations.getOrganizationUpdates': createPipedriveCatalogEndpoint(
		'apiV1.organizations.getOrganizationUpdates',
		PipedriveCatalog['apiV1.organizations.getOrganizationUpdates'],
	),
	'apiV1.organizations.getOrganizationFollowers':
		createPipedriveCatalogEndpoint(
			'apiV1.organizations.getOrganizationFollowers',
			PipedriveCatalog['apiV1.organizations.getOrganizationFollowers'],
		),
	'apiV1.organizations.addOrganizationFollower': createPipedriveCatalogEndpoint(
		'apiV1.organizations.addOrganizationFollower',
		PipedriveCatalog['apiV1.organizations.addOrganizationFollower'],
	),
	'apiV1.organizations.deleteOrganizationFollower':
		createPipedriveCatalogEndpoint(
			'apiV1.organizations.deleteOrganizationFollower',
			PipedriveCatalog['apiV1.organizations.deleteOrganizationFollower'],
		),
	'apiV1.organizations.getOrganizationMailMessages':
		createPipedriveCatalogEndpoint(
			'apiV1.organizations.getOrganizationMailMessages',
			PipedriveCatalog['apiV1.organizations.getOrganizationMailMessages'],
		),
	'apiV1.organizations.mergeOrganizations': createPipedriveCatalogEndpoint(
		'apiV1.organizations.mergeOrganizations',
		PipedriveCatalog['apiV1.organizations.mergeOrganizations'],
	),
	'apiV1.organizations.getOrganizationUsers': createPipedriveCatalogEndpoint(
		'apiV1.organizations.getOrganizationUsers',
		PipedriveCatalog['apiV1.organizations.getOrganizationUsers'],
	),
	'apiV1.organizationFields.getOrganizationFields':
		createPipedriveCatalogEndpoint(
			'apiV1.organizationFields.getOrganizationFields',
			PipedriveCatalog['apiV1.organizationFields.getOrganizationFields'],
		),
	'apiV1.organizationFields.addOrganizationField':
		createPipedriveCatalogEndpoint(
			'apiV1.organizationFields.addOrganizationField',
			PipedriveCatalog['apiV1.organizationFields.addOrganizationField'],
		),
	'apiV1.organizationFields.deleteOrganizationFields':
		createPipedriveCatalogEndpoint(
			'apiV1.organizationFields.deleteOrganizationFields',
			PipedriveCatalog['apiV1.organizationFields.deleteOrganizationFields'],
		),
	'apiV1.organizationFields.getOrganizationField':
		createPipedriveCatalogEndpoint(
			'apiV1.organizationFields.getOrganizationField',
			PipedriveCatalog['apiV1.organizationFields.getOrganizationField'],
		),
	'apiV1.organizationFields.deleteOrganizationField':
		createPipedriveCatalogEndpoint(
			'apiV1.organizationFields.deleteOrganizationField',
			PipedriveCatalog['apiV1.organizationFields.deleteOrganizationField'],
		),
	'apiV1.organizationFields.updateOrganizationField':
		createPipedriveCatalogEndpoint(
			'apiV1.organizationFields.updateOrganizationField',
			PipedriveCatalog['apiV1.organizationFields.updateOrganizationField'],
		),
	'apiV1.organizationRelationships.getOrganizationRelationships':
		createPipedriveCatalogEndpoint(
			'apiV1.organizationRelationships.getOrganizationRelationships',
			PipedriveCatalog[
				'apiV1.organizationRelationships.getOrganizationRelationships'
			],
		),
	'apiV1.organizationRelationships.addOrganizationRelationship':
		createPipedriveCatalogEndpoint(
			'apiV1.organizationRelationships.addOrganizationRelationship',
			PipedriveCatalog[
				'apiV1.organizationRelationships.addOrganizationRelationship'
			],
		),
	'apiV1.organizationRelationships.deleteOrganizationRelationship':
		createPipedriveCatalogEndpoint(
			'apiV1.organizationRelationships.deleteOrganizationRelationship',
			PipedriveCatalog[
				'apiV1.organizationRelationships.deleteOrganizationRelationship'
			],
		),
	'apiV1.organizationRelationships.getOrganizationRelationship':
		createPipedriveCatalogEndpoint(
			'apiV1.organizationRelationships.getOrganizationRelationship',
			PipedriveCatalog[
				'apiV1.organizationRelationships.getOrganizationRelationship'
			],
		),
	'apiV1.organizationRelationships.updateOrganizationRelationship':
		createPipedriveCatalogEndpoint(
			'apiV1.organizationRelationships.updateOrganizationRelationship',
			PipedriveCatalog[
				'apiV1.organizationRelationships.updateOrganizationRelationship'
			],
		),
	'apiV1.permissionSets.getPermissionSets': createPipedriveCatalogEndpoint(
		'apiV1.permissionSets.getPermissionSets',
		PipedriveCatalog['apiV1.permissionSets.getPermissionSets'],
	),
	'apiV1.permissionSets.getPermissionSet': createPipedriveCatalogEndpoint(
		'apiV1.permissionSets.getPermissionSet',
		PipedriveCatalog['apiV1.permissionSets.getPermissionSet'],
	),
	'apiV1.permissionSets.getPermissionSetAssignments':
		createPipedriveCatalogEndpoint(
			'apiV1.permissionSets.getPermissionSetAssignments',
			PipedriveCatalog['apiV1.permissionSets.getPermissionSetAssignments'],
		),
	'apiV1.persons.getPersonChangelog': createPipedriveCatalogEndpoint(
		'apiV1.persons.getPersonChangelog',
		PipedriveCatalog['apiV1.persons.getPersonChangelog'],
	),
	'apiV1.persons.getPersonFiles': createPipedriveCatalogEndpoint(
		'apiV1.persons.getPersonFiles',
		PipedriveCatalog['apiV1.persons.getPersonFiles'],
	),
	'apiV1.persons.getPersonUpdates': createPipedriveCatalogEndpoint(
		'apiV1.persons.getPersonUpdates',
		PipedriveCatalog['apiV1.persons.getPersonUpdates'],
	),
	'apiV1.persons.getPersonFollowers': createPipedriveCatalogEndpoint(
		'apiV1.persons.getPersonFollowers',
		PipedriveCatalog['apiV1.persons.getPersonFollowers'],
	),
	'apiV1.persons.addPersonFollower': createPipedriveCatalogEndpoint(
		'apiV1.persons.addPersonFollower',
		PipedriveCatalog['apiV1.persons.addPersonFollower'],
	),
	'apiV1.persons.deletePersonFollower': createPipedriveCatalogEndpoint(
		'apiV1.persons.deletePersonFollower',
		PipedriveCatalog['apiV1.persons.deletePersonFollower'],
	),
	'apiV1.persons.getPersonMailMessages': createPipedriveCatalogEndpoint(
		'apiV1.persons.getPersonMailMessages',
		PipedriveCatalog['apiV1.persons.getPersonMailMessages'],
	),
	'apiV1.persons.mergePersons': createPipedriveCatalogEndpoint(
		'apiV1.persons.mergePersons',
		PipedriveCatalog['apiV1.persons.mergePersons'],
	),
	'apiV1.persons.getPersonUsers': createPipedriveCatalogEndpoint(
		'apiV1.persons.getPersonUsers',
		PipedriveCatalog['apiV1.persons.getPersonUsers'],
	),
	'apiV1.persons.deletePersonPicture': createPipedriveCatalogEndpoint(
		'apiV1.persons.deletePersonPicture',
		PipedriveCatalog['apiV1.persons.deletePersonPicture'],
	),
	'apiV1.persons.addPersonPicture': createPipedriveCatalogEndpoint(
		'apiV1.persons.addPersonPicture',
		PipedriveCatalog['apiV1.persons.addPersonPicture'],
	),
	'apiV1.persons.getPersonProducts': createPipedriveCatalogEndpoint(
		'apiV1.persons.getPersonProducts',
		PipedriveCatalog['apiV1.persons.getPersonProducts'],
	),
	'apiV1.personFields.getPersonFields': createPipedriveCatalogEndpoint(
		'apiV1.personFields.getPersonFields',
		PipedriveCatalog['apiV1.personFields.getPersonFields'],
	),
	'apiV1.personFields.addPersonField': createPipedriveCatalogEndpoint(
		'apiV1.personFields.addPersonField',
		PipedriveCatalog['apiV1.personFields.addPersonField'],
	),
	'apiV1.personFields.deletePersonFields': createPipedriveCatalogEndpoint(
		'apiV1.personFields.deletePersonFields',
		PipedriveCatalog['apiV1.personFields.deletePersonFields'],
	),
	'apiV1.personFields.getPersonField': createPipedriveCatalogEndpoint(
		'apiV1.personFields.getPersonField',
		PipedriveCatalog['apiV1.personFields.getPersonField'],
	),
	'apiV1.personFields.deletePersonField': createPipedriveCatalogEndpoint(
		'apiV1.personFields.deletePersonField',
		PipedriveCatalog['apiV1.personFields.deletePersonField'],
	),
	'apiV1.personFields.updatePersonField': createPipedriveCatalogEndpoint(
		'apiV1.personFields.updatePersonField',
		PipedriveCatalog['apiV1.personFields.updatePersonField'],
	),
	'apiV1.pipelines.getPipelineConversionStatistics':
		createPipedriveCatalogEndpoint(
			'apiV1.pipelines.getPipelineConversionStatistics',
			PipedriveCatalog['apiV1.pipelines.getPipelineConversionStatistics'],
		),
	'apiV1.pipelines.getPipelineDeals': createPipedriveCatalogEndpoint(
		'apiV1.pipelines.getPipelineDeals',
		PipedriveCatalog['apiV1.pipelines.getPipelineDeals'],
	),
	'apiV1.pipelines.getPipelineMovementStatistics':
		createPipedriveCatalogEndpoint(
			'apiV1.pipelines.getPipelineMovementStatistics',
			PipedriveCatalog['apiV1.pipelines.getPipelineMovementStatistics'],
		),
	'apiV1.products.getProductDeals': createPipedriveCatalogEndpoint(
		'apiV1.products.getProductDeals',
		PipedriveCatalog['apiV1.products.getProductDeals'],
	),
	'apiV1.products.getProductFiles': createPipedriveCatalogEndpoint(
		'apiV1.products.getProductFiles',
		PipedriveCatalog['apiV1.products.getProductFiles'],
	),
	'apiV1.products.getProductFollowers': createPipedriveCatalogEndpoint(
		'apiV1.products.getProductFollowers',
		PipedriveCatalog['apiV1.products.getProductFollowers'],
	),
	'apiV1.products.addProductFollower': createPipedriveCatalogEndpoint(
		'apiV1.products.addProductFollower',
		PipedriveCatalog['apiV1.products.addProductFollower'],
	),
	'apiV1.products.deleteProductFollower': createPipedriveCatalogEndpoint(
		'apiV1.products.deleteProductFollower',
		PipedriveCatalog['apiV1.products.deleteProductFollower'],
	),
	'apiV1.products.getProductUsers': createPipedriveCatalogEndpoint(
		'apiV1.products.getProductUsers',
		PipedriveCatalog['apiV1.products.getProductUsers'],
	),
	'apiV1.productFields.deleteProductFields': createPipedriveCatalogEndpoint(
		'apiV1.productFields.deleteProductFields',
		PipedriveCatalog['apiV1.productFields.deleteProductFields'],
	),
	'apiV1.productFields.getProductFields': createPipedriveCatalogEndpoint(
		'apiV1.productFields.getProductFields',
		PipedriveCatalog['apiV1.productFields.getProductFields'],
	),
	'apiV1.productFields.addProductField': createPipedriveCatalogEndpoint(
		'apiV1.productFields.addProductField',
		PipedriveCatalog['apiV1.productFields.addProductField'],
	),
	'apiV1.productFields.deleteProductField': createPipedriveCatalogEndpoint(
		'apiV1.productFields.deleteProductField',
		PipedriveCatalog['apiV1.productFields.deleteProductField'],
	),
	'apiV1.productFields.getProductField': createPipedriveCatalogEndpoint(
		'apiV1.productFields.getProductField',
		PipedriveCatalog['apiV1.productFields.getProductField'],
	),
	'apiV1.productFields.updateProductField': createPipedriveCatalogEndpoint(
		'apiV1.productFields.updateProductField',
		PipedriveCatalog['apiV1.productFields.updateProductField'],
	),
	'apiV1.projects.getProjects': createPipedriveCatalogEndpoint(
		'apiV1.projects.getProjects',
		PipedriveCatalog['apiV1.projects.getProjects'],
	),
	'apiV1.projects.addProject': createPipedriveCatalogEndpoint(
		'apiV1.projects.addProject',
		PipedriveCatalog['apiV1.projects.addProject'],
	),
	'apiV1.projects.getProject': createPipedriveCatalogEndpoint(
		'apiV1.projects.getProject',
		PipedriveCatalog['apiV1.projects.getProject'],
	),
	'apiV1.projects.updateProject': createPipedriveCatalogEndpoint(
		'apiV1.projects.updateProject',
		PipedriveCatalog['apiV1.projects.updateProject'],
	),
	'apiV1.projects.deleteProject': createPipedriveCatalogEndpoint(
		'apiV1.projects.deleteProject',
		PipedriveCatalog['apiV1.projects.deleteProject'],
	),
	'apiV1.projects.archiveProject': createPipedriveCatalogEndpoint(
		'apiV1.projects.archiveProject',
		PipedriveCatalog['apiV1.projects.archiveProject'],
	),
	'apiV1.projects.getProjectPlan': createPipedriveCatalogEndpoint(
		'apiV1.projects.getProjectPlan',
		PipedriveCatalog['apiV1.projects.getProjectPlan'],
	),
	'apiV1.projects.putProjectPlanActivity': createPipedriveCatalogEndpoint(
		'apiV1.projects.putProjectPlanActivity',
		PipedriveCatalog['apiV1.projects.putProjectPlanActivity'],
	),
	'apiV1.projects.putProjectPlanTask': createPipedriveCatalogEndpoint(
		'apiV1.projects.putProjectPlanTask',
		PipedriveCatalog['apiV1.projects.putProjectPlanTask'],
	),
	'apiV1.projects.getProjectGroups': createPipedriveCatalogEndpoint(
		'apiV1.projects.getProjectGroups',
		PipedriveCatalog['apiV1.projects.getProjectGroups'],
	),
	'apiV1.projects.getProjectTasks': createPipedriveCatalogEndpoint(
		'apiV1.projects.getProjectTasks',
		PipedriveCatalog['apiV1.projects.getProjectTasks'],
	),
	'apiV1.projects.getProjectActivities': createPipedriveCatalogEndpoint(
		'apiV1.projects.getProjectActivities',
		PipedriveCatalog['apiV1.projects.getProjectActivities'],
	),
	'apiV1.projectBoards.getProjectsBoards': createPipedriveCatalogEndpoint(
		'apiV1.projectBoards.getProjectsBoards',
		PipedriveCatalog['apiV1.projectBoards.getProjectsBoards'],
	),
	'apiV1.projectBoards.getProjectsBoard': createPipedriveCatalogEndpoint(
		'apiV1.projectBoards.getProjectsBoard',
		PipedriveCatalog['apiV1.projectBoards.getProjectsBoard'],
	),
	'apiV1.projectPhases.getProjectsPhases': createPipedriveCatalogEndpoint(
		'apiV1.projectPhases.getProjectsPhases',
		PipedriveCatalog['apiV1.projectPhases.getProjectsPhases'],
	),
	'apiV1.projectPhases.getProjectsPhase': createPipedriveCatalogEndpoint(
		'apiV1.projectPhases.getProjectsPhase',
		PipedriveCatalog['apiV1.projectPhases.getProjectsPhase'],
	),
	'apiV1.projectTemplates.getProjectTemplates': createPipedriveCatalogEndpoint(
		'apiV1.projectTemplates.getProjectTemplates',
		PipedriveCatalog['apiV1.projectTemplates.getProjectTemplates'],
	),
	'apiV1.projectTemplates.getProjectTemplate': createPipedriveCatalogEndpoint(
		'apiV1.projectTemplates.getProjectTemplate',
		PipedriveCatalog['apiV1.projectTemplates.getProjectTemplate'],
	),
	'apiV1.recents.getRecents': createPipedriveCatalogEndpoint(
		'apiV1.recents.getRecents',
		PipedriveCatalog['apiV1.recents.getRecents'],
	),
	'apiV1.roles.getRoles': createPipedriveCatalogEndpoint(
		'apiV1.roles.getRoles',
		PipedriveCatalog['apiV1.roles.getRoles'],
	),
	'apiV1.roles.addRole': createPipedriveCatalogEndpoint(
		'apiV1.roles.addRole',
		PipedriveCatalog['apiV1.roles.addRole'],
	),
	'apiV1.roles.deleteRole': createPipedriveCatalogEndpoint(
		'apiV1.roles.deleteRole',
		PipedriveCatalog['apiV1.roles.deleteRole'],
	),
	'apiV1.roles.getRole': createPipedriveCatalogEndpoint(
		'apiV1.roles.getRole',
		PipedriveCatalog['apiV1.roles.getRole'],
	),
	'apiV1.roles.updateRole': createPipedriveCatalogEndpoint(
		'apiV1.roles.updateRole',
		PipedriveCatalog['apiV1.roles.updateRole'],
	),
	'apiV1.roles.deleteRoleAssignment': createPipedriveCatalogEndpoint(
		'apiV1.roles.deleteRoleAssignment',
		PipedriveCatalog['apiV1.roles.deleteRoleAssignment'],
	),
	'apiV1.roles.getRoleAssignments': createPipedriveCatalogEndpoint(
		'apiV1.roles.getRoleAssignments',
		PipedriveCatalog['apiV1.roles.getRoleAssignments'],
	),
	'apiV1.roles.addRoleAssignment': createPipedriveCatalogEndpoint(
		'apiV1.roles.addRoleAssignment',
		PipedriveCatalog['apiV1.roles.addRoleAssignment'],
	),
	'apiV1.roles.getRoleSettings': createPipedriveCatalogEndpoint(
		'apiV1.roles.getRoleSettings',
		PipedriveCatalog['apiV1.roles.getRoleSettings'],
	),
	'apiV1.roles.addOrUpdateRoleSetting': createPipedriveCatalogEndpoint(
		'apiV1.roles.addOrUpdateRoleSetting',
		PipedriveCatalog['apiV1.roles.addOrUpdateRoleSetting'],
	),
	'apiV1.roles.getRolePipelines': createPipedriveCatalogEndpoint(
		'apiV1.roles.getRolePipelines',
		PipedriveCatalog['apiV1.roles.getRolePipelines'],
	),
	'apiV1.roles.updateRolePipelines': createPipedriveCatalogEndpoint(
		'apiV1.roles.updateRolePipelines',
		PipedriveCatalog['apiV1.roles.updateRolePipelines'],
	),
	'apiV1.stages.getStageDeals': createPipedriveCatalogEndpoint(
		'apiV1.stages.getStageDeals',
		PipedriveCatalog['apiV1.stages.getStageDeals'],
	),
	'apiV1.tasks.getTasks': createPipedriveCatalogEndpoint(
		'apiV1.tasks.getTasks',
		PipedriveCatalog['apiV1.tasks.getTasks'],
	),
	'apiV1.tasks.addTask': createPipedriveCatalogEndpoint(
		'apiV1.tasks.addTask',
		PipedriveCatalog['apiV1.tasks.addTask'],
	),
	'apiV1.tasks.getTask': createPipedriveCatalogEndpoint(
		'apiV1.tasks.getTask',
		PipedriveCatalog['apiV1.tasks.getTask'],
	),
	'apiV1.tasks.updateTask': createPipedriveCatalogEndpoint(
		'apiV1.tasks.updateTask',
		PipedriveCatalog['apiV1.tasks.updateTask'],
	),
	'apiV1.tasks.deleteTask': createPipedriveCatalogEndpoint(
		'apiV1.tasks.deleteTask',
		PipedriveCatalog['apiV1.tasks.deleteTask'],
	),
	'apiV1.users.getUsers': createPipedriveCatalogEndpoint(
		'apiV1.users.getUsers',
		PipedriveCatalog['apiV1.users.getUsers'],
	),
	'apiV1.users.addUser': createPipedriveCatalogEndpoint(
		'apiV1.users.addUser',
		PipedriveCatalog['apiV1.users.addUser'],
	),
	'apiV1.users.findUsersByName': createPipedriveCatalogEndpoint(
		'apiV1.users.findUsersByName',
		PipedriveCatalog['apiV1.users.findUsersByName'],
	),
	'apiV1.users.getCurrentUser': createPipedriveCatalogEndpoint(
		'apiV1.users.getCurrentUser',
		PipedriveCatalog['apiV1.users.getCurrentUser'],
	),
	'apiV1.users.getUser': createPipedriveCatalogEndpoint(
		'apiV1.users.getUser',
		PipedriveCatalog['apiV1.users.getUser'],
	),
	'apiV1.users.updateUser': createPipedriveCatalogEndpoint(
		'apiV1.users.updateUser',
		PipedriveCatalog['apiV1.users.updateUser'],
	),
	'apiV1.users.getUserFollowers': createPipedriveCatalogEndpoint(
		'apiV1.users.getUserFollowers',
		PipedriveCatalog['apiV1.users.getUserFollowers'],
	),
	'apiV1.users.getUserPermissions': createPipedriveCatalogEndpoint(
		'apiV1.users.getUserPermissions',
		PipedriveCatalog['apiV1.users.getUserPermissions'],
	),
	'apiV1.users.getUserRoleAssignments': createPipedriveCatalogEndpoint(
		'apiV1.users.getUserRoleAssignments',
		PipedriveCatalog['apiV1.users.getUserRoleAssignments'],
	),
	'apiV1.users.getUserRoleSettings': createPipedriveCatalogEndpoint(
		'apiV1.users.getUserRoleSettings',
		PipedriveCatalog['apiV1.users.getUserRoleSettings'],
	),
	'apiV1.userConnections.getUserConnections': createPipedriveCatalogEndpoint(
		'apiV1.userConnections.getUserConnections',
		PipedriveCatalog['apiV1.userConnections.getUserConnections'],
	),
	'apiV1.userSettings.getUserSettings': createPipedriveCatalogEndpoint(
		'apiV1.userSettings.getUserSettings',
		PipedriveCatalog['apiV1.userSettings.getUserSettings'],
	),
	'apiV2.activityFields.getActivityFields': createPipedriveCatalogEndpoint(
		'apiV2.activityFields.getActivityFields',
		PipedriveCatalog['apiV2.activityFields.getActivityFields'],
	),
	'apiV2.activityFields.getActivityField': createPipedriveCatalogEndpoint(
		'apiV2.activityFields.getActivityField',
		PipedriveCatalog['apiV2.activityFields.getActivityField'],
	),
	'apiV2.deals.getArchivedDeals': createPipedriveCatalogEndpoint(
		'apiV2.deals.getArchivedDeals',
		PipedriveCatalog['apiV2.deals.getArchivedDeals'],
	),
	'apiV2.deals.getDealFollowers': createPipedriveCatalogEndpoint(
		'apiV2.deals.getDealFollowers',
		PipedriveCatalog['apiV2.deals.getDealFollowers'],
	),
	'apiV2.deals.addDealFollower': createPipedriveCatalogEndpoint(
		'apiV2.deals.addDealFollower',
		PipedriveCatalog['apiV2.deals.addDealFollower'],
	),
	'apiV2.deals.getDealFollowersChangelog': createPipedriveCatalogEndpoint(
		'apiV2.deals.getDealFollowersChangelog',
		PipedriveCatalog['apiV2.deals.getDealFollowersChangelog'],
	),
	'apiV2.deals.deleteDealFollower': createPipedriveCatalogEndpoint(
		'apiV2.deals.deleteDealFollower',
		PipedriveCatalog['apiV2.deals.deleteDealFollower'],
	),
	'apiV2.dealProducts.getDealsProducts': createPipedriveCatalogEndpoint(
		'apiV2.dealProducts.getDealsProducts',
		PipedriveCatalog['apiV2.dealProducts.getDealsProducts'],
	),
	'apiV2.deals.searchDeals': createPipedriveCatalogEndpoint(
		'apiV2.deals.searchDeals',
		PipedriveCatalog['apiV2.deals.searchDeals'],
	),
	'apiV2.dealProducts.getDealProducts': createPipedriveCatalogEndpoint(
		'apiV2.dealProducts.getDealProducts',
		PipedriveCatalog['apiV2.dealProducts.getDealProducts'],
	),
	'apiV2.dealProducts.addDealProduct': createPipedriveCatalogEndpoint(
		'apiV2.dealProducts.addDealProduct',
		PipedriveCatalog['apiV2.dealProducts.addDealProduct'],
	),
	'apiV2.dealProducts.deleteManyDealProducts': createPipedriveCatalogEndpoint(
		'apiV2.dealProducts.deleteManyDealProducts',
		PipedriveCatalog['apiV2.dealProducts.deleteManyDealProducts'],
	),
	'apiV2.dealProducts.updateDealProduct': createPipedriveCatalogEndpoint(
		'apiV2.dealProducts.updateDealProduct',
		PipedriveCatalog['apiV2.dealProducts.updateDealProduct'],
	),
	'apiV2.dealProducts.deleteDealProduct': createPipedriveCatalogEndpoint(
		'apiV2.dealProducts.deleteDealProduct',
		PipedriveCatalog['apiV2.dealProducts.deleteDealProduct'],
	),
	'apiV2.dealProducts.addManyDealProducts': createPipedriveCatalogEndpoint(
		'apiV2.dealProducts.addManyDealProducts',
		PipedriveCatalog['apiV2.dealProducts.addManyDealProducts'],
	),
	'apiV2.deals.getAdditionalDiscounts': createPipedriveCatalogEndpoint(
		'apiV2.deals.getAdditionalDiscounts',
		PipedriveCatalog['apiV2.deals.getAdditionalDiscounts'],
	),
	'apiV2.deals.postAdditionalDiscount': createPipedriveCatalogEndpoint(
		'apiV2.deals.postAdditionalDiscount',
		PipedriveCatalog['apiV2.deals.postAdditionalDiscount'],
	),
	'apiV2.deals.updateAdditionalDiscount': createPipedriveCatalogEndpoint(
		'apiV2.deals.updateAdditionalDiscount',
		PipedriveCatalog['apiV2.deals.updateAdditionalDiscount'],
	),
	'apiV2.deals.deleteAdditionalDiscount': createPipedriveCatalogEndpoint(
		'apiV2.deals.deleteAdditionalDiscount',
		PipedriveCatalog['apiV2.deals.deleteAdditionalDiscount'],
	),
	'apiV2.dealInstallments.getInstallments': createPipedriveCatalogEndpoint(
		'apiV2.dealInstallments.getInstallments',
		PipedriveCatalog['apiV2.dealInstallments.getInstallments'],
	),
	'apiV2.dealInstallments.postInstallment': createPipedriveCatalogEndpoint(
		'apiV2.dealInstallments.postInstallment',
		PipedriveCatalog['apiV2.dealInstallments.postInstallment'],
	),
	'apiV2.dealInstallments.updateInstallment': createPipedriveCatalogEndpoint(
		'apiV2.dealInstallments.updateInstallment',
		PipedriveCatalog['apiV2.dealInstallments.updateInstallment'],
	),
	'apiV2.dealInstallments.deleteInstallment': createPipedriveCatalogEndpoint(
		'apiV2.dealInstallments.deleteInstallment',
		PipedriveCatalog['apiV2.dealInstallments.deleteInstallment'],
	),
	'apiV2.deals.convertDealToLead': createPipedriveCatalogEndpoint(
		'apiV2.deals.convertDealToLead',
		PipedriveCatalog['apiV2.deals.convertDealToLead'],
	),
	'apiV2.dealFields.getDealFields': createPipedriveCatalogEndpoint(
		'apiV2.dealFields.getDealFields',
		PipedriveCatalog['apiV2.dealFields.getDealFields'],
	),
	'apiV2.dealFields.addDealField': createPipedriveCatalogEndpoint(
		'apiV2.dealFields.addDealField',
		PipedriveCatalog['apiV2.dealFields.addDealField'],
	),
	'apiV2.dealFields.getDealField': createPipedriveCatalogEndpoint(
		'apiV2.dealFields.getDealField',
		PipedriveCatalog['apiV2.dealFields.getDealField'],
	),
	'apiV2.dealFields.updateDealField': createPipedriveCatalogEndpoint(
		'apiV2.dealFields.updateDealField',
		PipedriveCatalog['apiV2.dealFields.updateDealField'],
	),
	'apiV2.dealFields.deleteDealField': createPipedriveCatalogEndpoint(
		'apiV2.dealFields.deleteDealField',
		PipedriveCatalog['apiV2.dealFields.deleteDealField'],
	),
	'apiV2.dealFields.addDealFieldOptions': createPipedriveCatalogEndpoint(
		'apiV2.dealFields.addDealFieldOptions',
		PipedriveCatalog['apiV2.dealFields.addDealFieldOptions'],
	),
	'apiV2.dealFields.deleteDealFieldOptions': createPipedriveCatalogEndpoint(
		'apiV2.dealFields.deleteDealFieldOptions',
		PipedriveCatalog['apiV2.dealFields.deleteDealFieldOptions'],
	),
	'apiV2.dealFields.updateDealFieldOptions': createPipedriveCatalogEndpoint(
		'apiV2.dealFields.updateDealFieldOptions',
		PipedriveCatalog['apiV2.dealFields.updateDealFieldOptions'],
	),
	'apiV2.deals.getDealConversionStatus': createPipedriveCatalogEndpoint(
		'apiV2.deals.getDealConversionStatus',
		PipedriveCatalog['apiV2.deals.getDealConversionStatus'],
	),
	'apiV2.persons.getPersonFollowers': createPipedriveCatalogEndpoint(
		'apiV2.persons.getPersonFollowers',
		PipedriveCatalog['apiV2.persons.getPersonFollowers'],
	),
	'apiV2.persons.addPersonFollower': createPipedriveCatalogEndpoint(
		'apiV2.persons.addPersonFollower',
		PipedriveCatalog['apiV2.persons.addPersonFollower'],
	),
	'apiV2.persons.getPersonFollowersChangelog': createPipedriveCatalogEndpoint(
		'apiV2.persons.getPersonFollowersChangelog',
		PipedriveCatalog['apiV2.persons.getPersonFollowersChangelog'],
	),
	'apiV2.persons.deletePersonFollower': createPipedriveCatalogEndpoint(
		'apiV2.persons.deletePersonFollower',
		PipedriveCatalog['apiV2.persons.deletePersonFollower'],
	),
	'apiV2.persons.getPersonPicture': createPipedriveCatalogEndpoint(
		'apiV2.persons.getPersonPicture',
		PipedriveCatalog['apiV2.persons.getPersonPicture'],
	),
	'apiV2.personFields.getPersonFields': createPipedriveCatalogEndpoint(
		'apiV2.personFields.getPersonFields',
		PipedriveCatalog['apiV2.personFields.getPersonFields'],
	),
	'apiV2.personFields.addPersonField': createPipedriveCatalogEndpoint(
		'apiV2.personFields.addPersonField',
		PipedriveCatalog['apiV2.personFields.addPersonField'],
	),
	'apiV2.personFields.getPersonField': createPipedriveCatalogEndpoint(
		'apiV2.personFields.getPersonField',
		PipedriveCatalog['apiV2.personFields.getPersonField'],
	),
	'apiV2.personFields.updatePersonField': createPipedriveCatalogEndpoint(
		'apiV2.personFields.updatePersonField',
		PipedriveCatalog['apiV2.personFields.updatePersonField'],
	),
	'apiV2.personFields.deletePersonField': createPipedriveCatalogEndpoint(
		'apiV2.personFields.deletePersonField',
		PipedriveCatalog['apiV2.personFields.deletePersonField'],
	),
	'apiV2.personFields.addPersonFieldOptions': createPipedriveCatalogEndpoint(
		'apiV2.personFields.addPersonFieldOptions',
		PipedriveCatalog['apiV2.personFields.addPersonFieldOptions'],
	),
	'apiV2.personFields.deletePersonFieldOptions': createPipedriveCatalogEndpoint(
		'apiV2.personFields.deletePersonFieldOptions',
		PipedriveCatalog['apiV2.personFields.deletePersonFieldOptions'],
	),
	'apiV2.personFields.updatePersonFieldOptions': createPipedriveCatalogEndpoint(
		'apiV2.personFields.updatePersonFieldOptions',
		PipedriveCatalog['apiV2.personFields.updatePersonFieldOptions'],
	),
	'apiV2.organizations.getOrganizationFollowers':
		createPipedriveCatalogEndpoint(
			'apiV2.organizations.getOrganizationFollowers',
			PipedriveCatalog['apiV2.organizations.getOrganizationFollowers'],
		),
	'apiV2.organizations.addOrganizationFollower': createPipedriveCatalogEndpoint(
		'apiV2.organizations.addOrganizationFollower',
		PipedriveCatalog['apiV2.organizations.addOrganizationFollower'],
	),
	'apiV2.organizations.getOrganizationFollowersChangelog':
		createPipedriveCatalogEndpoint(
			'apiV2.organizations.getOrganizationFollowersChangelog',
			PipedriveCatalog['apiV2.organizations.getOrganizationFollowersChangelog'],
		),
	'apiV2.organizations.deleteOrganizationFollower':
		createPipedriveCatalogEndpoint(
			'apiV2.organizations.deleteOrganizationFollower',
			PipedriveCatalog['apiV2.organizations.deleteOrganizationFollower'],
		),
	'apiV2.organizationFields.getOrganizationFields':
		createPipedriveCatalogEndpoint(
			'apiV2.organizationFields.getOrganizationFields',
			PipedriveCatalog['apiV2.organizationFields.getOrganizationFields'],
		),
	'apiV2.organizationFields.addOrganizationField':
		createPipedriveCatalogEndpoint(
			'apiV2.organizationFields.addOrganizationField',
			PipedriveCatalog['apiV2.organizationFields.addOrganizationField'],
		),
	'apiV2.organizationFields.getOrganizationField':
		createPipedriveCatalogEndpoint(
			'apiV2.organizationFields.getOrganizationField',
			PipedriveCatalog['apiV2.organizationFields.getOrganizationField'],
		),
	'apiV2.organizationFields.updateOrganizationField':
		createPipedriveCatalogEndpoint(
			'apiV2.organizationFields.updateOrganizationField',
			PipedriveCatalog['apiV2.organizationFields.updateOrganizationField'],
		),
	'apiV2.organizationFields.deleteOrganizationField':
		createPipedriveCatalogEndpoint(
			'apiV2.organizationFields.deleteOrganizationField',
			PipedriveCatalog['apiV2.organizationFields.deleteOrganizationField'],
		),
	'apiV2.organizationFields.addOrganizationFieldOptions':
		createPipedriveCatalogEndpoint(
			'apiV2.organizationFields.addOrganizationFieldOptions',
			PipedriveCatalog['apiV2.organizationFields.addOrganizationFieldOptions'],
		),
	'apiV2.organizationFields.deleteOrganizationFieldOptions':
		createPipedriveCatalogEndpoint(
			'apiV2.organizationFields.deleteOrganizationFieldOptions',
			PipedriveCatalog[
				'apiV2.organizationFields.deleteOrganizationFieldOptions'
			],
		),
	'apiV2.organizationFields.updateOrganizationFieldOptions':
		createPipedriveCatalogEndpoint(
			'apiV2.organizationFields.updateOrganizationFieldOptions',
			PipedriveCatalog[
				'apiV2.organizationFields.updateOrganizationFieldOptions'
			],
		),
	'apiV2.productFields.getProductFields': createPipedriveCatalogEndpoint(
		'apiV2.productFields.getProductFields',
		PipedriveCatalog['apiV2.productFields.getProductFields'],
	),
	'apiV2.productFields.addProductField': createPipedriveCatalogEndpoint(
		'apiV2.productFields.addProductField',
		PipedriveCatalog['apiV2.productFields.addProductField'],
	),
	'apiV2.productFields.getProductField': createPipedriveCatalogEndpoint(
		'apiV2.productFields.getProductField',
		PipedriveCatalog['apiV2.productFields.getProductField'],
	),
	'apiV2.productFields.updateProductField': createPipedriveCatalogEndpoint(
		'apiV2.productFields.updateProductField',
		PipedriveCatalog['apiV2.productFields.updateProductField'],
	),
	'apiV2.productFields.deleteProductField': createPipedriveCatalogEndpoint(
		'apiV2.productFields.deleteProductField',
		PipedriveCatalog['apiV2.productFields.deleteProductField'],
	),
	'apiV2.productFields.addProductFieldOptions': createPipedriveCatalogEndpoint(
		'apiV2.productFields.addProductFieldOptions',
		PipedriveCatalog['apiV2.productFields.addProductFieldOptions'],
	),
	'apiV2.productFields.deleteProductFieldOptions':
		createPipedriveCatalogEndpoint(
			'apiV2.productFields.deleteProductFieldOptions',
			PipedriveCatalog['apiV2.productFields.deleteProductFieldOptions'],
		),
	'apiV2.productFields.updateProductFieldOptions':
		createPipedriveCatalogEndpoint(
			'apiV2.productFields.updateProductFieldOptions',
			PipedriveCatalog['apiV2.productFields.updateProductFieldOptions'],
		),
	'apiV2.leads.searchLeads': createPipedriveCatalogEndpoint(
		'apiV2.leads.searchLeads',
		PipedriveCatalog['apiV2.leads.searchLeads'],
	),
	'apiV2.leads.convertLeadToDeal': createPipedriveCatalogEndpoint(
		'apiV2.leads.convertLeadToDeal',
		PipedriveCatalog['apiV2.leads.convertLeadToDeal'],
	),
	'apiV2.leads.getLeadConversionStatus': createPipedriveCatalogEndpoint(
		'apiV2.leads.getLeadConversionStatus',
		PipedriveCatalog['apiV2.leads.getLeadConversionStatus'],
	),
	'apiV2.organizations.searchOrganization': createPipedriveCatalogEndpoint(
		'apiV2.organizations.searchOrganization',
		PipedriveCatalog['apiV2.organizations.searchOrganization'],
	),
	'apiV2.persons.searchPersons': createPipedriveCatalogEndpoint(
		'apiV2.persons.searchPersons',
		PipedriveCatalog['apiV2.persons.searchPersons'],
	),
	'apiV2.itemSearch.searchItem': createPipedriveCatalogEndpoint(
		'apiV2.itemSearch.searchItem',
		PipedriveCatalog['apiV2.itemSearch.searchItem'],
	),
	'apiV2.itemSearch.searchItemByField': createPipedriveCatalogEndpoint(
		'apiV2.itemSearch.searchItemByField',
		PipedriveCatalog['apiV2.itemSearch.searchItemByField'],
	),
	'apiV2.stages.getStages': createPipedriveCatalogEndpoint(
		'apiV2.stages.getStages',
		PipedriveCatalog['apiV2.stages.getStages'],
	),
	'apiV2.stages.addStage': createPipedriveCatalogEndpoint(
		'apiV2.stages.addStage',
		PipedriveCatalog['apiV2.stages.addStage'],
	),
	'apiV2.stages.deleteStage': createPipedriveCatalogEndpoint(
		'apiV2.stages.deleteStage',
		PipedriveCatalog['apiV2.stages.deleteStage'],
	),
	'apiV2.stages.getStage': createPipedriveCatalogEndpoint(
		'apiV2.stages.getStage',
		PipedriveCatalog['apiV2.stages.getStage'],
	),
	'apiV2.stages.updateStage': createPipedriveCatalogEndpoint(
		'apiV2.stages.updateStage',
		PipedriveCatalog['apiV2.stages.updateStage'],
	),
	'apiV2.pipelines.getPipelines': createPipedriveCatalogEndpoint(
		'apiV2.pipelines.getPipelines',
		PipedriveCatalog['apiV2.pipelines.getPipelines'],
	),
	'apiV2.pipelines.addPipeline': createPipedriveCatalogEndpoint(
		'apiV2.pipelines.addPipeline',
		PipedriveCatalog['apiV2.pipelines.addPipeline'],
	),
	'apiV2.pipelines.deletePipeline': createPipedriveCatalogEndpoint(
		'apiV2.pipelines.deletePipeline',
		PipedriveCatalog['apiV2.pipelines.deletePipeline'],
	),
	'apiV2.pipelines.getPipeline': createPipedriveCatalogEndpoint(
		'apiV2.pipelines.getPipeline',
		PipedriveCatalog['apiV2.pipelines.getPipeline'],
	),
	'apiV2.pipelines.updatePipeline': createPipedriveCatalogEndpoint(
		'apiV2.pipelines.updatePipeline',
		PipedriveCatalog['apiV2.pipelines.updatePipeline'],
	),
	'apiV2.projectFields.getProjectFields': createPipedriveCatalogEndpoint(
		'apiV2.projectFields.getProjectFields',
		PipedriveCatalog['apiV2.projectFields.getProjectFields'],
	),
	'apiV2.projectFields.addProjectField': createPipedriveCatalogEndpoint(
		'apiV2.projectFields.addProjectField',
		PipedriveCatalog['apiV2.projectFields.addProjectField'],
	),
	'apiV2.projectFields.getProjectField': createPipedriveCatalogEndpoint(
		'apiV2.projectFields.getProjectField',
		PipedriveCatalog['apiV2.projectFields.getProjectField'],
	),
	'apiV2.projectFields.updateProjectField': createPipedriveCatalogEndpoint(
		'apiV2.projectFields.updateProjectField',
		PipedriveCatalog['apiV2.projectFields.updateProjectField'],
	),
	'apiV2.projectFields.deleteProjectField': createPipedriveCatalogEndpoint(
		'apiV2.projectFields.deleteProjectField',
		PipedriveCatalog['apiV2.projectFields.deleteProjectField'],
	),
	'apiV2.projectFields.addProjectFieldOptions': createPipedriveCatalogEndpoint(
		'apiV2.projectFields.addProjectFieldOptions',
		PipedriveCatalog['apiV2.projectFields.addProjectFieldOptions'],
	),
	'apiV2.projectFields.deleteProjectFieldOptions':
		createPipedriveCatalogEndpoint(
			'apiV2.projectFields.deleteProjectFieldOptions',
			PipedriveCatalog['apiV2.projectFields.deleteProjectFieldOptions'],
		),
	'apiV2.projectFields.updateProjectFieldOptions':
		createPipedriveCatalogEndpoint(
			'apiV2.projectFields.updateProjectFieldOptions',
			PipedriveCatalog['apiV2.projectFields.updateProjectFieldOptions'],
		),
	'apiV2.projects.getProjects': createPipedriveCatalogEndpoint(
		'apiV2.projects.getProjects',
		PipedriveCatalog['apiV2.projects.getProjects'],
	),
	'apiV2.projects.addProject': createPipedriveCatalogEndpoint(
		'apiV2.projects.addProject',
		PipedriveCatalog['apiV2.projects.addProject'],
	),
	'apiV2.projects.getArchivedProjects': createPipedriveCatalogEndpoint(
		'apiV2.projects.getArchivedProjects',
		PipedriveCatalog['apiV2.projects.getArchivedProjects'],
	),
	'apiV2.projects.getProject': createPipedriveCatalogEndpoint(
		'apiV2.projects.getProject',
		PipedriveCatalog['apiV2.projects.getProject'],
	),
	'apiV2.projects.updateProject': createPipedriveCatalogEndpoint(
		'apiV2.projects.updateProject',
		PipedriveCatalog['apiV2.projects.updateProject'],
	),
	'apiV2.projects.deleteProject': createPipedriveCatalogEndpoint(
		'apiV2.projects.deleteProject',
		PipedriveCatalog['apiV2.projects.deleteProject'],
	),
	'apiV2.projectTemplates.getProjectTemplates': createPipedriveCatalogEndpoint(
		'apiV2.projectTemplates.getProjectTemplates',
		PipedriveCatalog['apiV2.projectTemplates.getProjectTemplates'],
	),
	'apiV2.projectTemplates.getProjectTemplate': createPipedriveCatalogEndpoint(
		'apiV2.projectTemplates.getProjectTemplate',
		PipedriveCatalog['apiV2.projectTemplates.getProjectTemplate'],
	),
	'apiV2.projects.searchProjects': createPipedriveCatalogEndpoint(
		'apiV2.projects.searchProjects',
		PipedriveCatalog['apiV2.projects.searchProjects'],
	),
	'apiV2.projects.archiveProject': createPipedriveCatalogEndpoint(
		'apiV2.projects.archiveProject',
		PipedriveCatalog['apiV2.projects.archiveProject'],
	),
	'apiV2.projects.getProjectUsers': createPipedriveCatalogEndpoint(
		'apiV2.projects.getProjectUsers',
		PipedriveCatalog['apiV2.projects.getProjectUsers'],
	),
	'apiV2.projects.getProjectChangelog': createPipedriveCatalogEndpoint(
		'apiV2.projects.getProjectChangelog',
		PipedriveCatalog['apiV2.projects.getProjectChangelog'],
	),
	'apiV2.projectBoards.getProjectsBoards': createPipedriveCatalogEndpoint(
		'apiV2.projectBoards.getProjectsBoards',
		PipedriveCatalog['apiV2.projectBoards.getProjectsBoards'],
	),
	'apiV2.projectBoards.addProjectBoard': createPipedriveCatalogEndpoint(
		'apiV2.projectBoards.addProjectBoard',
		PipedriveCatalog['apiV2.projectBoards.addProjectBoard'],
	),
	'apiV2.projectBoards.getProjectsBoard': createPipedriveCatalogEndpoint(
		'apiV2.projectBoards.getProjectsBoard',
		PipedriveCatalog['apiV2.projectBoards.getProjectsBoard'],
	),
	'apiV2.projectBoards.updateProjectBoard': createPipedriveCatalogEndpoint(
		'apiV2.projectBoards.updateProjectBoard',
		PipedriveCatalog['apiV2.projectBoards.updateProjectBoard'],
	),
	'apiV2.projectBoards.deleteProjectBoard': createPipedriveCatalogEndpoint(
		'apiV2.projectBoards.deleteProjectBoard',
		PipedriveCatalog['apiV2.projectBoards.deleteProjectBoard'],
	),
	'apiV2.projectPhases.getProjectsPhases': createPipedriveCatalogEndpoint(
		'apiV2.projectPhases.getProjectsPhases',
		PipedriveCatalog['apiV2.projectPhases.getProjectsPhases'],
	),
	'apiV2.projectPhases.addProjectPhase': createPipedriveCatalogEndpoint(
		'apiV2.projectPhases.addProjectPhase',
		PipedriveCatalog['apiV2.projectPhases.addProjectPhase'],
	),
	'apiV2.projectPhases.getProjectsPhase': createPipedriveCatalogEndpoint(
		'apiV2.projectPhases.getProjectsPhase',
		PipedriveCatalog['apiV2.projectPhases.getProjectsPhase'],
	),
	'apiV2.projectPhases.updateProjectPhase': createPipedriveCatalogEndpoint(
		'apiV2.projectPhases.updateProjectPhase',
		PipedriveCatalog['apiV2.projectPhases.updateProjectPhase'],
	),
	'apiV2.projectPhases.deleteProjectPhase': createPipedriveCatalogEndpoint(
		'apiV2.projectPhases.deleteProjectPhase',
		PipedriveCatalog['apiV2.projectPhases.deleteProjectPhase'],
	),
	'apiV2.users.getUserFollowers': createPipedriveCatalogEndpoint(
		'apiV2.users.getUserFollowers',
		PipedriveCatalog['apiV2.users.getUserFollowers'],
	),
};

export const pipedriveCatalogEndpointsNested = {
	apiV1: {
		activityFields: {
			getActivityFields: createPipedriveCatalogEndpoint(
				'apiV1.activityFields.getActivityFields',
				PipedriveCatalog['apiV1.activityFields.getActivityFields'],
			),
		},
		activityTypes: {
			getActivityTypes: createPipedriveCatalogEndpoint(
				'apiV1.activityTypes.getActivityTypes',
				PipedriveCatalog['apiV1.activityTypes.getActivityTypes'],
			),
			addActivityType: createPipedriveCatalogEndpoint(
				'apiV1.activityTypes.addActivityType',
				PipedriveCatalog['apiV1.activityTypes.addActivityType'],
			),
			deleteActivityType: createPipedriveCatalogEndpoint(
				'apiV1.activityTypes.deleteActivityType',
				PipedriveCatalog['apiV1.activityTypes.deleteActivityType'],
			),
			updateActivityType: createPipedriveCatalogEndpoint(
				'apiV1.activityTypes.updateActivityType',
				PipedriveCatalog['apiV1.activityTypes.updateActivityType'],
			),
		},
		billing: {
			getCompanyAddons: createPipedriveCatalogEndpoint(
				'apiV1.billing.getCompanyAddons',
				PipedriveCatalog['apiV1.billing.getCompanyAddons'],
			),
		},
		callLogs: {
			addCallLog: createPipedriveCatalogEndpoint(
				'apiV1.callLogs.addCallLog',
				PipedriveCatalog['apiV1.callLogs.addCallLog'],
			),
			getUserCallLogs: createPipedriveCatalogEndpoint(
				'apiV1.callLogs.getUserCallLogs',
				PipedriveCatalog['apiV1.callLogs.getUserCallLogs'],
			),
			deleteCallLog: createPipedriveCatalogEndpoint(
				'apiV1.callLogs.deleteCallLog',
				PipedriveCatalog['apiV1.callLogs.deleteCallLog'],
			),
			getCallLog: createPipedriveCatalogEndpoint(
				'apiV1.callLogs.getCallLog',
				PipedriveCatalog['apiV1.callLogs.getCallLog'],
			),
			addCallLogAudioFile: createPipedriveCatalogEndpoint(
				'apiV1.callLogs.addCallLogAudioFile',
				PipedriveCatalog['apiV1.callLogs.addCallLogAudioFile'],
			),
		},
		channels: {
			addChannel: createPipedriveCatalogEndpoint(
				'apiV1.channels.addChannel',
				PipedriveCatalog['apiV1.channels.addChannel'],
			),
			deleteChannel: createPipedriveCatalogEndpoint(
				'apiV1.channels.deleteChannel',
				PipedriveCatalog['apiV1.channels.deleteChannel'],
			),
			receiveMessage: createPipedriveCatalogEndpoint(
				'apiV1.channels.receiveMessage',
				PipedriveCatalog['apiV1.channels.receiveMessage'],
			),
			deleteConversation: createPipedriveCatalogEndpoint(
				'apiV1.channels.deleteConversation',
				PipedriveCatalog['apiV1.channels.deleteConversation'],
			),
		},
		currencies: {
			getCurrencies: createPipedriveCatalogEndpoint(
				'apiV1.currencies.getCurrencies',
				PipedriveCatalog['apiV1.currencies.getCurrencies'],
			),
		},
		deals: {
			getArchivedDeals: createPipedriveCatalogEndpoint(
				'apiV1.deals.getArchivedDeals',
				PipedriveCatalog['apiV1.deals.getArchivedDeals'],
			),
			getDealsSummary: createPipedriveCatalogEndpoint(
				'apiV1.deals.getDealsSummary',
				PipedriveCatalog['apiV1.deals.getDealsSummary'],
			),
			getArchivedDealsSummary: createPipedriveCatalogEndpoint(
				'apiV1.deals.getArchivedDealsSummary',
				PipedriveCatalog['apiV1.deals.getArchivedDealsSummary'],
			),
			getDealsTimeline: createPipedriveCatalogEndpoint(
				'apiV1.deals.getDealsTimeline',
				PipedriveCatalog['apiV1.deals.getDealsTimeline'],
			),
			getArchivedDealsTimeline: createPipedriveCatalogEndpoint(
				'apiV1.deals.getArchivedDealsTimeline',
				PipedriveCatalog['apiV1.deals.getArchivedDealsTimeline'],
			),
			getDealChangelog: createPipedriveCatalogEndpoint(
				'apiV1.deals.getDealChangelog',
				PipedriveCatalog['apiV1.deals.getDealChangelog'],
			),
			duplicateDeal: createPipedriveCatalogEndpoint(
				'apiV1.deals.duplicateDeal',
				PipedriveCatalog['apiV1.deals.duplicateDeal'],
			),
			getDealFiles: createPipedriveCatalogEndpoint(
				'apiV1.deals.getDealFiles',
				PipedriveCatalog['apiV1.deals.getDealFiles'],
			),
			getDealUpdates: createPipedriveCatalogEndpoint(
				'apiV1.deals.getDealUpdates',
				PipedriveCatalog['apiV1.deals.getDealUpdates'],
			),
			getDealParticipantsChangelog: createPipedriveCatalogEndpoint(
				'apiV1.deals.getDealParticipantsChangelog',
				PipedriveCatalog['apiV1.deals.getDealParticipantsChangelog'],
			),
			getDealFollowers: createPipedriveCatalogEndpoint(
				'apiV1.deals.getDealFollowers',
				PipedriveCatalog['apiV1.deals.getDealFollowers'],
			),
			addDealFollower: createPipedriveCatalogEndpoint(
				'apiV1.deals.addDealFollower',
				PipedriveCatalog['apiV1.deals.addDealFollower'],
			),
			deleteDealFollower: createPipedriveCatalogEndpoint(
				'apiV1.deals.deleteDealFollower',
				PipedriveCatalog['apiV1.deals.deleteDealFollower'],
			),
			getDealMailMessages: createPipedriveCatalogEndpoint(
				'apiV1.deals.getDealMailMessages',
				PipedriveCatalog['apiV1.deals.getDealMailMessages'],
			),
			mergeDeals: createPipedriveCatalogEndpoint(
				'apiV1.deals.mergeDeals',
				PipedriveCatalog['apiV1.deals.mergeDeals'],
			),
			getDealParticipants: createPipedriveCatalogEndpoint(
				'apiV1.deals.getDealParticipants',
				PipedriveCatalog['apiV1.deals.getDealParticipants'],
			),
			addDealParticipant: createPipedriveCatalogEndpoint(
				'apiV1.deals.addDealParticipant',
				PipedriveCatalog['apiV1.deals.addDealParticipant'],
			),
			deleteDealParticipant: createPipedriveCatalogEndpoint(
				'apiV1.deals.deleteDealParticipant',
				PipedriveCatalog['apiV1.deals.deleteDealParticipant'],
			),
			getDealUsers: createPipedriveCatalogEndpoint(
				'apiV1.deals.getDealUsers',
				PipedriveCatalog['apiV1.deals.getDealUsers'],
			),
		},
		dealFields: {
			getDealFields: createPipedriveCatalogEndpoint(
				'apiV1.dealFields.getDealFields',
				PipedriveCatalog['apiV1.dealFields.getDealFields'],
			),
			addDealField: createPipedriveCatalogEndpoint(
				'apiV1.dealFields.addDealField',
				PipedriveCatalog['apiV1.dealFields.addDealField'],
			),
			deleteDealFields: createPipedriveCatalogEndpoint(
				'apiV1.dealFields.deleteDealFields',
				PipedriveCatalog['apiV1.dealFields.deleteDealFields'],
			),
			getDealField: createPipedriveCatalogEndpoint(
				'apiV1.dealFields.getDealField',
				PipedriveCatalog['apiV1.dealFields.getDealField'],
			),
			deleteDealField: createPipedriveCatalogEndpoint(
				'apiV1.dealFields.deleteDealField',
				PipedriveCatalog['apiV1.dealFields.deleteDealField'],
			),
			updateDealField: createPipedriveCatalogEndpoint(
				'apiV1.dealFields.updateDealField',
				PipedriveCatalog['apiV1.dealFields.updateDealField'],
			),
		},
		files: {
			getFiles: createPipedriveCatalogEndpoint(
				'apiV1.files.getFiles',
				PipedriveCatalog['apiV1.files.getFiles'],
			),
			addFile: createPipedriveCatalogEndpoint(
				'apiV1.files.addFile',
				PipedriveCatalog['apiV1.files.addFile'],
			),
			addFileAndLinkIt: createPipedriveCatalogEndpoint(
				'apiV1.files.addFileAndLinkIt',
				PipedriveCatalog['apiV1.files.addFileAndLinkIt'],
			),
			linkFileToItem: createPipedriveCatalogEndpoint(
				'apiV1.files.linkFileToItem',
				PipedriveCatalog['apiV1.files.linkFileToItem'],
			),
			deleteFile: createPipedriveCatalogEndpoint(
				'apiV1.files.deleteFile',
				PipedriveCatalog['apiV1.files.deleteFile'],
			),
			getFile: createPipedriveCatalogEndpoint(
				'apiV1.files.getFile',
				PipedriveCatalog['apiV1.files.getFile'],
			),
			updateFile: createPipedriveCatalogEndpoint(
				'apiV1.files.updateFile',
				PipedriveCatalog['apiV1.files.updateFile'],
			),
			downloadFile: createPipedriveCatalogEndpoint(
				'apiV1.files.downloadFile',
				PipedriveCatalog['apiV1.files.downloadFile'],
			),
		},
		filters: {
			deleteFilters: createPipedriveCatalogEndpoint(
				'apiV1.filters.deleteFilters',
				PipedriveCatalog['apiV1.filters.deleteFilters'],
			),
			getFilters: createPipedriveCatalogEndpoint(
				'apiV1.filters.getFilters',
				PipedriveCatalog['apiV1.filters.getFilters'],
			),
			addFilter: createPipedriveCatalogEndpoint(
				'apiV1.filters.addFilter',
				PipedriveCatalog['apiV1.filters.addFilter'],
			),
			getFilterHelpers: createPipedriveCatalogEndpoint(
				'apiV1.filters.getFilterHelpers',
				PipedriveCatalog['apiV1.filters.getFilterHelpers'],
			),
			deleteFilter: createPipedriveCatalogEndpoint(
				'apiV1.filters.deleteFilter',
				PipedriveCatalog['apiV1.filters.deleteFilter'],
			),
			getFilter: createPipedriveCatalogEndpoint(
				'apiV1.filters.getFilter',
				PipedriveCatalog['apiV1.filters.getFilter'],
			),
			updateFilter: createPipedriveCatalogEndpoint(
				'apiV1.filters.updateFilter',
				PipedriveCatalog['apiV1.filters.updateFilter'],
			),
		},
		goals: {
			addGoal: createPipedriveCatalogEndpoint(
				'apiV1.goals.addGoal',
				PipedriveCatalog['apiV1.goals.addGoal'],
			),
			getGoals: createPipedriveCatalogEndpoint(
				'apiV1.goals.getGoals',
				PipedriveCatalog['apiV1.goals.getGoals'],
			),
			updateGoal: createPipedriveCatalogEndpoint(
				'apiV1.goals.updateGoal',
				PipedriveCatalog['apiV1.goals.updateGoal'],
			),
			deleteGoal: createPipedriveCatalogEndpoint(
				'apiV1.goals.deleteGoal',
				PipedriveCatalog['apiV1.goals.deleteGoal'],
			),
			getGoalResult: createPipedriveCatalogEndpoint(
				'apiV1.goals.getGoalResult',
				PipedriveCatalog['apiV1.goals.getGoalResult'],
			),
		},
		leads: {
			getLeads: createPipedriveCatalogEndpoint(
				'apiV1.leads.getLeads',
				PipedriveCatalog['apiV1.leads.getLeads'],
			),
			addLead: createPipedriveCatalogEndpoint(
				'apiV1.leads.addLead',
				PipedriveCatalog['apiV1.leads.addLead'],
			),
			getArchivedLeads: createPipedriveCatalogEndpoint(
				'apiV1.leads.getArchivedLeads',
				PipedriveCatalog['apiV1.leads.getArchivedLeads'],
			),
			getLead: createPipedriveCatalogEndpoint(
				'apiV1.leads.getLead',
				PipedriveCatalog['apiV1.leads.getLead'],
			),
			updateLead: createPipedriveCatalogEndpoint(
				'apiV1.leads.updateLead',
				PipedriveCatalog['apiV1.leads.updateLead'],
			),
			deleteLead: createPipedriveCatalogEndpoint(
				'apiV1.leads.deleteLead',
				PipedriveCatalog['apiV1.leads.deleteLead'],
			),
			getLeadUsers: createPipedriveCatalogEndpoint(
				'apiV1.leads.getLeadUsers',
				PipedriveCatalog['apiV1.leads.getLeadUsers'],
			),
			searchLeads: createPipedriveCatalogEndpoint(
				'apiV1.leads.searchLeads',
				PipedriveCatalog['apiV1.leads.searchLeads'],
			),
		},
		leadFields: {
			getLeadFields: createPipedriveCatalogEndpoint(
				'apiV1.leadFields.getLeadFields',
				PipedriveCatalog['apiV1.leadFields.getLeadFields'],
			),
		},
		leadLabels: {
			getLeadLabels: createPipedriveCatalogEndpoint(
				'apiV1.leadLabels.getLeadLabels',
				PipedriveCatalog['apiV1.leadLabels.getLeadLabels'],
			),
			addLeadLabel: createPipedriveCatalogEndpoint(
				'apiV1.leadLabels.addLeadLabel',
				PipedriveCatalog['apiV1.leadLabels.addLeadLabel'],
			),
			updateLeadLabel: createPipedriveCatalogEndpoint(
				'apiV1.leadLabels.updateLeadLabel',
				PipedriveCatalog['apiV1.leadLabels.updateLeadLabel'],
			),
			deleteLeadLabel: createPipedriveCatalogEndpoint(
				'apiV1.leadLabels.deleteLeadLabel',
				PipedriveCatalog['apiV1.leadLabels.deleteLeadLabel'],
			),
		},
		leadSources: {
			getLeadSources: createPipedriveCatalogEndpoint(
				'apiV1.leadSources.getLeadSources',
				PipedriveCatalog['apiV1.leadSources.getLeadSources'],
			),
		},
		legacyTeams: {
			getTeams: createPipedriveCatalogEndpoint(
				'apiV1.legacyTeams.getTeams',
				PipedriveCatalog['apiV1.legacyTeams.getTeams'],
			),
			addTeam: createPipedriveCatalogEndpoint(
				'apiV1.legacyTeams.addTeam',
				PipedriveCatalog['apiV1.legacyTeams.addTeam'],
			),
			getTeam: createPipedriveCatalogEndpoint(
				'apiV1.legacyTeams.getTeam',
				PipedriveCatalog['apiV1.legacyTeams.getTeam'],
			),
			updateTeam: createPipedriveCatalogEndpoint(
				'apiV1.legacyTeams.updateTeam',
				PipedriveCatalog['apiV1.legacyTeams.updateTeam'],
			),
			getTeamUsers: createPipedriveCatalogEndpoint(
				'apiV1.legacyTeams.getTeamUsers',
				PipedriveCatalog['apiV1.legacyTeams.getTeamUsers'],
			),
			addTeamUser: createPipedriveCatalogEndpoint(
				'apiV1.legacyTeams.addTeamUser',
				PipedriveCatalog['apiV1.legacyTeams.addTeamUser'],
			),
			deleteTeamUser: createPipedriveCatalogEndpoint(
				'apiV1.legacyTeams.deleteTeamUser',
				PipedriveCatalog['apiV1.legacyTeams.deleteTeamUser'],
			),
			getUserTeams: createPipedriveCatalogEndpoint(
				'apiV1.legacyTeams.getUserTeams',
				PipedriveCatalog['apiV1.legacyTeams.getUserTeams'],
			),
		},
		mailbox: {
			getMailMessage: createPipedriveCatalogEndpoint(
				'apiV1.mailbox.getMailMessage',
				PipedriveCatalog['apiV1.mailbox.getMailMessage'],
			),
			getMailThreads: createPipedriveCatalogEndpoint(
				'apiV1.mailbox.getMailThreads',
				PipedriveCatalog['apiV1.mailbox.getMailThreads'],
			),
			deleteMailThread: createPipedriveCatalogEndpoint(
				'apiV1.mailbox.deleteMailThread',
				PipedriveCatalog['apiV1.mailbox.deleteMailThread'],
			),
			getMailThread: createPipedriveCatalogEndpoint(
				'apiV1.mailbox.getMailThread',
				PipedriveCatalog['apiV1.mailbox.getMailThread'],
			),
			updateMailThreadDetails: createPipedriveCatalogEndpoint(
				'apiV1.mailbox.updateMailThreadDetails',
				PipedriveCatalog['apiV1.mailbox.updateMailThreadDetails'],
			),
			getMailThreadMessages: createPipedriveCatalogEndpoint(
				'apiV1.mailbox.getMailThreadMessages',
				PipedriveCatalog['apiV1.mailbox.getMailThreadMessages'],
			),
		},
		meetings: {
			saveUserProviderLink: createPipedriveCatalogEndpoint(
				'apiV1.meetings.saveUserProviderLink',
				PipedriveCatalog['apiV1.meetings.saveUserProviderLink'],
			),
			deleteUserProviderLink: createPipedriveCatalogEndpoint(
				'apiV1.meetings.deleteUserProviderLink',
				PipedriveCatalog['apiV1.meetings.deleteUserProviderLink'],
			),
		},
		notes: {
			getNotes: createPipedriveCatalogEndpoint(
				'apiV1.notes.getNotes',
				PipedriveCatalog['apiV1.notes.getNotes'],
			),
			addNote: createPipedriveCatalogEndpoint(
				'apiV1.notes.addNote',
				PipedriveCatalog['apiV1.notes.addNote'],
			),
			deleteNote: createPipedriveCatalogEndpoint(
				'apiV1.notes.deleteNote',
				PipedriveCatalog['apiV1.notes.deleteNote'],
			),
			getNote: createPipedriveCatalogEndpoint(
				'apiV1.notes.getNote',
				PipedriveCatalog['apiV1.notes.getNote'],
			),
			updateNote: createPipedriveCatalogEndpoint(
				'apiV1.notes.updateNote',
				PipedriveCatalog['apiV1.notes.updateNote'],
			),
			getNoteComments: createPipedriveCatalogEndpoint(
				'apiV1.notes.getNoteComments',
				PipedriveCatalog['apiV1.notes.getNoteComments'],
			),
			addNoteComment: createPipedriveCatalogEndpoint(
				'apiV1.notes.addNoteComment',
				PipedriveCatalog['apiV1.notes.addNoteComment'],
			),
			getComment: createPipedriveCatalogEndpoint(
				'apiV1.notes.getComment',
				PipedriveCatalog['apiV1.notes.getComment'],
			),
			updateCommentForNote: createPipedriveCatalogEndpoint(
				'apiV1.notes.updateCommentForNote',
				PipedriveCatalog['apiV1.notes.updateCommentForNote'],
			),
			deleteComment: createPipedriveCatalogEndpoint(
				'apiV1.notes.deleteComment',
				PipedriveCatalog['apiV1.notes.deleteComment'],
			),
		},
		noteFields: {
			getNoteFields: createPipedriveCatalogEndpoint(
				'apiV1.noteFields.getNoteFields',
				PipedriveCatalog['apiV1.noteFields.getNoteFields'],
			),
		},
		organizations: {
			getOrganizationChangelog: createPipedriveCatalogEndpoint(
				'apiV1.organizations.getOrganizationChangelog',
				PipedriveCatalog['apiV1.organizations.getOrganizationChangelog'],
			),
			getOrganizationFiles: createPipedriveCatalogEndpoint(
				'apiV1.organizations.getOrganizationFiles',
				PipedriveCatalog['apiV1.organizations.getOrganizationFiles'],
			),
			getOrganizationUpdates: createPipedriveCatalogEndpoint(
				'apiV1.organizations.getOrganizationUpdates',
				PipedriveCatalog['apiV1.organizations.getOrganizationUpdates'],
			),
			getOrganizationFollowers: createPipedriveCatalogEndpoint(
				'apiV1.organizations.getOrganizationFollowers',
				PipedriveCatalog['apiV1.organizations.getOrganizationFollowers'],
			),
			addOrganizationFollower: createPipedriveCatalogEndpoint(
				'apiV1.organizations.addOrganizationFollower',
				PipedriveCatalog['apiV1.organizations.addOrganizationFollower'],
			),
			deleteOrganizationFollower: createPipedriveCatalogEndpoint(
				'apiV1.organizations.deleteOrganizationFollower',
				PipedriveCatalog['apiV1.organizations.deleteOrganizationFollower'],
			),
			getOrganizationMailMessages: createPipedriveCatalogEndpoint(
				'apiV1.organizations.getOrganizationMailMessages',
				PipedriveCatalog['apiV1.organizations.getOrganizationMailMessages'],
			),
			mergeOrganizations: createPipedriveCatalogEndpoint(
				'apiV1.organizations.mergeOrganizations',
				PipedriveCatalog['apiV1.organizations.mergeOrganizations'],
			),
			getOrganizationUsers: createPipedriveCatalogEndpoint(
				'apiV1.organizations.getOrganizationUsers',
				PipedriveCatalog['apiV1.organizations.getOrganizationUsers'],
			),
		},
		organizationFields: {
			getOrganizationFields: createPipedriveCatalogEndpoint(
				'apiV1.organizationFields.getOrganizationFields',
				PipedriveCatalog['apiV1.organizationFields.getOrganizationFields'],
			),
			addOrganizationField: createPipedriveCatalogEndpoint(
				'apiV1.organizationFields.addOrganizationField',
				PipedriveCatalog['apiV1.organizationFields.addOrganizationField'],
			),
			deleteOrganizationFields: createPipedriveCatalogEndpoint(
				'apiV1.organizationFields.deleteOrganizationFields',
				PipedriveCatalog['apiV1.organizationFields.deleteOrganizationFields'],
			),
			getOrganizationField: createPipedriveCatalogEndpoint(
				'apiV1.organizationFields.getOrganizationField',
				PipedriveCatalog['apiV1.organizationFields.getOrganizationField'],
			),
			deleteOrganizationField: createPipedriveCatalogEndpoint(
				'apiV1.organizationFields.deleteOrganizationField',
				PipedriveCatalog['apiV1.organizationFields.deleteOrganizationField'],
			),
			updateOrganizationField: createPipedriveCatalogEndpoint(
				'apiV1.organizationFields.updateOrganizationField',
				PipedriveCatalog['apiV1.organizationFields.updateOrganizationField'],
			),
		},
		organizationRelationships: {
			getOrganizationRelationships: createPipedriveCatalogEndpoint(
				'apiV1.organizationRelationships.getOrganizationRelationships',
				PipedriveCatalog[
					'apiV1.organizationRelationships.getOrganizationRelationships'
				],
			),
			addOrganizationRelationship: createPipedriveCatalogEndpoint(
				'apiV1.organizationRelationships.addOrganizationRelationship',
				PipedriveCatalog[
					'apiV1.organizationRelationships.addOrganizationRelationship'
				],
			),
			deleteOrganizationRelationship: createPipedriveCatalogEndpoint(
				'apiV1.organizationRelationships.deleteOrganizationRelationship',
				PipedriveCatalog[
					'apiV1.organizationRelationships.deleteOrganizationRelationship'
				],
			),
			getOrganizationRelationship: createPipedriveCatalogEndpoint(
				'apiV1.organizationRelationships.getOrganizationRelationship',
				PipedriveCatalog[
					'apiV1.organizationRelationships.getOrganizationRelationship'
				],
			),
			updateOrganizationRelationship: createPipedriveCatalogEndpoint(
				'apiV1.organizationRelationships.updateOrganizationRelationship',
				PipedriveCatalog[
					'apiV1.organizationRelationships.updateOrganizationRelationship'
				],
			),
		},
		permissionSets: {
			getPermissionSets: createPipedriveCatalogEndpoint(
				'apiV1.permissionSets.getPermissionSets',
				PipedriveCatalog['apiV1.permissionSets.getPermissionSets'],
			),
			getPermissionSet: createPipedriveCatalogEndpoint(
				'apiV1.permissionSets.getPermissionSet',
				PipedriveCatalog['apiV1.permissionSets.getPermissionSet'],
			),
			getPermissionSetAssignments: createPipedriveCatalogEndpoint(
				'apiV1.permissionSets.getPermissionSetAssignments',
				PipedriveCatalog['apiV1.permissionSets.getPermissionSetAssignments'],
			),
		},
		persons: {
			getPersonChangelog: createPipedriveCatalogEndpoint(
				'apiV1.persons.getPersonChangelog',
				PipedriveCatalog['apiV1.persons.getPersonChangelog'],
			),
			getPersonFiles: createPipedriveCatalogEndpoint(
				'apiV1.persons.getPersonFiles',
				PipedriveCatalog['apiV1.persons.getPersonFiles'],
			),
			getPersonUpdates: createPipedriveCatalogEndpoint(
				'apiV1.persons.getPersonUpdates',
				PipedriveCatalog['apiV1.persons.getPersonUpdates'],
			),
			getPersonFollowers: createPipedriveCatalogEndpoint(
				'apiV1.persons.getPersonFollowers',
				PipedriveCatalog['apiV1.persons.getPersonFollowers'],
			),
			addPersonFollower: createPipedriveCatalogEndpoint(
				'apiV1.persons.addPersonFollower',
				PipedriveCatalog['apiV1.persons.addPersonFollower'],
			),
			deletePersonFollower: createPipedriveCatalogEndpoint(
				'apiV1.persons.deletePersonFollower',
				PipedriveCatalog['apiV1.persons.deletePersonFollower'],
			),
			getPersonMailMessages: createPipedriveCatalogEndpoint(
				'apiV1.persons.getPersonMailMessages',
				PipedriveCatalog['apiV1.persons.getPersonMailMessages'],
			),
			mergePersons: createPipedriveCatalogEndpoint(
				'apiV1.persons.mergePersons',
				PipedriveCatalog['apiV1.persons.mergePersons'],
			),
			getPersonUsers: createPipedriveCatalogEndpoint(
				'apiV1.persons.getPersonUsers',
				PipedriveCatalog['apiV1.persons.getPersonUsers'],
			),
			deletePersonPicture: createPipedriveCatalogEndpoint(
				'apiV1.persons.deletePersonPicture',
				PipedriveCatalog['apiV1.persons.deletePersonPicture'],
			),
			addPersonPicture: createPipedriveCatalogEndpoint(
				'apiV1.persons.addPersonPicture',
				PipedriveCatalog['apiV1.persons.addPersonPicture'],
			),
			getPersonProducts: createPipedriveCatalogEndpoint(
				'apiV1.persons.getPersonProducts',
				PipedriveCatalog['apiV1.persons.getPersonProducts'],
			),
		},
		personFields: {
			getPersonFields: createPipedriveCatalogEndpoint(
				'apiV1.personFields.getPersonFields',
				PipedriveCatalog['apiV1.personFields.getPersonFields'],
			),
			addPersonField: createPipedriveCatalogEndpoint(
				'apiV1.personFields.addPersonField',
				PipedriveCatalog['apiV1.personFields.addPersonField'],
			),
			deletePersonFields: createPipedriveCatalogEndpoint(
				'apiV1.personFields.deletePersonFields',
				PipedriveCatalog['apiV1.personFields.deletePersonFields'],
			),
			getPersonField: createPipedriveCatalogEndpoint(
				'apiV1.personFields.getPersonField',
				PipedriveCatalog['apiV1.personFields.getPersonField'],
			),
			deletePersonField: createPipedriveCatalogEndpoint(
				'apiV1.personFields.deletePersonField',
				PipedriveCatalog['apiV1.personFields.deletePersonField'],
			),
			updatePersonField: createPipedriveCatalogEndpoint(
				'apiV1.personFields.updatePersonField',
				PipedriveCatalog['apiV1.personFields.updatePersonField'],
			),
		},
		pipelines: {
			getPipelineConversionStatistics: createPipedriveCatalogEndpoint(
				'apiV1.pipelines.getPipelineConversionStatistics',
				PipedriveCatalog['apiV1.pipelines.getPipelineConversionStatistics'],
			),
			getPipelineDeals: createPipedriveCatalogEndpoint(
				'apiV1.pipelines.getPipelineDeals',
				PipedriveCatalog['apiV1.pipelines.getPipelineDeals'],
			),
			getPipelineMovementStatistics: createPipedriveCatalogEndpoint(
				'apiV1.pipelines.getPipelineMovementStatistics',
				PipedriveCatalog['apiV1.pipelines.getPipelineMovementStatistics'],
			),
		},
		products: {
			getProductDeals: createPipedriveCatalogEndpoint(
				'apiV1.products.getProductDeals',
				PipedriveCatalog['apiV1.products.getProductDeals'],
			),
			getProductFiles: createPipedriveCatalogEndpoint(
				'apiV1.products.getProductFiles',
				PipedriveCatalog['apiV1.products.getProductFiles'],
			),
			getProductFollowers: createPipedriveCatalogEndpoint(
				'apiV1.products.getProductFollowers',
				PipedriveCatalog['apiV1.products.getProductFollowers'],
			),
			addProductFollower: createPipedriveCatalogEndpoint(
				'apiV1.products.addProductFollower',
				PipedriveCatalog['apiV1.products.addProductFollower'],
			),
			deleteProductFollower: createPipedriveCatalogEndpoint(
				'apiV1.products.deleteProductFollower',
				PipedriveCatalog['apiV1.products.deleteProductFollower'],
			),
			getProductUsers: createPipedriveCatalogEndpoint(
				'apiV1.products.getProductUsers',
				PipedriveCatalog['apiV1.products.getProductUsers'],
			),
		},
		productFields: {
			deleteProductFields: createPipedriveCatalogEndpoint(
				'apiV1.productFields.deleteProductFields',
				PipedriveCatalog['apiV1.productFields.deleteProductFields'],
			),
			getProductFields: createPipedriveCatalogEndpoint(
				'apiV1.productFields.getProductFields',
				PipedriveCatalog['apiV1.productFields.getProductFields'],
			),
			addProductField: createPipedriveCatalogEndpoint(
				'apiV1.productFields.addProductField',
				PipedriveCatalog['apiV1.productFields.addProductField'],
			),
			deleteProductField: createPipedriveCatalogEndpoint(
				'apiV1.productFields.deleteProductField',
				PipedriveCatalog['apiV1.productFields.deleteProductField'],
			),
			getProductField: createPipedriveCatalogEndpoint(
				'apiV1.productFields.getProductField',
				PipedriveCatalog['apiV1.productFields.getProductField'],
			),
			updateProductField: createPipedriveCatalogEndpoint(
				'apiV1.productFields.updateProductField',
				PipedriveCatalog['apiV1.productFields.updateProductField'],
			),
		},
		projects: {
			getProjects: createPipedriveCatalogEndpoint(
				'apiV1.projects.getProjects',
				PipedriveCatalog['apiV1.projects.getProjects'],
			),
			addProject: createPipedriveCatalogEndpoint(
				'apiV1.projects.addProject',
				PipedriveCatalog['apiV1.projects.addProject'],
			),
			getProject: createPipedriveCatalogEndpoint(
				'apiV1.projects.getProject',
				PipedriveCatalog['apiV1.projects.getProject'],
			),
			updateProject: createPipedriveCatalogEndpoint(
				'apiV1.projects.updateProject',
				PipedriveCatalog['apiV1.projects.updateProject'],
			),
			deleteProject: createPipedriveCatalogEndpoint(
				'apiV1.projects.deleteProject',
				PipedriveCatalog['apiV1.projects.deleteProject'],
			),
			archiveProject: createPipedriveCatalogEndpoint(
				'apiV1.projects.archiveProject',
				PipedriveCatalog['apiV1.projects.archiveProject'],
			),
			getProjectPlan: createPipedriveCatalogEndpoint(
				'apiV1.projects.getProjectPlan',
				PipedriveCatalog['apiV1.projects.getProjectPlan'],
			),
			putProjectPlanActivity: createPipedriveCatalogEndpoint(
				'apiV1.projects.putProjectPlanActivity',
				PipedriveCatalog['apiV1.projects.putProjectPlanActivity'],
			),
			putProjectPlanTask: createPipedriveCatalogEndpoint(
				'apiV1.projects.putProjectPlanTask',
				PipedriveCatalog['apiV1.projects.putProjectPlanTask'],
			),
			getProjectGroups: createPipedriveCatalogEndpoint(
				'apiV1.projects.getProjectGroups',
				PipedriveCatalog['apiV1.projects.getProjectGroups'],
			),
			getProjectTasks: createPipedriveCatalogEndpoint(
				'apiV1.projects.getProjectTasks',
				PipedriveCatalog['apiV1.projects.getProjectTasks'],
			),
			getProjectActivities: createPipedriveCatalogEndpoint(
				'apiV1.projects.getProjectActivities',
				PipedriveCatalog['apiV1.projects.getProjectActivities'],
			),
		},
		projectBoards: {
			getProjectsBoards: createPipedriveCatalogEndpoint(
				'apiV1.projectBoards.getProjectsBoards',
				PipedriveCatalog['apiV1.projectBoards.getProjectsBoards'],
			),
			getProjectsBoard: createPipedriveCatalogEndpoint(
				'apiV1.projectBoards.getProjectsBoard',
				PipedriveCatalog['apiV1.projectBoards.getProjectsBoard'],
			),
		},
		projectPhases: {
			getProjectsPhases: createPipedriveCatalogEndpoint(
				'apiV1.projectPhases.getProjectsPhases',
				PipedriveCatalog['apiV1.projectPhases.getProjectsPhases'],
			),
			getProjectsPhase: createPipedriveCatalogEndpoint(
				'apiV1.projectPhases.getProjectsPhase',
				PipedriveCatalog['apiV1.projectPhases.getProjectsPhase'],
			),
		},
		projectTemplates: {
			getProjectTemplates: createPipedriveCatalogEndpoint(
				'apiV1.projectTemplates.getProjectTemplates',
				PipedriveCatalog['apiV1.projectTemplates.getProjectTemplates'],
			),
			getProjectTemplate: createPipedriveCatalogEndpoint(
				'apiV1.projectTemplates.getProjectTemplate',
				PipedriveCatalog['apiV1.projectTemplates.getProjectTemplate'],
			),
		},
		recents: {
			getRecents: createPipedriveCatalogEndpoint(
				'apiV1.recents.getRecents',
				PipedriveCatalog['apiV1.recents.getRecents'],
			),
		},
		roles: {
			getRoles: createPipedriveCatalogEndpoint(
				'apiV1.roles.getRoles',
				PipedriveCatalog['apiV1.roles.getRoles'],
			),
			addRole: createPipedriveCatalogEndpoint(
				'apiV1.roles.addRole',
				PipedriveCatalog['apiV1.roles.addRole'],
			),
			deleteRole: createPipedriveCatalogEndpoint(
				'apiV1.roles.deleteRole',
				PipedriveCatalog['apiV1.roles.deleteRole'],
			),
			getRole: createPipedriveCatalogEndpoint(
				'apiV1.roles.getRole',
				PipedriveCatalog['apiV1.roles.getRole'],
			),
			updateRole: createPipedriveCatalogEndpoint(
				'apiV1.roles.updateRole',
				PipedriveCatalog['apiV1.roles.updateRole'],
			),
			deleteRoleAssignment: createPipedriveCatalogEndpoint(
				'apiV1.roles.deleteRoleAssignment',
				PipedriveCatalog['apiV1.roles.deleteRoleAssignment'],
			),
			getRoleAssignments: createPipedriveCatalogEndpoint(
				'apiV1.roles.getRoleAssignments',
				PipedriveCatalog['apiV1.roles.getRoleAssignments'],
			),
			addRoleAssignment: createPipedriveCatalogEndpoint(
				'apiV1.roles.addRoleAssignment',
				PipedriveCatalog['apiV1.roles.addRoleAssignment'],
			),
			getRoleSettings: createPipedriveCatalogEndpoint(
				'apiV1.roles.getRoleSettings',
				PipedriveCatalog['apiV1.roles.getRoleSettings'],
			),
			addOrUpdateRoleSetting: createPipedriveCatalogEndpoint(
				'apiV1.roles.addOrUpdateRoleSetting',
				PipedriveCatalog['apiV1.roles.addOrUpdateRoleSetting'],
			),
			getRolePipelines: createPipedriveCatalogEndpoint(
				'apiV1.roles.getRolePipelines',
				PipedriveCatalog['apiV1.roles.getRolePipelines'],
			),
			updateRolePipelines: createPipedriveCatalogEndpoint(
				'apiV1.roles.updateRolePipelines',
				PipedriveCatalog['apiV1.roles.updateRolePipelines'],
			),
		},
		stages: {
			getStageDeals: createPipedriveCatalogEndpoint(
				'apiV1.stages.getStageDeals',
				PipedriveCatalog['apiV1.stages.getStageDeals'],
			),
		},
		tasks: {
			getTasks: createPipedriveCatalogEndpoint(
				'apiV1.tasks.getTasks',
				PipedriveCatalog['apiV1.tasks.getTasks'],
			),
			addTask: createPipedriveCatalogEndpoint(
				'apiV1.tasks.addTask',
				PipedriveCatalog['apiV1.tasks.addTask'],
			),
			getTask: createPipedriveCatalogEndpoint(
				'apiV1.tasks.getTask',
				PipedriveCatalog['apiV1.tasks.getTask'],
			),
			updateTask: createPipedriveCatalogEndpoint(
				'apiV1.tasks.updateTask',
				PipedriveCatalog['apiV1.tasks.updateTask'],
			),
			deleteTask: createPipedriveCatalogEndpoint(
				'apiV1.tasks.deleteTask',
				PipedriveCatalog['apiV1.tasks.deleteTask'],
			),
		},
		users: {
			getUsers: createPipedriveCatalogEndpoint(
				'apiV1.users.getUsers',
				PipedriveCatalog['apiV1.users.getUsers'],
			),
			addUser: createPipedriveCatalogEndpoint(
				'apiV1.users.addUser',
				PipedriveCatalog['apiV1.users.addUser'],
			),
			findUsersByName: createPipedriveCatalogEndpoint(
				'apiV1.users.findUsersByName',
				PipedriveCatalog['apiV1.users.findUsersByName'],
			),
			getCurrentUser: createPipedriveCatalogEndpoint(
				'apiV1.users.getCurrentUser',
				PipedriveCatalog['apiV1.users.getCurrentUser'],
			),
			getUser: createPipedriveCatalogEndpoint(
				'apiV1.users.getUser',
				PipedriveCatalog['apiV1.users.getUser'],
			),
			updateUser: createPipedriveCatalogEndpoint(
				'apiV1.users.updateUser',
				PipedriveCatalog['apiV1.users.updateUser'],
			),
			getUserFollowers: createPipedriveCatalogEndpoint(
				'apiV1.users.getUserFollowers',
				PipedriveCatalog['apiV1.users.getUserFollowers'],
			),
			getUserPermissions: createPipedriveCatalogEndpoint(
				'apiV1.users.getUserPermissions',
				PipedriveCatalog['apiV1.users.getUserPermissions'],
			),
			getUserRoleAssignments: createPipedriveCatalogEndpoint(
				'apiV1.users.getUserRoleAssignments',
				PipedriveCatalog['apiV1.users.getUserRoleAssignments'],
			),
			getUserRoleSettings: createPipedriveCatalogEndpoint(
				'apiV1.users.getUserRoleSettings',
				PipedriveCatalog['apiV1.users.getUserRoleSettings'],
			),
		},
		userConnections: {
			getUserConnections: createPipedriveCatalogEndpoint(
				'apiV1.userConnections.getUserConnections',
				PipedriveCatalog['apiV1.userConnections.getUserConnections'],
			),
		},
		userSettings: {
			getUserSettings: createPipedriveCatalogEndpoint(
				'apiV1.userSettings.getUserSettings',
				PipedriveCatalog['apiV1.userSettings.getUserSettings'],
			),
		},
	},
	apiV2: {
		activityFields: {
			getActivityFields: createPipedriveCatalogEndpoint(
				'apiV2.activityFields.getActivityFields',
				PipedriveCatalog['apiV2.activityFields.getActivityFields'],
			),
			getActivityField: createPipedriveCatalogEndpoint(
				'apiV2.activityFields.getActivityField',
				PipedriveCatalog['apiV2.activityFields.getActivityField'],
			),
		},
		deals: {
			getArchivedDeals: createPipedriveCatalogEndpoint(
				'apiV2.deals.getArchivedDeals',
				PipedriveCatalog['apiV2.deals.getArchivedDeals'],
			),
			getDealFollowers: createPipedriveCatalogEndpoint(
				'apiV2.deals.getDealFollowers',
				PipedriveCatalog['apiV2.deals.getDealFollowers'],
			),
			addDealFollower: createPipedriveCatalogEndpoint(
				'apiV2.deals.addDealFollower',
				PipedriveCatalog['apiV2.deals.addDealFollower'],
			),
			getDealFollowersChangelog: createPipedriveCatalogEndpoint(
				'apiV2.deals.getDealFollowersChangelog',
				PipedriveCatalog['apiV2.deals.getDealFollowersChangelog'],
			),
			deleteDealFollower: createPipedriveCatalogEndpoint(
				'apiV2.deals.deleteDealFollower',
				PipedriveCatalog['apiV2.deals.deleteDealFollower'],
			),
			searchDeals: createPipedriveCatalogEndpoint(
				'apiV2.deals.searchDeals',
				PipedriveCatalog['apiV2.deals.searchDeals'],
			),
			getAdditionalDiscounts: createPipedriveCatalogEndpoint(
				'apiV2.deals.getAdditionalDiscounts',
				PipedriveCatalog['apiV2.deals.getAdditionalDiscounts'],
			),
			postAdditionalDiscount: createPipedriveCatalogEndpoint(
				'apiV2.deals.postAdditionalDiscount',
				PipedriveCatalog['apiV2.deals.postAdditionalDiscount'],
			),
			updateAdditionalDiscount: createPipedriveCatalogEndpoint(
				'apiV2.deals.updateAdditionalDiscount',
				PipedriveCatalog['apiV2.deals.updateAdditionalDiscount'],
			),
			deleteAdditionalDiscount: createPipedriveCatalogEndpoint(
				'apiV2.deals.deleteAdditionalDiscount',
				PipedriveCatalog['apiV2.deals.deleteAdditionalDiscount'],
			),
			convertDealToLead: createPipedriveCatalogEndpoint(
				'apiV2.deals.convertDealToLead',
				PipedriveCatalog['apiV2.deals.convertDealToLead'],
			),
			getDealConversionStatus: createPipedriveCatalogEndpoint(
				'apiV2.deals.getDealConversionStatus',
				PipedriveCatalog['apiV2.deals.getDealConversionStatus'],
			),
		},
		dealProducts: {
			getDealsProducts: createPipedriveCatalogEndpoint(
				'apiV2.dealProducts.getDealsProducts',
				PipedriveCatalog['apiV2.dealProducts.getDealsProducts'],
			),
			getDealProducts: createPipedriveCatalogEndpoint(
				'apiV2.dealProducts.getDealProducts',
				PipedriveCatalog['apiV2.dealProducts.getDealProducts'],
			),
			addDealProduct: createPipedriveCatalogEndpoint(
				'apiV2.dealProducts.addDealProduct',
				PipedriveCatalog['apiV2.dealProducts.addDealProduct'],
			),
			deleteManyDealProducts: createPipedriveCatalogEndpoint(
				'apiV2.dealProducts.deleteManyDealProducts',
				PipedriveCatalog['apiV2.dealProducts.deleteManyDealProducts'],
			),
			updateDealProduct: createPipedriveCatalogEndpoint(
				'apiV2.dealProducts.updateDealProduct',
				PipedriveCatalog['apiV2.dealProducts.updateDealProduct'],
			),
			deleteDealProduct: createPipedriveCatalogEndpoint(
				'apiV2.dealProducts.deleteDealProduct',
				PipedriveCatalog['apiV2.dealProducts.deleteDealProduct'],
			),
			addManyDealProducts: createPipedriveCatalogEndpoint(
				'apiV2.dealProducts.addManyDealProducts',
				PipedriveCatalog['apiV2.dealProducts.addManyDealProducts'],
			),
		},
		dealInstallments: {
			getInstallments: createPipedriveCatalogEndpoint(
				'apiV2.dealInstallments.getInstallments',
				PipedriveCatalog['apiV2.dealInstallments.getInstallments'],
			),
			postInstallment: createPipedriveCatalogEndpoint(
				'apiV2.dealInstallments.postInstallment',
				PipedriveCatalog['apiV2.dealInstallments.postInstallment'],
			),
			updateInstallment: createPipedriveCatalogEndpoint(
				'apiV2.dealInstallments.updateInstallment',
				PipedriveCatalog['apiV2.dealInstallments.updateInstallment'],
			),
			deleteInstallment: createPipedriveCatalogEndpoint(
				'apiV2.dealInstallments.deleteInstallment',
				PipedriveCatalog['apiV2.dealInstallments.deleteInstallment'],
			),
		},
		dealFields: {
			getDealFields: createPipedriveCatalogEndpoint(
				'apiV2.dealFields.getDealFields',
				PipedriveCatalog['apiV2.dealFields.getDealFields'],
			),
			addDealField: createPipedriveCatalogEndpoint(
				'apiV2.dealFields.addDealField',
				PipedriveCatalog['apiV2.dealFields.addDealField'],
			),
			getDealField: createPipedriveCatalogEndpoint(
				'apiV2.dealFields.getDealField',
				PipedriveCatalog['apiV2.dealFields.getDealField'],
			),
			updateDealField: createPipedriveCatalogEndpoint(
				'apiV2.dealFields.updateDealField',
				PipedriveCatalog['apiV2.dealFields.updateDealField'],
			),
			deleteDealField: createPipedriveCatalogEndpoint(
				'apiV2.dealFields.deleteDealField',
				PipedriveCatalog['apiV2.dealFields.deleteDealField'],
			),
			addDealFieldOptions: createPipedriveCatalogEndpoint(
				'apiV2.dealFields.addDealFieldOptions',
				PipedriveCatalog['apiV2.dealFields.addDealFieldOptions'],
			),
			deleteDealFieldOptions: createPipedriveCatalogEndpoint(
				'apiV2.dealFields.deleteDealFieldOptions',
				PipedriveCatalog['apiV2.dealFields.deleteDealFieldOptions'],
			),
			updateDealFieldOptions: createPipedriveCatalogEndpoint(
				'apiV2.dealFields.updateDealFieldOptions',
				PipedriveCatalog['apiV2.dealFields.updateDealFieldOptions'],
			),
		},
		persons: {
			getPersonFollowers: createPipedriveCatalogEndpoint(
				'apiV2.persons.getPersonFollowers',
				PipedriveCatalog['apiV2.persons.getPersonFollowers'],
			),
			addPersonFollower: createPipedriveCatalogEndpoint(
				'apiV2.persons.addPersonFollower',
				PipedriveCatalog['apiV2.persons.addPersonFollower'],
			),
			getPersonFollowersChangelog: createPipedriveCatalogEndpoint(
				'apiV2.persons.getPersonFollowersChangelog',
				PipedriveCatalog['apiV2.persons.getPersonFollowersChangelog'],
			),
			deletePersonFollower: createPipedriveCatalogEndpoint(
				'apiV2.persons.deletePersonFollower',
				PipedriveCatalog['apiV2.persons.deletePersonFollower'],
			),
			getPersonPicture: createPipedriveCatalogEndpoint(
				'apiV2.persons.getPersonPicture',
				PipedriveCatalog['apiV2.persons.getPersonPicture'],
			),
			searchPersons: createPipedriveCatalogEndpoint(
				'apiV2.persons.searchPersons',
				PipedriveCatalog['apiV2.persons.searchPersons'],
			),
		},
		personFields: {
			getPersonFields: createPipedriveCatalogEndpoint(
				'apiV2.personFields.getPersonFields',
				PipedriveCatalog['apiV2.personFields.getPersonFields'],
			),
			addPersonField: createPipedriveCatalogEndpoint(
				'apiV2.personFields.addPersonField',
				PipedriveCatalog['apiV2.personFields.addPersonField'],
			),
			getPersonField: createPipedriveCatalogEndpoint(
				'apiV2.personFields.getPersonField',
				PipedriveCatalog['apiV2.personFields.getPersonField'],
			),
			updatePersonField: createPipedriveCatalogEndpoint(
				'apiV2.personFields.updatePersonField',
				PipedriveCatalog['apiV2.personFields.updatePersonField'],
			),
			deletePersonField: createPipedriveCatalogEndpoint(
				'apiV2.personFields.deletePersonField',
				PipedriveCatalog['apiV2.personFields.deletePersonField'],
			),
			addPersonFieldOptions: createPipedriveCatalogEndpoint(
				'apiV2.personFields.addPersonFieldOptions',
				PipedriveCatalog['apiV2.personFields.addPersonFieldOptions'],
			),
			deletePersonFieldOptions: createPipedriveCatalogEndpoint(
				'apiV2.personFields.deletePersonFieldOptions',
				PipedriveCatalog['apiV2.personFields.deletePersonFieldOptions'],
			),
			updatePersonFieldOptions: createPipedriveCatalogEndpoint(
				'apiV2.personFields.updatePersonFieldOptions',
				PipedriveCatalog['apiV2.personFields.updatePersonFieldOptions'],
			),
		},
		organizations: {
			getOrganizationFollowers: createPipedriveCatalogEndpoint(
				'apiV2.organizations.getOrganizationFollowers',
				PipedriveCatalog['apiV2.organizations.getOrganizationFollowers'],
			),
			addOrganizationFollower: createPipedriveCatalogEndpoint(
				'apiV2.organizations.addOrganizationFollower',
				PipedriveCatalog['apiV2.organizations.addOrganizationFollower'],
			),
			getOrganizationFollowersChangelog: createPipedriveCatalogEndpoint(
				'apiV2.organizations.getOrganizationFollowersChangelog',
				PipedriveCatalog[
					'apiV2.organizations.getOrganizationFollowersChangelog'
				],
			),
			deleteOrganizationFollower: createPipedriveCatalogEndpoint(
				'apiV2.organizations.deleteOrganizationFollower',
				PipedriveCatalog['apiV2.organizations.deleteOrganizationFollower'],
			),
			searchOrganization: createPipedriveCatalogEndpoint(
				'apiV2.organizations.searchOrganization',
				PipedriveCatalog['apiV2.organizations.searchOrganization'],
			),
		},
		organizationFields: {
			getOrganizationFields: createPipedriveCatalogEndpoint(
				'apiV2.organizationFields.getOrganizationFields',
				PipedriveCatalog['apiV2.organizationFields.getOrganizationFields'],
			),
			addOrganizationField: createPipedriveCatalogEndpoint(
				'apiV2.organizationFields.addOrganizationField',
				PipedriveCatalog['apiV2.organizationFields.addOrganizationField'],
			),
			getOrganizationField: createPipedriveCatalogEndpoint(
				'apiV2.organizationFields.getOrganizationField',
				PipedriveCatalog['apiV2.organizationFields.getOrganizationField'],
			),
			updateOrganizationField: createPipedriveCatalogEndpoint(
				'apiV2.organizationFields.updateOrganizationField',
				PipedriveCatalog['apiV2.organizationFields.updateOrganizationField'],
			),
			deleteOrganizationField: createPipedriveCatalogEndpoint(
				'apiV2.organizationFields.deleteOrganizationField',
				PipedriveCatalog['apiV2.organizationFields.deleteOrganizationField'],
			),
			addOrganizationFieldOptions: createPipedriveCatalogEndpoint(
				'apiV2.organizationFields.addOrganizationFieldOptions',
				PipedriveCatalog[
					'apiV2.organizationFields.addOrganizationFieldOptions'
				],
			),
			deleteOrganizationFieldOptions: createPipedriveCatalogEndpoint(
				'apiV2.organizationFields.deleteOrganizationFieldOptions',
				PipedriveCatalog[
					'apiV2.organizationFields.deleteOrganizationFieldOptions'
				],
			),
			updateOrganizationFieldOptions: createPipedriveCatalogEndpoint(
				'apiV2.organizationFields.updateOrganizationFieldOptions',
				PipedriveCatalog[
					'apiV2.organizationFields.updateOrganizationFieldOptions'
				],
			),
		},
		productFields: {
			getProductFields: createPipedriveCatalogEndpoint(
				'apiV2.productFields.getProductFields',
				PipedriveCatalog['apiV2.productFields.getProductFields'],
			),
			addProductField: createPipedriveCatalogEndpoint(
				'apiV2.productFields.addProductField',
				PipedriveCatalog['apiV2.productFields.addProductField'],
			),
			getProductField: createPipedriveCatalogEndpoint(
				'apiV2.productFields.getProductField',
				PipedriveCatalog['apiV2.productFields.getProductField'],
			),
			updateProductField: createPipedriveCatalogEndpoint(
				'apiV2.productFields.updateProductField',
				PipedriveCatalog['apiV2.productFields.updateProductField'],
			),
			deleteProductField: createPipedriveCatalogEndpoint(
				'apiV2.productFields.deleteProductField',
				PipedriveCatalog['apiV2.productFields.deleteProductField'],
			),
			addProductFieldOptions: createPipedriveCatalogEndpoint(
				'apiV2.productFields.addProductFieldOptions',
				PipedriveCatalog['apiV2.productFields.addProductFieldOptions'],
			),
			deleteProductFieldOptions: createPipedriveCatalogEndpoint(
				'apiV2.productFields.deleteProductFieldOptions',
				PipedriveCatalog['apiV2.productFields.deleteProductFieldOptions'],
			),
			updateProductFieldOptions: createPipedriveCatalogEndpoint(
				'apiV2.productFields.updateProductFieldOptions',
				PipedriveCatalog['apiV2.productFields.updateProductFieldOptions'],
			),
		},
		leads: {
			searchLeads: createPipedriveCatalogEndpoint(
				'apiV2.leads.searchLeads',
				PipedriveCatalog['apiV2.leads.searchLeads'],
			),
			convertLeadToDeal: createPipedriveCatalogEndpoint(
				'apiV2.leads.convertLeadToDeal',
				PipedriveCatalog['apiV2.leads.convertLeadToDeal'],
			),
			getLeadConversionStatus: createPipedriveCatalogEndpoint(
				'apiV2.leads.getLeadConversionStatus',
				PipedriveCatalog['apiV2.leads.getLeadConversionStatus'],
			),
		},
		itemSearch: {
			searchItem: createPipedriveCatalogEndpoint(
				'apiV2.itemSearch.searchItem',
				PipedriveCatalog['apiV2.itemSearch.searchItem'],
			),
			searchItemByField: createPipedriveCatalogEndpoint(
				'apiV2.itemSearch.searchItemByField',
				PipedriveCatalog['apiV2.itemSearch.searchItemByField'],
			),
		},
		stages: {
			getStages: createPipedriveCatalogEndpoint(
				'apiV2.stages.getStages',
				PipedriveCatalog['apiV2.stages.getStages'],
			),
			addStage: createPipedriveCatalogEndpoint(
				'apiV2.stages.addStage',
				PipedriveCatalog['apiV2.stages.addStage'],
			),
			deleteStage: createPipedriveCatalogEndpoint(
				'apiV2.stages.deleteStage',
				PipedriveCatalog['apiV2.stages.deleteStage'],
			),
			getStage: createPipedriveCatalogEndpoint(
				'apiV2.stages.getStage',
				PipedriveCatalog['apiV2.stages.getStage'],
			),
			updateStage: createPipedriveCatalogEndpoint(
				'apiV2.stages.updateStage',
				PipedriveCatalog['apiV2.stages.updateStage'],
			),
		},
		pipelines: {
			getPipelines: createPipedriveCatalogEndpoint(
				'apiV2.pipelines.getPipelines',
				PipedriveCatalog['apiV2.pipelines.getPipelines'],
			),
			addPipeline: createPipedriveCatalogEndpoint(
				'apiV2.pipelines.addPipeline',
				PipedriveCatalog['apiV2.pipelines.addPipeline'],
			),
			deletePipeline: createPipedriveCatalogEndpoint(
				'apiV2.pipelines.deletePipeline',
				PipedriveCatalog['apiV2.pipelines.deletePipeline'],
			),
			getPipeline: createPipedriveCatalogEndpoint(
				'apiV2.pipelines.getPipeline',
				PipedriveCatalog['apiV2.pipelines.getPipeline'],
			),
			updatePipeline: createPipedriveCatalogEndpoint(
				'apiV2.pipelines.updatePipeline',
				PipedriveCatalog['apiV2.pipelines.updatePipeline'],
			),
		},
		projectFields: {
			getProjectFields: createPipedriveCatalogEndpoint(
				'apiV2.projectFields.getProjectFields',
				PipedriveCatalog['apiV2.projectFields.getProjectFields'],
			),
			addProjectField: createPipedriveCatalogEndpoint(
				'apiV2.projectFields.addProjectField',
				PipedriveCatalog['apiV2.projectFields.addProjectField'],
			),
			getProjectField: createPipedriveCatalogEndpoint(
				'apiV2.projectFields.getProjectField',
				PipedriveCatalog['apiV2.projectFields.getProjectField'],
			),
			updateProjectField: createPipedriveCatalogEndpoint(
				'apiV2.projectFields.updateProjectField',
				PipedriveCatalog['apiV2.projectFields.updateProjectField'],
			),
			deleteProjectField: createPipedriveCatalogEndpoint(
				'apiV2.projectFields.deleteProjectField',
				PipedriveCatalog['apiV2.projectFields.deleteProjectField'],
			),
			addProjectFieldOptions: createPipedriveCatalogEndpoint(
				'apiV2.projectFields.addProjectFieldOptions',
				PipedriveCatalog['apiV2.projectFields.addProjectFieldOptions'],
			),
			deleteProjectFieldOptions: createPipedriveCatalogEndpoint(
				'apiV2.projectFields.deleteProjectFieldOptions',
				PipedriveCatalog['apiV2.projectFields.deleteProjectFieldOptions'],
			),
			updateProjectFieldOptions: createPipedriveCatalogEndpoint(
				'apiV2.projectFields.updateProjectFieldOptions',
				PipedriveCatalog['apiV2.projectFields.updateProjectFieldOptions'],
			),
		},
		projects: {
			getProjects: createPipedriveCatalogEndpoint(
				'apiV2.projects.getProjects',
				PipedriveCatalog['apiV2.projects.getProjects'],
			),
			addProject: createPipedriveCatalogEndpoint(
				'apiV2.projects.addProject',
				PipedriveCatalog['apiV2.projects.addProject'],
			),
			getArchivedProjects: createPipedriveCatalogEndpoint(
				'apiV2.projects.getArchivedProjects',
				PipedriveCatalog['apiV2.projects.getArchivedProjects'],
			),
			getProject: createPipedriveCatalogEndpoint(
				'apiV2.projects.getProject',
				PipedriveCatalog['apiV2.projects.getProject'],
			),
			updateProject: createPipedriveCatalogEndpoint(
				'apiV2.projects.updateProject',
				PipedriveCatalog['apiV2.projects.updateProject'],
			),
			deleteProject: createPipedriveCatalogEndpoint(
				'apiV2.projects.deleteProject',
				PipedriveCatalog['apiV2.projects.deleteProject'],
			),
			searchProjects: createPipedriveCatalogEndpoint(
				'apiV2.projects.searchProjects',
				PipedriveCatalog['apiV2.projects.searchProjects'],
			),
			archiveProject: createPipedriveCatalogEndpoint(
				'apiV2.projects.archiveProject',
				PipedriveCatalog['apiV2.projects.archiveProject'],
			),
			getProjectUsers: createPipedriveCatalogEndpoint(
				'apiV2.projects.getProjectUsers',
				PipedriveCatalog['apiV2.projects.getProjectUsers'],
			),
			getProjectChangelog: createPipedriveCatalogEndpoint(
				'apiV2.projects.getProjectChangelog',
				PipedriveCatalog['apiV2.projects.getProjectChangelog'],
			),
		},
		projectTemplates: {
			getProjectTemplates: createPipedriveCatalogEndpoint(
				'apiV2.projectTemplates.getProjectTemplates',
				PipedriveCatalog['apiV2.projectTemplates.getProjectTemplates'],
			),
			getProjectTemplate: createPipedriveCatalogEndpoint(
				'apiV2.projectTemplates.getProjectTemplate',
				PipedriveCatalog['apiV2.projectTemplates.getProjectTemplate'],
			),
		},
		projectBoards: {
			getProjectsBoards: createPipedriveCatalogEndpoint(
				'apiV2.projectBoards.getProjectsBoards',
				PipedriveCatalog['apiV2.projectBoards.getProjectsBoards'],
			),
			addProjectBoard: createPipedriveCatalogEndpoint(
				'apiV2.projectBoards.addProjectBoard',
				PipedriveCatalog['apiV2.projectBoards.addProjectBoard'],
			),
			getProjectsBoard: createPipedriveCatalogEndpoint(
				'apiV2.projectBoards.getProjectsBoard',
				PipedriveCatalog['apiV2.projectBoards.getProjectsBoard'],
			),
			updateProjectBoard: createPipedriveCatalogEndpoint(
				'apiV2.projectBoards.updateProjectBoard',
				PipedriveCatalog['apiV2.projectBoards.updateProjectBoard'],
			),
			deleteProjectBoard: createPipedriveCatalogEndpoint(
				'apiV2.projectBoards.deleteProjectBoard',
				PipedriveCatalog['apiV2.projectBoards.deleteProjectBoard'],
			),
		},
		projectPhases: {
			getProjectsPhases: createPipedriveCatalogEndpoint(
				'apiV2.projectPhases.getProjectsPhases',
				PipedriveCatalog['apiV2.projectPhases.getProjectsPhases'],
			),
			addProjectPhase: createPipedriveCatalogEndpoint(
				'apiV2.projectPhases.addProjectPhase',
				PipedriveCatalog['apiV2.projectPhases.addProjectPhase'],
			),
			getProjectsPhase: createPipedriveCatalogEndpoint(
				'apiV2.projectPhases.getProjectsPhase',
				PipedriveCatalog['apiV2.projectPhases.getProjectsPhase'],
			),
			updateProjectPhase: createPipedriveCatalogEndpoint(
				'apiV2.projectPhases.updateProjectPhase',
				PipedriveCatalog['apiV2.projectPhases.updateProjectPhase'],
			),
			deleteProjectPhase: createPipedriveCatalogEndpoint(
				'apiV2.projectPhases.deleteProjectPhase',
				PipedriveCatalog['apiV2.projectPhases.deleteProjectPhase'],
			),
		},
		users: {
			getUserFollowers: createPipedriveCatalogEndpoint(
				'apiV2.users.getUserFollowers',
				PipedriveCatalog['apiV2.users.getUserFollowers'],
			),
		},
	},
} as const;

export const pipedriveCatalogEndpointMeta = {
	'apiV1.activityFields.getActivityFields': {
		riskLevel: 'read',
		description:
			'Get all activity fields (GET /activityFields; 20 API tokens; OAuth scopes: activities:read, activities:full)',
	},
	'apiV1.activityTypes.getActivityTypes': {
		riskLevel: 'read',
		description:
			'Get all activity types (GET /activityTypes; 20 API tokens; OAuth scopes: activities:read, activities:full, admin)',
	},
	'apiV1.activityTypes.addActivityType': {
		riskLevel: 'write',
		description:
			'Add new activity type (POST /activityTypes; 10 API tokens; OAuth scopes: admin)',
	},
	'apiV1.activityTypes.deleteActivityType': {
		riskLevel: 'destructive',
		description:
			'Delete an activity type (DELETE /activityTypes/{id}; 6 API tokens; OAuth scopes: admin)',
	},
	'apiV1.activityTypes.updateActivityType': {
		riskLevel: 'write',
		description:
			'Update an activity type (PUT /activityTypes/{id}; 10 API tokens; OAuth scopes: admin)',
	},
	'apiV1.billing.getCompanyAddons': {
		riskLevel: 'read',
		description:
			'Get all add-ons for a single company (GET /billing/subscriptions/addons; 20 API tokens; OAuth scopes: users:read)',
	},
	'apiV1.callLogs.addCallLog': {
		riskLevel: 'write',
		description:
			'Add a call log (POST /callLogs; 10 API tokens; OAuth scopes: phone-integration)',
	},
	'apiV1.callLogs.getUserCallLogs': {
		riskLevel: 'read',
		description:
			'Get all call logs assigned to a particular user (GET /callLogs; 20 API tokens; OAuth scopes: phone-integration)',
	},
	'apiV1.callLogs.deleteCallLog': {
		riskLevel: 'destructive',
		description:
			'Delete a call log (DELETE /callLogs/{id}; 6 API tokens; OAuth scopes: phone-integration)',
	},
	'apiV1.callLogs.getCallLog': {
		riskLevel: 'read',
		description:
			'Get details of a call log (GET /callLogs/{id}; 2 API tokens; OAuth scopes: phone-integration)',
	},
	'apiV1.callLogs.addCallLogAudioFile': {
		riskLevel: 'write',
		description:
			'Attach an audio file to the call log (POST /callLogs/{id}/recordings; 10 API tokens; OAuth scopes: phone-integration)',
	},
	'apiV1.channels.addChannel': {
		riskLevel: 'write',
		description:
			'Add a channel (POST /channels; 10 API tokens; OAuth scopes: messengers-integration)',
	},
	'apiV1.channels.deleteChannel': {
		riskLevel: 'destructive',
		description:
			'Delete a channel (DELETE /channels/{id}; 6 API tokens; OAuth scopes: messengers-integration)',
	},
	'apiV1.channels.receiveMessage': {
		riskLevel: 'write',
		description:
			'Receives an incoming message (POST /channels/messages/receive; 10 API tokens; OAuth scopes: messengers-integration)',
	},
	'apiV1.channels.deleteConversation': {
		riskLevel: 'destructive',
		description:
			'Delete a conversation (DELETE /channels/{channel-id}/conversations/{conversation-id}; 6 API tokens; OAuth scopes: messengers-integration)',
	},
	'apiV1.currencies.getCurrencies': {
		riskLevel: 'read',
		description:
			'Get all supported currencies (GET /currencies; 20 API tokens; OAuth scopes: base)',
	},
	'apiV1.deals.getArchivedDeals': {
		riskLevel: 'read',
		description:
			'Get all archived deals (GET /deals/archived; 40 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV1.deals.getDealsSummary': {
		riskLevel: 'read',
		description:
			'Get deals summary (GET /deals/summary; 40 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV1.deals.getArchivedDealsSummary': {
		riskLevel: 'read',
		description:
			'Get archived deals summary (GET /deals/summary/archived; 80 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV1.deals.getDealsTimeline': {
		riskLevel: 'read',
		description:
			'Get deals timeline (GET /deals/timeline; 20 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV1.deals.getArchivedDealsTimeline': {
		riskLevel: 'read',
		description:
			'Get archived deals timeline (GET /deals/timeline/archived; 40 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV1.deals.getDealChangelog': {
		riskLevel: 'read',
		description:
			'List updates about deal field values (GET /deals/{id}/changelog; 20 API tokens; OAuth scopes: recents:read)',
	},
	'apiV1.deals.duplicateDeal': {
		riskLevel: 'write',
		description:
			'Duplicate deal (POST /deals/{id}/duplicate; 10 API tokens; OAuth scopes: deals:full)',
	},
	'apiV1.deals.getDealFiles': {
		riskLevel: 'read',
		description:
			'List files attached to a deal (GET /deals/{id}/files; 20 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV1.deals.getDealUpdates': {
		riskLevel: 'read',
		description:
			'List updates about a deal (GET /deals/{id}/flow; 40 API tokens; OAuth scopes: recents:read)',
	},
	'apiV1.deals.getDealParticipantsChangelog': {
		riskLevel: 'read',
		description:
			'List updates about participants of a deal (GET /deals/{id}/participantsChangelog; 10 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV1.deals.getDealFollowers': {
		riskLevel: 'read',
		description:
			'List followers of a deal (GET /deals/{id}/followers; 20 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV1.deals.addDealFollower': {
		riskLevel: 'write',
		description:
			'Add a follower to a deal (POST /deals/{id}/followers; 10 API tokens; OAuth scopes: deals:full)',
	},
	'apiV1.deals.deleteDealFollower': {
		riskLevel: 'destructive',
		description:
			'Delete a follower from a deal (DELETE /deals/{id}/followers/{follower_id}; 6 API tokens; OAuth scopes: deals:full)',
	},
	'apiV1.deals.getDealMailMessages': {
		riskLevel: 'read',
		description:
			'List mail messages associated with a deal (GET /deals/{id}/mailMessages; 20 API tokens; OAuth scopes: mail:read, mail:full)',
	},
	'apiV1.deals.mergeDeals': {
		riskLevel: 'destructive',
		description:
			'Merge two deals (PUT /deals/{id}/merge; 40 API tokens; OAuth scopes: deals:full)',
	},
	'apiV1.deals.getDealParticipants': {
		riskLevel: 'read',
		description:
			'List participants of a deal (GET /deals/{id}/participants; 10 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV1.deals.addDealParticipant': {
		riskLevel: 'write',
		description:
			'Add a participant to a deal (POST /deals/{id}/participants; 10 API tokens; OAuth scopes: deals:full)',
	},
	'apiV1.deals.deleteDealParticipant': {
		riskLevel: 'destructive',
		description:
			'Delete a participant from a deal (DELETE /deals/{id}/participants/{deal_participant_id}; 6 API tokens; OAuth scopes: deals:full)',
	},
	'apiV1.deals.getDealUsers': {
		riskLevel: 'read',
		description:
			'List permitted users (GET /deals/{id}/permittedUsers; 10 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV1.dealFields.getDealFields': {
		riskLevel: 'read',
		description:
			'Get all deal fields (GET /dealFields; 20 API tokens; OAuth scopes: deals:read, deals:full, deal-fields:full, admin)',
	},
	'apiV1.dealFields.addDealField': {
		riskLevel: 'write',
		description:
			'Add a new deal field (POST /dealFields; 10 API tokens; OAuth scopes: deal-fields:full, admin)',
	},
	'apiV1.dealFields.deleteDealFields': {
		riskLevel: 'destructive',
		description:
			'Delete multiple deal fields in bulk (DELETE /dealFields; 10 API tokens; OAuth scopes: deal-fields:full, admin)',
	},
	'apiV1.dealFields.getDealField': {
		riskLevel: 'read',
		description:
			'Get one deal field (GET /dealFields/{id}; 2 API tokens; OAuth scopes: deals:read, deals:full, deal-fields:full, admin)',
	},
	'apiV1.dealFields.deleteDealField': {
		riskLevel: 'destructive',
		description:
			'Delete a deal field (DELETE /dealFields/{id}; 6 API tokens; OAuth scopes: deal-fields:full, admin)',
	},
	'apiV1.dealFields.updateDealField': {
		riskLevel: 'write',
		description:
			'Update a deal field (PUT /dealFields/{id}; 10 API tokens; OAuth scopes: deal-fields:full, admin)',
	},
	'apiV1.files.getFiles': {
		riskLevel: 'read',
		description:
			'Get all files (GET /files; 20 API tokens; OAuth scopes: deals:read, deals:full, activities:read, activities:full, contacts:read, contacts:full)',
	},
	'apiV1.files.addFile': {
		riskLevel: 'write',
		description:
			'Add file (POST /files; 10 API tokens; OAuth scopes: deals:full, activities:full, contacts:full)',
	},
	'apiV1.files.addFileAndLinkIt': {
		riskLevel: 'write',
		description:
			'Create a remote file and link it to an item (POST /files/remote; 10 API tokens; OAuth scopes: deals:full, activities:full, contacts:full)',
	},
	'apiV1.files.linkFileToItem': {
		riskLevel: 'write',
		description:
			'Link a remote file to an item (POST /files/remoteLink; 10 API tokens; OAuth scopes: deals:full, activities:full, contacts:full)',
	},
	'apiV1.files.deleteFile': {
		riskLevel: 'destructive',
		description:
			'Delete a file (DELETE /files/{id}; 6 API tokens; OAuth scopes: deals:full, activities:full, contacts:full)',
	},
	'apiV1.files.getFile': {
		riskLevel: 'read',
		description:
			'Get one file (GET /files/{id}; 2 API tokens; OAuth scopes: deals:read, deals:full, activities:read, activities:full, contacts:read, contacts:full)',
	},
	'apiV1.files.updateFile': {
		riskLevel: 'write',
		description:
			'Update file details (PUT /files/{id}; 10 API tokens; OAuth scopes: deals:full, activities:full, contacts:full)',
	},
	'apiV1.files.downloadFile': {
		riskLevel: 'read',
		description:
			'Download one file (GET /files/{id}/download; 20 API tokens; OAuth scopes: deals:read, deals:full, activities:read, activities:full, contacts:read, contacts:full)',
	},
	'apiV1.filters.deleteFilters': {
		riskLevel: 'destructive',
		description:
			'Delete multiple filters in bulk (DELETE /filters; 10 API tokens; OAuth scopes: deals:full, activities:full, contacts:full)',
	},
	'apiV1.filters.getFilters': {
		riskLevel: 'read',
		description:
			'Get all filters (GET /filters; 20 API tokens; OAuth scopes: deals:read, deals:full, activities:read, activities:full, contacts:read, contacts:full)',
	},
	'apiV1.filters.addFilter': {
		riskLevel: 'write',
		description:
			'Add a new filter (POST /filters; 10 API tokens; OAuth scopes: deals:full, activities:full, contacts:full)',
	},
	'apiV1.filters.getFilterHelpers': {
		riskLevel: 'read',
		description:
			'Get all filter helpers (GET /filters/helpers; 20 API tokens; OAuth scopes: deals:read, deals:full, activities:read, activities:full, contacts:read, contacts:full)',
	},
	'apiV1.filters.deleteFilter': {
		riskLevel: 'destructive',
		description:
			'Delete a filter (DELETE /filters/{id}; 6 API tokens; OAuth scopes: deals:full, activities:full, contacts:full)',
	},
	'apiV1.filters.getFilter': {
		riskLevel: 'read',
		description:
			'Get one filter (GET /filters/{id}; 2 API tokens; OAuth scopes: deals:read, deals:full, activities:read, activities:full, contacts:read, contacts:full)',
	},
	'apiV1.filters.updateFilter': {
		riskLevel: 'write',
		description:
			'Update filter (PUT /filters/{id}; 10 API tokens; OAuth scopes: deals:full, activities:full, contacts:full)',
	},
	'apiV1.goals.addGoal': {
		riskLevel: 'write',
		description:
			'Add a new goal (POST /goals; 10 API tokens; OAuth scopes: goals:full)',
	},
	'apiV1.goals.getGoals': {
		riskLevel: 'read',
		description:
			'Find goals (GET /goals/find; 20 API tokens; OAuth scopes: goals:read, goals:full)',
	},
	'apiV1.goals.updateGoal': {
		riskLevel: 'write',
		description:
			'Update existing goal (PUT /goals/{id}; 10 API tokens; OAuth scopes: goals:full)',
	},
	'apiV1.goals.deleteGoal': {
		riskLevel: 'destructive',
		description:
			'Delete existing goal (DELETE /goals/{id}; 6 API tokens; OAuth scopes: goals:full)',
	},
	'apiV1.goals.getGoalResult': {
		riskLevel: 'read',
		description:
			'Get result of a goal (GET /goals/{id}/results; 20 API tokens; OAuth scopes: goals:read, goals:full)',
	},
	'apiV1.leads.getLeads': {
		riskLevel: 'read',
		description:
			'Get all leads (GET /leads; 20 API tokens; OAuth scopes: leads:read, leads:full)',
	},
	'apiV1.leads.addLead': {
		riskLevel: 'write',
		description:
			'Add a lead (POST /leads; 10 API tokens; OAuth scopes: leads:full)',
	},
	'apiV1.leads.getArchivedLeads': {
		riskLevel: 'read',
		description:
			'Get all archived leads (GET /leads/archived; 40 API tokens; OAuth scopes: leads:read, leads:full)',
	},
	'apiV1.leads.getLead': {
		riskLevel: 'read',
		description:
			'Get one lead (GET /leads/{id}; 2 API tokens; OAuth scopes: leads:read, leads:full)',
	},
	'apiV1.leads.updateLead': {
		riskLevel: 'write',
		description:
			'Update a lead (PATCH /leads/{id}; 10 API tokens; OAuth scopes: leads:full)',
	},
	'apiV1.leads.deleteLead': {
		riskLevel: 'destructive',
		description:
			'Delete a lead (DELETE /leads/{id}; 6 API tokens; OAuth scopes: leads:full)',
	},
	'apiV1.leads.getLeadUsers': {
		riskLevel: 'read',
		description:
			'List permitted users (GET /leads/{id}/permittedUsers; 10 API tokens; OAuth scopes: leads:read, leads:full)',
	},
	'apiV1.leads.searchLeads': {
		riskLevel: 'read',
		description:
			'Search leads (GET /leads/search; 40 API tokens; OAuth scopes: leads:read, leads:full, search:read)',
	},
	'apiV1.leadFields.getLeadFields': {
		riskLevel: 'read',
		description:
			'Get all lead fields (GET /leadFields; 20 API tokens; OAuth scopes: leads:read, leads:full, admin)',
	},
	'apiV1.leadLabels.getLeadLabels': {
		riskLevel: 'read',
		description:
			'Get all lead labels (GET /leadLabels; 10 API tokens; OAuth scopes: leads:read, leads:full)',
	},
	'apiV1.leadLabels.addLeadLabel': {
		riskLevel: 'write',
		description:
			'Add a lead label (POST /leadLabels; 10 API tokens; OAuth scopes: leads:full)',
	},
	'apiV1.leadLabels.updateLeadLabel': {
		riskLevel: 'write',
		description:
			'Update a lead label (PATCH /leadLabels/{id}; 10 API tokens; OAuth scopes: leads:full)',
	},
	'apiV1.leadLabels.deleteLeadLabel': {
		riskLevel: 'destructive',
		description:
			'Delete a lead label (DELETE /leadLabels/{id}; 6 API tokens; OAuth scopes: leads:full)',
	},
	'apiV1.leadSources.getLeadSources': {
		riskLevel: 'read',
		description:
			'Get all lead sources (GET /leadSources; 2 API tokens; OAuth scopes: leads:read, leads:full)',
	},
	'apiV1.legacyTeams.getTeams': {
		riskLevel: 'read',
		description:
			'Get all teams (GET /legacyTeams; 20 API tokens; OAuth scopes: users:read)',
	},
	'apiV1.legacyTeams.addTeam': {
		riskLevel: 'destructive',
		description:
			'Add a new team (POST /legacyTeams; 10 API tokens; OAuth scopes: admin)',
	},
	'apiV1.legacyTeams.getTeam': {
		riskLevel: 'read',
		description:
			'Get a single team (GET /legacyTeams/{id}; 2 API tokens; OAuth scopes: users:read)',
	},
	'apiV1.legacyTeams.updateTeam': {
		riskLevel: 'destructive',
		description:
			'Update a team (PUT /legacyTeams/{id}; 10 API tokens; OAuth scopes: admin)',
	},
	'apiV1.legacyTeams.getTeamUsers': {
		riskLevel: 'read',
		description:
			'Get all users in a team (GET /legacyTeams/{id}/users; 20 API tokens; OAuth scopes: users:read)',
	},
	'apiV1.legacyTeams.addTeamUser': {
		riskLevel: 'destructive',
		description:
			'Add users to a team (POST /legacyTeams/{id}/users; 10 API tokens; OAuth scopes: admin)',
	},
	'apiV1.legacyTeams.deleteTeamUser': {
		riskLevel: 'destructive',
		description:
			'Delete users from a team (DELETE /legacyTeams/{id}/users; 10 API tokens; OAuth scopes: admin)',
	},
	'apiV1.legacyTeams.getUserTeams': {
		riskLevel: 'read',
		description:
			'Get all teams of a user (GET /legacyTeams/user/{id}; 20 API tokens; OAuth scopes: users:read)',
	},
	'apiV1.mailbox.getMailMessage': {
		riskLevel: 'read',
		description:
			'Get one mail message (GET /mailbox/mailMessages/{id}; 2 API tokens; OAuth scopes: mail:read, mail:full)',
	},
	'apiV1.mailbox.getMailThreads': {
		riskLevel: 'read',
		description:
			'Get mail threads (GET /mailbox/mailThreads; 20 API tokens; OAuth scopes: mail:read, mail:full)',
	},
	'apiV1.mailbox.deleteMailThread': {
		riskLevel: 'destructive',
		description:
			'Delete mail thread (DELETE /mailbox/mailThreads/{id}; 6 API tokens; OAuth scopes: mail:full)',
	},
	'apiV1.mailbox.getMailThread': {
		riskLevel: 'read',
		description:
			'Get one mail thread (GET /mailbox/mailThreads/{id}; 20 API tokens; OAuth scopes: mail:read, mail:full)',
	},
	'apiV1.mailbox.updateMailThreadDetails': {
		riskLevel: 'write',
		description:
			'Update mail thread details (PUT /mailbox/mailThreads/{id}; 10 API tokens; OAuth scopes: mail:full)',
	},
	'apiV1.mailbox.getMailThreadMessages': {
		riskLevel: 'read',
		description:
			'Get all mail messages of mail thread (GET /mailbox/mailThreads/{id}/mailMessages; 20 API tokens; OAuth scopes: mail:read, mail:full)',
	},
	'apiV1.meetings.saveUserProviderLink': {
		riskLevel: 'write',
		description:
			'Link a user with the installed video call integration (POST /meetings/userProviderLinks; 10 API tokens; OAuth scopes: video-calls)',
	},
	'apiV1.meetings.deleteUserProviderLink': {
		riskLevel: 'destructive',
		description:
			'Delete the link between a user and the installed video call integration (DELETE /meetings/userProviderLinks/{id}; 6 API tokens; OAuth scopes: video-calls)',
	},
	'apiV1.notes.getNotes': {
		riskLevel: 'read',
		description:
			'Get all notes (GET /notes; 20 API tokens; OAuth scopes: deals:read, deals:full, contacts:read, contacts:full)',
	},
	'apiV1.notes.addNote': {
		riskLevel: 'write',
		description:
			'Add a note (POST /notes; 10 API tokens; OAuth scopes: deals:full, contacts:full)',
	},
	'apiV1.notes.deleteNote': {
		riskLevel: 'destructive',
		description:
			'Delete a note (DELETE /notes/{id}; 6 API tokens; OAuth scopes: deals:full, contacts:full)',
	},
	'apiV1.notes.getNote': {
		riskLevel: 'read',
		description:
			'Get one note (GET /notes/{id}; 2 API tokens; OAuth scopes: deals:read, deals:full, contacts:read, contacts:full)',
	},
	'apiV1.notes.updateNote': {
		riskLevel: 'write',
		description:
			'Update a note (PUT /notes/{id}; 10 API tokens; OAuth scopes: deals:full, contacts:full)',
	},
	'apiV1.notes.getNoteComments': {
		riskLevel: 'read',
		description:
			'Get all comments for a note (GET /notes/{id}/comments; 20 API tokens; OAuth scopes: deals:read, deals:full, contacts:read, contacts:full)',
	},
	'apiV1.notes.addNoteComment': {
		riskLevel: 'write',
		description:
			'Add a comment to a note (POST /notes/{id}/comments; 10 API tokens; OAuth scopes: deals:full, contacts:full)',
	},
	'apiV1.notes.getComment': {
		riskLevel: 'read',
		description:
			'Get one comment (GET /notes/{id}/comments/{commentId}; 2 API tokens; OAuth scopes: deals:read, deals:full, contacts:read, contacts:full)',
	},
	'apiV1.notes.updateCommentForNote': {
		riskLevel: 'write',
		description:
			'Update a comment related to a note (PUT /notes/{id}/comments/{commentId}; 10 API tokens; OAuth scopes: deals:full, contacts:full)',
	},
	'apiV1.notes.deleteComment': {
		riskLevel: 'destructive',
		description:
			'Delete a comment related to a note (DELETE /notes/{id}/comments/{commentId}; 6 API tokens; OAuth scopes: deals:full, contacts:full)',
	},
	'apiV1.noteFields.getNoteFields': {
		riskLevel: 'read',
		description:
			'Get all note fields (GET /noteFields; 20 API tokens; OAuth scopes: deals:read, deals:full, contacts:read, contacts:full)',
	},
	'apiV1.organizations.getOrganizationChangelog': {
		riskLevel: 'read',
		description:
			'List updates about organization field values (GET /organizations/{id}/changelog; 20 API tokens; OAuth scopes: recents:read)',
	},
	'apiV1.organizations.getOrganizationFiles': {
		riskLevel: 'read',
		description:
			'List files attached to an organization (GET /organizations/{id}/files; 20 API tokens; OAuth scopes: contacts:read, contacts:full)',
	},
	'apiV1.organizations.getOrganizationUpdates': {
		riskLevel: 'read',
		description:
			'List updates about an organization (GET /organizations/{id}/flow; 40 API tokens; OAuth scopes: recents:read)',
	},
	'apiV1.organizations.getOrganizationFollowers': {
		riskLevel: 'read',
		description:
			'List followers of an organization (GET /organizations/{id}/followers; 20 API tokens; OAuth scopes: contacts:read, contacts:full)',
	},
	'apiV1.organizations.addOrganizationFollower': {
		riskLevel: 'write',
		description:
			'Add a follower to an organization (POST /organizations/{id}/followers; 10 API tokens; OAuth scopes: contacts:full)',
	},
	'apiV1.organizations.deleteOrganizationFollower': {
		riskLevel: 'destructive',
		description:
			'Delete a follower from an organization (DELETE /organizations/{id}/followers/{follower_id}; 6 API tokens; OAuth scopes: contacts:full)',
	},
	'apiV1.organizations.getOrganizationMailMessages': {
		riskLevel: 'read',
		description:
			'List mail messages associated with an organization (GET /organizations/{id}/mailMessages; 20 API tokens; OAuth scopes: mail:read, mail:full)',
	},
	'apiV1.organizations.mergeOrganizations': {
		riskLevel: 'destructive',
		description:
			'Merge two organizations (PUT /organizations/{id}/merge; 40 API tokens; OAuth scopes: contacts:full)',
	},
	'apiV1.organizations.getOrganizationUsers': {
		riskLevel: 'read',
		description:
			'List permitted users (GET /organizations/{id}/permittedUsers; 10 API tokens; OAuth scopes: contacts:read, contacts:full)',
	},
	'apiV1.organizationFields.getOrganizationFields': {
		riskLevel: 'read',
		description:
			'Get all organization fields (GET /organizationFields; 20 API tokens; OAuth scopes: contacts:read, contacts:full, contact-fields:full, admin)',
	},
	'apiV1.organizationFields.addOrganizationField': {
		riskLevel: 'write',
		description:
			'Add a new organization field (POST /organizationFields; 10 API tokens; OAuth scopes: contact-fields:full, admin)',
	},
	'apiV1.organizationFields.deleteOrganizationFields': {
		riskLevel: 'destructive',
		description:
			'Delete multiple organization fields in bulk (DELETE /organizationFields; 10 API tokens; OAuth scopes: contact-fields:full, admin)',
	},
	'apiV1.organizationFields.getOrganizationField': {
		riskLevel: 'read',
		description:
			'Get one organization field (GET /organizationFields/{id}; 2 API tokens; OAuth scopes: contacts:read, contacts:full, contact-fields:full, admin)',
	},
	'apiV1.organizationFields.deleteOrganizationField': {
		riskLevel: 'destructive',
		description:
			'Delete an organization field (DELETE /organizationFields/{id}; 6 API tokens; OAuth scopes: contact-fields:full, admin)',
	},
	'apiV1.organizationFields.updateOrganizationField': {
		riskLevel: 'write',
		description:
			'Update an organization field (PUT /organizationFields/{id}; 10 API tokens; OAuth scopes: contact-fields:full, admin)',
	},
	'apiV1.organizationRelationships.getOrganizationRelationships': {
		riskLevel: 'read',
		description:
			'Get all relationships for organization (GET /organizationRelationships; 20 API tokens; OAuth scopes: contacts:read, contacts:full)',
	},
	'apiV1.organizationRelationships.addOrganizationRelationship': {
		riskLevel: 'write',
		description:
			'Create an organization relationship (POST /organizationRelationships; 10 API tokens; OAuth scopes: contacts:full)',
	},
	'apiV1.organizationRelationships.deleteOrganizationRelationship': {
		riskLevel: 'destructive',
		description:
			'Delete an organization relationship (DELETE /organizationRelationships/{id}; 6 API tokens; OAuth scopes: contacts:full)',
	},
	'apiV1.organizationRelationships.getOrganizationRelationship': {
		riskLevel: 'read',
		description:
			'Get one organization relationship (GET /organizationRelationships/{id}; 2 API tokens; OAuth scopes: contacts:read, contacts:full)',
	},
	'apiV1.organizationRelationships.updateOrganizationRelationship': {
		riskLevel: 'write',
		description:
			'Update an organization relationship (PUT /organizationRelationships/{id}; 10 API tokens; OAuth scopes: contacts:full)',
	},
	'apiV1.permissionSets.getPermissionSets': {
		riskLevel: 'read',
		description:
			'Get all permission sets (GET /permissionSets; 20 API tokens; OAuth scopes: admin)',
	},
	'apiV1.permissionSets.getPermissionSet': {
		riskLevel: 'read',
		description:
			'Get one permission set (GET /permissionSets/{id}; 2 API tokens; OAuth scopes: admin)',
	},
	'apiV1.permissionSets.getPermissionSetAssignments': {
		riskLevel: 'read',
		description:
			'List permission set assignments (GET /permissionSets/{id}/assignments; 20 API tokens; OAuth scopes: admin)',
	},
	'apiV1.persons.getPersonChangelog': {
		riskLevel: 'read',
		description:
			'List updates about person field values (GET /persons/{id}/changelog; 20 API tokens; OAuth scopes: recents:read)',
	},
	'apiV1.persons.getPersonFiles': {
		riskLevel: 'read',
		description:
			'List files attached to a person (GET /persons/{id}/files; 20 API tokens; OAuth scopes: contacts:read, contacts:full)',
	},
	'apiV1.persons.getPersonUpdates': {
		riskLevel: 'read',
		description:
			'List updates about a person (GET /persons/{id}/flow; 40 API tokens; OAuth scopes: recents:read)',
	},
	'apiV1.persons.getPersonFollowers': {
		riskLevel: 'read',
		description:
			'List followers of a person (GET /persons/{id}/followers; 20 API tokens; OAuth scopes: contacts:read, contacts:full)',
	},
	'apiV1.persons.addPersonFollower': {
		riskLevel: 'write',
		description:
			'Add a follower to a person (POST /persons/{id}/followers; 10 API tokens; OAuth scopes: contacts:full)',
	},
	'apiV1.persons.deletePersonFollower': {
		riskLevel: 'destructive',
		description:
			'Delete a follower from a person (DELETE /persons/{id}/followers/{follower_id}; 6 API tokens; OAuth scopes: contacts:full)',
	},
	'apiV1.persons.getPersonMailMessages': {
		riskLevel: 'read',
		description:
			'List mail messages associated with a person (GET /persons/{id}/mailMessages; 20 API tokens; OAuth scopes: mail:read, mail:full)',
	},
	'apiV1.persons.mergePersons': {
		riskLevel: 'destructive',
		description:
			'Merge two persons (PUT /persons/{id}/merge; 40 API tokens; OAuth scopes: contacts:full)',
	},
	'apiV1.persons.getPersonUsers': {
		riskLevel: 'read',
		description:
			'List permitted users (GET /persons/{id}/permittedUsers; 10 API tokens; OAuth scopes: contacts:read, contacts:full)',
	},
	'apiV1.persons.deletePersonPicture': {
		riskLevel: 'destructive',
		description:
			'Delete person picture (DELETE /persons/{id}/picture; 6 API tokens; OAuth scopes: contacts:full)',
	},
	'apiV1.persons.addPersonPicture': {
		riskLevel: 'write',
		description:
			'Add person picture (POST /persons/{id}/picture; 10 API tokens; OAuth scopes: contacts:full)',
	},
	'apiV1.persons.getPersonProducts': {
		riskLevel: 'read',
		description:
			'List products associated with a person (GET /persons/{id}/products; 20 API tokens; OAuth scopes: contacts:read, contacts:full)',
	},
	'apiV1.personFields.getPersonFields': {
		riskLevel: 'read',
		description:
			'Get all person fields (GET /personFields; 20 API tokens; OAuth scopes: contacts:read, contacts:full, contact-fields:full, admin)',
	},
	'apiV1.personFields.addPersonField': {
		riskLevel: 'write',
		description:
			'Add a new person field (POST /personFields; 10 API tokens; OAuth scopes: contact-fields:full, admin)',
	},
	'apiV1.personFields.deletePersonFields': {
		riskLevel: 'destructive',
		description:
			'Delete multiple person fields in bulk (DELETE /personFields; 10 API tokens; OAuth scopes: contact-fields:full, admin)',
	},
	'apiV1.personFields.getPersonField': {
		riskLevel: 'read',
		description:
			'Get one person field (GET /personFields/{id}; 2 API tokens; OAuth scopes: contacts:read, contacts:full, contact-fields:full, admin)',
	},
	'apiV1.personFields.deletePersonField': {
		riskLevel: 'destructive',
		description:
			'Delete a person field (DELETE /personFields/{id}; 6 API tokens; OAuth scopes: contact-fields:full, admin)',
	},
	'apiV1.personFields.updatePersonField': {
		riskLevel: 'write',
		description:
			'Update a person field (PUT /personFields/{id}; 10 API tokens; OAuth scopes: contact-fields:full, admin)',
	},
	'apiV1.pipelines.getPipelineConversionStatistics': {
		riskLevel: 'read',
		description:
			'Get deals conversion rates in pipeline (GET /pipelines/{id}/conversion_statistics; 40 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV1.pipelines.getPipelineDeals': {
		riskLevel: 'read',
		description:
			'Get deals in a pipeline (GET /pipelines/{id}/deals; 20 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV1.pipelines.getPipelineMovementStatistics': {
		riskLevel: 'read',
		description:
			'Get deals movements in pipeline (GET /pipelines/{id}/movement_statistics; 40 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV1.products.getProductDeals': {
		riskLevel: 'read',
		description:
			'Get deals where a product is attached to (GET /products/{id}/deals; 20 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV1.products.getProductFiles': {
		riskLevel: 'read',
		description:
			'List files attached to a product (GET /products/{id}/files; 20 API tokens; OAuth scopes: products:read, products:full)',
	},
	'apiV1.products.getProductFollowers': {
		riskLevel: 'read',
		description:
			'List followers of a product (GET /products/{id}/followers; 20 API tokens; OAuth scopes: products:read, products:full)',
	},
	'apiV1.products.addProductFollower': {
		riskLevel: 'write',
		description:
			'Add a follower to a product (POST /products/{id}/followers; 10 API tokens; OAuth scopes: products:full)',
	},
	'apiV1.products.deleteProductFollower': {
		riskLevel: 'destructive',
		description:
			'Delete a follower from a product (DELETE /products/{id}/followers/{follower_id}; 6 API tokens; OAuth scopes: products:full)',
	},
	'apiV1.products.getProductUsers': {
		riskLevel: 'read',
		description:
			'List permitted users (GET /products/{id}/permittedUsers; 10 API tokens; OAuth scopes: products:read, products:full)',
	},
	'apiV1.productFields.deleteProductFields': {
		riskLevel: 'destructive',
		description:
			'Delete multiple product fields in bulk (DELETE /productFields; 10 API tokens; OAuth scopes: product-fields:full, products:full)',
	},
	'apiV1.productFields.getProductFields': {
		riskLevel: 'read',
		description:
			'Get all product fields (GET /productFields; 20 API tokens; OAuth scopes: products:read, product-fields:full, products:full)',
	},
	'apiV1.productFields.addProductField': {
		riskLevel: 'write',
		description:
			'Add a new product field (POST /productFields; 10 API tokens; OAuth scopes: product-fields:full, products:full)',
	},
	'apiV1.productFields.deleteProductField': {
		riskLevel: 'destructive',
		description:
			'Delete a product field (DELETE /productFields/{id}; 6 API tokens; OAuth scopes: product-fields:full, products:full)',
	},
	'apiV1.productFields.getProductField': {
		riskLevel: 'read',
		description:
			'Get one product field (GET /productFields/{id}; 2 API tokens; OAuth scopes: products:read, product-fields:full, products:full)',
	},
	'apiV1.productFields.updateProductField': {
		riskLevel: 'write',
		description:
			'Update a product field (PUT /productFields/{id}; 10 API tokens; OAuth scopes: product-fields:full, products:full)',
	},
	'apiV1.projects.getProjects': {
		riskLevel: 'read',
		description:
			'Get all projects (GET /projects; 20 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV1.projects.addProject': {
		riskLevel: 'write',
		description:
			'Add a project (POST /projects; 10 API tokens; OAuth scopes: projects:full)',
	},
	'apiV1.projects.getProject': {
		riskLevel: 'read',
		description:
			'Get details of a project (GET /projects/{id}; 2 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV1.projects.updateProject': {
		riskLevel: 'write',
		description:
			'Update a project (PUT /projects/{id}; 10 API tokens; OAuth scopes: projects:full)',
	},
	'apiV1.projects.deleteProject': {
		riskLevel: 'destructive',
		description:
			'Delete a project (DELETE /projects/{id}; 6 API tokens; OAuth scopes: projects:full)',
	},
	'apiV1.projects.archiveProject': {
		riskLevel: 'write',
		description:
			'Archive a project (POST /projects/{id}/archive; 10 API tokens; OAuth scopes: projects:full)',
	},
	'apiV1.projects.getProjectPlan': {
		riskLevel: 'read',
		description:
			'Returns project plan (GET /projects/{id}/plan; 20 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV1.projects.putProjectPlanActivity': {
		riskLevel: 'write',
		description:
			'Update activity in project plan (PUT /projects/{id}/plan/activities/{activityId}; 10 API tokens; OAuth scopes: projects:full)',
	},
	'apiV1.projects.putProjectPlanTask': {
		riskLevel: 'write',
		description:
			'Update task in project plan (PUT /projects/{id}/plan/tasks/{taskId}; 10 API tokens; OAuth scopes: projects:full)',
	},
	'apiV1.projects.getProjectGroups': {
		riskLevel: 'read',
		description:
			'Returns project groups (GET /projects/{id}/groups; 20 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV1.projects.getProjectTasks': {
		riskLevel: 'read',
		description:
			'Returns project tasks (GET /projects/{id}/tasks; 20 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV1.projects.getProjectActivities': {
		riskLevel: 'read',
		description:
			'Returns project activities (GET /projects/{id}/activities; 20 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV1.projectBoards.getProjectsBoards': {
		riskLevel: 'read',
		description:
			'Get all project boards (GET /projects/boards; 20 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV1.projectBoards.getProjectsBoard': {
		riskLevel: 'read',
		description:
			'Get details of a board (GET /projects/boards/{id}; 2 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV1.projectPhases.getProjectsPhases': {
		riskLevel: 'read',
		description:
			'Get project phases (GET /projects/phases; 20 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV1.projectPhases.getProjectsPhase': {
		riskLevel: 'read',
		description:
			'Get details of a phase (GET /projects/phases/{id}; 2 API tokens; OAuth scopes: projects:read)',
	},
	'apiV1.projectTemplates.getProjectTemplates': {
		riskLevel: 'read',
		description:
			'Get all project templates (GET /projectTemplates; 20 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV1.projectTemplates.getProjectTemplate': {
		riskLevel: 'read',
		description:
			'Get details of a template (GET /projectTemplates/{id}; 2 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV1.recents.getRecents': {
		riskLevel: 'read',
		description:
			'Get recents (GET /recents; 20 API tokens; OAuth scopes: recents:read, search:read)',
	},
	'apiV1.roles.getRoles': {
		riskLevel: 'read',
		description:
			'Get all roles (GET /roles; 20 API tokens; OAuth scopes: admin)',
	},
	'apiV1.roles.addRole': {
		riskLevel: 'destructive',
		description: 'Add a role (POST /roles; 10 API tokens; OAuth scopes: admin)',
	},
	'apiV1.roles.deleteRole': {
		riskLevel: 'destructive',
		description:
			'Delete a role (DELETE /roles/{id}; 6 API tokens; OAuth scopes: admin)',
	},
	'apiV1.roles.getRole': {
		riskLevel: 'read',
		description:
			'Get one role (GET /roles/{id}; 2 API tokens; OAuth scopes: admin)',
	},
	'apiV1.roles.updateRole': {
		riskLevel: 'destructive',
		description:
			'Update role details (PUT /roles/{id}; 10 API tokens; OAuth scopes: admin)',
	},
	'apiV1.roles.deleteRoleAssignment': {
		riskLevel: 'destructive',
		description:
			'Delete a role assignment (DELETE /roles/{id}/assignments; 6 API tokens; OAuth scopes: admin)',
	},
	'apiV1.roles.getRoleAssignments': {
		riskLevel: 'read',
		description:
			'List role assignments (GET /roles/{id}/assignments; 10 API tokens; OAuth scopes: admin)',
	},
	'apiV1.roles.addRoleAssignment': {
		riskLevel: 'destructive',
		description:
			'Add role assignment (POST /roles/{id}/assignments; 10 API tokens; OAuth scopes: admin)',
	},
	'apiV1.roles.getRoleSettings': {
		riskLevel: 'read',
		description:
			'List role settings (GET /roles/{id}/settings; 20 API tokens; OAuth scopes: admin)',
	},
	'apiV1.roles.addOrUpdateRoleSetting': {
		riskLevel: 'destructive',
		description:
			'Add or update role setting (POST /roles/{id}/settings; 10 API tokens; OAuth scopes: admin)',
	},
	'apiV1.roles.getRolePipelines': {
		riskLevel: 'read',
		description:
			'List pipeline visibility for a role (GET /roles/{id}/pipelines; 20 API tokens; OAuth scopes: admin)',
	},
	'apiV1.roles.updateRolePipelines': {
		riskLevel: 'destructive',
		description:
			'Update pipeline visibility for a role (PUT /roles/{id}/pipelines; 10 API tokens; OAuth scopes: admin)',
	},
	'apiV1.stages.getStageDeals': {
		riskLevel: 'read',
		description:
			'Get deals in a stage (GET /stages/{id}/deals; 20 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV1.tasks.getTasks': {
		riskLevel: 'read',
		description:
			'Get all tasks (GET /tasks; 20 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV1.tasks.addTask': {
		riskLevel: 'write',
		description:
			'Add a task (POST /tasks; 10 API tokens; OAuth scopes: projects:full)',
	},
	'apiV1.tasks.getTask': {
		riskLevel: 'read',
		description:
			'Get details of a task (GET /tasks/{id}; 2 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV1.tasks.updateTask': {
		riskLevel: 'write',
		description:
			'Update a task (PUT /tasks/{id}; 10 API tokens; OAuth scopes: projects:full)',
	},
	'apiV1.tasks.deleteTask': {
		riskLevel: 'destructive',
		description:
			'Delete a task (DELETE /tasks/{id}; 6 API tokens; OAuth scopes: projects:full)',
	},
	'apiV1.users.getUsers': {
		riskLevel: 'read',
		description:
			'Get all users (GET /users; 20 API tokens; OAuth scopes: users:read)',
	},
	'apiV1.users.addUser': {
		riskLevel: 'destructive',
		description:
			'Add a new user (POST /users; 10 API tokens; OAuth scopes: admin)',
	},
	'apiV1.users.findUsersByName': {
		riskLevel: 'read',
		description:
			'Find users by name (GET /users/find; 40 API tokens; OAuth scopes: users:read)',
	},
	'apiV1.users.getCurrentUser': {
		riskLevel: 'read',
		description:
			'Get current user data (GET /users/me; 2 API tokens; OAuth scopes: base)',
	},
	'apiV1.users.getUser': {
		riskLevel: 'read',
		description:
			'Get one user (GET /users/{id}; 2 API tokens; OAuth scopes: users:read)',
	},
	'apiV1.users.updateUser': {
		riskLevel: 'destructive',
		description:
			'Update user details (PUT /users/{id}; 10 API tokens; OAuth scopes: admin)',
	},
	'apiV1.users.getUserFollowers': {
		riskLevel: 'read',
		description:
			'List followers of a user (GET /users/{id}/followers; 20 API tokens; OAuth scopes: users:read)',
	},
	'apiV1.users.getUserPermissions': {
		riskLevel: 'read',
		description:
			'List user permissions (GET /users/{id}/permissions; 10 API tokens; OAuth scopes: users:read)',
	},
	'apiV1.users.getUserRoleAssignments': {
		riskLevel: 'read',
		description:
			'List role assignments (GET /users/{id}/roleAssignments; 10 API tokens; OAuth scopes: users:read)',
	},
	'apiV1.users.getUserRoleSettings': {
		riskLevel: 'read',
		description:
			'List user role settings (GET /users/{id}/roleSettings; 10 API tokens; OAuth scopes: users:read)',
	},
	'apiV1.userConnections.getUserConnections': {
		riskLevel: 'read',
		description:
			'Get all user connections (GET /userConnections; 20 API tokens; OAuth scopes: base)',
	},
	'apiV1.userSettings.getUserSettings': {
		riskLevel: 'read',
		description:
			'List settings of an authorized user (GET /userSettings; 2 API tokens; OAuth scopes: base)',
	},
	'apiV2.activityFields.getActivityFields': {
		riskLevel: 'read',
		description:
			'Get all activity fields (GET /activityFields; 10 API tokens; OAuth scopes: admin)',
	},
	'apiV2.activityFields.getActivityField': {
		riskLevel: 'read',
		description:
			'Get one activity field (GET /activityFields/{field_code}; 1 API tokens; OAuth scopes: admin)',
	},
	'apiV2.deals.getArchivedDeals': {
		riskLevel: 'read',
		description:
			'Get all archived deals (GET /deals/archived; 20 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV2.deals.getDealFollowers': {
		riskLevel: 'read',
		description:
			'List followers of a deal (GET /deals/{id}/followers; 10 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV2.deals.addDealFollower': {
		riskLevel: 'write',
		description:
			'Add a follower to a deal (POST /deals/{id}/followers; 5 API tokens; OAuth scopes: deals:full)',
	},
	'apiV2.deals.getDealFollowersChangelog': {
		riskLevel: 'read',
		description:
			'List followers changelog of a deal (GET /deals/{id}/followers/changelog; 10 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV2.deals.deleteDealFollower': {
		riskLevel: 'destructive',
		description:
			'Delete a follower from a deal (DELETE /deals/{id}/followers/{follower_id}; 3 API tokens; OAuth scopes: deals:full)',
	},
	'apiV2.dealProducts.getDealsProducts': {
		riskLevel: 'read',
		description:
			'Get deal products of several deals (GET /deals/products; 10 API tokens; OAuth scopes: products:read, products:full, deals:read, deals:full)',
	},
	'apiV2.deals.searchDeals': {
		riskLevel: 'read',
		description:
			'Search deals (GET /deals/search; 20 API tokens; OAuth scopes: deals:read, deals:full, search:read)',
	},
	'apiV2.dealProducts.getDealProducts': {
		riskLevel: 'read',
		description:
			'List products attached to a deal (GET /deals/{id}/products; 10 API tokens; OAuth scopes: products:read, products:full, deals:read, deals:full)',
	},
	'apiV2.dealProducts.addDealProduct': {
		riskLevel: 'write',
		description:
			'Add a product to a deal (POST /deals/{id}/products; 5 API tokens; OAuth scopes: products:full, deals:full)',
	},
	'apiV2.dealProducts.deleteManyDealProducts': {
		riskLevel: 'destructive',
		description:
			'Delete many products from a deal (DELETE /deals/{id}/products; 15 API tokens; OAuth scopes: products:full, deals:full)',
	},
	'apiV2.dealProducts.updateDealProduct': {
		riskLevel: 'write',
		description:
			'Update the product attached to a deal (PATCH /deals/{id}/products/{product_attachment_id}; 5 API tokens; OAuth scopes: products:full, deals:full)',
	},
	'apiV2.dealProducts.deleteDealProduct': {
		riskLevel: 'destructive',
		description:
			'Delete an attached product from a deal (DELETE /deals/{id}/products/{product_attachment_id}; 3 API tokens; OAuth scopes: deals:full, products:full)',
	},
	'apiV2.dealProducts.addManyDealProducts': {
		riskLevel: 'write',
		description:
			'Add multiple products to a deal (POST /deals/{id}/products/bulk; 25 API tokens; OAuth scopes: products:full, deals:full)',
	},
	'apiV2.deals.getAdditionalDiscounts': {
		riskLevel: 'read',
		description:
			'List discounts added to a deal (GET /deals/{id}/discounts; 10 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV2.deals.postAdditionalDiscount': {
		riskLevel: 'write',
		description:
			'Add a discount to a deal (POST /deals/{id}/discounts; 5 API tokens; OAuth scopes: deals:full)',
	},
	'apiV2.deals.updateAdditionalDiscount': {
		riskLevel: 'write',
		description:
			'Update a discount added to a deal (PATCH /deals/{id}/discounts/{discount_id}; 5 API tokens; OAuth scopes: deals:full)',
	},
	'apiV2.deals.deleteAdditionalDiscount': {
		riskLevel: 'destructive',
		description:
			'Delete a discount from a deal (DELETE /deals/{id}/discounts/{discount_id}; 3 API tokens; OAuth scopes: deals:full)',
	},
	'apiV2.dealInstallments.getInstallments': {
		riskLevel: 'read',
		description:
			'List installments added to a list of deals (GET /deals/installments; 10 API tokens; OAuth scopes: deals:read, deals:full)',
	},
	'apiV2.dealInstallments.postInstallment': {
		riskLevel: 'write',
		description:
			'Add an installment to a deal (POST /deals/{id}/installments; 5 API tokens; OAuth scopes: deals:full)',
	},
	'apiV2.dealInstallments.updateInstallment': {
		riskLevel: 'write',
		description:
			'Update an installment added to a deal (PATCH /deals/{id}/installments/{installment_id}; 5 API tokens; OAuth scopes: deals:full)',
	},
	'apiV2.dealInstallments.deleteInstallment': {
		riskLevel: 'destructive',
		description:
			'Delete an installment from a deal (DELETE /deals/{id}/installments/{installment_id}; 3 API tokens; OAuth scopes: deals:full)',
	},
	'apiV2.deals.convertDealToLead': {
		riskLevel: 'destructive',
		description:
			'Convert a deal to a lead (POST /deals/{id}/convert/lead; 40 API tokens; OAuth scopes: deals:full)',
	},
	'apiV2.dealFields.getDealFields': {
		riskLevel: 'read',
		description:
			'Get all deal fields (GET /dealFields; 10 API tokens; OAuth scopes: deals:read, deals:full, admin, deal-fields:full)',
	},
	'apiV2.dealFields.addDealField': {
		riskLevel: 'write',
		description:
			'Create one deal field (POST /dealFields; 5 API tokens; OAuth scopes: admin, deal-fields:full)',
	},
	'apiV2.dealFields.getDealField': {
		riskLevel: 'read',
		description:
			'Get one deal field (GET /dealFields/{field_code}; 1 API tokens; OAuth scopes: deals:read, deals:full, admin, deal-fields:full)',
	},
	'apiV2.dealFields.updateDealField': {
		riskLevel: 'write',
		description:
			'Update one deal field (PATCH /dealFields/{field_code}; 5 API tokens; OAuth scopes: deals:full, admin, deal-fields:full)',
	},
	'apiV2.dealFields.deleteDealField': {
		riskLevel: 'destructive',
		description:
			'Delete one deal field (DELETE /dealFields/{field_code}; 3 API tokens; OAuth scopes: admin, deal-fields:full)',
	},
	'apiV2.dealFields.addDealFieldOptions': {
		riskLevel: 'write',
		description:
			'Add deal field options in bulk (POST /dealFields/{field_code}/options; 5 API tokens; OAuth scopes: deals:full, admin, deal-fields:full)',
	},
	'apiV2.dealFields.deleteDealFieldOptions': {
		riskLevel: 'destructive',
		description:
			'Delete deal field options in bulk (DELETE /dealFields/{field_code}/options; 3 API tokens; OAuth scopes: deals:full, admin, deal-fields:full)',
	},
	'apiV2.dealFields.updateDealFieldOptions': {
		riskLevel: 'write',
		description:
			'Update deal field options in bulk (PATCH /dealFields/{field_code}/options; 5 API tokens; OAuth scopes: deals:full, admin, deal-fields:full)',
	},
	'apiV2.deals.getDealConversionStatus': {
		riskLevel: 'read',
		description:
			'Get Deal conversion status (GET /deals/{id}/convert/status/{conversion_id}; 1 API tokens; OAuth scopes: deals:full, deals:read)',
	},
	'apiV2.persons.getPersonFollowers': {
		riskLevel: 'read',
		description:
			'List followers of a person (GET /persons/{id}/followers; 10 API tokens; OAuth scopes: contacts:read, contacts:full)',
	},
	'apiV2.persons.addPersonFollower': {
		riskLevel: 'write',
		description:
			'Add a follower to a person (POST /persons/{id}/followers; 5 API tokens; OAuth scopes: contacts:full)',
	},
	'apiV2.persons.getPersonFollowersChangelog': {
		riskLevel: 'read',
		description:
			'List followers changelog of a person (GET /persons/{id}/followers/changelog; 10 API tokens; OAuth scopes: contacts:read, contacts:full)',
	},
	'apiV2.persons.deletePersonFollower': {
		riskLevel: 'destructive',
		description:
			'Delete a follower from a person (DELETE /persons/{id}/followers/{follower_id}; 3 API tokens; OAuth scopes: contacts:full)',
	},
	'apiV2.persons.getPersonPicture': {
		riskLevel: 'read',
		description:
			'Get picture of a person (GET /persons/{id}/picture; 1 API tokens; OAuth scopes: contacts:read, contacts:full)',
	},
	'apiV2.personFields.getPersonFields': {
		riskLevel: 'read',
		description:
			'Get all person fields (GET /personFields; 10 API tokens; OAuth scopes: contacts:read, contacts:full, admin, contact-fields:full)',
	},
	'apiV2.personFields.addPersonField': {
		riskLevel: 'write',
		description:
			'Create one person field (POST /personFields; 5 API tokens; OAuth scopes: admin, contact-fields:full)',
	},
	'apiV2.personFields.getPersonField': {
		riskLevel: 'read',
		description:
			'Get one person field (GET /personFields/{field_code}; 1 API tokens; OAuth scopes: contacts:read, contacts:full, admin, contact-fields:full)',
	},
	'apiV2.personFields.updatePersonField': {
		riskLevel: 'write',
		description:
			'Update one person field (PATCH /personFields/{field_code}; 5 API tokens; OAuth scopes: contacts:full, admin, contact-fields:full)',
	},
	'apiV2.personFields.deletePersonField': {
		riskLevel: 'destructive',
		description:
			'Delete one person field (DELETE /personFields/{field_code}; 3 API tokens; OAuth scopes: admin, contact-fields:full)',
	},
	'apiV2.personFields.addPersonFieldOptions': {
		riskLevel: 'write',
		description:
			'Add person field options in bulk (POST /personFields/{field_code}/options; 5 API tokens; OAuth scopes: contacts:full, admin, contact-fields:full)',
	},
	'apiV2.personFields.deletePersonFieldOptions': {
		riskLevel: 'destructive',
		description:
			'Delete person field options in bulk (DELETE /personFields/{field_code}/options; 3 API tokens; OAuth scopes: contacts:full, admin, contact-fields:full)',
	},
	'apiV2.personFields.updatePersonFieldOptions': {
		riskLevel: 'write',
		description:
			'Update person field options in bulk (PATCH /personFields/{field_code}/options; 5 API tokens; OAuth scopes: contacts:full, admin, contact-fields:full)',
	},
	'apiV2.organizations.getOrganizationFollowers': {
		riskLevel: 'read',
		description:
			'List followers of an organization (GET /organizations/{id}/followers; 10 API tokens; OAuth scopes: contacts:read, contacts:full)',
	},
	'apiV2.organizations.addOrganizationFollower': {
		riskLevel: 'write',
		description:
			'Add a follower to an organization (POST /organizations/{id}/followers; 5 API tokens; OAuth scopes: contacts:full)',
	},
	'apiV2.organizations.getOrganizationFollowersChangelog': {
		riskLevel: 'read',
		description:
			'List followers changelog of an organization (GET /organizations/{id}/followers/changelog; 10 API tokens; OAuth scopes: contacts:read, contacts:full)',
	},
	'apiV2.organizations.deleteOrganizationFollower': {
		riskLevel: 'destructive',
		description:
			'Delete a follower from an organization (DELETE /organizations/{id}/followers/{follower_id}; 3 API tokens; OAuth scopes: contacts:full)',
	},
	'apiV2.organizationFields.getOrganizationFields': {
		riskLevel: 'read',
		description:
			'Get all organization fields (GET /organizationFields; 10 API tokens; OAuth scopes: contacts:read, contacts:full, admin, contact-fields:full)',
	},
	'apiV2.organizationFields.addOrganizationField': {
		riskLevel: 'write',
		description:
			'Create one organization field (POST /organizationFields; 5 API tokens; OAuth scopes: admin, contact-fields:full)',
	},
	'apiV2.organizationFields.getOrganizationField': {
		riskLevel: 'read',
		description:
			'Get one organization field (GET /organizationFields/{field_code}; 1 API tokens; OAuth scopes: contacts:read, contacts:full, admin, contact-fields:full)',
	},
	'apiV2.organizationFields.updateOrganizationField': {
		riskLevel: 'write',
		description:
			'Update one organization field (PATCH /organizationFields/{field_code}; 5 API tokens; OAuth scopes: contacts:full, admin, contact-fields:full)',
	},
	'apiV2.organizationFields.deleteOrganizationField': {
		riskLevel: 'destructive',
		description:
			'Delete one organization field (DELETE /organizationFields/{field_code}; 3 API tokens; OAuth scopes: admin, contact-fields:full)',
	},
	'apiV2.organizationFields.addOrganizationFieldOptions': {
		riskLevel: 'write',
		description:
			'Add organization field options in bulk (POST /organizationFields/{field_code}/options; 5 API tokens; OAuth scopes: contacts:full, admin, contact-fields:full)',
	},
	'apiV2.organizationFields.deleteOrganizationFieldOptions': {
		riskLevel: 'destructive',
		description:
			'Delete organization field options in bulk (DELETE /organizationFields/{field_code}/options; 3 API tokens; OAuth scopes: contacts:full, admin, contact-fields:full)',
	},
	'apiV2.organizationFields.updateOrganizationFieldOptions': {
		riskLevel: 'write',
		description:
			'Update organization field options in bulk (PATCH /organizationFields/{field_code}/options; 5 API tokens; OAuth scopes: contacts:full, admin, contact-fields:full)',
	},
	'apiV2.productFields.getProductFields': {
		riskLevel: 'read',
		description:
			'Get all product fields (GET /productFields; 10 API tokens; OAuth scopes: products:read, products:full, product-fields:full)',
	},
	'apiV2.productFields.addProductField': {
		riskLevel: 'write',
		description:
			'Create one product field (POST /productFields; 5 API tokens; OAuth scopes: products:full, product-fields:full)',
	},
	'apiV2.productFields.getProductField': {
		riskLevel: 'read',
		description:
			'Get one product field (GET /productFields/{field_code}; 1 API tokens; OAuth scopes: products:read, products:full, product-fields:full)',
	},
	'apiV2.productFields.updateProductField': {
		riskLevel: 'write',
		description:
			'Update one product field (PATCH /productFields/{field_code}; 5 API tokens; OAuth scopes: products:full, product-fields:full)',
	},
	'apiV2.productFields.deleteProductField': {
		riskLevel: 'destructive',
		description:
			'Delete one product field (DELETE /productFields/{field_code}; 3 API tokens; OAuth scopes: products:full, product-fields:full)',
	},
	'apiV2.productFields.addProductFieldOptions': {
		riskLevel: 'write',
		description:
			'Add product field options in bulk (POST /productFields/{field_code}/options; 5 API tokens; OAuth scopes: products:full, product-fields:full)',
	},
	'apiV2.productFields.deleteProductFieldOptions': {
		riskLevel: 'destructive',
		description:
			'Delete product field options in bulk (DELETE /productFields/{field_code}/options; 3 API tokens; OAuth scopes: products:full, product-fields:full)',
	},
	'apiV2.productFields.updateProductFieldOptions': {
		riskLevel: 'write',
		description:
			'Update product field options in bulk (PATCH /productFields/{field_code}/options; 5 API tokens; OAuth scopes: products:full, product-fields:full)',
	},
	'apiV2.leads.searchLeads': {
		riskLevel: 'read',
		description:
			'Search leads (GET /leads/search; 20 API tokens; OAuth scopes: leads:read, leads:full, search:read)',
	},
	'apiV2.leads.convertLeadToDeal': {
		riskLevel: 'destructive',
		description:
			'Convert a lead to a deal (POST /leads/{id}/convert/deal; 40 API tokens; OAuth scopes: leads:full)',
	},
	'apiV2.leads.getLeadConversionStatus': {
		riskLevel: 'read',
		description:
			'Get Lead conversion status (GET /leads/{id}/convert/status/{conversion_id}; 1 API tokens; OAuth scopes: leads:full, leads:read)',
	},
	'apiV2.organizations.searchOrganization': {
		riskLevel: 'read',
		description:
			'Search organizations (GET /organizations/search; 20 API tokens; OAuth scopes: contacts:read, contacts:full, search:read)',
	},
	'apiV2.persons.searchPersons': {
		riskLevel: 'read',
		description:
			'Search persons (GET /persons/search; 20 API tokens; OAuth scopes: contacts:read, contacts:full, search:read)',
	},
	'apiV2.itemSearch.searchItem': {
		riskLevel: 'read',
		description:
			'Perform a search from multiple item types (GET /itemSearch; 20 API tokens; OAuth scopes: search:read)',
	},
	'apiV2.itemSearch.searchItemByField': {
		riskLevel: 'read',
		description:
			'Perform a search using a specific field from an item type (GET /itemSearch/field; 20 API tokens; OAuth scopes: search:read)',
	},
	'apiV2.stages.getStages': {
		riskLevel: 'read',
		description:
			'Get all stages (GET /stages; 5 API tokens; OAuth scopes: deals:read, deals:full, admin)',
	},
	'apiV2.stages.addStage': {
		riskLevel: 'write',
		description:
			'Add a new stage (POST /stages; 5 API tokens; OAuth scopes: admin)',
	},
	'apiV2.stages.deleteStage': {
		riskLevel: 'destructive',
		description:
			'Delete a stage (DELETE /stages/{id}; 3 API tokens; OAuth scopes: admin)',
	},
	'apiV2.stages.getStage': {
		riskLevel: 'read',
		description:
			'Get one stage (GET /stages/{id}; 1 API tokens; OAuth scopes: deals:read, deals:full, admin)',
	},
	'apiV2.stages.updateStage': {
		riskLevel: 'write',
		description:
			'Update stage details (PATCH /stages/{id}; 5 API tokens; OAuth scopes: admin)',
	},
	'apiV2.pipelines.getPipelines': {
		riskLevel: 'read',
		description:
			'Get all pipelines (GET /pipelines; 5 API tokens; OAuth scopes: deals:read, deals:full, admin)',
	},
	'apiV2.pipelines.addPipeline': {
		riskLevel: 'write',
		description:
			'Add a new pipeline (POST /pipelines; 5 API tokens; OAuth scopes: admin)',
	},
	'apiV2.pipelines.deletePipeline': {
		riskLevel: 'destructive',
		description:
			'Delete a pipeline (DELETE /pipelines/{id}; 3 API tokens; OAuth scopes: admin)',
	},
	'apiV2.pipelines.getPipeline': {
		riskLevel: 'read',
		description:
			'Get one pipeline (GET /pipelines/{id}; 1 API tokens; OAuth scopes: deals:read, deals:full, admin)',
	},
	'apiV2.pipelines.updatePipeline': {
		riskLevel: 'write',
		description:
			'Update a pipeline (PATCH /pipelines/{id}; 5 API tokens; OAuth scopes: admin)',
	},
	'apiV2.projectFields.getProjectFields': {
		riskLevel: 'read',
		description:
			'Get all project fields (GET /projectFields; 10 API tokens; OAuth scopes: projects:read, projects:full, project-fields:full)',
	},
	'apiV2.projectFields.addProjectField': {
		riskLevel: 'write',
		description:
			'Create one project field (POST /projectFields; 5 API tokens; OAuth scopes: project-fields:full)',
	},
	'apiV2.projectFields.getProjectField': {
		riskLevel: 'read',
		description:
			'Get one project field (GET /projectFields/{field_code}; 1 API tokens; OAuth scopes: projects:read, projects:full, project-fields:full)',
	},
	'apiV2.projectFields.updateProjectField': {
		riskLevel: 'write',
		description:
			'Update one project field (PATCH /projectFields/{field_code}; 5 API tokens; OAuth scopes: project-fields:full)',
	},
	'apiV2.projectFields.deleteProjectField': {
		riskLevel: 'destructive',
		description:
			'Delete one project field (DELETE /projectFields/{field_code}; 3 API tokens; OAuth scopes: project-fields:full)',
	},
	'apiV2.projectFields.addProjectFieldOptions': {
		riskLevel: 'write',
		description:
			'Add project field options in bulk (POST /projectFields/{field_code}/options; 5 API tokens; OAuth scopes: project-fields:full)',
	},
	'apiV2.projectFields.deleteProjectFieldOptions': {
		riskLevel: 'destructive',
		description:
			'Delete project field options in bulk (DELETE /projectFields/{field_code}/options; 3 API tokens; OAuth scopes: project-fields:full)',
	},
	'apiV2.projectFields.updateProjectFieldOptions': {
		riskLevel: 'write',
		description:
			'Update project field options in bulk (PATCH /projectFields/{field_code}/options; 5 API tokens; OAuth scopes: project-fields:full)',
	},
	'apiV2.projects.getProjects': {
		riskLevel: 'read',
		description:
			'Get all projects (GET /projects; 10 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV2.projects.addProject': {
		riskLevel: 'write',
		description:
			'Add a project (POST /projects; 5 API tokens; OAuth scopes: projects:full)',
	},
	'apiV2.projects.getArchivedProjects': {
		riskLevel: 'read',
		description:
			'Get all archived projects (GET /projects/archived; 10 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV2.projects.getProject': {
		riskLevel: 'read',
		description:
			'Get details of a project (GET /projects/{id}; 1 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV2.projects.updateProject': {
		riskLevel: 'write',
		description:
			'Update a project (PATCH /projects/{id}; 5 API tokens; OAuth scopes: projects:full)',
	},
	'apiV2.projects.deleteProject': {
		riskLevel: 'destructive',
		description:
			'Delete a project (DELETE /projects/{id}; 3 API tokens; OAuth scopes: projects:full)',
	},
	'apiV2.projectTemplates.getProjectTemplates': {
		riskLevel: 'read',
		description:
			'Get all project templates (GET /projectTemplates; 10 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV2.projectTemplates.getProjectTemplate': {
		riskLevel: 'read',
		description:
			'Get details of a template (GET /projectTemplates/{id}; 1 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV2.projects.searchProjects': {
		riskLevel: 'read',
		description:
			'Search projects (GET /projects/search; 20 API tokens; OAuth scopes: projects:read, projects:full, search:read)',
	},
	'apiV2.projects.archiveProject': {
		riskLevel: 'write',
		description:
			'Archive a project (POST /projects/{id}/archive; 3 API tokens; OAuth scopes: projects:full)',
	},
	'apiV2.projects.getProjectUsers': {
		riskLevel: 'read',
		description:
			'List permitted users (GET /projects/{id}/permittedUsers; 5 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV2.projects.getProjectChangelog': {
		riskLevel: 'read',
		description:
			'List updates about project field values (GET /projects/{id}/changelog; 10 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV2.projectBoards.getProjectsBoards': {
		riskLevel: 'read',
		description:
			'Get all project boards (GET /boards; 10 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV2.projectBoards.addProjectBoard': {
		riskLevel: 'write',
		description:
			'Add a project board (POST /boards; 5 API tokens; OAuth scopes: projects:full)',
	},
	'apiV2.projectBoards.getProjectsBoard': {
		riskLevel: 'read',
		description:
			'Get details of a project board (GET /boards/{id}; 10 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV2.projectBoards.updateProjectBoard': {
		riskLevel: 'write',
		description:
			'Update a project board (PATCH /boards/{id}; 5 API tokens; OAuth scopes: projects:full)',
	},
	'apiV2.projectBoards.deleteProjectBoard': {
		riskLevel: 'destructive',
		description:
			'Delete a project board (DELETE /boards/{id}; 3 API tokens; OAuth scopes: projects:full)',
	},
	'apiV2.projectPhases.getProjectsPhases': {
		riskLevel: 'read',
		description:
			'Get project phases (GET /phases; 10 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV2.projectPhases.addProjectPhase': {
		riskLevel: 'write',
		description:
			'Add a project phase (POST /phases; 5 API tokens; OAuth scopes: projects:full)',
	},
	'apiV2.projectPhases.getProjectsPhase': {
		riskLevel: 'read',
		description:
			'Get details of a project phase (GET /phases/{id}; 10 API tokens; OAuth scopes: projects:read, projects:full)',
	},
	'apiV2.projectPhases.updateProjectPhase': {
		riskLevel: 'write',
		description:
			'Update a project phase (PATCH /phases/{id}; 5 API tokens; OAuth scopes: projects:full)',
	},
	'apiV2.projectPhases.deleteProjectPhase': {
		riskLevel: 'destructive',
		description:
			'Delete a project phase (DELETE /phases/{id}; 3 API tokens; OAuth scopes: projects:full)',
	},
	'apiV2.users.getUserFollowers': {
		riskLevel: 'read',
		description:
			'List followers of a user (GET /users/{id}/followers; 10 API tokens; OAuth scopes: users:read)',
	},
} as const;
