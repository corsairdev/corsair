import {
	JigsawstackPrompt,
	JigsawstackSummary,
	JigsawstackTranscription,
} from './database';

export const JigsawstackSchema = {
	version: '1.0.0',
	entities: {
		prompts: JigsawstackPrompt,
		summaries: JigsawstackSummary,
		transcriptions: JigsawstackTranscription,
	},
} as const;
