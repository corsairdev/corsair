import type { SpokiContext } from '../index';
import { omitKeys, queryString, spokiCall } from './call';
import { EndpointInputSchemas, EndpointOutputSchemas } from './types';

type Ctx = SpokiContext & { key: string };

const S = EndpointInputSchemas;
const O = EndpointOutputSchemas;

export const getAccountCurrentReport = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.getAccountCurrentReport,
		output: O.getAccountCurrentReport,
		method: 'GET',
		path: (p) => `/accounts/${p.accountId}/current_report/`,
	});

export const createAccountOnboardingLink = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.createAccountOnboardingLink,
		output: O.createAccountOnboardingLink,
		method: 'POST',
		path: (p) => `/accounts/${p.accountId}/onboarding/`,
		body: (p) => omitKeys(p, ['accountId']),
	});

export const listAgencies = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.listAgencies,
		output: O.listAgencies,
		method: 'GET',
		path: (p) => `/agencies/${queryString(p)}`,
	});

export const listAutomations = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.listAutomations,
		output: O.listAutomations,
		method: 'GET',
		path: (p) => `/automations/${queryString(p)}`,
	});

export const retrieveAutomation = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.retrieveAutomation,
		output: O.retrieveAutomation,
		method: 'GET',
		path: (p) => `/automations/${p.id}/`,
	});

export const listCampaigns = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.listCampaigns,
		output: O.listCampaigns,
		method: 'GET',
		path: (p) => `/campaigns/${queryString(p)}`,
	});

export const updateCampaign = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.updateCampaign,
		output: O.updateCampaign,
		method: 'PATCH',
		path: (p) => `/campaigns/${p.id}/`,
		body: (p) => omitKeys(p, ['id']),
	});

export const listContacts = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.listContacts,
		output: O.listContacts,
		method: 'GET',
		path: (p) => `/contacts/${queryString(p)}`,
	});

export const retrieveContact = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.retrieveContact,
		output: O.retrieveContact,
		method: 'GET',
		path: (p) => `/contacts/${p.id}/`,
	});

export const createOrUpdateContact = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.createOrUpdateContact,
		output: O.createOrUpdateContact,
		method: 'POST',
		path: () => `/contacts/sync/`,
	});

export const updateContact = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.updateContact,
		output: O.updateContact,
		method: 'PATCH',
		path: (p) => `/contacts/${p.id}/`,
		body: (p) => omitKeys(p, ['id']),
	});

export const deleteContact = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.deleteContact,
		output: O.deleteContact,
		method: 'DELETE',
		path: (p) => `/contacts/${p.id}/`,
	});

export const syncContactsBulk = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.syncContactsBulk,
		output: O.syncContactsBulk,
		method: 'POST',
		path: () => `/contacts/sync_all/`,
	});

export const addContactOperator = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.addContactOperator,
		output: O.addContactOperator,
		method: 'POST',
		path: (p) => `/contacts/${p.id}/add_operator/`,
		body: (p) => omitKeys(p, ['id']),
	});

export const removeContactOperator = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.removeContactOperator,
		output: O.removeContactOperator,
		method: 'POST',
		path: (p) => `/contacts/${p.id}/remove_operator/`,
		body: (p) => omitKeys(p, ['id']),
	});

export const listCustomFields = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.listCustomFields,
		output: O.listCustomFields,
		method: 'GET',
		path: (p) => `/custom-fields/${queryString(p)}`,
	});

export const retrieveCustomField = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.retrieveCustomField,
		output: O.retrieveCustomField,
		method: 'GET',
		path: (p) => `/custom-fields/${p.id}/`,
	});

export const createCustomField = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.createCustomField,
		output: O.createCustomField,
		method: 'POST',
		path: () => `/custom-fields/`,
	});

export const updateCustomField = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.updateCustomField,
		output: O.updateCustomField,
		method: 'PATCH',
		path: (p) => `/custom-fields/${p.id}/`,
		body: (p) => omitKeys(p, ['id']),
	});

export const deleteCustomField = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.deleteCustomField,
		output: O.deleteCustomField,
		method: 'DELETE',
		path: (p) => `/custom-fields/${p.id}/`,
	});

export const listLists = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.listLists,
		output: O.listLists,
		method: 'GET',
		path: (p) => `/lists/${queryString(p)}`,
	});

export const retrieveList = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.retrieveList,
		output: O.retrieveList,
		method: 'GET',
		path: (p) => `/lists/${p.id}/`,
	});

export const createList = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.createList,
		output: O.createList,
		method: 'POST',
		path: () => `/lists/`,
	});

export const deleteList = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.deleteList,
		output: O.deleteList,
		method: 'DELETE',
		path: (p) => `/lists/${p.id}/`,
	});

export const removeAllListContacts = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.removeAllListContacts,
		output: O.removeAllListContacts,
		method: 'POST',
		path: (p) => `/lists/${p.id}/remove_all_contacts/`,
		body: () => ({}),
	});

export const removeListContacts = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.removeListContacts,
		output: O.removeListContacts,
		method: 'POST',
		path: (p) => `/lists/${p.id}/remove_contacts/`,
		body: (p) => omitKeys(p, ['id']),
	});

export const syncListContacts = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.syncListContacts,
		output: O.syncListContacts,
		method: 'POST',
		path: (p) => `/lists/${p.id}/sync_contacts/`,
		body: (p) => omitKeys(p, ['id']),
	});

export const listMedia = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.listMedia,
		output: O.listMedia,
		method: 'GET',
		path: (p) => `/media/${queryString(p)}`,
	});

export const retrieveMedia = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.retrieveMedia,
		output: O.retrieveMedia,
		method: 'GET',
		path: (p) => `/media/${p.id}/`,
	});

export const createMedia = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.createMedia,
		output: O.createMedia,
		method: 'POST',
		path: () => `/media/`,
	});

export const updateMedia = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.updateMedia,
		output: O.updateMedia,
		method: 'PATCH',
		path: (p) => `/media/${p.id}/`,
		body: (p) => omitKeys(p, ['id']),
	});

export const deleteMedia = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.deleteMedia,
		output: O.deleteMedia,
		method: 'DELETE',
		path: (p) => `/media/${p.id}/`,
	});

export const listPartners = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.listPartners,
		output: O.listPartners,
		method: 'GET',
		path: () => `/partners/`,
	});

export const listReports = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.listReports,
		output: O.listReports,
		method: 'GET',
		path: (p) => `/reports/${queryString(p)}`,
	});

export const listRoles = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.listRoles,
		output: O.listRoles,
		method: 'GET',
		path: () => `/roles/`,
	});

export const retrieveRole = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.retrieveRole,
		output: O.retrieveRole,
		method: 'GET',
		path: (p) => `/roles/${p.id}/`,
	});

export const updateRole = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.updateRole,
		output: O.updateRole,
		method: 'POST',
		path: (p) => `/roles/${p.id}/update_role/`,
		body: (p) => omitKeys(p, ['id']),
	});

export const deleteRole = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.deleteRole,
		output: O.deleteRole,
		method: 'DELETE',
		path: (p) => `/roles/${p.id}/`,
	});

export const addServiceUser = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.addServiceUser,
		output: O.addServiceUser,
		method: 'POST',
		path: () => `/roles/add_service_user/`,
	});

export const checkRolePrivateKey = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.checkRolePrivateKey,
		output: O.checkRolePrivateKey,
		method: 'GET',
		path: (p) => `/roles/${p.id}/has_private_key/`,
	});

export const generateRolePrivateKey = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.generateRolePrivateKey,
		output: O.generateRolePrivateKey,
		method: 'POST',
		path: (p) => `/roles/${p.id}/generate_private_key/`,
		body: () => ({}),
	});

export const listTags = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.listTags,
		output: O.listTags,
		method: 'GET',
		path: () => `/tags/`,
	});

export const retrieveTag = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.retrieveTag,
		output: O.retrieveTag,
		method: 'GET',
		path: (p) => `/tags/${p.id}/`,
	});

export const listTemplates = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.listTemplates,
		output: O.listTemplates,
		method: 'GET',
		path: (p) => `/templates/${queryString(p)}`,
	});

export const retrieveTemplate = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.retrieveTemplate,
		output: O.retrieveTemplate,
		method: 'GET',
		path: (p) => `/templates/${p.id}/`,
	});

export const createTemplate = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.createTemplate,
		output: O.createTemplate,
		method: 'POST',
		path: () => `/templates/`,
	});

export const updateTemplate = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.updateTemplate,
		output: O.updateTemplate,
		method: 'PATCH',
		path: (p) => `/templates/${p.id}/`,
		body: (p) => omitKeys(p, ['id']),
	});

export const deleteTemplate = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.deleteTemplate,
		output: O.deleteTemplate,
		method: 'DELETE',
		path: (p) =>
			`/templates/${p.id}/${queryString(p.force_delete ? { force_delete: true } : {})}`,
	});

export const cloneTemplate = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.cloneTemplate,
		output: O.cloneTemplate,
		method: 'GET',
		path: (p) => `/templates/${p.id}/clone/`,
	});

export const revertTemplateToDraft = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.revertTemplateToDraft,
		output: O.revertTemplateToDraft,
		method: 'POST',
		path: (p) => `/templates/${p.id}/back_to_draft/`,
		body: () => ({}),
	});

export const listTickets = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.listTickets,
		output: O.listTickets,
		method: 'GET',
		path: (p) => `/tickets/${queryString(p)}`,
	});

export const createTicket = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.createTicket,
		output: O.createTicket,
		method: 'POST',
		path: () => `/tickets/`,
	});

export const deleteTicket = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.deleteTicket,
		output: O.deleteTicket,
		method: 'DELETE',
		path: (p) => `/tickets/${p.id}/`,
	});

export const resendInvitation = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.resendInvitation,
		output: O.resendInvitation,
		method: 'POST',
		path: (p) => `/invitations/${p.id}/send/`,
		body: () => ({}),
	});

export const updateInvitationRole = (ctx: Ctx, input: unknown) =>
	spokiCall(ctx, input, {
		input: S.updateInvitationRole,
		output: O.updateInvitationRole,
		method: 'POST',
		path: (p) => `/invitations/${p.id}/update_role/`,
		body: (p) => omitKeys(p, ['id']),
	});
