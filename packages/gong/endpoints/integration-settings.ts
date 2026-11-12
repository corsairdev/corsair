import { logEventFromContext } from 'corsair/core';
import { gongRequest } from '../client';
import type { GongFamilyContext } from './family-context';
import { gongCredentials, gongEventPayload } from './family-context';
import type {
	GongIntegrationSettingsInputs,
	GongIntegrationSettingsOutputs,
} from './integration-settings-types';

export async function updateIntegrationSettings(
	ctx: GongFamilyContext,
	input: GongIntegrationSettingsInputs['update'],
): Promise<GongIntegrationSettingsOutputs['update']> {
	const options = ctx.options;
	const credentials = gongCredentials(ctx);
	const result = await gongRequest<GongIntegrationSettingsOutputs['update']>({
		baseUrl: options.baseUrl,
		credentials,
		method: 'POST',
		path: '/v2/integration-settings',
		body: input,
	});
	await logEventFromContext(
		ctx,
		'gong.integrationSettings.update',
		gongEventPayload(input),
		'completed',
	);
	return result;
}
