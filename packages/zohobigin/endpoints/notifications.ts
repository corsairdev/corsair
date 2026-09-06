import { logEventFromContext } from 'corsair/core';
import type { ZohoBiginEndpoints } from '..';
import type { ZohoBiginEndpointOutputs } from './types';
import { makeZohoBiginRequest } from '../client';

export const disableNotifications: ZohoBiginEndpoints['disableNotifications'] = async (ctx, input) => {
    const { channel_ids } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['disableNotifications']>(
        'actions/watch',
        ctx.key,
        {
            method: 'PATCH',
            query: { channel_ids: channel_ids.join(',') },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.notifications.disable', { channel_ids }, 'completed');
    return response;
};

export const enableNotifications: ZohoBiginEndpoints['enableNotifications'] = async (ctx, input) => {
    const { watch } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['enableNotifications']>(
        'actions/watch',
        ctx.key,
        {
            method: 'POST',
            body: { watch },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.notifications.enable', {}, 'completed');
    return response;
};

export const getNotificationDetails: ZohoBiginEndpoints['getNotificationDetails'] = async (ctx, input) => {
    const { module, channel_id, page, per_page } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getNotificationDetails']>(
        'actions/watch',
        ctx.key,
        {
            method: 'GET',
            query: { module, channel_id, page, per_page },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.notifications.getDetails', { module }, 'completed');
    return response;
};

export const updateNotificationDetails: ZohoBiginEndpoints['updateNotificationDetails'] = async (ctx, input) => {
    const { watch } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['updateNotificationDetails']>(
        'actions/watch',
        ctx.key,
        {
            method: 'PUT',
            body: { watch },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.notifications.updateDetails', {}, 'completed');
    return response;
};

export const updateNotificationInfo: ZohoBiginEndpoints['updateNotificationInfo'] = async (ctx, input) => {
    const { watch } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['updateNotificationInfo']>(
        'actions/watch',
        ctx.key,
        {
            method: 'PATCH',
            body: { watch },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.notifications.updateInfo', {}, 'completed');
    return response;
};