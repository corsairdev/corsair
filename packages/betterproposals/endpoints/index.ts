import {
	create as companiesCreate,
	get as companiesGet,
	list as companiesList,
} from './companies';
import { get as currenciesGet, list as currenciesList } from './currencies';
import {
	create as documentTypesCreate,
	list as documentTypesList,
} from './document-types';
import {
	createCover as proposalsCreateCover,
	get as proposalsGet,
	getCount as proposalsGetCount,
	getNew as proposalsGetNew,
	getOpened as proposalsGetOpened,
	getPaid as proposalsGetPaid,
	getSent as proposalsGetSent,
	getSigned as proposalsGetSigned,
	list as proposalsList,
} from './proposals';
import { get as quotesGet, list as quotesList } from './quotes';
import {
	get as settingsGet,
	getBrand as settingsGetBrand,
	listMergeTags as settingsListMergeTags,
} from './settings';
import { get as templatesGet, list as templatesList } from './templates';

export const Proposals = {
	list: proposalsList,
	getNew: proposalsGetNew,
	getOpened: proposalsGetOpened,
	getSent: proposalsGetSent,
	getSigned: proposalsGetSigned,
	getPaid: proposalsGetPaid,
	get: proposalsGet,
	getCount: proposalsGetCount,
	createCover: proposalsCreateCover,
};

export const Templates = {
	list: templatesList,
	get: templatesGet,
};

export const DocumentTypes = {
	list: documentTypesList,
	create: documentTypesCreate,
};

export const Quotes = {
	list: quotesList,
	get: quotesGet,
};

export const Companies = {
	list: companiesList,
	get: companiesGet,
	create: companiesCreate,
};

export const Currencies = {
	list: currenciesList,
	get: currenciesGet,
};

export const Settings = {
	get: settingsGet,
	getBrand: settingsGetBrand,
	listMergeTags: settingsListMergeTags,
};

export * from './types';
