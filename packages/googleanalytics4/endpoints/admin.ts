import type { CorsairPluginContext } from 'corsair/core';
import { makeGA4Request } from '../client';
import type { GA4SchemaType } from '../schema';
import type { GA4EndpointInputs, GA4EndpointOutputs } from './types';

type GA4Context = CorsairPluginContext<typeof GA4SchemaType>;

const ADMIN_API_BASE = 'https://analyticsadmin.googleapis.com/v1';

export const Accounts = {
  get: async (ctx: GA4Context, input: GA4EndpointInputs['accountsGet']) => {
    const accessToken = await ctx.auth();
    const response = await makeGA4Request<GA4EndpointOutputs['accountsGet']>({
      method: 'GET',
      endpoint: `${ADMIN_API_BASE}/${input.name}`,
      accessToken,
    });
    return response;
  },

  list: async (ctx: GA4Context, input: GA4EndpointInputs['accountsList']) => {
    const accessToken = await ctx.auth();
    const params = new URLSearchParams();
    if (input.pageSize) params.append('pageSize', String(input.pageSize));
    if (input.pageToken) params.append('pageToken', input.pageToken);

    const response = await makeGA4Request<GA4EndpointOutputs['accountsList']>({
      method: 'GET',
      endpoint: `${ADMIN_API_BASE}/accounts?${params.toString()}`,
      accessToken,
    });
    return response;
  },
};

export const Properties = {
  get: async (ctx: GA4Context, input: GA4EndpointInputs['propertiesGet']) => {
    const accessToken = await ctx.auth();
    const response = await makeGA4Request<GA4EndpointOutputs['propertiesGet']>({
      method: 'GET',
      endpoint: `${ADMIN_API_BASE}/${input.name}`,
      accessToken,
    });
    return response;
  },

  list: async (ctx: GA4Context, input: GA4EndpointInputs['propertiesList']) => {
    const accessToken = await ctx.auth();
    const params = new URLSearchParams();
    if (input.filter) params.append('filter', input.filter);
    if (input.pageSize) params.append('pageSize', String(input.pageSize));
    if (input.pageToken) params.append('pageToken', input.pageToken);

    const response = await makeGA4Request<GA4EndpointOutputs['propertiesList']>({
      method: 'GET',
      endpoint: `${ADMIN_API_BASE}/properties?${params.toString()}`,
      accessToken,
    });
    return response;
  },

  create: async (ctx: GA4Context, input: GA4EndpointInputs['propertiesCreate']) => {
    const accessToken = await ctx.auth();
    const response = await makeGA4Request<GA4EndpointOutputs['propertiesCreate']>({
      method: 'POST',
      endpoint: `${ADMIN_API_BASE}/properties`,
      accessToken,
      body: {
        displayName: input.displayName,
        parent: input.parentAccount,
        timeZone: input.timeZone,
        currencyCode: input.currencyCode,
      },
    });
    return response;
  },

  update: async (ctx: GA4Context, input: GA4EndpointInputs['propertiesUpdate']) => {
    const accessToken = await ctx.auth();
    const updateMask = input.updateMask || 'displayName,timeZone,currencyCode';

    const response = await makeGA4Request<GA4EndpointOutputs['propertiesUpdate']>({
      method: 'PATCH',
      endpoint: `${ADMIN_API_BASE}/${input.name}?updateMask=${encodeURIComponent(updateMask)}`,
      accessToken,
      body: {
        displayName: input.displayName,
        timeZone: input.timeZone,
        currencyCode: input.currencyCode,
      },
    });
    return response;
  },
};

export const CustomDimensions = {
  list: async (ctx: GA4Context, input: GA4EndpointInputs['customDimensionsList']) => {
    const accessToken = await ctx.auth();
    const params = new URLSearchParams();
    if (input.pageSize) params.append('pageSize', String(input.pageSize));
    if (input.pageToken) params.append('pageToken', input.pageToken);

    const response = await makeGA4Request<GA4EndpointOutputs['customDimensionsList']>({
      method: 'GET',
      endpoint: `${ADMIN_API_BASE}/${input.parent}/customDimensions?${params.toString()}`,
      accessToken,
    });
    return response;
  },

  create: async (ctx: GA4Context, input: GA4EndpointInputs['customDimensionsCreate']) => {
    const accessToken = await ctx.auth();
    const response = await makeGA4Request<GA4EndpointOutputs['customDimensionsCreate']>({
      method: 'POST',
      endpoint: `${ADMIN_API_BASE}/${input.parent}/customDimensions`,
      accessToken,
      body: {
        customDimension: input.customDimension,
      },
    });
    return response;
  },
};

export const CustomMetrics = {
  list: async (ctx: GA4Context, input: GA4EndpointInputs['customMetricsList']) => {
    const accessToken = await ctx.auth();
    const params = new URLSearchParams();
    if (input.pageSize) params.append('pageSize', String(input.pageSize));
    if (input.pageToken) params.append('pageToken', input.pageToken);

    const response = await makeGA4Request<GA4EndpointOutputs['customMetricsList']>({
      method: 'GET',
      endpoint: `${ADMIN_API_BASE}/${input.parent}/customMetrics?${params.toString()}`,
      accessToken,
    });
    return response;
  },

  create: async (ctx: GA4Context, input: GA4EndpointInputs['customMetricsCreate']) => {
    const accessToken = await ctx.auth();
    const response = await makeGA4Request<GA4EndpointOutputs['customMetricsCreate']>({
      method: 'POST',
      endpoint: `${ADMIN_API_BASE}/${input.parent}/customMetrics`,
      accessToken,
      body: {
        customMetric: input.customMetric,
      },
    });
    return response;
  },
};

export const DataStreams = {
  list: async (ctx: GA4Context, input: GA4EndpointInputs['dataStreamsList']) => {
    const accessToken = await ctx.auth();
    const params = new URLSearchParams();
    if (input.pageSize) params.append('pageSize', String(input.pageSize));
    if (input.pageToken) params.append('pageToken', input.pageToken);

    const response = await makeGA4Request<GA4EndpointOutputs['dataStreamsList']>({
      method: 'GET',
      endpoint: `${ADMIN_API_BASE}/${input.parent}/dataStreams?${params.toString()}`,
      accessToken,
    });
    return response;
  },

  get: async (ctx: GA4Context, input: GA4EndpointInputs['dataStreamsGet']) => {
    const accessToken = await ctx.auth();
    const response = await makeGA4Request<GA4EndpointOutputs['dataStreamsGet']>({
      method: 'GET',
      endpoint: `${ADMIN_API_BASE}/${input.name}`,
      accessToken,
    });
    return response;
  },
};

export const Audiences = {
  list: async (ctx: GA4Context, input: GA4EndpointInputs['audiencesList']) => {
    const accessToken = await ctx.auth();
    const params = new URLSearchParams();
    if (input.pageSize) params.append('pageSize', String(input.pageSize));
    if (input.pageToken) params.append('pageToken', input.pageToken);

    const response = await makeGA4Request<GA4EndpointOutputs['audiencesList']>({
      method: 'GET',
      endpoint: `${ADMIN_API_BASE}/${input.parent}/audiences?${params.toString()}`,
      accessToken,
    });
    return response;
  },

  create: async (ctx: GA4Context, input: GA4EndpointInputs['audiencesCreate']) => {
    const accessToken = await ctx.auth();
    const response = await makeGA4Request<GA4EndpointOutputs['audiencesCreate']>({
      method: 'POST',
      endpoint: `${ADMIN_API_BASE}/${input.parent}/audiences`,
      accessToken,
      body: {
        audience: input.audience,
      },
    });
    return response;
  },
};
