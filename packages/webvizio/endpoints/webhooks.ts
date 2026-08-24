import { logEventFromContext } from 'corsair/core';
import { makeWebvizioRequest } from '../client';
import type { WebvizioEndpoints } from '../index';

export const list: WebvizioEndpoints['webhooksList'] = async (ctx, input) => {
        const result = await makeWebvizioRequest<unknown[]>(
                '/webhook',
                ctx.key,
                {
                        baseUrl: 'https://app.webvizio.com/api/v1',
                },
        );

        await logEventFromContext(
                ctx,
                'webvizio.webhooks.list',
                { ...input },
                'completed',
        );

        return result as WebvizioEndpoints['webhooksList'] extends (
                ctx: infer _,
                input: infer _,
        ) => Promise<infer R>
                ? R

: never;
};
