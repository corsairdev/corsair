import type { CodereadrContext, CodereadrEndpoints } from '..';
import type { CodereadrParams } from '../client';
import { call, flag, idList } from './call';
import { readCreatedId, shapeDatabases, shapeDatabaseValues } from './shape';
import {
	CodereadrEndpointInputSchemas as Inputs,
	CodereadrEndpointOutputSchemas as Outputs,
} from './types';

export const list: CodereadrEndpoints['databasesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'databases.list',
			input: Inputs.databasesList,
			output: Outputs.databasesList,
		},
		input,
		(parsed) => ({
			section: 'databases',
			action: 'retrieve',
			database_id: idList(parsed.database_id),
			info_level: parsed.info_level,
		}),
		{
			shape: (root) => shapeDatabases(root),
			log: (_, result) => ({ count: result.databases.length }),
			replaySafe: true,
		},
	);

export const create: CodereadrEndpoints['databasesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'databases.create',
			input: Inputs.databasesCreate,
			output: Outputs.databasesCreate,
		},
		input,
		(parsed) => ({
			section: 'databases',
			action: 'create',
			database_name: parsed.database_name,
			case_sensitivity: flag(parsed.case_sensitivity),
		}),
		{
			shape: (root) => ({
				success: true,
				database_id: readCreatedId(root),
			}),
			log: (_, result) => ({ databaseId: result.database_id }),
		},
	);

export const update: CodereadrEndpoints['databasesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'databases.update',
			input: Inputs.databasesUpdate,
			output: Outputs.databasesUpdate,
		},
		input,
		(parsed) => ({
			section: 'databases',
			action: 'update',
			database_id: parsed.database_id,
			database_name: parsed.database_name,
		}),
		{
			shape: (_, parsed) => ({
				success: true,
				database_id: parsed.database_id,
			}),
			log: ({ database_id }) => ({ databaseId: database_id }),
		},
	);

export const remove: CodereadrEndpoints['databasesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'databases.delete',
			input: Inputs.databasesDelete,
			output: Outputs.databasesDelete,
		},
		input,
		(parsed) => ({
			section: 'databases',
			action: 'delete',
			database_id: parsed.database_id,
		}),
		{
			shape: () => ({ success: true }),
			log: ({ database_id }) => ({ databaseId: database_id }),
		},
	);

export const clear: CodereadrEndpoints['databasesClear'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'databases.clear',
			input: Inputs.databasesClear,
			output: Outputs.databasesClear,
		},
		input,
		(parsed) => ({
			section: 'databases',
			action: 'clear',
			database_id: parsed.database_id,
		}),
		{
			shape: () => ({ success: true }),
			log: ({ database_id }) => ({ databaseId: database_id }),
		},
	);

export const showValues: CodereadrEndpoints['databasesShowValues'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'databases.showValues',
			input: Inputs.databasesShowValues,
			output: Outputs.databasesShowValues,
		},
		input,
		(parsed) => ({
			section: 'databases',
			action: 'showvalues',
			database_id: parsed.database_id,
			value: parsed.value,
			valuelike: parsed.valuelike,
			response: parsed.response,
			responselike: parsed.responselike,
			validity: parsed.validity,
			limit: parsed.limit,
			offset: parsed.offset,
		}),
		{
			shape: (root, parsed) => {
				const shaped = shapeDatabaseValues(root);
				const offset = parsed.offset ?? 0;
				// Rows returned, not `<count>`, which may be the total of all matches.
				return {
					...shaped,
					next_offset:
						parsed.limit !== undefined && shaped.values.length >= parsed.limit
							? offset + parsed.limit
							: undefined,
				};
			},
			log: (_, result) => ({ count: result.values.length }),
			replaySafe: true,
		},
	);

/** Values that take the shared options, sent as `values[i][field]`. */
function valueParams(
	prefix: string,
	value: { response?: string; validity?: number; trim_value?: boolean },
	includeTrim: boolean,
): Record<string, string | number | undefined> {
	const params: Record<string, string | number | undefined> = {
		[`${prefix}[response]`]: value.response,
		[`${prefix}[validity]`]: value.validity,
	};
	if (includeTrim) {
		params[`${prefix}[trim_value]`] = flag(value.trim_value);
	}
	return params;
}

/** Single-value write: addvalue, upsertvalue and editvalue share one shape. */
function singleValue(
	ctx: CodereadrContext,
	// unknown: raw caller input, parsed by call().
	input: unknown,
	operation: {
		action: 'upsertvalue' | 'addvalue';
		event: string;
		schema: typeof Inputs.databasesUpsertValue;
		output: typeof Outputs.databasesUpsertValue;
	},
) {
	return call(
		ctx,
		{
			event: operation.event,
			input: operation.schema,
			output: operation.output,
		},
		input,
		(parsed) => ({
			section: 'databases',
			action: operation.action,
			database_id: parsed.database_id,
			value: parsed.value,
			response: parsed.response,
			validity: parsed.validity,
			trim_value: flag(parsed.trim_value),
		}),
		{
			shape: () => ({ success: true }),
			log: (parsed) => ({ databaseId: parsed.database_id }),
			// The docs describe this action as an upsert: inserting twice leaves
			// the same single value, so a replay cannot duplicate it.
			replaySafe: true,
		},
	);
}

export const upsertValue: CodereadrEndpoints['databasesUpsertValue'] = (
	ctx,
	input,
) =>
	singleValue(ctx, input, {
		action: 'upsertvalue',
		event: 'databases.upsertValue',
		schema: Inputs.databasesUpsertValue,
		output: Outputs.databasesUpsertValue,
	});

export const upsertValues: CodereadrEndpoints['databasesUpsertValues'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'databases.upsertValues',
			input: Inputs.databasesUpsertValues,
			output: Outputs.databasesUpsertValues,
		},
		input,
		(parsed) => {
			const params: CodereadrParams = {
				section: 'databases',
				action: 'upsertmultivalue',
				database_id: parsed.database_id,
				trim_value: flag(parsed.trim_value),
			};
			// `values[0][value]=ABC` and so on, up to 100 entries.
			parsed.values.forEach((value, index) => {
				const prefix = `values[${index}]`;
				params[`${prefix}[value]`] = value.value;
				params[`${prefix}[database_id]`] = value.database_id;
				Object.assign(
					params,
					valueParams(prefix, value, value.trim_value !== undefined),
				);
			});
			return params;
		},
		{
			shape: () => ({ success: true }),
			log: (parsed) => ({ count: parsed.values.length }),
			// Upsert semantics: replaying the same values leaves them unchanged.
			replaySafe: true,
		},
	);
