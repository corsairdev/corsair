import { extractEntities, moderate, parse, sentiment } from './text';

export const Text = {
	parse,
	sentiment,
	moderate,
	extractEntities,
};

export * from './types';
