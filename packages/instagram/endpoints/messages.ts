import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints, InstagramBoundEndpoints } from "../index"
import type { InstagramEndpointOutputs } from "./types"


export const get: InstagramEndpoints['GetMessage'] = async (ctx, input) => {

    const endpoints = ctx.endpoints as InstagramBoundEndpoints;

    await endpoints.profile.GetFacebookPages({});

    const page_access_token = await ctx.db.pages.findByEntityId(input.page_id);

    const result = await makeAuthenticatedInstagramRequest<InstagramEndpointOutputs['GetMessage']>
        (`/${input.message_id}`, ctx, {
            method: 'GET',
            query: {
                access_token: page_access_token?.data.access_token,
                fields: input.q
            }
        });

    if (result.id) {
        await ctx.db.messages.upsertByEntityId(result.id, {
            messageId: result.id,
            senderId: result.from?.id,
            senderName: result.from?.username,
            message: result.message
        });
    }

    await logEventFromContext(
        ctx,
        'instagram.messages.get',
        { ...input },
        'completed'
    )

    return result;
}

export const send: InstagramEndpoints['SendMessage'] = async (ctx, input) => {

    const endpoints = ctx.endpoints as InstagramBoundEndpoints;

    await endpoints.profile.GetFacebookPages({});

    const page_access_token = await ctx.db.pages.findByEntityId(input.page_id);

    if (!page_access_token) {
        throw new Error('Page access token not found for page_id');
    }

    if (input.messaging_type === 'MESSAGE_TAG' && !input.tag) {
        throw new Error(
            'tag is required when messaging_type is MESSAGE_TAG.'
        );
    }

    if (input.tag && input.messaging_type !== 'MESSAGE_TAG') {
        throw new Error(
            'messaging_type must be MESSAGE_TAG when tag is provided.'
        );
    }

    const body: Record<string, any> = {
        recipient: {
            id: input.recipient
        },
        message: input.message
    };

    if (input.messaging_type) {
        body.messaging_type = input.messaging_type;
    }

    if (input.tag) {
        body.tag = input.tag;
    }

    const result = await makeAuthenticatedInstagramRequest<InstagramEndpointOutputs['SendMessage']>
        (`/me/messages`, ctx, {
            method: 'POST',
            query: {
                access_token: page_access_token.data.access_token,
            },
            body
        });

    await logEventFromContext(
        ctx,
        'instagram.messages.send',
        { ...input },
        'completed'
    )

    return result;
}
