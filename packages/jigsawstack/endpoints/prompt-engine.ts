import type { JigsawstackEndpoints } from '../index';
import { jigsawCall } from './call';

export const create: JigsawstackEndpoints['createPrompt'] = async (
	ctx,
	input,
) =>
	jigsawCall(
		ctx,
		'jigsawstack.promptEngine.create',
		'/v1/prompt_engine',
		'POST',
		input,
		{ body: input },
	);

export const list: JigsawstackEndpoints['listPrompts'] = async (ctx, input) =>
	jigsawCall(
		ctx,
		'jigsawstack.promptEngine.list',
		'/v1/prompt_engine',
		'GET',
		input,
		{ query: { page: input.page, limit: input.limit } },
	);

export const run: JigsawstackEndpoints['runPrompt'] = async (ctx, input) => {
	const { id, ...body } = input;
	return jigsawCall(
		ctx,
		'jigsawstack.promptEngine.run',
		`/v1/prompt_engine/${encodeURIComponent(id)}`,
		'POST',
		input,
		{ body },
	);
};
