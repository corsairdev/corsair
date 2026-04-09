/**
 * This file implements the Stitch design system-related endpoints.
 * It handles creating, updating, and applying design systems to project screens.
 *
 * Each endpoint includes runtime validation using Zod schemas and logs events for traceability.
 */

import { logEventFromContext } from 'corsair/core';
import type { StitchEndpoints } from '..';
import { makeStitchRequest } from '../client';
import { StitchDesignSystemSchema } from '../schema';
import type { StitchEndpointOutputs } from './types';

export const create: StitchEndpoints['designSystemsCreate'] = async (ctx, input) => {
  const rawResponse = await makeStitchRequest<unknown>(
    'assets',
    ctx.key,
    { method: 'POST', body: input }
  );

  const response = StitchDesignSystemSchema.parse(rawResponse);

  if (ctx.db.designSystems) {
    await ctx.db.designSystems.upsertByEntityId(response.id, response);
  }

  await logEventFromContext(ctx, 'stitch.designSystems.create', input, 'completed');

  return response;
};

export const update: StitchEndpoints['designSystemsUpdate'] = async (ctx, input) => {
  const rawResponse = await makeStitchRequest<unknown>(
    `assets/${input.assetId}`,
    ctx.key,
    { method: 'PATCH', body: { projectId: input.projectId, designSystem: input.designSystem } }
  );

  const response = StitchDesignSystemSchema.parse(rawResponse);

  if (ctx.db.designSystems) {
    await ctx.db.designSystems.upsertByEntityId(response.id, response);
  }

  await logEventFromContext(ctx, 'stitch.designSystems.update', input, 'completed');

  return response;
};

export const apply: StitchEndpoints['designSystemsApply'] = async (ctx, input) => {
  const response = await makeStitchRequest<StitchEndpointOutputs['designSystemsApply']>(
    `projects/${input.projectId}/screens:applyDesignSystem`,
    ctx.key,
    { method: 'POST', body: { assetId: input.assetId, selectedScreenInstances: input.selectedScreenInstances } }
  );

  await logEventFromContext(ctx, 'stitch.designSystems.apply', input, 'completed');

  return response;
};
