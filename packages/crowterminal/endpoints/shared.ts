import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { CrowterminalContext } from '..';
import { makeCrowterminalRequest } from '../client';

/**
 * Fields never written to the event log. `secret` is a webhook signing
 * credential; `data`, `agentMd` and `proposedChanges` are caller payloads that
 * are unbounded and may carry creator analytics.
 */
const REDACTED = new Set(['secret', 'data', 'agentMd', 'proposedChanges']);

/**
 * Summarises a call for the event log: scalar arguments are kept as-is,
 * payloads are reduced to their size so a regression is still traceable
 * without copying the body into a second store.
 */
export function describeInput(input: unknown): Record<string, unknown> {
	if (typeof input !== 'object' || input === null) return {};
	const out: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
		if (value === undefined) continue;
		if (REDACTED.has(key)) {
			if (Array.isArray(value)) out[`${key}Count`] = value.length;
			else if (value !== null && typeof value === 'object') {
				out[`${key}Keys`] = Object.keys(value).length;
			} else out[`${key}Present`] = true;
			continue;
		}
		if (Array.isArray(value)) {
			out[`${key}Count`] = value.length;
			continue;
		}
		if (value !== null && typeof value === 'object') continue;
		out[key] = value;
	}

	return out;
}

/**
 * Runs one CrowTerminal call end to end: validate the caller's input, send it,
 * validate the response, then log. bind.ts does not parse endpoint schemas, so
 * parsing here is what actually enforces them.
 */
export async function callCrowterminal<
	TInput extends z.ZodTypeAny,
	TOutput extends z.ZodTypeAny,
>(
	ctx: CrowterminalContext,
	{
		event,
		method = 'GET',
		inputSchema,
		outputSchema,
		path,
		body,
		query,
	}: {
		event: string;
		method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
		inputSchema: TInput;
		outputSchema: TOutput;
		/** Built from the parsed input; path segments must already be encoded. */
		path: (input: z.infer<TInput>) => string;
		body?: (input: z.infer<TInput>) => Record<string, unknown> | undefined;
		query?: (
			input: z.infer<TInput>,
		) => Record<string, string | number | boolean | undefined> | undefined;
	},
	input: z.input<TInput>,
): Promise<z.infer<TOutput>> {
	const parsedInput = inputSchema.parse(input);
	const described = describeInput(parsedInput);

	let parsed: z.infer<TOutput>;
	try {
		const raw = await makeCrowterminalRequest<unknown>(
			path(parsedInput),
			ctx.key,
			{
				method,
				body: body?.(parsedInput),
				query: query?.(parsedInput),
			},
		);
		parsed = outputSchema.parse(raw);
	} catch (error) {
		// Record the attempt before rethrowing, so a failed call leaves a trace
		// rather than a silent gap in the event log.
		await logEventFromContext(ctx, event, described, 'failed');
		throw error;
	}

	await logEventFromContext(ctx, event, described, 'completed');

	return parsed;
}
