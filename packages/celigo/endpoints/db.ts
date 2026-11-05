import type { CeligoContext } from '../index';
import { CeligoSchema } from '../schema';

export type CeligoEntity = keyof typeof CeligoSchema.entities;

// Celigo prefixes ids and references with an underscore (`_id`, `_flowId`).
// Stored rows use `id` and `flowId`.
// Safe: rows are re-parsed by the entity schema before they are stored.
// A narrower type is not practical because the response is a loose object with adaptor-specific keys.
function toRow(doc: Record<string, unknown>): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(doc).map(([key, value]) => [key.replace(/^_/, ''), value]),
	);
}

// Safe: the guard only checks for a plain object.
// A narrower type is not practical because the response is a loose object with adaptor-specific keys.
function isDoc(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function saveEntities(
	ctx: CeligoContext,
	entity: CeligoEntity,
	// Safe: it is narrowed with Array.isArray and isDoc before use.
	// A narrower type is not practical because the response is one document or a list of them.
	response: unknown,
): Promise<void> {
	const docs = Array.isArray(response) ? response : [response];
	try {
		for (const doc of docs) {
			if (!isDoc(doc)) continue;
			const row = toRow(doc);
			const id = row.id;
			if (typeof id !== 'string') continue;
			switch (entity) {
				case 'integrations':
					await ctx.db.integrations.upsertByEntityId(
						id,
						CeligoSchema.entities.integrations.parse(row),
					);
					break;
				case 'flows':
					await ctx.db.flows.upsertByEntityId(
						id,
						CeligoSchema.entities.flows.parse(row),
					);
					break;
				case 'connections':
					await ctx.db.connections.upsertByEntityId(
						id,
						CeligoSchema.entities.connections.parse(row),
					);
					break;
				case 'exports':
					await ctx.db.exports.upsertByEntityId(
						id,
						CeligoSchema.entities.exports.parse(row),
					);
					break;
				case 'imports':
					await ctx.db.imports.upsertByEntityId(
						id,
						CeligoSchema.entities.imports.parse(row),
					);
					break;
				case 'scripts':
					await ctx.db.scripts.upsertByEntityId(
						id,
						CeligoSchema.entities.scripts.parse(row),
					);
					break;
				case 'tags':
					await ctx.db.tags.upsertByEntityId(
						id,
						CeligoSchema.entities.tags.parse(row),
					);
					break;
				case 'iclients':
					await ctx.db.iclients.upsertByEntityId(
						id,
						CeligoSchema.entities.iclients.parse(row),
					);
					break;
				case 'users':
					await ctx.db.users.upsertByEntityId(
						id,
						CeligoSchema.entities.users.parse(row),
					);
					break;
				case 'jobs':
					await ctx.db.jobs.upsertByEntityId(
						id,
						CeligoSchema.entities.jobs.parse(row),
					);
					break;
			}
		}
	} catch (error) {
		console.warn(`Failed to save celigo ${entity} to database:`, error);
	}
}

export async function deleteEntity(
	ctx: CeligoContext,
	entity: CeligoEntity,
	id: string,
): Promise<void> {
	try {
		await ctx.db[entity].deleteByEntityId(id);
	} catch (error) {
		console.warn(`Failed to delete celigo ${entity} from database:`, error);
	}
}
