import { logEventFromContext } from 'corsair/core';
import type { InstagramWebhooks } from '../index';
import { createInstagramWebhookMatcher } from './types';

const META_VERIFY_TOKEN = 'corsair';

export const url_verification: InstagramWebhooks['url_verification'] = {
    match: createInstagramWebhookMatcher('url_verification'),
    handler: async (ctx, request) => {

        const body = request.payload;

        if (!body) {

            return {
                success: false,
                data: undefined,
            };
        }

        if (
            body.mode === 'subscribe' &&
            body.verify_token === META_VERIFY_TOKEN
        ) {

            await logEventFromContext(
                ctx,
                'instagram.webhook.url_verification',
                { ...body },
                'completed'
            )

            return {
                success: true,
                returnToSender: {
                    challenge: body.challenge,
                },
                data: {
                    type: body.type,
                    challenge: body.challenge,
                },
            };
        }

        return {
            success: false,
            error: 'Invalid verification token',
        };
    },
};