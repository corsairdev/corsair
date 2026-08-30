import { DynapicturesDesign, DynapicturesTemplate } from './database';

/** Plugin database schema registration for Dynapictures entities */
export const DynapicturesSchema = {
	version: '1.0.0',
	entities: {
		design: DynapicturesDesign,
		template: DynapicturesTemplate,
	},
} as const;

export * from './database';
