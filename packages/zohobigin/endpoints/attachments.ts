import { logEventFromContext } from 'corsair/core';
import type { ZohoBiginEndpoints } from '..';
import type { ZohoBiginEndpointOutputs } from './types';
import { makeZohoBiginRequest } from '../client';

export const deleteAttachment: ZohoBiginEndpoints['deleteAttachment'] = async (ctx, input) => {
    const { module, recordId, attachmentId } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['deleteAttachment']>(
        `${module}/${recordId}/Attachments/${attachmentId}`,
        ctx.key,
        { method: 'DELETE' },
    );

    await logEventFromContext(ctx, 'zohobigin.attachments.delete', { module, recordId, attachmentId }, 'completed');
    return response;
};

export const downloadAttachment: ZohoBiginEndpoints['downloadAttachment'] = async (ctx, input) => {
    const { module, recordId, attachmentId } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['downloadAttachment']>(
        `${module}/${recordId}/Attachments/${attachmentId}`,
        ctx.key,
        { method: 'GET' },
    );

    await logEventFromContext(ctx, 'zohobigin.attachments.download', { module, recordId, attachmentId }, 'completed');
    return response;
};

export const getAttachments: ZohoBiginEndpoints['getAttachments'] = async (ctx, input) => {
    const { module, recordId, page, per_page, fields } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getAttachments']>(
        `${module}/${recordId}/Attachments`,
        ctx.key,
        {
            method: 'GET',
            query: { page, per_page, fields },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.attachments.get', { module, recordId }, 'completed');
    return response;
};

export const uploadAttachment: ZohoBiginEndpoints['uploadAttachment'] = async (ctx, input) => {
    const { module, recordId, attachment_url } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['uploadAttachment']>(
        `${module}/${recordId}/Attachments`,
        ctx.key,
        {
            method: 'POST',
            query: attachment_url ? { attachmentUrl: attachment_url } : undefined,
        },
    );

    await logEventFromContext(ctx, 'zohobigin.attachments.upload', { module, recordId }, 'completed');
    return response;
};