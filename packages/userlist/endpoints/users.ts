import type { UserlistEndpoints } from '..';
import { call } from './call';
import {
	UserlistEndpointInputSchemas as Inputs,
	UserlistEndpointOutputSchemas as Outputs,
} from './types';

/** `identifier` may be a string or a number; the log wants one string. */
function id(
	value: string | number | Record<string, unknown> | undefined,
): string | undefined {
	if (value === undefined) return undefined;
	if (typeof value === 'object') {
		const record = value as { identifier?: string | number };
		return record.identifier === undefined
			? undefined
			: String(record.identifier);
	}
	return String(value);
}

/**
 * Create or update a user. Matching is by `identifier` if given, else by
 * `email`, which is why the schema requires at least one.
 *
 * Like every Push API write this answers 202 and is applied later, so a
 * successful call means "queued", not "stored".
 */
export const upsert: UserlistEndpoints['usersUpsert'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.upsert',
			input: Inputs.usersUpsert,
			output: Outputs.usersUpsert,
			label: 'users.upsert',
		},
		input,
		(body) => ({ method: 'POST', path: '/users', body }),
		{
			identifier: (parsed) => id(parsed.identifier ?? parsed.email),
			log: (parsed) => ({
				id: id(parsed.identifier ?? parsed.email),
				properties: parsed.properties
					? Object.keys(parsed.properties).length
					: 0,
				// A count, not the names, since topics are workspace-specific.
				preferences: parsed.preferences?.length ?? 0,
			}),
		},
	);

/** Deletes the user, their relationships and their events. */
export const remove: UserlistEndpoints['usersDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.delete',
			input: Inputs.usersDelete,
			output: Outputs.usersDelete,
			label: 'users.delete',
		},
		input,
		(body) => ({ method: 'DELETE', path: '/users', body }),
		{
			identifier: (parsed) => id(parsed.identifier ?? parsed.email),
			log: (parsed) => ({ id: id(parsed.identifier ?? parsed.email) }),
		},
	);
