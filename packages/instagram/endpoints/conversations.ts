import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints, InstagramBoundEndpoints } from "../index"
import type { InstagramEndpointOutputs } from "./types"
import { GetFacebookPages } from "./metaDataEndpoints"
import type { FacebookPageSchema } from "../schema/database";

export const list: InstagramEndpoints['GetInstagramConversations'] = async (ctx, input) => {

    const res: FacebookPageSchema = await GetFacebookPages(ctx.key, 'access_token', input.page_id);

    const result = await makeAuthenticatedInstagramRequest<InstagramEndpointOutputs['GetInstagramConversations']>
        (`${input.page_id}/conversations`, ctx, {
            method: 'GET',
            query: {
                platform: 'instagram',
                access_token: res.access_token,
                fields: input.q
            }
        });

    if (result.data) {
        for (const con of result.data) {

            try {
                await ctx.db.conversations.upsertByEntityId(con.id, {
                    conversationId: con.id,
                    pageId: input.page_id
                })
            } catch (err) {
                console.warn('faild to save conversations into database', err);
            }
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

    const res: FacebookPageSchema = await GetFacebookPages(ctx.key, 'access_token', input.page_id);

    const result = await makeAuthenticatedInstagramRequest<InstagramEndpointOutputs['GetConversationMessages']>
        (`/${input.conversation_id}/messages`, ctx, {
            method: 'GET',
            query: {
                access_token: res.access_token,
                fields: input.q
            }
        });

    if (result.data) {
        for (const msg of result.data) {
            try {
                await ctx.db.messages.upsertByEntityId(msg.id, {
                    messageId: msg.id,
                    conversationId: input.conversation_id,
                    senderId: msg.from?.id,
                    senderName: msg.from?.username,
                    message: msg.message
                });
            } catch (err) {
                console.warn('faild to save conversations into database', err);
            }
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