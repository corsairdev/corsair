import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Get a current user UI setting - GET /v2/current_user/ui_settings
export const currentUserUiSettingsGet: DnsfilterEndpoints['currentUserUiSettingsGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.currentUserUiSettingsGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['currentUserUiSettingsGet']
		>('/v2/current_user/ui_settings', ctx.key, {
			method: 'GET',
		});
		const result =
			DnsfilterEndpointOutputSchemas.currentUserUiSettingsGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.currentUserUiSettings.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Update a current user UI setting - PATCH /v2/current_user/ui_settings
export const currentUserUiSettingsUpdate: DnsfilterEndpoints['currentUserUiSettingsUpdate'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.currentUserUiSettingsUpdate.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['currentUserUiSettingsUpdate']
		>('/v2/current_user/ui_settings', ctx.key, {
			method: 'PATCH',
			body: {
				disable_license_warnings: values.disable_license_warnings,
				user_uuid: values.user_uuid,
				theme_mode: values.theme_mode,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.currentUserUiSettingsUpdate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.currentUserUiSettings.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
