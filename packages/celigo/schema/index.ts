import {
	CeligoConnection,
	CeligoExport,
	CeligoFlow,
	CeligoIClient,
	CeligoImport,
	CeligoIntegration,
	CeligoJob,
	CeligoScript,
	CeligoTag,
	CeligoUser,
} from './database';

export const CeligoSchema = {
	version: '1.0.0',
	entities: {
		integrations: CeligoIntegration,
		flows: CeligoFlow,
		connections: CeligoConnection,
		exports: CeligoExport,
		imports: CeligoImport,
		scripts: CeligoScript,
		tags: CeligoTag,
		iclients: CeligoIClient,
		users: CeligoUser,
		jobs: CeligoJob,
	},
} as const;
