import { logEventFromContext } from 'corsair/core';
import type { FaradayEndpoints } from '..';
import { makeFaradayRequest } from '../client';
import type { FaradayOp } from './catalog';
import { FARADAY_OPS, opKey } from './catalog';

const PATH_PARAMS = [
	'account_id',
	'cohort_id',
	'dataset_id',
	'stream_id',
	'outcome_id',
	'persona_set_id',
	'place_id',
	'scope_id',
	'target_id',
	'trait_id',
	'connection_id',
	'webhook_endpoint_id',
	'directory',
	'filename',
	'id',
] as const;

function asRecord(input: unknown): Record<string, unknown> {
	return input && typeof input === 'object' && !Array.isArray(input)
		? (input as Record<string, unknown>)
		: {};
}

function interpolatePath(path: string, input: Record<string, unknown>): string {
	return path.replace(/\{(\w+)\}/g, (_, key: string) => {
		const value = input[key] ?? input.id;
		if (typeof value !== 'string' || !value) {
			throw new Error(`Missing path parameter ${key}`);
		}
		return encodeURIComponent(value);
	});
}

function stripAccountKey(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(stripAccountKey);
	}
	if (value && typeof value === 'object') {
		const { api_key: _apiKey, ...rest } = value as Record<string, unknown>;
		return rest;
	}
	return value;
}

function requestBody(
	op: FaradayOp,
	input: Record<string, unknown>,
): Record<string, unknown> | undefined {
	if (op.method === 'GET' || op.method === 'DELETE') return undefined;
	if (op.input === 'id' || op.input === 'none') return undefined;
	const body: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(input)) {
		if ((PATH_PARAMS as readonly string[]).includes(key)) continue;
		if (value !== undefined) body[key] = value;
	}
	return Object.keys(body).length > 0 ? body : undefined;
}

function requestQuery(
	op: FaradayOp,
	input: Record<string, unknown>,
):
	| Record<string, string | string[] | number | boolean | undefined>
	| undefined {
	if (op.input !== 'ids') return undefined;
	const ids = input.ids;
	if (!Array.isArray(ids) || ids.length === 0) return undefined;
	if (ids.length > 100) {
		throw new Error('Maximum of 100 IDs allowed');
	}
	return { ids: ids.map(String) };
}

function wrapOutput(op: FaradayOp, raw: unknown): unknown {
	if (raw === undefined || raw === null || raw === '') {
		return { ok: true };
	}
	if (op.name === 'getCsv' && typeof raw === 'string') {
		return { content: raw };
	}
	if (op.group === 'uploads' && op.name === 'get' && typeof raw === 'string') {
		return { content: raw };
	}
	if (op.group === 'accounts') {
		return stripAccountKey(raw);
	}
	return raw;
}

function makeHandler(op: FaradayOp) {
	const key = opKey(op);
	return async (ctx: { key: string }, input: unknown) => {
		const record = asRecord(input);
		const response = await makeFaradayRequest(
			interpolatePath(op.path, record),
			ctx.key,
			{
				method: op.method,
				query: requestQuery(op, record),
				body: requestBody(op, record),
			},
		);
		await logEventFromContext(
			ctx as never,
			`faraday.${key}`,
			record,
			'completed',
		);
		return wrapOutput(op, response);
	};
}

export const FaradayHandlers = Object.fromEntries(
	FARADAY_OPS.map((op) => [opKey(op), makeHandler(op)]),
) as unknown as FaradayEndpoints;

export function nestFaradayEndpoints() {
	const nested: Record<string, Record<string, unknown>> = {};
	for (const op of FARADAY_OPS) {
		const group = nested[op.group] ?? {};
		group[op.name] = FaradayHandlers[opKey(op)];
		nested[op.group] = group;
	}
	return nested;
}

export { FARADAY_OPS, opKey } from './catalog';
