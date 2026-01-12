import { z } from 'zod';
import {
	LinearComment,
	LinearIssue,
	LinearProject,
	LinearTeam,
	LinearUser,
} from './database';

export const LinearCredentials = z.object({
	apiKey: z.string(),
});

export type LinearCredentials = z.infer<typeof LinearCredentials>;

export const LinearSchema = {
	version: '1.0.0',
	services: {
		issues: LinearIssue,
		teams: LinearTeam,
		projects: LinearProject,
		comments: LinearComment,
		users: LinearUser,
	},
} as const;

