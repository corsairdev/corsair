import type { NeedleEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	NeedleEndpointInputSchemas as Inputs,
	NeedleEndpointOutputSchemas as Outputs,
} from './types';

export const list: NeedleEndpoints['suppressionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'suppressions.list',
			input: Inputs.suppressionsList,
			output: Outputs.suppressionsList,
		},
		input,
		({ cursor, limit, reason }) => ({
			method: 'GET',
			path: '/suppressions',
			query: { cursor, limit, reason },
		}),
		{
			log: (_, result) => ({
				count: result.suppressions.length,
				hasMore: result.nextCursor != null,
			}),
		},
	);

/**
 * Adds up to 1,000 entries. The answer counts what was created and what was
 * already listed, so a repeat is not an error.
 */
export const create: NeedleEndpoints['suppressionsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'suppressions.create',
			input: Inputs.suppressionsCreate,
			output: Outputs.suppressionsCreate,
		},
		input,
		({ entries }) => ({
			method: 'POST',
			path: '/suppressions',
			body: { entries },
		}),
		{
			log: (_, result) => ({
				created: result.created,
				alreadyListed: result.alreadyListed,
			}),
		},
	);

/** Removes one entry, which makes the person or domain contactable again. */
export const remove: NeedleEndpoints['suppressionRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'suppressions.remove',
			input: Inputs.suppressionRemove,
			output: Outputs.suppressionRemove,
		},
		input,
		({ suppressionId }) => ({
			method: 'DELETE',
			path: `/suppressions/${segment(suppressionId)}`,
		}),
		{ log: ({ suppressionId }) => ({ suppressionId }) },
	);

/**
 * Answers a contactable flag per identity, with the reason when it is false.
 * This is the check to run before enrolling, because Needle also skips on its
 * own suppression policy during a send.
 */
export const check: NeedleEndpoints['suppressionCheck'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'suppressions.check',
			input: Inputs.suppressionCheck,
			output: Outputs.suppressionCheck,
		},
		input,
		({ identities }) => ({
			method: 'POST',
			path: '/suppressions/check',
			body: { identities },
		}),
		{
			log: (_, result) => ({
				checked: result.results.length,
				blocked: result.results.filter(
					(entry) => entry.decision?.contactable === false,
				).length,
			}),
		},
	);
