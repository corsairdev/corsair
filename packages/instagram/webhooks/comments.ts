import { logEventFromContext } from 'corsair/core';
import type { InstagramWebhooks } from '../index';
import { createInstagramWebhookMatcher } from './types';
import { verifyInstagramWebhookSignature } from "./types";

export const comments: InstagramWebhooks['comments'] = {
    match: createInstagramWebhookMatcher('comments'),
    handler: async (ctx, request) => {

        const credentials = await ctx.keys.get_integration_credentials();
        const appSecret = credentials.client_secret;

        const verification = verifyInstagramWebhookSignature(request, appSecret);
        
        if (!verification.valid)
            return {
                success: false,
                statusCode: 401,
                error: verification.error || 'Signature verification failed',
            };

        const body = request.payload;
        const change = body.entry[0]?.changes[0];

        if (!body || !change || !body.entry[0]) {
            return {
                success: false,
                data: undefined,
            };
        }

        try {
            if (body.entry[0]) {
                await ctx.db.comments.upsertByEntityId(change?.value.media.id, {
                    id: change.value.media.id,
                    text: change.value.text,
                    timestamp: new Date(body.entry[0].time * 1000).toISOString(),
                    username: change.value.from.username
                });
            }

        } catch (err) {
            console.warn('failed to save comments event into database', err);
        }

        logEventFromContext(
            ctx,
            'instagram.webhook.comments',
            { ...body },
            'completed'
        )

        return {
            success: true,
            data: {
                type: 'comments',
                CommentsOutputSchema: {
                    id: change.value.comment_id ?? change.value.media.id,
                    text: change.value.text,
                    timestamp: new Date(body.entry[0].time * 1000).toISOString(),
                    username: change.value.from.username,
                }
            }
        };

    }
}