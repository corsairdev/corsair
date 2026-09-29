import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import { callMeasurementProtocol } from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

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

export const sendEvents: GoogleAnalyticsEndpoints['measurementProtocolSendEvents'] =
	async (ctx, input) => {
		const { apiSecret, measurementId, firebaseAppId } = input;
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
			{
				eventCount: input.events.length,
				eventNames: input.events.map((event) => event.name),
			},
			'completed',
		);
		return result;
	};

export const validateEvents: GoogleAnalyticsEndpoints['measurementProtocolValidateEvents'] =
	async (ctx, input) => {
		const { apiSecret, measurementId, firebaseAppId } = input;
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
			{
				eventCount: input.events.length,
				eventNames: input.events.map((event) => event.name),
			},
			'completed',
		);
		return result;
	};
