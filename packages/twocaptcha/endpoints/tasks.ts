import type { TwoCaptchaEndpoints } from '..';
import { call } from './call';
import {
	TwoCaptchaEndpointInputSchemas,
	TwoCaptchaEndpointOutputSchemas,
} from './types';

/**
 * Creates a captcha task and returns its id. The account is charged for the
 * task, so a failure here is not replayed: a replay could create a second task.
 * https://2captcha.com/api-docs/create-task
 */
export const create: TwoCaptchaEndpoints['tasksCreate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.create',
			method: 'createTask',
			input: TwoCaptchaEndpointInputSchemas.createTask,
			output: TwoCaptchaEndpointOutputSchemas.createTask,
		},
		input,
		(parsed) => ({
			task: { ...parsed.task, type: parsed.type },
			languagePool: parsed.language_pool,
			softId: parsed.soft_id,
			callbackUrl: parsed.callback,
		}),
		{
			log: (parsed, result) => ({
				type: parsed.type,
				task_id: String(result.taskId),
			}),
		},
	);

/**
 * Reads a task result. While workers are still solving it the answer is
 * `status: 'processing'`; poll again after 5-10 seconds until `ready`.
 * https://2captcha.com/api-docs/get-task-result
 */
export const result: TwoCaptchaEndpoints['tasksResult'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.result',
			method: 'getTaskResult',
			input: TwoCaptchaEndpointInputSchemas.getTaskResult,
			output: TwoCaptchaEndpointOutputSchemas.getTaskResult,
		},
		input,
		(parsed) => ({ taskId: parsed.task_id }),
		{
			log: (parsed, result) => ({
				task_id: parsed.task_id,
				status: result.status,
			}),
		},
	);
