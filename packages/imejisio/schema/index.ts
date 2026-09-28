import { ImejisioRender } from './database';

export const ImejisioSchema = {
	version: '1.0.0',
	entities: {
		renders: ImejisioRender,
	},
} as const;
