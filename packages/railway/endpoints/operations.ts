import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeRailwayRequest } from '../client';
import type { RailwayContext } from '../index';
import {
	getRailwayInputSchema,
	getRailwayOutputSchema,
	MASKED_KEY,
	maskedIssuePath,
	railwayInputFieldNames,
	railwayOperationFor,
} from './openapi-schema';
import type {
	RailwayOperationId,
	RailwayOperationInputs,
	RailwayOperationOutputs,
} from './operation-types';

export type RailwayOperationEndpoint<Id extends RailwayOperationId> =
	CorsairEndpoint<
		RailwayContext,
		RailwayOperationInputs[Id],
		RailwayOperationOutputs[Id]
	>;

type Issue = {
	path: readonly PropertyKey[];
	message: string;
	code?: string;
	keys?: readonly string[];
};

/**
 * Issue paths and zod's messages, which name what was expected rather than the
 * value sent. Map keys are masked, and so is every unknown key the caller
 * sent; the message lists the fields the operation takes instead.
 */
export function describeIssues(
	id: string,
	issues: readonly Issue[],
	mode: 'input' | 'output',
	limit: number,
): string {
	return issues
		.slice(0, limit)
		.map((issue) => {
			const where =
				maskedIssuePath(id, issue.path, mode) ||
				(mode === 'input' ? 'input' : 'response');
			const unknown = issue.keys?.length ?? 0;
			const message =
				issue.code === 'unrecognized_keys'
					? `${unknown} unknown field${unknown === 1 ? '' : 's'} (${Array(
							unknown,
						)
							.fill(MASKED_KEY)
							.join(', ')})${
							issue.path.length === 0 && mode === 'input'
								? `; this operation takes ${
										railwayInputFieldNames(id).join(', ') || 'no fields'
									}`
								: ''
						}`
					: issue.message;
			return `${where}: ${message}`;
		})
		.join('; ');
}

// `unknown` because a connection is untrusted JSON until the output schema parses it.
function asRecord(value: unknown): Record<string, unknown> | undefined {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}

/**
 * A Relay connection (`{ edges: [{ node }], pageInfo }`) as
 * `{ items, pageInfo }`. A null connection (where the schema allows one)
 * is passed on; anything without an `edges` list is an error.
 */
// `unknown` because the connection is untrusted until the output schema parses it.
export function flattenConnection(value: unknown): unknown {
	if (value === null || value === undefined) return value;
	const connection = asRecord(value);
	if (!connection || !Array.isArray(connection.edges)) {
		// Not a connection at all: refused, never passed on as an empty page.
		throw new Error('Railway answered a list without its edges');
	}
	return {
		items: connection.edges.map((edge) => asRecord(edge)?.node),
		pageInfo: connection.pageInfo,
	};
}

/**
 * One endpoint per root field. The validated input is the GraphQL variables;
 * the document is fixed per operation (built from the schema), so a caller
 * can't add fields or other operations to it.
 */
export function createRailwayOperation<Id extends RailwayOperationId>(
	id: Id,
): RailwayOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = railwayOperationFor(id);
		const parsedInput = getRailwayInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for railway ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// `unknown` because the variables differ per operation; each was just validated.
		const variables: Record<string, unknown> = {};
		for (const [name, value] of Object.entries(parsedInput.data)) {
			if (value !== undefined) variables[name] = value;
		}
		const data = await makeRailwayRequest(ctx, {
			query: operation.document,
			field: operation.field,
			variables,
		});
		const raw = data[operation.field];
		const response = operation.connection ? flattenConnection(raw) : raw;

		// The output schema is built from the selected fields; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getRailwayOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`Railway ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold variable values, secrets, logs and emails:
		// log only which operation ran.
		await logEventFromContext(
			ctx,
			'railway.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as RailwayOperationOutputs[Id];
	};
}
