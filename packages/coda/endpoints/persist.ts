import type { CodaContext } from '..';
import type {
	CodaColumn,
	CodaControl,
	CodaDocument,
	CodaFolder,
	CodaFormula,
	CodaPack,
	CodaPage,
	CodaRow,
	CodaTable,
} from '../schema/database';

type EntityClient<T> = {
	findByEntityId: (entityId: string) => Promise<{ data: T } | null>;
	upsertByEntityId: (entityId: string, data: T) => Promise<object>;
};

async function save<T>(
	client: EntityClient<T> | undefined,
	label: string,
	items: { entityId: string; data: T }[],
): Promise<void> {
	if (!client) return;
	for (const { entityId, data } of items) {
		try {
			// List endpoints return references without the detail fields, so keep what a get already stored.
			const existing = await client.findByEntityId(entityId);
			await client.upsertByEntityId(entityId, { ...existing?.data, ...data });
		} catch (error) {
			console.warn(`Failed to save Coda ${label} ${entityId}:`, error);
		}
	}
}

function byId<T extends { id: string }>(items: T[]) {
	return items.map((data) => ({ entityId: data.id, data }));
}

export function saveDocs(ctx: CodaContext, docs: CodaDocument[]) {
	return save(ctx.db.documents, 'document', byId(docs));
}

export function savePages(ctx: CodaContext, pages: CodaPage[]) {
	return save(ctx.db.pages, 'page', byId(pages));
}

export function saveTables(ctx: CodaContext, tables: CodaTable[]) {
	return save(ctx.db.tables, 'table', byId(tables));
}

export function saveColumns(ctx: CodaContext, columns: CodaColumn[]) {
	return save(ctx.db.columns, 'column', byId(columns));
}

export function saveRows(ctx: CodaContext, rows: CodaRow[]) {
	return save(ctx.db.rows, 'row', byId(rows));
}

export function saveFolders(ctx: CodaContext, folders: CodaFolder[]) {
	return save(ctx.db.folders, 'folder', byId(folders));
}

export function saveFormulas(ctx: CodaContext, formulas: CodaFormula[]) {
	return save(ctx.db.formulas, 'formula', byId(formulas));
}

export function saveControls(ctx: CodaContext, controls: CodaControl[]) {
	return save(ctx.db.controls, 'control', byId(controls));
}

export function savePacks(ctx: CodaContext, packs: CodaPack[]) {
	return save(
		ctx.db.packs,
		'pack',
		packs.map((data) => ({ entityId: String(data.id), data })),
	);
}
