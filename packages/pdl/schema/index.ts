import { PdlCompany, PdlPerson } from './database';

export const PdlSchema = {
	version: '1.0.0',
	entities: {
		people: PdlPerson,
		companies: PdlCompany,
	},
} as const;
