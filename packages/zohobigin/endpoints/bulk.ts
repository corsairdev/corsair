import { logEventFromContext } from 'corsair/core';
import type { ZohoBiginEndpoints } from '..';
import type { ZohoBiginEndpointOutputs } from './types';
import { makeZohoBiginRequest } from '../client';

export const createBulkReadJob: ZohoBiginEndpoints['createBulkReadJob'] = async (ctx, input) => {
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['createBulkReadJob']>(
        'read',
        ctx.key,
        {
            method: 'POST',
            body: input,
        },
    );

    await logEventFromContext(ctx, 'zohobigin.bulk.createReadJob', {}, 'completed');
    return response;
};

export const downloadBulkReadResult: ZohoBiginEndpoints['downloadBulkReadResult'] = async (ctx, input) => {
    const { jobId } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['downloadBulkReadResult']>(
        `read/${jobId}/result`,
        ctx.key,
        { method: 'GET' },
    );

    await logEventFromContext(ctx, 'zohobigin.bulk.downloadReadResult', { jobId }, 'completed');
    return response;
};

export const getBulkReadJobStatus: ZohoBiginEndpoints['getBulkReadJobStatus'] = async (ctx, input) => {
    const { jobId } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getBulkReadJobStatus']>(
        `read/${jobId}`,
        ctx.key,
        { method: 'GET' },
    );

    await logEventFromContext(ctx, 'zohobigin.bulk.getReadJobStatus', { jobId }, 'completed');
    return response;
};