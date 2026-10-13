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
	partial: boolean,
): Promise<void> {
	if (!client) return;
	for (const { entityId, data } of items) {
		try {
			// A partial record (a list reference) keeps the detail fields a get already stored; a full record replaces them.
			const existing = partial ? await client.findByEntityId(entityId) : null;
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
	return save(ctx.db.documents, 'document', byId(docs), false);
}

export function savePages(ctx: CodaContext, pages: CodaPage[]) {
	return save(ctx.db.pages, 'page', byId(pages), false);
}

export function saveTables(
	ctx: CodaContext,
	tables: CodaTable[],
	partial = false,
) {
	return save(ctx.db.tables, 'table', byId(tables), partial);
}

export function saveColumns(ctx: CodaContext, columns: CodaColumn[]) {
	return save(ctx.db.columns, 'column', byId(columns), false);
}

export function saveRows(ctx: CodaContext, rows: CodaRow[]) {
	return save(ctx.db.rows, 'row', byId(rows), false);
}

export function saveFolders(ctx: CodaContext, folders: CodaFolder[]) {
	return save(ctx.db.folders, 'folder', byId(folders), false);
}

export function saveFormulas(
	ctx: CodaContext,
	formulas: CodaFormula[],
	partial = false,
) {
	return save(ctx.db.formulas, 'formula', byId(formulas), partial);
}

export function saveControls(
	ctx: CodaContext,
	controls: CodaControl[],
	partial = false,
) {
	return save(ctx.db.controls, 'control', byId(controls), partial);
}

export function savePacks(
	ctx: CodaContext,
	packs: CodaPack[],
	partial = false,
) {
	return save(
		ctx.db.packs,
		'pack',
		packs.map((data) => ({ entityId: String(data.id), data })),
		partial,
	);
}
