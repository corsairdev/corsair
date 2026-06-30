import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints, InstagramBoundEndpoints } from "../index"
import type { InstagramEndpointOutputs } from "./types"
import { GetFacebookPages } from "./metaDataEndpoints"
import type { FacebookPageSchema } from "../schema/database";


export const get: InstagramEndpoints['GetMessage'] = async (ctx, input) => {

    const result = await makeAuthenticatedInstagramRequest<InstagramEndpointOutputs['GetMessage']>
        (`/${input.message_id}`, ctx, {
            method: 'GET',
            query: {
                fields: input.q
            }
        },
            async (userToken) => {
                const key = userToken ?? ctx.key;
                const res: FacebookPageSchema = await GetFacebookPages(key, 'access_token', input.page_id);
                if (!res.access_token) {
                    throw new Error(`No page access token found for page`);
                }
                return res.access_token;
            } 
    );

    if (result.id) {
        try {
            await ctx.db.messages.upsertByEntityId(result.id, {
                messageId: result.id,
                senderId: result.from?.id,
                senderName: result.from?.username,
                message: result.message
            });
        } catch (err) {
            console.warn('faild to save messages into database', err);
        }
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

    const body: Record<string, unknown> = {
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
            body
        },
            async (userToken) => {
                const key = userToken ?? ctx.key;
                const res: FacebookPageSchema = await GetFacebookPages(key, 'access_token', input.page_id);
                if (!res.access_token) {
                    throw new Error(`No page access token found for page`);
                }
                return res.access_token;
            }
        );

    await logEventFromContext(
        ctx,
        'instagram.messages.send',
        { ...input },
        'completed'
    )

    return result;
}
