import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import type { WoocommerceRequest } from '../client';
import { encodeWoocommercePathValue, makeWoocommerceRequest } from '../client';
import type { WoocommerceContext } from '../index';
import {
	getWoocommerceInputSchema,
	getWoocommerceOutputSchema,
	MASKED_KEY,
	maskedIssuePath,
	woocommerceInputFields,
	woocommerceOperationFor,
} from './openapi-schema';
import type {
	WoocommerceOperationId,
	WoocommerceOperationInputs,
	WoocommerceOperationOutputs,
} from './operation-types';

export type WoocommerceOperationEndpoint<Id extends WoocommerceOperationId> =
	CorsairEndpoint<
		WoocommerceContext,
		WoocommerceOperationInputs[Id],
		WoocommerceOperationOutputs[Id]
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
										woocommerceInputFields(id)
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
 * A query value as PHP reads it. core's transport writes a list as repeated
 * keys (`author=1&author=2`), and PHP keeps only the last one, so a list goes
 * out with indexes instead (`author[0]=1&author[1]=2`), which PHP reads as the
 * list. Objects already go out as `key[field]=value`. Booleans go out as
 * `true` / `false`, which WooCommerce's REST args read as booleans.
 */
// `unknown` because query values are validated scalars, lists and objects.
export function phpQueryValue(value: unknown): unknown {
	if (Array.isArray(value)) {
		return Object.fromEntries(
			value.map((item, index) => [String(index), phpQueryValue(item)]),
		);
	}
	if (typeof value === 'object' && value !== null) {
		return Object.fromEntries(
			Object.entries(value).map(([key, inner]) => [key, phpQueryValue(inner)]),
		);
	}
	return value;
}

/**
 * The page to ask for next. WooCommerce answers exactly `per_page` entries
 * while more remain (it sends the totals in X-WP-Total / X-WP-TotalPages,
 * which core doesn't return), so a full page may have a next one and a short
 * page is the last.
 */
// `unknown` because the input was validated against an open schema.
export function nextPageOf(
	input: Record<string, unknown>,
	count: number,
	defaultSize: number,
): number | null {
	// With `offset`, WooCommerce ignores `page`: the caller pages by offset.
	if (typeof input.offset === 'number') return null;
	const page =
		typeof input.page === 'number' && input.page > 0 ? input.page : 1;
	const size =
		typeof input.per_page === 'number' && input.per_page > 0
			? input.per_page
			: defaultSize;
	return count >= size && count > 0 ? page + 1 : null;
}

/** The answer to a page past the end of a list. */
// `unknown` because anything can be thrown.
export function isPastLastPage(error: unknown): boolean {
	if (!(error instanceof ApiError) || error.status !== 400) return false;
	const body = error.body;
	const code =
		typeof body === 'object' && body !== null && 'code' in body
			? (body as { code?: unknown }).code
			: undefined;
	return typeof code === 'string' && code.endsWith('_invalid_page_number');
}

/**
 * One endpoint per manifest operation. The caller passes one flat object;
 * each named field goes to the path or query string as the route says, and
 * everything else is the JSON body.
 */
export function createWoocommerceOperation<Id extends WoocommerceOperationId>(
	id: Id,
): WoocommerceOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = woocommerceOperationFor(id);
		const parsedInput = getWoocommerceInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for woocommerce ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars, lists and objects.
		const query: Record<string, unknown> = {};
		// `unknown` because body values are validated per operation.
		const body: Record<string, unknown> = {};
		const named = new Set<string>();
		for (const field of woocommerceInputFields(id)) {
			named.add(field.name);
			const value = valid[field.name];
			if (value === undefined) continue;
			// An explicit null is a value in a body (it clears the field); in a
			// path or query string it means "not set".
			if (value === null && field.in !== 'body') continue;
			switch (field.in) {
				case 'path':
					pathParameters[field.wire] = encodeWoocommercePathValue(
						String(value),
					);
					break;
				case 'query':
					query[field.wire] = phpQueryValue(value);
					break;
				default:
					body[field.wire] = value;
			}
		}
		// Keys the schema let through (objects keep unknown keys, such as a
		// field an extension adds) go in the body.
		for (const [name, value] of Object.entries(valid)) {
			if (!named.has(name) && value !== undefined) body[name] = value;
		}

		const request: WoocommerceRequest = {
			method: operation.method,
			path: operation.path,
			pathParameters,
			query,
		};
		if (
			operation.request === 'json' &&
			(operation.method !== 'DELETE' || Object.keys(body).length > 0)
		) {
			request.body = body;
		}

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown = await makeWoocommerceRequest(ctx, request).catch(
			(error: unknown) => {
				// A full last page still gets a next_page (core doesn't return
				// X-WP-TotalPages); a 400 *_invalid_page_number for the page after
				// it means that page is empty.
				if (operation.paginated && isPastLastPage(error)) return [];
				throw error;
			},
		);
		if (operation.paginated && Array.isArray(response)) {
			response = {
				items: response,
				next_page: nextPageOf(
					parsedInput.data,
					response.length,
					operation.pageSize ?? 10,
				),
			};
		}

		// The output schema is built from the route's own schema; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getWoocommerceOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`WooCommerce ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold customers' names, addresses and orders: log
		// only which operation ran.
		await logEventFromContext(
			ctx,
			'woocommerce.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as WoocommerceOperationOutputs[Id];
	};
}
