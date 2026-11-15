import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SupersaasContext } from '..';
import { makeSupersaasRequest } from '../client';
import type { UnknownJson } from '../json';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * SuperSaaS authenticates with HTTP Basic: the account name is the username and
 * the API key the password. `key` carries the API key, and the account name is a
 * second account field because there is no way to send one without the other.
 */
export async function resolveCredentials(
	ctx: SupersaasContext,
): Promise<{ accountName: string; apiKey: string }> {
	const accountName =
		ctx.options.accountName ?? (await ctx.keys?.get_account_name?.());
	if (!accountName) {
		throw new AuthMissingError(
			'supersaas',
			'api_key',
			'[auth-missing:supersaas:account_name] SuperSaaS authenticates with HTTP Basic, so it needs both the account name and the API key. Store the account name as account_name, or pass accountName.',
		);
	}
	return { accountName, apiKey: ctx.key };
}

/**
 * Validates the input, sends the request and validates the response, then logs
 * the event. Booking and user details are not logged: a user carries an email
 * and a booking a name and address, so `log` picks ids only.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SupersaasContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: UnknownJson, // unknown: raw caller input, parsed by the input schema
	toRequest: (parsed: z.output<Input>) => {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		path: string;
		query?: Record<string, string | number | boolean | undefined>;
		body?: UnknownJson; // unknown: already validated by the input schema
	},
	options: {
		// unknown: the response body, absent when empty. The output schema
		// validates whatever this returns.
		shape?: (raw: UnknownJson, parsed: z.output<Input>) => UnknownJson;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const credentials = await resolveCredentials(ctx);
	const { method, path, query, body } = toRequest(parsed);
	const raw = await makeSupersaasRequest(credentials, {
		method,
		path,
		query,
		body,
	});
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
 * A delete answers 200 with no body, so the result records the id. Anything that
 * arrives is checked rather than ignored, because a proxy answering an error
 * page with a 2xx would otherwise look like a successful delete.
 */
export function deletion(
	raw: UnknownJson, // unknown: the body of a delete, which should be empty
	id: string,
): { id: string; deleted: true } {
	if (raw !== undefined && raw !== null && raw !== '') {
		const isObject =
			typeof raw === 'object' &&
			!Array.isArray(raw) &&
			Object.keys(raw).length === 0;
		if (!isObject) {
			throw new Error(
				'SuperSaaS answered a delete with a body, so nothing was confirmed. Re-read the record before assuming it was removed.',
			);
		}
	}
	return { id, deleted: true as const };
}

/**
 * A create answers 201 with an empty body and the new id only in a `Location`
 * header, so the result is built from the input. `key` is what the caller can
 * use to find the record again.
 */
export function created(
	raw: UnknownJson, // unknown: the body of a 201, usually empty
	key: string,
): { created: true; key: string; id?: string } {
	// A body, when SuperSaaS sends one, is the record itself.
	const record =
		raw !== undefined &&
		raw !== null &&
		typeof raw === 'object' &&
		!Array.isArray(raw)
			? (raw as Record<string, UnknownJson>)
			: undefined;
	const id = record?.id;
	return {
		created: true as const,
		key,
		id: typeof id === 'string' ? id : undefined,
	};
}
