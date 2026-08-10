import type { CorsairPluginContext } from 'corsair/core';
import type { GA4SchemaType } from '../schema';
import type { GA4EndpointInputs, GA4EndpointOutputs } from './types';

type GA4Context = CorsairPluginContext<typeof GA4SchemaType>;

const MP_BASE = 'https://www.google-analytics.com';

export const MeasurementProtocol = {
  sendEvent: async (
    ctx: GA4Context,
    input: GA4EndpointInputs['measurementProtocolEvent'],
  ) => {
    const response = await fetch(
      `${MP_BASE}/mp/collect?measurement_id=${input.measurementId}&api_secret=${input.apiSecret}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: input.clientId,
          user_id: input.userId,
          user_properties: input.userProperties,
          timestamp_micros: String((input.timestamp || Date.now()) * 1000),
          events: input.events,
        }),
      },
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Measurement Protocol error: ${response.status} - ${body}`,
      );
    }

    const data = (await response.json()) as GA4EndpointOutputs['measurementProtocolEvent'];
    return data;
  },

  validate: async (
    ctx: GA4Context,
    input: GA4EndpointInputs['measurementProtocolValidate'],
  ) => {
    const response = await fetch(
      `${MP_BASE}/mp/collect?measurement_id=${input.measurementId}&api_secret=${input.apiSecret}&validate_only`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: input.clientId,
          events: input.events,
        }),
      },
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Measurement Protocol validation error: ${response.status} - ${body}`);
    }

    const data = (await response.json()) as GA4EndpointOutputs['measurementProtocolValidate'];
    return data;
  },
};
