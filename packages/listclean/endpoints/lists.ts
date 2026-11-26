import type { ListcleanEndpoints } from '..';
import { envelopeData, envelopeMessage, segment } from '../client';
import { call } from './call';
import {
	ListcleanEndpointInputSchemas as Inputs,
	ListcleanEndpointOutputSchemas as Outputs,
} from './types';

export const listLists: ListcleanEndpoints['listsListLists'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.listLists',
			input: Inputs.listsListLists,
			output: Outputs.listsListLists,
		},
		input,
		// The documented path carries a trailing slash; /credits/ shows the API
		// is strict about slashes elsewhere, so the spec spelling is kept.
		() => ({ method: 'GET', path: '/lists/', replayable: true }),
		{
			shape: envelopeData,
			log: (_, result) => ({
				count: result.lists.length,
				total: result.total ?? undefined,
			}),
		},
	);

/**
 * Listclean answers `data` as an array holding the one list for this id. The
 * endpoint unwraps that element into `list` before the output schema parses,
 * so the bulk job's status reads at the object path `list.status`.
 */
// unknown: the payload is the untyped envelope data until the output schema
// validates the unwrapped list.
export function firstList(raw: unknown): unknown {
	const list = asRecordArray(raw)?.[0];
	return { list };
}

// unknown: the payload's shape is the provider's until the schema parses it.
function asRecordArray(raw: unknown): Record<string, unknown>[] | undefined {
	return Array.isArray(raw) ? (raw as Record<string, unknown>[]) : undefined;
}

export const getList: ListcleanEndpoints['listsGetList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.getList',
			input: Inputs.listsGetList,
			output: Outputs.listsGetList,
		},
		input,
		({ list_id }) => ({
			method: 'GET',
			path: `/lists/${segment(list_id)}`,
			replayable: true,
		}),
		{
			shape: (raw) => firstList(envelopeData(raw)),
			// The bulk job status read: `list.status` moves SUBMITTED, INPROCESS,
			// COMPLETED, so the status is what a log needs. LogFields rejects
			// null, so a nullish status passes as undefined.
			log: (_, result) => ({
				listId: result.list.list_id,
				status: result.list.status ?? undefined,
			}),
		},
	);

export const getListResults: ListcleanEndpoints['listsGetListResults'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'lists.getListResults',
			input: Inputs.listsGetListResults,
			output: Outputs.listsGetListResults,
		},
		input,
		({ list_id, type }) => ({
			method: 'GET',
			path: `/downloads/json/${segment(list_id)}/${segment(type)}`,
			// This route answers a bare JSON stream instead of the envelope.
			response: 'json',
			replayable: true,
		}),
		{
			log: ({ list_id, type }, result) => ({
				listId: list_id,
				type,
				count: result.length,
			}),
		},
	);

export const getListResultsCsv: ListcleanEndpoints['listsGetListResultsCsv'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'lists.getListResultsCsv',
			input: Inputs.listsGetListResultsCsv,
			output: Outputs.listsGetListResultsCsv,
		},
		input,
		({ list_id, type }) => ({
			method: 'GET',
			path: `/downloads/${segment(list_id)}/${segment(type)}`,
			// This route answers the CSV file itself as an octet stream.
			response: 'text',
			replayable: true,
		}),
		{
			shape: (raw) => ({ csv: raw }),
			log: ({ list_id, type }, result) => ({
				listId: list_id,
				type,
				bytes: result.csv.length,
			}),
		},
	);

// `delete` is a reserved word, so the function is `remove` and it is
// registered under the `delete:` key.
export const remove: ListcleanEndpoints['listsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.delete',
			input: Inputs.listsDelete,
			output: Outputs.listsDelete,
		},
		input,
		({ list_id }) => ({
			method: 'DELETE',
			path: `/lists/${segment(list_id)}`,
			// Destructive: after a lost answer the only safe check is reading the
			// lists first, so this is never replayed.
			replayable: false,
		}),
		{
			// No `data` on this answer: the documented `message` string must
			// arrive for the call to count as a success.
			shape: (raw) => ({ message: envelopeMessage(raw) }),
			log: ({ list_id }) => ({ listId: list_id }),
		},
	);
