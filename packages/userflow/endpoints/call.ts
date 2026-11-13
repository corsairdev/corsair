import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { UserflowContext } from '..';
import type { UserflowRequest } from '../client';
import {
	makeUserflowRequest,
	USERFLOW_API_BASE,
	USERFLOW_EU_API_BASE,
} from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/** The Accounts API owns these groups; everything else is the Users API. */
const ACCOUNTS_API_GROUPS = new Set(['accounts', 'members', 'invites']);

/** True when an event such as `members.list` belongs to the Accounts API. */
export function isAccountsEvent(event: string): boolean {
	return ACCOUNTS_API_GROUPS.has(event.split('.')[0] ?? '');
}

/**
 * An EU-region *Users* environment lives on `api.eu.userflow.com`. The Accounts API
 * is on `api.userflow.com` in every region, so the host depends on which API an
 * operation belongs to as well as on the region. The key carries no region marker,
 * which is why `region` is a plugin option.
 */
export function resolveBase(
	ctx: UserflowContext,
	isAccountsApi: boolean,
): string {
	if (isAccountsApi) return USERFLOW_API_BASE;
	return ctx.options?.region === 'eu'
		? USERFLOW_EU_API_BASE
		: USERFLOW_API_BASE;
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged wholesale, because `attributes` is
 * free-form and holds personal data; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: UserflowContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => UserflowRequest,
	options: {
		// unknown: raw is the response body. The output schema validates
		// whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	// The event name starts with its group, so the API family is known here without
	// threading a flag through every endpoint.
	const isAccountsApi = isAccountsEvent(operation.event);
	const raw = await makeUserflowRequest(
		ctx.key,
		toRequest(parsed),
		resolveBase(ctx, isAccountsApi),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`userflow.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
