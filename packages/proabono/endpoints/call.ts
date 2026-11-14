import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ProabonoContext } from '..';
import type { ProabonoCredentials, ProabonoRequest } from '../client';
import { makeProabonoRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/** Unparsed bodies: a response before the caller's output schema parses it. */
type Untyped = unknown; // unknown: see the note above.

/**
 * Reads the two credentials and the account number the host is built from.
 * ProAbono uses the agent key as the HTTP Basic username and the API key as the
 * password, so both are required, and neither is optional on any route.
 *
 * The API key is `ctx.key`, which the binder resolved after hooks and the
 * per-tenant lookup, so a saved key reaches the request. The agent key is the
 * account's second field, read through its accessor. Neither comes from
 * `ctx.options`, which R8 forbids for a credential.
 */
export async function credentialsOf(
	ctx: ProabonoContext,
): Promise<ProabonoCredentials> {
	const account = ctx.options?.account?.trim() ?? '';
	if (!account) {
		// The account number forms the host, so no call can be made without it.
		throw new Error(
			'Set `account` in the plugin options to the number in your API endpoint, such as `42` for api-42.proabono.com.',
		);
	}
	const apiKey = ctx.key?.trim() ?? '';
	const agentKey = ctx.keys?.get_agent_key
		? ((await ctx.keys.get_agent_key()) ?? '').trim()
		: '';
	return { account, agentKey, apiKey };
}

/**
 * Validates the input, sends it, shapes and validates the response, then logs
 * the event.
 *
 * A **204** is a normal answer meaning "no result", so a read that finds nothing
 * must not fail the output parse. `shape` turns it into the empty value the
 * caller expects, and any other answer passes through unchanged.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: ProabonoContext,
	operation: {
		event: string;
		input: Input;
		output: Output;
		/**
		 * The empty value a 204 should become. ProAbono documents 204 as "no
		 * result", so a read that finds nothing is not a failure and must not reach
		 * the output schema as an absent body.
		 */
		emptyValue?: () => z.output<Output>;
	},
	rawInput: Untyped,
	toRequest: (parsed: z.output<Input>) => ProabonoRequest,
	options: {
		/** Rewrites the answer before the output schema parses it. */
		shape?: (raw: Untyped, parsed: z.output<Input>) => Untyped;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const credentials = await credentialsOf(ctx);
	const request = toRequest(parsed);
	const raw = await makeProabonoRequest(credentials, request);

	// A 204 carries no body at all, which the client surfaces as undefined.
	const shaped =
		raw === undefined && operation.emptyValue
			? operation.emptyValue()
			: options.shape
				? options.shape(raw, parsed)
				: raw;
	const result = operation.output.parse(shaped);

	await logEventFromContext(
		ctx,
		`proabono.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Wraps an array a route answers bare under the key its output schema expects.
 *
 * A response that is not an array is passed through unchanged rather than
 * replaced with `[]`: an empty list would read as "the account has no records",
 * while the output schema rejecting the shape tells the caller the response was
 * malformed. An absent body is already handled by `emptyValue`.
 */
// unknown: the route's bare body before the output schema parses it.
export function asList(key: string): (raw: Untyped) => Untyped {
	return (raw) => (Array.isArray(raw) ? { [key]: raw } : raw);
}
