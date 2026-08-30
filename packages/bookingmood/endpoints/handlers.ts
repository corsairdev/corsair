import { makeBookingmoodRequest } from '../client';
import {
	asRows,
	firstRow,
	requireFilter,
	toPostgrestQuery,
	writeBody,
} from '../query';
import type { EntityName, Resource } from './resources';
import type { ListInput, Row, WriteInput } from './types';

type Ctx = {
	key: string;
	db?: Record<
		string,
		{
			upsertByEntityId?: (
				id: string,
				row: Record<string, unknown>,
			) => Promise<unknown>;
			findByEntityId?: (id: string) => Promise<Record<string, unknown> | null>;
			deleteByEntityId?: (id: string) => Promise<unknown>;
		}
	>;
};

function storedData(
	existing: Record<string, unknown> | null,
): Record<string, unknown> {
	const data = existing?.data;
	if (data && typeof data === 'object' && !Array.isArray(data)) {
		return data as Record<string, unknown>;
	}
	return {};
}

async function syncRows(ctx: Ctx, entity: EntityName | undefined, rows: Row[]) {
	if (!entity || !ctx.db?.[entity]?.upsertByEntityId) return;
	for (const row of rows) {
		if (!row.id) continue;
		const existing = ctx.db[entity].findByEntityId
			? await ctx.db[entity].findByEntityId(row.id)
			: null;
		await ctx.db[entity].upsertByEntityId(row.id, {
			...storedData(existing),
			...row,
			id: row.id,
		});
	}
}

async function syncDelete(
	ctx: Ctx,
	entity: EntityName | undefined,
	ids: string[],
) {
	if (!entity || !ctx.db?.[entity]?.deleteByEntityId) return;
	for (const id of ids) {
		await ctx.db[entity].deleteByEntityId(id);
	}
}

export function listHandler(resource: Resource) {
	return async (ctx: Ctx, input: ListInput | undefined) => {
		const query = toPostgrestQuery(
			input as Record<string, unknown> | undefined,
			'list',
		);
		if (!query.select) query.select = '*';
		const res = await makeBookingmoodRequest<Row | Row[]>(
			resource.path,
			ctx.key,
			{
				method: 'GET',
				query,
			},
		);
		const rows = asRows(res);
		await syncRows(ctx, resource.entity, rows);
		return rows;
	};
}

export function createHandler(resource: Resource) {
	return async (ctx: Ctx, input: Record<string, unknown>) => {
		const res = await makeBookingmoodRequest<Row | Row[]>(
			resource.path,
			ctx.key,
			{
				method: 'POST',
				body: input,
			},
		);
		const rows = asRows(res);
		await syncRows(ctx, resource.entity, rows);
		return rows;
	};
}

export function updateHandler(resource: Resource) {
	return async (ctx: Ctx, input: WriteInput) => {
		const record = input as Record<string, unknown>;
		const query = toPostgrestQuery(record, 'filter');
		requireFilter(query, resource.path);
		const res = await makeBookingmoodRequest<Row | Row[]>(
			resource.path,
			ctx.key,
			{
				method: 'PATCH',
				query,
				body: writeBody(record),
			},
		);
		const rows = asRows(res);
		if (rows.length > 0) {
			await syncRows(ctx, resource.entity, rows);
		}
		return rows;
	};
}

export function deleteHandler(resource: Resource) {
	return async (ctx: Ctx, input: WriteInput) => {
		const record = input as Record<string, unknown>;
		const query = toPostgrestQuery(record, 'filter');
		requireFilter(query, resource.path);
		const res = await makeBookingmoodRequest<Row | Row[]>(
			resource.path,
			ctx.key,
			{
				method: 'DELETE',
				query,
			},
		);
		const rows = asRows(res);
		const ids = rows.map((row) => row.id).filter(Boolean);
		if (ids.length === 0 && typeof record.id === 'string') ids.push(record.id);
		await syncDelete(ctx, resource.entity, ids);
		return rows;
	};
}

export async function inviteMember(ctx: Ctx, input: Record<string, unknown>) {
	const res = await makeBookingmoodRequest<Row | Row[]>('members', ctx.key, {
		method: 'POST',
		body: input,
	});
	const row = firstRow(asRows(res));
	if (row) await syncRows(ctx, 'members', [row]);
	return row ?? res;
}

export async function queryAvailability(
	ctx: Ctx,
	input: Record<string, unknown> | undefined,
) {
	const query = toPostgrestQuery(input, 'list');
	if (Array.isArray(input?.product_ids)) {
		query.product_ids = `in.(${input.product_ids.join(',')})`;
	}
	const res = await makeBookingmoodRequest('availability', ctx.key, {
		method: 'GET',
		query,
	});
	return res;
}

export async function searchAvailability(
	ctx: Ctx,
	input: Record<string, unknown>,
) {
	const res = await makeBookingmoodRequest('search', ctx.key, {
		method: 'POST',
		body: input,
	});
	return res;
}
