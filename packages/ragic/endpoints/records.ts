import type { RagicEndpoints } from '..';
import { call, readQuery, recordPath, sheetPath, writeQuery } from './call';
import {
	RagicEndpointInputSchemas as Inputs,
	RagicEndpointOutputSchemas as Outputs,
} from './types';

export const list: RagicEndpoints['recordsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.list',
			input: Inputs.recordsList,
			output: Outputs.recordsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: sheetPath(parsed.account, parsed.path, parsed.sheetIndex),
			query: readQuery(parsed),
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				sheet: parsed.sheetIndex,
				// A taskId answer is a progress object rather than a record set, so a
				// record count only exists for the listing form.
				status: 'status' in result ? String(result.status) : 'listed',
				records: 'status' in result ? 0 : Object.keys(result).length,
			}),
		},
	);

export const get: RagicEndpoints['recordsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.get',
			input: Inputs.recordsGet,
			output: Outputs.recordsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: recordPath(
				parsed.account,
				parsed.path,
				parsed.sheetIndex,
				parsed.recordId,
			),
			query: {
				naming: parsed.naming,
				subtables:
					parsed.subtables === undefined ? undefined : parsed.subtables ? 1 : 0,
				info: parsed.info,
				comment: parsed.comment,
				history: parsed.history,
				ignoreMask: parsed.ignoreMask,
			},
			replayable: true,
		}),
		{
			log: (parsed) => ({
				sheet: parsed.sheetIndex,
				recordId: parsed.recordId,
			}),
		},
	);

/**
 * Creates a record. The same URL as a list, with POST instead of GET.
 *
 * The field values go in the body keyed by field ID, and a subtable is a nested
 * `_subtable_<id>` object whose row ids are negative so Ragic can group a row's
 * values before the record exists.
 */
export const create: RagicEndpoints['recordsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.create',
			input: Inputs.recordsCreate,
			output: Outputs.recordsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: sheetPath(parsed.account, parsed.path, parsed.sheetIndex),
			query: writeQuery(parsed),
			body: parsed.fields,
			// Creating twice makes two records, and there is no idempotency key.
			replayable: false,
		}),
		{
			log: (parsed, result) => ({
				sheet: parsed.sheetIndex,
				recordId: result.ragicId ?? undefined,
			}),
		},
	);

/**
 * Updates a record. The endpoint adds the record id to the sheet path.
 *
 * A subtable row is addressed by its own row id (a positive one read from the
 * record), and a row is removed by sending `_DELSUB_<subtableId>` with the ids.
 */
export const update: RagicEndpoints['recordsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.update',
			input: Inputs.recordsUpdate,
			output: Outputs.recordsUpdate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: recordPath(
				parsed.account,
				parsed.path,
				parsed.sheetIndex,
				parsed.recordId,
			),
			query: writeQuery(parsed),
			body: parsed.fields,
			// Only the fields sent are changed, so a replay writes the same values
			// again; a workflow or AI Agent triggered by the save is the only side
			// effect, and the caller can turn those off.
			replayable: true,
		}),
		{
			log: (parsed) => ({
				sheet: parsed.sheetIndex,
				recordId: parsed.recordId,
			}),
		},
	);

export const remove: RagicEndpoints['recordsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.delete',
			input: Inputs.recordsDelete,
			output: Outputs.recordsDelete,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: recordPath(
				parsed.account,
				parsed.path,
				parsed.sheetIndex,
				parsed.recordId,
			),
			// Ragic moves the record to the sheet's recycle bin. A second delete finds
			// nothing; the record is already gone either way.
			replayable: false,
		}),
		{
			log: (parsed) => ({
				sheet: parsed.sheetIndex,
				recordId: parsed.recordId,
			}),
		},
	);

export const comment: RagicEndpoints['recordsComment'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.comment',
			input: Inputs.recordsComment,
			output: Outputs.recordsComment,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: recordPath(
				parsed.account,
				parsed.path,
				parsed.sheetIndex,
				parsed.recordId,
			),
			// Ragic only treats the POST as a comment with the `comment` flag, and
			// only reads `c` from a multipart body: live, a JSON or urlencoded `c`
			// answered code 103, and without the flag the POST was a plain save that
			// added nothing. The attachment (`at`) is left out: no files here.
			query: { comment: '' },
			formData: { c: parsed.comment },
			// A second comment posts a second comment.
			replayable: false,
		}),
		{
			log: (parsed) => ({
				sheet: parsed.sheetIndex,
				recordId: parsed.recordId,
			}),
		},
	);

/**
 * Locks a record. Ragic exposes this as a bare `lock` query flag on a POST to the
 * record, which is why the operation takes no other parameters.
 */
export const lock: RagicEndpoints['recordsLock'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.lock',
			input: Inputs.recordsLock,
			output: Outputs.recordsLock,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: recordPath(
				parsed.account,
				parsed.path,
				parsed.sheetIndex,
				parsed.recordId,
			),
			query: { lock: '' },
			replayable: true,
		}),
		{
			log: (parsed) => ({ recordId: parsed.recordId, locked: true }),
		},
	);

export const unlock: RagicEndpoints['recordsUnlock'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.unlock',
			input: Inputs.recordsUnlock,
			output: Outputs.recordsUnlock,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: recordPath(
				parsed.account,
				parsed.path,
				parsed.sheetIndex,
				parsed.recordId,
			),
			query: { unlock: '' },
			replayable: true,
		}),
		{
			log: (parsed) => ({ recordId: parsed.recordId, locked: false }),
		},
	);

/**
 * Reads a sheet's field schema, which is how a caller discovers the field IDs a
 * record read or write needs. Restricted to an account manager's API key.
 */
export const schema: RagicEndpoints['schemaGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'schema.get',
			input: Inputs.schemaGet,
			output: Outputs.schemaGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `${sheetPath(parsed.account, parsed.path, parsed.sheetIndex)}/metadata/schema`,
			replayable: true,
		}),
		{
			log: (_, result) => ({
				sheet: result.sheet?.sheetName ?? undefined,
				fields: result.fields?.length ?? 0,
				subtables: result.subtables?.length ?? 0,
			}),
		},
	);
