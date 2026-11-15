import { ClayCompany, ClayPerson, ClayRoutineRun } from './database';

export const ClaySchema = {
	version: '1.0.0',
	entities: {
		people: ClayPerson,
		companies: ClayCompany,
		routineRuns: ClayRoutineRun,
	},
} as const;

export type { ClayCompany, ClayPerson, ClayRoutineRun } from './database';
