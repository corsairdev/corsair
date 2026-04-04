import { z } from 'zod';
import {
	GithubIssue,
	GithubPullRequest,
	GithubRelease,
	GithubRepository,
	GithubUser,
	GithubWorkflow,
} from './database';

export const GithubCredentials = z.object({
	token: z.string(),
});

export type GithubCredentials = z.infer<typeof GithubCredentials>;

export const GithubSchema = {
	version: '1.0.0',
	entities: {
		users: GithubUser,
		repositories: GithubRepository,
		issues: GithubIssue,
		pullRequests: GithubPullRequest,
		releases: GithubRelease,
		workflows: GithubWorkflow,
	},
} as const;
