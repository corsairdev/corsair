import {
	CodaColumn,
	CodaControl,
	CodaDocument,
	CodaFolder,
	CodaFormula,
	CodaPack,
	CodaPage,
	CodaRow,
	CodaTable,
} from './database';

export const CodaSchema = {
	version: '1.0.0',
	entities: {
		documents: CodaDocument,
		pages: CodaPage,
		tables: CodaTable,
		columns: CodaColumn,
		rows: CodaRow,
		folders: CodaFolder,
		formulas: CodaFormula,
		controls: CodaControl,
		packs: CodaPack,
	},
} as const;
