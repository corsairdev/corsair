import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { DefillamaRequest } from '../client';
import { encodeDefillamaPathValue, makeDefillamaRequest } from '../client';
import type { DefillamaContext } from '../index';
import {
	defillamaInputFields,
	defillamaOperationFor,
	getDefillamaInputSchema,
	getDefillamaOutputSchema,
	MASKED_KEY,
	maskedIssuePath,
} from './openapi-schema';
import type {
	DefillamaOperationId,
	DefillamaOperationInputs,
	DefillamaOperationOutputs,
} from './operation-types';

export type DefillamaOperationEndpoint<Id extends DefillamaOperationId> =
	CorsairEndpoint<
		DefillamaContext,
		DefillamaOperationInputs[Id],
		DefillamaOperationOutputs[Id]
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
										defillamaInputFields(id)
											.map((field) => field.name)
											.join(', ') || 'no fields'
									}`
								: ''
						}`
					: issue.message;
			return `${where}: ${message}`;
		})
		.join('; ');
}

/**
 * One endpoint per manifest operation. The caller passes one flat object;
 * each field goes to the path or query string as the route says.
 */
export function createDefillamaOperation<Id extends DefillamaOperationId>(
	id: Id,
): DefillamaOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = defillamaOperationFor(id);
		const parsedInput = getDefillamaInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for defillama ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars and lists.
		const query: Record<string, unknown> = {};
		for (const field of defillamaInputFields(id)) {
			const value = valid[field.name];
			if (value === undefined || value === null) continue;
			if (field.in === 'path') {
				pathParameters[field.wire] = encodeDefillamaPathValue(String(value));
			} else {
				query[field.wire] = value;
			}
		}

		const request: DefillamaRequest = {
			path: operation.path,
			...(operation.free ? { free: operation.free } : {}),
			pathParameters,
			query,
		};
		// `unknown` because the response is untrusted until the output schema parses it.
		const response: unknown = await makeDefillamaRequest(ctx, request);

		// The output schema is built from the route's own schema; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getDefillamaOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`DefiLlama ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Log only which operation ran.
		await logEventFromContext(
			ctx,
			'defillama.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as DefillamaOperationOutputs[Id];
	};
}
