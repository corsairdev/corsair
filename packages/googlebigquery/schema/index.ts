import {
	GoogleBigqueryDataset,
	GoogleBigqueryJob,
	GoogleBigqueryModel,
	GoogleBigqueryRoutine,
	GoogleBigqueryTable,
} from './database';

export const GoogleBigquerySchema = {
	version: '1.0.0',
	entities: {
		datasets: GoogleBigqueryDataset,
		tables: GoogleBigqueryTable,
		jobs: GoogleBigqueryJob,
		routines: GoogleBigqueryRoutine,
		models: GoogleBigqueryModel,
	},
} as const;
