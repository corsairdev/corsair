import { hubplannerEntities } from './database';

export const HubPlannerSchema = {
	version: '1.0.0',
	entities: hubplannerEntities,
} as const;
