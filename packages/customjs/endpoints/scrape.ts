import type { CustomjsEndpoints } from '..';
import { SCRAPE_TIMEOUT_MS } from '../client';
import { call } from './call';
import {
	CustomjsEndpointInputSchemas as Inputs,
	CustomjsEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Command mode on the AI scraper: exact browser steps, no model tokens per step.
 *
 * The older `/scraper` route is not wrapped. It answered 500 with its own
 * documented payload ("TypeError: r is not iterable"), so exposing it would give
 * callers a route that cannot work.
 *
 * Not replayable: `type` and `click` can submit a form, and `evaluate` runs
 * arbitrary JavaScript in the page, so a 5xx may arrive after that write landed.
 */
export const page: CustomjsEndpoints['scrapePage'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scrape.page',
			input: Inputs.scrapePage,
			output: Outputs.scrapePage,
			reader: 'json',
			replayable: false,
		},
		input,
		({ url, commands, returnType }) => ({
			method: 'POST',
			path: '/ai-scraper',
			timeoutMs: SCRAPE_TIMEOUT_MS,
			body: {
				input: {
					...(url === undefined ? {} : { url }),
					commands,
					...(returnType === undefined ? {} : { returnType }),
				},
			},
		}),
		{
			log: (parsed, result) => ({
				host: parsed.url === undefined ? undefined : new URL(parsed.url).host,
				commands: parsed.commands.length,
				returnType: parsed.returnType ?? 'json',
				steps: result.steps ?? undefined,
			}),
		},
	);

/**
 * Agentic mode: a prompt instead of steps, and CustomJS drives the browser.
 * `credentials` is withheld from the log.
 */
export const agent: CustomjsEndpoints['scrapeAgent'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scrape.agent',
			input: Inputs.scrapeAgent,
			output: Outputs.scrapeAgent,
			reader: 'json',
			replayable: false,
		},
		input,
		({ goal, url, maxSteps, output, credentials }) => ({
			method: 'POST',
			path: '/ai-scraper',
			timeoutMs: SCRAPE_TIMEOUT_MS,
			body: {
				input: {
					goal,
					...(url === undefined ? {} : { url }),
					...(maxSteps === undefined ? {} : { maxSteps }),
					...(output === undefined ? {} : { output }),
					...(credentials === undefined ? {} : { credentials }),
				},
			},
		}),
		{
			log: (parsed, result) => ({
				goalLength: parsed.goal.length,
				maxSteps: parsed.maxSteps ?? 10,
				output: parsed.output ?? 'ai_extract',
				usedCredentials: parsed.credentials !== undefined,
				steps: result.steps ?? undefined,
				totalTokens: result.usage?.totalTokens ?? undefined,
			}),
		},
	);
