import { z } from 'zod';
import {
	EverhourClient,
	EverhourExpense,
	EverhourExpenseCategory,
	EverhourInvoice,
	EverhourPlatform,
	EverhourProject,
	EverhourSection,
	EverhourTag,
	EverhourTask,
	EverhourTimecard,
	EverhourTimeEntry,
	EverhourTimesheetApproval,
	EverhourUser,
	EverhourWebhook,
} from '../schema/database';

const QueryValueSchema = z.union([z.string(), z.number(), z.boolean()]);
const QueryRecordSchema = z.record(z.string(), QueryValueSchema).optional();
const EmptyResponseSchema = z.null().optional();

export type EverhourEndpointInputs = {
	getUser: {};
	listTeamUsers: {
		query?: Record<string, string | number | boolean>;
		limit?: number;
	};
	listTeams: {};
	getCurrentTimer: {};
	startTimer: { task: string; userDate?: string; comment?: string };
	stopTimer: {};
	listUserTime: {
		userId: string;
		query?: Record<string, string | number | boolean>;
	};
	listUserTimesheets: {
		userId: string;
		query?: Record<string, string | number | boolean>;
	};
	logTime: {
		time: number;
		date?: string;
		task?: string;
		user?: number;
		comment?: string;
	};
	updateTimeEntry: {
		timeId: string;
		time: number;
		date?: string;
		task?: string;
		user?: number;
		comment?: string;
	};
	deleteTimeEntry: { timeId: string };
	requestTimesheetApproval: {
		timesheetId: string;
		comment?: string;
		reviewer?: number;
		sendNotification?: boolean;
	};
	discardTimesheetApproval: {
		timesheetId: string;
		comment?: string;
		reviewer?: number;
		sendNotification?: boolean;
	};
	searchTasks: {
		query: string;
		project?: string;
		limit?: number;
		searchInClosed?: boolean;
	};
	getTask: { taskId: string };
	listTasksForProject: {
		projectId: string;
		query?: {
			query?: string;
			limit?: number;
			page?: number;
			searchInClosed?: boolean;
			searchInUnscheduled?: boolean;
		};
	};
	createTask: {
		projectId: string;
		name: string;
		section?: number;
		labels?: string[];
		status?: 'open' | 'closed';
		description?: string;
	};
	listProjects: {
		query?: Record<string, string | number | boolean>;
		page?: number;
		limit?: number;
		platform?: string;
	};
	getProject: { projectId: string };
	createProject: {
		name: string;
		type: 'board' | 'list';
		users?: number[];
		client?: number | null;
		privacy?: boolean;
	};
	updateProject: {
		projectId: string;
		name?: string;
		type?: 'board' | 'list';
		users?: number[];
		client?: number | null;
		privacy?: boolean;
		color?: string;
	};
	deleteProject: { projectId: string };
	listSections: { projectId: string };
	getSection: { sectionId: string };
	createSection: {
		projectId: string;
		name: string;
		status?: 'open' | 'archived';
		collapsed?: boolean;
	};
	deleteSection: { sectionId: string };
	listClients: { query?: Record<string, string | number | boolean> };
	getClient: { clientId: string };
	createClient: {
		name: string;
		projects?: string[];
		businessDetails?: string;
		email?: string[];
		status?: string;
	};
	updateClient: {
		clientId: string;
		name?: string;
		projects?: string[];
		businessDetails?: string;
		email?: string[];
		status?: string;
	};
	deleteClient: { clientId: string };
	listPlatforms: {};
	clockIn: { userId: string; userDate?: string };
	clockOut: { userId: string; userDate?: string };
	getTimecard: { userId: string; date: string };
	listTimecards: { from?: string; to?: string };
	listUserTimecards: { userId: string; from?: string; to?: string };
	updateTimecard: {
		userId: string;
		date: string;
		clockIn?: string;
		clockOut?: string;
		breakTime?: number;
	};
	deleteTimecard: { userId: string; date: string };
	listExpenses: { query?: Record<string, string | number | boolean> };
	listExpenseCategories: {};
	listInvoices: { query?: Record<string, string | number | boolean> };
	listWebhooks: {};
	getWebhook: { hookId: string };
	createWebhook: {
		targetUrl: string;
		events: string[];
		project?: string | null;
	};
	updateWebhook: { hookId: string; events: string[] };
	deleteWebhook: { hookId: string };
	listTags: {};
};

// `unknown` below marks provider-controlled payloads Everhour does not
// document with a fixed shape; consumers must narrow before use.
export type EverhourEndpointOutputs = {
	getUser: EverhourUser;
	listTeamUsers: EverhourUser[];
	listTeams: unknown[];
	getCurrentTimer: Record<string, unknown>;
	startTimer: Record<string, unknown>;
	stopTimer: Record<string, unknown>;
	listUserTime: EverhourTimeEntry[];
	listUserTimesheets: Record<string, unknown>[];
	logTime: EverhourTimeEntry;
	updateTimeEntry: EverhourTimeEntry;
	deleteTimeEntry: void;
	requestTimesheetApproval: EverhourTimesheetApproval;
	discardTimesheetApproval: EverhourTimesheetApproval;
	searchTasks: EverhourTask[];
	getTask: EverhourTask;
	listTasksForProject: EverhourTask[];
	createTask: EverhourTask;
	listProjects: EverhourProject[];
	getProject: EverhourProject;
	createProject: EverhourProject;
	updateProject: EverhourProject;
	deleteProject: void;
	listSections: EverhourSection[];
	getSection: EverhourSection;
	createSection: EverhourSection;
	deleteSection: void;
	listClients: EverhourClient[];
	getClient: EverhourClient;
	createClient: EverhourClient;
	updateClient: EverhourClient;
	deleteClient: void;
	listPlatforms: EverhourPlatform[];
	clockIn: EverhourTimecard;
	clockOut: EverhourTimecard;
	getTimecard: EverhourTimecard;
	listTimecards: EverhourTimecard[];
	listUserTimecards: EverhourTimecard[];
	updateTimecard: EverhourTimecard;
	deleteTimecard: void;
	listExpenses: EverhourExpense[];
	listExpenseCategories: EverhourExpenseCategory[];
	listInvoices: EverhourInvoice[];
	listWebhooks: EverhourWebhook[];
	getWebhook: EverhourWebhook;
	createWebhook: EverhourWebhook;
	updateWebhook: EverhourWebhook;
	deleteWebhook: void;
	listTags: EverhourTag[];
};

const TimerResponseSchema = z.object({
	id: z.string().optional(),
	task_id: z.string().optional(),
	start_time: z.string().optional(),
	status: z.enum(['active', 'stopped']).optional(),
	duration: z.number().optional(),
	startedAt: z.string().optional(),
	// The timer task payload varies by provider integration; validated as unknown.
	task: z.unknown().optional(),
});

const TimesheetEntrySchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.passthrough();

const ApprovalBodySchema = z.object({
	timesheetId: z.string(),
	comment: z.string().optional(),
	reviewer: z.number().optional(),
	sendNotification: z.boolean().optional(),
});

export const EverhourEndpointInputSchemas = {
	getUser: z.object({}),
	listTeamUsers: z.object({
		query: QueryRecordSchema,
		limit: z.number().optional(),
	}),
	listTeams: z.object({}),
	getCurrentTimer: z.object({}),
	startTimer: z.object({
		task: z.string(),
		userDate: z.string().optional(),
		comment: z.string().optional(),
	}),
	stopTimer: z.object({}),
	listUserTime: z.object({
		userId: z.string(),
		query: QueryRecordSchema,
	}),
	listUserTimesheets: z.object({
		userId: z.string(),
		query: QueryRecordSchema,
	}),
	logTime: z.object({
		time: z.number(),
		date: z.string().optional(),
		task: z.string().optional(),
		user: z.number().optional(),
		comment: z.string().optional(),
	}),
	updateTimeEntry: z.object({
		timeId: z.string(),
		time: z.number(),
		date: z.string().optional(),
		task: z.string().optional(),
		user: z.number().optional(),
		comment: z.string().optional(),
	}),
	deleteTimeEntry: z.object({
		timeId: z.string(),
	}),
	requestTimesheetApproval: ApprovalBodySchema,
	discardTimesheetApproval: ApprovalBodySchema,
	searchTasks: z.object({
		query: z.string(),
		project: z.string().optional(),
		limit: z.number().optional(),
		searchInClosed: z.boolean().optional(),
	}),
	getTask: z.object({
		taskId: z.string(),
	}),
	listTasksForProject: z.object({
		projectId: z.string(),
		query: z
			.object({
				query: z.string().optional(),
				limit: z.number().optional(),
				page: z.number().optional(),
				searchInClosed: z.boolean().optional(),
				searchInUnscheduled: z.boolean().optional(),
			})
			.optional(),
	}),
	createTask: z.object({
		projectId: z.string(),
		name: z.string(),
		section: z.number().optional(),
		labels: z.array(z.string()).optional(),
		status: z.enum(['open', 'closed']).optional(),
		description: z.string().optional(),
	}),
	listProjects: z.object({
		query: QueryRecordSchema,
		page: z.number().optional(),
		limit: z.number().optional(),
		platform: z.string().optional(),
	}),
	getProject: z.object({
		projectId: z.string(),
	}),
	createProject: z.object({
		name: z.string(),
		type: z.enum(['board', 'list']),
		users: z.array(z.number()).optional(),
		client: z.number().nullable().optional(),
		privacy: z.boolean().optional(),
	}),
	updateProject: z.object({
		projectId: z.string(),
		name: z.string().optional(),
		type: z.enum(['board', 'list']).optional(),
		users: z.array(z.number()).optional(),
		client: z.number().nullable().optional(),
		privacy: z.boolean().optional(),
		color: z.string().optional(),
	}),
	deleteProject: z.object({
		projectId: z.string(),
	}),
	listSections: z.object({
		projectId: z.string(),
	}),
	getSection: z.object({
		sectionId: z.string(),
	}),
	createSection: z.object({
		projectId: z.string(),
		name: z.string(),
		status: z.enum(['open', 'archived']).optional(),
		collapsed: z.boolean().optional(),
	}),
	deleteSection: z.object({
		sectionId: z.string(),
	}),
	listClients: z.object({
		query: QueryRecordSchema,
	}),
	getClient: z.object({
		clientId: z.string(),
	}),
	createClient: z.object({
		name: z.string(),
		projects: z.array(z.string()).optional(),
		businessDetails: z.string().optional(),
		email: z.array(z.string()).optional(),
		status: z.string().optional(),
	}),
	updateClient: z.object({
		clientId: z.string(),
		name: z.string().optional(),
		projects: z.array(z.string()).optional(),
		businessDetails: z.string().optional(),
		email: z.array(z.string()).optional(),
		status: z.string().optional(),
	}),
	deleteClient: z.object({
		clientId: z.string(),
	}),
	listPlatforms: z.object({}),
	clockIn: z.object({
		userId: z.string(),
		userDate: z.string().optional(),
	}),
	clockOut: z.object({
		userId: z.string(),
		userDate: z.string().optional(),
	}),
	getTimecard: z.object({
		userId: z.string(),
		date: z.string(),
	}),
	listTimecards: z.object({
		from: z.string().optional(),
		to: z.string().optional(),
	}),
	listUserTimecards: z.object({
		userId: z.string(),
		from: z.string().optional(),
		to: z.string().optional(),
	}),
	updateTimecard: z.object({
		userId: z.string(),
		date: z.string(),
		clockIn: z.string().optional(),
		clockOut: z.string().optional(),
		breakTime: z.number().optional(),
	}),
	deleteTimecard: z.object({
		userId: z.string(),
		date: z.string(),
	}),
	listExpenses: z.object({
		query: QueryRecordSchema,
	}),
	listExpenseCategories: z.object({}),
	listInvoices: z.object({
		query: QueryRecordSchema,
	}),
	listWebhooks: z.object({}),
	getWebhook: z.object({
		hookId: z.string(),
	}),
	createWebhook: z.object({
		targetUrl: z.string(),
		events: z.array(z.string()).min(1),
		project: z.string().nullable().optional(),
	}),
	updateWebhook: z.object({
		hookId: z.string(),
		events: z.array(z.string()).min(1),
	}),
	deleteWebhook: z.object({
		hookId: z.string(),
	}),
	listTags: z.object({}),
} as const;

export const EverhourEndpointOutputSchemas = {
	getUser: EverhourUser,
	listTeamUsers: z.array(EverhourUser),
	listTeams: z.array(z.object({}).passthrough()),
	getCurrentTimer: TimerResponseSchema,
	startTimer: TimerResponseSchema,
	stopTimer: TimerResponseSchema,
	listUserTime: z.array(EverhourTimeEntry),
	listUserTimesheets: z.array(TimesheetEntrySchema),
	logTime: EverhourTimeEntry,
	updateTimeEntry: EverhourTimeEntry,
	deleteTimeEntry: EmptyResponseSchema,
	requestTimesheetApproval: EverhourTimesheetApproval,
	discardTimesheetApproval: EverhourTimesheetApproval,
	searchTasks: z.array(EverhourTask),
	getTask: EverhourTask,
	listTasksForProject: z.array(EverhourTask),
	createTask: EverhourTask,
	listProjects: z.array(EverhourProject),
	getProject: EverhourProject,
	createProject: EverhourProject,
	updateProject: EverhourProject,
	deleteProject: EmptyResponseSchema,
	listSections: z.array(EverhourSection),
	getSection: EverhourSection,
	createSection: EverhourSection,
	deleteSection: EmptyResponseSchema,
	listClients: z.array(EverhourClient),
	getClient: EverhourClient,
	createClient: EverhourClient,
	updateClient: EverhourClient,
	deleteClient: EmptyResponseSchema,
	listPlatforms: z.array(EverhourPlatform),
	clockIn: EverhourTimecard,
	clockOut: EverhourTimecard,
	getTimecard: EverhourTimecard,
	listTimecards: z.array(EverhourTimecard),
	listUserTimecards: z.array(EverhourTimecard),
	updateTimecard: EverhourTimecard,
	deleteTimecard: EmptyResponseSchema,
	listExpenses: z.array(EverhourExpense),
	listExpenseCategories: z.array(EverhourExpenseCategory),
	listInvoices: z.array(EverhourInvoice),
	listWebhooks: z.array(EverhourWebhook),
	getWebhook: EverhourWebhook,
	createWebhook: EverhourWebhook,
	updateWebhook: EverhourWebhook,
	deleteWebhook: EmptyResponseSchema,
	listTags: z.array(EverhourTag),
} as const;
