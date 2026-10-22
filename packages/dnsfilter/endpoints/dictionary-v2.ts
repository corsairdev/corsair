import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// AI applications for dictionary V2 - GET /v2/dictionary/ai_applications
export const dictionaryV2AiApplications: DnsfilterEndpoints['dictionaryV2AiApplications'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['dictionaryV2AiApplications']
		>('/v2/dictionary/ai_applications', ctx.key, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.dictionaryV2.aiApplications',
			input ?? {},
			'completed',
		);
		return response;
	};

// Cyber sight activity types for dictionary V2 - GET /v2/dictionary/cyber_sight_activity_types
export const dictionaryV2CyberSightActivityTypes: DnsfilterEndpoints['dictionaryV2CyberSightActivityTypes'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['dictionaryV2CyberSightActivityTypes']
		>('/v2/dictionary/cyber_sight_activity_types', ctx.key, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.dictionaryV2.cyberSightActivityTypes',
			input ?? {},
			'completed',
		);
		return response;
	};

// Vpn settings state types for dictionary V2 - GET /v2/dictionary/vpn_settings_state_types
export const dictionaryV2VpnSettingsStateTypes: DnsfilterEndpoints['dictionaryV2VpnSettingsStateTypes'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['dictionaryV2VpnSettingsStateTypes']
		>('/v2/dictionary/vpn_settings_state_types', ctx.key, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.dictionaryV2.vpnSettingsStateTypes',
			input ?? {},
			'completed',
		);
		return response;
	};
