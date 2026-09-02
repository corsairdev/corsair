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
import {
	apiKeys,
	asm,
	contacts,
	fields,
	lists,
	mail,
	segments,
	senders,
	stats,
	suppressions,
	templates,
	user,
} from './endpoints/handlers';
import type {
	SendGridEndpointInputs,
	SendGridEndpointOutputs,
} from './endpoints/types';
import {
	SendGridEndpointInputSchemas,
	SendGridEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SendGridSchema } from './schema';

export type SendGridPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSendGridPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof sendGridEndpointsNested>;
};

export type SendGridContext = CorsairPluginContext<
	typeof SendGridSchema,
	SendGridPluginOptions
>;

export type SendGridKeyBuilderContext =
	KeyBuilderContext<SendGridPluginOptions>;

export type SendGridBoundEndpoints = BindEndpoints<
	typeof sendGridEndpointsNested
>;

type SendGridEndpoint<K extends keyof SendGridEndpointOutputs> =
	CorsairEndpoint<
		SendGridContext,
		SendGridEndpointInputs[K],
		SendGridEndpointOutputs[K]
	>;

export type SendGridEndpoints = {
	[K in keyof SendGridEndpointInputs]: SendGridEndpoint<K>;
};

const sendGridEndpointsNested = {
	mail,
	contacts,
	lists,
	segments,
	fields,
	senders,
	templates,
	suppressions,
	asm,
	stats,
	user,
	apiKeys,
} as const;

export const sendGridEndpointSchemas = {
	'mail.send': {
		input: SendGridEndpointInputSchemas.mailSend,
		output: SendGridEndpointOutputSchemas.mailSend,
	},
	'mail.createBatchId': {
		input: SendGridEndpointInputSchemas.mailCreateBatchId,
		output: SendGridEndpointOutputSchemas.mailCreateBatchId,
	},
	'mail.validateBatchId': {
		input: SendGridEndpointInputSchemas.mailValidateBatchId,
		output: SendGridEndpointOutputSchemas.mailValidateBatchId,
	},
	'mail.cancelScheduledSend': {
		input: SendGridEndpointInputSchemas.mailCancelScheduledSend,
		output: SendGridEndpointOutputSchemas.mailCancelScheduledSend,
	},
	'mail.listScheduledSends': {
		input: SendGridEndpointInputSchemas.mailListScheduledSends,
		output: SendGridEndpointOutputSchemas.mailListScheduledSends,
	},
	'mail.getScheduledSend': {
		input: SendGridEndpointInputSchemas.mailGetScheduledSend,
		output: SendGridEndpointOutputSchemas.mailGetScheduledSend,
	},
	'mail.updateScheduledSend': {
		input: SendGridEndpointInputSchemas.mailUpdateScheduledSend,
		output: SendGridEndpointOutputSchemas.mailUpdateScheduledSend,
	},
	'mail.deleteScheduledSend': {
		input: SendGridEndpointInputSchemas.mailDeleteScheduledSend,
		output: SendGridEndpointOutputSchemas.mailDeleteScheduledSend,
	},
	'contacts.addOrUpdate': {
		input: SendGridEndpointInputSchemas.contactsAddOrUpdate,
		output: SendGridEndpointOutputSchemas.contactsAddOrUpdate,
	},
	'contacts.get': {
		input: SendGridEndpointInputSchemas.contactsGet,
		output: SendGridEndpointOutputSchemas.contactsGet,
	},
	'contacts.search': {
		input: SendGridEndpointInputSchemas.contactsSearch,
		output: SendGridEndpointOutputSchemas.contactsSearch,
	},
	'contacts.searchEmails': {
		input: SendGridEndpointInputSchemas.contactsSearchEmails,
		output: SendGridEndpointOutputSchemas.contactsSearchEmails,
	},
	'contacts.remove': {
		input: SendGridEndpointInputSchemas.contactsRemove,
		output: SendGridEndpointOutputSchemas.contactsRemove,
	},
	'contacts.getCount': {
		input: SendGridEndpointInputSchemas.contactsGetCount,
		output: SendGridEndpointOutputSchemas.contactsGetCount,
	},
	'contacts.getSample': {
		input: SendGridEndpointInputSchemas.contactsGetSample,
		output: SendGridEndpointOutputSchemas.contactsGetSample,
	},
	'contacts.import': {
		input: SendGridEndpointInputSchemas.contactsImport,
		output: SendGridEndpointOutputSchemas.contactsImport,
	},
	'contacts.importStatus': {
		input: SendGridEndpointInputSchemas.contactsImportStatus,
		output: SendGridEndpointOutputSchemas.contactsImportStatus,
	},
	'contacts.export': {
		input: SendGridEndpointInputSchemas.contactsExport,
		output: SendGridEndpointOutputSchemas.contactsExport,
	},
	'contacts.exportStatus': {
		input: SendGridEndpointInputSchemas.contactsExportStatus,
		output: SendGridEndpointOutputSchemas.contactsExportStatus,
	},
	'contacts.listExports': {
		input: SendGridEndpointInputSchemas.contactsListExports,
		output: SendGridEndpointOutputSchemas.contactsListExports,
	},
	'lists.getAll': {
		input: SendGridEndpointInputSchemas.listsGetAll,
		output: SendGridEndpointOutputSchemas.listsGetAll,
	},
	'lists.create': {
		input: SendGridEndpointInputSchemas.listsCreate,
		output: SendGridEndpointOutputSchemas.listsCreate,
	},
	'lists.get': {
		input: SendGridEndpointInputSchemas.listsGet,
		output: SendGridEndpointOutputSchemas.listsGet,
	},
	'lists.update': {
		input: SendGridEndpointInputSchemas.listsUpdate,
		output: SendGridEndpointOutputSchemas.listsUpdate,
	},
	'lists.remove': {
		input: SendGridEndpointInputSchemas.listsRemove,
		output: SendGridEndpointOutputSchemas.listsRemove,
	},
	'lists.getContactCount': {
		input: SendGridEndpointInputSchemas.listsGetContactCount,
		output: SendGridEndpointOutputSchemas.listsGetContactCount,
	},
	'lists.removeContacts': {
		input: SendGridEndpointInputSchemas.listsRemoveContacts,
		output: SendGridEndpointOutputSchemas.listsRemoveContacts,
	},
	'segments.create': {
		input: SendGridEndpointInputSchemas.segmentsCreate,
		output: SendGridEndpointOutputSchemas.segmentsCreate,
	},
	'segments.getAll': {
		input: SendGridEndpointInputSchemas.segmentsGetAll,
		output: SendGridEndpointOutputSchemas.segmentsGetAll,
	},
	'segments.get': {
		input: SendGridEndpointInputSchemas.segmentsGet,
		output: SendGridEndpointOutputSchemas.segmentsGet,
	},
	'segments.update': {
		input: SendGridEndpointInputSchemas.segmentsUpdate,
		output: SendGridEndpointOutputSchemas.segmentsUpdate,
	},
	'segments.remove': {
		input: SendGridEndpointInputSchemas.segmentsRemove,
		output: SendGridEndpointOutputSchemas.segmentsRemove,
	},
	'segments.refresh': {
		input: SendGridEndpointInputSchemas.segmentsRefresh,
		output: SendGridEndpointOutputSchemas.segmentsRefresh,
	},
	'fields.getAll': {
		input: SendGridEndpointInputSchemas.fieldsGetAll,
		output: SendGridEndpointOutputSchemas.fieldsGetAll,
	},
	'fields.create': {
		input: SendGridEndpointInputSchemas.fieldsCreate,
		output: SendGridEndpointOutputSchemas.fieldsCreate,
	},
	'fields.update': {
		input: SendGridEndpointInputSchemas.fieldsUpdate,
		output: SendGridEndpointOutputSchemas.fieldsUpdate,
	},
	'fields.remove': {
		input: SendGridEndpointInputSchemas.fieldsRemove,
		output: SendGridEndpointOutputSchemas.fieldsRemove,
	},
	'senders.getAll': {
		input: SendGridEndpointInputSchemas.sendersGetAll,
		output: SendGridEndpointOutputSchemas.sendersGetAll,
	},
	'senders.create': {
		input: SendGridEndpointInputSchemas.sendersCreate,
		output: SendGridEndpointOutputSchemas.sendersCreate,
	},
	'senders.update': {
		input: SendGridEndpointInputSchemas.sendersUpdate,
		output: SendGridEndpointOutputSchemas.sendersUpdate,
	},
	'senders.remove': {
		input: SendGridEndpointInputSchemas.sendersRemove,
		output: SendGridEndpointOutputSchemas.sendersRemove,
	},
	'senders.resend': {
		input: SendGridEndpointInputSchemas.sendersResend,
		output: SendGridEndpointOutputSchemas.sendersResend,
	},
	'senders.listIdentities': {
		input: SendGridEndpointInputSchemas.sendersListIdentities,
		output: SendGridEndpointOutputSchemas.sendersListIdentities,
	},
	'senders.createIdentity': {
		input: SendGridEndpointInputSchemas.sendersCreateIdentity,
		output: SendGridEndpointOutputSchemas.sendersCreateIdentity,
	},
	'senders.getIdentity': {
		input: SendGridEndpointInputSchemas.sendersGetIdentity,
		output: SendGridEndpointOutputSchemas.sendersGetIdentity,
	},
	'templates.create': {
		input: SendGridEndpointInputSchemas.templatesCreate,
		output: SendGridEndpointOutputSchemas.templatesCreate,
	},
	'templates.getAll': {
		input: SendGridEndpointInputSchemas.templatesGetAll,
		output: SendGridEndpointOutputSchemas.templatesGetAll,
	},
	'templates.get': {
		input: SendGridEndpointInputSchemas.templatesGet,
		output: SendGridEndpointOutputSchemas.templatesGet,
	},
	'templates.update': {
		input: SendGridEndpointInputSchemas.templatesUpdate,
		output: SendGridEndpointOutputSchemas.templatesUpdate,
	},
	'templates.remove': {
		input: SendGridEndpointInputSchemas.templatesRemove,
		output: SendGridEndpointOutputSchemas.templatesRemove,
	},
	'templates.createVersion': {
		input: SendGridEndpointInputSchemas.templatesCreateVersion,
		output: SendGridEndpointOutputSchemas.templatesCreateVersion,
	},
	'templates.getVersion': {
		input: SendGridEndpointInputSchemas.templatesGetVersion,
		output: SendGridEndpointOutputSchemas.templatesGetVersion,
	},
	'templates.updateVersion': {
		input: SendGridEndpointInputSchemas.templatesUpdateVersion,
		output: SendGridEndpointOutputSchemas.templatesUpdateVersion,
	},
	'templates.removeVersion': {
		input: SendGridEndpointInputSchemas.templatesRemoveVersion,
		output: SendGridEndpointOutputSchemas.templatesRemoveVersion,
	},
	'templates.activateVersion': {
		input: SendGridEndpointInputSchemas.templatesActivateVersion,
		output: SendGridEndpointOutputSchemas.templatesActivateVersion,
	},
	'suppressions.getBounces': {
		input: SendGridEndpointInputSchemas.suppressionsGetBounces,
		output: SendGridEndpointOutputSchemas.suppressionsGetBounces,
	},
	'suppressions.getBounce': {
		input: SendGridEndpointInputSchemas.suppressionsGetBounce,
		output: SendGridEndpointOutputSchemas.suppressionsGetBounce,
	},
	'suppressions.deleteBounce': {
		input: SendGridEndpointInputSchemas.suppressionsDeleteBounce,
		output: SendGridEndpointOutputSchemas.suppressionsDeleteBounce,
	},
	'suppressions.deleteBounces': {
		input: SendGridEndpointInputSchemas.suppressionsDeleteBounces,
		output: SendGridEndpointOutputSchemas.suppressionsDeleteBounces,
	},
	'suppressions.getBlocks': {
		input: SendGridEndpointInputSchemas.suppressionsGetBlocks,
		output: SendGridEndpointOutputSchemas.suppressionsGetBlocks,
	},
	'suppressions.getBlock': {
		input: SendGridEndpointInputSchemas.suppressionsGetBlock,
		output: SendGridEndpointOutputSchemas.suppressionsGetBlock,
	},
	'suppressions.deleteBlock': {
		input: SendGridEndpointInputSchemas.suppressionsDeleteBlock,
		output: SendGridEndpointOutputSchemas.suppressionsDeleteBlock,
	},
	'suppressions.deleteBlocks': {
		input: SendGridEndpointInputSchemas.suppressionsDeleteBlocks,
		output: SendGridEndpointOutputSchemas.suppressionsDeleteBlocks,
	},
	'suppressions.getSpamReports': {
		input: SendGridEndpointInputSchemas.suppressionsGetSpamReports,
		output: SendGridEndpointOutputSchemas.suppressionsGetSpamReports,
	},
	'suppressions.getSpamReport': {
		input: SendGridEndpointInputSchemas.suppressionsGetSpamReport,
		output: SendGridEndpointOutputSchemas.suppressionsGetSpamReport,
	},
	'suppressions.deleteSpamReport': {
		input: SendGridEndpointInputSchemas.suppressionsDeleteSpamReport,
		output: SendGridEndpointOutputSchemas.suppressionsDeleteSpamReport,
	},
	'suppressions.deleteSpamReports': {
		input: SendGridEndpointInputSchemas.suppressionsDeleteSpamReports,
		output: SendGridEndpointOutputSchemas.suppressionsDeleteSpamReports,
	},
	'suppressions.getInvalidEmails': {
		input: SendGridEndpointInputSchemas.suppressionsGetInvalidEmails,
		output: SendGridEndpointOutputSchemas.suppressionsGetInvalidEmails,
	},
	'suppressions.getInvalidEmail': {
		input: SendGridEndpointInputSchemas.suppressionsGetInvalidEmail,
		output: SendGridEndpointOutputSchemas.suppressionsGetInvalidEmail,
	},
	'suppressions.deleteInvalidEmail': {
		input: SendGridEndpointInputSchemas.suppressionsDeleteInvalidEmail,
		output: SendGridEndpointOutputSchemas.suppressionsDeleteInvalidEmail,
	},
	'suppressions.deleteInvalidEmails': {
		input: SendGridEndpointInputSchemas.suppressionsDeleteInvalidEmails,
		output: SendGridEndpointOutputSchemas.suppressionsDeleteInvalidEmails,
	},
	'suppressions.getGlobalUnsubscribes': {
		input: SendGridEndpointInputSchemas.suppressionsGetGlobalUnsubscribes,
		output: SendGridEndpointOutputSchemas.suppressionsGetGlobalUnsubscribes,
	},
	'suppressions.addGlobalUnsubscribes': {
		input: SendGridEndpointInputSchemas.suppressionsAddGlobalUnsubscribes,
		output: SendGridEndpointOutputSchemas.suppressionsAddGlobalUnsubscribes,
	},
	'suppressions.getGlobalUnsubscribe': {
		input: SendGridEndpointInputSchemas.suppressionsGetGlobalUnsubscribe,
		output: SendGridEndpointOutputSchemas.suppressionsGetGlobalUnsubscribe,
	},
	'suppressions.deleteGlobalUnsubscribe': {
		input: SendGridEndpointInputSchemas.suppressionsDeleteGlobalUnsubscribe,
		output: SendGridEndpointOutputSchemas.suppressionsDeleteGlobalUnsubscribe,
	},
	'asm.getGroups': {
		input: SendGridEndpointInputSchemas.asmGetGroups,
		output: SendGridEndpointOutputSchemas.asmGetGroups,
	},
	'asm.createGroup': {
		input: SendGridEndpointInputSchemas.asmCreateGroup,
		output: SendGridEndpointOutputSchemas.asmCreateGroup,
	},
	'asm.getGroup': {
		input: SendGridEndpointInputSchemas.asmGetGroup,
		output: SendGridEndpointOutputSchemas.asmGetGroup,
	},
	'asm.updateGroup': {
		input: SendGridEndpointInputSchemas.asmUpdateGroup,
		output: SendGridEndpointOutputSchemas.asmUpdateGroup,
	},
	'asm.deleteGroup': {
		input: SendGridEndpointInputSchemas.asmDeleteGroup,
		output: SendGridEndpointOutputSchemas.asmDeleteGroup,
	},
	'asm.addGroupSuppressions': {
		input: SendGridEndpointInputSchemas.asmAddGroupSuppressions,
		output: SendGridEndpointOutputSchemas.asmAddGroupSuppressions,
	},
	'asm.getGroupSuppressions': {
		input: SendGridEndpointInputSchemas.asmGetGroupSuppressions,
		output: SendGridEndpointOutputSchemas.asmGetGroupSuppressions,
	},
	'asm.deleteGroupSuppression': {
		input: SendGridEndpointInputSchemas.asmDeleteGroupSuppression,
		output: SendGridEndpointOutputSchemas.asmDeleteGroupSuppression,
	},
	'stats.getGlobal': {
		input: SendGridEndpointInputSchemas.statsGetGlobal,
		output: SendGridEndpointOutputSchemas.statsGetGlobal,
	},
	'stats.getCategory': {
		input: SendGridEndpointInputSchemas.statsGetCategory,
		output: SendGridEndpointOutputSchemas.statsGetCategory,
	},
	'stats.getMailboxProvider': {
		input: SendGridEndpointInputSchemas.statsGetMailboxProvider,
		output: SendGridEndpointOutputSchemas.statsGetMailboxProvider,
	},
	'stats.getGeo': {
		input: SendGridEndpointInputSchemas.statsGetGeo,
		output: SendGridEndpointOutputSchemas.statsGetGeo,
	},
	'stats.getDevice': {
		input: SendGridEndpointInputSchemas.statsGetDevice,
		output: SendGridEndpointOutputSchemas.statsGetDevice,
	},
	'stats.getClient': {
		input: SendGridEndpointInputSchemas.statsGetClient,
		output: SendGridEndpointOutputSchemas.statsGetClient,
	},
	'user.getProfile': {
		input: SendGridEndpointInputSchemas.userGetProfile,
		output: SendGridEndpointOutputSchemas.userGetProfile,
	},
	'user.getAccount': {
		input: SendGridEndpointInputSchemas.userGetAccount,
		output: SendGridEndpointOutputSchemas.userGetAccount,
	},
	'user.getCredits': {
		input: SendGridEndpointInputSchemas.userGetCredits,
		output: SendGridEndpointOutputSchemas.userGetCredits,
	},
	'user.getUsername': {
		input: SendGridEndpointInputSchemas.userGetUsername,
		output: SendGridEndpointOutputSchemas.userGetUsername,
	},
	'user.getEmail': {
		input: SendGridEndpointInputSchemas.userGetEmail,
		output: SendGridEndpointOutputSchemas.userGetEmail,
	},
	'user.getScopes': {
		input: SendGridEndpointInputSchemas.userGetScopes,
		output: SendGridEndpointOutputSchemas.userGetScopes,
	},
	'apiKeys.create': {
		input: SendGridEndpointInputSchemas.apiKeysCreate,
		output: SendGridEndpointOutputSchemas.apiKeysCreate,
	},
	'apiKeys.getAll': {
		input: SendGridEndpointInputSchemas.apiKeysGetAll,
		output: SendGridEndpointOutputSchemas.apiKeysGetAll,
	},
	'apiKeys.get': {
		input: SendGridEndpointInputSchemas.apiKeysGet,
		output: SendGridEndpointOutputSchemas.apiKeysGet,
	},
	'apiKeys.update': {
		input: SendGridEndpointInputSchemas.apiKeysUpdate,
		output: SendGridEndpointOutputSchemas.apiKeysUpdate,
	},
	'apiKeys.remove': {
		input: SendGridEndpointInputSchemas.apiKeysRemove,
		output: SendGridEndpointOutputSchemas.apiKeysRemove,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof sendGridEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const sendGridEndpointMeta = {
	'mail.send': {
		riskLevel: 'write',
		description: 'Send an email via SendGrid Mail Send API v3',
	},
	'mail.createBatchId': {
		riskLevel: 'write',
		description: 'Create a batch ID for scheduled mail',
	},
	'mail.validateBatchId': {
		riskLevel: 'read',
		description: 'Validate a mail batch ID',
	},
	'mail.cancelScheduledSend': {
		riskLevel: 'write',
		description: 'Cancel or pause a scheduled send',
	},
	'mail.listScheduledSends': {
		riskLevel: 'read',
		description: 'Retrieve all scheduled sends',
	},
	'mail.getScheduledSend': {
		riskLevel: 'read',
		description: 'Retrieve a scheduled send by batch ID',
	},
	'mail.updateScheduledSend': {
		riskLevel: 'write',
		description: 'Update a scheduled send status',
	},
	'mail.deleteScheduledSend': {
		riskLevel: 'write',
		description: 'Delete a cancellation/pause for a scheduled send',
	},
	'contacts.addOrUpdate': {
		riskLevel: 'write',
		description: 'Add or update contacts in SendGrid Marketing',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Get a marketing contact by ID',
	},
	'contacts.search': {
		riskLevel: 'read',
		description: 'Search marketing contacts with SGQL',
	},
	'contacts.searchEmails': {
		riskLevel: 'read',
		description: 'Search marketing contacts by email',
	},
	'contacts.remove': {
		riskLevel: 'write',
		description: 'Delete marketing contacts by ID',
	},
	'contacts.getCount': {
		riskLevel: 'read',
		description: 'Get marketing contact count',
	},
	'contacts.getSample': {
		riskLevel: 'read',
		description: 'Get a sample of marketing contacts',
	},
	'contacts.import': {
		riskLevel: 'write',
		description: 'Create a marketing contacts import job',
	},
	'contacts.importStatus': {
		riskLevel: 'read',
		description: 'Get a marketing contacts import job',
	},
	'contacts.export': {
		riskLevel: 'write',
		description: 'Create a marketing contacts export job',
	},
	'contacts.exportStatus': {
		riskLevel: 'read',
		description: 'Get a marketing contacts export job',
	},
	'contacts.listExports': {
		riskLevel: 'read',
		description: 'List marketing contacts export jobs',
	},
	'lists.getAll': {
		riskLevel: 'read',
		description: 'Retrieve all marketing contact lists',
	},
	'lists.create': {
		riskLevel: 'write',
		description: 'Create a new marketing contact list',
	},
	'lists.get': {
		riskLevel: 'read',
		description: 'Get a marketing list by ID',
	},
	'lists.update': {
		riskLevel: 'write',
		description: 'Update a marketing list',
	},
	'lists.remove': {
		riskLevel: 'write',
		description: 'Delete a marketing list',
	},
	'lists.getContactCount': {
		riskLevel: 'read',
		description: 'Get contact count for a marketing list',
	},
	'lists.removeContacts': {
		riskLevel: 'write',
		description: 'Remove contacts from a marketing list',
	},
	'segments.create': {
		riskLevel: 'write',
		description: 'Create a Marketing Campaigns segment 2.0',
	},
	'segments.getAll': {
		riskLevel: 'read',
		description: 'Get all Marketing Campaigns segments 2.0',
	},
	'segments.get': {
		riskLevel: 'read',
		description: 'Get a Marketing Campaigns segment 2.0',
	},
	'segments.update': {
		riskLevel: 'write',
		description: 'Update a Marketing Campaigns segment 2.0',
	},
	'segments.remove': {
		riskLevel: 'write',
		description: 'Delete a Marketing Campaigns segment 2.0',
	},
	'segments.refresh': {
		riskLevel: 'write',
		description: 'Manually refresh a Marketing Campaigns segment 2.0',
	},
	'fields.getAll': {
		riskLevel: 'read',
		description: 'Get all marketing field definitions',
	},
	'fields.create': {
		riskLevel: 'write',
		description: 'Create a custom field definition',
	},
	'fields.update': {
		riskLevel: 'write',
		description: 'Update a custom field definition',
	},
	'fields.remove': {
		riskLevel: 'write',
		description: 'Delete a custom field definition',
	},
	'senders.getAll': {
		riskLevel: 'read',
		description: 'Retrieve verified senders',
	},
	'senders.create': {
		riskLevel: 'write',
		description: 'Create a verified sender',
	},
	'senders.update': {
		riskLevel: 'write',
		description: 'Update a verified sender',
	},
	'senders.remove': {
		riskLevel: 'write',
		description: 'Delete a verified sender',
	},
	'senders.resend': {
		riskLevel: 'write',
		description: 'Resend verified sender verification',
	},
	'senders.listIdentities': {
		riskLevel: 'read',
		description: 'Get Marketing Campaigns sender identities',
	},
	'senders.createIdentity': {
		riskLevel: 'write',
		description: 'Create a Marketing Campaigns sender identity',
	},
	'senders.getIdentity': {
		riskLevel: 'read',
		description: 'Get a Marketing Campaigns sender identity',
	},
	'templates.create': {
		riskLevel: 'write',
		description: 'Create a transactional template',
	},
	'templates.getAll': {
		riskLevel: 'read',
		description: 'Get all transactional templates',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Get a transactional template',
	},
	'templates.update': {
		riskLevel: 'write',
		description: 'Update a transactional template',
	},
	'templates.remove': {
		riskLevel: 'write',
		description: 'Delete a transactional template',
	},
	'templates.createVersion': {
		riskLevel: 'write',
		description: 'Create a transactional template version',
	},
	'templates.getVersion': {
		riskLevel: 'read',
		description: 'Get a transactional template version',
	},
	'templates.updateVersion': {
		riskLevel: 'write',
		description: 'Update a transactional template version',
	},
	'templates.removeVersion': {
		riskLevel: 'write',
		description: 'Delete a transactional template version',
	},
	'templates.activateVersion': {
		riskLevel: 'write',
		description: 'Activate a transactional template version',
	},
	'suppressions.getBounces': {
		riskLevel: 'read',
		description: 'Retrieve email bounce suppressions',
	},
	'suppressions.getBounce': {
		riskLevel: 'read',
		description: 'Retrieve a bounce by email',
	},
	'suppressions.deleteBounce': {
		riskLevel: 'write',
		description: 'Delete a bounce by email',
	},
	'suppressions.deleteBounces': {
		riskLevel: 'write',
		description: 'Delete bounce suppressions',
	},
	'suppressions.getBlocks': {
		riskLevel: 'read',
		description: 'Retrieve blocked emails',
	},
	'suppressions.getBlock': {
		riskLevel: 'read',
		description: 'Retrieve a block by email',
	},
	'suppressions.deleteBlock': {
		riskLevel: 'write',
		description: 'Delete a block by email',
	},
	'suppressions.deleteBlocks': {
		riskLevel: 'write',
		description: 'Delete blocked emails',
	},
	'suppressions.getSpamReports': {
		riskLevel: 'read',
		description: 'Retrieve spam reports',
	},
	'suppressions.getSpamReport': {
		riskLevel: 'read',
		description: 'Retrieve a spam report by email',
	},
	'suppressions.deleteSpamReport': {
		riskLevel: 'write',
		description: 'Delete a spam report by email',
	},
	'suppressions.deleteSpamReports': {
		riskLevel: 'write',
		description: 'Delete spam reports',
	},
	'suppressions.getInvalidEmails': {
		riskLevel: 'read',
		description: 'Retrieve invalid emails',
	},
	'suppressions.getInvalidEmail': {
		riskLevel: 'read',
		description: 'Retrieve an invalid email',
	},
	'suppressions.deleteInvalidEmail': {
		riskLevel: 'write',
		description: 'Delete an invalid email',
	},
	'suppressions.deleteInvalidEmails': {
		riskLevel: 'write',
		description: 'Delete invalid emails',
	},
	'suppressions.getGlobalUnsubscribes': {
		riskLevel: 'read',
		description: 'Retrieve global unsubscribes',
	},
	'suppressions.addGlobalUnsubscribes': {
		riskLevel: 'write',
		description: 'Add emails to the global unsubscribe list',
	},
	'suppressions.getGlobalUnsubscribe': {
		riskLevel: 'read',
		description: 'Retrieve a global unsubscribe by email',
	},
	'suppressions.deleteGlobalUnsubscribe': {
		riskLevel: 'write',
		description: 'Delete a global unsubscribe by email',
	},
	'asm.getGroups': {
		riskLevel: 'read',
		description: 'Retrieve unsubscribe groups',
	},
	'asm.createGroup': {
		riskLevel: 'write',
		description: 'Create an unsubscribe group',
	},
	'asm.getGroup': {
		riskLevel: 'read',
		description: 'Retrieve an unsubscribe group',
	},
	'asm.updateGroup': {
		riskLevel: 'write',
		description: 'Update an unsubscribe group',
	},
	'asm.deleteGroup': {
		riskLevel: 'write',
		description: 'Delete an unsubscribe group',
	},
	'asm.addGroupSuppressions': {
		riskLevel: 'write',
		description: 'Add suppressions to an unsubscribe group',
	},
	'asm.getGroupSuppressions': {
		riskLevel: 'read',
		description: 'Retrieve suppressions for an unsubscribe group',
	},
	'asm.deleteGroupSuppression': {
		riskLevel: 'write',
		description: 'Delete a suppression from an unsubscribe group',
	},
	'stats.getGlobal': {
		riskLevel: 'read',
		description: 'Retrieve global email statistics',
	},
	'stats.getCategory': {
		riskLevel: 'read',
		description: 'Retrieve category statistics',
	},
	'stats.getMailboxProvider': {
		riskLevel: 'read',
		description: 'Retrieve mailbox provider statistics',
	},
	'stats.getGeo': {
		riskLevel: 'read',
		description: 'Retrieve geographic statistics',
	},
	'stats.getDevice': {
		riskLevel: 'read',
		description: 'Retrieve device statistics',
	},
	'stats.getClient': {
		riskLevel: 'read',
		description: 'Retrieve email client statistics',
	},
	'user.getProfile': {
		riskLevel: 'read',
		description: 'Retrieve the user profile',
	},
	'user.getAccount': {
		riskLevel: 'read',
		description: 'Retrieve the user account',
	},
	'user.getCredits': {
		riskLevel: 'read',
		description: 'Retrieve remaining email credits',
	},
	'user.getUsername': {
		riskLevel: 'read',
		description: 'Retrieve the account username',
	},
	'user.getEmail': {
		riskLevel: 'read',
		description: 'Retrieve the account email address',
	},
	'user.getScopes': {
		riskLevel: 'read',
		description: 'Retrieve API key scopes for the current key',
	},
	'apiKeys.create': {
		riskLevel: 'write',
		description: 'Create an API key',
	},
	'apiKeys.getAll': {
		riskLevel: 'read',
		description: 'Retrieve all API keys',
	},
	'apiKeys.get': {
		riskLevel: 'read',
		description: 'Retrieve an API key',
	},
	'apiKeys.update': {
		riskLevel: 'write',
		description: 'Update an API key name or scopes',
	},
	'apiKeys.remove': {
		riskLevel: 'write',
		description: 'Delete an API key',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof sendGridEndpointsNested>;

export const sendGridAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSendGridPlugin<T extends SendGridPluginOptions> = CorsairPlugin<
	'sendgrid',
	typeof SendGridSchema,
	typeof sendGridEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalSendGridPlugin = BaseSendGridPlugin<SendGridPluginOptions>;

export type ExternalSendGridPlugin<T extends SendGridPluginOptions> =
	BaseSendGridPlugin<T>;

export function sendgrid<const T extends SendGridPluginOptions>(
	incomingOptions: SendGridPluginOptions & T = {} as SendGridPluginOptions & T,
): ExternalSendGridPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'sendgrid',
		authConfig: sendGridAuthConfig,
		schema: SendGridSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: sendGridEndpointsNested,
		webhooks: {},
		endpointMeta: sendGridEndpointMeta,
		endpointSchemas: sendGridEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SendGridKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('sendgrid', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('sendgrid', 'api_key');
		},
	} satisfies InternalSendGridPlugin;
}

export type {
	ContactsAddOrUpdateInput,
	ContactsAddOrUpdateOutput,
	ListsCreateInput,
	ListsCreateOutput,
	ListsGetAllInput,
	ListsGetAllOutput,
	MailSendInput,
	MailSendOutput,
	SendersGetAllInput,
	SendersGetAllOutput,
	SendGridEndpointInputs,
	SendGridEndpointOutputs,
	SuppressionsGetBouncesInput,
	SuppressionsGetBouncesOutput,
} from './endpoints/types';
