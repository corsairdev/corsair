import { logEventFromContext } from 'corsair/core';
import { gongRequest } from '../client';
import type { GongFamilyContext } from './family-context';
import type {
	GongIntegrationSettingsInputs,
	GongIntegrationSettingsOutputs,
} from './integration-settings-types';

export async function updateIntegrationSettings(
	ctx: GongFamilyContext,
	input: GongIntegrationSettingsInputs['update'],
): Promise<GongIntegrationSettingsOutputs['update']> {
	const options = ctx.options;
	if (!options.baseUrl) throw new Error('Gong baseUrl is required');
	const credentials =
		options.authType === 'oauth_2'
			? { type: 'bearer' as const, accessToken: ctx.key }
			: options.accessKey && options.accessKeySecret
				? {
						type: 'basic' as const,
						accessKey: options.accessKey,
						accessKeySecret: options.accessKeySecret,
					}
				: (() => {
						throw new Error(
							'Gong Basic authentication requires accessKey and accessKeySecret',
						);
					})();
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
		input,
		'completed',
	);
	return result;
}
