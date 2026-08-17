import { logEventFromContext } from 'corsair/core';
import { makeOpenaiRequest, multipartOpenaiRequest } from '../client';
import type { OpenaiEndpoints } from '../index';
import type {
	SkillsCreateResponse,
	SkillsDeleteResponse,
	SkillsListResponse,
} from '../schema/skills';

export const create: OpenaiEndpoints['skillsCreate'] = async (ctx, input) => {
	const result = await multipartOpenaiRequest<SkillsCreateResponse>(
		'skills',
		ctx.key,
		{
			files: [{ field: 'files', file: input.file, fileName: input.fileName }],
		},
	);

	await logEventFromContext(
		ctx,
		'openai.skills.create',
		{ fileName: input.fileName },
		'completed',
	);
	return result;
};

export const list: OpenaiEndpoints['skillsList'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<SkillsListResponse>(
		'skills',
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: input.limit,
				after: input.after,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.skills.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteSkill: OpenaiEndpoints['skillsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<SkillsDeleteResponse>(
		`skills/${input.skillId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'openai.skills.delete',
		{ ...input },
		'completed',
	);
	return result;
};
