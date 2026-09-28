import type { SendGridEndpoints } from '..';
import { runCatalogOp } from './bind';
import { SENDGRID_OPS_BY_KEY } from './catalog';

function bind<K extends keyof SendGridEndpoints>(key: K): SendGridEndpoints[K] {
	const spec = SENDGRID_OPS_BY_KEY[key as string];
	if (!spec) {
		throw new Error(`Unknown SendGrid op: ${String(key)}`);
	}
	return (async (ctx, input) =>
		runCatalogOp(
			ctx,
			spec,
			input as Record<string, unknown>,
		)) as SendGridEndpoints[K];
}

export const mail = {
	send: bind('mailSend'),
	createBatchId: bind('mailCreateBatchId'),
	validateBatchId: bind('mailValidateBatchId'),
	cancelScheduledSend: bind('mailCancelScheduledSend'),
	listScheduledSends: bind('mailListScheduledSends'),
	getScheduledSend: bind('mailGetScheduledSend'),
	updateScheduledSend: bind('mailUpdateScheduledSend'),
	deleteScheduledSend: bind('mailDeleteScheduledSend'),
};

export const contacts = {
	addOrUpdate: bind('contactsAddOrUpdate'),
	get: bind('contactsGet'),
	search: bind('contactsSearch'),
	searchEmails: bind('contactsSearchEmails'),
	remove: bind('contactsRemove'),
	getCount: bind('contactsGetCount'),
	getSample: bind('contactsGetSample'),
	import: bind('contactsImport'),
	importStatus: bind('contactsImportStatus'),
	export: bind('contactsExport'),
	exportStatus: bind('contactsExportStatus'),
	listExports: bind('contactsListExports'),
};

export const lists = {
	getAll: bind('listsGetAll'),
	create: bind('listsCreate'),
	get: bind('listsGet'),
	update: bind('listsUpdate'),
	remove: bind('listsRemove'),
	getContactCount: bind('listsGetContactCount'),
	removeContacts: bind('listsRemoveContacts'),
};

export const segments = {
	create: bind('segmentsCreate'),
	getAll: bind('segmentsGetAll'),
	get: bind('segmentsGet'),
	update: bind('segmentsUpdate'),
	remove: bind('segmentsRemove'),
	refresh: bind('segmentsRefresh'),
};

export const fields = {
	getAll: bind('fieldsGetAll'),
	create: bind('fieldsCreate'),
	update: bind('fieldsUpdate'),
	remove: bind('fieldsRemove'),
};

export const senders = {
	getAll: bind('sendersGetAll'),
	create: bind('sendersCreate'),
	update: bind('sendersUpdate'),
	remove: bind('sendersRemove'),
	resend: bind('sendersResend'),
	listIdentities: bind('sendersListIdentities'),
	createIdentity: bind('sendersCreateIdentity'),
	getIdentity: bind('sendersGetIdentity'),
};

export const templates = {
	create: bind('templatesCreate'),
	getAll: bind('templatesGetAll'),
	get: bind('templatesGet'),
	update: bind('templatesUpdate'),
	remove: bind('templatesRemove'),
	createVersion: bind('templatesCreateVersion'),
	getVersion: bind('templatesGetVersion'),
	updateVersion: bind('templatesUpdateVersion'),
	removeVersion: bind('templatesRemoveVersion'),
	activateVersion: bind('templatesActivateVersion'),
};

export const suppressions = {
	getBounces: bind('suppressionsGetBounces'),
	getBounce: bind('suppressionsGetBounce'),
	deleteBounce: bind('suppressionsDeleteBounce'),
	deleteBounces: bind('suppressionsDeleteBounces'),
	getBlocks: bind('suppressionsGetBlocks'),
	getBlock: bind('suppressionsGetBlock'),
	deleteBlock: bind('suppressionsDeleteBlock'),
	deleteBlocks: bind('suppressionsDeleteBlocks'),
	getSpamReports: bind('suppressionsGetSpamReports'),
	getSpamReport: bind('suppressionsGetSpamReport'),
	deleteSpamReport: bind('suppressionsDeleteSpamReport'),
	deleteSpamReports: bind('suppressionsDeleteSpamReports'),
	getInvalidEmails: bind('suppressionsGetInvalidEmails'),
	getInvalidEmail: bind('suppressionsGetInvalidEmail'),
	deleteInvalidEmail: bind('suppressionsDeleteInvalidEmail'),
	deleteInvalidEmails: bind('suppressionsDeleteInvalidEmails'),
	getGlobalUnsubscribes: bind('suppressionsGetGlobalUnsubscribes'),
	addGlobalUnsubscribes: bind('suppressionsAddGlobalUnsubscribes'),
	getGlobalUnsubscribe: bind('suppressionsGetGlobalUnsubscribe'),
	deleteGlobalUnsubscribe: bind('suppressionsDeleteGlobalUnsubscribe'),
};

export const asm = {
	getGroups: bind('asmGetGroups'),
	createGroup: bind('asmCreateGroup'),
	getGroup: bind('asmGetGroup'),
	updateGroup: bind('asmUpdateGroup'),
	deleteGroup: bind('asmDeleteGroup'),
	addGroupSuppressions: bind('asmAddGroupSuppressions'),
	getGroupSuppressions: bind('asmGetGroupSuppressions'),
	deleteGroupSuppression: bind('asmDeleteGroupSuppression'),
};

export const stats = {
	getGlobal: bind('statsGetGlobal'),
	getCategory: bind('statsGetCategory'),
	getMailboxProvider: bind('statsGetMailboxProvider'),
	getGeo: bind('statsGetGeo'),
	getDevice: bind('statsGetDevice'),
	getClient: bind('statsGetClient'),
};

export const user = {
	getProfile: bind('userGetProfile'),
	getAccount: bind('userGetAccount'),
	getCredits: bind('userGetCredits'),
	getUsername: bind('userGetUsername'),
	getEmail: bind('userGetEmail'),
	getScopes: bind('userGetScopes'),
};

export const apiKeys = {
	create: bind('apiKeysCreate'),
	getAll: bind('apiKeysGetAll'),
	get: bind('apiKeysGet'),
	update: bind('apiKeysUpdate'),
	remove: bind('apiKeysRemove'),
};
