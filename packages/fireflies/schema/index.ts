import {
	FirefliesAskFredThread,
	FirefliesTranscript,
	FirefliesUser,
} from './database';

export const FirefliesSchema = {
	version: '1.0.0',
	entities: {
		transcripts: FirefliesTranscript,
		users: FirefliesUser,
		askFredThreads: FirefliesAskFredThread,
	},
} as const;
