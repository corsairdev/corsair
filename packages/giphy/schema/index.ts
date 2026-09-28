import { GiphyCategory, GiphyGif } from './database';

export const GiphySchema = {
	version: '1.0.0',
	entities: {
		gifs: GiphyGif,
		categories: GiphyCategory,
	},
} as const;
