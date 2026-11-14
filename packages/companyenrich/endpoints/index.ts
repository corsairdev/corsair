import { accountMe } from './account';
import {
	companiesAutocomplete,
	companiesEnrichBatch,
	companiesEnrichByDomain,
	companiesEnrichByProperties,
	companiesGet,
	companiesSearch,
	companiesSearchCount,
	companiesSearchPreview,
	companiesWorkforce,
} from './companies';
import {
	geoGetCountry,
	geoRegions,
	geoSearchCities,
	geoSearchCountries,
	geoSearchStates,
} from './geo';
import { industriesList } from './industries';
import { keywordsAutocomplete } from './keywords';
import {
	peopleEnrich,
	peopleFindEmail,
	peopleGet,
	peopleSearch,
	peopleSearchCount,
	peopleSearchPreview,
} from './people';
import { positionsAutocomplete } from './positions';
import { technologiesAutocomplete } from './technologies';

export const Companies = {
	get: companiesGet,
	enrichByDomain: companiesEnrichByDomain,
	enrichByProperties: companiesEnrichByProperties,
	enrichBatch: companiesEnrichBatch,
	autocomplete: companiesAutocomplete,
	workforce: companiesWorkforce,
	search: companiesSearch,
	searchCount: companiesSearchCount,
	searchPreview: companiesSearchPreview,
};

export const People = {
	get: peopleGet,
	enrich: peopleEnrich,
	findEmail: peopleFindEmail,
	search: peopleSearch,
	searchCount: peopleSearchCount,
	searchPreview: peopleSearchPreview,
};

export const Geo = {
	regions: geoRegions,
	getCountry: geoGetCountry,
	searchCountries: geoSearchCountries,
	searchStates: geoSearchStates,
	searchCities: geoSearchCities,
};

export const Industries = {
	list: industriesList,
};

export const Keywords = {
	autocomplete: keywordsAutocomplete,
};

export const Technologies = {
	autocomplete: technologiesAutocomplete,
};

export const Positions = {
	autocomplete: positionsAutocomplete,
};

export const Account = {
	me: accountMe,
};

export * from './types';
