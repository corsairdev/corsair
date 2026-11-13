import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ShopifyContext } from '..';
import { resolveShopDomain } from '../auth';
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
	payload: {
		userErrors?: { field?: string[] | null; message: string }[];
		/** `orderCancel` names its error array differently. */
		orderCancelUserErrors?: { field?: string[] | null; message: string }[];
	},
	operation: string,
): void {
	const errors = payload.userErrors ?? payload.orderCancelUserErrors ?? [];
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
		/**
		 * Runs after the mutation payload is validated and before the output
		 * schema parses. Used by `orders.cancel`, where Shopify starts a job
		 * and the order only appears once it finishes. `run` sends another
		 * GraphQL query with the same credentials.
		 */
		// unknown: the payload shape differs per operation; the callback casts
		// the part it needs and its result is parsed by the output schema.
		after?: (
			data: Record<string, unknown>,
			parsed: z.output<Input>,
			run: (
				query: string,
				// unknown: variables differ per operation and are sent as JSON.
				variables: Record<string, unknown>,
				// unknown: one field per operation; the caller reads the part it
				// needs.
			) => Promise<Record<string, unknown>>,
		) => Promise<unknown>;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const request = build(parsed);

	// The token is `ctx.key`: the binder's resolved value, after hooks and the
	// per-tenant lookup (R8). Re-reading it from options or account storage
	// here would ignore a `before` hook that replaced it. The shop domain is
	// not part of the key, so it is resolved separately.
	const shopDomain = await resolveShopDomain(ctx, ctx.options ?? {});

	const send = async (
		query: string,
		// unknown: variables differ per operation and are serialised as JSON.
		variables: Record<string, unknown>,
	): Promise<Record<string, unknown>> => {
		// unknown: `data` holds one field per operation, so it is read as a
		// record and each shape function narrows the part it needs.
		const response = await makeShopifyGraphqlRequest<Record<string, unknown>>({
			shopDomain,
			accessToken: ctx.key,
			query,
			variables,
			// A retry is safe for reads and for the polling query, which has no
			// side effect. The mutation itself never is.
			replaySafe: request.replaySafe ?? false,
			// A field-level denial (customer PII on a plan that cannot read it)
			// arrives as nulled fields beside usable data. The call still
			// succeeds, but the caller should be able to tell a genuinely empty
			// field from one Shopify refused to return.
			onPartial: (message) => {
				console.warn(`[corsair:shopify] ${operation.event}: ${message}`);
			},
		});
		return response.data;
	};

	const data = await send(request.query, request.variables ?? {});
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
				orderCancelUserErrors?: {
					field?: string[] | null;
					message: string;
				}[];
			},
			operation.event,
		);
	}

	const shaped = options.after
		? await options.after(data, parsed, send)
		: options.shape
			? options.shape(data, parsed)
			: data;
	const result = operation.output.parse(shaped);

	await logEventFromContext(
		ctx,
		`shopify.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
