import { logEventFromContext } from 'corsair/core';
import type { ZohoBiginEndpoints } from '..';
import type { ZohoBiginEndpointOutputs } from './types';
import { makeZohoBiginRequest } from '../client';

export const getUsers: ZohoBiginEndpoints['getUsers'] = async (ctx, input) => {
    const { type, page, per_page } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getUsers']>(
        'users',
        ctx.key,
        {
            method: 'GET',
            query: { type, page, per_page },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.users.getUsers', { type }, 'completed');
    return response;
};

export const getUser: ZohoBiginEndpoints['getUser'] = async (ctx, input) => {
    const { id } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getUser']>(
        `users/${id}`,
        ctx.key,
        { method: 'GET' },
    );

    await logEventFromContext(ctx, 'zohobigin.users.getUser', { id }, 'completed');
    return response;
};

export const getRoles: ZohoBiginEndpoints['getRoles'] = async (ctx) => {
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getRoles']>(
        'settings/roles',
        ctx.key,
        { method: 'GET' },
    );

    await logEventFromContext(ctx, 'zohobigin.users.getRoles', {}, 'completed');
    return response;
};

export const getProfiles: ZohoBiginEndpoints['getProfiles'] = async (ctx) => {
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getProfiles']>(
        'settings/profiles',
        ctx.key,
        { method: 'GET' },
    );

    await logEventFromContext(ctx, 'zohobigin.users.getProfiles', {}, 'completed');
    return response;
};

export const getOrganization: ZohoBiginEndpoints['getOrganization'] = async (ctx) => {
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['getOrganization']>(
        'org',
        ctx.key,
        { method: 'GET' },
    );

    await logEventFromContext(ctx, 'zohobigin.org.get', {}, 'completed');
    return response;
};

export const updateUser: ZohoBiginEndpoints['updateUser'] = async (ctx, input) => {
    const { id, data } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['updateUser']>(
        `users/${id}`,
        ctx.key,
        {
            method: 'PUT',
            body: { users: [data] },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.users.updateUser', { id }, 'completed');
    return response;
};

export const updateUsers: ZohoBiginEndpoints['updateUsers'] = async (ctx, input) => {
    const { users } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['updateUsers']>(
        'users',
        ctx.key,
        {
            method: 'PUT',
            body: { users },
        },
    );

    await logEventFromContext(ctx, 'zohobigin.users.updateUsers', {}, 'completed');
    return response;
};

export const uploadOrganizationPhoto: ZohoBiginEndpoints['uploadOrganizationPhoto'] = async (ctx, input) => {
    const { file } = input;
    const response = await makeZohoBiginRequest<ZohoBiginEndpointOutputs['uploadOrganizationPhoto']>(
        'org/photo',
        ctx.key,
        {
            method: 'POST',
            body: file,
        },
    );

    await logEventFromContext(ctx, 'zohobigin.org.uploadPhoto', {}, 'completed');
    return response;
};