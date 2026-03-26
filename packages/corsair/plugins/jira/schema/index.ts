import { JiraComment, JiraIssue, JiraProject, JiraSprint, JiraUser, JiraBoard } from './database';

export const JiraSchema = {
	version: '1.0.0',
	entities: {
		issues: JiraIssue,
		projects: JiraProject,
		comments: JiraComment,
		sprints: JiraSprint,
		users: JiraUser,
		boards: JiraBoard,
	},
} as const;

export type { JiraComment, JiraIssue, JiraProject, JiraSprint, JiraUser, JiraBoard } from './database';
