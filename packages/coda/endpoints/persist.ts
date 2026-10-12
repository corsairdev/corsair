import type { CodaContext } from '..';
import type { CodaDocument, CodaTable } from '../schema/database';

type Reference = Pick<
	CodaDocument & CodaTable,
	'id' | 'name' | 'type' | 'href' | 'browserLink'
>;

type EntityClient = {
	upsertByEntityId: (entityId: string, data: Reference) => Promise<object>;
};

async function save(
	client: EntityClient | undefined,
	items: Reference[],
): Promise<void> {
	if (!client) return;
	for (const { id, name, type, href, browserLink } of items) {
		try {
			await client.upsertByEntityId(id, { id, name, type, href, browserLink });
		} catch (error) {
			console.warn(`Failed to save Coda ${type ?? 'entity'} ${id}:`, error);
		}
	}
}

export function saveDocs(ctx: CodaContext, docs: Reference[]): Promise<void> {
	return save(ctx.db.documents, docs);
}

export function saveTables(
	ctx: CodaContext,
	tables: Reference[],
): Promise<void> {
	return save(ctx.db.tables, tables);
}
