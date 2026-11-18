import { defineEndpoint } from './factory';

export const leadsList = defineEndpoint('leads.list');
export const leadsReopen = defineEndpoint('leads.reopen');
export const leadsListFields = defineEndpoint('leads.listFields');
export const leadsDelete = defineEndpoint('leads.delete');
export const leadsUpdateInstallments = defineEndpoint(
	'leads.updateInstallments',
);
export const leadsStages = defineEndpoint('leads.stages');
export const leadsListItems = defineEndpoint('leads.listItems');
export const leadsUndelete = defineEndpoint('leads.undelete');
export const leadsUpdate = defineEndpoint('leads.update');
export const leadsCustomFieldAttributes = defineEndpoint(
	'leads.customFieldAttributes',
);
export const leadsStatus = defineEndpoint('leads.status');
export const leadsInstallments = defineEndpoint('leads.installments');
export const leadsCreate = defineEndpoint('leads.create');
export const leadsCustomfields = defineEndpoint('leads.customfields');
export const leadsGet = defineEndpoint('leads.get');
export const leadsCreateCustomField = defineEndpoint('leads.createCustomField');
export const leadsPostStageset = defineEndpoint('leads.postStageset');
export const leadsReport = defineEndpoint('leads.report');
export const leadsWatch = defineEndpoint('leads.watch');

export const endpoints = {
	leads: {
		list: leadsList,
		reopen: leadsReopen,
		listFields: leadsListFields,
		delete: leadsDelete,
		updateInstallments: leadsUpdateInstallments,
		stages: leadsStages,
		listItems: leadsListItems,
		undelete: leadsUndelete,
		update: leadsUpdate,
		customFieldAttributes: leadsCustomFieldAttributes,
		status: leadsStatus,
		installments: leadsInstallments,
		create: leadsCreate,
		customfields: leadsCustomfields,
		get: leadsGet,
		createCustomField: leadsCreateCustomField,
		postStageset: leadsPostStageset,
		report: leadsReport,
		watch: leadsWatch,
	},
} as const;
