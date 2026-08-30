import { generateDesign, getDesign, listDesigns } from './designs';
import { listTemplates } from './templates';

/** Design operations module grouping for Dynapictures endpoints */
export const Designs = {
	generate: generateDesign,
	get: getDesign,
	list: listDesigns,
};

/** Template operations module grouping for Dynapictures endpoints */
export const Templates = {
	list: listTemplates,
};

export * from './types';
