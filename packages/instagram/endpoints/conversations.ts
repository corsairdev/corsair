import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints, InstagramBoundEndpoints } from "../index"
import type { InstagramEndpointOutputs } from "./types"

export const list: InstagramEndpoints['GetInstagramConversations'] = async (ctx, input) => {

    const endpoints = ctx.endpoints as InstagramBoundEndpoints;

    await endpoints.profile.GetFacebookPages({});

    const page_access_token = await ctx.db.pages.findByEntityId(input.page_id);

    if(!page_access_token) {
        throw new Error('Page access token not found.');
    }

    const result = await makeAuthenticatedInstagramRequest<InstagramEndpointOutputs['GetInstagramConversations']>
    (`${input.page_id}/conversations`, ctx, {
        method: 'GET',
        query: {
            platform: 'instagram',
            access_token: page_access_token?.data.access_token,
            fields: input.q
        }
    });

    if(result.data) {
        for(const con of result.data) {
            await ctx.db.conversations.upsertByEntityId(con.id, {
                conversationId: con.id,
                pageId: input.page_id
            })
        }
    }

    await logEventFromContext(
        ctx,
        'instagram.conversations.list',
        { ...input },
        'completed'
    )

    return result;

}

export const get: InstagramEndpoints['GetConversationMessages'] = async (ctx, input) => {

    const endpoints = ctx.endpoints as InstagramBoundEndpoints;
    await endpoints.profile.GetFacebookPages({});
    const page_access_token = await ctx.db.pages.findByEntityId(input.page_id);

    if(!page_access_token) {
        throw new Error('Page access token not found.');
    }

    const result = await makeAuthenticatedInstagramRequest<InstagramEndpointOutputs['GetConversationMessages']>
    (`/${input.conversation_id}/messages`, ctx, {
        method: 'GET',
        query: {
            access_token: page_access_token?.data.access_token,
            fields: input.q
        }
    });

    if(result.data) {
        for(const msg of result.data) {
            await ctx.db.messages.upsertByEntityId(msg.id, {
                messageId: msg.id,
                conversationId: input.conversation_id,
                senderId: msg.from?.id,
                senderName: msg.from?.username,
                message: msg.message
            });
        }
    }

     await logEventFromContext(
        ctx,
        'instagram.conversations.get',
        { ...input },
        'completed'
    )

    return result;

}