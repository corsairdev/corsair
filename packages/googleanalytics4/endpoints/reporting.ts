import type { CorsairPluginContext } from 'corsair/core';
import { makeGA4Request } from '../client';
import type { GA4SchemaType } from '../schema';
import type { GA4EndpointInputs, GA4EndpointOutputs } from './types';

type GA4Context = CorsairPluginContext<typeof GA4SchemaType>;

const DATA_API_BASE = 'https://analyticsdata.googleapis.com/v1beta';

export const Reporting = {
  runReport: async (ctx: GA4Context, input: GA4EndpointInputs['runReport']) => {
    const accessToken = await ctx.auth();

    const response = await makeGA4Request<GA4EndpointOutputs['runReport']>({
      method: 'POST',
      endpoint: `${DATA_API_BASE}/${input.property}:runReport`,
      accessToken,
      body: {
        dateRanges: input.dateRanges,
        metrics: input.metrics,
        dimensions: input.dimensions,
        dimensionFilter: input.filters?.[0] ? {
          andGroup: {
            expressions: input.filters.map((f) => ({
              filter: {
                fieldName: f.fieldName,
                stringFilter: f.stringFilter,
              },
            })),
          },
        } : undefined,
        orderBys: input.orderBys,
        limit: String(input.limit || 10000),
        offset: String(input.offset || 0),
        keepEmptyRows: input.keepEmptyRows ?? false,
        returnPropertyQuota: input.returnPropertyQuota ?? false,
      },
    });

    return response;
  },

  runRealtimeReport: async (ctx: GA4Context, input: GA4EndpointInputs['runRealtimeReport']) => {
    const accessToken = await ctx.auth();

    const response = await makeGA4Request<GA4EndpointOutputs['runRealtimeReport']>({
      method: 'POST',
      endpoint: `${DATA_API_BASE}/${input.property}:runRealtimeReport`,
      accessToken,
      body: {
        metrics: input.metrics,
        dimensions: input.dimensions,
        minuteRanges: input.minuteRanges,
        orderBys: input.orderBys,
        limit: String(input.limit || 10000),
        returnPropertyQuota: input.returnPropertyQuota ?? false,
      },
    });

    return response;
  },
};
