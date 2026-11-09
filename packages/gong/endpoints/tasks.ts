import { logEventFromContext } from 'corsair/core';
import { gongRequest } from '../client';
import type { GongTasksInputs, GongTasksOutputs } from './tasks-types';

type LocalGongContext = {
	key: string;
	options: {
		baseUrl?: string;
		authType?: 'api_key' | 'oauth_2';
		accessKey?: string;
		accessKeySecret?: string;
	};
	$getAccountId: () => Promise<string>;
};
type Endpoint<K extends keyof GongTasksInputs> = (
	ctx: LocalGongContext,
	input: GongTasksInputs[K],
) => Promise<GongTasksOutputs[K]>;
async function call<T>(
	ctx: LocalGongContext,
	method: 'POST' | 'PATCH',
	path: string,
	input: unknown,
	body: unknown,
): Promise<T> {
	if (!ctx.options.baseUrl) throw new Error('Gong baseUrl is required');
	const credentials =
		ctx.options.authType === 'oauth_2'
			? { type: 'bearer' as const, accessToken: ctx.key }
			: ctx.options.accessKey && ctx.options.accessKeySecret
				? {
						type: 'basic' as const,
						accessKey: ctx.options.accessKey,
						accessKeySecret: ctx.options.accessKeySecret,
					}
				: (() => {
						throw new Error(
							'Gong Basic authentication requires accessKey and accessKeySecret',
						);
					})();
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
