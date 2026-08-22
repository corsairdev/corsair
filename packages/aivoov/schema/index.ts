import { AivoovAudio, AivoovVoice } from './database';

export const AivoovSchema = {
	version: '1.1.0',
	entities: {
		voices: AivoovVoice,
		audio: AivoovAudio,
	},
} as const;
