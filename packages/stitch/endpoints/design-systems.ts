import type { StitchEndpoints } from '..';
import { makeStitchRequest } from '../client';
import type { StitchEndpointOutputs } from './types';

export const create: StitchEndpoints['designSystemsCreate'] = async (ctx, input) => {
  const response = await makeStitchRequest<StitchEndpointOutputs['designSystemsCreate']>(
    'assets',
    ctx.key,
    { method: 'POST', body: input }
  );

  if (ctx.db.designSystems) {
    await ctx.db.designSystems.upsertByEntityId(response.id, response);
  }

  return response;
};

export const update: StitchEndpoints['designSystemsUpdate'] = async (ctx, input) => {
  const response = await makeStitchRequest<StitchEndpointOutputs['designSystemsUpdate']>(
    `assets/${input.assetId}`,
    ctx.key,
    { method: 'PATCH', body: { projectId: input.projectId, designSystem: input.designSystem } }
  );

  if (ctx.db.designSystems) {
    await ctx.db.designSystems.upsertByEntityId(response.id, response);
  }

  return response;
};

export const apply: StitchEndpoints['designSystemsApply'] = async (ctx, input) => {
  const response = await makeStitchRequest<StitchEndpointOutputs['designSystemsApply']>(
    `projects/${input.projectId}/screens:applyDesignSystem`,
    ctx.key,
    { method: 'POST', body: { assetId: input.assetId, selectedScreenInstances: input.selectedScreenInstances } }
  );

  return response;
};
