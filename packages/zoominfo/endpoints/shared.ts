import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ZoominfoContext } from '..';
import { makeZoominfoRequest } from '../client';

/**
 * Contact and scoop searches take names, emails, hashed emails and phone
 * numbers as filters, so the event log records which filters were used and the
 * page requested — never the values themselves.
 */
export function describeInput(input: unknown): Record<string, unknown> {
	if (typeof input !== 'object' || input === null) return { filters: [] };
	const record = input as Record<string, unknown>;
	const filters = Object.keys(record)
		.filter((key) => record[key] !== undefined)
		.filter((key) => key !== 'rpp' && key !== 'page')
		.sort();
	const described: Record<string, unknown> = { filters };
	if (typeof record.rpp === 'number') described.rpp = record.rpp;
	if (typeof record.page === 'number') described.page = record.page;
	return described;
}

/**
 * Runs one ZoomInfo call end to end: validate the caller's input, send it,
 * validate what comes back, then log the call. bind.ts does not parse endpoint
 * schemas, so parsing here is what actually enforces them.
 */
export async function callZoominfo<
	TInput extends z.ZodTypeAny,
	TOutput extends z.ZodTypeAny,
>(
	ctx: ZoominfoContext,
	{
		event,
		path,
		method = 'POST',
		inputSchema,
		outputSchema,
	}: {
		event: string;
		path: string;
		method?: 'GET' | 'POST';
		inputSchema: TInput;
		outputSchema: TOutput;
	},
	input: z.input<TInput>,
): Promise<z.infer<TOutput>> {
	const parsedInput = inputSchema.parse(input) as Record<string, unknown>;

	const raw = await makeZoominfoRequest<unknown>(path, ctx.key, {
		method,
		body: method === 'POST' ? parsedInput : undefined,
	});

	const parsed = outputSchema.parse(raw);

	await logEventFromContext(
		ctx,
		event,
		describeInput(parsedInput),
		'completed',
	);

	return parsed;
}
