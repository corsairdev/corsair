import { get as creditsGet } from './credits';
import {
	enrich as enrichmentEnrich,
	getResults as enrichmentGetResults,
} from './enrichment';
import {
	create as leadFinderCreate,
	getResults as leadFinderGetResults,
} from './lead-finder';

export const Credits = {
	get: creditsGet,
};

export const LeadFinder = {
	create: leadFinderCreate,
	getResults: leadFinderGetResults,
};

export const Enrichment = {
	enrich: enrichmentEnrich,
	getResults: enrichmentGetResults,
};

export * from './types';
