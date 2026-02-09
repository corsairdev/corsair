import type { Kysely, SelectQueryBuilder } from 'kysely';
import type { ZodTypeAny } from 'zod';
import { z } from 'zod';

import { generateUUID } from '../../core/utils';
import type { CorsairEntity } from '../index';
import type { PluginEntityClient, TypedEntity } from '../orm';
import type { CorsairKyselyDatabase } from './database';
import {
	jsonbBooleanField,
	jsonbNumberField,
	jsonbTextField,
	jsonbTimestampField,
} from './postgres';

type EntityQueryBuilder = SelectQueryBuilder<
	CorsairKyselyDatabase,
	'corsair_entities',
	CorsairEntity
>;

function parseJsonLike(value: unknown): unknown {
	if (typeof value === 'string') {
		try {
			return JSON.parse(value);
		} catch {
			return value;
		}
	}
	return value;
}

type DataFieldType = 'string' | 'number' | 'boolean' | 'date';

function unwrapSchema(schema: ZodTypeAny): ZodTypeAny {
	let current = schema;
	while (current) {
		if (current instanceof z.ZodOptional || current instanceof z.ZodNullable) {
			current = current._def.innerType as ZodTypeAny;
			continue;
		}
		if (current instanceof z.ZodDefault) {
			current = current._def.innerType as ZodTypeAny;
			continue;
		}
		if (current instanceof z.ZodEffects) {
			current = current._def.schema as ZodTypeAny;
			continue;
		}
		break;
	}
	return current;
}

function getFieldType(schema: ZodTypeAny): DataFieldType | undefined {
	const unwrapped = unwrapSchema(schema);
	if (unwrapped instanceof z.ZodString) return 'string';
	if (unwrapped instanceof z.ZodNumber) return 'number';
	if (unwrapped instanceof z.ZodBoolean) return 'boolean';
	if (unwrapped instanceof z.ZodDate) return 'date';
	return undefined;
}

function getDataFieldTypes(schema: ZodTypeAny): Record<string, DataFieldType> {
	const unwrapped = unwrapSchema(schema);
	if (!(unwrapped instanceof z.ZodObject)) return {};
	const shape = unwrapped.shape;
	const fieldTypes: Record<string, DataFieldType> = {};
	for (const [key, fieldSchema] of Object.entries(shape)) {
		const fieldType = getFieldType(fieldSchema as ZodTypeAny);
		if (fieldType) fieldTypes[key] = fieldType;
	}
	return fieldTypes;
}

function applyStringFilter(
	q: EntityQueryBuilder,
	expr: ReturnType<typeof jsonbTextField>,
	filterValue: unknown,
) {
	if (typeof filterValue === 'string') {
		return q.where(expr, '=', filterValue);
	}
	if (
		typeof filterValue === 'object' &&
		filterValue !== null &&
		!Array.isArray(filterValue)
	) {
		const obj = filterValue as Record<string, unknown>;
		if ('equals' in obj && typeof obj.equals === 'string') {
			q = q.where(expr, '=', obj.equals);
		}
		if ('contains' in obj && typeof obj.contains === 'string') {
			q = q.where(expr, 'like', `%${obj.contains}%`);
		}
		if ('startsWith' in obj && typeof obj.startsWith === 'string') {
			q = q.where(expr, 'like', `${obj.startsWith}%`);
		}
		if ('endsWith' in obj && typeof obj.endsWith === 'string') {
			q = q.where(expr, 'like', `%${obj.endsWith}`);
		}
		if ('in' in obj && Array.isArray(obj.in)) {
			q = q.where(expr, 'in', obj.in as string[]);
		}
	}
	return q;
}

function applyNumberFilter(
	q: EntityQueryBuilder,
	expr: ReturnType<typeof jsonbNumberField>,
	filterValue: unknown,
) {
	if (typeof filterValue === 'number') {
		return q.where(expr, '=', filterValue);
	}
	if (
		typeof filterValue === 'object' &&
		filterValue !== null &&
		!Array.isArray(filterValue)
	) {
		const obj = filterValue as Record<string, unknown>;
		if (typeof obj.equals === 'number') q = q.where(expr, '=', obj.equals);
		if (typeof obj.gt === 'number') q = q.where(expr, '>', obj.gt);
		if (typeof obj.gte === 'number') q = q.where(expr, '>=', obj.gte);
		if (typeof obj.lt === 'number') q = q.where(expr, '<', obj.lt);
		if (typeof obj.lte === 'number') q = q.where(expr, '<=', obj.lte);
		if (Array.isArray(obj.in)) q = q.where(expr, 'in', obj.in as number[]);
	}
	return q;
}

function applyBooleanFilter(
	q: EntityQueryBuilder,
	expr: ReturnType<typeof jsonbBooleanField>,
	filterValue: unknown,
) {
	if (typeof filterValue === 'boolean') {
		return q.where(expr, '=', filterValue);
	}
	if (
		typeof filterValue === 'object' &&
		filterValue !== null &&
		!Array.isArray(filterValue)
	) {
		const obj = filterValue as Record<string, unknown>;
		if (typeof obj.equals === 'boolean') q = q.where(expr, '=', obj.equals);
	}
	return q;
}

function applyDateFilter(
	q: EntityQueryBuilder,
	expr: ReturnType<typeof jsonbTimestampField>,
	filterValue: unknown,
) {
	if (filterValue instanceof Date) {
		return q.where(expr, '=', filterValue);
	}
	if (
		typeof filterValue === 'object' &&
		filterValue !== null &&
		!Array.isArray(filterValue)
	) {
		const obj = filterValue as Record<string, unknown>;
		if (obj.equals instanceof Date) q = q.where(expr, '=', obj.equals);
		if (obj.before instanceof Date) q = q.where(expr, '<', obj.before);
		if (obj.after instanceof Date) q = q.where(expr, '>', obj.after);
		if (Array.isArray(obj.between) && obj.between.length === 2) {
			const [start, end] = obj.between;
			if (start instanceof Date) q = q.where(expr, '>=', start);
			if (end instanceof Date) q = q.where(expr, '<=', end);
		}
	}
	return q;
}

function applyDataFilter(
	q: EntityQueryBuilder,
	key: string,
	fieldType: DataFieldType,
	filterValue: unknown,
) {
	if (fieldType === 'number') {
		return applyNumberFilter(q, jsonbNumberField(key), filterValue);
	}
	if (fieldType === 'boolean') {
		return applyBooleanFilter(q, jsonbBooleanField(key), filterValue);
	}
	if (fieldType === 'date') {
		return applyDateFilter(q, jsonbTimestampField(key), filterValue);
	}
	return applyStringFilter(q, jsonbTextField(key), filterValue);
}

function applyEntityFieldFilter(
	q: EntityQueryBuilder,
	key: keyof CorsairEntity,
	filterValue: unknown,
) {
	if (
		typeof filterValue === 'object' &&
		filterValue !== null &&
		!Array.isArray(filterValue)
	) {
		const obj = filterValue as Record<string, unknown>;
		if ('equals' in obj) q = q.where(key, '=', obj.equals as any);
		if ('contains' in obj && typeof obj.contains === 'string') {
			q = q.where(key, 'like', `%${obj.contains}%`);
		}
		if ('startsWith' in obj && typeof obj.startsWith === 'string') {
			q = q.where(key, 'like', `${obj.startsWith}%`);
		}
		if ('endsWith' in obj && typeof obj.endsWith === 'string') {
			q = q.where(key, 'like', `%${obj.endsWith}`);
		}
		if ('in' in obj && Array.isArray(obj.in)) {
			q = q.where(key, 'in', obj.in as any[]);
		}
		return q;
	}
	return q.where(key, '=', filterValue as any);
}

function parseCountValue(countVal: unknown): number {
	if (typeof countVal === 'number') return countVal;
	if (typeof countVal === 'bigint') return Number(countVal);
	return Number.parseInt(String(countVal ?? 0), 10);
}

function baseQuery(
	db: Kysely<CorsairKyselyDatabase>,
	accountId: string,
	entityTypeName: string,
): EntityQueryBuilder {
	return db
		.selectFrom('corsair_entities')
		.selectAll()
		.where('account_id', '=', accountId)
		.where('entity_type', '=', entityTypeName);
}

export function createKyselyEntityClient<DataSchema extends ZodTypeAny>(
	db: Kysely<CorsairKyselyDatabase>,
	getAccountId: () => Promise<string>,
	entityTypeName: string,
	version: string,
	dataSchema: DataSchema,
): PluginEntityClient<DataSchema> {
	const dataFieldTypes = getDataFieldTypes(dataSchema);

	function parseRow(row: CorsairEntity): TypedEntity<DataSchema> {
		const data = parseJsonLike(row.data);
		return {
			...row,
			data: dataSchema.parse(data),
		} as TypedEntity<DataSchema>;
	}

	return {
		findByEntityId: async (entityId) => {
			const accountId = await getAccountId();
			const row = await baseQuery(db, accountId, entityTypeName)
				.where('entity_id', '=', entityId)
				.executeTakeFirst();
			return row ? parseRow(row) : null;
		},

		findById: async (id) => {
			const accountId = await getAccountId();
			const row = await baseQuery(db, accountId, entityTypeName)
				.where('id', '=', id)
				.executeTakeFirst();
			return row ? parseRow(row) : null;
		},

		findManyByEntityIds: async (entityIds) => {
			if (entityIds.length === 0) return [];
			const accountId = await getAccountId();
			const rows = await baseQuery(db, accountId, entityTypeName)
				.where('entity_id', 'in', entityIds)
				.execute();
			return rows.map(parseRow);
		},

		list: async (options) => {
			const accountId = await getAccountId();
			let q = baseQuery(db, accountId, entityTypeName);
			if (typeof options?.limit === 'number') q = q.limit(options.limit);
			if (typeof options?.offset === 'number') q = q.offset(options.offset);
			const rows = await q.execute();
			return rows.map(parseRow);
		},

		search: async (options) => {
			const accountId = await getAccountId();
			let q = baseQuery(db, accountId, entityTypeName);

			const reservedKeys = new Set(['data', 'limit', 'offset']);
			for (const [key, filterValue] of Object.entries(options)) {
				if (reservedKeys.has(key) || filterValue === undefined) continue;
				q = applyEntityFieldFilter(q, key as keyof CorsairEntity, filterValue);
			}

			if (options.data && typeof options.data === 'object') {
				for (const [key, filterValue] of Object.entries(options.data)) {
					if (filterValue === undefined) continue;
					const fieldType = dataFieldTypes[key] ?? 'string';
					q = applyDataFilter(q, key, fieldType, filterValue);
				}
			}

			if (typeof options.limit === 'number') q = q.limit(options.limit);
			if (typeof options.offset === 'number') q = q.offset(options.offset);

			const rows = await q.execute();
			return rows.map(parseRow);
		},

		upsertByEntityId: async (entityId, data) => {
			const accountId = await getAccountId();
			const parsed = dataSchema.parse(data);
			const now = new Date();

			const existing = await baseQuery(db, accountId, entityTypeName)
				.select('id')
				.where('entity_id', '=', entityId)
				.executeTakeFirst();

			if (existing?.id) {
				await db
					.updateTable('corsair_entities')
					.set({ version, data: parsed, updated_at: now })
					.where('id', '=', existing.id)
					.execute();
				const updated = await db
					.selectFrom('corsair_entities')
					.selectAll()
					.where('id', '=', existing.id)
					.executeTakeFirst();
				return parseRow(updated!);
			}

			const id = generateUUID();
			await db
				.insertInto('corsair_entities')
				.values({
					id,
					created_at: now,
					updated_at: now,
					account_id: accountId,
					entity_id: entityId,
					entity_type: entityTypeName,
					version,
					data: parsed,
				})
				.execute();

			const inserted = await db
				.selectFrom('corsair_entities')
				.selectAll()
				.where('id', '=', id)
				.executeTakeFirst();
			return parseRow(inserted!);
		},

		deleteById: async (id) => {
			const accountId = await getAccountId();
			const res = await db
				.deleteFrom('corsair_entities')
				.where('account_id', '=', accountId)
				.where('entity_type', '=', entityTypeName)
				.where('id', '=', id)
				.executeTakeFirst();
			return (
				Number((res as { numDeletedRows?: bigint | number }).numDeletedRows) > 0
			);
		},

		deleteByEntityId: async (entityId) => {
			const accountId = await getAccountId();
			const res = await db
				.deleteFrom('corsair_entities')
				.where('account_id', '=', accountId)
				.where('entity_type', '=', entityTypeName)
				.where('entity_id', '=', entityId)
				.executeTakeFirst();
			return (
				Number((res as { numDeletedRows?: bigint | number }).numDeletedRows) > 0
			);
		},

		count: async () => {
			const accountId = await getAccountId();
			const row = await db
				.selectFrom('corsair_entities')
				.select((eb) => eb.fn.countAll().as('count'))
				.where('account_id', '=', accountId)
				.where('entity_type', '=', entityTypeName)
				.executeTakeFirst();
			return parseCountValue((row as { count?: unknown })?.count);
		},
	};
}
