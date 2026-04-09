/**
 * This file implements the Stitch project-related endpoints.
 * It handles listing, retrieving, and creating projects, as well as generating screens.
 *
 * Each endpoint includes runtime validation using Zod schemas and logs events for traceability.
 */

import { z } from 'zod';
import { logEventFromContext } from 'corsair/core';
import type { StitchEndpoints } from '..';
import { makeStitchRequest } from '../client';
import { StitchProjectSchema, StitchScreenSchema } from '../schema';
import type { StitchEndpointOutputs } from './types';

export const list: StitchEndpoints['projectsList'] = async (ctx, input) => {
  const rawResponse = await makeStitchRequest<unknown>(
    'projects',
    ctx.key,
    { method: 'GET', query: input.filter ? { filter: input.filter } : {} }
  );

  const response = z.array(StitchProjectSchema).parse(rawResponse);

  if (ctx.db.projects) {
    for (const project of response) {
      await ctx.db.projects.upsertByEntityId(project.id, project);
    }
  }

  await logEventFromContext(ctx, 'stitch.projects.list', input, 'completed');

  return response;
};

export const get: StitchEndpoints['projectsGet'] = async (ctx, input) => {
  const rawResponse = await makeStitchRequest<unknown>(
    `projects/${input.id}`,
    ctx.key,
    { method: 'GET' }
  );

  const response = StitchProjectSchema.parse(rawResponse);

  if (ctx.db.projects) {
    await ctx.db.projects.upsertByEntityId(response.id, response);
  }

  await logEventFromContext(ctx, 'stitch.projects.get', input, 'completed');

  return response;
};

export const create: StitchEndpoints['projectsCreate'] = async (ctx, input) => {
  const rawResponse = await makeStitchRequest<unknown>(
    'projects',
    ctx.key,
    { method: 'POST', body: input }
  );

  const response = StitchProjectSchema.parse(rawResponse);

  if (ctx.db.projects) {
    await ctx.db.projects.upsertByEntityId(response.id, response);
  }

  await logEventFromContext(ctx, 'stitch.projects.create', input, 'completed');

  return response;
};

export const generateScreen: StitchEndpoints['projectsGenerateScreen'] = async (ctx, input) => {
  const { projectId, prompt, deviceType, modelId } = input;
  const rawResponse = await makeStitchRequest<any>(
    `projects/${projectId}/screens:generate`,
    ctx.key,
    { method: 'POST', body: { prompt, deviceType, modelId } }
  );

  const response = {
    screen: StitchScreenSchema.parse(rawResponse.screen),
    output_components: rawResponse.output_components,
  };

  if (ctx.db.screens) {
    await ctx.db.screens.upsertByEntityId(response.screen.id, response.screen);
  }

  await logEventFromContext(ctx, 'stitch.projects.generateScreen', input, 'completed');

  return response;
};
