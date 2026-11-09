import { logEventFromContext } from 'corsair/core';
import { gongRequest } from '../client';
import type { GongTargetsInputs, GongTargetsOutputs } from './targets-types';

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
type Endpoint<K extends keyof GongTargetsInputs> = (
	ctx: LocalGongContext,
	input: GongTargetsInputs[K],
) => Promise<GongTargetsOutputs[K]>;
function credentials(ctx: LocalGongContext) {
	if (ctx.options.authType === 'oauth_2')
		return { type: 'bearer' as const, accessToken: ctx.key };
	if (ctx.options.accessKey && ctx.options.accessKeySecret)
		return {
			type: 'basic' as const,
			accessKey: ctx.options.accessKey,
			accessKeySecret: ctx.options.accessKeySecret,
		};
	throw new Error(
		'Gong Basic authentication requires accessKey and accessKeySecret',
	);
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
	if (!ctx.options.baseUrl) throw new Error('Gong baseUrl is required');
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
		{ input },
		'completed',
	);
	return result;
};
export const uploadAssignments: Endpoint<'uploadAssignments'> = async (
	ctx,
	input,
) => {
	if (!ctx.options.baseUrl) throw new Error('Gong baseUrl is required');
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
