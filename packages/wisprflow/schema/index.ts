import { WisprFlowTranscription } from './database';

export const WisprFlowSchema = {
	version: '1.0.0',
	entities: {
		transcription: WisprFlowTranscription,
	},
} as const;
