import { gongRequest } from '../client';
import type { GongSettingsInputs, GongSettingsOutputs } from './settings-types';

type GongContext = {
	key: string;
	options: {
		baseUrl?: string;
		authType: 'api_key' | 'oauth_2';
		accessKey?: string;
		accessKeySecret?: string;
	};
	$getAccountId: () => Promise<string>;
};

async function getSettings<K extends keyof GongSettingsInputs>(
	ctx: GongContext,
	path: string,
	input: GongSettingsInputs[K],
): Promise<GongSettingsOutputs[K]> {
	if (!ctx.options.baseUrl) throw new Error('Gong baseUrl is required');
	const credentials =
		ctx.options.authType === 'oauth_2'
			? ({ type: 'bearer', accessToken: ctx.key } as const)
			: ctx.options.accessKey && ctx.options.accessKeySecret
				? ({
						type: 'basic',
						accessKey: ctx.options.accessKey,
						accessKeySecret: ctx.options.accessKeySecret,
					} as const)
				: null;
	if (!credentials) throw new Error('Gong API credentials are required');
	return gongRequest<GongSettingsOutputs[K]>({
		baseUrl: ctx.options.baseUrl,
		credentials,
		method: 'GET',
		path,
		query: input,
	});
}

export const listTrackers = (
	ctx: GongContext,
	input: GongSettingsInputs['listTrackers'],
) => getSettings<'listTrackers'>(ctx, '/v2/settings/trackers', input);

export const listScorecards = (ctx: GongContext) =>
	getSettings<'listScorecards'>(ctx, '/v2/settings/scorecards', {});

export const listBriefs = (
	ctx: GongContext,
	input: GongSettingsInputs['listBriefs'],
) => getSettings<'listBriefs'>(ctx, '/v2/settings/briefs', input);
