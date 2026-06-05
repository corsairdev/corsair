import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints, InstagramBoundEndpoints } from "../index"
import type { InstagramEndpointOutputs } from "./types"
import { poll } from './polling';

export const post: InstagramEndpoints['CreateImageContainer'] = async (ctx, input) => {

    const result = await makeAuthenticatedInstagramRequest<InstagramEndpointOutputs['CreateImageContainer']>
        (`/${input.ig_id}/media`, ctx, {
            method: 'POST',
            body: {
                image_url: input.image_url,
                is_carousel_item: input.is_carousel_item,
                alt_text: input.alt_text,
                caption: input.caption,
                location_id: input.location_id,
                user_tags: input.user_tags
                    ? JSON.stringify(input.user_tags)
                    : undefined,
                product_tags: input.product_tags
                    ? JSON.stringify(input.product_tags)
                    : undefined,
            }
        });

    if (result.id) {
       
        // console.log(result.id);
        const endpoints = ctx.endpoints as InstagramBoundEndpoints;

        await poll(
            () => endpoints.media.status({
                container_id: result.id
            }),

            response => {
                if (response.status_code === 'ERROR') {
                    throw new Error(
                        'Instagram processing failed'
                    );
                }

                return (
                    response.status_code ===
                    'FINISHED'
                );
            },
            5000,
            120000
        )

        
        await endpoints.publish.publish_media({
            ig_id: input.ig_id,
            creation_id: result.id
        });
    }
    

    await logEventFromContext(
        ctx,
        'instagram.image.post',
        { ...input },
        'completed'
    )

    return result;
}

export const story: InstagramEndpoints['CreateImageStoryContainer'] = async (ctx, input) => {

    const result = await makeAuthenticatedInstagramRequest<InstagramEndpointOutputs['CreateImageStoryContainer']>
    (`/${input.ig_id}/media`, ctx, {
        method: 'POST',
        body: {
            image_url: input.image_url,
            media_type: input.media_type || 'STORIES',
            user_tags: input.user_tags?.length ? JSON.stringify(input.user_tags) : undefined,
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
                    throw new Error('Failed to process story');
                }

                return (response.status_code === 'FINISHED');
             },

             5000,
             1200000
        )

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