import { CodaDocument, CodaTable } from './database';

export const CodaSchema = {
	version: '1.0.0',
	entities: {
		documents: CodaDocument,
		tables: CodaTable,
	},
} as const;
