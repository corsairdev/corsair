import { logEventFromContext } from 'corsair/core';
import type { GongOpaqueRecord, GongOpaqueValue } from '../client';
import { gongRequest } from '../client';
import type { GongFamilyContext } from './family-context';
import { gongCredentials } from './family-context';
import type { GongTasksInputs, GongTasksOutputs } from './tasks-types';

type LocalGongContext = GongFamilyContext;
type Endpoint<K extends keyof GongTasksInputs> = (
	ctx: LocalGongContext,
	input: GongTasksInputs[K],
) => Promise<GongTasksOutputs[K]>;
async function call<T>(
	ctx: LocalGongContext,
	method: 'POST' | 'PATCH',
	path: string,
	input: GongOpaqueRecord,
	body: GongOpaqueValue,
): Promise<T> {
	const credentials = gongCredentials(ctx);
	const result = await gongRequest<T>({
		baseUrl: ctx.options.baseUrl,
		credentials,
		method,
		path,
		body,
	});
	await logEventFromContext(
		ctx,
		`gong.tasks.${path.replaceAll('/', '.')}`,
		{ input },
		'completed',
	);
	return result;
}
function safePath(value: string): string {
	if (!value || value === '.' || value === '..' || /[\/\\"']/.test(value))
		throw new Error('Unsafe Gong task id');
	return encodeURIComponent(value);
}

export const listTasks: Endpoint<'listTasks'> = (ctx, input) =>
	call<GongTasksOutputs['listTasks']>(ctx, 'POST', '/v2/tasks', input, input);
export const updateReminder: Endpoint<'updateReminder'> = (ctx, input) => {
	const { taskId, ...body } = input;
	let path: string;
	try {
		path = `/v2/tasks/${safePath(taskId)}`;
	} catch (error) {
		return Promise.reject(error);
	}
	return call<GongTasksOutputs['updateReminder']>(
		ctx,
		'PATCH',
		path,
		input,
		body,
	);
};
