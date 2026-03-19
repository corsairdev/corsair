import { GranolaNote, GranolaPerson, GranolaTranscript } from './database';

export const GranolaSchema = {
	version: '1.0.0',
	entities: {
		notes: GranolaNote,
		people: GranolaPerson,
		transcripts: GranolaTranscript,
	},
} as const;
