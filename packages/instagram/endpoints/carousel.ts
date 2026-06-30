import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints, InstagramBoundEndpoints } from "../index"
import type { InstagramEndpointOutputs } from "./types"


export const post: InstagramEndpoints['CreateCarouselContainer'] = async (ctx, input) => {

    const result = await makeAuthenticatedInstagramRequest<InstagramEndpointOutputs['CreateCarouselContainer']>
    (`/${input.ig_id}/media`, ctx, {
        method: 'POST',
        body: {
            media_type: input.media_type,
            caption: input.caption,
            share_to_feed: input.share_to_feed,
            collaborators: input.collaborators?.length ? JSON.stringify(input.collaborators) : undefined,
            location_id: input.location_id,
            product_tags: input.product_tags?.length ? JSON.stringify(input.product_tags) : undefined,
            children: JSON.stringify(input.children)
        }
    });

    await logEventFromContext(
        ctx,
        'instagram.carousel.post',
        { ...input },
        'completed'
    );

    return result;
}