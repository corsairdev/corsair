import { formatsListSupported } from './formats';
import {
	jobsCreate,
	jobsCreateAndWait,
	jobsGet,
	jobsList,
	jobsRemove,
	jobsWait,
} from './jobs';
import { operationsList } from './operations';
import {
	tasksCancel,
	tasksCreateExportGoogleCloudStorage,
	tasksCreateExportS3,
	tasksGet,
	tasksList,
	tasksRemove,
	tasksRetry,
	tasksWait,
} from './tasks';
import { usersShow } from './users';

export const Jobs = {
	create: jobsCreate,
	createAndWait: jobsCreateAndWait,
	get: jobsGet,
	wait: jobsWait,
	list: jobsList,
	remove: jobsRemove,
};

export const Tasks = {
	createExportGoogleCloudStorage: tasksCreateExportGoogleCloudStorage,
	createExportS3: tasksCreateExportS3,
	list: tasksList,
	get: tasksGet,
	wait: tasksWait,
	cancel: tasksCancel,
	retry: tasksRetry,
	remove: tasksRemove,
};

export const Operations = {
	list: operationsList,
};

export const Formats = {
	listSupported: formatsListSupported,
};

export const Users = {
	show: usersShow,
};

export * from './types';
