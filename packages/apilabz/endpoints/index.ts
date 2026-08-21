import { listTables as airtableListTables } from './airtable';
import { integrate as dealsIntegrate } from './deals';
import { validate as ibanValidate } from './iban';
import { aiSearchEngine as trelloAiSearchEngine } from './trello';

export const Airtable = {
	listTables: airtableListTables,
};

export const Deals = {
	integrate: dealsIntegrate,
};

export const Trello = {
	aiSearchEngine: trelloAiSearchEngine,
};

export const Iban = {
	validate: ibanValidate,
};

export * from './types';
