import type { NeutrinoEndpoints } from '..';
import { call } from './call';
import {
	NeutrinoEndpointInputSchemas as Inputs,
	NeutrinoEndpointOutputSchemas as Outputs,
} from './types';

/** Parses a User-Agent string into browser, engine, OS and device fields. */
export const uaLookup: NeutrinoEndpoints['uaLookup'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'web.uaLookup',
			input: Inputs.uaLookup,
			output: Outputs.uaLookup,
		},
		input,
		({ ua }) => ({ method: 'GET', path: '/ua-lookup', query: { ua } }),
		{
			log: (_, result) => ({
				browser: result.name ?? undefined,
				os: result.os ?? undefined,
				mobile: result['is-mobile'] ?? undefined,
			}),
		},
	);

/**
 * Domain facts: whether it is a subdomain, its TLD, its rank, and whether
 * Neutrino's blocklists know it for phishing, malware or spam.
 */
export const domainLookup: NeutrinoEndpoints['domainLookup'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'web.domainLookup',
			input: Inputs.domainLookup,
			output: Outputs.domainLookup,
		},
		input,
		({ host }) => ({
			method: 'GET',
			path: '/domain-lookup',
			query: { host },
		}),
		{
			// The host can be a customer's domain, so it is not logged.
			log: (_, result) => ({
				valid: result.valid ?? undefined,
				malicious: result['is-malicious'] ?? undefined,
			}),
		},
	);

/**
 * Checks a host or IP against 100+ DNSBLs, with one entry per list that was
 * queried. Each entry records whether it listed the host and its response time.
 */
export const hostReputation: NeutrinoEndpoints['hostReputation'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'web.hostReputation',
			input: Inputs.hostReputation,
			output: Outputs.hostReputation,
		},
		input,
		({ host }) => ({
			method: 'GET',
			path: '/host-reputation',
			query: { host },
		}),
		{
			// The host can be a customer's IP address, so it is not logged.
			log: (_, result) => ({
				listed: result['is-listed'] ?? undefined,
				lists: result['list-count'] ?? undefined,
			}),
		},
	);

/**
 * Inspects a URL: its HTTP status, the server's location, and when asked, the
 * page body. Neutrino fetches it, so a URL that redirects is followed by them.
 */
export const urlInfo: NeutrinoEndpoints['urlInfo'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'web.urlInfo',
			input: Inputs.urlInfo,
			output: Outputs.urlInfo,
		},
		input,
		({ url, fetchContent }) => ({
			method: 'GET',
			path: '/url-info',
			query: { url, 'fetch-content': fetchContent },
			// Neutrino loads the page itself, which can take its full 60 s.
			timeoutMs: 75_000,
		}),
		{
			log: (_, result) => ({
				status: result['http-status-message'] ?? undefined,
				ok: result['http-ok'] ?? undefined,
				loadTime: result['load-time'] ?? undefined,
			}),
		},
	);

/**
 * Loads a page in a real browser on Neutrino's side, runs any JavaScript given
 * in `exec` (clicks, form fills) and returns the rendered content and the
 * elements a selector matched. The parameters go in a form body, which is how
 * Neutrino documents this method.
 */
export const browserBot: NeutrinoEndpoints['browserBot'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'web.browserBot',
			input: Inputs.browserBot,
			output: Outputs.browserBot,
		},
		input,
		({
			url,
			timeout,
			delay,
			selector,
			exec,
			userAgent,
			ignoreCertificateErrors,
		}) => ({
			method: 'POST',
			path: '/browser-bot',
			form: {
				url,
				timeout,
				delay,
				selector,
				// Neutrino reads `exec` as one string of statements separated by
				// semicolons or new lines.
				exec: exec?.join('\n'),
				'user-agent': userAgent,
				'ignore-certificate-errors': ignoreCertificateErrors,
			},
			// The page timeout plus the delay, plus margin for Neutrino's own work.
			timeoutMs: ((timeout ?? 30) + (delay ?? 0) + 20) * 1000,
		}),
		{
			log: (_, result) => ({
				status: result['http-status-code'] ?? undefined,
				error: result['is-error'] ?? undefined,
				elements: result.elements?.length ?? undefined,
			}),
		},
	);
