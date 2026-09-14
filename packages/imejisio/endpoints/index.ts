import { render as renderDesign } from './designs';

/**
 * Designs endpoint group.
 */
export const Designs = {
	/** Render an Imejis template design into image/PDF bytes or a stored URL. */
	render: renderDesign,
};

export * from './types';
