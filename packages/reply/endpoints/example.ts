import type { ReplyEndpoints } from '..';
import type { ReplyEndpointOutputs } from './types';
import { makeReplyRequest } from '../client';

export const createPersonalList: ReplyEndpoints['createPersonalList'] = async (
    ctx,
    input,
) => {
    const response = await makeReplyRequest<
        ReplyEndpointOutputs['createPersonalList']
    >('v3/contact-lists', ctx.key, {
        method: 'POST',
        body: {
            name: input.name,
            isShared: input.isShared ?? false,
        },
    });

    return response;
};