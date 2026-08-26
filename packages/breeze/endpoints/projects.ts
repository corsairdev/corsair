import { logEventFromContext } from 'corsair/core';
import type { BreezeEndpoints } from '..';
import type { BreezeEndpointOutputs } from './types';
import { makeBreezeRequest } from '../client';

export const getProjects: BreezeEndpoints['getProjects'] = async (ctx) => {
    const response = await makeBreezeRequest<BreezeEndpointOutputs['getProjects']>(
        'projects.json',
        ctx.key,
        { method: 'GET' },
    );

    await logEventFromContext(ctx, 'breeze.projects.get', {}, 'completed');
    return response;
};