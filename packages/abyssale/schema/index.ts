import {
	AbyssaleBanner,
	AbyssaleDesign,
	AbyssaleFont,
	AbyssaleProject,
} from './database';

export const AbyssaleSchema = {
	version: '1.1.0',
	entities: {
		projects: AbyssaleProject,
		designs: AbyssaleDesign,
		fonts: AbyssaleFont,
		banners: AbyssaleBanner,
	},
} as const;
