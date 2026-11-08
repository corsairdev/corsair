import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { endpoints as accountTypesEndpoints } from './account-types';
import { endpoints as accountsEndpoints } from './accounts';
import { endpoints as activitiesEndpoints } from './activities';
import { endpoints as activityTypesEndpoints } from './activity-types';
import { endpoints as audiencesEndpoints } from './audiences';
import { endpoints as competitorMapsEndpoints } from './competitor-maps';
import { endpoints as competitorsEndpoints } from './competitors';
import { endpoints as contactsEndpoints } from './contacts';
import { endpoints as dashboardsEndpoints } from './dashboards';
import { endpoints as editionsEndpoints } from './editions';
import { endpoints as emailsEndpoints } from './emails';
import { endpoints as eventsEndpoints } from './events';
import { endpoints as filtersEndpoints } from './filters';
import { endpoints as formsEndpoints } from './forms';
import { endpoints as industriesEndpoints } from './industries';
import { endpoints as invoicesEndpoints } from './invoices';
import { endpoints as leadsEndpoints } from './leads';
import { endpoints as marketsEndpoints } from './markets';
import { endpoints as notesEndpoints } from './notes';
import { endpoints as outcomesEndpoints } from './outcomes';
import { endpoints as productCategoriesEndpoints } from './product-categories';
import { endpoints as productMapsEndpoints } from './product-maps';
import { endpoints as productsEndpoints } from './products';
import { endpoints as quotesEndpoints } from './quotes';
import { endpoints as sourcesEndpoints } from './sources';
import { endpoints as stageSetsEndpoints } from './stage-sets';
import { endpoints as stagesEndpoints } from './stages';
import { endpoints as tagsEndpoints } from './tags';
import { endpoints as tasksEndpoints } from './tasks';
import { endpoints as territoriesEndpoints } from './territories';
import { endpoints as todosEndpoints } from './todos';
import {
	NutshellEndpointInputSchemas,
	NutshellEndpointOutputSchemas,
	NutshellOperationSchemas,
} from './types';
import { endpoints as usersEndpoints } from './users';

export const nutshellEndpoints = {
	...stagesEndpoints,
	...audiencesEndpoints,
	...leadsEndpoints,
	...quotesEndpoints,
	...accountsEndpoints,
	...outcomesEndpoints,
	...tasksEndpoints,
	...marketsEndpoints,
	...productsEndpoints,
	...activitiesEndpoints,
	...sourcesEndpoints,
	...competitorsEndpoints,
	...contactsEndpoints,
	...productMapsEndpoints,
	...invoicesEndpoints,
	...industriesEndpoints,
	...tagsEndpoints,
	...emailsEndpoints,
	...dashboardsEndpoints,
	...editionsEndpoints,
	...notesEndpoints,
	...todosEndpoints,
	...usersEndpoints,
	...productCategoriesEndpoints,
	...accountTypesEndpoints,
	...formsEndpoints,
	...competitorMapsEndpoints,
	...stageSetsEndpoints,
	...eventsEndpoints,
	...filtersEndpoints,
	...territoriesEndpoints,
	...activityTypesEndpoints,
} as const;

export const nutshellEndpointMeta = {
	'stages.list': { riskLevel: 'read', description: 'Get a list of stages' },
	'audiences.list': {
		riskLevel: 'read',
		description: 'Get a list of audiences',
	},
	'leads.list': { riskLevel: 'read', description: 'Get a list of leads' },
	'quotes.list': { riskLevel: 'read', description: 'Get a list of quotes' },
	'accounts.customFieldAttributes': {
		riskLevel: 'read',
		description: 'Get a list of custom fields',
	},
	'outcomes.list': {
		riskLevel: 'read',
		description: 'Get a list of lead outcomes',
	},
	'tasks.get': { riskLevel: 'read', description: 'Get a task' },
	'leads.reopen': { riskLevel: 'write', description: 'Reopen a lead' },
	'markets.get': { riskLevel: 'read', description: 'Get a market by the ID' },
	'products.list': {
		riskLevel: 'read',
		description: 'List or search products',
	},
	'leads.listFields': {
		riskLevel: 'read',
		description: 'Get the fields for a lead',
	},
	'accounts.create': { riskLevel: 'write', description: 'Create an account' },
	'accounts.undelete': {
		riskLevel: 'write',
		description: 'Undelete an account',
	},
	'products.delete': {
		riskLevel: 'destructive',
		description: 'Delete a product',
	},
	'activities.create': {
		riskLevel: 'write',
		description: 'Create an activity',
	},
	'leads.delete': { riskLevel: 'destructive', description: 'Delete a lead' },
	'sources.list': { riskLevel: 'read', description: 'Get a list of sources' },
	'competitors.list': {
		riskLevel: 'read',
		description: 'Get a list of competitors',
	},
	'accounts.delete': {
		riskLevel: 'destructive',
		description: 'Delete an account',
	},
	'leads.updateInstallments': {
		riskLevel: 'write',
		description: 'Update installments for a lead',
	},
	'tasks.list': { riskLevel: 'read', description: 'Get a list of tasks' },
	'contacts.create': { riskLevel: 'write', description: 'Create a contact' },
	'accounts.customfields': {
		riskLevel: 'read',
		description: 'Get custom fields',
	},
	'activities.get': { riskLevel: 'read', description: 'Get an activity' },
	'leads.stages': {
		riskLevel: 'read',
		description: 'Get all stages associated with lead',
	},
	'leads.listItems': {
		riskLevel: 'read',
		description: 'Get list items for all leads',
	},
	'productMaps.update': {
		riskLevel: 'write',
		description: "Update a lead's product information",
	},
	'leads.undelete': { riskLevel: 'write', description: 'Undelete a lead' },
	'invoices.list': { riskLevel: 'read', description: 'Get a list of invoices' },
	'industries.get': {
		riskLevel: 'read',
		description: 'Get a single industry by its ID',
	},
	'tags.list': { riskLevel: 'read', description: 'Get a list of tags' },
	'emails.get': { riskLevel: 'read', description: 'Get an email' },
	'dashboards.listFields': {
		riskLevel: 'read',
		description: 'Get dashboard field definitions',
	},
	'accounts.update': { riskLevel: 'write', description: 'Update an account' },
	'editions.list': { riskLevel: 'read', description: 'Get a list of editions' },
	'productMaps.list': { riskLevel: 'read', description: 'Get lead products' },
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact',
	},
	'accounts.listFields': {
		riskLevel: 'read',
		description: 'Get the fields for an account',
	},
	'sources.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Source',
	},
	'notes.undelete': { riskLevel: 'write', description: 'Undelete a note' },
	'leads.update': { riskLevel: 'write', description: 'Update a lead' },
	'quotes.get': { riskLevel: 'read', description: 'Get a quote' },
	'leads.customFieldAttributes': {
		riskLevel: 'read',
		description: 'Get applicable custom fields for leads',
	},
	'contacts.customfields': {
		riskLevel: 'read',
		description: 'Get contact custom fields',
	},
	'tasks.create': { riskLevel: 'write', description: 'Create a new task' },
	'todos.list': {
		riskLevel: 'read',
		description: 'Get tasks and sales process steps',
	},
	'users.get': { riskLevel: 'read', description: 'Get a user' },
	'contacts.customFieldAttributes': {
		riskLevel: 'read',
		description: 'Get applicable custom fields',
	},
	'productCategories.create': {
		riskLevel: 'write',
		description: 'Create a product category',
	},
	'productCategories.list': {
		riskLevel: 'read',
		description: 'List all product categories',
	},
	'productMaps.get': { riskLevel: 'read', description: 'Get lead product' },
	'leads.status': {
		riskLevel: 'write',
		description: 'Update the status of a lead',
	},
	'accountTypes.list': {
		riskLevel: 'read',
		description: 'Get a list of account types',
	},
	'editions.get': {
		riskLevel: 'read',
		description: 'Get a single edition by its ID',
	},
	'products.undelete': {
		riskLevel: 'write',
		description: 'Undelete a product',
	},
	'tags.delete': { riskLevel: 'destructive', description: 'Delete a tag' },
	'contacts.listItems': {
		riskLevel: 'read',
		description: 'Get list items for all contacts',
	},
	'productMaps.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a product on a lead',
	},
	'leads.installments': {
		riskLevel: 'read',
		description: 'Get installments for a lead',
	},
	'leads.create': { riskLevel: 'write', description: 'Create a lead' },
	'notes.get': { riskLevel: 'read', description: 'Get a note' },
	'industries.list': {
		riskLevel: 'read',
		description: 'Get a list of industries',
	},
	'forms.getFieldId': { riskLevel: 'read', description: 'Get a form field' },
	'leads.customfields': {
		riskLevel: 'read',
		description: "Get a lead's custom fields",
	},
	'competitorMaps.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a lead-competitor relationship',
	},
	'notes.delete': { riskLevel: 'destructive', description: 'Delete a note' },
	'stageSets.list': {
		riskLevel: 'read',
		description: 'Get a list of pipelines',
	},
	'tags.create': { riskLevel: 'write', description: 'Create a tag' },
	'contacts.get': { riskLevel: 'read', description: 'Get a contact' },
	'sources.undelete': { riskLevel: 'write', description: 'Undelete a Source' },
	'tasks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a task',
	},
	'quotes.createInvoice': {
		riskLevel: 'write',
		description: 'Create an invoice from a quote',
	},
	'leads.get': { riskLevel: 'read', description: 'Get a lead' },
	'leads.createCustomField': {
		riskLevel: 'write',
		description: 'Create a custom field',
	},
	'events.list': { riskLevel: 'read', description: 'Get a list of events' },
	'quotes.status': {
		riskLevel: 'write',
		description: 'Update the status of a quote',
	},
	'outcomes.get': {
		riskLevel: 'read',
		description: 'Get a lead outcome by ID',
	},
	'filters.list': { riskLevel: 'read', description: 'Get saved filters' },
	'accounts.createCustomField': {
		riskLevel: 'write',
		description: 'Create a custom field',
	},
	'contacts.listFields': {
		riskLevel: 'read',
		description: 'Get the fields for a contact',
	},
	'markets.list': { riskLevel: 'read', description: 'Get a list of markets' },
	'audiences.create': { riskLevel: 'write', description: 'Create an audience' },
	'leads.postStageset': {
		riskLevel: 'write',
		description: 'Set the pipeline for a lead',
	},
	'forms.list': { riskLevel: 'read', description: 'Get all forms' },
	'stageSets.export': {
		riskLevel: 'read',
		description: 'Get a CSV export of lead movements through a pipeline',
	},
	'activities.list': { riskLevel: 'read', description: 'Get activities' },
	'competitorMaps.get': {
		riskLevel: 'read',
		description: 'Get a lead-competitor relationship',
	},
	'competitorMaps.update': {
		riskLevel: 'write',
		description: 'Update a lead-competitor relationship',
	},
	'invoices.get': { riskLevel: 'read', description: 'Get an invoice' },
	'competitors.get': { riskLevel: 'read', description: 'Get a competitor' },
	'leads.report': { riskLevel: 'read', description: 'Get reports for a lead' },
	'contacts.undelete': {
		riskLevel: 'write',
		description: 'Undelete a contact',
	},
	'leads.watch': { riskLevel: 'write', description: 'Watch a lead' },
	'notes.list': { riskLevel: 'read', description: 'Get a list of notes' },
	'activities.update': {
		riskLevel: 'write',
		description: 'Update an activity',
	},
	'contacts.update': { riskLevel: 'write', description: 'Update a contact' },
	'sources.create': { riskLevel: 'write', description: 'Create a new source' },
	'contacts.list': { riskLevel: 'read', description: 'Get a list of contacts' },
	'territories.list': {
		riskLevel: 'read',
		description: 'Get a list of territories',
	},
	'invoices.status': {
		riskLevel: 'write',
		description: 'Update the status of an invoice',
	},
	'accounts.get': { riskLevel: 'read', description: 'Get an account' },
	'notes.create': { riskLevel: 'write', description: 'Create a note' },
	'activityTypes.list': {
		riskLevel: 'read',
		description: 'Get activity types',
	},
	'users.list': { riskLevel: 'read', description: 'Get a list of users' },
	'forms.get': { riskLevel: 'read', description: 'Get a form' },
	'contacts.createCustomField': {
		riskLevel: 'write',
		description: 'Create a custom field',
	},
	'productCategories.get': {
		riskLevel: 'read',
		description: 'Get a product category',
	},
	'products.get': { riskLevel: 'read', description: 'Get a product' },
	'events.deleted': { riskLevel: 'read', description: 'Get deletion events' },
	'competitorMaps.list': {
		riskLevel: 'read',
		description: 'Get a list of lead-competitor relationships',
	},
	'tags.undelete': { riskLevel: 'write', description: 'Undelete a tag' },
	'tasks.update': { riskLevel: 'write', description: 'Update a task' },
	'accounts.list': { riskLevel: 'read', description: 'Get a list of accounts' },
	'accounts.listItems': {
		riskLevel: 'read',
		description: 'Get list items for all accounts',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof nutshellEndpoints>;

export { NutshellEndpointInputSchemas, NutshellEndpointOutputSchemas };
export { NutshellOperationSchemas as nutshellEndpointSchemas };
export * from './types';
