import { AbyssaleDesign, AbyssaleFont, AbyssaleProject } from './database';

export const AbyssaleSchema = {
	version: '1.0.0',
	entities: {
		projects: AbyssaleProject,
		designs: AbyssaleDesign,
		fonts: AbyssaleFont,
	},
} as const;
