import { z } from 'zod';
import { SpokiAccountSchema } from '../schema';

/*
 * Shared account/channel types.
 */
export interface SpokiAccount {
	id: number;
	name: string;
	current_credit: number;
	status: string;
	default_language: string;
	phone: string | null;
	has_official_verification: boolean;
	daily_limit: number;
	phone_status: string;
	quality_score: number;
	quality_reasons?: unknown;
	is_active: boolean;
	country_code: string;
	estimated_available_conversations: number;
	account_type: number;
	default_pricing_delta: number;
	low_credit_threshold: number;
	has_low_credit_alert: boolean;
	default_prefix: string;
	default_country_code: string;
	timezone: string;
	contacted_in_24h: number;
	contacted_in_7d: number;
	primary_channel_id?: number | null;
	channels?: SpokiChannel[];
}

export interface SpokiChannel {
	name: string;
	identifier: string;
	platform: string;
	status: string;
	phone_status: string;
	quality_score: string;
	is_primary: boolean;
}

export interface StartAutomationInput {
	secret: string;
	phone: string;
	first_name?: string;
	last_name?: string;
	email?: string;
	language?: string;
	custom_fields?: Record<string, unknown>;
	metadata?: Record<string, unknown>;
}

export interface TriggerAutomationInput extends StartAutomationInput {
	uuid: string;
}

export interface SendMessageInput {
	phone: string;
	text: string;
	channel_id?: number;
	metadata?: Record<string, unknown>;
}

export interface SendMessageResponse {
	[key: string]: unknown;
}

export interface TriggerAutomationResponse {
	[key: string]: unknown;
}

// GET /api/1/accounts/ returns a bare array of accounts.
export type ListAccountsResponse = SpokiAccount[];

export interface GetAccountResponse extends SpokiAccount {}

export interface GetAccountByPhoneResponse extends SpokiAccount {}

const listQuery = z
	.object({
		search: z.string().optional(),
		page: z.union([z.number(), z.string()]).optional(),
		limit: z.union([z.number(), z.string()]).optional(),
		offset: z.union([z.number(), z.string()]).optional(),
	})
	.passthrough();

/*
 * Endpoint input schemas.
 *
 * These names must match the endpoint names used by the plugin.
 */
export const EndpointInputSchemas = {
	getAccount: z.object({
		accountId: z.number(),
	}),

	getAccountByPhone: z.object({
		phone: z.string(),
	}),

	listAccounts: listQuery,

	sendMessage: z.object({
		phone: z.string(),
		text: z.string(),
		channel_id: z.number().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	}),

	triggerAutomation: z.object({
		uuid: z.string(),
		secret: z.string(),
		phone: z.string(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().email().optional(),
		language: z.string().optional(),
		custom_fields: z.record(z.string(), z.unknown()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	}),

	getAccountCurrentReport: z.object({ accountId: z.number() }),
	createAccountOnboardingLink: z
		.object({ accountId: z.number() })
		.passthrough(),
	listAgencies: listQuery,
	listAutomations: listQuery,
	retrieveAutomation: z.object({ id: z.number() }),
	listCampaigns: listQuery,
	updateCampaign: z
		.object({
			id: z.number(),
			name: z.string().optional(),
			status: z.string().optional(),
			scheduled_datetime: z.string().optional(),
		})
		.passthrough(),
	listContacts: listQuery,
	retrieveContact: z.object({ id: z.number() }),
	createOrUpdateContact: z
		.object({
			phone: z.string(),
			first_name: z.string().optional(),
			last_name: z.string().optional(),
			email: z.string().optional(),
			language: z.string().optional(),
		})
		.passthrough(),
	updateContact: z.object({ id: z.number() }).passthrough(),
	deleteContact: z.object({ id: z.number() }),
	syncContactsBulk: z.object({ contacts: z.array(z.unknown()) }).passthrough(),
	addContactOperator: z
		.object({
			id: z.number(),
			operator_id: z.number().optional(),
			role_id: z.number().optional(),
		})
		.passthrough(),
	removeContactOperator: z.object({ id: z.number() }).passthrough(),
	listCustomFields: listQuery,
	retrieveCustomField: z.object({ id: z.number() }),
	createCustomField: z
		.object({ label: z.string(), code: z.string().optional() })
		.passthrough(),
	updateCustomField: z
		.object({ id: z.number(), label: z.string().optional() })
		.passthrough(),
	deleteCustomField: z.object({ id: z.number() }),
	listLists: listQuery,
	retrieveList: z.object({ id: z.number() }),
	createList: z.object({ name: z.string() }).passthrough(),
	deleteList: z.object({ id: z.number() }),
	removeAllListContacts: z.object({ id: z.number() }),
	removeListContacts: z
		.object({ id: z.number(), contacts: z.array(z.unknown()).optional() })
		.passthrough(),
	syncListContacts: z
		.object({ id: z.number(), contacts: z.array(z.unknown()) })
		.passthrough(),
	listMedia: listQuery,
	retrieveMedia: z.object({ id: z.number() }),
	createMedia: z.object({}).passthrough(),
	updateMedia: z.object({ id: z.number() }).passthrough(),
	deleteMedia: z.object({ id: z.number() }),
	listPartners: listQuery,
	listReports: listQuery,
	listRoles: listQuery,
	retrieveRole: z.object({ id: z.number() }),
	updateRole: z.object({ id: z.number() }).passthrough(),
	deleteRole: z.object({ id: z.number() }),
	addServiceUser: z.object({}).passthrough(),
	checkRolePrivateKey: z.object({ id: z.number() }),
	generateRolePrivateKey: z.object({ id: z.number() }),
	listTags: listQuery,
	retrieveTag: z.object({ id: z.number() }),
	listTemplates: listQuery,
	retrieveTemplate: z.object({ id: z.number() }),
	createTemplate: z
		.object({
			name: z.string(),
			category: z.string(),
			templatelocalization_set: z.array(z.unknown()),
		})
		.passthrough(),
	updateTemplate: z.object({ id: z.number() }).passthrough(),
	deleteTemplate: z.object({
		id: z.number(),
		force_delete: z.boolean().optional(),
	}),
	cloneTemplate: z.object({ id: z.number() }),
	revertTemplateToDraft: z.object({ id: z.number() }),
	listTickets: listQuery,
	createTicket: z.object({}).passthrough(),
	deleteTicket: z.object({ id: z.number() }),
	resendInvitation: z.object({ id: z.number() }),
	updateInvitationRole: z.object({ id: z.number() }).passthrough(),
};

/*
 * Endpoint output schemas.
 *
 * These names must match the endpoint names used by the plugin.
 */
export const EndpointOutputSchemas = {
	getAccount: SpokiAccountSchema,

	getAccountByPhone: SpokiAccountSchema,

	listAccounts: z.array(SpokiAccountSchema),

	sendMessage: z.object({}).passthrough(),

	triggerAutomation: z.object({}).passthrough(),

	getAccountCurrentReport: z.union([
		z.array(z.record(z.string(), z.unknown())),
		z.record(z.string(), z.unknown()),
	]),
	createAccountOnboardingLink: z.record(z.string(), z.unknown()),
	listAgencies: z.union([
		z.array(z.record(z.string(), z.unknown())),
		z.record(z.string(), z.unknown()),
	]),
	listAutomations: z.union([
		z.array(z.record(z.string(), z.unknown())),
		z.record(z.string(), z.unknown()),
	]),
	retrieveAutomation: z.record(z.string(), z.unknown()),
	listCampaigns: z.union([
		z.array(z.record(z.string(), z.unknown())),
		z.record(z.string(), z.unknown()),
	]),
	updateCampaign: z.record(z.string(), z.unknown()),
	listContacts: z.union([
		z.array(z.record(z.string(), z.unknown())),
		z.record(z.string(), z.unknown()),
	]),
	retrieveContact: z.record(z.string(), z.unknown()),
	createOrUpdateContact: z.record(z.string(), z.unknown()),
	updateContact: z.record(z.string(), z.unknown()),
	deleteContact: z.union([
		z.record(z.string(), z.unknown()),
		z.array(z.unknown()),
	]),
	syncContactsBulk: z.record(z.string(), z.unknown()),
	addContactOperator: z.record(z.string(), z.unknown()),
	removeContactOperator: z.record(z.string(), z.unknown()),
	listCustomFields: z.union([
		z.array(z.record(z.string(), z.unknown())),
		z.record(z.string(), z.unknown()),
	]),
	retrieveCustomField: z.record(z.string(), z.unknown()),
	createCustomField: z.record(z.string(), z.unknown()),
	updateCustomField: z.record(z.string(), z.unknown()),
	deleteCustomField: z.record(z.string(), z.unknown()),
	listLists: z.union([
		z.array(z.record(z.string(), z.unknown())),
		z.record(z.string(), z.unknown()),
	]),
	retrieveList: z.record(z.string(), z.unknown()),
	createList: z.record(z.string(), z.unknown()),
	deleteList: z.record(z.string(), z.unknown()),
	removeAllListContacts: z.record(z.string(), z.unknown()),
	removeListContacts: z.record(z.string(), z.unknown()),
	syncListContacts: z.record(z.string(), z.unknown()),
	listMedia: z.union([
		z.array(z.record(z.string(), z.unknown())),
		z.record(z.string(), z.unknown()),
	]),
	retrieveMedia: z.record(z.string(), z.unknown()),
	createMedia: z.record(z.string(), z.unknown()),
	updateMedia: z.record(z.string(), z.unknown()),
	deleteMedia: z.record(z.string(), z.unknown()),
	listPartners: z.union([
		z.array(z.record(z.string(), z.unknown())),
		z.record(z.string(), z.unknown()),
	]),
	listReports: z.union([
		z.array(z.record(z.string(), z.unknown())),
		z.record(z.string(), z.unknown()),
	]),
	listRoles: z.union([
		z.array(z.record(z.string(), z.unknown())),
		z.record(z.string(), z.unknown()),
	]),
	retrieveRole: z.record(z.string(), z.unknown()),
	updateRole: z.record(z.string(), z.unknown()),
	deleteRole: z.record(z.string(), z.unknown()),
	addServiceUser: z.record(z.string(), z.unknown()),
	checkRolePrivateKey: z.record(z.string(), z.unknown()),
	generateRolePrivateKey: z.record(z.string(), z.unknown()),
	listTags: z.union([
		z.array(z.record(z.string(), z.unknown())),
		z.record(z.string(), z.unknown()),
	]),
	retrieveTag: z.record(z.string(), z.unknown()),
	listTemplates: z.union([
		z.array(z.record(z.string(), z.unknown())),
		z.record(z.string(), z.unknown()),
	]),
	retrieveTemplate: z.record(z.string(), z.unknown()),
	createTemplate: z.record(z.string(), z.unknown()),
	updateTemplate: z.record(z.string(), z.unknown()),
	deleteTemplate: z.record(z.string(), z.unknown()),
	cloneTemplate: z.record(z.string(), z.unknown()),
	revertTemplateToDraft: z.record(z.string(), z.unknown()),
	listTickets: z.union([
		z.array(z.record(z.string(), z.unknown())),
		z.record(z.string(), z.unknown()),
	]),
	createTicket: z.record(z.string(), z.unknown()),
	deleteTicket: z.record(z.string(), z.unknown()),
	resendInvitation: z.record(z.string(), z.unknown()),
	updateInvitationRole: z.record(z.string(), z.unknown()),
};

/*
 * Typed versions for consumers that want inferred endpoint types.
 */
export type EndpointInput = {
	[K in keyof typeof EndpointInputSchemas]: z.infer<
		(typeof EndpointInputSchemas)[K]
	>;
};

export type EndpointOutput = {
	[K in keyof typeof EndpointOutputSchemas]: z.infer<
		(typeof EndpointOutputSchemas)[K]
	>;
};

export const SpokiEndpointInputSchemas = EndpointInputSchemas;
export const SpokiEndpointOutputSchemas = EndpointOutputSchemas;
