import { logEventFromContext } from 'corsair/core';
import { makeWebvizioRequest } from '../client';
import type { WebvizioEndpoints } from '../index';

export const list: WebvizioEndpoints['projectsList'] = async (ctx, input) => {
        const result = await makeWebvizioRequest<unknown[]>(
                '/projects',
                ctx.key,
        );

        await logEventFromContext(
                ctx,
                'webvizio.projects.list',
                { ...input },
                'completed',
        );

        return result as WebvizioEndpoints['projectsList'] extends (
                ctx: infer _,
                input: infer _,
        ) => Promise<infer R>
                ? R
                : never;
};
