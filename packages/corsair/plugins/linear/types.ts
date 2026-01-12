export interface User {
	id: string;
	name: string;
	email?: string;
	displayName: string;
	avatarUrl?: string;
	active: boolean;
	admin: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Team {
	id: string;
	name: string;
	key: string;
	description?: string;
	icon?: string;
	color?: string;
	private: boolean;
	createdAt: string;
	updatedAt: string;
	archivedAt?: string;
}

export type WorkflowStateType =
	| 'backlog'
	| 'unstarted'
	| 'started'
	| 'completed'
	| 'canceled';

export interface WorkflowState {
	id: string;
	name: string;
	type: WorkflowStateType;
	color: string;
	position: number;
	description?: string;
	team: Team;
	createdAt: string;
	updatedAt: string;
}

export interface Label {
	id: string;
	name: string;
	description?: string;
	color: string;
	team?: Team;
	parent?: Label;
	createdAt: string;
	updatedAt: string;
}

export type ProjectState =
	| 'planned'
	| 'started'
	| 'paused'
	| 'completed'
	| 'canceled';

export interface Project {
	id: string;
	name: string;
	description?: string;
	icon?: string;
	color?: string;
	state: ProjectState;
	priority: number;
	sortOrder: number;
	startDate?: string;
	targetDate?: string;
	completedAt?: string;
	canceledAt?: string;
	lead?: User;
	teams: Team[];
	createdAt: string;
	updatedAt: string;
	archivedAt?: string;
}

export interface Cycle {
	id: string;
	number: number;
	name?: string;
	description?: string;
	startsAt: string;
	endsAt: string;
	completedAt?: string;
	team: Team;
	createdAt: string;
	updatedAt: string;
	archivedAt?: string;
}

export type IssuePriority = 0 | 1 | 2 | 3 | 4;

export interface Issue {
	id: string;
	title: string;
	description?: string;
	priority: IssuePriority;
	estimate?: number;
	sortOrder: number;
	number: number;
	identifier: string;
	url: string;
	state: WorkflowState;
	team: Team;
	assignee?: User;
	creator: User;
	project?: Project;
	cycle?: Cycle;
	parent?: Issue;
	labels: Label[];
	subscribers: User[];
	dueDate?: string;
	startedAt?: string;
	completedAt?: string;
	canceledAt?: string;
	triagedAt?: string;
	snoozedUntilAt?: string;
	createdAt: string;
	updatedAt: string;
	archivedAt?: string;
}

export interface Comment {
	id: string;
	body: string;
	issue: Issue;
	user: User;
	parent?: Comment;
	editedAt?: string;
	createdAt: string;
	updatedAt: string;
	archivedAt?: string;
}

export interface PageInfo {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor?: string;
	endCursor?: string;
}

export interface IssueConnection {
	nodes: Issue[];
	pageInfo: PageInfo;
}

export interface TeamConnection {
	nodes: Team[];
	pageInfo: PageInfo;
}

export interface ProjectConnection {
	nodes: Project[];
	pageInfo: PageInfo;
}

export interface CommentConnection {
	nodes: Comment[];
	pageInfo: PageInfo;
}

export interface CreateIssueInput {
	title: string;
	description?: string;
	teamId: string;
	assigneeId?: string;
	priority?: IssuePriority;
	estimate?: number;
	stateId?: string;
	projectId?: string;
	cycleId?: string;
	parentId?: string;
	labelIds?: string[];
	subscriberIds?: string[];
	dueDate?: string;
}

export interface UpdateIssueInput {
	title?: string;
	description?: string;
	assigneeId?: string;
	priority?: IssuePriority;
	estimate?: number;
	stateId?: string;
	projectId?: string;
	cycleId?: string;
	parentId?: string;
	labelIds?: string[];
	subscriberIds?: string[];
	dueDate?: string;
}

export interface CreateProjectInput {
	name: string;
	description?: string;
	icon?: string;
	color?: string;
	teamIds: string[];
	leadId?: string;
	state?: ProjectState;
	priority?: number;
	startDate?: string;
	targetDate?: string;
}

export interface UpdateProjectInput {
	name?: string;
	description?: string;
	icon?: string;
	color?: string;
	teamIds?: string[];
	leadId?: string;
	state?: ProjectState;
	priority?: number;
	startDate?: string;
	targetDate?: string;
}

export interface CreateCommentInput {
	issueId: string;
	body: string;
	parentId?: string;
}

export interface UpdateCommentInput {
	body?: string;
}

export interface IssuesListResponse {
	issues: IssueConnection;
}

export interface IssueGetResponse {
	issue: Issue;
}

export interface IssueCreateResponse {
	issueCreate: {
		success: boolean;
		issue: Issue;
	};
}

export interface IssueUpdateResponse {
	issueUpdate: {
		success: boolean;
		issue: Issue;
	};
}

export interface IssueDeleteResponse {
	issueDelete: {
		success: boolean;
	};
}

export interface TeamsListResponse {
	teams: TeamConnection;
}

export interface TeamGetResponse {
	team: Team;
}

export interface ProjectsListResponse {
	projects: ProjectConnection;
}

export interface ProjectGetResponse {
	project: Project;
}

export interface ProjectCreateResponse {
	projectCreate: {
		success: boolean;
		project: Project;
	};
}

export interface ProjectUpdateResponse {
	projectUpdate: {
		success: boolean;
		project: Project;
	};
}

export interface ProjectDeleteResponse {
	projectDelete: {
		success: boolean;
	};
}

export type CommentsListResponse = {
	issue: {
		comments: CommentConnection;
	};
};

export type CommentCreateResponse = {
	commentCreate: {
		success: boolean;
		comment: Comment;
	};
};

export type CommentUpdateResponse = {
	commentUpdate: {
		success: boolean;
		comment: Comment;
	};
};

export type CommentDeleteResponse = {
	commentDelete: {
		success: boolean;
	};
};

export type LinearEndpointOutputs = {
	issuesList: IssueConnection;
	issuesGet: Issue;
	issuesCreate: Issue;
	issuesUpdate: Issue;
	issuesDelete: boolean;
	teamsList: TeamConnection;
	teamsGet: Team;
	projectsList: ProjectConnection;
	projectsGet: Project;
	projectsCreate: Project;
	projectsUpdate: Project;
	projectsDelete: boolean;
	commentsList: CommentConnection;
	commentsCreate: Comment;
	commentsUpdate: Comment;
	commentsDelete: boolean;
};

