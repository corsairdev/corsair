import { z } from 'zod';

// Zod Schemas
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  displayName: z.string(),
  avatarUrl: z.string().optional(),
  active: z.boolean(),
  admin: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
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

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  key: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  private: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  archivedAt: z.string().optional(),
});
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

export const WorkflowStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['backlog', 'unstarted', 'started', 'completed', 'canceled']),
  color: z.string(),
  position: z.number(),
  description: z.string().optional(),
  team: TeamSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});
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

export const LabelSchema: z.ZodType<any> = z.lazy(() => z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  color: z.string(),
  team: TeamSchema.optional(),
  parent: z.lazy(() => LabelSchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
}));
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

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  state: z.enum(['planned', 'started', 'paused', 'completed', 'canceled']),
  priority: z.number(),
  sortOrder: z.number(),
  startDate: z.string().optional(),
  targetDate: z.string().optional(),
  completedAt: z.string().optional(),
  canceledAt: z.string().optional(),
  lead: UserSchema.optional(),
  teams: z.array(TeamSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  archivedAt: z.string().optional(),
});
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

export const CycleSchema = z.object({
  id: z.string(),
  number: z.number(),
  name: z.string().optional(),
  description: z.string().optional(),
  startsAt: z.string(),
  endsAt: z.string(),
  completedAt: z.string().optional(),
  team: TeamSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  archivedAt: z.string().optional(),
});
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

export const IssueSchema: z.ZodType<any> = z.lazy(() => z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  priority: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  estimate: z.number().optional(),
  sortOrder: z.number(),
  number: z.number(),
  identifier: z.string(),
  url: z.string(),
  state: WorkflowStateSchema,
  team: TeamSchema,
  assignee: UserSchema.optional(),
  creator: UserSchema,
  project: ProjectSchema.optional(),
  cycle: CycleSchema.optional(),
  parent: z.lazy(() => IssueSchema).optional(),
  labels: z.array(LabelSchema),
  subscribers: z.array(UserSchema),
  dueDate: z.string().optional(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  canceledAt: z.string().optional(),
  triagedAt: z.string().optional(),
  snoozedUntilAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  archivedAt: z.string().optional(),
}));
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

export const CommentSchema: z.ZodType<any> = z.lazy(() => z.object({
  id: z.string(),
  body: z.string(),
  issue: IssueSchema,
  user: UserSchema,
  parent: z.lazy(() => CommentSchema).optional(),
  editedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  archivedAt: z.string().optional(),
}));
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

export const PageInfoSchema = z.object({
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  startCursor: z.string().optional(),
  endCursor: z.string().optional(),
});

export const IssueConnectionSchema = z.object({
  nodes: z.array(IssueSchema),
  pageInfo: PageInfoSchema,
});
export interface IssueConnection {
  nodes: Issue[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

export const TeamConnectionSchema = z.object({
  nodes: z.array(TeamSchema),
  pageInfo: PageInfoSchema,
});
export interface TeamConnection {
  nodes: Team[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

export const ProjectConnectionSchema = z.object({
  nodes: z.array(ProjectSchema),
  pageInfo: PageInfoSchema,
});
export interface ProjectConnection {
  nodes: Project[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

export const CommentConnectionSchema = z.object({
  nodes: z.array(CommentSchema),
  pageInfo: PageInfoSchema,
});
export interface CommentConnection {
  nodes: Comment[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

export const CreateIssueInputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  teamId: z.string(),
  assigneeId: z.string().optional(),
  priority: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  estimate: z.number().optional(),
  stateId: z.string().optional(),
  projectId: z.string().optional(),
  cycleId: z.string().optional(),
  parentId: z.string().optional(),
  labelIds: z.array(z.string()).optional(),
  subscriberIds: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
});
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

export const UpdateIssueInputSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  priority: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  estimate: z.number().optional(),
  stateId: z.string().optional(),
  projectId: z.string().optional(),
  cycleId: z.string().optional(),
  parentId: z.string().optional(),
  labelIds: z.array(z.string()).optional(),
  subscriberIds: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
});
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

export const CreateProjectInputSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  teamIds: z.array(z.string()),
  leadId: z.string().optional(),
  state: z.enum(['planned', 'started', 'paused', 'completed', 'canceled']).optional(),
  priority: z.number().optional(),
  startDate: z.string().optional(),
  targetDate: z.string().optional(),
});
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

export const UpdateProjectInputSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  teamIds: z.array(z.string()).optional(),
  leadId: z.string().optional(),
  state: z.enum(['planned', 'started', 'paused', 'completed', 'canceled']).optional(),
  priority: z.number().optional(),
  startDate: z.string().optional(),
  targetDate: z.string().optional(),
});
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

export const CreateCommentInputSchema = z.object({
  issueId: z.string(),
  body: z.string(),
  parentId: z.string().optional(),
});
export interface CreateCommentInput {
  issueId: string;
  body: string;
  parentId?: string;
}

export const UpdateCommentInputSchema = z.object({
  body: z.string().optional(),
});
export interface UpdateCommentInput {
  body?: string;
}

