import { ErpnextDocumentEntitySchema } from './database';

export const ErpnextSchema = {
	version: '1.0.0',
	entities: {
		documents: ErpnextDocumentEntitySchema,
	},
} as const;
