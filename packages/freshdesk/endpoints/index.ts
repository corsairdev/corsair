import type { FreshdeskEndpoints } from '..';
import { invokeFreshdeskOperation } from '../client';
import { FRESHDESK_OPERATIONS } from './operations';

export const Routes = {
	createTicketPostTickets: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createTicketPostTickets,
			)) satisfies FreshdeskEndpoints['routes']['createTicketPostTickets']['run'],
	},
	createOutboundEmailPostOutboundEmail: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createOutboundEmailPostOutboundEmail,
			)) satisfies FreshdeskEndpoints['routes']['createOutboundEmailPostOutboundEmail']['run'],
	},
	viewATicketGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewATicketGet,
			)) satisfies FreshdeskEndpoints['routes']['viewATicketGet']['run'],
	},
	ticketAssociationGetAssociatedTickets: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.ticketAssociationGetAssociatedTickets,
			)) satisfies FreshdeskEndpoints['routes']['ticketAssociationGetAssociatedTickets']['run'],
	},
	ticketAssociationGetPrimeAssociation: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.ticketAssociationGetPrimeAssociation,
			)) satisfies FreshdeskEndpoints['routes']['ticketAssociationGetPrimeAssociation']['run'],
	},
	listAllTicketsGetTickets: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllTicketsGetTickets,
			)) satisfies FreshdeskEndpoints['routes']['listAllTicketsGetTickets']['run'],
	},
	filterTicketsGetTickets: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.filterTicketsGetTickets,
			)) satisfies FreshdeskEndpoints['routes']['filterTicketsGetTickets']['run'],
	},
	updateTicketPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateTicketPut,
			)) satisfies FreshdeskEndpoints['routes']['updateTicketPut']['run'],
	},
	bulkUpdateTicketsPostBulkUpdate: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.bulkUpdateTicketsPostBulkUpdate,
			)) satisfies FreshdeskEndpoints['routes']['bulkUpdateTicketsPostBulkUpdate']['run'],
	},
	forwardTicketsPostForward: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.forwardTicketsPostForward,
			)) satisfies FreshdeskEndpoints['routes']['forwardTicketsPostForward']['run'],
	},
	ticketMergePutMerge: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.ticketMergePutMerge,
			)) satisfies FreshdeskEndpoints['routes']['ticketMergePutMerge']['run'],
	},
	watcherGetWatchers: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.watcherGetWatchers,
			)) satisfies FreshdeskEndpoints['routes']['watcherGetWatchers']['run'],
	},
	watcherPostWatch: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.watcherPostWatch,
			)) satisfies FreshdeskEndpoints['routes']['watcherPostWatch']['run'],
	},
	watcherPutUnwatch: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.watcherPutUnwatch,
			)) satisfies FreshdeskEndpoints['routes']['watcherPutUnwatch']['run'],
	},
	watcherPutBulkWatch: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.watcherPutBulkWatch,
			)) satisfies FreshdeskEndpoints['routes']['watcherPutBulkWatch']['run'],
	},
	watcherPutBulkUnwatch: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.watcherPutBulkUnwatch,
			)) satisfies FreshdeskEndpoints['routes']['watcherPutBulkUnwatch']['run'],
	},
	deleteATicketDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteATicketDelete,
			)) satisfies FreshdeskEndpoints['routes']['deleteATicketDelete']['run'],
	},
	bulkDeleteTicketsPostBulkDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.bulkDeleteTicketsPostBulkDelete,
			)) satisfies FreshdeskEndpoints['routes']['bulkDeleteTicketsPostBulkDelete']['run'],
	},
	deleteAnAttachmentDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteAnAttachmentDelete,
			)) satisfies FreshdeskEndpoints['routes']['deleteAnAttachmentDelete']['run'],
	},
	restoreATicketPutRestore: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.restoreATicketPutRestore,
			)) satisfies FreshdeskEndpoints['routes']['restoreATicketPutRestore']['run'],
	},
	listAllTicketFieldsGetTicketFields: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllTicketFieldsGetTicketFields,
			)) satisfies FreshdeskEndpoints['routes']['listAllTicketFieldsGetTicketFields']['run'],
	},
	listAllTicketNotesGetConversations: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllTicketNotesGetConversations,
			)) satisfies FreshdeskEndpoints['routes']['listAllTicketNotesGetConversations']['run'],
	},
	listAllTicketTimeentriesGetTimeEntries: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllTicketTimeentriesGetTimeEntries,
			)) satisfies FreshdeskEndpoints['routes']['listAllTicketTimeentriesGetTimeEntries']['run'],
	},
	viewTicketSatisfactionRatingsGetSatisfactionRatings: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewTicketSatisfactionRatingsGetSatisfactionRatings,
			)) satisfies FreshdeskEndpoints['routes']['viewTicketSatisfactionRatingsGetSatisfactionRatings']['run'],
	},
	ticketSummaryGetSummary: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.ticketSummaryGetSummary,
			)) satisfies FreshdeskEndpoints['routes']['ticketSummaryGetSummary']['run'],
	},
	ticketSummaryPutSummary: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.ticketSummaryPutSummary,
			)) satisfies FreshdeskEndpoints['routes']['ticketSummaryPutSummary']['run'],
	},
	ticketSummaryDeleteSummary: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.ticketSummaryDeleteSummary,
			)) satisfies FreshdeskEndpoints['routes']['ticketSummaryDeleteSummary']['run'],
	},
	archiveTicketsGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.archiveTicketsGet,
			)) satisfies FreshdeskEndpoints['routes']['archiveTicketsGet']['run'],
	},
	archiveTicketsDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.archiveTicketsDelete,
			)) satisfies FreshdeskEndpoints['routes']['archiveTicketsDelete']['run'],
	},
	archiveTicketsGetConversations: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.archiveTicketsGetConversations,
			)) satisfies FreshdeskEndpoints['routes']['archiveTicketsGetConversations']['run'],
	},
	ticketUserAccessesPostAccesses: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.ticketUserAccessesPostAccesses,
			)) satisfies FreshdeskEndpoints['routes']['ticketUserAccessesPostAccesses']['run'],
	},
	ticketUserAccessesPatchAccesses: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.ticketUserAccessesPatchAccesses,
			)) satisfies FreshdeskEndpoints['routes']['ticketUserAccessesPatchAccesses']['run'],
	},
	ticketUserAccessesGetAccesses: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.ticketUserAccessesGetAccesses,
			)) satisfies FreshdeskEndpoints['routes']['ticketUserAccessesGetAccesses']['run'],
	},
	ticketUserAccessesDeleteAccesses: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.ticketUserAccessesDeleteAccesses,
			)) satisfies FreshdeskEndpoints['routes']['ticketUserAccessesDeleteAccesses']['run'],
	},
	listAllTicketFieldsGetTicketFields35: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllTicketFieldsGetTicketFields35,
			)) satisfies FreshdeskEndpoints['routes']['listAllTicketFieldsGetTicketFields35']['run'],
	},
	createTicketFieldPostTicketFields: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createTicketFieldPostTicketFields,
			)) satisfies FreshdeskEndpoints['routes']['createTicketFieldPostTicketFields']['run'],
	},
	viewTicketFieldGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewTicketFieldGet,
			)) satisfies FreshdeskEndpoints['routes']['viewTicketFieldGet']['run'],
	},
	updateTicketFieldPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateTicketFieldPut,
			)) satisfies FreshdeskEndpoints['routes']['updateTicketFieldPut']['run'],
	},
	deleteTicketFieldDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteTicketFieldDelete,
			)) satisfies FreshdeskEndpoints['routes']['deleteTicketFieldDelete']['run'],
	},
	listAllSectionFieldsGetSections: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllSectionFieldsGetSections,
			)) satisfies FreshdeskEndpoints['routes']['listAllSectionFieldsGetSections']['run'],
	},
	createSectionPostSections: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createSectionPostSections,
			)) satisfies FreshdeskEndpoints['routes']['createSectionPostSections']['run'],
	},
	listSpecificSectionGetSectionId: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listSpecificSectionGetSectionId,
			)) satisfies FreshdeskEndpoints['routes']['listSpecificSectionGetSectionId']['run'],
	},
	updateSectionPutSectionId: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateSectionPutSectionId,
			)) satisfies FreshdeskEndpoints['routes']['updateSectionPutSectionId']['run'],
	},
	deleteSectionDeleteSectionId: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteSectionDeleteSectionId,
			)) satisfies FreshdeskEndpoints['routes']['deleteSectionDeleteSectionId']['run'],
	},
	listAllTicketFormsGetTicketForms: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllTicketFormsGetTicketForms,
			)) satisfies FreshdeskEndpoints['routes']['listAllTicketFormsGetTicketForms']['run'],
	},
	createTicketFormPostTicketForms: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createTicketFormPostTicketForms,
			)) satisfies FreshdeskEndpoints['routes']['createTicketFormPostTicketForms']['run'],
	},
	viewTicketFormGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewTicketFormGet,
			)) satisfies FreshdeskEndpoints['routes']['viewTicketFormGet']['run'],
	},
	updateTicketFormPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateTicketFormPut,
			)) satisfies FreshdeskEndpoints['routes']['updateTicketFormPut']['run'],
	},
	deleteTicketFormDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteTicketFormDelete,
			)) satisfies FreshdeskEndpoints['routes']['deleteTicketFormDelete']['run'],
	},
	cloneTicketFormPostClone: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.cloneTicketFormPostClone,
			)) satisfies FreshdeskEndpoints['routes']['cloneTicketFormPostClone']['run'],
	},
	viewTicketFormFieldGetFieldId: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewTicketFormFieldGetFieldId,
			)) satisfies FreshdeskEndpoints['routes']['viewTicketFormFieldGetFieldId']['run'],
	},
	updateTicketFormFieldPutFieldId: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateTicketFormFieldPutFieldId,
			)) satisfies FreshdeskEndpoints['routes']['updateTicketFormFieldPutFieldId']['run'],
	},
	deleteTicketFormFieldDeleteFieldId: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteTicketFormFieldDeleteFieldId,
			)) satisfies FreshdeskEndpoints['routes']['deleteTicketFormFieldDeleteFieldId']['run'],
	},
	replyTicketPostReply: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.replyTicketPostReply,
			)) satisfies FreshdeskEndpoints['routes']['replyTicketPostReply']['run'],
	},
	addNoteToATicketPostNotes: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.addNoteToATicketPostNotes,
			)) satisfies FreshdeskEndpoints['routes']['addNoteToATicketPostNotes']['run'],
	},
	updateConversationPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateConversationPut,
			)) satisfies FreshdeskEndpoints['routes']['updateConversationPut']['run'],
	},
	deleteConversationDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteConversationDelete,
			)) satisfies FreshdeskEndpoints['routes']['deleteConversationDelete']['run'],
	},
	replyToForwardPostReplyToForward: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.replyToForwardPostReplyToForward,
			)) satisfies FreshdeskEndpoints['routes']['replyToForwardPostReplyToForward']['run'],
	},
	sendOutboundMessagePostOutboundMessages: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.sendOutboundMessagePostOutboundMessages,
			)) satisfies FreshdeskEndpoints['routes']['sendOutboundMessagePostOutboundMessages']['run'],
	},
	retrieveOutboundMessageGetMessageId: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.retrieveOutboundMessageGetMessageId,
			)) satisfies FreshdeskEndpoints['routes']['retrieveOutboundMessageGetMessageId']['run'],
	},
	viewAccountGetAccount: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewAccountGetAccount,
			)) satisfies FreshdeskEndpoints['routes']['viewAccountGetAccount']['run'],
	},
	generateExportPostExport: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.generateExportPostExport,
			)) satisfies FreshdeskEndpoints['routes']['generateExportPostExport']['run'],
	},
	viewJobGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewJobGet,
			)) satisfies FreshdeskEndpoints['routes']['viewJobGet']['run'],
	},
	createContactPostContacts: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createContactPostContacts,
			)) satisfies FreshdeskEndpoints['routes']['createContactPostContacts']['run'],
	},
	viewContactGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewContactGet,
			)) satisfies FreshdeskEndpoints['routes']['viewContactGet']['run'],
	},
	listAllContactsGetContacts: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllContactsGetContacts,
			)) satisfies FreshdeskEndpoints['routes']['listAllContactsGetContacts']['run'],
	},
	searchContactsGetAutocomplete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.searchContactsGetAutocomplete,
			)) satisfies FreshdeskEndpoints['routes']['searchContactsGetAutocomplete']['run'],
	},
	filterContactsGetContacts: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.filterContactsGetContacts,
			)) satisfies FreshdeskEndpoints['routes']['filterContactsGetContacts']['run'],
	},
	updateContactPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateContactPut,
			)) satisfies FreshdeskEndpoints['routes']['updateContactPut']['run'],
	},
	deleteContactDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteContactDelete,
			)) satisfies FreshdeskEndpoints['routes']['deleteContactDelete']['run'],
	},
	hardDeleteContactDeleteHardDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.hardDeleteContactDeleteHardDelete,
			)) satisfies FreshdeskEndpoints['routes']['hardDeleteContactDeleteHardDelete']['run'],
	},
	makeAgentPutMakeAgent: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.makeAgentPutMakeAgent,
			)) satisfies FreshdeskEndpoints['routes']['makeAgentPutMakeAgent']['run'],
	},
	restoreContactPutRestore: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.restoreContactPutRestore,
			)) satisfies FreshdeskEndpoints['routes']['restoreContactPutRestore']['run'],
	},
	sendInvitePutSendInvite: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.sendInvitePutSendInvite,
			)) satisfies FreshdeskEndpoints['routes']['sendInvitePutSendInvite']['run'],
	},
	mergeContactPostMerge: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.mergeContactPostMerge,
			)) satisfies FreshdeskEndpoints['routes']['mergeContactPostMerge']['run'],
	},
	exportContactPostExport: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.exportContactPostExport,
			)) satisfies FreshdeskEndpoints['routes']['exportContactPostExport']['run'],
	},
	exportContactGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.exportContactGet,
			)) satisfies FreshdeskEndpoints['routes']['exportContactGet']['run'],
	},
	importContactGetImports: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.importContactGetImports,
			)) satisfies FreshdeskEndpoints['routes']['importContactGetImports']['run'],
	},
	importContactGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.importContactGet,
			)) satisfies FreshdeskEndpoints['routes']['importContactGet']['run'],
	},
	importContactPostImports: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.importContactPostImports,
			)) satisfies FreshdeskEndpoints['routes']['importContactPostImports']['run'],
	},
	importContactPutCancel: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.importContactPutCancel,
			)) satisfies FreshdeskEndpoints['routes']['importContactPutCancel']['run'],
	},
	listAllContactFieldsGetContactFields: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllContactFieldsGetContactFields,
			)) satisfies FreshdeskEndpoints['routes']['listAllContactFieldsGetContactFields']['run'],
	},
	viewContactFieldGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewContactFieldGet,
			)) satisfies FreshdeskEndpoints['routes']['viewContactFieldGet']['run'],
	},
	createContactFieldPostContactFields: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createContactFieldPostContactFields,
			)) satisfies FreshdeskEndpoints['routes']['createContactFieldPostContactFields']['run'],
	},
	updateContactFieldPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateContactFieldPut,
			)) satisfies FreshdeskEndpoints['routes']['updateContactFieldPut']['run'],
	},
	deleteContactFieldDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteContactFieldDelete,
			)) satisfies FreshdeskEndpoints['routes']['deleteContactFieldDelete']['run'],
	},
	viewAgentGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewAgentGet,
			)) satisfies FreshdeskEndpoints['routes']['viewAgentGet']['run'],
	},
	listAllAgentsGetAgents: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllAgentsGetAgents,
			)) satisfies FreshdeskEndpoints['routes']['listAllAgentsGetAgents']['run'],
	},
	createAgentPostOperation: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createAgentPostOperation,
			)) satisfies FreshdeskEndpoints['routes']['createAgentPostOperation']['run'],
	},
	updateAgentPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateAgentPut,
			)) satisfies FreshdeskEndpoints['routes']['updateAgentPut']['run'],
	},
	deleteAgentDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteAgentDelete,
			)) satisfies FreshdeskEndpoints['routes']['deleteAgentDelete']['run'],
	},
	meGetMe: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.meGetMe,
			)) satisfies FreshdeskEndpoints['routes']['meGetMe']['run'],
	},
	createMultipleAgentsPostBulk: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createMultipleAgentsPostBulk,
			)) satisfies FreshdeskEndpoints['routes']['createMultipleAgentsPostBulk']['run'],
	},
	searchAgentsGetAutocomplete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.searchAgentsGetAutocomplete,
			)) satisfies FreshdeskEndpoints['routes']['searchAgentsGetAutocomplete']['run'],
	},
	listAllAgentsAvailabilityGetAgents: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllAgentsAvailabilityGetAgents,
			)) satisfies FreshdeskEndpoints['routes']['listAllAgentsAvailabilityGetAgents']['run'],
	},
	viewAgentAvailabilityGetAvailability: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewAgentAvailabilityGetAvailability,
			)) satisfies FreshdeskEndpoints['routes']['viewAgentAvailabilityGetAvailability']['run'],
	},
	updateAgentAvailabilityPutAvailability: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateAgentAvailabilityPutAvailability,
			)) satisfies FreshdeskEndpoints['routes']['updateAgentAvailabilityPutAvailability']['run'],
	},
	viewSkillGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewSkillGet,
			)) satisfies FreshdeskEndpoints['routes']['viewSkillGet']['run'],
	},
	listAllSkillsGetOperation: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllSkillsGetOperation,
			)) satisfies FreshdeskEndpoints['routes']['listAllSkillsGetOperation']['run'],
	},
	createSkillPostSkills: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createSkillPostSkills,
			)) satisfies FreshdeskEndpoints['routes']['createSkillPostSkills']['run'],
	},
	deleteSkillDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteSkillDelete,
			)) satisfies FreshdeskEndpoints['routes']['deleteSkillDelete']['run'],
	},
	updateSkillPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateSkillPut,
			)) satisfies FreshdeskEndpoints['routes']['updateSkillPut']['run'],
	},
	viewRoleGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewRoleGet,
			)) satisfies FreshdeskEndpoints['routes']['viewRoleGet']['run'],
	},
	listAllRolesGetRoles: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllRolesGetRoles,
			)) satisfies FreshdeskEndpoints['routes']['listAllRolesGetRoles']['run'],
	},
	createGroupPostGroups: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createGroupPostGroups,
			)) satisfies FreshdeskEndpoints['routes']['createGroupPostGroups']['run'],
	},
	viewGroupGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewGroupGet,
			)) satisfies FreshdeskEndpoints['routes']['viewGroupGet']['run'],
	},
	listAllGroupsGetGroups: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllGroupsGetGroups,
			)) satisfies FreshdeskEndpoints['routes']['listAllGroupsGetGroups']['run'],
	},
	updateGroupPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateGroupPut,
			)) satisfies FreshdeskEndpoints['routes']['updateGroupPut']['run'],
	},
	deleteGroupDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteGroupDelete,
			)) satisfies FreshdeskEndpoints['routes']['deleteGroupDelete']['run'],
	},
	createAdminGroupPostGroups: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createAdminGroupPostGroups,
			)) satisfies FreshdeskEndpoints['routes']['createAdminGroupPostGroups']['run'],
	},
	viewAdminGroupGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewAdminGroupGet,
			)) satisfies FreshdeskEndpoints['routes']['viewAdminGroupGet']['run'],
	},
	listAllAdminGroupsGetGroups: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllAdminGroupsGetGroups,
			)) satisfies FreshdeskEndpoints['routes']['listAllAdminGroupsGetGroups']['run'],
	},
	updateAdminGroupPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateAdminGroupPut,
			)) satisfies FreshdeskEndpoints['routes']['updateAdminGroupPut']['run'],
	},
	deleteAdminGroupDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteAdminGroupDelete,
			)) satisfies FreshdeskEndpoints['routes']['deleteAdminGroupDelete']['run'],
	},
	listAllAgentsInAGroupGetAgents: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllAgentsInAGroupGetAgents,
			)) satisfies FreshdeskEndpoints['routes']['listAllAgentsInAGroupGetAgents']['run'],
	},
	addOrRemoveAgentInAGroupPatchAgents: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.addOrRemoveAgentInAGroupPatchAgents,
			)) satisfies FreshdeskEndpoints['routes']['addOrRemoveAgentInAGroupPatchAgents']['run'],
	},
	createCompanyPostCompanies: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createCompanyPostCompanies,
			)) satisfies FreshdeskEndpoints['routes']['createCompanyPostCompanies']['run'],
	},
	viewCompanyGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewCompanyGet,
			)) satisfies FreshdeskEndpoints['routes']['viewCompanyGet']['run'],
	},
	listAllCompaniesGetCompanies: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllCompaniesGetCompanies,
			)) satisfies FreshdeskEndpoints['routes']['listAllCompaniesGetCompanies']['run'],
	},
	searchCompaniesGetAutocomplete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.searchCompaniesGetAutocomplete,
			)) satisfies FreshdeskEndpoints['routes']['searchCompaniesGetAutocomplete']['run'],
	},
	filterCompaniesGetCompanies: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.filterCompaniesGetCompanies,
			)) satisfies FreshdeskEndpoints['routes']['filterCompaniesGetCompanies']['run'],
	},
	updateCompanyPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateCompanyPut,
			)) satisfies FreshdeskEndpoints['routes']['updateCompanyPut']['run'],
	},
	deleteCompanyDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteCompanyDelete,
			)) satisfies FreshdeskEndpoints['routes']['deleteCompanyDelete']['run'],
	},
	exportCompanyPostExport: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.exportCompanyPostExport,
			)) satisfies FreshdeskEndpoints['routes']['exportCompanyPostExport']['run'],
	},
	exportCompanyGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.exportCompanyGet,
			)) satisfies FreshdeskEndpoints['routes']['exportCompanyGet']['run'],
	},
	importCompanyGetImports: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.importCompanyGetImports,
			)) satisfies FreshdeskEndpoints['routes']['importCompanyGetImports']['run'],
	},
	importCompanyGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.importCompanyGet,
			)) satisfies FreshdeskEndpoints['routes']['importCompanyGet']['run'],
	},
	importCompanyPostImports: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.importCompanyPostImports,
			)) satisfies FreshdeskEndpoints['routes']['importCompanyPostImports']['run'],
	},
	importCompanyPutCancel: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.importCompanyPutCancel,
			)) satisfies FreshdeskEndpoints['routes']['importCompanyPutCancel']['run'],
	},
	listAllCompanyFieldsGetCompanyFields: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllCompanyFieldsGetCompanyFields,
			)) satisfies FreshdeskEndpoints['routes']['listAllCompanyFieldsGetCompanyFields']['run'],
	},
	viewCompanyFieldGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewCompanyFieldGet,
			)) satisfies FreshdeskEndpoints['routes']['viewCompanyFieldGet']['run'],
	},
	createCompanyFieldPostCompanyFields: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createCompanyFieldPostCompanyFields,
			)) satisfies FreshdeskEndpoints['routes']['createCompanyFieldPostCompanyFields']['run'],
	},
	updateCompanyFieldPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateCompanyFieldPut,
			)) satisfies FreshdeskEndpoints['routes']['updateCompanyFieldPut']['run'],
	},
	deleteCompanyFieldDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteCompanyFieldDelete,
			)) satisfies FreshdeskEndpoints['routes']['deleteCompanyFieldDelete']['run'],
	},
	retrieveExistingCustomObjectsGetSchemas: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.retrieveExistingCustomObjectsGetSchemas,
			)) satisfies FreshdeskEndpoints['routes']['retrieveExistingCustomObjectsGetSchemas']['run'],
	},
	retrieveSpecificCustomObjectGetSchemaId: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.retrieveSpecificCustomObjectGetSchemaId,
			)) satisfies FreshdeskEndpoints['routes']['retrieveSpecificCustomObjectGetSchemaId']['run'],
	},
	createANewCustomObjectRecordPostOperation: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createANewCustomObjectRecordPostOperation,
			)) satisfies FreshdeskEndpoints['routes']['createANewCustomObjectRecordPostOperation']['run'],
	},
	retrieveACustomObjectRecordGetRecordId: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.retrieveACustomObjectRecordGetRecordId,
			)) satisfies FreshdeskEndpoints['routes']['retrieveACustomObjectRecordGetRecordId']['run'],
	},
	updateACustomObjectRecordPutRecordId: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateACustomObjectRecordPutRecordId,
			)) satisfies FreshdeskEndpoints['routes']['updateACustomObjectRecordPutRecordId']['run'],
	},
	deleteACustomObjectRecordDeleteRecordId: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteACustomObjectRecordDeleteRecordId,
			)) satisfies FreshdeskEndpoints['routes']['deleteACustomObjectRecordDeleteRecordId']['run'],
	},
	retrieveAllTheRecordsOfACustomObjectGetRecords: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.retrieveAllTheRecordsOfACustomObjectGetRecords,
			)) satisfies FreshdeskEndpoints['routes']['retrieveAllTheRecordsOfACustomObjectGetRecords']['run'],
	},
	retrieveTheCountOfRecordsCustomObjectsGetCount: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.retrieveTheCountOfRecordsCustomObjectsGetCount,
			)) satisfies FreshdeskEndpoints['routes']['retrieveTheCountOfRecordsCustomObjectsGetCount']['run'],
	},
	createCannedResponsePostCannedResponses: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createCannedResponsePostCannedResponses,
			)) satisfies FreshdeskEndpoints['routes']['createCannedResponsePostCannedResponses']['run'],
	},
	viewCannedResponseGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewCannedResponseGet,
			)) satisfies FreshdeskEndpoints['routes']['viewCannedResponseGet']['run'],
	},
	updateCannedResponsePut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateCannedResponsePut,
			)) satisfies FreshdeskEndpoints['routes']['updateCannedResponsePut']['run'],
	},
	bulkCreateCannedResponsesPostBulk: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.bulkCreateCannedResponsesPostBulk,
			)) satisfies FreshdeskEndpoints['routes']['bulkCreateCannedResponsesPostBulk']['run'],
	},
	createCannedResponseFolderPostCannedResponseFolders: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createCannedResponseFolderPostCannedResponseFolders,
			)) satisfies FreshdeskEndpoints['routes']['createCannedResponseFolderPostCannedResponseFolders']['run'],
	},
	updateCannedResponseFolderPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateCannedResponseFolderPut,
			)) satisfies FreshdeskEndpoints['routes']['updateCannedResponseFolderPut']['run'],
	},
	listAllCannedResponseFoldersGetCannedResponseFolders: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllCannedResponseFoldersGetCannedResponseFolders,
			)) satisfies FreshdeskEndpoints['routes']['listAllCannedResponseFoldersGetCannedResponseFolders']['run'],
	},
	viewCannedResponseFoldersGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewCannedResponseFoldersGet,
			)) satisfies FreshdeskEndpoints['routes']['viewCannedResponseFoldersGet']['run'],
	},
	getDetailsOfCannedResponsesInFoldersGetResponses: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.getDetailsOfCannedResponsesInFoldersGetResponses,
			)) satisfies FreshdeskEndpoints['routes']['getDetailsOfCannedResponsesInFoldersGetResponses']['run'],
	},
	categoryAttributesPostCategories: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.categoryAttributesPostCategories,
			)) satisfies FreshdeskEndpoints['routes']['categoryAttributesPostCategories']['run'],
	},
	categoryAttributesGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.categoryAttributesGet,
			)) satisfies FreshdeskEndpoints['routes']['categoryAttributesGet']['run'],
	},
	categoryAttributesGetCategories: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.categoryAttributesGetCategories,
			)) satisfies FreshdeskEndpoints['routes']['categoryAttributesGetCategories']['run'],
	},
	categoryAttributesGetForums: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.categoryAttributesGetForums,
			)) satisfies FreshdeskEndpoints['routes']['categoryAttributesGetForums']['run'],
	},
	categoryAttributesPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.categoryAttributesPut,
			)) satisfies FreshdeskEndpoints['routes']['categoryAttributesPut']['run'],
	},
	categoryAttributesDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.categoryAttributesDelete,
			)) satisfies FreshdeskEndpoints['routes']['categoryAttributesDelete']['run'],
	},
	forumAttributesPostForums: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.forumAttributesPostForums,
			)) satisfies FreshdeskEndpoints['routes']['forumAttributesPostForums']['run'],
	},
	forumAttributesGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.forumAttributesGet,
			)) satisfies FreshdeskEndpoints['routes']['forumAttributesGet']['run'],
	},
	forumAttributesGetTopics: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.forumAttributesGetTopics,
			)) satisfies FreshdeskEndpoints['routes']['forumAttributesGetTopics']['run'],
	},
	forumAttributesPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.forumAttributesPut,
			)) satisfies FreshdeskEndpoints['routes']['forumAttributesPut']['run'],
	},
	forumAttributesDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.forumAttributesDelete,
			)) satisfies FreshdeskEndpoints['routes']['forumAttributesDelete']['run'],
	},
	forumAttributesPostFollow: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.forumAttributesPostFollow,
			)) satisfies FreshdeskEndpoints['routes']['forumAttributesPostFollow']['run'],
	},
	forumAttributesDeleteFollow: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.forumAttributesDeleteFollow,
			)) satisfies FreshdeskEndpoints['routes']['forumAttributesDeleteFollow']['run'],
	},
	forumAttributesGetFollow: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.forumAttributesGetFollow,
			)) satisfies FreshdeskEndpoints['routes']['forumAttributesGetFollow']['run'],
	},
	topicAttributesPostTopics: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.topicAttributesPostTopics,
			)) satisfies FreshdeskEndpoints['routes']['topicAttributesPostTopics']['run'],
	},
	topicAttributesGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.topicAttributesGet,
			)) satisfies FreshdeskEndpoints['routes']['topicAttributesGet']['run'],
	},
	topicAttributesGetComments: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.topicAttributesGetComments,
			)) satisfies FreshdeskEndpoints['routes']['topicAttributesGetComments']['run'],
	},
	topicAttributesPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.topicAttributesPut,
			)) satisfies FreshdeskEndpoints['routes']['topicAttributesPut']['run'],
	},
	topicAttributesDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.topicAttributesDelete,
			)) satisfies FreshdeskEndpoints['routes']['topicAttributesDelete']['run'],
	},
	topicAttributesPostFollow: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.topicAttributesPostFollow,
			)) satisfies FreshdeskEndpoints['routes']['topicAttributesPostFollow']['run'],
	},
	topicAttributesDeleteFollow: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.topicAttributesDeleteFollow,
			)) satisfies FreshdeskEndpoints['routes']['topicAttributesDeleteFollow']['run'],
	},
	topicAttributesGetFollow: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.topicAttributesGetFollow,
			)) satisfies FreshdeskEndpoints['routes']['topicAttributesGetFollow']['run'],
	},
	topicAttributesGetFollowedBy: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.topicAttributesGetFollowedBy,
			)) satisfies FreshdeskEndpoints['routes']['topicAttributesGetFollowedBy']['run'],
	},
	topicAttributesGetParticipatedBy: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.topicAttributesGetParticipatedBy,
			)) satisfies FreshdeskEndpoints['routes']['topicAttributesGetParticipatedBy']['run'],
	},
	commentAttributesPostComments: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.commentAttributesPostComments,
			)) satisfies FreshdeskEndpoints['routes']['commentAttributesPostComments']['run'],
	},
	commentAttributesPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.commentAttributesPut,
			)) satisfies FreshdeskEndpoints['routes']['commentAttributesPut']['run'],
	},
	commentAttributesDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.commentAttributesDelete,
			)) satisfies FreshdeskEndpoints['routes']['commentAttributesDelete']['run'],
	},
	solutionCategoryAttributesPostCategories: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionCategoryAttributesPostCategories,
			)) satisfies FreshdeskEndpoints['routes']['solutionCategoryAttributesPostCategories']['run'],
	},
	solutionCategoryAttributesPostLanguageCode: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionCategoryAttributesPostLanguageCode,
			)) satisfies FreshdeskEndpoints['routes']['solutionCategoryAttributesPostLanguageCode']['run'],
	},
	solutionCategoryAttributesPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionCategoryAttributesPut,
			)) satisfies FreshdeskEndpoints['routes']['solutionCategoryAttributesPut']['run'],
	},
	solutionCategoryAttributesPutLanguageCode: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionCategoryAttributesPutLanguageCode,
			)) satisfies FreshdeskEndpoints['routes']['solutionCategoryAttributesPutLanguageCode']['run'],
	},
	solutionCategoryAttributesGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionCategoryAttributesGet,
			)) satisfies FreshdeskEndpoints['routes']['solutionCategoryAttributesGet']['run'],
	},
	solutionCategoryAttributesGetLanguageCode: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionCategoryAttributesGetLanguageCode,
			)) satisfies FreshdeskEndpoints['routes']['solutionCategoryAttributesGetLanguageCode']['run'],
	},
	solutionCategoryAttributesGetCategories: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionCategoryAttributesGetCategories,
			)) satisfies FreshdeskEndpoints['routes']['solutionCategoryAttributesGetCategories']['run'],
	},
	solutionCategoryAttributesGetLanguageCode186: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionCategoryAttributesGetLanguageCode186,
			)) satisfies FreshdeskEndpoints['routes']['solutionCategoryAttributesGetLanguageCode186']['run'],
	},
	solutionCategoryAttributesDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionCategoryAttributesDelete,
			)) satisfies FreshdeskEndpoints['routes']['solutionCategoryAttributesDelete']['run'],
	},
	solutionFolderAttributesPostFolders: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionFolderAttributesPostFolders,
			)) satisfies FreshdeskEndpoints['routes']['solutionFolderAttributesPostFolders']['run'],
	},
	solutionFolderAttributesPostLanguageCode: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionFolderAttributesPostLanguageCode,
			)) satisfies FreshdeskEndpoints['routes']['solutionFolderAttributesPostLanguageCode']['run'],
	},
	solutionFolderAttributesPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionFolderAttributesPut,
			)) satisfies FreshdeskEndpoints['routes']['solutionFolderAttributesPut']['run'],
	},
	solutionFolderAttributesPutLanguageCode: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionFolderAttributesPutLanguageCode,
			)) satisfies FreshdeskEndpoints['routes']['solutionFolderAttributesPutLanguageCode']['run'],
	},
	solutionFolderAttributesGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionFolderAttributesGet,
			)) satisfies FreshdeskEndpoints['routes']['solutionFolderAttributesGet']['run'],
	},
	solutionFolderAttributesGetLanguageCode: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionFolderAttributesGetLanguageCode,
			)) satisfies FreshdeskEndpoints['routes']['solutionFolderAttributesGetLanguageCode']['run'],
	},
	solutionFolderAttributesGetFolders: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionFolderAttributesGetFolders,
			)) satisfies FreshdeskEndpoints['routes']['solutionFolderAttributesGetFolders']['run'],
	},
	solutionFolderAttributesGetLanguageCode195: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionFolderAttributesGetLanguageCode195,
			)) satisfies FreshdeskEndpoints['routes']['solutionFolderAttributesGetLanguageCode195']['run'],
	},
	solutionFolderAttributesGetSubfolders: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionFolderAttributesGetSubfolders,
			)) satisfies FreshdeskEndpoints['routes']['solutionFolderAttributesGetSubfolders']['run'],
	},
	solutionFolderAttributesGetLanguageCode197: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionFolderAttributesGetLanguageCode197,
			)) satisfies FreshdeskEndpoints['routes']['solutionFolderAttributesGetLanguageCode197']['run'],
	},
	solutionFolderAttributesDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionFolderAttributesDelete,
			)) satisfies FreshdeskEndpoints['routes']['solutionFolderAttributesDelete']['run'],
	},
	solutionArticleAttributesPostArticles: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionArticleAttributesPostArticles,
			)) satisfies FreshdeskEndpoints['routes']['solutionArticleAttributesPostArticles']['run'],
	},
	solutionArticleAttributesPostLanguageCode: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionArticleAttributesPostLanguageCode,
			)) satisfies FreshdeskEndpoints['routes']['solutionArticleAttributesPostLanguageCode']['run'],
	},
	solutionArticleAttributesPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionArticleAttributesPut,
			)) satisfies FreshdeskEndpoints['routes']['solutionArticleAttributesPut']['run'],
	},
	solutionArticleAttributesPutLanguageCode: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionArticleAttributesPutLanguageCode,
			)) satisfies FreshdeskEndpoints['routes']['solutionArticleAttributesPutLanguageCode']['run'],
	},
	solutionArticleAttributesGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionArticleAttributesGet,
			)) satisfies FreshdeskEndpoints['routes']['solutionArticleAttributesGet']['run'],
	},
	solutionArticleAttributesGetLanguageCode: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionArticleAttributesGetLanguageCode,
			)) satisfies FreshdeskEndpoints['routes']['solutionArticleAttributesGetLanguageCode']['run'],
	},
	solutionArticleAttributesGetArticles: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionArticleAttributesGetArticles,
			)) satisfies FreshdeskEndpoints['routes']['solutionArticleAttributesGetArticles']['run'],
	},
	solutionArticleAttributesGetLanguageCode206: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionArticleAttributesGetLanguageCode206,
			)) satisfies FreshdeskEndpoints['routes']['solutionArticleAttributesGetLanguageCode206']['run'],
	},
	solutionArticleAttributesDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionArticleAttributesDelete,
			)) satisfies FreshdeskEndpoints['routes']['solutionArticleAttributesDelete']['run'],
	},
	solutionArticleAttributesGetSolutions: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.solutionArticleAttributesGetSolutions,
			)) satisfies FreshdeskEndpoints['routes']['solutionArticleAttributesGetSolutions']['run'],
	},
	csatSurveysGetSurveys: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.csatSurveysGetSurveys,
			)) satisfies FreshdeskEndpoints['routes']['csatSurveysGetSurveys']['run'],
	},
	createSurveyResponsesPostResponses: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createSurveyResponsesPostResponses,
			)) satisfies FreshdeskEndpoints['routes']['createSurveyResponsesPostResponses']['run'],
	},
	viewSurveyResponsesGetResponses: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewSurveyResponsesGetResponses,
			)) satisfies FreshdeskEndpoints['routes']['viewSurveyResponsesGetResponses']['run'],
	},
	listAllSurveyGetSurveys: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllSurveyGetSurveys,
			)) satisfies FreshdeskEndpoints['routes']['listAllSurveyGetSurveys']['run'],
	},
	createSatisfactionRatingPostSatisfactionRatings: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createSatisfactionRatingPostSatisfactionRatings,
			)) satisfies FreshdeskEndpoints['routes']['createSatisfactionRatingPostSatisfactionRatings']['run'],
	},
	viewAllSatisfactionRatingsGetSatisfactionRatings: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewAllSatisfactionRatingsGetSatisfactionRatings,
			)) satisfies FreshdeskEndpoints['routes']['viewAllSatisfactionRatingsGetSatisfactionRatings']['run'],
	},
	createTimeEntryPostTimeEntries: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createTimeEntryPostTimeEntries,
			)) satisfies FreshdeskEndpoints['routes']['createTimeEntryPostTimeEntries']['run'],
	},
	listAllTimeEntriesGetTimeEntries: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllTimeEntriesGetTimeEntries,
			)) satisfies FreshdeskEndpoints['routes']['listAllTimeEntriesGetTimeEntries']['run'],
	},
	updateTimeEntryPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateTimeEntryPut,
			)) satisfies FreshdeskEndpoints['routes']['updateTimeEntryPut']['run'],
	},
	toggleTimeEntryPutToggleTimer: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.toggleTimeEntryPutToggleTimer,
			)) satisfies FreshdeskEndpoints['routes']['toggleTimeEntryPutToggleTimer']['run'],
	},
	deleteTimeEntryDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteTimeEntryDelete,
			)) satisfies FreshdeskEndpoints['routes']['deleteTimeEntryDelete']['run'],
	},
	viewEmailConfigGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewEmailConfigGet,
			)) satisfies FreshdeskEndpoints['routes']['viewEmailConfigGet']['run'],
	},
	listAllEmailConfigsGetEmailConfigs: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllEmailConfigsGetEmailConfigs,
			)) satisfies FreshdeskEndpoints['routes']['listAllEmailConfigsGetEmailConfigs']['run'],
	},
	createEmailMailboxPostMailboxes: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createEmailMailboxPostMailboxes,
			)) satisfies FreshdeskEndpoints['routes']['createEmailMailboxPostMailboxes']['run'],
	},
	viewEmailMailboxGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewEmailMailboxGet,
			)) satisfies FreshdeskEndpoints['routes']['viewEmailMailboxGet']['run'],
	},
	listAllEmailMailboxesGetMailboxes: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllEmailMailboxesGetMailboxes,
			)) satisfies FreshdeskEndpoints['routes']['listAllEmailMailboxesGetMailboxes']['run'],
	},
	updateEmailMailboxPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateEmailMailboxPut,
			)) satisfies FreshdeskEndpoints['routes']['updateEmailMailboxPut']['run'],
	},
	deleteEmailMailboxDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteEmailMailboxDelete,
			)) satisfies FreshdeskEndpoints['routes']['deleteEmailMailboxDelete']['run'],
	},
	updateMailboxSettingsPutSettings: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateMailboxSettingsPutSettings,
			)) satisfies FreshdeskEndpoints['routes']['updateMailboxSettingsPutSettings']['run'],
	},
	viewMailboxSettingsGetSettings: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewMailboxSettingsGetSettings,
			)) satisfies FreshdeskEndpoints['routes']['viewMailboxSettingsGetSettings']['run'],
	},
	updateAutomaticBccEmailsPutBcc: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateAutomaticBccEmailsPutBcc,
			)) satisfies FreshdeskEndpoints['routes']['updateAutomaticBccEmailsPutBcc']['run'],
	},
	viewAutomaticBccEmailsGetBcc: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewAutomaticBccEmailsGetBcc,
			)) satisfies FreshdeskEndpoints['routes']['viewAutomaticBccEmailsGetBcc']['run'],
	},
	viewProductGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewProductGet,
			)) satisfies FreshdeskEndpoints['routes']['viewProductGet']['run'],
	},
	listAllProductsGetProducts: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllProductsGetProducts,
			)) satisfies FreshdeskEndpoints['routes']['listAllProductsGetProducts']['run'],
	},
	viewBusinessHourGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewBusinessHourGet,
			)) satisfies FreshdeskEndpoints['routes']['viewBusinessHourGet']['run'],
	},
	listAllBusinessHoursGetBusinessHours: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllBusinessHoursGetBusinessHours,
			)) satisfies FreshdeskEndpoints['routes']['listAllBusinessHoursGetBusinessHours']['run'],
	},
	listAllScenarioAutomationsGetScenarioAutomations: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllScenarioAutomationsGetScenarioAutomations,
			)) satisfies FreshdeskEndpoints['routes']['listAllScenarioAutomationsGetScenarioAutomations']['run'],
	},
	createSlaPolicyPostSlaPolicies: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createSlaPolicyPostSlaPolicies,
			)) satisfies FreshdeskEndpoints['routes']['createSlaPolicyPostSlaPolicies']['run'],
	},
	listAllSlaPoliciesGetSlaPolicies: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllSlaPoliciesGetSlaPolicies,
			)) satisfies FreshdeskEndpoints['routes']['listAllSlaPoliciesGetSlaPolicies']['run'],
	},
	updateSlaPolicyPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateSlaPolicyPut,
			)) satisfies FreshdeskEndpoints['routes']['updateSlaPolicyPut']['run'],
	},
	publishOmnichannelActivityPostContactActivities: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.publishOmnichannelActivityPostContactActivities,
			)) satisfies FreshdeskEndpoints['routes']['publishOmnichannelActivityPostContactActivities']['run'],
	},
	listAllAutomationRulesGetRules: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.listAllAutomationRulesGetRules,
			)) satisfies FreshdeskEndpoints['routes']['listAllAutomationRulesGetRules']['run'],
	},
	viewAnAutomationRuleGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.viewAnAutomationRuleGet,
			)) satisfies FreshdeskEndpoints['routes']['viewAnAutomationRuleGet']['run'],
	},
	deleteAnAutomationRuleDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteAnAutomationRuleDelete,
			)) satisfies FreshdeskEndpoints['routes']['deleteAnAutomationRuleDelete']['run'],
	},
	createAnAutomationRulePostRules: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createAnAutomationRulePostRules,
			)) satisfies FreshdeskEndpoints['routes']['createAnAutomationRulePostRules']['run'],
	},
	updateAnAutomationRulePut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateAnAutomationRulePut,
			)) satisfies FreshdeskEndpoints['routes']['updateAnAutomationRulePut']['run'],
	},
	settingsHelpdeskGetHelpdesk: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.settingsHelpdeskGetHelpdesk,
			)) satisfies FreshdeskEndpoints['routes']['settingsHelpdeskGetHelpdesk']['run'],
	},
	createAThreadPostThreads: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createAThreadPostThreads,
			)) satisfies FreshdeskEndpoints['routes']['createAThreadPostThreads']['run'],
	},
	getAThreadGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.getAThreadGet,
			)) satisfies FreshdeskEndpoints['routes']['getAThreadGet']['run'],
	},
	updateAThreadPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateAThreadPut,
			)) satisfies FreshdeskEndpoints['routes']['updateAThreadPut']['run'],
	},
	deleteAThreadDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteAThreadDelete,
			)) satisfies FreshdeskEndpoints['routes']['deleteAThreadDelete']['run'],
	},
	createMessageForThreadPostMessages: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.createMessageForThreadPostMessages,
			)) satisfies FreshdeskEndpoints['routes']['createMessageForThreadPostMessages']['run'],
	},
	getMessageForThreadGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.getMessageForThreadGet,
			)) satisfies FreshdeskEndpoints['routes']['getMessageForThreadGet']['run'],
	},
	updateMessageForThreadPut: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.updateMessageForThreadPut,
			)) satisfies FreshdeskEndpoints['routes']['updateMessageForThreadPut']['run'],
	},
	deleteMessageForThreadDelete: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.deleteMessageForThreadDelete,
			)) satisfies FreshdeskEndpoints['routes']['deleteMessageForThreadDelete']['run'],
	},
	getQuotedTextGetGenerateQuote: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.getQuotedTextGetGenerateQuote,
			)) satisfies FreshdeskEndpoints['routes']['getQuotedTextGetGenerateQuote']['run'],
	},
	exportAuditLogPostExport: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.exportAuditLogPostExport,
			)) satisfies FreshdeskEndpoints['routes']['exportAuditLogPostExport']['run'],
	},
	exportAuditLogGet: {
		run: ((ctx, input) =>
			invokeFreshdeskOperation(
				ctx,
				input,
				FRESHDESK_OPERATIONS.exportAuditLogGet,
			)) satisfies FreshdeskEndpoints['routes']['exportAuditLogGet']['run'],
	},
} as const;

export { FRESHDESK_OPERATIONS };
export * from './types';
