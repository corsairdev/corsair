import {
	AffindaCollection,
	AffindaDocument,
	AffindaWorkspace,
} from './database';

export const AffindaSchema = {
	version: '1.0.0',
	entities: {
		documents: AffindaDocument,
		collections: AffindaCollection,
		workspaces: AffindaWorkspace,
	},
} as const;
