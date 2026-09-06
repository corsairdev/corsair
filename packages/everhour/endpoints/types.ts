import { z } from 'zod';
import {
	EverhourClient,
	EverhourPlatform,
	EverhourProject,
	EverhourTask,
	EverhourTimeEntry,
	EverhourUser,
} from '../schema/database';

export type EverhourEndpointInputs = {
	getUser: {};
	listTeamUsers: { query?: Record<string, any> };
	getCurrentTimer: {};
	startTimer: { task?: string; userDate?: string; comment?: string };
	stopTimer: {};
	listUserTime: { userId: string; query?: Record<string, any> };
	listUserTimesheets: { userId: string; query?: Record<string, any> };
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
			searchInClosed?: boolean;
			searchInUnscheduled?: boolean;
		};
	};
	listProjects: { query?: Record<string, any> };
	getProject: { projectId: string };
	listClients: { query?: Record<string, any> };
	getClient: { clientId: string };
	listPlatforms: {};
};

export type EverhourEndpointOutputs = {
	getUser: EverhourUser;
	listTeamUsers: EverhourUser[];
	getCurrentTimer: any;
	startTimer: any;
	stopTimer: any;
	listUserTime: EverhourTimeEntry[];
	listUserTimesheets: any[];
	logTime: EverhourTimeEntry;
	updateTimeEntry: EverhourTimeEntry;
	deleteTimeEntry: void;
	searchTasks: EverhourTask[];
	getTask: EverhourTask;
	listTasksForProject: EverhourTask[];
	listProjects: EverhourProject[];
	getProject: EverhourProject;
	listClients: EverhourClient[];
	getClient: EverhourClient;
	listPlatforms: EverhourPlatform[];
};

export const EverhourEndpointInputSchemas = {
	getUser: z.object({}),
	listTeamUsers: z.object({
		query: z.record(z.any()).optional(),
	}),
	getCurrentTimer: z.object({}),
	startTimer: z.object({
		task: z.string().optional(),
		userDate: z.string().optional(),
		comment: z.string().optional(),
	}),
	stopTimer: z.object({}),
	listUserTime: z.object({
		userId: z.string(),
		query: z.record(z.any()).optional(),
	}),
	listUserTimesheets: z.object({
		userId: z.string(),
		query: z.record(z.any()).optional(),
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
				searchInClosed: z.boolean().optional(),
				searchInUnscheduled: z.boolean().optional(),
			})
			.optional(),
	}),
	listProjects: z.object({
		query: z.record(z.any()).optional(),
	}),
	getProject: z.object({
		projectId: z.string(),
	}),
	listClients: z.object({
		query: z.record(z.any()).optional(),
	}),
	getClient: z.object({
		clientId: z.string(),
	}),
	listPlatforms: z.object({}),
} as const;

export const EverhourEndpointOutputSchemas = {
	getUser: EverhourUser,
	listTeamUsers: z.array(EverhourUser),
	getCurrentTimer: z.any(),
	startTimer: z.any(),
	stopTimer: z.any(),
	listUserTime: z.array(EverhourTimeEntry),
	listUserTimesheets: z.array(z.any()),
	logTime: EverhourTimeEntry,
	updateTimeEntry: EverhourTimeEntry,
	deleteTimeEntry: z.null().optional(),
	searchTasks: z.array(EverhourTask),
	getTask: EverhourTask,
	listTasksForProject: z.array(EverhourTask),
	listProjects: z.array(EverhourProject),
	getProject: EverhourProject,
	listClients: z.array(EverhourClient),
	getClient: EverhourClient,
	listPlatforms: z.array(EverhourPlatform),
} as const;
