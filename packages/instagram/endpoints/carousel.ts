import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints, InstagramBoundEndpoints } from "../index"
import type { InstagramEndpointOutputs } from "./types"
import { poll } from './polling';

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

    if(result.id) {

        const endpoints = ctx.endpoints as InstagramBoundEndpoints;

        await poll(
            () => endpoints.media.status({
                container_id: result.id,
            }),

            response => {
                if(response.status_code === 'ERROR') {
                    throw new Error('Failed to process with carousel');
                }

                return (
                    response.status_code === 'FINISHED'
                );
            },

            5000,
            120000
        );

        await endpoints.publish.publish_media({
            ig_id: input.ig_id,
            creation_id: result.id
        });
    }

    await logEventFromContext(
        ctx,
        'instagram.carousel.post',
        { ...input },
        'completed'
    );

    return result;
}