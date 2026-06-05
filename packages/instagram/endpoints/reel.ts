import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints, InstagramBoundEndpoints } from "../index"
import type { InstagramEndpointOutputs } from "./types"
import { poll } from './polling';

export const post: InstagramEndpoints['CreateReelContainer'] = async (ctx, input) => {

    const result =  await makeAuthenticatedInstagramRequest<InstagramEndpointOutputs['CreateReelContainer']>
        (`/${input.ig_id}/media`, ctx, {
            method: 'POST',
            body: {
                media_type: input.media_type,
                video_url: input.video_url,
                caption: input.caption,
                share_to_feed: input.share_to_feed,
                collaborators: input.collaborators?.length ? JSON.stringify(input.collaborators) : undefined,
                cover_url: input.cover_url,
                audio_name: input.audio_name,
                thumb_offset: input.thumb_offset,
                location_id: input.location_id,
                user_tags: input.user_tags?.length ? JSON.stringify(input.user_tags) : undefined,
                trial_params: input.trial_params
            }
        });

    if (result.id) {
        // console.log(result.id);
        const endpoints = ctx.endpoints as InstagramBoundEndpoints;

        const mediaStatus = await poll(
            () =>
                endpoints.media.status({
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
        );

        await endpoints.publish.publish_media({
            ig_id: input.ig_id,
            creation_id: result.id
        });
    }

    await logEventFromContext(
        ctx,
        'instagram.reel.post',
        { ...input },
        'completed'
    )

    return result;
}