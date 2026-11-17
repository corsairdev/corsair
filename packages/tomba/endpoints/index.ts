import * as Account from './account';
import * as Company from './company-search';
import * as Domain from './domain';
import * as Finder from './finder';
import * as Verifier from './verifier';

export const AccountEndpoints = {
	get: Account.getAccount,
	rateLimits: Account.rateLimits,
};

export const FinderEndpoints = {
	domainSearch: Finder.domainSearch,
	email: Finder.emailFinder,
	linkedin: Finder.linkedinFinder,
	author: Finder.authorFinder,
	enrich: Finder.emailEnrichment,
	phone: Finder.phoneFinder,
};

export const VerifierEndpoints = {
	email: Verifier.emailVerifier,
	phone: Verifier.phoneValidator,
};

export const CompanyEndpoints = {
	find: Domain.find,
	search: Company.search,
};

export const PersonEndpoints = {
	find: Domain.personFind,
};

export const CombinedEndpoints = {
	find: Domain.combinedFind,
};

export const DomainEndpoints = {
	emailCount: Domain.emailCount,
	emailFormat: Domain.emailFormat,
	location: Domain.location,
	technology: Domain.technology,
	similar: Domain.similar,
	status: Domain.domainStatus,
	suggestions: Domain.suggestions,
	emailSources: Domain.emailSources,
};

export * from './types';
