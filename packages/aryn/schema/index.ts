import { ArynDocSet, ArynDocument } from './database';

export const ArynSchema = {
	version: '1.0.0',
	entities: {
		docset: ArynDocSet,
		document: ArynDocument,
	},
} as const;
