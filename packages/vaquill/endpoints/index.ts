import { creditsBalance, creditsPricing } from './account';
import {
	boards,
	watchChangeDiff,
	watchChanges,
	watchDeliveries,
	watchesCreate,
	watchesDelete,
	watchesList,
	watchesTest,
	watchesUpdate,
} from './alerts';
import {
	section,
	sectionBody,
	sectionChanges,
	sectionCitedBy,
	sectionCrossState,
	sectionDefinitions,
	sectionRelated,
	sections,
} from './sections';
import {
	get as sessionLaw,
	body as sessionLawBody,
	batch as sessionLawsBatch,
	changes as sessionLawsChanges,
	list as sessionLawsList,
	search as sessionLawsSearch,
} from './session-laws';
import {
	count,
	coverage,
	divisions,
	enactments,
	extractCitations,
	resolve,
	resolveCitation,
	search,
} from './statutes';

export const Statutes = {
	search,
	count,
	coverage,
	divisions,
	resolve,
	resolveCitation,
	section,
	sections,
	sectionBody,
	sectionChanges,
	sectionCitedBy,
	sectionCrossState,
	sectionDefinitions,
	sectionRelated,
	enactments,
	extractCitations,
};

export const SessionLaws = {
	changes: sessionLawsChanges,
	batch: sessionLawsBatch,
	search: sessionLawsSearch,
	list: sessionLawsList,
	body: sessionLawBody,
	get: sessionLaw,
};

export const Alerts = {
	boards,
	watchesList,
	watchesCreate,
	watchesTest,
	watchesUpdate,
	watchesDelete,
	watchChanges,
	watchChangeDiff,
	watchDeliveries,
};

export const Account = {
	creditsBalance,
	creditsPricing,
};

export * from './types';
