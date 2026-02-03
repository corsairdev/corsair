import {
	LinearComment,
	LinearIssue,
	LinearProject,
	LinearTeam,
	LinearUser,
} from './database';

export const LinearSchema = {
	version: '1.0.0',
	entities: {
		issues: LinearIssue,
		teams: LinearTeam,
		projects: LinearProject,
		comments: LinearComment,
		users: LinearUser,
	},
} as const;
