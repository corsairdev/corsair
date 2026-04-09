/**
 * This file implements the Stitch screen-related endpoints.
 * It handles listing, retrieving, editing, and generating variants of screens.
 *
 * Each endpoint includes runtime validation using Zod schemas and logs events for traceability.
 */

import { z } from 'zod';
import { logEventFromContext } from 'corsair/core';
import type { StitchEndpoints } from '..';
import { makeStitchRequest } from '../client';
import { StitchScreenSchema } from '../schema';
import type { StitchEndpointOutputs } from './types';

export const list: StitchEndpoints['screensList'] = async (ctx, input) => {
  const rawResponse = await makeStitchRequest<unknown>(
    `projects/${input.projectId}/screens`,
    ctx.key,
    { method: 'GET' }
  );

  const response = z.array(StitchScreenSchema).parse(rawResponse);

  if (ctx.db.screens) {
    for (const screen of response) {
      await ctx.db.screens.upsertByEntityId(screen.id, screen);
    }
  }

  await logEventFromContext(ctx, 'stitch.screens.list', input, 'completed');

  return response;
};

export const get: StitchEndpoints['screensGet'] = async (ctx, input) => {
  const rawResponse = await makeStitchRequest<unknown>(
    `projects/${input.projectId}/screens/${input.screenId}`,
    ctx.key,
    { method: 'GET' }
  );

  const response = StitchScreenSchema.parse(rawResponse);

  if (ctx.db.screens) {
    await ctx.db.screens.upsertByEntityId(response.id, response);
  }

  await logEventFromContext(ctx, 'stitch.screens.get', input, 'completed');

  return response;
};

export const edit: StitchEndpoints['screensEdit'] = async (ctx, input) => {
  const { projectId, selectedScreenIds, prompt, deviceType, modelId } = input;
  const rawResponse = await makeStitchRequest<any>(
    `projects/${projectId}/screens:edit`,
    ctx.key,
    { method: 'POST', body: { selectedScreenIds, prompt, deviceType, modelId } }
  );

  const response = {
    screens: z.array(StitchScreenSchema).parse(rawResponse.screens)
  };

  if (ctx.db.screens) {
    for (const screen of response.screens) {
      await ctx.db.screens.upsertByEntityId(screen.id, screen);
    }
  }

  await logEventFromContext(ctx, 'stitch.screens.edit', input, 'completed');

  return response;
};

export const generateVariants: StitchEndpoints['screensGenerateVariants'] = async (ctx, input) => {
  const { projectId, selectedScreenIds, prompt, variantOptions } = input;
  const rawResponse = await makeStitchRequest<any>(
    `projects/${projectId}/screens:generateVariants`,
    ctx.key,
    { method: 'POST', body: { selectedScreenIds, prompt, variantOptions } }
  );

  const response = {
    variants: z.array(StitchScreenSchema).parse(rawResponse.variants)
  };

  if (ctx.db.screens) {
    for (const screen of response.variants) {
      await ctx.db.screens.upsertByEntityId(screen.id, screen);
    }
  }

  await logEventFromContext(ctx, 'stitch.screens.generateVariants', input, 'completed');

  return response;
};
