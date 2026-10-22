import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Suppress license warning for current user org UI settings - POST /v2/current_user/suppress_license_warning
export const currentUserOrgUiSettingsSuppressLicenseWarning: DnsfilterEndpoints['currentUserOrgUiSettingsSuppressLicenseWarning'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.currentUserOrgUiSettingsSuppressLicenseWarning.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['currentUserOrgUiSettingsSuppressLicenseWarning']
		>('/v2/current_user/suppress_license_warning', ctx.key, {
			method: 'POST',
			query: {
				body: values.body,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.currentUserOrgUiSettingsSuppressLicenseWarning.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.currentUserOrgUiSettings.suppressLicenseWarning',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
