import {
	deleteDesign,
	generateDesign,
	getDesign,
	listDesigns,
} from './designs';
import { listTemplates } from './templates';

export const Designs = {
	generate: generateDesign,
	get: getDesign,
	list: listDesigns,
	delete: deleteDesign,
};

export const Templates = {
	list: listTemplates,
};

export * from './types';
