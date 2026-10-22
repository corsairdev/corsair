import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// Get a current user UI setting - GET /v2/current_user/ui_settings
export const currentUserUiSettingsGet: DnsfilterEndpoints['currentUserUiSettingsGet'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['currentUserUiSettingsGet']
		>('/v2/current_user/ui_settings', ctx.key, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.currentUserUiSettings.get',
			input ?? {},
			'completed',
		);
		return response;
	};

// Update a current user UI setting - PATCH /v2/current_user/ui_settings
export const currentUserUiSettingsUpdate: DnsfilterEndpoints['currentUserUiSettingsUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['currentUserUiSettingsUpdate']
		>('/v2/current_user/ui_settings', ctx.key, {
			method: 'PATCH',
			body: {
				disable_license_warnings: input.disable_license_warnings,
				user_uuid: input.user_uuid,
				theme_mode: input.theme_mode,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.currentUserUiSettings.update',
			input ?? {},
			'completed',
		);
		return response;
	};
