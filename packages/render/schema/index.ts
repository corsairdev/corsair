import { RenderOwnerSchema } from './database';

export const RenderSchema = {
	version: '1.0.0',
	entities: {
		renderOwner: RenderOwnerSchema,
	},
} as const;
