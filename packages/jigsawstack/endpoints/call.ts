import { logEventFromContext } from 'corsair/core';
import {
	makeJigsawstackBinaryRequest,
	makeJigsawstackRequest,
} from '../client';
import type { JigsawstackContext } from '../index';

export async function jigsawCall<T>(
	ctx: JigsawstackContext,
	event: string,
	path: string,
	method: 'GET' | 'POST' | 'DELETE',
	input: object,
	options: {
		body?: object;
		query?: Record<string, string | number | boolean | undefined>;
		binary?: boolean;
	} = {},
): Promise<T> {
	const result = options.binary
		? ((await makeJigsawstackBinaryRequest(
				path,
				ctx.key,
				options.body ?? {},
			)) as T)
		: await makeJigsawstackRequest<T>(path, ctx.key, {
				method,
				body: options.body,
				query: options.query,
			});
	await logEventFromContext(
		ctx,
		event,
		input as Record<string, unknown>,
		'completed',
	);
	return result;
}
