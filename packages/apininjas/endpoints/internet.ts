import { logEventFromContext } from 'corsair/core';
import { makeApiNinjasRequest } from '../client';
import type { ApiNinjasEndpoints } from '../index';
import { auditPayload, withCount } from './logging';
import type { ApiNinjasEndpointOutputs } from './types';

/**
 * Domains, DNS, IP and URL intelligence, page extraction and user agents.
 *
 * Every operation here is a single documented endpoint under
 * https://api.api-ninjas.com. Inputs map one-to-one onto the documented query
 * parameters, so nothing is renamed on the way through.
 */

/**
 * Returns availability, registration lifecycle, and email/hosting
 * intelligence for a given domain name.
 */
export const domain: ApiNinjasEndpoints['internetDomain'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['internetDomain']
	>('domain', ctx.key, {
		version: 'v1',
		query: {
			domain: input.domain,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.internet.domain',
		withCount(auditPayload(input, ['domain']), result),
		'completed',
	);
	return result;
};

/** Returns a list of DNS records associated with a particular domain. */
export const dnsRecords: ApiNinjasEndpoints['internetDnsRecords'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['internetDnsRecords']
	>('dnslookup', ctx.key, {
		version: 'v1',
		query: {
			domain: input.domain,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.internet.dnsRecords',
		withCount(auditPayload(input, ['domain']), result),
		'completed',
	);
	return result;
};

/**
 * Returns a list of MX records associated with a particular domain. Free
 * users receive only data from the first MX record, while premium users
 * get access to all MX records.
 */
export const mxRecords: ApiNinjasEndpoints['internetMxRecords'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['internetMxRecords']
	>('mxlookup', ctx.key, {
		version: 'v1',
		query: {
			domain: input.domain,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.internet.mxRecords',
		withCount(auditPayload(input, ['domain']), result),
		'completed',
	);
	return result;
};

/**
 * Returns domain registration details (e.g. registrar, contact
 * information, expiration date, name servers) for a given domain name.
 */
export const whois: ApiNinjasEndpoints['internetWhois'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['internetWhois']
	>('whois', ctx.key, {
		version: 'v1',
		query: {
			domain: input.domain,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.internet.whois',
		withCount(auditPayload(input, ['domain']), result),
		'completed',
	);
	return result;
};

/**
 * Returns the location of the IP address specified. The response contains
 * both the geographical coordinates (latitude/longitude) as well as the
 * city and country.
 */
export const ipLookup: ApiNinjasEndpoints['internetIpLookup'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['internetIpLookup']
	>('iplookup', ctx.key, {
		version: 'v1',
		query: {
			address: input.address,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.internet.ipLookup',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/**
 * Returns the location of the IP address hosting the URL domain. The
 * response contains both the geographical coordinates (latitude/longitude)
 * as well as the city and country.
 */
export const urlLookup: ApiNinjasEndpoints['internetUrlLookup'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['internetUrlLookup']
	>('urllookup', ctx.key, {
		version: 'v1',
		query: {
			url: input.url,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.internet.urlLookup',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/** Returns the URL information and web page metadata from a given URL. */
export const webpage: ApiNinjasEndpoints['internetWebpage'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['internetWebpage']
	>('webpage', ctx.key, {
		version: 'v1',
		query: {
			url: input.url,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.internet.webpage',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/**
 * Returns the HTML or plaintext data scraped from a given URL. Maximum
 * size of data returned is 2MB.
 */
export const scrape: ApiNinjasEndpoints['internetScrape'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['internetScrape']
	>('webscraper', ctx.key, {
		version: 'v1',
		query: {
			url: input.url,
			text_only: input.text_only,
			user_agent: input.user_agent,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.internet.scrape',
		withCount(auditPayload(input, ['text_only']), result),
		'completed',
	);
	return result;
};

/** Generates a realistic user agent string based on optional parameters. */
export const userAgent: ApiNinjasEndpoints['internetUserAgent'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['internetUserAgent']
	>('useragentgenerate', ctx.key, {
		version: 'v1',
		query: {
			brand: input.brand,
			model: input.model,
			os: input.os,
			browser: input.browser,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.internet.userAgent',
		withCount(auditPayload(input, ['brand', 'model']), result),
		'completed',
	);
	return result;
};
