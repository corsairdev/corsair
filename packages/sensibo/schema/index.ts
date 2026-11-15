import { SensiboPodEntity } from './database';

export const SensiboSchema = {
	version: '1.0.0',
	entities: {
		pods: SensiboPodEntity,
	},
} as const;
