import {
	WitAiApp,
	WitAiEntity,
	WitAiIntent,
	WitAiTag,
	WitAiTrait,
	WitAiUtterance,
	WitAiVoice,
} from './database';

export const WitAiSchema = {
	version: '1.0.0',
	entities: {
		apps: WitAiApp,
		intents: WitAiIntent,
		entities: WitAiEntity,
		traits: WitAiTrait,
		utterances: WitAiUtterance,
		voices: WitAiVoice,
		tags: WitAiTag,
	},
} as const;

export * from './database';
