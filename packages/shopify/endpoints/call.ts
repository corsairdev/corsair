import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ShopifyContext } from '..';
import { resolveShopifyCredentials } from '../auth';
import { makeShopifyGraphqlRequest, ShopifyAPIError } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Raised when a mutation answers with a populated `userErrors`. It is a
 * distinct class so the error handlers can tell a rejected write (permanent,
 * never worth retrying) from a transport or throttling failure.
 */
export class ShopifyUserError extends ShopifyAPIError {
	constructor(
		message: string,
		public readonly userErrors: { field?: string[] | null; message: string }[],
	) {
		super(message, { status: 200, replaySafe: false });
		this.name = 'ShopifyUserError';
	}
}

/**
 * Fails the call when Shopify rejected the write. Every mutation returns
 * `userErrors` with HTTP 200, so a caller that ignored the array would report
 * success on a write that never happened.
 */
export function assertNoUserErrors(
	payload: { userErrors?: { field?: string[] | null; message: string }[] },
	operation: string,
): void {
	const errors = payload.userErrors ?? [];
	if (errors.length === 0) return;
	const first = errors[0];
	throw new ShopifyUserError(
		`${operation} was rejected: ${first?.message ?? 'no message'}`,
		errors,
	);
}

export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: ShopifyContext,
	operation: {
		event: string;
		input: Input;
		output: Output;
		/** Mutation payloads carry `userErrors`; a rejection must throw. */
		mutation?: boolean;
	},
	// unknown: raw caller input, parsed by the operation's input schema.
	rawInput: unknown,
	build: (parsed: z.output<Input>) => {
		query: string;
		// unknown: variables are whatever the endpoint's GraphQL document
		// declares; core serialises them as JSON without inspecting them.
		variables?: Record<string, unknown>;
		/** Path to the mutation payload inside `data`, for userErrors. */
		payloadKey?: string;
		/** Read verbs may be replayed; mutations and deletes may not. */
		replaySafe?: boolean;
	},
	options: {
		// unknown: raw is the parsed GraphQL `data` object, whose shape differs
		// per operation. The output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const request = build(parsed);
	const credentials = await resolveShopifyCredentials(ctx, ctx.options ?? {});

	// unknown: `data` holds one field per operation, so it is read as a record
	// and each shape function narrows the part it needs.
	const response = await makeShopifyGraphqlRequest<Record<string, unknown>>({
		shopDomain: credentials.shopDomain,
		accessToken: credentials.accessToken,
		query: request.query,
		variables: request.variables,
		replaySafe: request.replaySafe ?? false,
	});

	const data = response.data;
	if (operation.mutation) {
		const payloadKey = request.payloadKey;
		const payload = payloadKey ? data[payloadKey] : undefined;
		if (!payloadKey || typeof payload !== 'object' || payload === null) {
			throw new ShopifyAPIError(
				`${operation.event} returned no payload under "${payloadKey}"`,
				{ status: 200 },
			);
		}
		assertNoUserErrors(
			payload as {
				userErrors?: { field?: string[] | null; message: string }[];
			},
			operation.event,
		);
	}

	const shaped = options.shape ? options.shape(data, parsed) : data;
	const result = operation.output.parse(shaped);

	await logEventFromContext(
		ctx,
		`shopify.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
