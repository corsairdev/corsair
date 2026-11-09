import { gongRequest } from '../client';
import type { GongFamilyContext } from './family-context';
import { gongCredentials } from './family-context';
import type { GongSettingsInputs, GongSettingsOutputs } from './settings-types';

type GongContext = GongFamilyContext;

async function getSettings<K extends keyof GongSettingsInputs>(
	ctx: GongContext,
	path: string,
	input: GongSettingsInputs[K],
): Promise<GongSettingsOutputs[K]> {
	if (!ctx.options.baseUrl) throw new Error('Gong baseUrl is required');
	const credentials = gongCredentials(ctx);
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
