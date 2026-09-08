import { createCard } from './createCard';
import { createCardFromTemplate } from './createCardFromTemplate';
import { listTemplates } from './listTemplates';
import { previewFit } from './previewFit';

export const Templates = { list: listTemplates };
export const Cards = {
	create: createCard,
	createFromTemplate: createCardFromTemplate,
	previewFit: previewFit,
};

export * from './types';
