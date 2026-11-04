import { z } from 'zod';
import { DocusignSchema } from '../schema';
import type { DocusignExecutionContext } from './types';

type EntityName = keyof typeof DocusignSchema.entities;

const Row = z.record(z.string(), z.json());
type Row = z.infer<typeof Row>;

type EntityStore = {
	upsertByEntityId: (id: string, data: object) => Promise<object | undefined>;
};

function isEntityStore(value: object | null | undefined): value is EntityStore {
	return (
		typeof value === 'object' &&
		value !== null &&
		'upsertByEntityId' in value &&
		typeof value.upsertByEntityId === 'function'
	);
}

function storeFor(
	ctx: DocusignExecutionContext,
	entity: EntityName,
): EntityStore | undefined {
	if (typeof ctx !== 'object' || ctx === null || !('db' in ctx)) {
		return undefined;
	}
	const db = ctx.db;
	if (typeof db !== 'object' || db === null) return undefined;
	const store = Reflect.get(db, entity);
	return isEntityStore(store) ? store : undefined;
}

function stringField(row: Row, name: string): string | undefined {
	const value = row[name];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

async function saveRows(
	ctx: DocusignExecutionContext,
	entity: EntityName,
	rows: ReadonlyArray<Row>,
	idOf: (row: Row) => string | undefined,
): Promise<void> {
	const store = storeFor(ctx, entity);
	if (!store) return;
	const schema = DocusignSchema.entities[entity];
	for (const row of rows) {
		const id = idOf(row);
		const parsed = schema.safeParse(row);
		if (!id || !parsed.success) continue;
		try {
			await store.upsertByEntityId(id, parsed.data);
		} catch (error) {
			console.warn(`Failed to save docusign ${entity} to database:`, error);
		}
	}
}

// Safe: the value is validated by the Row zod schema before use.
// A narrower type is not practical because DocuSign responses are arbitrary JSON.
function asRow(value: unknown): Row | undefined {
	const parsed = Row.safeParse(value);
	return parsed.success ? parsed.data : undefined;
}

function rowsIn(body: Row, listKey: string): Row[] {
	const list = body[listKey];
	if (!Array.isArray(list)) return [];
	const rows: Row[] = [];
	for (const item of list) {
		const row = asRow(item);
		if (row) rows.push(row);
	}
	return rows;
}

/** Persists the object a response returns, keyed by `idField`. */
export async function persistOne(
	ctx: DocusignExecutionContext,
	entity: EntityName,
	// Safe: asRow validates the response before it is read.
	// A narrower type is not practical because endpoint responses are arbitrary JSON.
	response: unknown,
	idField: string,
	extra: Row = {},
): Promise<void> {
	const body = asRow(response);
	if (!body) return;
	await saveRows(ctx, entity, [{ ...body, ...extra }], (row) =>
		stringField(row, idField),
	);
}

/** Persists every object in `response[listKey]`, keyed by `idField`. */
export async function persistList(
	ctx: DocusignExecutionContext,
	entity: EntityName,
	// Safe: asRow validates the response before it is read.
	// A narrower type is not practical because endpoint responses are arbitrary JSON.
	response: unknown,
	listKey: string,
	idField: string,
	extra: Row = {},
): Promise<void> {
	const body = asRow(response);
	if (!body) return;
	const rows = rowsIn(body, listKey).map((row) => ({ ...row, ...extra }));
	await saveRows(ctx, entity, rows, (row) => stringField(row, idField));
}

/** Persists envelope documents under the composite id `<envelopeId>:<documentId>`. */
export async function persistDocuments(
	ctx: DocusignExecutionContext,
	envelopeId: string,
	// Safe: asRow validates the response before it is read.
	// A narrower type is not practical because endpoint responses are arbitrary JSON.
	response: unknown,
): Promise<void> {
	const body = asRow(response);
	if (!body) return;
	const rows = rowsIn(body, 'envelopeDocuments').map((row) => ({
		...row,
		envelopeId,
	}));
	await saveRows(ctx, 'documents', rows, (row) => {
		const documentId = stringField(row, 'documentId');
		return documentId ? `${envelopeId}:${documentId}` : undefined;
	});
}

/**
 * Persists the recipients of an envelope under `<envelopeId>:<recipientId>`.
 * `Recipients` groups them by type (signers, carbonCopies, ...); the group key
 * is stored as `recipientType`.
 */
export async function persistRecipients(
	ctx: DocusignExecutionContext,
	envelopeId: string,
	// Safe: asRow validates the response before it is read.
	// A narrower type is not practical because endpoint responses are arbitrary JSON.
	response: unknown,
): Promise<void> {
	const body = asRow(response);
	if (!body) return;
	const rows = Object.keys(body).flatMap((recipientType) =>
		rowsIn(body, recipientType).map((row) => ({
			...row,
			envelopeId,
			recipientType,
		})),
	);
	await saveRows(ctx, 'recipients', rows, (row) => {
		const recipientId = stringField(row, 'recipientId');
		return recipientId ? `${envelopeId}:${recipientId}` : undefined;
	});
}
