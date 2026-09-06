import { logEventFromContext } from 'corsair/core';
import type { ZohoBiginEndpoints } from '..';
import type { ZohoBiginEndpointOutputs } from './types';
import { makeZohoBiginRequest } from '../client';

export const addRecords: ZohoBiginEndpoints['addRecords'] = async (ctx, input) => {
    const { module, data, trigger } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['addRecords']>(
        `${module}`,
        ctx.key,
        {
            method: 'POST',
            body: { data, trigger },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.records.add', { module }, 'completed');
    return response;
};

export const getRecords: ZohoBiginEndpoints['getRecords'] = async (ctx, input) => {
    const { module, ...query } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getRecords']>(
        `${module}`,
        ctx.key,
        {
            method: 'GET',
            query: query as Record<string, string | number | boolean | undefined>,
        },
    );

    await logEventFromContext(ctx, 'zohobigin.records.get', { module }, 'completed');
    return response;
};

export const getRecord: ZohoBiginEndpoints['getRecord'] = async (ctx, input) => {
    const { module, id } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getRecord']>(
        `${module}/${id}`,
        ctx.key,
        { method: 'GET' },
    );

    await logEventFromContext(ctx, 'zohobigin.records.getRecord', { module, id }, 'completed');
    return response;
};

export const updateRecord: ZohoBiginEndpoints['updateRecord'] = async (ctx, input) => {
    const { module, id, data } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['updateRecord']>(
        `${module}/${id}`,
        ctx.key,
        {
            method: 'PUT',
            body: { data: [data] },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.records.updateRecord', { module, id }, 'completed');
    return response;
};

export const updateRecords: ZohoBiginEndpoints['updateRecords'] = async (ctx, input) => {
    const { module, data } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['updateRecords']>(
        `${module}`,
        ctx.key,
        {
            method: 'PUT',
            body: { data },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.records.update', { module }, 'completed');
    return response;
};

export const deleteRecord: ZohoBiginEndpoints['deleteRecord'] = async (ctx, input) => {
    const { module, id } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['deleteRecord']>(
        `${module}/${id}`,
        ctx.key,
        { method: 'DELETE' },
    );

    await logEventFromContext(ctx, 'zohobigin.records.deleteRecord', { module, id }, 'completed');
    return response;
};

export const deleteRecords: ZohoBiginEndpoints['deleteRecords'] = async (ctx, input) => {
    const { module, ids } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['deleteRecords']>(
        `${module}`,
        ctx.key,
        {
            method: 'DELETE',
            query: { ids: ids.join(',') },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.records.delete', { module, ids }, 'completed');
    return response;
};

export const deleteRecordPhoto: ZohoBiginEndpoints['deleteRecordPhoto'] = async (ctx, input) => {
    const { module, id } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['deleteRecordPhoto']>(
        `${module}/${id}/photo`,
        ctx.key,
        { method: 'DELETE' },
    );

    await logEventFromContext(ctx, 'zohobigin.records.deletePhoto', { module, id }, 'completed');
    return response;
};

export const downloadRecordPhoto: ZohoBiginEndpoints['downloadRecordPhoto'] = async (ctx, input) => {
    const { module, id } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['downloadRecordPhoto']>(
        `${module}/${id}/photo`,
        ctx.key,
        { method: 'GET' },
    );

    await logEventFromContext(ctx, 'zohobigin.records.downloadPhoto', { module, id }, 'completed');
    return response;
};

export const getDeletedRecords: ZohoBiginEndpoints['getDeletedRecords'] = async (ctx, input) => {
    const { module, type, page, per_page } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getDeletedRecords']>(
        `${module}/deleted`,
        ctx.key,
        {
            method: 'GET',
            query: {
                type,
                page,
                per_page,
            },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.records.getDeleted', { module, type }, 'completed');
    return response;
};

export const getRecordsCount: ZohoBiginEndpoints['getRecordsCount'] = async (ctx, input) => {
    const { module, cvid } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getRecordsCount']>(
        `${module}/actions/count`,
        ctx.key,
        {
            method: 'GET',
            query: cvid ? { cvid } : undefined,
        },
    );

    await logEventFromContext(ctx, 'zohobigin.records.count', { module }, 'completed');
    return response;
};

export const searchRecords: ZohoBiginEndpoints['searchRecords'] = async (ctx, input) => {
    const { module, ...params } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['searchRecords']>(
        `${module}/search`,
        ctx.key,
        {
            method: 'GET',
            query: params as Record<string, string | number | boolean | undefined>,
        },
    );

    await logEventFromContext(ctx, 'zohobigin.records.search', { module }, 'completed');
    return response;
};

export const getRelatedRecords: ZohoBiginEndpoints['getRelatedRecords'] = async (ctx, input) => {
    const { module, recordId, relatedList, page, per_page, fields } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getRelatedRecords']>(
        `${module}/${recordId}/${relatedList}`,
        ctx.key,
        {
            method: 'GET',
            query: { page, per_page, fields },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.records.getRelated', { module, recordId, relatedList }, 'completed');
    return response;
};

export const getTeamPipelineRecords: ZohoBiginEndpoints['getTeamPipelineRecords'] = async (ctx, input) => {
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getTeamPipelineRecords']>(
        'Pipelines',
        ctx.key,
        {
            method: 'GET',
            query: input as Record<string, string | number | boolean | undefined>,
        },
    );

    await logEventFromContext(ctx, 'zohobigin.pipelines.getRecords', {}, 'completed');
    return response;
};

export const upsertRecords: ZohoBiginEndpoints['upsertRecords'] = async (ctx, input) => {
    const { module, data, duplicate_check_fields } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['upsertRecords']>(
        `${module}/upsert`,
        ctx.key,
        {
            method: 'POST',
            query: duplicate_check_fields ? { duplicate_check_fields: duplicate_check_fields.join(',') } : undefined,
            body: { data },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.records.upsert', { module }, 'completed');
    return response;
};

export const updateRelatedRecords: ZohoBiginEndpoints['updateRelatedRecords'] = async (ctx, input) => {
    const { module, recordId, relatedList, data } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['updateRelatedRecords']>(
        `${module}/${recordId}/${relatedList}`,
        ctx.key,
        {
            method: 'PUT',
            body: { data },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.records.updateRelated', { module, recordId, relatedList }, 'completed');
    return response;
};

export const uploadRecordPhoto: ZohoBiginEndpoints['uploadRecordPhoto'] = async (ctx, input) => {
    const { module, id, file } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['uploadRecordPhoto']>(
        `${module}/${id}/photo`,
        ctx.key,
        {
            method: 'POST',
            body: file,
        },
    );

    await logEventFromContext(ctx, 'zohobigin.records.uploadPhoto', { module, id }, 'completed');
    return response;
};