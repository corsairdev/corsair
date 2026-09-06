import { z } from 'zod';
import type {
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
	getUser: z.any(),
	listTeamUsers: z.any(),
	getCurrentTimer: z.any(),
	startTimer: z.any(),
	stopTimer: z.any(),
	listUserTime: z.any(),
	listUserTimesheets: z.any(),
	logTime: z.any(),
	updateTimeEntry: z.any(),
	deleteTimeEntry: z.any(),
	searchTasks: z.any(),
	getTask: z.any(),
	listTasksForProject: z.any(),
	listProjects: z.any(),
	getProject: z.any(),
	listClients: z.any(),
	getClient: z.any(),
	listPlatforms: z.any(),
} as const;

export const EverhourEndpointOutputSchemas = {
	getUser: z.any(),
	listTeamUsers: z.array(z.any()),
	getCurrentTimer: z.any(),
	startTimer: z.any(),
	stopTimer: z.any(),
	listUserTime: z.array(z.any()),
	listUserTimesheets: z.array(z.any()),
	logTime: z.any(),
	updateTimeEntry: z.any(),
	deleteTimeEntry: z.null().optional(),
	searchTasks: z.array(z.any()),
	getTask: z.any(),
	listTasksForProject: z.array(z.any()),
	listProjects: z.array(z.any()),
	getProject: z.any(),
	listClients: z.array(z.any()),
	getClient: z.any(),
	listPlatforms: z.array(z.any()),
} as const;
