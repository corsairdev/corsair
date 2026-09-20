import {
	enrichCompany,
	enrichContact,
	enrichIntent,
	enrichLocation,
	enrichNews,
	enrichScoop,
	enrichTechnology,
} from './enrichments';
import {
	getCompanySearchInputFields,
	getContactSearchInputFields,
	getIntentSearchInputFields,
	getNewsSearchInputFields,
	getScoopSearchInputFields,
} from './input-fields';
import {
	searchCompanies,
	searchContacts,
	searchIntent,
	searchNews,
	searchScoops,
} from './searches';

export const Zoominfo = {
	searchCompanies,
	searchContacts,
	searchIntent,
	searchNews,
	searchScoops,
	enrichCompany,
	enrichContact,
	enrichIntent,
	enrichLocation,
	enrichNews,
	enrichScoop,
	enrichTechnology,
	getCompanySearchInputFields,
	getContactSearchInputFields,
	getIntentSearchInputFields,
	getNewsSearchInputFields,
	getScoopSearchInputFields,
};

export * from './types';
