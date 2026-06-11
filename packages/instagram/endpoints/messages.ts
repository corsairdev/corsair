import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints, InstagramBoundEndpoints } from "../index"
import type { InstagramEndpointOutputs } from "./types"
import { GetFacebookPages } from "./metaDataEndpoints"
import type { FacebookPageSchema } from "../schema/database";


export const get: InstagramEndpoints['GetMessage'] = async (ctx, input) => {

    const res: FacebookPageSchema = await GetFacebookPages(ctx.key, 'access_token', input.page_id);

    const result = await makeAuthenticatedInstagramRequest<InstagramEndpointOutputs['GetMessage']>
        (`/${input.message_id}`, ctx, {
            method: 'GET',
            query: {
                access_token: res.access_token,
                fields: input.q
            }
        });

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

    const res: FacebookPageSchema = await GetFacebookPages(ctx.key, 'access_token', input.page_id);

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
                access_token: res.access_token,
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
