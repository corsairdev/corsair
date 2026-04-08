import type { StitchEndpoints } from '..';
import { makeStitchRequest } from '../client';
import type { StitchEndpointOutputs } from './types';

export const list: StitchEndpoints['screensList'] = async (ctx, input) => {
  const response = await makeStitchRequest<StitchEndpointOutputs['screensList']>(
    `projects/${input.projectId}/screens`,
    ctx.key,
    { method: 'GET' }
  );

  if (ctx.db.screens) {
    for (const screen of response) {
      await ctx.db.screens.upsertByEntityId(screen.id, screen);
    }
  }

  return response;
};

export const get: StitchEndpoints['screensGet'] = async (ctx, input) => {
  const response = await makeStitchRequest<StitchEndpointOutputs['screensGet']>(
    `projects/${input.projectId}/screens/${input.screenId}`,
    ctx.key,
    { method: 'GET' }
  );

  if (ctx.db.screens) {
    await ctx.db.screens.upsertByEntityId(response.id, response);
  }

  return response;
};

export const edit: StitchEndpoints['screensEdit'] = async (ctx, input) => {
  const { projectId, selectedScreenIds, prompt, deviceType, modelId } = input;
  const response = await makeStitchRequest<StitchEndpointOutputs['screensEdit']>(
    `projects/${projectId}/screens:edit`,
    ctx.key,
    { method: 'POST', body: { selectedScreenIds, prompt, deviceType, modelId } }
  );

  if (ctx.db.screens) {
    for (const screen of response.screens) {
      await ctx.db.screens.upsertByEntityId(screen.id, screen);
    }
  }

  return response;
};

export const generateVariants: StitchEndpoints['screensGenerateVariants'] = async (ctx, input) => {
  const { projectId, selectedScreenIds, prompt, variantOptions } = input;
  const response = await makeStitchRequest<StitchEndpointOutputs['screensGenerateVariants']>(
    `projects/${projectId}/screens:generateVariants`,
    ctx.key,
    { method: 'POST', body: { selectedScreenIds, prompt, variantOptions } }
  );

  if (ctx.db.screens) {
    for (const screen of response.variants) {
      await ctx.db.screens.upsertByEntityId(screen.id, screen);
    }
  }

  return response;
};
