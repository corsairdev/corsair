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

export interface WorkflowState {
  id: string;
  name: string;
  type: 'backlog' | 'unstarted' | 'started' | 'completed' | 'canceled';
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

export interface Project {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  state: 'planned' | 'started' | 'paused' | 'completed' | 'canceled';
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

export interface Issue {
  id: string;
  title: string;
  description?: string;
  priority: 0 | 1 | 2 | 3 | 4;
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

export interface IssueConnection {
  nodes: Issue[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

export interface TeamConnection {
  nodes: Team[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

export interface ProjectConnection {
  nodes: Project[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

export interface CommentConnection {
  nodes: Comment[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

export interface CreateIssueInput {
  title: string;
  description?: string;
  teamId: string;
  assigneeId?: string;
  priority?: 0 | 1 | 2 | 3 | 4;
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
  priority?: 0 | 1 | 2 | 3 | 4;
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
  state?: 'planned' | 'started' | 'paused' | 'completed' | 'canceled';
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
  state?: 'planned' | 'started' | 'paused' | 'completed' | 'canceled';
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

