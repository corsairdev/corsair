import {
	CoassembleClient,
	CoassembleCourse,
	CoassembleTracking,
	CoassembleUser,
} from './database';

export const CoassembleSchema = {
	version: '1.0.0',
	entities: {
		clients: CoassembleClient,
		courses: CoassembleCourse,
		trackings: CoassembleTracking,
		users: CoassembleUser,
	},
} as const;
