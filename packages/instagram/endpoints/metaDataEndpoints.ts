import type { FacebookPageSchema } from "../schema/database";
import { InstagramAPIError } from "../client";

const FACEBOOK_API_BASE = 'https://graph.facebook.com';
const META_API_VERSION = 'v25.0';

export const GetFacebookPages = async (
    accessToken: string,
    input: string,
    pageId: string
): Promise<FacebookPageSchema> => {

    const params = new URLSearchParams({
        fields: input,
        access_token: accessToken,
    });

    const response = await fetch(
        `${FACEBOOK_API_BASE}/${META_API_VERSION}/${pageId}?${params.toString()}`,
    );

    if (!response.ok) {
        // fetch().json() returns `any`; we inspect the known Graph API error shape defensively.
        const errorBody = await response.json() as { error?: { message?: string; code?: number } };
        throw new InstagramAPIError(
            errorBody?.error?.message ?? 'Unknown error',
            errorBody?.error?.code
        );
    }

    // Facebook Graph API returns the page object matching the requested fields.
    // fetch().json() returns `any`; we assert the known FacebookPageSchema shape here.
    const result = await response.json() as FacebookPageSchema;
    return result;
};