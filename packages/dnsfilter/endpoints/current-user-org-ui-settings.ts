import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// Suppress license warning for current user org UI settings - POST /v2/current_user/suppress_license_warning
export const currentUserOrgUiSettingsSuppressLicenseWarning: DnsfilterEndpoints['currentUserOrgUiSettingsSuppressLicenseWarning'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['currentUserOrgUiSettingsSuppressLicenseWarning']
		>('/v2/current_user/suppress_license_warning', ctx.key, {
			method: 'POST',
			query: {
				body: input.body,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.currentUserOrgUiSettings.suppressLicenseWarning',
			input ?? {},
			'completed',
		);
		return response;
	};
