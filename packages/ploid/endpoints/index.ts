import { credits, usage } from './account';
import { enrich } from './contacts';
import { cancelRun, getRun, person, resolve } from './person';
import { search, searchCandidates } from './search';

export const Search = {
	search,
	candidates: searchCandidates,
};

export const Person = {
	resolve,
	get: person,
	getRun,
	cancelRun,
};

export const Contacts = {
	enrich,
};

export const Account = {
	credits,
	usage,
};

export * from './types';
