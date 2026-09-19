import { TursoChangeEvent } from './database';

export const TursoSchema = {
	version: '1.0.0',
	entities: {
		changeEvents: TursoChangeEvent,
	},
} as const;
