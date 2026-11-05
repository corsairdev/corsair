import { asRecord, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { GrafbaseContext } from '..';
import type { GrafbaseRequest } from '../client';
import { makeGrafbaseRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the GraphQL operation, validates the response and
 * logs the event. `shape` picks the operation's root field out of the `data`
 * object and flattens connection paging into `nextCursor`.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: GrafbaseContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => GrafbaseRequest,
	options: {
		// unknown: raw is the GraphQL data object, undefined when Grafbase sent
		// none. The output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeGrafbaseRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`grafbase.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** Flattens one Relay connection page into the shared list output shape. */
export function readPage(
	// unknown: a connection object Grafbase sent, untyped until Grafbase's own
	// output schema parses the pieces below.
	connection: unknown,
): { nodes: unknown[]; hasNextPage: boolean; nextCursor: string | null } {
	const record = asRecord(connection);
	const pageInfo = asRecord(record?.pageInfo);
	return {
		nodes: Array.isArray(record?.nodes) ? record.nodes : [],
		hasNextPage: pageInfo?.hasNextPage === true,
		nextCursor:
			typeof pageInfo?.endCursor === 'string' ? pageInfo.endCursor : null,
	};
}
