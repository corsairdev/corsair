import { AivoovVoice } from './database';

export const AivoovSchema = {
	version: '1.0.0',
	entities: {
		voices: AivoovVoice,
	},
} as const;

export { AivoovVoice };
