import { TinypngImage, TinypngStoredOutput, TinypngUsage } from './database';

export const TinypngSchema = {
	version: '1.0.0',
	entities: {
		images: TinypngImage,
		storedOutputs: TinypngStoredOutput,
		usage: TinypngUsage,
	},
} as const;
