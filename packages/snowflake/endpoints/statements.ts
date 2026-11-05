import { logEventFromContext } from 'corsair/core';
import type { SnowflakeEndpoints } from '..';
import {
	accountBaseUrl,
	makeSnowflakeRequest,
	resolveSnowflakeAccount,
	resolveSnowflakeTokenType,
} from '../client';
import type { StatementResult, SubmitStatementInput } from './types';
import {
	CancelStatementInputSchema,
	GetStatementInputSchema,
	SnowflakeEndpointOutputSchemas,
	SubmitStatementInputSchema,
} from './types';

const STATEMENTS_PATH = '/api/v2/statements';

function queryOf(
	fields: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> | undefined {
	const query: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(fields)) {
		if (value !== undefined) query[key] = value;
	}
	return Object.keys(query).length > 0 ? query : undefined;
}

// Snowflake reads the other session parameters in lowercase, but it ignores a
// lowercase multi_statement_count and fails a two-statement request with
// 000008 "desired statement count 1" (live check 2026-11-06). The
// multi-statement guide sends MULTI_STATEMENT_COUNT, which works.
function parametersBody(
	parameters: NonNullable<SubmitStatementInput['parameters']>,
): Record<string, string | number> {
	const { multi_statement_count, ...rest } = parameters;
	const body: Record<string, string | number> = { ...rest };
	if (multi_statement_count !== undefined) {
		body.MULTI_STATEMENT_COUNT = multi_statement_count;
	}
	return body;
}

function submitBody(
	input: SubmitStatementInput,
): Record<string, string | number | boolean | object> {
	const body: Record<string, string | number | boolean | object> = {
		statement: input.statement,
	};
	if (input.timeout !== undefined) body.timeout = input.timeout;
	if (input.database !== undefined) body.database = input.database;
	if (input.schema !== undefined) body.schema = input.schema;
	if (input.warehouse !== undefined) body.warehouse = input.warehouse;
	if (input.role !== undefined) body.role = input.role;
	if (input.bindings !== undefined) body.bindings = input.bindings;
	if (input.parameters !== undefined) {
		body.parameters = parametersBody(input.parameters);
	}
	return body;
}

function resultLog(result: StatementResult): Record<string, string | number> {
	const payload: Record<string, string | number> = {
		statementHandle: result.statementHandle,
	};
	if (result.code !== undefined) payload.code = result.code;
	if (result.data !== undefined) payload.rows = result.data.length;
	if (result.statementHandles !== undefined) {
		payload.statements = result.statementHandles.length;
	}
	const numRows = result.resultSetMetaData?.numRows;
	if (numRows !== undefined) payload.numRows = numRows;
	return payload;
}

// A partition after the first is `{ data }` alone: no handle, no metadata
// (https://docs.snowflake.com/en/developer-guide/sql-api/handling-responses#retrieving-additional-partitions,
// confirmed live 2026-11-06). The requested handle fills the gap so the
// result keeps its shape.
// unknown: the raw body before the output schema parses it.
function withStatementHandle(raw: unknown, statementHandle: string): unknown {
	if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
		return raw;
	}
	if ('statementHandle' in raw) return raw;
	return { ...raw, statementHandle };
}

async function target(ctx: Parameters<SnowflakeEndpoints['statementsGet']>[0]) {
	const account = await resolveSnowflakeAccount(ctx);
	const tokenType = await resolveSnowflakeTokenType(ctx);
	return { baseUrl: accountBaseUrl(account), apiKey: ctx.key, tokenType };
}

export const submit: SnowflakeEndpoints['statementsSubmit'] = async (
	ctx,
	input,
) => {
	const parsed = SubmitStatementInputSchema.parse(input ?? {});
	const raw = await makeSnowflakeRequest({
		...(await target(ctx)),
		method: 'POST',
		path: STATEMENTS_PATH,
		query: queryOf({
			requestId: parsed.requestId,
			async: parsed.async,
			nullable: parsed.nullable,
			retry: parsed.retry,
		}),
		body: submitBody(parsed),
	});
	const result = SnowflakeEndpointOutputSchemas.statementsSubmit.parse(raw);
	// The statement text and bind values can hold private data. Log ids and
	// counts only.
	await logEventFromContext(
		ctx,
		'snowflake.statements.submit',
		resultLog(result),
		'completed',
	);
	return result;
};

export const get: SnowflakeEndpoints['statementsGet'] = async (ctx, input) => {
	const parsed = GetStatementInputSchema.parse(input ?? {});
	const raw = await makeSnowflakeRequest({
		...(await target(ctx)),
		method: 'GET',
		path: `${STATEMENTS_PATH}/${encodeURIComponent(parsed.statementHandle)}`,
		query: queryOf({
			requestId: parsed.requestId,
			partition: parsed.partition,
			retry: parsed.retry,
		}),
	});
	const result = SnowflakeEndpointOutputSchemas.statementsGet.parse(
		withStatementHandle(raw, parsed.statementHandle),
	);
	const payload = resultLog(result);
	if (parsed.partition !== undefined) payload.partition = parsed.partition;
	await logEventFromContext(
		ctx,
		'snowflake.statements.get',
		payload,
		'completed',
	);
	return result;
};

export const cancel: SnowflakeEndpoints['statementsCancel'] = async (
	ctx,
	input,
) => {
	const parsed = CancelStatementInputSchema.parse(input ?? {});
	const raw = await makeSnowflakeRequest({
		...(await target(ctx)),
		method: 'POST',
		path: `${STATEMENTS_PATH}/${encodeURIComponent(parsed.statementHandle)}/cancel`,
		query: queryOf({
			requestId: parsed.requestId,
			retry: parsed.retry,
		}),
	});
	const result = SnowflakeEndpointOutputSchemas.statementsCancel.parse(raw);
	await logEventFromContext(
		ctx,
		'snowflake.statements.cancel',
		{
			statementHandle: result.statementHandle,
			...(result.code !== undefined ? { code: result.code } : {}),
		},
		'completed',
	);
	return result;
};
