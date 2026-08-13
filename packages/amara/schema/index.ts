import { AmaraTeam, AmaraUser, AmaraVideo } from './database';

export const AmaraSchema = {
	version: '1.0.0',
	entities: {
		videos: AmaraVideo,
		users: AmaraUser,
		teams: AmaraTeam,
	},
} as const;

export * from './database';
