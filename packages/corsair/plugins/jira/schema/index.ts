import { JiraComment, JiraIssue, JiraProject, JiraSprint } from './database';

export const JiraSchema = {
	version: '1.0.0',
	entities: {
		issues: JiraIssue,
		projects: JiraProject,
		comments: JiraComment,
		sprints: JiraSprint,
	},
} as const;

export type { JiraComment, JiraIssue, JiraProject, JiraSprint } from './database';
