import { logEventFromContext } from 'corsair/core';
import type { ZohoBiginEndpoints } from '..';
import type { ZohoBiginEndpointOutputs } from './types';
import { makeZohoBiginRequest } from '../client';

export const getModuleMetadata: ZohoBiginEndpoints['getModuleMetadata'] = async (ctx, input) => {
    const { module } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getModuleMetadata']>(
        `settings/modules/${module}`,
        ctx.key,
        { method: 'GET' },
    );

    await logEventFromContext(ctx, 'zohobigin.metadata.getModule', { module }, 'completed');
    return response;
};

export const getFields: ZohoBiginEndpoints['getFields'] = async (ctx, input) => {
    const { module } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getFields']>(
        'settings/fields',
        ctx.key,
        {
            method: 'GET',
            query: { module },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.metadata.getFields', { module }, 'completed');
    return response;
};

export const getLayouts: ZohoBiginEndpoints['getLayouts'] = async (ctx, input) => {
    const { module } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getLayouts']>(
        'settings/layouts',
        ctx.key,
        {
            method: 'GET',
            query: { module },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.metadata.getLayouts', { module }, 'completed');
    return response;
};

export const getLayout: ZohoBiginEndpoints['getLayout'] = async (ctx, input) => {
    const { module, layoutId } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getLayout']>(
        `settings/layouts/${layoutId}`,
        ctx.key,
        {
            method: 'GET',
            query: { module },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.metadata.getLayout', { module, layoutId }, 'completed');
    return response;
};

export const getCustomViews: ZohoBiginEndpoints['getCustomViews'] = async (ctx, input) => {
    const { module } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getCustomViews']>(
        'settings/custom_views',
        ctx.key,
        {
            method: 'GET',
            query: { module },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.metadata.getCustomViews', { module }, 'completed');
    return response;
};

export const getCustomView: ZohoBiginEndpoints['getCustomView'] = async (ctx, input) => {
    const { module, viewId } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getCustomView']>(
        `settings/custom_views/${viewId}`,
        ctx.key,
        {
            method: 'GET',
            query: { module },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.metadata.getCustomView', { module, viewId }, 'completed');
    return response;
};

export const getModules: ZohoBiginEndpoints['getModules'] = async (ctx) => {
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getModules']>(
        'settings/modules',
        ctx.key,
        { method: 'GET' },
    );

    await logEventFromContext(ctx, 'zohobigin.metadata.getModules', {}, 'completed');
    return response;
};

export const getRelatedListsMetadata: ZohoBiginEndpoints['getRelatedListsMetadata'] = async (ctx, input) => {
    const { module } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getRelatedListsMetadata']>(
        'settings/related_lists',
        ctx.key,
        {
            method: 'GET',
            query: { module },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.metadata.getRelatedLists', { module }, 'completed');
    return response;
};