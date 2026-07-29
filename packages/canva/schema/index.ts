import {
	CanvaAsset,
	CanvaBrandTemplate,
	CanvaDesign,
	CanvaFolder,
} from './database';

export const CanvaSchema = {
	version: '1.1.0',
	entities: {
		designs: CanvaDesign,
		assets: CanvaAsset,
		folders: CanvaFolder,
		brandTemplates: CanvaBrandTemplate,
	},
} as const;
