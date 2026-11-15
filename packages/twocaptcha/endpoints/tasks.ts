import type { TwoCaptchaEndpoints } from '..';
import { call } from './call';
import {
	TwoCaptchaEndpointInputSchemas,
	TwoCaptchaEndpointOutputSchemas,
} from './types';

/**
 * Creates a captcha task and returns its id. The task is billable from this
 * call, so a failure here is not retried: a replay would create a second task.
 *
 * Every value in `task` goes into the form body under its own name, which is
 * how the v2 task API expects the per-kind fields.
 */
export const create: TwoCaptchaEndpoints['tasksCreate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.create',
			input: TwoCaptchaEndpointInputSchemas.createTask,
			output: TwoCaptchaEndpointOutputSchemas.createTask,
		},
		input,
		(parsed) => {
			// The task fields are flattened into the form, and `task` itself is the
			// literal marker the v2 API reads to return JSON rather than redirect.
			const formData: Record<string, string | number | boolean | undefined> = {
				method: 'post',
				task: 'task',
				type: parsed.type,
				soft_id: parsed.soft_id,
				callback: parsed.callback,
			};
			for (const [key, value] of Object.entries(parsed.task)) {
				if (value === undefined) continue;
				formData[key] =
					typeof value === 'object' && value !== null
						? JSON.stringify(value)
						: (value as string | number | boolean);
			}
			return { method: 'POST', path: 'createTask', formData };
		},
		{
			log: (parsed, result) => ({
				type: parsed.type,
				task_id:
					result.request === undefined ? undefined : String(result.request),
			}),
		},
	);

/**
 * Reads a task result. While the task is still being solved the provider
 * answers `status: 0` with `CAPCHA_NOT_READY`; that state is returned rather
 * than thrown so a caller can wait and poll again.
 */
export const result: TwoCaptchaEndpoints['tasksResult'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.result',
			input: TwoCaptchaEndpointInputSchemas.getTaskResult,
			output: TwoCaptchaEndpointOutputSchemas.getTaskResult,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'getTaskResult',
			query: { taskId: parsed.task_id },
		}),
		{
			allowNotReady: true,
			log: (parsed, result) => ({
				task_id: parsed.task_id,
				status: result.status,
			}),
		},
	);
