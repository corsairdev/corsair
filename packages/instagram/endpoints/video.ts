import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints, InstagramBoundEndpoints } from "../index"
import type { InstagramEndpointOutputs } from "./types"
import { poll } from './polling';

export const story: InstagramEndpoints['CreateVideoStoryContainer'] = async (ctx, input) => {

    const result = await makeAuthenticatedInstagramRequest<InstagramEndpointOutputs['CreateVideoStoryContainer']>
        (`/${input.ig_id}/media`, ctx, {
            method: 'POST',
            body: {
                video_url: input.video_url,
                media_type: input.media_type || 'STORIES',
                user_tags: input.user_tags?.length ? JSON.stringify(input.user_tags) : undefined,
            }
        });

    if (result.id) {
        const endpoints = ctx.endpoints as InstagramBoundEndpoints;
        const mediauploadResult = await poll(
            () => endpoints.media.status({
                container_id: result.id,
            }),

            response => {

                console.log(response);

                if (response.status_code === 'ERROR') {
                    throw new Error('Failed to process story');
                }

                return (response.status_code === 'FINISHED');
            },

            5000,
            1200000
        );

        await endpoints.publish.publish_media({
            ig_id: input.ig_id,
            creation_id: result.id
        });
    }

    await logEventFromContext(
        ctx,
        'instagram.image.story',
        { ...input },
        'completed'
    );

    return result;

}

export const createCarouselContainer: InstagramEndpoints['CreateVideoContainer'] = async (ctx, input) => {

    const result = await makeAuthenticatedInstagramRequest<InstagramEndpointOutputs['CreateVideoContainer']>
        (`/${input.ig_id}/media`, ctx, {
            method: 'POST',
            body: {
                media_type: input.media_type,
                video_url: input.video_url,
                is_carousel_item: input.is_carousel_item || true,
                caption: input.caption,
                alt_text: input.alt_text,
                location_id: input.location_id,
                user_tags: input.user_tags?.length ? JSON.stringify(input.user_tags) : undefined,
                product_tags: input.product_tags?.length ? JSON.stringify(input.product_tags) : undefined
            }
        });

    if (result.id) {

        const endpoints = ctx.endpoints as InstagramBoundEndpoints;

        await poll(
            () => endpoints.media.status({
                container_id: result.id
            }),

            response => {

                console.log(response);

                if (response.status_code === 'ERROR') {
                    throw new Error('Failed to process story');
                }

                return (response.status_code === 'FINISHED');
            },
            5000,
            1200000
        )
    }

    await logEventFromContext(
        ctx,
        'instagram.video.post',
        { ...input },
        'completed'
    )

    return result;
}