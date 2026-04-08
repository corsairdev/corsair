import type { StitchEndpoints } from '..';
import { makeStitchRequest } from '../client';
import type { StitchEndpointOutputs } from './types';

export const list: StitchEndpoints['projectsList'] = async (ctx, input) => {
  const response = await makeStitchRequest<StitchEndpointOutputs['projectsList']>(
    'projects',
    ctx.key,
    { method: 'GET', query: input.filter ? { filter: input.filter } : {} }
  );

  if (ctx.db.projects) {
    for (const project of response) {
      await ctx.db.projects.upsertByEntityId(project.id, project);
    }
  }

  return response;
};

export const get: StitchEndpoints['projectsGet'] = async (ctx, input) => {
  const response = await makeStitchRequest<StitchEndpointOutputs['projectsGet']>(
    `projects/${input.id}`,
    ctx.key,
    { method: 'GET' }
  );

  if (ctx.db.projects) {
    await ctx.db.projects.upsertByEntityId(response.id, response);
  }

  return response;
};

export const create: StitchEndpoints['projectsCreate'] = async (ctx, input) => {
  const response = await makeStitchRequest<StitchEndpointOutputs['projectsCreate']>(
    'projects',
    ctx.key,
    { method: 'POST', body: input }
  );

  if (ctx.db.projects) {
    await ctx.db.projects.upsertByEntityId(response.id, response);
  }

  return response;
};

export const generateScreen: StitchEndpoints['projectsGenerateScreen'] = async (ctx, input) => {
  const { projectId, prompt, deviceType, modelId } = input;
  const response = await makeStitchRequest<StitchEndpointOutputs['projectsGenerateScreen']>(
    `projects/${projectId}/screens:generate`,
    ctx.key,
    { method: 'POST', body: { prompt, deviceType, modelId } }
  );

  if (ctx.db.screens) {
    await ctx.db.screens.upsertByEntityId(response.screen.id, response.screen);
  }

  return response;
};
