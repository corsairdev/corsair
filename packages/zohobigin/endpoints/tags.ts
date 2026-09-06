import { logEventFromContext } from 'corsair/core';
import type { ZohoBiginEndpoints } from '..';
import type { ZohoBiginEndpointOutputs } from './types';
import { makeZohoBiginRequest } from '../client';

export const createTags: ZohoBiginEndpoints['createTags'] = async (ctx, input) => {
    const { module, tags } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['createTags']>(
        'settings/tags',
        ctx.key,
        {
            method: 'POST',
            query: { module },
            body: { tags },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.tags.create', { module }, 'completed');
    return response;
};

export const addTagsToRecords: ZohoBiginEndpoints['addTagsToRecords'] = async (ctx, input) => {
    const { module, recordId, tags, overWrite } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['addTagsToRecords']>(
        `${module}/${recordId}/actions/add_tags`,
        ctx.key,
        {
            method: 'POST',
            query: overWrite !== undefined ? { over_write: overWrite } : undefined,
            body: { tags },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.tags.addToRecords', { module, recordId }, 'completed');
    return response;
};

export const delinkRelatedRecords: ZohoBiginEndpoints['delinkRelatedRecords'] = async (ctx, input) => {
    const { module, recordId, relatedList, relatedRecordId } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['delinkRelatedRecords']>(
        `${module}/${recordId}/${relatedList}/${relatedRecordId}`,
        ctx.key,
        { method: 'DELETE' },
    );

    await logEventFromContext(ctx, 'zohobigin.related.delink', { module, recordId, relatedList, relatedRecordId }, 'completed');
    return response;
};