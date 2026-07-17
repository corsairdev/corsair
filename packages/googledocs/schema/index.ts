import { GoogleDocsDocument } from './database';

export const GoogleDocsSchema = {
	version: '1.0.0',
	entities: {
		documents: GoogleDocsDocument,
	},
} as const;
