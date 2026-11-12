import { logEventFromContext } from 'corsair/core';
import { gongRequest } from '../client';
import type { GongFamilyContext } from './family-context';
import { gongCredentials } from './family-context';
import type { GongTargetsInputs, GongTargetsOutputs } from './targets-types';

type LocalGongContext = GongFamilyContext;
type Endpoint<K extends keyof GongTargetsInputs> = (
	ctx: LocalGongContext,
	input: GongTargetsInputs[K],
) => Promise<GongTargetsOutputs[K]>;
function credentials(ctx: LocalGongContext) {
	return gongCredentials(ctx);
}
function safePath(value: string): string {
	if (!value || value === '.' || value === '..' || /[\/\\"']/.test(value))
		throw new Error('Unsafe Gong target id');
	return encodeURIComponent(value);
}

export const listTargetDefinitions: Endpoint<'listTargetDefinitions'> = async (
	ctx,
	input,
) => {
	const result = await gongRequest<GongTargetsOutputs['listTargetDefinitions']>(
		{
			baseUrl: ctx.options.baseUrl,
			credentials: credentials(ctx),
			method: 'GET',
			path: '/v2/targets',
			query: input,
		},
	);
	await logEventFromContext(
		ctx,
		'gong.targets.listTargetDefinitions',
		{ workspaceId: input.workspaceId },
		'completed',
	);
	return result;
};
export const uploadAssignments: Endpoint<'uploadAssignments'> = async (
	ctx,
	input,
) => {
	const { targetId, workspaceId, validateOnly = false, file } = input;
	const result = await gongRequest<GongTargetsOutputs['uploadAssignments']>({
		baseUrl: ctx.options.baseUrl,
		credentials: credentials(ctx),
		method: 'POST',
		path: `/v2/targets/${safePath(targetId)}/assignments`,
		query: { workspaceId, validateOnly },
		formData: { file },
	});
	await logEventFromContext(
		ctx,
		'gong.targets.uploadAssignments',
		{ targetId, workspaceId, validateOnly },
		'completed',
	);
	return result;
};
