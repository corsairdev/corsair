import { list as listDesigns, render as renderDesign } from './designs';

/**
 * Designs endpoint group offering listing and rendering operations.
 */
export const Designs = {
	/** List the authenticated user's design templates. */
	list: listDesigns,
	/** Render an Imejis template design into image/PDF bytes or a hosted URL. */
	render: renderDesign,
};

export * from './types';
