import {
	all,
	get as companyGet,
	domain,
	iab,
	logo,
	realtime,
	similar,
	tech,
	traffic,
} from './classify';
import { listV1, listV2, search } from './discovery';

export const Categorize = {
	all,
	realtime,
};

export const Categories = {
	iab,
	listV1,
	listV2,
};

export const Company = {
	get: companyGet,
};

export const Tech = {
	get: tech,
};

export const Logo = {
	get: logo,
};

export const Domain = {
	get: domain,
};

export const SimilarDomains = {
	get: similar,
};

export const Traffic = {
	get: traffic,
};

export const Discovery = {
	search,
};

/** One flat map per group, in the shape `index.ts` registers. */
export const klazifyEndpoints = {
	categorize: Categorize,
	categories: Categories,
	company: Company,
	tech: Tech,
	logo: Logo,
	domain: Domain,
	similarDomains: SimilarDomains,
	traffic: Traffic,
	discovery: Discovery,
} as const;

export * from './types';
