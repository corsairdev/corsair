import { z } from 'zod';
import { BrowserToolExecution } from '../schema/database';

/**
 * Input fields from https://docs.composio.dev/toolkits/browser_tool
 * (camelCase as published: task, secrets, startUrl, sessionId, fileId, taskId, lastStepSeen).
 */

const CreateTaskInput = z
	.object({
		task: z.string().min(1),
		secrets: z.record(z.string(), z.string()).optional(),
		startUrl: z.string().url().optional(),
		sessionId: z.string().min(1).optional(),
	})
	.strict();

const GetOutputFileInput = z.object({
	fileId: z.string().min(1),
	taskId: z.string().min(1),
});

const GetSessionInput = z.object({
	sessionId: z.string().min(1),
});

const StopTaskInput = z.object({
	taskId: z.string().min(1),
});

const WatchTaskInput = z.object({
	taskId: z.string().min(1),
	lastStepSeen: z.number().int().min(0).optional(),
});

const ExecutionOutput = BrowserToolExecution;

export const BrowserToolEndpointInputSchemas = {
	createTask: CreateTaskInput,
	getOutputFile: GetOutputFileInput,
	getSession: GetSessionInput,
	stopTask: StopTaskInput,
	watchTask: WatchTaskInput,
};

export const BrowserToolEndpointOutputSchemas = {
	createTask: ExecutionOutput,
	getOutputFile: ExecutionOutput,
	getSession: ExecutionOutput,
	stopTask: ExecutionOutput,
	watchTask: ExecutionOutput,
};

export type BrowserToolEndpointInputs = {
	[K in keyof typeof BrowserToolEndpointInputSchemas]: z.infer<
		(typeof BrowserToolEndpointInputSchemas)[K]
	>;
};

export type BrowserToolEndpointOutputs = {
	[K in keyof typeof BrowserToolEndpointOutputSchemas]: z.infer<
		(typeof BrowserToolEndpointOutputSchemas)[K]
	>;
};

export type CreateTaskInput = BrowserToolEndpointInputs['createTask'];
export type CreateTaskOutput = BrowserToolEndpointOutputs['createTask'];
export type GetOutputFileInput = BrowserToolEndpointInputs['getOutputFile'];
export type GetOutputFileOutput = BrowserToolEndpointOutputs['getOutputFile'];
export type GetSessionInput = BrowserToolEndpointInputs['getSession'];
export type GetSessionOutput = BrowserToolEndpointOutputs['getSession'];
export type StopTaskInput = BrowserToolEndpointInputs['stopTask'];
export type StopTaskOutput = BrowserToolEndpointOutputs['stopTask'];
export type WatchTaskInput = BrowserToolEndpointInputs['watchTask'];
export type WatchTaskOutput = BrowserToolEndpointOutputs['watchTask'];
