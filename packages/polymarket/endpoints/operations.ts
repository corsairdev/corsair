import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse } from 'corsair/http';
import type { PolymarketRequest } from '../client';
import { encodePolymarketPathValue, makePolymarketRequest } from '../client';
import type { PolymarketContext } from '../index';
import {
	getPolymarketInputSchema,
	getPolymarketOutputSchema,
	MASKED_KEY,
	maskedIssuePath,
	polymarketInputFields,
	polymarketOperationFor,
} from './openapi-schema';
import type {
	PolymarketOperationId,
	PolymarketOperationInputs,
	PolymarketOperationOutputs,
} from './operation-types';

export type PolymarketOperationEndpoint<Id extends PolymarketOperationId> =
	CorsairEndpoint<
		PolymarketContext,
		PolymarketOperationInputs[Id],
		PolymarketOperationOutputs[Id]
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
										polymarketInputFields(id)
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

// `unknown` because the value came from core's binary transport.
function isBinaryResponse(value: unknown): value is BinaryResponse {
	return (
		typeof value === 'object' &&
		value !== null &&
		'bytes' in value &&
		value.bytes instanceof Uint8Array
	);
}

/**
 * One endpoint per manifest operation. The caller passes one flat object;
 * each named field goes to the path or query string as the route says, and
 * everything else is the JSON body.
 */
export function createPolymarketOperation<Id extends PolymarketOperationId>(
	id: Id,
): PolymarketOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = polymarketOperationFor(id);
		const parsedInput = getPolymarketInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for polymarket ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars.
		const query: Record<string, unknown> = {};
		const headers: Record<string, string> = {};
		// `unknown` because body values are validated per operation.
		const body: Record<string, unknown> = {};
		// `unknown` because a raw body is a validated list or object.
		let rawBody: unknown;
		const named = new Set<string>();
		for (const field of polymarketInputFields(id)) {
			named.add(field.name);
			const value = valid[field.name];
			if (value === undefined) continue;
			if (value === null && field.in !== 'body') continue;
			switch (field.in) {
				case 'path':
					pathParameters[field.wire] = encodePolymarketPathValue(String(value));
					break;
				case 'query':
					query[field.wire] = value;
					break;
				case 'header':
					headers[field.wire] = String(value);
					break;
				case 'body-raw':
					rawBody = value;
					break;
				default:
					body[field.wire] = value;
			}
		}
		// Keys the schema let through (objects keep unknown keys, such as a
		// field Polymarket adds) go in the body.
		for (const [name, value] of Object.entries(valid)) {
			if (!named.has(name) && value !== undefined) body[name] = value;
		}

		const request: PolymarketRequest = {
			host: operation.host,
			auth: operation.auth,
			method: operation.method,
			path: operation.path,
			pathParameters,
			query,
			headers,
		};
		if (operation.request === 'json') request.body = body;
		if (operation.request === 'json-raw') request.body = rawBody;

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown;
		if (operation.response === 'json' && !operation.emptyOk) {
			response = await makePolymarketRequest(ctx, request);
		} else {
			request.responseType = 'binary';
			const binary = await makePolymarketRequest(ctx, request);
			const text = isBinaryResponse(binary)
				? new TextDecoder().decode(binary.bytes)
				: '';
			if (operation.response === 'text') {
				response = { text };
			} else if (text.trim() === '') {
				response = { success: true };
			} else {
				try {
					response = JSON.parse(text);
				} catch {
					throw new Error(
						`Polymarket ${id} answered with a body that is not JSON`,
					);
				}
			}
		}

		// The output schema is built from the route's own schema; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getPolymarketOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`Polymarket ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold wallet addresses, orders and signatures:
		// log only which operation ran.
		await logEventFromContext(
			ctx,
			'polymarket.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as PolymarketOperationOutputs[Id];
	};
}
