import { asRecord, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { EnigmaContext } from '..';
import type { EnigmaGraphQLRequest } from '../client';
import { makeEnigmaRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: EnigmaContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => EnigmaGraphQLRequest,
	options: {
		// unknown: raw is the GraphQL data object, undefined when there is none.
		// The output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeEnigmaRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`enigma.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

// unknown: a GraphQL connection: { edges: [{ node }], pageInfo }.
export function connectionNodes(
	connection: unknown,
): Record<string, unknown>[] {
	const record = asRecord(connection);
	const edges = Array.isArray(record?.edges) ? record.edges : [];
	return edges.flatMap((edge) => {
		const node = asRecord(asRecord(edge)?.node);
		return node ? [node] : [];
	});
}

// unknown: a GraphQL connection like the one connectionNodes reads.
export function connectionPageInfo(connection: unknown): {
	hasNextPage: boolean | null;
	endCursor: string | null;
} {
	const info = asRecord(asRecord(connection)?.pageInfo);
	const hasNextPage = info?.hasNextPage;
	const endCursor = info?.endCursor;
	return {
		hasNextPage: typeof hasNextPage === 'boolean' ? hasNextPage : null,
		endCursor: typeof endCursor === 'string' ? endCursor : null,
	};
}

// unknown: a GraphQL connection like the one connectionNodes reads.
export function nodeStrings(connection: unknown, field: string): string[] {
	return connectionNodes(connection).flatMap((node) => {
		const value = node[field];
		return typeof value === 'string' && value.length > 0 ? [value] : [];
	});
}

// unknown: the first node of a connection, null when the connection is empty.
export function firstNode(connection: unknown): Record<string, unknown> | null {
	return connectionNodes(connection)[0] ?? null;
}

// unknown: a GraphQL node whose fields are untyped until read.
export function readString(
	node: Record<string, unknown> | null,
	field: string,
): string | null {
	const value = node?.[field];
	return typeof value === 'string' && value.length > 0 ? value : null;
}

// unknown: a GraphQL node like the one readString takes.
export function readNumber(
	node: Record<string, unknown> | null,
	field: string,
): number | null {
	const value = node?.[field];
	return typeof value === 'number' ? value : null;
}
