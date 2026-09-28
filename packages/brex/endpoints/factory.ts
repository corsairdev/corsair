import { randomUUID } from 'node:crypto';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeBrexRequest } from '../client';
import type { BrexContext } from '../index';
import type { BrexRoute, BrexRouteKey } from './routes';
import { getBrexRoute } from './routes';
import type { BrexEndpointInput } from './types';
import { BrexEndpointInputSchemas, BrexEndpointOutputSchemas } from './types';

const CONTROL_KEYS = new Set(['body', 'query']);

function encodePathPart(value: unknown): string {
	if (value === undefined || value === null || value === '') {
		throw new Error('[brex] missing required path parameter');
	}
	return encodeURIComponent(String(value));
}

export function resolvePath(path: string, input: BrexEndpointInput): string {
	return path.replace(/\{([^}]+)\}/g, (_, key: string) =>
		encodePathPart(input[key]),
	);
}

function flattenQueryValue(
	value: unknown,
): string | number | boolean | undefined {
	if (value === undefined || value === null) return undefined;
	if (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	) {
		return value;
	}
	if (Array.isArray(value)) return value.map(String).join(',');
	return String(value);
}

export function buildQuery(
	route: BrexRoute,
	input: BrexEndpointInput,
): Record<string, string | number | boolean | undefined> | undefined {
	const query: Record<string, string | number | boolean | undefined> = {
		...(input.query as
			| Record<string, string | number | boolean | undefined>
			| undefined),
	};
	for (const key of route.queryParams) {
		const value = flattenQueryValue(input[key]);
		if (value !== undefined) query[key] = value;
	}
	if (route.op === 'listByBudget') {
		query.budget_id = flattenQueryValue(input.budget_id);
	}
	return Object.keys(query).length > 0 ? query : undefined;
}

export function requestBody(
	route: BrexRoute,
	input: BrexEndpointInput,
): Record<string, unknown> | undefined {
	if (route.method === 'GET') return undefined;
	if (route.filter === 'cardStatus') {
		const extra: Record<string, unknown> = {};
		if (input.lock_reason !== undefined) extra.reason = input.lock_reason;
		if (input.reason !== undefined) extra.reason = input.reason;
		if (input.description !== undefined) extra.description = input.description;
		return Object.keys(extra).length > 0 ? extra : undefined;
	}
	if ('body' in input && input.body !== undefined) {
		return input.body as Record<string, unknown>;
	}
	const skip = new Set<string>([
		...route.pathParams,
		...route.queryParams,
		...CONTROL_KEYS,
		'action',
		'min_amount',
		'max_amount',
		'description',
		'posted_at_start',
		'posted_at_end',
		'idempotency_key',
	]);
	const body = Object.fromEntries(
		Object.entries(input).filter(
			([key, value]) => !skip.has(key) && value !== undefined,
		),
	);
	if (route.method === 'DELETE') {
		return Object.keys(body).length > 0 ? body : undefined;
	}
	return Object.keys(body).length > 0 ? body : undefined;
}

export function cardStatusPath(id: string, action: unknown): string {
	const normalized = String(action).toLowerCase();
	if (normalized === 'lock') return `/v2/cards/${encodePathPart(id)}/lock`;
	if (normalized === 'unlock') return `/v2/cards/${encodePathPart(id)}/unlock`;
	if (normalized === 'terminate') {
		return `/v2/cards/${encodePathPart(id)}/terminate`;
	}
	throw new Error('[brex] action must be lock, unlock, or terminate');
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value !== null && typeof value === 'object'
		? (value as Record<string, unknown>)
		: undefined;
}

function transactionAmountUsd(item: unknown): number | undefined {
	const row = asRecord(item);
	const amount = asRecord(row?.amount);
	const raw = amount?.amount ?? amount?.quantity ?? row?.amount;
	if (typeof raw === 'number') return Math.abs(raw) / 100;
	if (typeof raw === 'string' && raw !== '') {
		const parsed = Number(raw);
		return Number.isFinite(parsed) ? Math.abs(parsed) / 100 : undefined;
	}
	return undefined;
}

function transactionDescription(item: unknown): string {
	const row = asRecord(item);
	const merchant = asRecord(row?.merchant);
	return [row?.description, merchant?.raw_descriptor, merchant?.name]
		.filter((value) => typeof value === 'string')
		.join(' ')
		.toLowerCase();
}

function postedAt(item: unknown): string | undefined {
	const row = asRecord(item);
	const value = row?.posted_at_date ?? row?.posted_at ?? row?.purchased_at;
	return typeof value === 'string' ? value : undefined;
}

function inDateRange(item: unknown, start?: unknown, end?: unknown): boolean {
	if (!start && !end) return true;
	const date = postedAt(item);
	if (!date) return false;
	if (typeof start === 'string' && date < start) return false;
	if (typeof end === 'string' && date > end) return false;
	return true;
}

type Page = { items?: unknown[]; next_cursor?: string | null };

async function pageCardTransactions(
	ctx: BrexContext,
	input: BrexEndpointInput,
	keep: (item: unknown) => boolean,
	stopWhenFound = false,
): Promise<Page> {
	const items: unknown[] = [];
	let cursor = typeof input.cursor === 'string' ? input.cursor : undefined;
	for (let page = 0; page < 50; page += 1) {
		const response = await makeBrexRequest<Page>(
			'/v2/transactions/card/primary',
			ctx.key as string,
			{
				method: 'GET',
				query: {
					cursor,
					limit: typeof input.limit === 'number' ? input.limit : undefined,
				},
			},
		);
		const batch = Array.isArray(response.items) ? response.items : [];
		for (const item of batch) {
			if (!keep(item)) continue;
			items.push(item);
			if (stopWhenFound) {
				return { items, next_cursor: null };
			}
		}
		if (!response.next_cursor) {
			return { items, next_cursor: null };
		}
		cursor = response.next_cursor;
	}
	return { items, next_cursor: cursor ?? null };
}

async function executeFilter(
	ctx: BrexContext,
	route: BrexRoute,
	input: BrexEndpointInput,
): Promise<unknown> {
	if (route.filter === 'transactionId') {
		return pageCardTransactions(
			ctx,
			input,
			(item) => asRecord(item)?.id === input.id,
			true,
		);
	}
	if (route.filter === 'transactionAmount') {
		const min = Number(input.min_amount);
		const max = Number(input.max_amount);
		return pageCardTransactions(ctx, input, (item) => {
			const amount = transactionAmountUsd(item);
			if (amount === undefined) return false;
			if (!inDateRange(item, input.posted_at_start, input.posted_at_end)) {
				return false;
			}
			return amount >= min && amount <= max;
		});
	}
	if (route.filter === 'transactionDescription') {
		const needle = String(input.description).toLowerCase();
		return pageCardTransactions(ctx, input, (item) => {
			if (!inDateRange(item, input.posted_at_start, input.posted_at_end)) {
				return false;
			}
			return transactionDescription(item).includes(needle);
		});
	}
	return undefined;
}

export async function executeBrexOperation(
	ctx: BrexContext,
	rawInput: BrexEndpointInput | undefined,
	key: BrexRouteKey,
) {
	if (!ctx.key) throw new AuthMissingError('brex', 'api_key');
	const route = getBrexRoute(key);
	const input = BrexEndpointInputSchemas[key].parse(
		rawInput ?? {},
	) as BrexEndpointInput;

	let status: 'completed' | 'failed' = 'completed';
	try {
		if (route.filter && route.filter !== 'cardStatus') {
			const filtered = await executeFilter(ctx, route, input);
			return BrexEndpointOutputSchemas[key].parse(filtered);
		}

		const path =
			route.filter === 'cardStatus'
				? cardStatusPath(String(input.id), input.action)
				: resolvePath(route.path, input);

		const idempotencyKey = route.idempotency
			? typeof input.idempotency_key === 'string' && input.idempotency_key
				? input.idempotency_key
				: randomUUID()
			: undefined;
		const response = await makeBrexRequest<unknown>(path, ctx.key, {
			method: route.method,
			body: requestBody(route, input),
			query: buildQuery(route, input),
			headers: idempotencyKey
				? { 'Idempotency-Key': idempotencyKey }
				: undefined,
		});
		return BrexEndpointOutputSchemas[key].parse(
			response === undefined || response === '' ? {} : response,
		);
	} catch (error) {
		status = 'failed';
		throw error;
	} finally {
		try {
			await logEventFromContext(
				ctx,
				`brex.${route.group}.${route.op}`,
				{ method: route.method, path: route.path },
				status,
			);
		} catch (logError) {
			console.warn('[brex] Failed to log operation event:', logError);
		}
	}
}

export function createBrexEndpoint(key: BrexRouteKey) {
	return async (ctx: BrexContext, input?: BrexEndpointInput) =>
		executeBrexOperation(ctx, input, key);
}
