import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SupersaasContext } from '..';
import type { SupersaasRequest } from '../client';
import { makeSupersaasRequest } from '../client';
import type { UnknownJson } from '../json';

type LogFields = Record<string, string | number | boolean | undefined>;

export type SupersaasCredentials = { accountName: string; apiKey: string };

/**
 * SuperSaaS authenticates with HTTP Basic: the account name is the username and
 * the API key the password. `key` carries the API key, and the account name is a
 * second credential stored on the account as `account_name`, read the same way
 * as the key and never from options or tool input.
 */
export async function resolveCredentials(
	ctx: SupersaasContext,
): Promise<SupersaasCredentials> {
	const accountName = await ctx.keys?.get_account_name?.();
	if (!accountName) {
		throw new AuthMissingError(
			'supersaas',
			'api_key',
			'[auth-missing:supersaas:account_name] SuperSaaS authenticates with HTTP Basic, so it needs both the account name and the API key. Store the account name as account_name on the account.',
		);
	}
	return { accountName, apiKey: ctx.key };
}

/**
 * Validates the input, sends the request and validates the response, then logs
 * the event. Booking and user details are not logged: a user carries an email
 * and a booking a name and address, so `log` picks ids and counts only.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SupersaasContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: UnknownJson, // unknown: raw caller input, parsed by the input schema
	toRequest: (
		parsed: z.output<Input>,
		credentials: SupersaasCredentials,
	) => SupersaasRequest,
	options: {
		// unknown: the response body (or the Location header for a create),
		// absent when empty. The output schema validates whatever this returns.
		shape?: (raw: UnknownJson, parsed: z.output<Input>) => UnknownJson;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const credentials = await resolveCredentials(ctx);
	const raw = await makeSupersaasRequest(
		credentials,
		toRequest(parsed, credentials),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`supersaas.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Updates and deletes answer 200 with an empty body. Anything else that
 * arrives is refused rather than read as success, because a proxy answering an
 * error page with a 2xx would otherwise look like a confirmed write.
 */
function expectEmpty(
	raw: UnknownJson, // unknown: the body of an update or delete, which should be empty
	what: string,
): void {
	if (raw === undefined || raw === null || raw === '') return;
	if (
		typeof raw === 'object' &&
		!Array.isArray(raw) &&
		Object.keys(raw).length === 0
	) {
		return;
	}
	throw new Error(
		`SuperSaaS answered the ${what} with an unexpected body, so nothing was confirmed. Re-read the record before assuming it changed.`,
	);
}

export function deletion(
	raw: UnknownJson, // unknown: the body of a delete, which should be empty
	id: string,
): { id: string; deleted: true } {
	expectEmpty(raw, 'delete');
	return { id, deleted: true as const };
}

export function updated(
	raw: UnknownJson, // unknown: the body of an update, which should be empty
	id: string,
): { id: string; updated: true } {
	expectEmpty(raw, 'update');
	return { id, updated: true as const };
}

/**
 * A create answers 201 with an empty body and the new record's URL in the
 * `Location` header, such as `https://www.supersaas.com/api/bookings/1234.json`.
 * The client asks core for that header, so `raw` is the URL; the id is its last
 * path segment. A missing or unreadable header is an error, not a success.
 */
export function created(
	raw: UnknownJson, // unknown: the Location header the client asked for
): { created: true; id: string; location: string } {
	const location = typeof raw === 'string' ? raw.trim() : '';
	const match = location.match(/\/([^/?#]+?)(?:\.(?:json|xml))?(?:[?#].*)?$/);
	const id = match?.[1] ? decodeURIComponent(match[1]) : undefined;
	if (!location || !id) {
		throw new Error(
			'SuperSaaS did not return the new record in a Location header, so the create is unconfirmed. List the records before retrying.',
		);
	}
	return { created: true as const, id, location };
}
