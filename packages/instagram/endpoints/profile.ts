import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints, InstagramBoundEndpoints } from "../index"
import type { InstagramEndpointOutputs } from "./types"

export const facebookProfile: InstagramEndpoints['GetFacebookUser'] = async (ctx, input) => {

    const result = await makeAuthenticatedInstagramRequest
        <InstagramEndpointOutputs['GetFacebookUser']>
        (`/${input.id || 'me'}`, ctx, {
            method: 'GET',
        });

    if (result && ctx.db.facebook) {
        try {
            const res = await ctx.db.facebook.upsertByEntityId(result.id, {
                ...result
            });
        } catch (err) {
            console.warn('error to get facebook account details');
        }
    }

    await logEventFromContext(
        ctx,
        'instagram.profile.facebookProfile',
        { ...input },
        'completed'
    )

    return result;
}

export const getFacebookPages: InstagramEndpoints['GetFacebookPages'] = async (ctx, input) => {

    const result = await makeAuthenticatedInstagramRequest<InstagramEndpointOutputs['GetFacebookPages']>
        (`/me/accounts`, ctx, {
            method: 'GET',
            query: {
                fields: input.q
            }
        });


    if (result.data) {
        // 1. find facebook id
        const endpoints = ctx.endpoints as InstagramBoundEndpoints;
        const fbId = await endpoints.profile.GetFacebookUser({});

        // 2. store pages into DB 

        for (const page of result.data) {
            try {
                const res = await ctx.db.pages.upsertByEntityId(page.id, {
                    facebookId: fbId.id,
                    access_token: page.access_token,
                    id: page.id, // page_id
                    name: page.name
                });
            } catch (err) {
                console.warn('error to get facebook pages details');
            }
        }
    }

    await logEventFromContext(
        ctx,
        'instagram.profile.getFacebookPages',
        { ...input },
        'completed'
    )

    return result;
}

export const getInstagramUser: InstagramEndpoints['GetInstagramUser'] = async (ctx, input) => {

    const result = await makeAuthenticatedInstagramRequest<InstagramEndpointOutputs['GetInstagramUser']>
        (`/${input.ig_id}`, ctx, {
            method: 'GET',
            query: {
                fields: input.q
            }
        });

    // console.log(result);

    if (result && ctx.db.users) {
        try {
            const res = await ctx.db.users.upsertByEntityId(input.ig_id, {
                ...result
            });

        } catch(err) {
            console.warn('error to get instagram account details');
        }
    }

    await logEventFromContext(
        ctx,
        'instagram.profile.getInstagramUser',
        { ...input },
        'completed'
    )

    return result;
} 

export const insights: InstagramEndpoints['GetAccountInsights'] = async (ctx, input) => {

    const result = await makeAuthenticatedInstagramRequest<InstagramEndpointOutputs['GetAccountInsights']>
    (`/${input.ig_id}/insights`, ctx, {
        method: 'GET',
        query: {
            metric: input.metric,
            period: input.period,
            timeframe: input.timeframe,
            metric_type: input.metric_type,
            breakdown: input.breakdown,
            since: input.since,
            until: input.until
        }
    });

    await logEventFromContext(
        ctx,
        'instagram.profile.insights',
        { ...input },
        'completed'
    )

    return result;

}