import { logEventFromContext } from 'corsair/core';
import { gongRequest } from '../client';
import type { GongFamilyContext } from './family-context';
import type {
	GongWorkspacesInputs,
	GongWorkspacesOutputs,
} from './workspaces-types';

export async function listWorkspaces(
	ctx: GongFamilyContext,
	input: GongWorkspacesInputs['listWorkspaces'],
): Promise<GongWorkspacesOutputs['listWorkspaces']> {
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
						throw new Error('Gong API credentials are required');
					})();
	const result = await gongRequest<GongWorkspacesOutputs['listWorkspaces']>({
		baseUrl: ctx.options.baseUrl,
		credentials,
		method: 'GET',
		path: '/v2/workspaces',
	});
	await logEventFromContext(
		ctx,
		'gong.workspaces.list',
		{ input },
		'completed',
	);
	return result;
}
