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
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Routes } from './endpoints';
import type { FreshdeskRouteName } from './endpoints/operations';
import { FRESHDESK_OPERATIONS } from './endpoints/operations';
import type {
	FreshdeskEndpointInputs,
	FreshdeskEndpointOutputs,
} from './endpoints/types';
import {
	createFreshdeskRouteInputSchema,
	FreshdeskEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FreshdeskSchema } from './schema';

export type FreshdeskPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	// Exact account hostname from the Freshdesk portal; custom CNAMEs are unsupported.
	domain?: string;
	errorHandlers?: CorsairErrorHandler;
};

export type FreshdeskContext = CorsairPluginContext<
	typeof FreshdeskSchema,
	FreshdeskPluginOptions
>;
export type FreshdeskKeyBuilderContext =
	KeyBuilderContext<FreshdeskPluginOptions>;
export type FreshdeskBoundEndpoints = BindEndpoints<
	typeof freshdeskEndpointsNested
>;

type FreshdeskEndpoint<K extends keyof FreshdeskEndpointOutputs> =
	CorsairEndpoint<
		FreshdeskContext,
		FreshdeskEndpointInputs[K],
		FreshdeskEndpointOutputs[K]
	>;

export type FreshdeskEndpoints = {
	routes: { [K in FreshdeskRouteName]: { run: FreshdeskEndpoint<'route'> } };
};

const freshdeskEndpointsNested = {
	routes: Routes,
} as const satisfies FreshdeskEndpoints;

export const freshdeskEndpointSchemas = {
	'routes.createTicketPostTickets.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createTicketPostTickets,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createOutboundEmailPostOutboundEmail.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createOutboundEmailPostOutboundEmail,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewATicketGet.run': {
		input: createFreshdeskRouteInputSchema(FRESHDESK_OPERATIONS.viewATicketGet),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.ticketAssociationGetAssociatedTickets.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.ticketAssociationGetAssociatedTickets,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.ticketAssociationGetPrimeAssociation.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.ticketAssociationGetPrimeAssociation,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllTicketsGetTickets.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllTicketsGetTickets,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.filterTicketsGetTickets.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.filterTicketsGetTickets,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateTicketPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateTicketPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.bulkUpdateTicketsPostBulkUpdate.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.bulkUpdateTicketsPostBulkUpdate,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.forwardTicketsPostForward.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.forwardTicketsPostForward,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.ticketMergePutMerge.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.ticketMergePutMerge,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.watcherGetWatchers.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.watcherGetWatchers,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.watcherPostWatch.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.watcherPostWatch,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.watcherPutUnwatch.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.watcherPutUnwatch,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.watcherPutBulkWatch.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.watcherPutBulkWatch,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.watcherPutBulkUnwatch.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.watcherPutBulkUnwatch,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteATicketDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteATicketDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.bulkDeleteTicketsPostBulkDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.bulkDeleteTicketsPostBulkDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteAnAttachmentDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteAnAttachmentDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.restoreATicketPutRestore.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.restoreATicketPutRestore,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllTicketFieldsGetTicketFields.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllTicketFieldsGetTicketFields,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllTicketNotesGetConversations.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllTicketNotesGetConversations,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllTicketTimeentriesGetTimeEntries.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllTicketTimeentriesGetTimeEntries,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewTicketSatisfactionRatingsGetSatisfactionRatings.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewTicketSatisfactionRatingsGetSatisfactionRatings,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.ticketSummaryGetSummary.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.ticketSummaryGetSummary,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.ticketSummaryPutSummary.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.ticketSummaryPutSummary,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.ticketSummaryDeleteSummary.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.ticketSummaryDeleteSummary,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.archiveTicketsGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.archiveTicketsGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.archiveTicketsDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.archiveTicketsDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.archiveTicketsGetConversations.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.archiveTicketsGetConversations,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.ticketUserAccessesPostAccesses.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.ticketUserAccessesPostAccesses,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.ticketUserAccessesPatchAccesses.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.ticketUserAccessesPatchAccesses,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.ticketUserAccessesGetAccesses.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.ticketUserAccessesGetAccesses,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.ticketUserAccessesDeleteAccesses.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.ticketUserAccessesDeleteAccesses,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllTicketFieldsGetTicketFields35.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllTicketFieldsGetTicketFields35,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createTicketFieldPostTicketFields.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createTicketFieldPostTicketFields,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewTicketFieldGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewTicketFieldGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateTicketFieldPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateTicketFieldPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteTicketFieldDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteTicketFieldDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllSectionFieldsGetSections.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllSectionFieldsGetSections,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createSectionPostSections.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createSectionPostSections,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listSpecificSectionGetSectionId.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listSpecificSectionGetSectionId,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateSectionPutSectionId.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateSectionPutSectionId,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteSectionDeleteSectionId.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteSectionDeleteSectionId,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllTicketFormsGetTicketForms.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllTicketFormsGetTicketForms,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createTicketFormPostTicketForms.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createTicketFormPostTicketForms,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewTicketFormGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewTicketFormGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateTicketFormPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateTicketFormPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteTicketFormDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteTicketFormDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.cloneTicketFormPostClone.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.cloneTicketFormPostClone,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewTicketFormFieldGetFieldId.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewTicketFormFieldGetFieldId,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateTicketFormFieldPutFieldId.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateTicketFormFieldPutFieldId,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteTicketFormFieldDeleteFieldId.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteTicketFormFieldDeleteFieldId,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.replyTicketPostReply.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.replyTicketPostReply,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.addNoteToATicketPostNotes.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.addNoteToATicketPostNotes,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateConversationPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateConversationPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteConversationDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteConversationDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.replyToForwardPostReplyToForward.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.replyToForwardPostReplyToForward,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.sendOutboundMessagePostOutboundMessages.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.sendOutboundMessagePostOutboundMessages,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.retrieveOutboundMessageGetMessageId.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.retrieveOutboundMessageGetMessageId,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewAccountGetAccount.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewAccountGetAccount,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.generateExportPostExport.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.generateExportPostExport,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewJobGet.run': {
		input: createFreshdeskRouteInputSchema(FRESHDESK_OPERATIONS.viewJobGet),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createContactPostContacts.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createContactPostContacts,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewContactGet.run': {
		input: createFreshdeskRouteInputSchema(FRESHDESK_OPERATIONS.viewContactGet),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllContactsGetContacts.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllContactsGetContacts,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.searchContactsGetAutocomplete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.searchContactsGetAutocomplete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.filterContactsGetContacts.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.filterContactsGetContacts,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateContactPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateContactPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteContactDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteContactDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.hardDeleteContactDeleteHardDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.hardDeleteContactDeleteHardDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.makeAgentPutMakeAgent.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.makeAgentPutMakeAgent,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.restoreContactPutRestore.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.restoreContactPutRestore,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.sendInvitePutSendInvite.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.sendInvitePutSendInvite,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.mergeContactPostMerge.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.mergeContactPostMerge,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.exportContactPostExport.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.exportContactPostExport,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.exportContactGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.exportContactGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.importContactGetImports.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.importContactGetImports,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.importContactGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.importContactGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.importContactPostImports.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.importContactPostImports,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.importContactPutCancel.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.importContactPutCancel,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllContactFieldsGetContactFields.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllContactFieldsGetContactFields,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewContactFieldGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewContactFieldGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createContactFieldPostContactFields.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createContactFieldPostContactFields,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateContactFieldPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateContactFieldPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteContactFieldDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteContactFieldDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewAgentGet.run': {
		input: createFreshdeskRouteInputSchema(FRESHDESK_OPERATIONS.viewAgentGet),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllAgentsGetAgents.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllAgentsGetAgents,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createAgentPostOperation.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createAgentPostOperation,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateAgentPut.run': {
		input: createFreshdeskRouteInputSchema(FRESHDESK_OPERATIONS.updateAgentPut),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteAgentDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteAgentDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.meGetMe.run': {
		input: createFreshdeskRouteInputSchema(FRESHDESK_OPERATIONS.meGetMe),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createMultipleAgentsPostBulk.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createMultipleAgentsPostBulk,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.searchAgentsGetAutocomplete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.searchAgentsGetAutocomplete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllAgentsAvailabilityGetAgents.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllAgentsAvailabilityGetAgents,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewAgentAvailabilityGetAvailability.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewAgentAvailabilityGetAvailability,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateAgentAvailabilityPutAvailability.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateAgentAvailabilityPutAvailability,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewSkillGet.run': {
		input: createFreshdeskRouteInputSchema(FRESHDESK_OPERATIONS.viewSkillGet),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllSkillsGetOperation.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllSkillsGetOperation,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createSkillPostSkills.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createSkillPostSkills,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteSkillDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteSkillDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateSkillPut.run': {
		input: createFreshdeskRouteInputSchema(FRESHDESK_OPERATIONS.updateSkillPut),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewRoleGet.run': {
		input: createFreshdeskRouteInputSchema(FRESHDESK_OPERATIONS.viewRoleGet),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllRolesGetRoles.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllRolesGetRoles,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createGroupPostGroups.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createGroupPostGroups,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewGroupGet.run': {
		input: createFreshdeskRouteInputSchema(FRESHDESK_OPERATIONS.viewGroupGet),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllGroupsGetGroups.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllGroupsGetGroups,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateGroupPut.run': {
		input: createFreshdeskRouteInputSchema(FRESHDESK_OPERATIONS.updateGroupPut),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteGroupDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteGroupDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createAdminGroupPostGroups.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createAdminGroupPostGroups,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewAdminGroupGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewAdminGroupGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllAdminGroupsGetGroups.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllAdminGroupsGetGroups,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateAdminGroupPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateAdminGroupPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteAdminGroupDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteAdminGroupDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllAgentsInAGroupGetAgents.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllAgentsInAGroupGetAgents,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.addOrRemoveAgentInAGroupPatchAgents.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.addOrRemoveAgentInAGroupPatchAgents,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createCompanyPostCompanies.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createCompanyPostCompanies,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewCompanyGet.run': {
		input: createFreshdeskRouteInputSchema(FRESHDESK_OPERATIONS.viewCompanyGet),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllCompaniesGetCompanies.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllCompaniesGetCompanies,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.searchCompaniesGetAutocomplete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.searchCompaniesGetAutocomplete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.filterCompaniesGetCompanies.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.filterCompaniesGetCompanies,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateCompanyPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateCompanyPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteCompanyDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteCompanyDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.exportCompanyPostExport.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.exportCompanyPostExport,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.exportCompanyGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.exportCompanyGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.importCompanyGetImports.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.importCompanyGetImports,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.importCompanyGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.importCompanyGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.importCompanyPostImports.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.importCompanyPostImports,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.importCompanyPutCancel.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.importCompanyPutCancel,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllCompanyFieldsGetCompanyFields.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllCompanyFieldsGetCompanyFields,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewCompanyFieldGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewCompanyFieldGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createCompanyFieldPostCompanyFields.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createCompanyFieldPostCompanyFields,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateCompanyFieldPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateCompanyFieldPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteCompanyFieldDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteCompanyFieldDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.retrieveExistingCustomObjectsGetSchemas.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.retrieveExistingCustomObjectsGetSchemas,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.retrieveSpecificCustomObjectGetSchemaId.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.retrieveSpecificCustomObjectGetSchemaId,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createANewCustomObjectRecordPostOperation.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createANewCustomObjectRecordPostOperation,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.retrieveACustomObjectRecordGetRecordId.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.retrieveACustomObjectRecordGetRecordId,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateACustomObjectRecordPutRecordId.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateACustomObjectRecordPutRecordId,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteACustomObjectRecordDeleteRecordId.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteACustomObjectRecordDeleteRecordId,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.retrieveAllTheRecordsOfACustomObjectGetRecords.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.retrieveAllTheRecordsOfACustomObjectGetRecords,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.retrieveTheCountOfRecordsCustomObjectsGetCount.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.retrieveTheCountOfRecordsCustomObjectsGetCount,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createCannedResponsePostCannedResponses.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createCannedResponsePostCannedResponses,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewCannedResponseGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewCannedResponseGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateCannedResponsePut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateCannedResponsePut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.bulkCreateCannedResponsesPostBulk.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.bulkCreateCannedResponsesPostBulk,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createCannedResponseFolderPostCannedResponseFolders.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createCannedResponseFolderPostCannedResponseFolders,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateCannedResponseFolderPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateCannedResponseFolderPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllCannedResponseFoldersGetCannedResponseFolders.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllCannedResponseFoldersGetCannedResponseFolders,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewCannedResponseFoldersGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewCannedResponseFoldersGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.getDetailsOfCannedResponsesInFoldersGetResponses.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.getDetailsOfCannedResponsesInFoldersGetResponses,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.categoryAttributesPostCategories.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.categoryAttributesPostCategories,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.categoryAttributesGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.categoryAttributesGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.categoryAttributesGetCategories.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.categoryAttributesGetCategories,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.categoryAttributesGetForums.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.categoryAttributesGetForums,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.categoryAttributesPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.categoryAttributesPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.categoryAttributesDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.categoryAttributesDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.forumAttributesPostForums.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.forumAttributesPostForums,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.forumAttributesGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.forumAttributesGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.forumAttributesGetTopics.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.forumAttributesGetTopics,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.forumAttributesPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.forumAttributesPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.forumAttributesDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.forumAttributesDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.forumAttributesPostFollow.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.forumAttributesPostFollow,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.forumAttributesDeleteFollow.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.forumAttributesDeleteFollow,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.forumAttributesGetFollow.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.forumAttributesGetFollow,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.topicAttributesPostTopics.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.topicAttributesPostTopics,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.topicAttributesGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.topicAttributesGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.topicAttributesGetComments.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.topicAttributesGetComments,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.topicAttributesPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.topicAttributesPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.topicAttributesDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.topicAttributesDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.topicAttributesPostFollow.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.topicAttributesPostFollow,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.topicAttributesDeleteFollow.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.topicAttributesDeleteFollow,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.topicAttributesGetFollow.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.topicAttributesGetFollow,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.topicAttributesGetFollowedBy.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.topicAttributesGetFollowedBy,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.topicAttributesGetParticipatedBy.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.topicAttributesGetParticipatedBy,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.commentAttributesPostComments.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.commentAttributesPostComments,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.commentAttributesPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.commentAttributesPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.commentAttributesDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.commentAttributesDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionCategoryAttributesPostCategories.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionCategoryAttributesPostCategories,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionCategoryAttributesPostLanguageCode.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionCategoryAttributesPostLanguageCode,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionCategoryAttributesPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionCategoryAttributesPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionCategoryAttributesPutLanguageCode.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionCategoryAttributesPutLanguageCode,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionCategoryAttributesGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionCategoryAttributesGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionCategoryAttributesGetLanguageCode.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionCategoryAttributesGetLanguageCode,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionCategoryAttributesGetCategories.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionCategoryAttributesGetCategories,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionCategoryAttributesGetLanguageCode186.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionCategoryAttributesGetLanguageCode186,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionCategoryAttributesDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionCategoryAttributesDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionFolderAttributesPostFolders.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionFolderAttributesPostFolders,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionFolderAttributesPostLanguageCode.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionFolderAttributesPostLanguageCode,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionFolderAttributesPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionFolderAttributesPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionFolderAttributesPutLanguageCode.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionFolderAttributesPutLanguageCode,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionFolderAttributesGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionFolderAttributesGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionFolderAttributesGetLanguageCode.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionFolderAttributesGetLanguageCode,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionFolderAttributesGetFolders.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionFolderAttributesGetFolders,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionFolderAttributesGetLanguageCode195.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionFolderAttributesGetLanguageCode195,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionFolderAttributesGetSubfolders.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionFolderAttributesGetSubfolders,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionFolderAttributesGetLanguageCode197.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionFolderAttributesGetLanguageCode197,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionFolderAttributesDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionFolderAttributesDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionArticleAttributesPostArticles.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionArticleAttributesPostArticles,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionArticleAttributesPostLanguageCode.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionArticleAttributesPostLanguageCode,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionArticleAttributesPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionArticleAttributesPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionArticleAttributesPutLanguageCode.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionArticleAttributesPutLanguageCode,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionArticleAttributesGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionArticleAttributesGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionArticleAttributesGetLanguageCode.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionArticleAttributesGetLanguageCode,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionArticleAttributesGetArticles.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionArticleAttributesGetArticles,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionArticleAttributesGetLanguageCode206.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionArticleAttributesGetLanguageCode206,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionArticleAttributesDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionArticleAttributesDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.solutionArticleAttributesGetSolutions.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.solutionArticleAttributesGetSolutions,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.csatSurveysGetSurveys.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.csatSurveysGetSurveys,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createSurveyResponsesPostResponses.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createSurveyResponsesPostResponses,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewSurveyResponsesGetResponses.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewSurveyResponsesGetResponses,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllSurveyGetSurveys.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllSurveyGetSurveys,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createSatisfactionRatingPostSatisfactionRatings.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createSatisfactionRatingPostSatisfactionRatings,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewAllSatisfactionRatingsGetSatisfactionRatings.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewAllSatisfactionRatingsGetSatisfactionRatings,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createTimeEntryPostTimeEntries.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createTimeEntryPostTimeEntries,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllTimeEntriesGetTimeEntries.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllTimeEntriesGetTimeEntries,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateTimeEntryPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateTimeEntryPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.toggleTimeEntryPutToggleTimer.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.toggleTimeEntryPutToggleTimer,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteTimeEntryDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteTimeEntryDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewEmailConfigGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewEmailConfigGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllEmailConfigsGetEmailConfigs.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllEmailConfigsGetEmailConfigs,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createEmailMailboxPostMailboxes.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createEmailMailboxPostMailboxes,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewEmailMailboxGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewEmailMailboxGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllEmailMailboxesGetMailboxes.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllEmailMailboxesGetMailboxes,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateEmailMailboxPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateEmailMailboxPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteEmailMailboxDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteEmailMailboxDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateMailboxSettingsPutSettings.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateMailboxSettingsPutSettings,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewMailboxSettingsGetSettings.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewMailboxSettingsGetSettings,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateAutomaticBccEmailsPutBcc.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateAutomaticBccEmailsPutBcc,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewAutomaticBccEmailsGetBcc.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewAutomaticBccEmailsGetBcc,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewProductGet.run': {
		input: createFreshdeskRouteInputSchema(FRESHDESK_OPERATIONS.viewProductGet),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllProductsGetProducts.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllProductsGetProducts,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewBusinessHourGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewBusinessHourGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllBusinessHoursGetBusinessHours.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllBusinessHoursGetBusinessHours,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllScenarioAutomationsGetScenarioAutomations.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllScenarioAutomationsGetScenarioAutomations,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createSlaPolicyPostSlaPolicies.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createSlaPolicyPostSlaPolicies,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllSlaPoliciesGetSlaPolicies.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllSlaPoliciesGetSlaPolicies,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateSlaPolicyPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateSlaPolicyPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.publishOmnichannelActivityPostContactActivities.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.publishOmnichannelActivityPostContactActivities,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.listAllAutomationRulesGetRules.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.listAllAutomationRulesGetRules,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.viewAnAutomationRuleGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.viewAnAutomationRuleGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteAnAutomationRuleDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteAnAutomationRuleDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createAnAutomationRulePostRules.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createAnAutomationRulePostRules,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateAnAutomationRulePut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateAnAutomationRulePut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.settingsHelpdeskGetHelpdesk.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.settingsHelpdeskGetHelpdesk,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createAThreadPostThreads.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createAThreadPostThreads,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.getAThreadGet.run': {
		input: createFreshdeskRouteInputSchema(FRESHDESK_OPERATIONS.getAThreadGet),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateAThreadPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateAThreadPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteAThreadDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteAThreadDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.createMessageForThreadPostMessages.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.createMessageForThreadPostMessages,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.getMessageForThreadGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.getMessageForThreadGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.updateMessageForThreadPut.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.updateMessageForThreadPut,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.deleteMessageForThreadDelete.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.deleteMessageForThreadDelete,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.getQuotedTextGetGenerateQuote.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.getQuotedTextGetGenerateQuote,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.exportAuditLogPostExport.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.exportAuditLogPostExport,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
	'routes.exportAuditLogGet.run': {
		input: createFreshdeskRouteInputSchema(
			FRESHDESK_OPERATIONS.exportAuditLogGet,
		),
		output: FreshdeskEndpointOutputSchemas.route,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof freshdeskEndpointsNested
>;

export const freshdeskEndpointMeta = {
	'routes.createTicketPostTickets.run': {
		riskLevel: 'write',
		description: 'Create a Ticket: POST /api/v2/tickets (Freshdesk API v2).',
	},
	'routes.createOutboundEmailPostOutboundEmail.run': {
		riskLevel: 'write',
		description:
			'Create an Outbound Email: POST /api/v2/tickets/outbound_email (Freshdesk API v2).',
	},
	'routes.viewATicketGet.run': {
		riskLevel: 'read',
		description: 'View a Ticket: GET /api/v2/tickets/[id] (Freshdesk API v2).',
	},
	'routes.ticketAssociationGetAssociatedTickets.run': {
		riskLevel: 'read',
		description:
			'Ticket Association API: GET /api/v2/tickets/[id]/associated_tickets (Freshdesk API v2).',
	},
	'routes.ticketAssociationGetPrimeAssociation.run': {
		riskLevel: 'read',
		description:
			'Ticket Association API: GET /api/v2/tickets/[id]/prime_association (Freshdesk API v2).',
	},
	'routes.listAllTicketsGetTickets.run': {
		riskLevel: 'read',
		description: 'List All Tickets: GET /api/v2/tickets (Freshdesk API v2).',
	},
	'routes.filterTicketsGetTickets.run': {
		riskLevel: 'read',
		description:
			'Filter Tickets: GET /api/v2/search/tickets (Freshdesk API v2).',
	},
	'routes.updateTicketPut.run': {
		riskLevel: 'write',
		description:
			'Update a Ticket: PUT /api/v2/tickets/[id] (Freshdesk API v2).',
	},
	'routes.bulkUpdateTicketsPostBulkUpdate.run': {
		riskLevel: 'write',
		description:
			'Update Multiple Tickets: POST /api/v2/tickets/bulk_update (Freshdesk API v2).',
	},
	'routes.forwardTicketsPostForward.run': {
		riskLevel: 'write',
		description:
			'Forward a ticket: POST /api/v2/tickets/[id]/forward (Freshdesk API v2).',
	},
	'routes.ticketMergePutMerge.run': {
		riskLevel: 'write',
		description:
			'Ticket Merge API: PUT /api/v2/tickets/merge (Freshdesk API v2).',
	},
	'routes.watcherGetWatchers.run': {
		riskLevel: 'read',
		description:
			'Watcher: GET /api/v2/tickets/[id]/watchers (Freshdesk API v2).',
	},
	'routes.watcherPostWatch.run': {
		riskLevel: 'write',
		description: 'Watcher: POST /api/v2/tickets/[id]/watch (Freshdesk API v2).',
	},
	'routes.watcherPutUnwatch.run': {
		riskLevel: 'write',
		description:
			'Watcher: PUT /api/v2/tickets/[id]/unwatch (Freshdesk API v2).',
	},
	'routes.watcherPutBulkWatch.run': {
		riskLevel: 'write',
		description: 'Watcher: PUT /api/v2/tickets/bulk_watch (Freshdesk API v2).',
	},
	'routes.watcherPutBulkUnwatch.run': {
		riskLevel: 'write',
		description:
			'Watcher: PUT /api/v2/tickets/bulk_unwatch (Freshdesk API v2).',
	},
	'routes.deleteATicketDelete.run': {
		riskLevel: 'destructive',
		description:
			'Delete a Ticket: DELETE /api/v2/tickets/[id] (Freshdesk API v2).',
	},
	'routes.bulkDeleteTicketsPostBulkDelete.run': {
		riskLevel: 'destructive',
		description:
			'Delete Multiple Tickets: POST /api/v2/tickets/bulk_delete (Freshdesk API v2).',
	},
	'routes.deleteAnAttachmentDelete.run': {
		riskLevel: 'destructive',
		description:
			'Delete an attachment: DELETE /api/v2/attachments/[id] (Freshdesk API v2).',
	},
	'routes.restoreATicketPutRestore.run': {
		riskLevel: 'write',
		description:
			'Restore a Ticket: PUT /api/v2/tickets/[id]/restore (Freshdesk API v2).',
	},
	'routes.listAllTicketFieldsGetTicketFields.run': {
		riskLevel: 'read',
		description:
			'List All Ticket Fields: GET /api/v2/ticket_fields (Freshdesk API v2).',
	},
	'routes.listAllTicketNotesGetConversations.run': {
		riskLevel: 'read',
		description:
			'List All Conversations of a Ticket: GET /api/v2/tickets/[id]/conversations (Freshdesk API v2).',
	},
	'routes.listAllTicketTimeentriesGetTimeEntries.run': {
		riskLevel: 'read',
		description:
			'List All Time Entries of a Ticket: GET /api/v2/tickets/[id]/time_entries (Freshdesk API v2).',
	},
	'routes.viewTicketSatisfactionRatingsGetSatisfactionRatings.run': {
		riskLevel: 'read',
		description:
			'List All Satisfaction Ratings of a Ticket: GET /api/v2/tickets/[ticket_id]/satisfaction_ratings (Freshdesk API v2).',
	},
	'routes.ticketSummaryGetSummary.run': {
		riskLevel: 'read',
		description:
			'Ticket Summary: GET /api/v2/tickets/[id]/summary (Freshdesk API v2).',
	},
	'routes.ticketSummaryPutSummary.run': {
		riskLevel: 'write',
		description:
			'Ticket Summary: PUT /api/v2/tickets/[id]/summary (Freshdesk API v2).',
	},
	'routes.ticketSummaryDeleteSummary.run': {
		riskLevel: 'destructive',
		description:
			'Ticket Summary: DELETE /api/v2/tickets/[id]/summary (Freshdesk API v2).',
	},
	'routes.archiveTicketsGet.run': {
		riskLevel: 'read',
		description:
			'Archive Tickets: GET /api/v2/tickets/archived/[id] (Freshdesk API v2).',
	},
	'routes.archiveTicketsDelete.run': {
		riskLevel: 'destructive',
		description:
			'Archive Tickets: DELETE /api/v2/tickets/archived/[id] (Freshdesk API v2).',
	},
	'routes.archiveTicketsGetConversations.run': {
		riskLevel: 'read',
		description:
			'Archive Tickets: GET /api/v2/tickets/archived/[id]/conversations (Freshdesk API v2).',
	},
	'routes.ticketUserAccessesPostAccesses.run': {
		riskLevel: 'write',
		description:
			'Ticket User Access: POST /api/v2/tickets/[id]/accesses (Freshdesk API v2).',
	},
	'routes.ticketUserAccessesPatchAccesses.run': {
		riskLevel: 'write',
		description:
			'Ticket User Access: PATCH /api/v2/tickets/[id]/accesses (Freshdesk API v2).',
	},
	'routes.ticketUserAccessesGetAccesses.run': {
		riskLevel: 'read',
		description:
			'Ticket User Access: GET /api/v2/tickets/[id]/accesses (Freshdesk API v2).',
	},
	'routes.ticketUserAccessesDeleteAccesses.run': {
		riskLevel: 'destructive',
		description:
			'Ticket User Access: DELETE /api/v2/tickets/[id]/accesses (Freshdesk API v2).',
	},
	'routes.listAllTicketFieldsGetTicketFields35.run': {
		riskLevel: 'read',
		description:
			'List All Ticket Fields: GET /api/v2/admin/ticket_fields (Freshdesk API v2).',
	},
	'routes.createTicketFieldPostTicketFields.run': {
		riskLevel: 'write',
		description:
			'Create a Ticket Field: POST /api/v2/admin/ticket_fields (Freshdesk API v2).',
	},
	'routes.viewTicketFieldGet.run': {
		riskLevel: 'read',
		description:
			'View a Ticket Field: GET /api/v2/admin/ticket_fields/[id] (Freshdesk API v2).',
	},
	'routes.updateTicketFieldPut.run': {
		riskLevel: 'write',
		description:
			'Update a Ticket Field: PUT /api/v2/admin/ticket_fields/[id] (Freshdesk API v2).',
	},
	'routes.deleteTicketFieldDelete.run': {
		riskLevel: 'destructive',
		description:
			'Delete a Ticket Field: DELETE /api/v2/admin/ticket_fields/[id] (Freshdesk API v2).',
	},
	'routes.listAllSectionFieldsGetSections.run': {
		riskLevel: 'read',
		description:
			'List All Sections for a Ticket Field: GET /api/v2/admin/ticket_fields/[id]/sections (Freshdesk API v2).',
	},
	'routes.createSectionPostSections.run': {
		riskLevel: 'write',
		description:
			'Create a Section: POST /api/v2/admin/ticket_fields/[id]/sections (Freshdesk API v2).',
	},
	'routes.listSpecificSectionGetSectionId.run': {
		riskLevel: 'read',
		description:
			'List a specific Section details: GET /api/v2/admin/ticket_fields/[id]/sections/[section_id] (Freshdesk API v2).',
	},
	'routes.updateSectionPutSectionId.run': {
		riskLevel: 'write',
		description:
			'Update a section: PUT /api/v2/admin/ticket_fields/[id]/sections/[section_id] (Freshdesk API v2).',
	},
	'routes.deleteSectionDeleteSectionId.run': {
		riskLevel: 'destructive',
		description:
			'Delete a section: DELETE /api/v2/admin/ticket_fields/[id]/sections/[section_id] (Freshdesk API v2).',
	},
	'routes.listAllTicketFormsGetTicketForms.run': {
		riskLevel: 'read',
		description:
			'List All Ticket Forms: GET /api/v2/ticket-forms (Freshdesk API v2).',
	},
	'routes.createTicketFormPostTicketForms.run': {
		riskLevel: 'write',
		description:
			'Create a Ticket Form: POST /api/v2/ticket-forms (Freshdesk API v2).',
	},
	'routes.viewTicketFormGet.run': {
		riskLevel: 'read',
		description:
			'View a Ticket Form: GET /api/v2/ticket-forms/[id] (Freshdesk API v2).',
	},
	'routes.updateTicketFormPut.run': {
		riskLevel: 'write',
		description:
			'Update a Ticket Form: PUT /api/v2/ticket-forms/[id] (Freshdesk API v2).',
	},
	'routes.deleteTicketFormDelete.run': {
		riskLevel: 'destructive',
		description:
			'Delete a Ticket Form: DELETE /api/v2/ticket-forms/[id] (Freshdesk API v2).',
	},
	'routes.cloneTicketFormPostClone.run': {
		riskLevel: 'write',
		description:
			'Clone a Ticket Form: POST /api/v2/ticket-forms/[id]/clone (Freshdesk API v2).',
	},
	'routes.viewTicketFormFieldGetFieldId.run': {
		riskLevel: 'read',
		description:
			"View A Ticket Form's Field: GET /api/v2/ticket-forms/[form-id]/fields/[field-id] (Freshdesk API v2).",
	},
	'routes.updateTicketFormFieldPutFieldId.run': {
		riskLevel: 'write',
		description:
			"Update A Ticket Form's Field: PUT /api/v2/ticket-forms/[form-id]/fields/[field-id] (Freshdesk API v2).",
	},
	'routes.deleteTicketFormFieldDeleteFieldId.run': {
		riskLevel: 'destructive',
		description:
			"Delete a Ticket Form's Field: DELETE /api/v2/ticket-forms/[form-id]/fields/[field-id] (Freshdesk API v2).",
	},
	'routes.replyTicketPostReply.run': {
		riskLevel: 'write',
		description:
			'Create a Reply: POST /api/v2/tickets/[id]/reply (Freshdesk API v2).',
	},
	'routes.addNoteToATicketPostNotes.run': {
		riskLevel: 'write',
		description:
			'Create a Note: POST /api/v2/tickets/[ticket_id]/notes (Freshdesk API v2).',
	},
	'routes.updateConversationPut.run': {
		riskLevel: 'write',
		description:
			'Update a conversation: PUT /api/v2/conversations/[id] (Freshdesk API v2).',
	},
	'routes.deleteConversationDelete.run': {
		riskLevel: 'destructive',
		description:
			'Delete a conversation: DELETE /api/v2/conversations/[id] (Freshdesk API v2).',
	},
	'routes.replyToForwardPostReplyToForward.run': {
		riskLevel: 'write',
		description:
			'Reply to Forward: POST /api/v2/tickets/[id]/reply_to_forward (Freshdesk API v2).',
	},
	'routes.sendOutboundMessagePostOutboundMessages.run': {
		riskLevel: 'write',
		description:
			'Send Proactive Message: POST /api/v2/channels/outbound-messages (Freshdesk API v2).',
	},
	'routes.retrieveOutboundMessageGetMessageId.run': {
		riskLevel: 'read',
		description:
			'Retrieve Message: GET /api/v2/channels/outbound-messages/[message-id] (Freshdesk API v2).',
	},
	'routes.viewAccountGetAccount.run': {
		riskLevel: 'read',
		description: 'View Account: GET /api/v2/account (Freshdesk API v2).',
	},
	'routes.generateExportPostExport.run': {
		riskLevel: 'write',
		description:
			'Export Account: POST /api/v2/account/export (Freshdesk API v2).',
	},
	'routes.viewJobGet.run': {
		riskLevel: 'read',
		description: 'View a Job: GET /api/v2/jobs/[id] (Freshdesk API v2).',
	},
	'routes.createContactPostContacts.run': {
		riskLevel: 'write',
		description: 'Create a Contact: POST /api/v2/contacts (Freshdesk API v2).',
	},
	'routes.viewContactGet.run': {
		riskLevel: 'read',
		description:
			'View a Contact: GET /api/v2/contacts/[id] (Freshdesk API v2).',
	},
	'routes.listAllContactsGetContacts.run': {
		riskLevel: 'read',
		description: 'List All Contacts: GET /api/v2/contacts (Freshdesk API v2).',
	},
	'routes.searchContactsGetAutocomplete.run': {
		riskLevel: 'read',
		description:
			'Search Contacts: GET /api/v2/contacts/autocomplete (Freshdesk API v2).',
	},
	'routes.filterContactsGetContacts.run': {
		riskLevel: 'read',
		description:
			'Filter ContactsBETA: GET /api/v2/search/contacts (Freshdesk API v2).',
	},
	'routes.updateContactPut.run': {
		riskLevel: 'write',
		description:
			'Update a Contact: PUT /api/v2/contacts/[id] (Freshdesk API v2).',
	},
	'routes.deleteContactDelete.run': {
		riskLevel: 'destructive',
		description:
			'Soft Delete a Contact: DELETE /api/v2/contacts/[id] (Freshdesk API v2).',
	},
	'routes.hardDeleteContactDeleteHardDelete.run': {
		riskLevel: 'destructive',
		description:
			'Permanently Delete a Contact: DELETE /api/v2/contacts/[id]/hard_delete (Freshdesk API v2).',
	},
	'routes.makeAgentPutMakeAgent.run': {
		riskLevel: 'write',
		description:
			'Make Agent: PUT /api/v2/contacts/[id]/make_agent (Freshdesk API v2).',
	},
	'routes.restoreContactPutRestore.run': {
		riskLevel: 'write',
		description:
			'Restore a Contact: PUT /api/v2/contacts/[id]/restore (Freshdesk API v2).',
	},
	'routes.sendInvitePutSendInvite.run': {
		riskLevel: 'write',
		description:
			'Send Invite to a Contact: PUT /api/v2/contacts/[id]/send_invite (Freshdesk API v2).',
	},
	'routes.mergeContactPostMerge.run': {
		riskLevel: 'write',
		description:
			'Merge Contacts: POST /api/v2/contacts/merge (Freshdesk API v2).',
	},
	'routes.exportContactPostExport.run': {
		riskLevel: 'write',
		description:
			'Contact Export: POST /api/v2/contacts/export (Freshdesk API v2).',
	},
	'routes.exportContactGet.run': {
		riskLevel: 'read',
		description:
			'Contact Export: GET /api/v2/contacts/export/[id] (Freshdesk API v2).',
	},
	'routes.importContactGetImports.run': {
		riskLevel: 'read',
		description:
			'Contact Import: GET /api/v2/contacts/imports (Freshdesk API v2).',
	},
	'routes.importContactGet.run': {
		riskLevel: 'read',
		description:
			'Contact Import: GET /api/v2/contacts/imports/[id] (Freshdesk API v2).',
	},
	'routes.importContactPostImports.run': {
		riskLevel: 'write',
		description:
			'Contact Import: POST /api/v2/contacts/imports (Freshdesk API v2).',
	},
	'routes.importContactPutCancel.run': {
		riskLevel: 'write',
		description:
			'Contact Import: PUT /api/v2/contacts/imports/[id]/cancel (Freshdesk API v2).',
	},
	'routes.listAllContactFieldsGetContactFields.run': {
		riskLevel: 'read',
		description:
			'List all contact fields: GET /api/v2/contact_fields (Freshdesk API v2).',
	},
	'routes.viewContactFieldGet.run': {
		riskLevel: 'read',
		description:
			'View a contact field: GET /api/v2/contact_fields/[id] (Freshdesk API v2).',
	},
	'routes.createContactFieldPostContactFields.run': {
		riskLevel: 'write',
		description:
			'Create a contact field: POST /api/v2/contact_fields (Freshdesk API v2).',
	},
	'routes.updateContactFieldPut.run': {
		riskLevel: 'write',
		description:
			'Update a contact field: PUT /api/v2/contact_fields/[id] (Freshdesk API v2).',
	},
	'routes.deleteContactFieldDelete.run': {
		riskLevel: 'destructive',
		description:
			'Delete a contact field: DELETE /api/v2/contact_fields/[id] (Freshdesk API v2).',
	},
	'routes.viewAgentGet.run': {
		riskLevel: 'read',
		description: 'View an Agent: GET /api/v2/agents/[id] (Freshdesk API v2).',
	},
	'routes.listAllAgentsGetAgents.run': {
		riskLevel: 'read',
		description: 'List All Agents: GET /api/v2/agents (Freshdesk API v2).',
	},
	'routes.createAgentPostOperation.run': {
		riskLevel: 'write',
		description: 'Create an Agent: POST /api/v2/agents/ (Freshdesk API v2).',
	},
	'routes.updateAgentPut.run': {
		riskLevel: 'write',
		description: 'Update an Agent: PUT /api/v2/agents/[id] (Freshdesk API v2).',
	},
	'routes.deleteAgentDelete.run': {
		riskLevel: 'destructive',
		description:
			'Delete an Agent: DELETE /api/v2/agents/[id] (Freshdesk API v2).',
	},
	'routes.meGetMe.run': {
		riskLevel: 'read',
		description:
			'Currently Authenticated Agent: GET /api/v2/agents/me (Freshdesk API v2).',
	},
	'routes.createMultipleAgentsPostBulk.run': {
		riskLevel: 'write',
		description:
			'Create Multiple Agents: POST /api/v2/agents/bulk (Freshdesk API v2).',
	},
	'routes.searchAgentsGetAutocomplete.run': {
		riskLevel: 'read',
		description:
			'Search Agents: GET /api/v2/agents/autocomplete (Freshdesk API v2).',
	},
	'routes.listAllAgentsAvailabilityGetAgents.run': {
		riskLevel: 'read',
		description:
			'List All Agents Availability: GET /api/v2/agents (Freshdesk API v2).',
	},
	'routes.viewAgentAvailabilityGetAvailability.run': {
		riskLevel: 'read',
		description:
			'View Agent Availability: GET /api/v2/agents/[id]/availability (Freshdesk API v2).',
	},
	'routes.updateAgentAvailabilityPutAvailability.run': {
		riskLevel: 'write',
		description:
			'Update Agent load settings: PUT /api/v2/agents/[id]/availability (Freshdesk API v2).',
	},
	'routes.viewSkillGet.run': {
		riskLevel: 'read',
		description:
			'View a Skill: GET /api/v2/admin/skills/[id] (Freshdesk API v2).',
	},
	'routes.listAllSkillsGetOperation.run': {
		riskLevel: 'read',
		description:
			'List all Skills: GET /api/v2/admin/skills/ (Freshdesk API v2).',
	},
	'routes.createSkillPostSkills.run': {
		riskLevel: 'write',
		description:
			'Create a Skill: POST /api/v2/admin/skills (Freshdesk API v2).',
	},
	'routes.deleteSkillDelete.run': {
		riskLevel: 'destructive',
		description:
			'Delete a Skill: DELETE /api/v2/admin/skills/[id] (Freshdesk API v2).',
	},
	'routes.updateSkillPut.run': {
		riskLevel: 'write',
		description:
			'Update a Skill: PUT /api/v2/admin/skills/[id] (Freshdesk API v2).',
	},
	'routes.viewRoleGet.run': {
		riskLevel: 'read',
		description: 'View a Role: GET /api/v2/roles/[id] (Freshdesk API v2).',
	},
	'routes.listAllRolesGetRoles.run': {
		riskLevel: 'read',
		description: 'List All Roles: GET /api/v2/roles (Freshdesk API v2).',
	},
	'routes.createGroupPostGroups.run': {
		riskLevel: 'write',
		description: 'Create a Group: POST /api/v2/groups (Freshdesk API v2).',
	},
	'routes.viewGroupGet.run': {
		riskLevel: 'read',
		description: 'View a Group: GET /api/v2/groups/[id] (Freshdesk API v2).',
	},
	'routes.listAllGroupsGetGroups.run': {
		riskLevel: 'read',
		description: 'List All Groups: GET /api/v2/groups (Freshdesk API v2).',
	},
	'routes.updateGroupPut.run': {
		riskLevel: 'write',
		description: 'Update a Group: PUT /api/v2/groups/[id] (Freshdesk API v2).',
	},
	'routes.deleteGroupDelete.run': {
		riskLevel: 'destructive',
		description:
			'Delete a Group: DELETE /api/v2/groups/[id] (Freshdesk API v2).',
	},
	'routes.createAdminGroupPostGroups.run': {
		riskLevel: 'write',
		description:
			'Create a Group: POST /api/v2/admin/groups (Freshdesk API v2).',
	},
	'routes.viewAdminGroupGet.run': {
		riskLevel: 'read',
		description:
			'View a Group: GET /api/v2/admin/groups/[id] (Freshdesk API v2).',
	},
	'routes.listAllAdminGroupsGetGroups.run': {
		riskLevel: 'read',
		description:
			'List All Groups: GET /api/v2/admin/groups (Freshdesk API v2).',
	},
	'routes.updateAdminGroupPut.run': {
		riskLevel: 'write',
		description:
			'Update a Group: PUT /api/v2/admin/groups/[id] (Freshdesk API v2).',
	},
	'routes.deleteAdminGroupDelete.run': {
		riskLevel: 'destructive',
		description:
			'Delete a Group: DELETE /api/v2/admin/groups/[id] (Freshdesk API v2).',
	},
	'routes.listAllAgentsInAGroupGetAgents.run': {
		riskLevel: 'read',
		description:
			'List All Agents in a Group: GET /api/v2/admin/groups/[id]/agents (Freshdesk API v2).',
	},
	'routes.addOrRemoveAgentInAGroupPatchAgents.run': {
		riskLevel: 'write',
		description:
			'Add or Remove Agents in a Group: PATCH /api/v2/admin/groups/[id]/agents (Freshdesk API v2).',
	},
	'routes.createCompanyPostCompanies.run': {
		riskLevel: 'write',
		description: 'Create a Company: POST /api/v2/companies (Freshdesk API v2).',
	},
	'routes.viewCompanyGet.run': {
		riskLevel: 'read',
		description:
			'View a Company: GET /api/v2/companies/[id] (Freshdesk API v2).',
	},
	'routes.listAllCompaniesGetCompanies.run': {
		riskLevel: 'read',
		description:
			'List All Companies: GET /api/v2/companies (Freshdesk API v2).',
	},
	'routes.searchCompaniesGetAutocomplete.run': {
		riskLevel: 'read',
		description:
			'Search Companies: GET /api/v2/companies/autocomplete (Freshdesk API v2).',
	},
	'routes.filterCompaniesGetCompanies.run': {
		riskLevel: 'read',
		description:
			'Filter CompaniesBETA: GET /api/v2/search/companies (Freshdesk API v2).',
	},
	'routes.updateCompanyPut.run': {
		riskLevel: 'write',
		description:
			'Update a Company: PUT /api/v2/companies/[id] (Freshdesk API v2).',
	},
	'routes.deleteCompanyDelete.run': {
		riskLevel: 'destructive',
		description:
			'Delete a Company: DELETE /api/v2/companies/[id] (Freshdesk API v2).',
	},
	'routes.exportCompanyPostExport.run': {
		riskLevel: 'write',
		description:
			'Company Export: POST /api/v2/companies/export (Freshdesk API v2).',
	},
	'routes.exportCompanyGet.run': {
		riskLevel: 'read',
		description:
			'Company Export: GET /api/v2/companies/export/[id] (Freshdesk API v2).',
	},
	'routes.importCompanyGetImports.run': {
		riskLevel: 'read',
		description:
			'Company Import: GET /api/v2/companies/imports (Freshdesk API v2).',
	},
	'routes.importCompanyGet.run': {
		riskLevel: 'read',
		description:
			'Company Import: GET /api/v2/companies/imports/[id] (Freshdesk API v2).',
	},
	'routes.importCompanyPostImports.run': {
		riskLevel: 'write',
		description:
			'Company Import: POST /api/v2/companies/imports (Freshdesk API v2).',
	},
	'routes.importCompanyPutCancel.run': {
		riskLevel: 'write',
		description:
			'Company Import: PUT /api/v2/companies/imports/[id]/cancel (Freshdesk API v2).',
	},
	'routes.listAllCompanyFieldsGetCompanyFields.run': {
		riskLevel: 'read',
		description:
			'List all company fields: GET /api/v2/company_fields (Freshdesk API v2).',
	},
	'routes.viewCompanyFieldGet.run': {
		riskLevel: 'read',
		description:
			'View a company field: GET /api/v2/company_fields/[id] (Freshdesk API v2).',
	},
	'routes.createCompanyFieldPostCompanyFields.run': {
		riskLevel: 'write',
		description:
			'Create a company field: POST /api/v2/company_fields (Freshdesk API v2).',
	},
	'routes.updateCompanyFieldPut.run': {
		riskLevel: 'write',
		description:
			'Update a company field: PUT /api/v2/company_fields/[id] (Freshdesk API v2).',
	},
	'routes.deleteCompanyFieldDelete.run': {
		riskLevel: 'destructive',
		description:
			'Delete a company field: DELETE /api/v2/company_fields/[id] (Freshdesk API v2).',
	},
	'routes.retrieveExistingCustomObjectsGetSchemas.run': {
		riskLevel: 'read',
		description:
			'Retrieve Existing Custom Objects: GET /api/v2/custom_objects/schemas (Freshdesk API v2).',
	},
	'routes.retrieveSpecificCustomObjectGetSchemaId.run': {
		riskLevel: 'read',
		description:
			'Retrieve A Specific Custom Object: GET /api/v2/custom_objects/schemas/[schema_id] (Freshdesk API v2).',
	},
	'routes.createANewCustomObjectRecordPostOperation.run': {
		riskLevel: 'write',
		description:
			'Create A Record: POST /api/v2/custom_objects/schemas/[schema_id]/records/ (Freshdesk API v2).',
	},
	'routes.retrieveACustomObjectRecordGetRecordId.run': {
		riskLevel: 'read',
		description:
			'Retrieve A Record: GET /api/v2/custom_objects/schemas/[schema_id]/records/[record_id] (Freshdesk API v2).',
	},
	'routes.updateACustomObjectRecordPutRecordId.run': {
		riskLevel: 'write',
		description:
			'Update A Record: PUT /api/v2/custom_objects/schemas/[schema_id]/records/[record_id] (Freshdesk API v2).',
	},
	'routes.deleteACustomObjectRecordDeleteRecordId.run': {
		riskLevel: 'destructive',
		description:
			'Delete A Record: DELETE /api/v2/custom_objects/schemas/[schema_id]/records/[record_id] (Freshdesk API v2).',
	},
	'routes.retrieveAllTheRecordsOfACustomObjectGetRecords.run': {
		riskLevel: 'read',
		description:
			'Retrieve All Records: GET /api/v2/custom_objects/schemas/[schema_id]/records (Freshdesk API v2).',
	},
	'routes.retrieveTheCountOfRecordsCustomObjectsGetCount.run': {
		riskLevel: 'read',
		description:
			'Retrieve The Count Of Records: GET /api/v2/custom_objects/schemas/[schema_id]/records/count (Freshdesk API v2).',
	},
	'routes.createCannedResponsePostCannedResponses.run': {
		riskLevel: 'write',
		description:
			'Create a canned response: POST /api/v2/canned_responses (Freshdesk API v2).',
	},
	'routes.viewCannedResponseGet.run': {
		riskLevel: 'read',
		description:
			'View a Canned Response: GET /api/v2/canned_responses/[id] (Freshdesk API v2).',
	},
	'routes.updateCannedResponsePut.run': {
		riskLevel: 'write',
		description:
			'Update a canned response: PUT /api/v2/canned_responses/[id] (Freshdesk API v2).',
	},
	'routes.bulkCreateCannedResponsesPostBulk.run': {
		riskLevel: 'write',
		description:
			'Bulk Create Canned Responses: POST /api/v2/canned_responses/bulk (Freshdesk API v2).',
	},
	'routes.createCannedResponseFolderPostCannedResponseFolders.run': {
		riskLevel: 'write',
		description:
			'Create Folder: POST /api/v2/canned_response_folders (Freshdesk API v2).',
	},
	'routes.updateCannedResponseFolderPut.run': {
		riskLevel: 'write',
		description:
			'Update Folder: PUT /api/v2/canned_response_folders/[id] (Freshdesk API v2).',
	},
	'routes.listAllCannedResponseFoldersGetCannedResponseFolders.run': {
		riskLevel: 'read',
		description:
			'List All Folders: GET /api/v2/canned_response_folders (Freshdesk API v2).',
	},
	'routes.viewCannedResponseFoldersGet.run': {
		riskLevel: 'read',
		description:
			'List All Canned Responses in a Folder: GET /api/v2/canned_response_folders/[id] (Freshdesk API v2).',
	},
	'routes.getDetailsOfCannedResponsesInFoldersGetResponses.run': {
		riskLevel: 'read',
		description:
			'Get details of Canned Responses in a Folder: GET /api/v2/canned_response_folders/[id]/responses (Freshdesk API v2).',
	},
	'routes.categoryAttributesPostCategories.run': {
		riskLevel: 'write',
		description:
			'Categories: POST /api/v2/discussions/categories (Freshdesk API v2).',
	},
	'routes.categoryAttributesGet.run': {
		riskLevel: 'read',
		description:
			'Categories: GET /api/v2/discussions/categories/[id] (Freshdesk API v2).',
	},
	'routes.categoryAttributesGetCategories.run': {
		riskLevel: 'read',
		description:
			'Categories: GET /api/v2/discussions/categories (Freshdesk API v2).',
	},
	'routes.categoryAttributesGetForums.run': {
		riskLevel: 'read',
		description:
			'Categories: GET /api/v2/discussions/categories/[id]/forums (Freshdesk API v2).',
	},
	'routes.categoryAttributesPut.run': {
		riskLevel: 'write',
		description:
			'Categories: PUT /api/v2/discussions/categories/[id] (Freshdesk API v2).',
	},
	'routes.categoryAttributesDelete.run': {
		riskLevel: 'destructive',
		description:
			'Categories: DELETE /api/v2/discussions/categories/[id] (Freshdesk API v2).',
	},
	'routes.forumAttributesPostForums.run': {
		riskLevel: 'write',
		description:
			'Forums: POST /api/v2/discussions/categories/[category_id]/forums (Freshdesk API v2).',
	},
	'routes.forumAttributesGet.run': {
		riskLevel: 'read',
		description:
			'Forums: GET /api/v2/discussions/forums/[id] (Freshdesk API v2).',
	},
	'routes.forumAttributesGetTopics.run': {
		riskLevel: 'read',
		description:
			'Forums: GET /api/v2/discussions/forums/[id]/topics (Freshdesk API v2).',
	},
	'routes.forumAttributesPut.run': {
		riskLevel: 'write',
		description:
			'Forums: PUT /api/v2/discussions/forums/[id] (Freshdesk API v2).',
	},
	'routes.forumAttributesDelete.run': {
		riskLevel: 'destructive',
		description:
			'Forums: DELETE /api/v2/discussions/forums/[id] (Freshdesk API v2).',
	},
	'routes.forumAttributesPostFollow.run': {
		riskLevel: 'write',
		description:
			'Forums: POST /api/v2/discussions/forums/[id]/follow (Freshdesk API v2).',
	},
	'routes.forumAttributesDeleteFollow.run': {
		riskLevel: 'destructive',
		description:
			'Forums: DELETE /api/v2/discussions/forums/[forum_id]/follow (Freshdesk API v2).',
	},
	'routes.forumAttributesGetFollow.run': {
		riskLevel: 'read',
		description:
			'Forums: GET /api/v2/discussions/forums/[id]/follow (Freshdesk API v2).',
	},
	'routes.topicAttributesPostTopics.run': {
		riskLevel: 'write',
		description:
			'Topics: POST /api/v2/discussions/forums/[forum_id]/topics (Freshdesk API v2).',
	},
	'routes.topicAttributesGet.run': {
		riskLevel: 'read',
		description:
			'Topics: GET /api/v2/discussions/topics/[id] (Freshdesk API v2).',
	},
	'routes.topicAttributesGetComments.run': {
		riskLevel: 'read',
		description:
			'Topics: GET /api/v2/discussions/topics/[id]/comments (Freshdesk API v2).',
	},
	'routes.topicAttributesPut.run': {
		riskLevel: 'write',
		description:
			'Topics: PUT /api/v2/discussions/topics/[id] (Freshdesk API v2).',
	},
	'routes.topicAttributesDelete.run': {
		riskLevel: 'destructive',
		description:
			'Topics: DELETE /api/v2/discussions/topics/[id] (Freshdesk API v2).',
	},
	'routes.topicAttributesPostFollow.run': {
		riskLevel: 'write',
		description:
			'Topics: POST /api/v2/discussions/topics/[id]/follow (Freshdesk API v2).',
	},
	'routes.topicAttributesDeleteFollow.run': {
		riskLevel: 'destructive',
		description:
			'Topics: DELETE /api/v2/discussions/topics/[topic_id]/follow (Freshdesk API v2).',
	},
	'routes.topicAttributesGetFollow.run': {
		riskLevel: 'read',
		description:
			'Topics: GET /api/v2/discussions/topics/[id]/follow (Freshdesk API v2).',
	},
	'routes.topicAttributesGetFollowedBy.run': {
		riskLevel: 'read',
		description:
			'Topics: GET /api/v2/discussions/topics/followed_by (Freshdesk API v2).',
	},
	'routes.topicAttributesGetParticipatedBy.run': {
		riskLevel: 'read',
		description:
			'Topics: GET /api/v2/discussions/topics/participated_by (Freshdesk API v2).',
	},
	'routes.commentAttributesPostComments.run': {
		riskLevel: 'write',
		description:
			'Comments: POST /api/v2/discussions/topics/[topic_id]/comments (Freshdesk API v2).',
	},
	'routes.commentAttributesPut.run': {
		riskLevel: 'write',
		description:
			'Comments: PUT /api/v2/discussions/comments/[id] (Freshdesk API v2).',
	},
	'routes.commentAttributesDelete.run': {
		riskLevel: 'destructive',
		description:
			'Comments: DELETE /api/v2/discussions/comments/[id] (Freshdesk API v2).',
	},
	'routes.solutionCategoryAttributesPostCategories.run': {
		riskLevel: 'write',
		description:
			'Categories: POST /api/v2/solutions/categories (Freshdesk API v2).',
	},
	'routes.solutionCategoryAttributesPostLanguageCode.run': {
		riskLevel: 'write',
		description:
			'Categories: POST /api/v2/solutions/categories/[id]/[language_code] (Freshdesk API v2).',
	},
	'routes.solutionCategoryAttributesPut.run': {
		riskLevel: 'write',
		description:
			'Categories: PUT /api/v2/solutions/categories/[id] (Freshdesk API v2).',
	},
	'routes.solutionCategoryAttributesPutLanguageCode.run': {
		riskLevel: 'write',
		description:
			'Categories: PUT /api/v2/solutions/categories/[id]/[language_code] (Freshdesk API v2).',
	},
	'routes.solutionCategoryAttributesGet.run': {
		riskLevel: 'read',
		description:
			'Categories: GET /api/v2/solutions/categories/[id] (Freshdesk API v2).',
	},
	'routes.solutionCategoryAttributesGetLanguageCode.run': {
		riskLevel: 'read',
		description:
			'Categories: GET /api/v2/solutions/categories/[id]/[language_code] (Freshdesk API v2).',
	},
	'routes.solutionCategoryAttributesGetCategories.run': {
		riskLevel: 'read',
		description:
			'Categories: GET /api/v2/solutions/categories (Freshdesk API v2).',
	},
	'routes.solutionCategoryAttributesGetLanguageCode186.run': {
		riskLevel: 'read',
		description:
			'Categories: GET /api/v2/solutions/categories/[language_code] (Freshdesk API v2).',
	},
	'routes.solutionCategoryAttributesDelete.run': {
		riskLevel: 'destructive',
		description:
			'Categories: DELETE /api/v2/solutions/categories/[id] (Freshdesk API v2).',
	},
	'routes.solutionFolderAttributesPostFolders.run': {
		riskLevel: 'write',
		description:
			'Folders: POST /api/v2/solutions/categories/[id]/folders (Freshdesk API v2).',
	},
	'routes.solutionFolderAttributesPostLanguageCode.run': {
		riskLevel: 'write',
		description:
			'Folders: POST /api/v2/solutions/folders/[id]/[language_code] (Freshdesk API v2).',
	},
	'routes.solutionFolderAttributesPut.run': {
		riskLevel: 'write',
		description:
			'Folders: PUT /api/v2/solutions/folders/[id] (Freshdesk API v2).',
	},
	'routes.solutionFolderAttributesPutLanguageCode.run': {
		riskLevel: 'write',
		description:
			'Folders: PUT /api/v2/solutions/folders/[id]/[language_code] (Freshdesk API v2).',
	},
	'routes.solutionFolderAttributesGet.run': {
		riskLevel: 'read',
		description:
			'Folders: GET /api/v2/solutions/folders/[id] (Freshdesk API v2).',
	},
	'routes.solutionFolderAttributesGetLanguageCode.run': {
		riskLevel: 'read',
		description:
			'Folders: GET /api/v2/solutions/folders/[id]/[language_code] (Freshdesk API v2).',
	},
	'routes.solutionFolderAttributesGetFolders.run': {
		riskLevel: 'read',
		description:
			'Folders: GET /api/v2/solutions/categories/[category_id]/folders (Freshdesk API v2).',
	},
	'routes.solutionFolderAttributesGetLanguageCode195.run': {
		riskLevel: 'read',
		description:
			'Folders: GET /api/v2/solutions/categories/[category_id]/folders/[language_code] (Freshdesk API v2).',
	},
	'routes.solutionFolderAttributesGetSubfolders.run': {
		riskLevel: 'read',
		description:
			'Folders: GET /api/v2/solutions/folders/[folder_id]/subfolders (Freshdesk API v2).',
	},
	'routes.solutionFolderAttributesGetLanguageCode197.run': {
		riskLevel: 'read',
		description:
			'Folders: GET /api/v2/solutions/folders/[folder_id]/subfolders/[language_code] (Freshdesk API v2).',
	},
	'routes.solutionFolderAttributesDelete.run': {
		riskLevel: 'destructive',
		description:
			'Folders: DELETE /api/v2/solutions/folders/[id] (Freshdesk API v2).',
	},
	'routes.solutionArticleAttributesPostArticles.run': {
		riskLevel: 'write',
		description:
			'Articles: POST /api/v2/solutions/folders/[id]/articles (Freshdesk API v2).',
	},
	'routes.solutionArticleAttributesPostLanguageCode.run': {
		riskLevel: 'write',
		description:
			'Articles: POST /api/v2/solutions/articles/[id]/[language_code] (Freshdesk API v2).',
	},
	'routes.solutionArticleAttributesPut.run': {
		riskLevel: 'write',
		description:
			'Articles: PUT /api/v2/solutions/articles/[id] (Freshdesk API v2).',
	},
	'routes.solutionArticleAttributesPutLanguageCode.run': {
		riskLevel: 'write',
		description:
			'Articles: PUT /api/v2/solutions/articles/[id]/[language_code] (Freshdesk API v2).',
	},
	'routes.solutionArticleAttributesGet.run': {
		riskLevel: 'read',
		description:
			'Articles: GET /api/v2/solutions/articles/[id] (Freshdesk API v2).',
	},
	'routes.solutionArticleAttributesGetLanguageCode.run': {
		riskLevel: 'read',
		description:
			'Articles: GET /api/v2/solutions/articles/[id]/[language_code] (Freshdesk API v2).',
	},
	'routes.solutionArticleAttributesGetArticles.run': {
		riskLevel: 'read',
		description:
			'Articles: GET /api/v2/solutions/folders/[id]/articles (Freshdesk API v2).',
	},
	'routes.solutionArticleAttributesGetLanguageCode206.run': {
		riskLevel: 'read',
		description:
			'Articles: GET /api/v2/solutions/folders/[id]/articles/[language_code] (Freshdesk API v2).',
	},
	'routes.solutionArticleAttributesDelete.run': {
		riskLevel: 'destructive',
		description:
			'Articles: DELETE /api/v2/solutions/articles/[id] (Freshdesk API v2).',
	},
	'routes.solutionArticleAttributesGetSolutions.run': {
		riskLevel: 'read',
		description: 'Articles: GET /api/v2/search/solutions (Freshdesk API v2).',
	},
	'routes.csatSurveysGetSurveys.run': {
		riskLevel: 'read',
		description:
			'Surveys: GET /api/v2/customer-satisfaction/surveys (Freshdesk API v2).',
	},
	'routes.createSurveyResponsesPostResponses.run': {
		riskLevel: 'write',
		description:
			'Create a Survey Response: POST /api/v2/customer-satisfaction/surveys/[survey_id]/responses (Freshdesk API v2).',
	},
	'routes.viewSurveyResponsesGetResponses.run': {
		riskLevel: 'read',
		description:
			'View all Survey Responses: GET /api/v2/customer-satisfaction/surveys/[survey_id]/responses (Freshdesk API v2).',
	},
	'routes.listAllSurveyGetSurveys.run': {
		riskLevel: 'read',
		description: 'List all Surveys: GET /api/v2/surveys (Freshdesk API v2).',
	},
	'routes.createSatisfactionRatingPostSatisfactionRatings.run': {
		riskLevel: 'write',
		description:
			'Create a Satisfaction Rating: POST /api/v2/tickets/[ticket_id]/satisfaction_ratings (Freshdesk API v2).',
	},
	'routes.viewAllSatisfactionRatingsGetSatisfactionRatings.run': {
		riskLevel: 'read',
		description:
			'View all Satisfaction Ratings: GET /api/v2/surveys/satisfaction_ratings (Freshdesk API v2).',
	},
	'routes.createTimeEntryPostTimeEntries.run': {
		riskLevel: 'write',
		description:
			'Create a Time Entry: POST /api/v2/tickets/[ticket_id]/time_entries (Freshdesk API v2).',
	},
	'routes.listAllTimeEntriesGetTimeEntries.run': {
		riskLevel: 'read',
		description:
			'List All Time Entries: GET /api/v2/time_entries (Freshdesk API v2).',
	},
	'routes.updateTimeEntryPut.run': {
		riskLevel: 'write',
		description:
			'Update a Time Entry: PUT /api/v2/time_entries/[id] (Freshdesk API v2).',
	},
	'routes.toggleTimeEntryPutToggleTimer.run': {
		riskLevel: 'write',
		description:
			'Start/Stop Timer: PUT /api/v2/time_entries/[time_entry_id]/toggle_timer (Freshdesk API v2).',
	},
	'routes.deleteTimeEntryDelete.run': {
		riskLevel: 'destructive',
		description:
			'Delete a Time Entry: DELETE /api/v2/time_entries/[id] (Freshdesk API v2).',
	},
	'routes.viewEmailConfigGet.run': {
		riskLevel: 'read',
		description:
			'View an Email Config: GET /api/v2/email_configs/[id] (Freshdesk API v2).',
	},
	'routes.listAllEmailConfigsGetEmailConfigs.run': {
		riskLevel: 'read',
		description:
			'List All Email Configs: GET /api/v2/email_configs (Freshdesk API v2).',
	},
	'routes.createEmailMailboxPostMailboxes.run': {
		riskLevel: 'write',
		description:
			'Create an Email Mailbox: POST /api/v2/email/mailboxes (Freshdesk API v2).',
	},
	'routes.viewEmailMailboxGet.run': {
		riskLevel: 'read',
		description:
			'View an Email Mailbox: GET /api/v2/email/mailboxes/[id] (Freshdesk API v2).',
	},
	'routes.listAllEmailMailboxesGetMailboxes.run': {
		riskLevel: 'read',
		description:
			'List All Email Mailboxes: GET /api/v2/email/mailboxes (Freshdesk API v2).',
	},
	'routes.updateEmailMailboxPut.run': {
		riskLevel: 'write',
		description:
			'Update an Email Mailbox: PUT /api/v2/email/mailboxes/[id] (Freshdesk API v2).',
	},
	'routes.deleteEmailMailboxDelete.run': {
		riskLevel: 'destructive',
		description:
			'Delete an Email Mailbox: DELETE /api/v2/email/mailboxes/[id] (Freshdesk API v2).',
	},
	'routes.updateMailboxSettingsPutSettings.run': {
		riskLevel: 'write',
		description:
			'Update Mailbox Settings: PUT /api/v2/email/settings (Freshdesk API v2).',
	},
	'routes.viewMailboxSettingsGetSettings.run': {
		riskLevel: 'read',
		description:
			'View Mailbox Settings: GET /api/v2/email/settings (Freshdesk API v2).',
	},
	'routes.updateAutomaticBccEmailsPutBcc.run': {
		riskLevel: 'write',
		description:
			'Update Automatic Bcc emails: PUT /api/v2/notifications/email/bcc (Freshdesk API v2).',
	},
	'routes.viewAutomaticBccEmailsGetBcc.run': {
		riskLevel: 'read',
		description:
			'View Automatic Bcc emails: GET /api/v2/notifications/email/bcc (Freshdesk API v2).',
	},
	'routes.viewProductGet.run': {
		riskLevel: 'read',
		description:
			'View a Product: GET /api/v2/products/[id] (Freshdesk API v2).',
	},
	'routes.listAllProductsGetProducts.run': {
		riskLevel: 'read',
		description: 'List All Products: GET /api/v2/products (Freshdesk API v2).',
	},
	'routes.viewBusinessHourGet.run': {
		riskLevel: 'read',
		description:
			'View a Business Hour: GET /api/v2/business_hours/[id] (Freshdesk API v2).',
	},
	'routes.listAllBusinessHoursGetBusinessHours.run': {
		riskLevel: 'read',
		description:
			'List All Business Hours: GET /api/v2/business_hours (Freshdesk API v2).',
	},
	'routes.listAllScenarioAutomationsGetScenarioAutomations.run': {
		riskLevel: 'read',
		description:
			'List All Scenario Automations: GET /api/v2/scenario_automations (Freshdesk API v2).',
	},
	'routes.createSlaPolicyPostSlaPolicies.run': {
		riskLevel: 'write',
		description:
			'Create SLA Policies: POST /api/v2/sla_policies (Freshdesk API v2).',
	},
	'routes.listAllSlaPoliciesGetSlaPolicies.run': {
		riskLevel: 'read',
		description:
			'List All SLA Policies: GET /api/v2/sla_policies (Freshdesk API v2).',
	},
	'routes.updateSlaPolicyPut.run': {
		riskLevel: 'write',
		description:
			'Update an SLA Policy: PUT /api/v2/sla_policies/[id] (Freshdesk API v2).',
	},
	'routes.publishOmnichannelActivityPostContactActivities.run': {
		riskLevel: 'write',
		description:
			'Publish Activities: POST /api/v2/contact-activities (Freshdesk API v2).',
	},
	'routes.listAllAutomationRulesGetRules.run': {
		riskLevel: 'read',
		description:
			'List All Automation Rules: GET /api/v2/automations/[automation_type_id]/rules (Freshdesk API v2).',
	},
	'routes.viewAnAutomationRuleGet.run': {
		riskLevel: 'read',
		description:
			'View an Automation Rule: GET /api/v2/automations/[automation_type_id]/rules/[id] (Freshdesk API v2).',
	},
	'routes.deleteAnAutomationRuleDelete.run': {
		riskLevel: 'destructive',
		description:
			'Delete an Automation Rule: DELETE /api/v2/automations/[automation_type_id]/rules/[id] (Freshdesk API v2).',
	},
	'routes.createAnAutomationRulePostRules.run': {
		riskLevel: 'write',
		description:
			'Create an Automation Rule: POST /api/v2/automations/[automation_type_id]/rules (Freshdesk API v2).',
	},
	'routes.updateAnAutomationRulePut.run': {
		riskLevel: 'write',
		description:
			'Update an Automation Rule: PUT /api/v2/automations/[automation_type_id]/rules/[id] (Freshdesk API v2).',
	},
	'routes.settingsHelpdeskGetHelpdesk.run': {
		riskLevel: 'read',
		description:
			'View Helpdesk Settings: GET /api/v2/settings/helpdesk (Freshdesk API v2).',
	},
	'routes.createAThreadPostThreads.run': {
		riskLevel: 'write',
		description:
			'Create a thread: POST /api/v2/collaboration/threads (Freshdesk API v2).',
	},
	'routes.getAThreadGet.run': {
		riskLevel: 'read',
		description:
			'Get a thread: GET /api/v2/collaboration/threads/[id] (Freshdesk API v2).',
	},
	'routes.updateAThreadPut.run': {
		riskLevel: 'write',
		description:
			'Update a thread: PUT /api/v2/collaboration/threads/[id] (Freshdesk API v2).',
	},
	'routes.deleteAThreadDelete.run': {
		riskLevel: 'destructive',
		description:
			'Delete a thread: DELETE /api/v2/collaboration/threads/[id] (Freshdesk API v2).',
	},
	'routes.createMessageForThreadPostMessages.run': {
		riskLevel: 'write',
		description:
			'Create message for thread: POST /api/v2/collaboration/messages (Freshdesk API v2).',
	},
	'routes.getMessageForThreadGet.run': {
		riskLevel: 'read',
		description:
			'Get message for thread: GET /api/v2/collaboration/messages/[id] (Freshdesk API v2).',
	},
	'routes.updateMessageForThreadPut.run': {
		riskLevel: 'write',
		description:
			'Update message for thread: PUT /api/v2/collaboration/messages/[id] (Freshdesk API v2).',
	},
	'routes.deleteMessageForThreadDelete.run': {
		riskLevel: 'destructive',
		description:
			'Delete message for thread: DELETE /api/v2/collaboration/messages/[id] (Freshdesk API v2).',
	},
	'routes.getQuotedTextGetGenerateQuote.run': {
		riskLevel: 'read',
		description:
			'Get quoted text for message: GET /api/v2/collaboration/messages/[id]/generate-quote (Freshdesk API v2).',
	},
	'routes.exportAuditLogPostExport.run': {
		riskLevel: 'write',
		description:
			'Export Audit Logs: POST /api/v2/audit_log/export (Freshdesk API v2).',
	},
	'routes.exportAuditLogGet.run': {
		riskLevel: 'read',
		description:
			'Export Audit Logs: GET /api/v2/audit_log/export/[id] (Freshdesk API v2).',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof freshdeskEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

export const freshdeskAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseFreshdeskPlugin<T extends FreshdeskPluginOptions> =
	CorsairPlugin<
		'freshdesk',
		typeof FreshdeskSchema,
		typeof freshdeskEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalFreshdeskPlugin =
	BaseFreshdeskPlugin<FreshdeskPluginOptions>;
export type ExternalFreshdeskPlugin<T extends FreshdeskPluginOptions> =
	BaseFreshdeskPlugin<T>;

export function freshdesk<const T extends FreshdeskPluginOptions>(
	incomingOptions: FreshdeskPluginOptions & T = {} as FreshdeskPluginOptions &
		T,
): ExternalFreshdeskPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'freshdesk',
		authConfig: freshdeskAuthConfig,
		schema: FreshdeskSchema,
		options,
		endpoints: freshdeskEndpointsNested,
		webhooks: {},
		endpointMeta: freshdeskEndpointMeta,
		endpointSchemas: freshdeskEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FreshdeskKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('freshdesk', 'api_key');
			const key = await ctx.keys.get_api_key();
			if (!key) throw new AuthMissingError('freshdesk', 'api_key');
			return key;
		},
	} satisfies InternalFreshdeskPlugin;
}

export { FRESHDESK_OPERATIONS } from './endpoints/operations';
export type {
	FreshdeskEndpointInputs,
	FreshdeskEndpointOutputs,
	FreshdeskRouteInput,
	FreshdeskRouteOutput,
} from './endpoints/types';
