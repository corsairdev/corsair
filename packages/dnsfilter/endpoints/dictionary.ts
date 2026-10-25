// DNSFilter dictionary endpoints.
// One file per resource family; each endpoint keeps its own group name.
import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// QP methods for dictionary - GET /v1/dictionary/qp_methods
export const dictionaryQpMethods: DnsfilterEndpoints['dictionaryQpMethods'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.dictionaryQpMethods.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['dictionaryQpMethods']
		>('/v1/dictionary/qp_methods', ctx.key, {
			method: 'GET',
		});
		const result =
			DnsfilterEndpointOutputSchemas.dictionaryQpMethods.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.dictionary.qpMethods',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// AI applications for dictionary V2 - GET /v2/dictionary/ai_applications
export const dictionaryV2AiApplications: DnsfilterEndpoints['dictionaryV2AiApplications'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.dictionaryV2AiApplications.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['dictionaryV2AiApplications']
		>('/v2/dictionary/ai_applications', ctx.key, {
			method: 'GET',
		});
		const result =
			DnsfilterEndpointOutputSchemas.dictionaryV2AiApplications.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.dictionaryV2.aiApplications',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Cyber sight activity types for dictionary V2 - GET /v2/dictionary/cyber_sight_activity_types
export const dictionaryV2CyberSightActivityTypes: DnsfilterEndpoints['dictionaryV2CyberSightActivityTypes'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.dictionaryV2CyberSightActivityTypes.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['dictionaryV2CyberSightActivityTypes']
		>('/v2/dictionary/cyber_sight_activity_types', ctx.key, {
			method: 'GET',
		});
		const result =
			DnsfilterEndpointOutputSchemas.dictionaryV2CyberSightActivityTypes.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.dictionaryV2.cyberSightActivityTypes',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Vpn settings state types for dictionary V2 - GET /v2/dictionary/vpn_settings_state_types
export const dictionaryV2VpnSettingsStateTypes: DnsfilterEndpoints['dictionaryV2VpnSettingsStateTypes'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.dictionaryV2VpnSettingsStateTypes.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['dictionaryV2VpnSettingsStateTypes']
		>('/v2/dictionary/vpn_settings_state_types', ctx.key, {
			method: 'GET',
		});
		const result =
			DnsfilterEndpointOutputSchemas.dictionaryV2VpnSettingsStateTypes.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.dictionaryV2.vpnSettingsStateTypes',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
