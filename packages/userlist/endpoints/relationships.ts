import type { UserlistEndpoints } from '..';
import { call } from './call';
import {
	UserlistEndpointInputSchemas as Inputs,
	UserlistEndpointOutputSchemas as Outputs,
} from './types';

/** `user` and `company` may be identifiers or embedded objects. */
function ref(value: string | number | Record<string, unknown>): string {
	if (typeof value === 'object') {
		const record = value as { identifier?: string | number };
		return record.identifier === undefined
			? '(embedded)'
			: String(record.identifier);
	}
	return String(value);
}

const toRequest = (body: unknown) => ({
	method: 'POST' as const,
	path: '/relationships',
	body,
});

/**
 * Ties a user to a company. The relationship itself can hold properties, which
 * is how a role such as `admin` is stored per company rather than per user.
 */
export const upsert: UserlistEndpoints['relationshipsUpsert'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'relationships.upsert',
			input: Inputs.relationshipsUpsert,
			output: Outputs.relationshipsUpsert,
			label: 'relationships.upsert',
		},
		input,
		toRequest,
		{
			identifier: (parsed) => `${ref(parsed.user)}:${ref(parsed.company)}`,
			log: (parsed) => ({
				user: ref(parsed.user),
				company: ref(parsed.company),
			}),
		},
	);

/** Removes the link between one user and one company; both objects stay. */
export const remove: UserlistEndpoints['relationshipsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'relationships.delete',
			input: Inputs.relationshipsDelete,
			output: Outputs.relationshipsDelete,
			label: 'relationships.delete',
		},
		input,
		({ user, company }) => ({
			// The Push API deletes by DELETE with the pair in the body.
			method: 'DELETE',
			path: '/relationships',
			body: { user, company },
		}),
		{
			identifier: (parsed) => `${ref(parsed.user)}:${ref(parsed.company)}`,
			log: (parsed) => ({
				user: ref(parsed.user),
				company: ref(parsed.company),
			}),
		},
	);
