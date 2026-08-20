import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import { callMeasurementProtocol } from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

// Builds the GA4 Measurement Protocol JSON body from the camelCase input.
// apiSecret/measurementId/firebaseAppId travel as query params, not the body.
// `consent` and per-event `params` are free-form objects per the Measurement
// Protocol spec (consent settings, arbitrary event parameters); forwarded as-is.
function buildPayload(input: {
	clientId?: string;
	appInstanceId?: string;
	userId?: string;
	timestampMicros?: number;
	userProperties?: Record<string, unknown>;
	consent?: unknown;
	events: { name: string; params?: unknown }[];
}): Record<string, unknown> {
	const payload: Record<string, unknown> = { events: input.events };
	if (input.clientId) payload.client_id = input.clientId;
	if (input.appInstanceId) payload.app_instance_id = input.appInstanceId;
	if (input.userId) payload.user_id = input.userId;
	if (input.timestampMicros !== undefined)
		payload.timestamp_micros = input.timestampMicros;
	if (input.userProperties) payload.user_properties = input.userProperties;
	if (input.consent) payload.consent = input.consent;
	return payload;
}

// Send events to GA4 via the Measurement Protocol. Authenticated by the
// per-stream api_secret (the OAuth token is not used here). The response is
// empty on success; events surface in reports within 24-48h.
export const sendEvents: GoogleAnalyticsEndpoints['measurementProtocolSendEvents'] =
	async (ctx, input) => {
		// Keep the per-stream secret out of the event log: pull the request
		// options out of the input and log only the remaining (body) fields.
		const { apiSecret, measurementId, firebaseAppId, ...loggable } = input;
		const result = await callMeasurementProtocol<
			GoogleAnalyticsEndpointOutputs['measurementProtocolSendEvents']
		>(buildPayload(input), {
			validate: false,
			apiSecret,
			measurementId,
			firebaseAppId,
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.measurementProtocol.sendEvents',
			loggable,
			'completed',
		);
		return result;
	};

// Validate the same payload against the debug endpoint before sending.
export const validateEvents: GoogleAnalyticsEndpoints['measurementProtocolValidateEvents'] =
	async (ctx, input) => {
		const { apiSecret, measurementId, firebaseAppId, ...loggable } = input;
		const result = await callMeasurementProtocol<
			GoogleAnalyticsEndpointOutputs['measurementProtocolValidateEvents']
		>(buildPayload(input), {
			validate: true,
			apiSecret,
			measurementId,
			firebaseAppId,
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.measurementProtocol.validateEvents',
			loggable,
			'completed',
		);
		return result;
	};
