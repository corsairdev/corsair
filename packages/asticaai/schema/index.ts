import { AsticaAiAudioTranscript, AsticaAiReadTextResult } from './database';

export const AsticaAiSchema = {
	version: '1.0.0',
	entities: {
		readTextResults: AsticaAiReadTextResult,
		audioTranscripts: AsticaAiAudioTranscript,
	},
} as const;
