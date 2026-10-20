import { suggest } from './autocomplete';
import { company, location, school } from './cleaners';
import { enrich as companyEnrich, search as companySearch } from './company';
import { enrich as ipEnrich } from './ip';
import { search as jobSearch } from './job';
import {
	bulk,
	identify,
	enrich as personEnrich,
	search as personSearch,
} from './person';

export const Person = {
	enrich: personEnrich,
	search: personSearch,
	identify,
	bulk,
};

export const Company = {
	enrich: companyEnrich,
	search: companySearch,
	clean: company,
};

export const School = {
	clean: school,
};

export const Location = {
	clean: location,
};

export const Ip = {
	enrich: ipEnrich,
};

export const Job = {
	search: jobSearch,
};

export const Autocomplete = {
	suggest,
};

export * from './types';
